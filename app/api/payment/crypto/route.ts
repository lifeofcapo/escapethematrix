import { NextRequest, NextResponse } from "next/server";

const CRYPTOCLOUD_API_KEY = process.env.CRYPTOCLOUD_API_KEY;
const CRYPTOCLOUD_SHOP_ID = process.env.CRYPTOCLOUD_SHOP_ID;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.escapethematrix.to";

const VALID_CURRENCIES = [
  "USDT_TRC20", "USDT_ERC20", "USDT_TON", "USDT_SOL",
  "USDT_BSC", "USDT_ARB", "USDT_OPT",
  "ETH", "ETH_ARB", "ETH_BASE", "ETH_OPT",
  "BTC", "LTC", "TRX", "SOL", "TON", "BNB",
];

export async function POST(req: NextRequest) {
  // Проверяем наличие переменных окружения
  if (!CRYPTOCLOUD_API_KEY || !CRYPTOCLOUD_SHOP_ID) {
    console.error("CryptoCloud: missing env vars", {
      hasKey: !!CRYPTOCLOUD_API_KEY,
      hasShopId: !!CRYPTOCLOUD_SHOP_ID,
    });
    return NextResponse.json(
      { error: "Crypto payment not configured" },
      { status: 500 }
    );
  }

  let body: { amount?: number; currency?: string; tg_id?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { amount, currency, tg_id } = body;

  if (!amount || amount < 100) {
    return NextResponse.json(
      { error: "Minimum amount is 100 RUB" },
      { status: 400 }
    );
  }

  // Валидируем выбранную криптовалюту
  const selectedCrypto = currency && VALID_CURRENCIES.includes(currency)
    ? currency
    : "USDT_TRC20";

  const orderId = `web_${tg_id ?? 0}_${Date.now()}`;

  // Согласно документации CryptoCloud v2:
  // - amount: сумма в указанной валюте
  // - currency: валюта суммы (RUB, USD, EUR и т.д.)
  // - add_fields.available_currencies: список доступных крипто для оплаты
  const requestBody = {
    amount: amount,
    shop_id: CRYPTOCLOUD_SHOP_ID,
    currency: "RUB",          // валюта суммы — рубли
    order_id: orderId,
    add_fields: {
      available_currencies: [selectedCrypto], // выбранная пользователем крипта
    },
  };

  console.log("CryptoCloud request:", JSON.stringify(requestBody));

  try {
    const res = await fetch("https://api.cryptocloud.plus/v2/invoice/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${CRYPTOCLOUD_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await res.text();
    console.log("CryptoCloud raw response:", res.status, responseText);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Crypto payment creation failed", detail: responseText },
        { status: 502 }
      );
    }

    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON from CryptoCloud" },
        { status: 502 }
      );
    }

    // CryptoCloud v2 response: { status: "success", result: { uuid, link, ... } }
    if (data.status !== "success" || !data.result?.link) {
      console.error("CryptoCloud unexpected response:", data);
      return NextResponse.json(
        { error: "Invalid response from CryptoCloud", detail: data },
        { status: 502 }
      );
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