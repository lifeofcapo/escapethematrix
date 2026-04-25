"use client";

import { useRouter } from "next/navigation";

export default function FailedPaymentPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />

      <div className="relative text-center max-w-md">
        <div className="h-px w-64 mx-auto bg-gradient-to-r from-transparent via-red-400/30 to-transparent mb-10" />

        <div className="text-6xl mb-6 opacity-60">✕</div>

        <div className="text-[10px] font-mono tracking-[0.5em] text-green-400/50 uppercase mb-3">
          ◈ escape the matrix
        </div>

        <h1 className="font-mono text-2xl text-white/80 tracking-wider uppercase mb-3">
          Оплата не прошла
        </h1>
        <p className="font-mono text-sm text-red-400/60 mb-2">
          Платёж был отменён или произошла ошибка
        </p>
        <p className="font-mono text-xs text-white/25 mb-8">
          Payment failed · Zahlung fehlgeschlagen · 支付失败
        </p>

        <div className="border border-red-400/10 bg-red-400/[0.03] rounded-sm px-6 py-4 mb-6">
          <p className="font-mono text-xs text-white/30">
            Средства не были списаны. Попробуйте ещё раз или выберите другой способ оплаты.
          </p>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => router.push("/profile")}
            className="px-6 py-3 border border-green-400/30 text-green-400 font-mono text-xs tracking-[0.3em] uppercase hover:bg-green-400/8 hover:border-green-400/60 transition-all rounded-sm"
          >
            Попробовать снова →
          </button>
          <a
            href="https://t.me/EscapeTheMatrixVPNBot"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-white/10 text-white/35 font-mono text-xs tracking-[0.2em] uppercase hover:border-white/25 hover:text-white/55 transition-all rounded-sm"
          >
            Поддержка
          </a>
        </div>

        <div className="h-px w-64 mx-auto bg-gradient-to-r from-transparent via-white/5 to-transparent mt-10" />
      </div>
    </div>
  );
}