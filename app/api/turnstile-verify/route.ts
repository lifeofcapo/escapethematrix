import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY!;

export async function POST(req: NextRequest) {
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "invalid_body" }, { status: 400 });
  }

  const { token } = body;
  if (!token) {
    return NextResponse.json({ success: false, error: "missing_token" }, { status: 400 });
  }

  // Get real IP for extra validation
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";

  try {
    const formData = new FormData();
    formData.append("secret", SECRET_KEY);
    formData.append("response", token);
    formData.append("remoteip", ip);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });

    const data: { success: boolean; "error-codes"?: string[] } = await res.json();

    if (data.success) {
      return NextResponse.json({ success: true });
    } else {
      console.warn("Turnstile verification failed:", data["error-codes"]);
      return NextResponse.json({ success: false, error: "verification_failed" }, { status: 403 });
    }
  } catch (err) {
    console.error("Turnstile API error:", err);
    return NextResponse.json({ success: false, error: "internal_error" }, { status: 500 });
  }
}