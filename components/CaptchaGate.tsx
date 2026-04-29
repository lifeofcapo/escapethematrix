"use client";

import { useEffect, useRef, useState } from "react";

interface CaptchaGateProps {
  onPassed: () => void;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "YOUR_TURNSTILE_SITE_KEY";
const STORAGE_KEY = "captcha_passed";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 часа

export default function CaptchaGate({ onPassed }: CaptchaGateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [phase, setPhase] = useState<"loading" | "ready" | "verifying" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Проверяем кэш при монтировании
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const { timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          onPassed();
          return;
        }
      } catch {}
    }

    // Load Turnstile script if not already loaded
    if (!(window as any).turnstile) {
      const scriptId = 'turnstile-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        
        // Таймаут на загрузку скрипта
        timeoutRef.current = setTimeout(() => {
          setErrorMsg("Script loading timeout. Please refresh the page.");
          setPhase("error");
        }, 10000);

        script.onload = () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          renderWidget();
        };
        
        script.onerror = () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setErrorMsg("Failed to load verification. Please try again.");
          setPhase("error");
        };
        
        document.head.appendChild(script);
      }
    } else {
      renderWidget();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
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
        
        // Создаем AbortController для таймаута на верификацию
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => {
          abortController.abort();
        }, 10000); // 10 секунд на проверку

        try {
          const res = await fetch("/api/turnstile-verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
            signal: abortController.signal,
          });

          clearTimeout(timeoutId);
          
          if (!res.ok) {
            throw new Error("Verification failed");
          }

          const data = await res.json();
          
          if (data.success) {
            // Сохраняем в localStorage для кэширования
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
              timestamp: Date.now()
            }));
            onPassed();
          } else {
            setErrorMsg("Verification failed. Try again.");
            setPhase("error");
            (window as any).turnstile?.reset(widgetIdRef.current);
          }
        } catch (err: any) {
          clearTimeout(timeoutId);
          
          if (err.name === "AbortError") {
            setErrorMsg("Verification timeout. Please try again.");
          } else {
            setErrorMsg("Connection failed. Please check your internet.");
          }
          
          setPhase("error");
          (window as any).turnstile?.reset(widgetIdRef.current);
        }
      },
      "error-callback": () => {
        setErrorMsg("Failed to load verification. Please refresh the page.");
        setPhase("error");
      },
      "expired-callback": () => {
        setErrorMsg("Verification expired. Please try again.");
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
            {phase === "ready" && "Verify you are human"}
            {phase === "verifying" && "Checking..."}
            {phase === "error" && "Verification Failed"}
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
          <div className="flex flex-col items-center gap-3">
            <div className="text-red-400/70 font-mono text-xs border border-red-400/20 px-4 py-2 rounded-sm bg-red-400/5 text-center">
              ⊗ {errorMsg}
            </div>
            <button
              onClick={() => {
                setPhase("loading");
                setErrorMsg("");
                if ((window as any).turnstile) {
                  renderWidget();
                } else {
                  window.location.reload();
                }
              }}
              className="text-green-400/70 font-mono text-xs hover:text-green-400 transition-colors"
            >
              ⟳ Try Again
            </button>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.3em] text-white/10 uppercase">
        Protected by Cloudflare Turnstile
      </div>
    </div>
  );
}