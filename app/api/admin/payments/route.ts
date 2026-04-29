import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, unauthorizedResponse, getPool } from "../../../../lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!(await verifyAdminToken(req))) return unauthorizedResponse();

  const url = new URL(req.url);
  const status = url.searchParams.get("status"); // pending, paid, failed, all

  const db = getPool();
  const condition = status && status !== "all" ? `WHERE p.status = '${status}'` : "";

  const { rows } = await db.query(`
    SELECT p.*, u.username, u.full_name
    FROM payments p
    LEFT JOIN users u ON p.user_id = u.id
    ${condition}
    ORDER BY p.created_at DESC
    LIMIT 500
  `);

  return NextResponse.json({ payments: rows });
}

export async function DELETE(req: NextRequest) {
  if (!(await verifyAdminToken(req))) return unauthorizedResponse();

  let body: { payment_id?: number; delete_all_pending?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const db = getPool();

  if (body.delete_all_pending) {
    const { rowCount } = await db.query("DELETE FROM payments WHERE status = 'pending'");
    return NextResponse.json({ success: true, deleted: rowCount });
  }

  if (body.payment_id) {
    await db.query("DELETE FROM payments WHERE id = $1", [body.payment_id]);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "nothing_to_delete" }, { status: 400 });
}