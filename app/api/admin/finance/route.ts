import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, unauthorizedResponse, getPool } from "../../../../lib/admin-auth";

// GET - get financial summary
export async function GET(req: NextRequest) {
  if (!(await verifyAdminToken(req))) return unauthorizedResponse();

  const db = getPool();

  // Total paid payments
  const { rows: incomeRows } = await db.query(`
    SELECT 
      COALESCE(SUM(amount), 0) AS total_paid,
      COUNT(*) AS paid_count
    FROM payments WHERE status = 'paid'
  `);

  // Monthly paid
  const { rows: monthlyRows } = await db.query(`
    SELECT 
      DATE_TRUNC('month', paid_at) AS month,
      COALESCE(SUM(amount), 0) AS amount,
      COUNT(*) AS count
    FROM payments 
    WHERE status = 'paid' AND paid_at IS NOT NULL
    GROUP BY DATE_TRUNC('month', paid_at)
    ORDER BY month DESC
    LIMIT 12
  `);

  // Active subscriptions count
  const { rows: subRows } = await db.query(`
    SELECT COUNT(*) AS active_subs FROM subscriptions WHERE is_active = TRUE AND expires_at > NOW()
  `);

  // Users count
  const { rows: userRows } = await db.query(`SELECT COUNT(*) AS total_users FROM users`);

  return NextResponse.json({
    total_paid: parseFloat(incomeRows[0].total_paid),
    paid_count: parseInt(incomeRows[0].paid_count),
    active_subs: parseInt(subRows[0].active_subs),
    total_users: parseInt(userRows[0].total_users),
    monthly: monthlyRows.map((r) => ({
      month: r.month,
      amount: parseFloat(r.amount),
      count: parseInt(r.count),
    })),
  });
}

// POST - record a manual expense
export async function POST(req: NextRequest) {
  if (!(await verifyAdminToken(req))) return unauthorizedResponse();

  let body: { description?: string; amount?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { description, amount } = body;
  if (!description || !amount) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const db = getPool();
  
  // Store in payment_log as manual expense (negative amount)
  await db.query(
    `INSERT INTO payment_log (payment_id, tg_id, amount, method, created_at)
     VALUES ($1, NULL, $2, 'manual_expense', NOW())`,
    [`expense_${Date.now()}`, -Math.abs(amount)]
  );

  return NextResponse.json({ success: true });
}