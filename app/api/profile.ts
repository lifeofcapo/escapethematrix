import { Pool } from "pg";

let pool;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
      max: 5,
    });
  }
  return pool;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { profile_key } = req.body;
  if (!profile_key || profile_key.length < 8) {
    return res.status(400).json({ error: "Invalid key" });
  }

  try {
    const db = getPool();

    // 1. Найти пользователя по ключу
    const userResult = await db.query(
      `SELECT id, username, full_name, language, balance, created_at
       FROM users WHERE profile_key = $1`,
      [profile_key]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    // 2. Получить активную подписку
    const subResult = await db.query(
      `SELECT plan, devices_limit, sub_link, started_at, expires_at
       FROM subscriptions
       WHERE user_id = $1 AND is_active = TRUE
       ORDER BY expires_at DESC LIMIT 1`,
      [user.id]
    );

    const subscription = subResult.rows[0] || null;

    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        balance: parseFloat(user.balance),
        created_at: user.created_at,
      },
      subscription: subscription
        ? {
            plan: subscription.plan,
            devices_limit: subscription.devices_limit,
            sub_link: subscription.sub_link,
            started_at: subscription.started_at,
            expires_at: subscription.expires_at,
            is_expired: new Date(subscription.expires_at) < new Date(),
          }
        : null,
    });
  } catch (err) {
    console.error("DB error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}