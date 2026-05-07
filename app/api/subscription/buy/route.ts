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

const INTERNAL_API_URL = process.env.INTERNAL_API_URL!;       // https://pay.escapethematrix.to
const INTERNAL_SECRET  = process.env.INTERNAL_SECRET!;         

export async function POST(req: NextRequest) {
  let body: { tg_id?: number; days?: number; amount?: number; region?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { tg_id, days, amount, region = "fi" } = body;

  if (!tg_id || !days || !amount || amount <= 0 || days <= 0) {
    return NextResponse.json({ error: "Missing or invalid parameters" }, { status: 400 });
  }

  const validRegion = region === "nl" ? "nl" : "fi";

  const db = getPool();

  let deducted = false;
  try {
    await db.query("BEGIN");

    const deductResult = await db.query(
      `UPDATE users SET balance = balance - $1
       WHERE id = $2 AND balance >= $1
       RETURNING id, balance`,
      [amount, tg_id]
    );

    if (deductResult.rows.length === 0) {
      await db.query("ROLLBACK");
      return NextResponse.json({ error: "Insufficient balance" }, { status: 402 });
    }

    const paymentId = `sub_web_${tg_id}_${Date.now()}`;
    await db.query(
      `INSERT INTO payment_log (payment_id, tg_id, amount, method, created_at)
       VALUES ($1, $2, $3, 'balance_sub', NOW())
       ON CONFLICT (payment_id) DO NOTHING`,
      [paymentId, tg_id, amount]
    );

    await db.query("COMMIT");
    deducted = true;
  } catch (err) {
    await db.query("ROLLBACK").catch(() => {});
    console.error("DB deduct error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  try {
    const botRes = await fetch(`${INTERNAL_API_URL}/internal/web-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": INTERNAL_SECRET,
      },
      body: JSON.stringify({ user_id: tg_id, days, amount, region: validRegion }),
      signal: AbortSignal.timeout(15000), // 15 сек таймаут
    });

    if (!botRes.ok) {
      const errText = await botRes.text().catch(() => "");
      console.error("Bot internal API error:", botRes.status, errText);

      if (deducted) {
        await db.query(
          `UPDATE users SET balance = balance + $1 WHERE id = $2`,
          [amount, tg_id]
        ).catch((e) => console.error("Balance rollback failed:", e));
      }

      return NextResponse.json({ error: "Subscription service unavailable" }, { status: 502 });
    }

    const data = await botRes.json();
    return NextResponse.json({ ok: true, ...data });

  } catch (err) {
    console.error("Bot fetch error:", err);

    if (deducted) {
      await db.query(
        `UPDATE users SET balance = balance + $1 WHERE id = $2`,
        [amount, tg_id]
      ).catch((e) => console.error("Balance rollback failed:", e));
    }

    return NextResponse.json({ error: "Subscription service unavailable" }, { status: 502 });
  }
}