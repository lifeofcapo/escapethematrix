import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, unauthorizedResponse, getPool } from "../../../../../lib/admin-auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminToken(req))) return unauthorizedResponse();

  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });

  let body: { action?: string; amount?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const db = getPool();

  if (body.action === "add_balance") {
    const amount = parseFloat(String(body.amount ?? 0));
    if (isNaN(amount)) return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
    await db.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [amount, userId]);
    const { rows } = await db.query("SELECT balance FROM users WHERE id = $1", [userId]);
    return NextResponse.json({ success: true, balance: parseFloat(rows[0]?.balance ?? 0) });
  }

  if (body.action === "set_balance") {
    const amount = parseFloat(String(body.amount ?? 0));
    if (isNaN(amount)) return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
    await db.query("UPDATE users SET balance = $1 WHERE id = $2", [amount, userId]);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "unknown_action" }, { status: 400 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminToken(req))) return unauthorizedResponse();

  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });

  const db = getPool();
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "DELETE FROM expiry_notifications WHERE sub_id IN (SELECT id FROM subscriptions WHERE user_id = $1)",
      [userId]
    );
    await client.query("DELETE FROM payment_log WHERE tg_id = $1", [userId]);
    await client.query("DELETE FROM payments WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM subscriptions WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM support_tickets WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM users WHERE id = $1", [userId]);
    await client.query("COMMIT");
    return NextResponse.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Delete user error:", err);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  } finally {
    client.release();
  }
}