import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const SHOP_ID = process.env.YOOKASSA_SHOP_ID;     
const SECRET_KEY = process.env.YOOKASSA_SECRET_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.escapethematrix.to";

export async function POST(req: NextRequest) {
  console.log("YooKassa env check:", {
    hasShopId: !!process.env.YOOKASSA_SHOP_ID,
    hasSecretKey: !!process.env.YOOKASSA_SECRET_KEY,
    shopIdLen: process.env.YOOKASSA_SHOP_ID?.length,
  });
  if (!SHOP_ID || !SECRET_KEY) {
    console.error("YooKassa: missing env vars", {
      hasShopId: !!SHOP_ID,
      hasSecretKey: !!SECRET_KEY,
      shopIdPreview: SHOP_ID ? SHOP_ID.slice(0, 4) + "..." : "MISSING",
    });
    return NextResponse.json(
      { error: "Payment not configured. Check YOOKASSA_SHOP_ID and YOOKASSA_SECRET_KEY env vars." },
      { status: 500 }
    );
  }

  let body: { amount?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const amount = body.amount;
  if (!amount || amount < 100) {
    return NextResponse.json(
      { error: "Minimum amount is 100 RUB" },
      { status: 400 }
    );
  }

  const idempotenceKey = randomUUID();
  const credentials = Buffer.from(`${SHOP_ID}:${SECRET_KEY}`).toString("base64");

  const requestBody = {
    amount: {
      value: amount.toFixed(2),
      currency: "RUB",
    },
    confirmation: {
      type: "redirect",
      return_url: `${SITE_URL}/successful-payment`,
    },
    capture: true,
    description: `Пополнение баланса EscapeTheMatrix — ${amount} ₽`,
  };

  console.log("YooKassa request:", JSON.stringify(requestBody));

  try {
    const res = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotence-Key": idempotenceKey,
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await res.text();
    console.log("YooKassa raw response:", res.status, responseText);

    if (!res.ok) {
      return NextResponse.json(
        { error: "YooKassa payment creation failed", detail: responseText },
        { status: 502 }
      );
    }

    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON from YooKassa" },
        { status: 502 }
      );
    }

    if (!data.confirmation?.confirmation_url) {
      console.error("YooKassa: no confirmation_url in response:", data);
      return NextResponse.json(
        { error: "No payment URL in response", detail: data },
        { status: 502 }
      );
    }

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