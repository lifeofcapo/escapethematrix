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
  console.log("=== YOOKASSA WEBHOOK START ===");

  let event: any;
  try {
    event = await req.json();
  } catch (e) {
    console.error("Failed to parse webhook body:", e);
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  console.log("Webhook event type:", event.type);
  console.log("Webhook event object:", JSON.stringify(event.object));

  if (event.type !== "payment.succeeded") {
    console.log("Skipping event type:", event.type);
    return NextResponse.json({ ok: true });
  }

  const payment = event.object;
  const amountRub = parseFloat(payment?.amount?.value ?? "0");
  const paymentId = payment?.id;
  const tgIdRaw = payment?.metadata?.tg_id;

  console.log("Payment data:", { paymentId, amountRub, tgIdRaw, metadata: payment?.metadata });

  if (!paymentId || amountRub <= 0) {
    console.error("Invalid payment data:", { paymentId, amountRub });
    return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
  }

  const tgId = tgIdRaw ? parseInt(String(tgIdRaw)) : null;
  console.log("Parsed tgId:", tgId);

  if (!tgId) {
    console.warn("No tg_id in metadata, cannot credit balance");
    return NextResponse.json({ ok: true });
  }

  try {
    const db = getPool();
    console.log("DB pool created, DATABASE_URL exists:", !!process.env.DATABASE_URL);

    const existing = await db.query(
      `SELECT id FROM payment_log WHERE payment_id = $1`,
      [paymentId]
    );
    console.log("Duplicate check result:", existing.rows.length, "rows");

    if (existing.rows.length > 0) {
      console.log("Duplicate payment, skipping:", paymentId);
      return NextResponse.json({ ok: true });
    }

    const userCheck = await db.query(
      `SELECT id, balance FROM users WHERE id = $1`,
      [tgId]
    );
    console.log("User check:", userCheck.rows);

    if (userCheck.rows.length === 0) {
      console.error("User not found in DB:", tgId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateResult = await db.query(
      `UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING id, balance`,
      [amountRub, tgId]
    );
    console.log("Balance updated:", updateResult.rows);

    await db.query(
      `INSERT INTO payment_log (payment_id, tg_id, amount, method, created_at)
       VALUES ($1, $2, $3, 'yookassa_web', NOW())
       ON CONFLICT (payment_id) DO NOTHING`,
      [paymentId, tgId, amountRub]
    );
    console.log("Payment logged successfully");

  } catch (err) {
    console.error("DB error in YooKassa webhook:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  console.log("=== YOOKASSA WEBHOOK SUCCESS ===");
  return NextResponse.json({ ok: true });
}