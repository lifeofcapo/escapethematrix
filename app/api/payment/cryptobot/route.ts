import { NextRequest, NextResponse } from "next/server";

const CRYPTOCLOUD_API_KEY = process.env.CRYPTOCLOUD_API_KEY!;
const CRYPTOCLOUD_SHOP_ID = process.env.CRYPTOCLOUD_SHOP_ID!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.escapethematrix.to";

// CryptoCloud currency mapping
// https://doc.cryptocloud.plus/
const CURRENCY_MAP: Record<string, string> = {
  USDT_TRC20: "USDT_TRC20",
  USDT_ERC20: "USDT_ERC20",
  ETH:        "ETH",
  BTC:        "BTC",
  TON:        "TON",
  SOL:        "SOL",
};

export async function POST(req: NextRequest) {
  let body: { amount?: number; currency?: string; tg_id?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { amount, currency, tg_id } = body;

  if (!amount || amount < 100) {
    return NextResponse.json({ error: "Minimum amount is 100 RUB" }, { status: 400 });
  }

  const ccCurrency = CURRENCY_MAP[currency ?? "USDT_TRC20"];
  if (!ccCurrency) {
    return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
  }

  if (!CRYPTOCLOUD_API_KEY || !CRYPTOCLOUD_SHOP_ID) {
    return NextResponse.json({ error: "Crypto payment not configured" }, { status: 500 });
  }

  try {
    const res = await fetch("https://api.cryptocloud.plus/v2/invoice/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${CRYPTOCLOUD_API_KEY}`,
      },
      body: JSON.stringify({
        shop_id: CRYPTOCLOUD_SHOP_ID,
        amount: amount,          // CryptoCloud конвертирует RUB в крипту автоматически
        currency: "RUB",
        add_fields: {
          currency: ccCurrency,
        },
        order_id: `web_${tg_id ?? 0}_${Date.now()}`,
        email: null,
        success_url: `${SITE_URL}/successful-payment`,
        fail_url: `${SITE_URL}/failed-payment`,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("CryptoCloud error:", err);
      return NextResponse.json({ error: "Crypto payment creation failed" }, { status: 502 });
    }

    const data = await res.json();

    // CryptoCloud v2 response: { status: "success", result: { uuid, link, ... } }
    if (data.status !== "success" || !data.result?.link) {
      console.error("CryptoCloud unexpected response:", data);
      return NextResponse.json({ error: "Invalid response from payment provider" }, { status: 502 });
    }

    return NextResponse.json({
      invoice_id: data.result.uuid,
      pay_url: data.result.link,
    });
  } catch (err) {
    console.error("CryptoCloud fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}