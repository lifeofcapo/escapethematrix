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

export async function POST(req: NextRequest) { // CryptoCloud шлёт POST на этот URL когда платёж успешен
  let event: any;
  try {
    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      event = await req.json();
    } else {
      const formData = await req.formData();
      event = Object.fromEntries(formData.entries());
    }
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  console.log("CryptoCloud callback:", JSON.stringify(event));

  // CryptoCloud v2: status "success" when paid
  const status = event.status ?? event.invoice_status;
  if (status !== "success" && status !== "paid") {
    return NextResponse.json({ ok: true });
  }

  const invoiceId: string = event.invoice_id ?? event.uuid ?? "";
  const orderId: string = event.order_id ?? ""; // order_id already set as "web_{tgId}_{timestamp}"
  const tgIdMatch = orderId.match(/web_(\d+)_/);
  const tgId = tgIdMatch ? parseInt(tgIdMatch[1]) : null;
  const amountRub = parseFloat( // sum in rub (CryptoCloud returns amount_in_local_currency or amount)
    event.amount_in_local_currency ?? event.amount ?? "0"
  );

  if (!invoiceId || amountRub <= 0) {
    console.error("CryptoCloud callback: missing invoiceId or amount", event);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  if (!tgId) {
    console.warn("CryptoCloud callback: no tg_id in order_id:", orderId);
    return NextResponse.json({ ok: true }); // if dont know to whom top up
  }

  try {
    const db = getPool();
    const existing = await db.query(
      `SELECT id FROM payment_log WHERE payment_id = $1`,
      [invoiceId]
    );
    if (existing.rows.length > 0) {
      console.log("CryptoCloud callback: duplicate, skipping", invoiceId);
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

    console.log(`CryptoCloud: +${amountRub}₽ to user ${tgId}`);
  } catch (err) {
    console.error("DB error in CryptoCloud callback:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// CryptoCloud sometimes send GET for checking availability endpoint
export async function GET() {
  return NextResponse.json({ status: "ok", service: "escapethematrix" });
}