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
      pool = null;
    });
  }
  return pool;
}

const REGION_META: Record<string, { city: string; flag: string; ping: string }> = {
  fi:  { city: "Helsinki",   flag: "🇫🇮", ping: "~60ms"  },
  nl:  { city: "Amsterdam",  flag: "🇳🇱", ping: "~65ms"  },
  // на случай добавления новых серверов
  de:  { city: "Frankfurt",  flag: "🇩🇪", ping: "~72ms"  },
  us:  { city: "New York",   flag: "🇺🇸", ping: "~90ms"  },
};

export async function POST(req: NextRequest) {
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { token } = body;

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
      `SELECT id, plan, region, devices_limit, sub_link, started_at, expires_at
       FROM subscriptions
       WHERE user_id = $1 AND is_active = TRUE
       ORDER BY region ASC, expires_at DESC`,
      [user.id]
    );

    const subs = subResult.rows;
    const now = new Date();

    const configs = subs
      .filter((s) => s.sub_link) // только с ссылкой
      .map((s) => {
        const region = (s.region ?? "fi").toLowerCase();
        const meta = REGION_META[region] ?? {
          city: region.toUpperCase(),
          flag: "🌐",
          ping: "—",
        };
        return {
          region,
          city: meta.city,
          flag: meta.flag,
          vless_link: s.sub_link,
          ping: meta.ping,
          expires_at: s.expires_at,
          devices_limit: s.devices_limit,
        };
      });
    const activeSubs = subs.filter(
      (s) => s.expires_at && new Date(s.expires_at) >= now
    );
    const primarySub = activeSubs.sort(
      (a, b) => new Date(b.expires_at).getTime() - new Date(a.expires_at).getTime()
    )[0] ?? subs[0] ?? null;

    const subscriptionStatus = !primarySub
      ? "inactive"
      : primarySub.expires_at && new Date(primarySub.expires_at) < now
      ? "expired"
      : "active";
    const devicesMax = subs.length > 0
      ? Math.max(...subs.map((s) => s.devices_limit ?? 0))
      : 0;

    return NextResponse.json({
      tg_id: user.id,
      username: user.username ?? null,
      balance: parseFloat(user.balance),
      subscription: subscriptionStatus,
      expires_at: primarySub?.expires_at ?? null,
      devices_used: 0,
      devices_max: devicesMax,
      configs,
    });
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}