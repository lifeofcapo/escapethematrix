import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

let pool: Pool | null = null;
function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      max: 5,
    });
    pool.on("error", () => { pool = null; });
  }
  return pool;
}

export async function POST(req: NextRequest) {
  let event: any;
  try {
    event = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // только успешные 
  if (event.type !== "payment.succeeded") {
    return NextResponse.json({ ok: true });
  }

  const payment = event.object;
  const amountRub = parseFloat(payment?.amount?.value ?? "0");
  const paymentId = payment?.id;

  if (!paymentId || amountRub <= 0) {
    return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
  }

  // Определяем пользователя по metadata.tg_id если есть
  // Иначе — просто логируем (бот тоже слушает вебхуки ЮKassa и начислит баланс)
  const tgId = payment?.metadata?.tg_id ? parseInt(payment.metadata.tg_id) : null;

  if (tgId) {
    try {
      const db = getPool();
      // Проверяем что не дублируем начисление
      const existing = await db.query(
        `SELECT id FROM payment_log WHERE payment_id = $1`,
        [paymentId]
      );
      if (existing.rows.length > 0) {
        return NextResponse.json({ ok: true }); // уже обработано
      }

      await db.query(
        `UPDATE users SET balance = balance + $1 WHERE id = $2`,
        [amountRub, tgId]
      );

      await db.query(
        `INSERT INTO payment_log (payment_id, tg_id, amount, method, created_at)
         VALUES ($1, $2, $3, 'yookassa_web', NOW())
         ON CONFLICT (payment_id) DO NOTHING`,
        [paymentId, tgId, amountRub]
      );
    } catch (err) {
      console.error("DB error in YooKassa webhook:", err);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}