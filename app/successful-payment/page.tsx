"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SuccessfulPaymentPage() {
  const router = useRouter();
  const [count, setCount] = useState(5);

  useEffect(() => {
    sessionStorage.removeItem("profile_session");

    const interval = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          clearInterval(interval);
          router.push("/profile");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-green-500/8 blur-[120px] pointer-events-none" />

      <div className="relative text-center max-w-md">
        <div className="h-px w-64 mx-auto bg-gradient-to-r from-transparent via-green-400/40 to-transparent mb-10" />

        <div className="text-6xl mb-6 animate-pulse">✓</div>

        <div className="text-[10px] font-mono tracking-[0.5em] text-green-400/50 uppercase mb-3">
          ◈ escape the matrix
        </div>

        <h1 className="font-mono text-2xl text-white/80 tracking-wider uppercase mb-3">
          Оплата прошла
        </h1>
        <p className="font-mono text-sm text-green-400/70 mb-2">
          Баланс будет пополнен в течение нескольких минут
        </p>
        <p className="font-mono text-xs text-white/25 mb-8">
          Payment successful · Zahlung erfolgreich · 支付成功
        </p>

        <div className="border border-white/6 bg-white/[0.02] rounded-sm px-6 py-4 mb-6">
          <p className="font-mono text-xs text-white/30">
            Возврат в кабинет через{" "}
            <span className="text-green-400 font-bold">{count}</span> сек...
          </p>
        </div>

        <button
          onClick={() => router.push("/profile")}
          className="px-8 py-3 border border-green-400/30 text-green-400 font-mono text-xs tracking-[0.3em] uppercase hover:bg-green-400/8 hover:border-green-400/60 transition-all rounded-sm"
        >
          Перейти в кабинет →
        </button>

        <div className="h-px w-64 mx-auto bg-gradient-to-r from-transparent via-white/5 to-transparent mt-10" />
      </div>
    </div>
  );
}