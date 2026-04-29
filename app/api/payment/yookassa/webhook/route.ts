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
  } catch (e) {
    console.error("Failed to parse webhook body:", e);
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  // ЮKassa шлёт type="notification", статус платежа внутри event.object.status
  if (event.object?.status !== "succeeded") {
    return NextResponse.json({ ok: true });
  }

  const payment = event.object;
  const amountRub = parseFloat(payment?.amount?.value ?? "0");
  const paymentId = payment?.id;
  const tgIdRaw = payment?.metadata?.tg_id;
  if (!paymentId || amountRub <= 0) {
    return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
  }
  const tgId = tgIdRaw ? parseInt(String(tgIdRaw)) : null;

  if (!tgId) {
    return NextResponse.json({ ok: true });
  }

  try {
    const db = getPool();
    const existing = await db.query(
      `SELECT id FROM payment_log WHERE payment_id = $1`,
      [paymentId]
    );
    if (existing.rows.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const userCheck = await db.query(
      `SELECT id, balance FROM users WHERE id = $1`,
      [tgId]
    );
    if (userCheck.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateResult = await db.query(
      `UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING id, balance`,
      [amountRub, tgId]
    );
    await db.query(
      `INSERT INTO payment_log (payment_id, tg_id, amount, method, created_at)
       VALUES ($1, $2, $3, 'yookassa_web', NOW())
       ON CONFLICT (payment_id) DO NOTHING`,
      [paymentId, tgId, amountRub]
    );
  } catch (err) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}