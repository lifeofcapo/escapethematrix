"use client";

import { useEffect, useRef, useState } from "react";

interface CaptchaGateProps {
  onPassed: () => void;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "YOUR_TURNSTILE_SITE_KEY";

export default function CaptchaGate({ onPassed }: CaptchaGateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [phase, setPhase] = useState<"loading" | "ready" | "verifying" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Load Turnstile script if not already loaded
    if (!(window as any).turnstile) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => renderWidget();
      document.head.appendChild(script);
    } else {
      renderWidget();
    }

    return () => {
      if (widgetIdRef.current !== null) {
        try { (window as any).turnstile?.remove(widgetIdRef.current); } catch {}
      }
    };
  }, []);

  function renderWidget() {
    if (!containerRef.current) return;
    setPhase("ready");

    widgetIdRef.current = (window as any).turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      theme: "dark",
      callback: async (token: string) => {
        setPhase("verifying");
        try {
          const res = await fetch("/api/turnstile-verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
          const data = await res.json();
          if (data.success) {
            onPassed();
          } else {
            setErrorMsg("Check haven't found. Try one more time.");
            setPhase("error");
            (window as any).turnstile?.reset(widgetIdRef.current);
          }
        } catch {
          setErrorMsg("Connection failed. Try one more time.");
          setPhase("error");
          (window as any).turnstile?.reset(widgetIdRef.current);
        }
      },
      "error-callback": () => {
        setErrorMsg("Unavailable to load page. Try to refresh the page.");
        setPhase("error");
      },
    });
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden">
      <div className="scan-line" />
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-green-400/30" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-green-400/30" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-green-400/30" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-green-400/30" />

      <div className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.4em] text-white/20 uppercase">
        ESCAPE THE MATRIX — SECURITY CHECKPOINT
      </div>

      <div className="flex flex-col items-center gap-8 w-96">
        <div className="text-center">
          <div className="text-[10px] font-mono tracking-[0.5em] text-green-400/50 uppercase mb-3">
            — Access Verification —
          </div>
          <div className="text-white/40 font-mono text-sm tracking-wide">
            {phase === "loading" && "Loading..."}
            {phase === "ready" && "Accepting, that you're human"}
            {phase === "verifying" && "Checking..."}
            {phase === "error" && "Checking Failed"}
          </div>
        </div>
        <div
          ref={containerRef}
          className={`transition-opacity duration-300 ${phase === "loading" ? "opacity-0" : "opacity-100"}`}
        />

        {phase === "loading" && (
          <div className="text-green-400/50 font-mono text-3xl flicker">◉</div>
        )}

        {phase === "verifying" && (
          <div className="text-white/30 font-mono text-xs tracking-widest uppercase animate-pulse">
            Token Verification...
          </div>
        )}

        {phase === "error" && (
          <div className="text-red-400/70 font-mono text-xs border border-red-400/20 px-4 py-2 rounded-sm bg-red-400/5 text-center">
            ⊗ {errorMsg}
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.3em] text-white/10 uppercase">
        Protected by Cloudflare Turnstile
      </div>
    </div>
  );
}