import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, unauthorizedResponse, getPool } from "../../../../lib/admin-auth";

// GET - list all subscriptions (including inactive)
export async function GET(req: NextRequest) {
  if (!(await verifyAdminToken(req))) return unauthorizedResponse();

  const db = getPool();
  const { rows } = await db.query(`
    SELECT s.*, u.username, u.full_name
    FROM subscriptions s
    JOIN users u ON s.user_id = u.id
    ORDER BY s.expires_at DESC
  `);
  return NextResponse.json({ subscriptions: rows });
}

// POST - create subscription for user
export async function POST(req: NextRequest) {
  if (!(await verifyAdminToken(req))) return unauthorizedResponse();

  let body: {
    user_id?: number;
    plan?: string;
    days?: number;
    region?: string;
    devices_limit?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { user_id, plan = "1month", days = 30, region = "fi", devices_limit = 3 } = body;
  if (!user_id) return NextResponse.json({ error: "missing_user_id" }, { status: 400 });

  const db = getPool();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  const { rows } = await db.query(
    `INSERT INTO subscriptions (user_id, plan, region, devices_limit, started_at, expires_at, is_active)
     VALUES ($1, $2, $3, $4, NOW(), $5, TRUE)
     RETURNING *`,
    [user_id, plan, region, devices_limit, expiresAt]
  );

  return NextResponse.json({ success: true, subscription: rows[0] });
}