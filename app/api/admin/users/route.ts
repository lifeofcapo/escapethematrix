import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, unauthorizedResponse, getPool } from "../../../../lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!(await verifyAdminToken(req))) return unauthorizedResponse();

  const db = getPool();
  const { rows } = await db.query(`
    SELECT
      u.id,
      u.username,
      u.full_name,
      u.language,
      u.balance,
      u.referred_by,
      u.created_at,
      s.id AS sub_id,
      s.plan,
      s.region,
      s.devices_limit,
      s.xui_email,
      s.started_at,
      s.expires_at,
      s.is_active
    FROM users u
    LEFT JOIN subscriptions s ON u.id = s.user_id AND s.is_active = TRUE
    ORDER BY u.created_at DESC
  `);

  // Group multiple active subs per user (shouldn't happen but just in case)
  const usersMap = new Map<number, any>();
  for (const row of rows) {
    if (!usersMap.has(row.id)) {
      usersMap.set(row.id, {
        id: row.id,
        username: row.username,
        full_name: row.full_name,
        language: row.language,
        balance: parseFloat(row.balance),
        referred_by: row.referred_by,
        created_at: row.created_at,
        subscriptions: [],
      });
    }
    if (row.sub_id) {
      usersMap.get(row.id).subscriptions.push({
        id: row.sub_id,
        plan: row.plan,
        region: row.region,
        devices_limit: row.devices_limit,
        xui_email: row.xui_email,
        started_at: row.started_at,
        expires_at: row.expires_at,
        is_active: row.is_active,
      });
    }
  }

  return NextResponse.json({ users: Array.from(usersMap.values()) });
}