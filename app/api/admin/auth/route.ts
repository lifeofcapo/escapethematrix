import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const ADMIN_LOGIN = process.env.ADMIN_LOGIN!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? ""
);

export async function POST(req: NextRequest) {
  let body: { login?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { login, password } = body;

  if (!login || !password) {
    return NextResponse.json({ error: "missing_credentials" }, { status: 400 });
  }

  if (login !== ADMIN_LOGIN || password !== ADMIN_PASSWORD) {
    // Delay to prevent brute force
    await new Promise((r) => setTimeout(r, 1000));
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(ADMIN_JWT_SECRET);

  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 12, // 12 hours
    path: "/",
  });

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("admin_token");
  return res;
}