import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, unauthorizedResponse, getPool } from "../../../../../lib/admin-auth";

// PATCH - modify subscription (extend, change expires_at, deactivate)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminToken(req))) return unauthorizedResponse();

  const { id } = await params;
  const subId = parseInt(id, 10);
  if (isNaN(subId)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });

  let body: {
    action?: string;
    days?: number;
    expires_at?: string;
    is_active?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const db = getPool();

  if (body.action === "extend") {
    const days = parseInt(String(body.days ?? 30), 10);
    await db.query(
      `UPDATE subscriptions
       SET expires_at = GREATEST(expires_at, NOW()) + ($1 || ' days')::interval
       WHERE id = $2`,
      [days, subId]
    );
    const { rows } = await db.query("SELECT * FROM subscriptions WHERE id = $1", [subId]);
    return NextResponse.json({ success: true, subscription: rows[0] });
  }

  if (body.action === "set_expires") {
    const newDate = body.expires_at ? new Date(body.expires_at) : null;
    if (!newDate || isNaN(newDate.getTime()))
      return NextResponse.json({ error: "invalid_date" }, { status: 400 });
    await db.query("UPDATE subscriptions SET expires_at = $1 WHERE id = $2", [newDate, subId]);
    return NextResponse.json({ success: true });
  }

  if (body.action === "toggle_active") {
    await db.query(
      "UPDATE subscriptions SET is_active = NOT is_active WHERE id = $1",
      [subId]
    );
    const { rows } = await db.query("SELECT is_active FROM subscriptions WHERE id = $1", [subId]);
    return NextResponse.json({ success: true, is_active: rows[0]?.is_active });
  }

  return NextResponse.json({ error: "unknown_action" }, { status: 400 });
}

// DELETE - delete subscription fully
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminToken(req))) return unauthorizedResponse();

  const { id } = await params;
  const subId = parseInt(id, 10);
  if (isNaN(subId)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });

  const db = getPool();
  await db.query("DELETE FROM expiry_notifications WHERE sub_id = $1", [subId]);
  await db.query("DELETE FROM subscriptions WHERE id = $1", [subId]);

  return NextResponse.json({ success: true });
}