import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { Pool } from "pg";

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? ""
);

let pool: Pool | null = null;

export function getPool(): Pool {
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

export async function verifyAdminToken(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}