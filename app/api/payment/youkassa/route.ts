import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const SHOP_ID = process.env.YOKASSA_SHOP_ID!;
const SECRET_KEY = process.env.YOKASSA_SECRET_KEY!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.escapethematrix.to";

export async function POST(req: NextRequest) {
  let body: { amount?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const amount = body.amount;
  if (!amount || amount < 100) {
    return NextResponse.json({ error: "Minimum amount is 100 RUB" }, { status: 400 });
  }

  if (!SHOP_ID || !SECRET_KEY) {
    return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
  }

  const idempotenceKey = randomUUID();

  try {
    const res = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotence-Key": idempotenceKey,
        Authorization:
          "Basic " + Buffer.from(`${SHOP_ID}:${SECRET_KEY}`).toString("base64"),
      },
      body: JSON.stringify({
        amount: {
          value: amount.toFixed(2),
          currency: "RUB",
        },
        confirmation: {
          type: "redirect",
          return_url: `${SITE_URL}/profile?payment=success`,
        },
        capture: true,
        description: `Пополнение баланса EscapeTheMatrix — ${amount} ₽`,
        metadata: {
          source: "website",
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("YooKassa error:", err);
      return NextResponse.json({ error: "Payment creation failed" }, { status: 502 });
    }

    const data = await res.json();

    return NextResponse.json({
      payment_id: data.id,
      confirmation_url: data.confirmation.confirmation_url,
      status: data.status,
    });
  } catch (err) {
    console.error("YooKassa fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}