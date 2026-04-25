import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { createHmac } from "crypto";

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

  // CryptoCloud v2 webhook: status "success" когда оплачено
  if (event.status !== "success") {
    return NextResponse.json({ ok: true });
  }

  const invoiceId: string = event.invoice_id ?? event.uuid ?? "";
  const amountRub = parseFloat(event.amount_crypto ?? event.amount ?? "0");
  // order_id мы задавали как "web_{timestamp}" — tg_id здесь нет напрямую
  // Для production нужно передавать tg_id в order_id: "web_{tgId}_{ts}"
  const orderId: string = event.order_id ?? "";
  const tgIdMatch = orderId.match(/web_(\d+)_/);
  const tgId = tgIdMatch ? parseInt(tgIdMatch[1]) : null;

  if (!invoiceId || amountRub <= 0) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  if (tgId) {
    try {
      const db = getPool();

      const existing = await db.query(
        `SELECT id FROM payment_log WHERE payment_id = $1`,
        [invoiceId]
      );
      if (existing.rows.length > 0) {
        return NextResponse.json({ ok: true });
      }

      await db.query(
        `UPDATE users SET balance = balance + $1 WHERE id = $2`,
        [amountRub, tgId]
      );

      await db.query(
        `INSERT INTO payment_log (payment_id, tg_id, amount, method, created_at)
         VALUES ($1, $2, $3, 'cryptocloud_web', NOW())
         ON CONFLICT (payment_id) DO NOTHING`,
        [invoiceId, tgId, amountRub]
      );
    } catch (err) {
      console.error("DB error in CryptoCloud webhook:", err);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}