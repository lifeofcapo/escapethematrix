import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const SHOP_ID = process.env.YOOKASSA_SHOP_ID;
const SECRET_KEY = process.env.YOOKASSA_SECRET_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.escapethematrix.to";

export async function POST(req: NextRequest) {
  if (!SHOP_ID || !SECRET_KEY) {
    return NextResponse.json(
      { error: "Payment not configured" },
      { status: 500 }
    );
  }

  let body: { amount?: number; tg_id?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { amount, tg_id } = body;

  if (!amount || amount < 100) {
    return NextResponse.json({ error: "Minimum amount is 100 RUB" }, { status: 400 });
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
    //webhook использует для начисления баланса tg_id
    metadata: { 
      tg_id: tg_id ? String(tg_id) : "",
    },
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

    const data = JSON.parse(responseText);

    if (!data.confirmation?.confirmation_url) {
      return NextResponse.json(
        { error: "No payment URL in response" },
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