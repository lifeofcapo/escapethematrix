import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";


let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
      max: 5,
    });
    pool.on("error", (err) => {
      console.error("Unexpected DB pool error:", err);
      pool = null; // force reconnect on next request
    });
  }
  return pool;
}

export async function POST(req: NextRequest) {
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { token } = body;

  // ProfileModal передаёт поле "token" это profile_key
  if (!token || token.length < 8) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  try {
    const db = getPool();
    const userResult = await db.query(
      `SELECT id, username, full_name, language, balance, created_at
       FROM users WHERE profile_key = $1`,
      [token]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userResult.rows[0];
    const subResult = await db.query(
      `SELECT plan, devices_limit, sub_link, started_at, expires_at
       FROM subscriptions
       WHERE user_id = $1 AND is_active = TRUE
       ORDER BY expires_at DESC LIMIT 1`,
      [user.id]
    );

    const sub = subResult.rows[0] ?? null;
    const now = new Date();

    const configs = sub
      ? [
          {
            region: "FI",
            city: "Helsinki",
            flag: "🇫🇮",
            vless_link: sub.sub_link,
            ping: "~20ms",
          },
        ]
      : [];

    return NextResponse.json({
      tg_id: user.id,
      username: user.username ?? null,
      balance: parseFloat(user.balance),
      subscription: sub
        ? sub.expires_at && new Date(sub.expires_at) < now
          ? "expired"
          : "active"
        : "inactive",
      expires_at: sub?.expires_at ?? null,
      devices_used: 0,   // реальное значение — через xui API
      devices_max: sub?.devices_limit ?? 0,
      configs,
    });
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}