"use client";

import { useState } from "react";
import { translations } from "@/lib/i18n";
import { Language } from "@/lib/types";

const CRYPTO_OPTIONS = [
  { id: "USDT_TRC20", label: "USDT", network: "TRC-20", icon: "₮" },
  { id: "USDT_ERC20", label: "USDT", network: "ERC-20", icon: "₮" },
  { id: "ETH",        label: "ETH",  network: "ERC-20", icon: "Ξ" },
  { id: "BTC",        label: "BTC",  network: "Bitcoin", icon: "₿" },
  { id: "TON",        label: "TON",  network: "TON",    icon: "◎" },
  { id: "SOL",        label: "SOL",  network: "Solana", icon: "◉" },
];

const QUICK_AMOUNTS = [100, 300, 500, 1000, 2000];

interface Props {
  balance: number;
  tgId: number;
  lang: Language;
  onClose: () => void;
}

export default function PaymentModal({ balance, tgId, lang, onClose }: Props) {
  const t = translations[lang].profile.payment;
  const [method, setMethod] = useState<"yookassa" | "crypto">("yookassa");
  const [amount, setAmount] = useState("");
  const [cryptoCurrency, setCryptoCurrency] = useState("USDT_TRC20");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    const num = parseFloat(amount);
    if (!num || num < 100) {
      setError(t.errorAmount + " (min 100 ₽)");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (method === "yookassa") {
        const res = await fetch("/api/payment/yookassa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: num, tg_id: tgId }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        // Redirect to YooKassa confirmation URL
        window.open(data.confirmation_url, "_blank");
        onClose();
      } else {
        const res = await fetch("/api/payment/crypto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: num, currency: cryptoCurrency, tg_id: tgId }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        window.open(data.pay_url, "_blank");
        onClose();
      }
    } catch {
      setError(t.errorPayment);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md bg-[#080808] border border-white/10 rounded-sm shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <div className="text-[10px] font-mono tracking-[0.4em] text-green-400/50 uppercase">
              ◈ {t.title}
            </div>
            <div className="font-mono text-xs text-white/25 mt-0.5">
              {lang === "ru" ? "Текущий баланс" : "Current balance"}: {balance} ₽
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/25 hover:text-white/60 font-mono text-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div>
            <div className="text-white/30 font-mono text-[10px] tracking-widest uppercase mb-2">{t.method}</div>
            <div className="grid grid-cols-2 gap-2">
              {(["yookassa", "crypto"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`py-3 px-4 border font-mono text-xs tracking-wider transition-all rounded-sm text-left ${
                    method === m
                      ? "border-green-400/50 bg-green-400/8 text-green-400"
                      : "border-white/8 text-white/30 hover:border-white/20 hover:text-white/50"
                  }`}
                >
                  <div className="text-base mb-1">{m === "yookassa" ? "💳" : "🔐"}</div>
                  {m === "yookassa" ? t.yookassa : t.crypto}
                </button>
              ))}
            </div>
          </div>
          {method === "crypto" && (
            <div>
              <div className="text-white/30 font-mono text-[10px] tracking-widest uppercase mb-2">{t.selectCrypto}</div>
              <div className="grid grid-cols-3 gap-2">
                {CRYPTO_OPTIONS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCryptoCurrency(c.id)}
                    className={`py-2 px-3 border font-mono text-[10px] transition-all rounded-sm text-center ${
                      cryptoCurrency === c.id
                        ? "border-green-400/50 bg-green-400/8 text-green-400"
                        : "border-white/8 text-white/30 hover:border-white/20 hover:text-white/50"
                    }`}
                  >
                    <div className="text-sm mb-0.5">{c.icon}</div>
                    <div className="font-bold">{c.label}</div>
                    <div className="text-[9px] opacity-60">{c.network}</div>
                  </button>
                ))}
              </div>
              <p className="text-white/20 font-mono text-[10px] mt-2">{t.cryptoNote}</p>
            </div>
          )}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/30 font-mono text-[10px] tracking-widest uppercase">{t.amount}</div>
              <div className="text-white/20 font-mono text-[10px]">{t.minAmount}</div>
            </div>
            <div className="flex gap-1.5 mb-2 flex-wrap">
              {QUICK_AMOUNTS.map(a => (
                <button
                  key={a}
                  onClick={() => setAmount(String(a))}
                  className={`px-3 py-1 border font-mono text-[10px] transition-all rounded-sm ${
                    amount === String(a)
                      ? "border-green-400/50 bg-green-400/8 text-green-400"
                      : "border-white/8 text-white/25 hover:border-white/20 hover:text-white/50"
                  }`}
                >
                  {a} ₽
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="number"
                min="100"
                step="50"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder={t.amountPlaceholder}
                className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-3 pr-10 font-mono text-white/80 text-sm focus:outline-none focus:border-green-400/40 placeholder:text-white/15 transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-white/25 text-sm">₽</span>
            </div>
          </div>
          {error && (
            <div className="text-red-400/70 font-mono text-xs border border-red-400/15 px-3 py-2 rounded-sm bg-red-400/5">
              ⊗ {error}
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-white/8 text-white/30 font-mono text-xs tracking-widest uppercase hover:border-white/20 hover:text-white/50 transition-all rounded-sm"
            >
              {t.cancel}
            </button>
            <button
              onClick={handlePay}
              disabled={loading || !amount}
              className="flex-1 py-3 border border-green-400/30 text-green-400 font-mono text-xs tracking-widest uppercase hover:bg-green-400/8 hover:border-green-400/60 transition-all rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-3 h-3 border border-green-400/50 border-t-green-400 rounded-full animate-spin" />
                  {t.loading}
                </span>
              ) : (
                `${t.pay}${amount ? ` ${amount} ₽` : ""}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}