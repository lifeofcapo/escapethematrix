
import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const BOT_TOKEN = process.env.BOT_TOKEN!;
const INTERNAL_API = process.env.INTERNAL_API_URL ?? "http://localhost:8000";

function verifyTelegramInitData(initData: string): {
  ok: boolean;
  userId?: number;
  username?: string;
  firstName?: string;
  langCode?: string;
} {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return { ok: false };

  const authDate = parseInt(params.get("auth_date") ?? "0", 10);
  const now = Math.floor(Date.now() / 1000);
  if (now - authDate > 300) return { ok: false };

  params.delete("hash");
  const checkString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secretKey = createHmac("sha256", "WebAppData")
    .update(BOT_TOKEN)
    .digest();
  const expectedHash = createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");

  if (expectedHash !== hash) return { ok: false };

  let userId: number | undefined;
  let username: string | undefined;
  let firstName: string | undefined;
  let langCode: string | undefined;

  const userRaw = params.get("user");
  if (userRaw) {
    try {
      const user = JSON.parse(userRaw);
      userId = user.id;
      username = user.username;
      firstName = user.first_name;
      langCode = user.language_code;
    } catch {
      return { ok: false };
    }
  }

  if (!userId) return { ok: false };
  return { ok: true, userId, username, firstName, langCode };
}

async function fetchProfile(userId: number) {
  const res = await fetch(`${INTERNAL_API}/internal/profile/${userId}`, {
    headers: {
      "X-Internal-Secret": process.env.INTERNAL_SECRET ?? "",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export async function POST(req: NextRequest) {
  let body: { initData?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { initData } = body;
  if (!initData || typeof initData !== "string") {
    return NextResponse.json({ error: "missing_init_data" }, { status: 400 });
  }

  const result = verifyTelegramInitData(initData);
  if (!result.ok || !result.userId) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const profile = await fetchProfile(result.userId);
  if (!profile) {
    return NextResponse.json({ error: "user_not_found" }, { status: 404 });
  }

  return NextResponse.json({
    tg_id: result.userId,
    username: result.username,
    first_name: result.firstName,
    lang_code: result.langCode,
    ...profile,
  });
}