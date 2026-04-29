"use client";

import { useEffect, useRef } from "react";

export default function HeroSection({ t }: { t: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const cols = Math.floor(canvas.width / 20);
    const drops: number[] = Array(cols).fill(1);
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ01";

    const draw = () => {
      ctx.fillStyle = "rgba(8,8,8,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(74,222,128,0.15)";
      ctx.font = "14px monospace";

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * 20, drops[i] * 20);
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="mb-6 leading-none">
          <span className="block text-white/20 font-mono text-[clamp(0.75rem,2.5vw,1.1rem)] tracking-[0.35em] uppercase mb-3">
            {t.hero.headline1}
          </span>
          <span
            className="block text-white"
            style={{
              fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif",
              fontSize: "clamp(5rem,18vw,12rem)",
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            {t.hero.headline2}
          </span>
        </h1>

        <p className="text-white/40 font-mono text-sm md:text-base tracking-wider max-w-lg mx-auto mb-10 leading-relaxed">
          {t.hero.sub}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://t.me/EscapeTheMatrixVPNBot"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-green-400 text-[#080808] font-mono font-bold text-sm tracking-wider rounded hover:bg-green-300 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.01 9.47c-.148.659-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 14.607l-2.95-.924c-.641-.201-.654-.641.136-.949l11.532-4.447c.536-.194 1.004.131.834.961h.53z" />
            </svg>
            {t.hero.cta}
          </a>
          <span className="text-white/75 font-mono text-xs tracking-widest">
            {t.hero.ctaSub}
          </span>
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {[
            { val: "100₽", label: "/мес" },
            { val: "1+", label: "Gbit/s" },
            { val: "0", label: "logs" },
            { val: "∞", label: "трафик" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-white font-mono">{s.val}</div>
              <div className="text-xs font-mono tracking-widest text-white/30 uppercase mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/20" />
      </div>
    </section>
  );
}