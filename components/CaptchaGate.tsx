"use client";

import { useState, useEffect, useRef } from "react";

interface CaptchaGateProps {
  onPassed: () => void;
}

function generateGrid(rows = 6, cols = 8) {
  const chars = "01アイウエオカキクケコ∆◈◎◬◆◉◐░▒▓";
  return Array.from({ length: rows * cols }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  );
}


function runHeuristicChecks(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (typeof navigator !== "undefined" && (navigator as any).webdriver) {
        return resolve(false);
      }
      if (
        typeof screen !== "undefined" &&
        (screen.width < 200 || screen.height < 200)
      ) {
        return resolve(false);
      }
      if (
        typeof window === "undefined" ||
        typeof document === "undefined" ||
        typeof navigator === "undefined"
      ) {
        return resolve(false);
      }
      if (!navigator.language) {
        return resolve(false);
      }
      resolve(true);
    }, 200);
  });
}

export default function CaptchaGate({ onPassed }: CaptchaGateProps) {
  const [phase, setPhase] = useState<"scanning" | "success" | "blocked">("scanning");
  const [loadProgress, setLoadProgress] = useState(0);
  const [statusLine, setStatusLine] = useState("Initializing...");
  const [grid, setGrid] = useState<string[]>([]);
  const [glitchIndex, setGlitchIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const statusLines = [
    "Analyzing environment...",
    "Checking browser fingerprint...",
    "Verifying network stack...",
    "Scanning for anomalies...",
    "Validating client entropy...",
    "Access check complete.",
  ];

  // Initialize grid on client only (avoids SSR hydration mismatch)
  useEffect(() => {
    setMounted(true);
    setGrid(generateGrid());
  }, []);

  // Grid glitch effect — only after mount
  useEffect(() => {
    if (!mounted) return;
    const chars = "01アイウエオカキクケコ∆◈◎◬◆◉◐░▒▓";
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * grid.length);
      setGlitchIndex(idx);
      setGrid((prev) => {
        const next = [...prev];
        next[idx] = chars[Math.floor(Math.random() * chars.length)];
        return next;
      });
      setTimeout(() => setGlitchIndex(null), 150);
    }, 120);
    return () => clearInterval(interval);
  }, [grid.length, mounted]);

  useEffect(() => {
    const steps = [0, 18, 35, 52, 68, 84, 100];
    let i = 0;

    const interval = setInterval(() => {
      if (i < steps.length) {
        setLoadProgress(steps[i]);
        if (i < statusLines.length) setStatusLine(statusLines[i]);
        i++;
      } else {
        clearInterval(interval);
        runHeuristicChecks().then((passed) => {
          if (passed) {
            setPhase("success");
            setTimeout(() => onPassed(), 1000);
          } else {
            setPhase("blocked");
          }
        });
      }
    }, 280);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden">
      <div className="scan-line" />
      <div
        className="absolute inset-0 grid pointer-events-none select-none"
        style={{
          gridTemplateColumns: "repeat(8, 1fr)",
          gridTemplateRows: "repeat(6, 1fr)",
          opacity: 0.04,
        }}
      >
        {grid.map((char, i) => (
          <div
            key={i}
            className={`flex items-center justify-center font-mono text-xs text-green-400 transition-all duration-150 ${
              glitchIndex === i ? "text-red-400 opacity-80" : ""
            }`}
          >
            {char}
          </div>
        ))}
      </div>
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-green-400/30" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-green-400/30" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-green-400/30" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-green-400/30" />

      <div className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.4em] text-white/20 uppercase">
        ESCAPE THE MATRIX — SECURITY CHECKPOINT
      </div>
      {phase === "scanning" && (
        <div className="captcha-gate flex flex-col items-center gap-6 w-96">
          <div className="text-center mb-2">
            <div className="text-[10px] font-mono tracking-[0.5em] text-green-400/50 uppercase mb-3">
              — Access Verification —
            </div>
            <div className="text-white/60 font-mono text-sm tracking-wide">
              Automatic Check
            </div>
          </div>
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-green-400/20 animate-ping" style={{ animationDuration: "2s" }} />
            <div className="absolute inset-2 rounded-full border border-green-400/10" />
            <div className="text-green-400/60 font-mono text-3xl flicker">◉</div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <div className="w-full h-px bg-white/5 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-green-400/70 transition-all duration-300"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="text-white/25 font-mono text-[10px] tracking-widest cursor-blink">
                {statusLine}
              </div>
              <div className="text-green-400/40 font-mono text-[10px]">
                {loadProgress}%
              </div>
            </div>
          </div>
          <div className="w-full border border-white/5 rounded-sm p-4 bg-white/[0.01] flex flex-col gap-1.5">
            {statusLines.slice(0, Math.ceil((loadProgress / 100) * statusLines.length)).map((line, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-green-400/60 font-mono text-[10px]">✓</span>
                <span className="text-white/20 font-mono text-[10px] tracking-wider">{line}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {phase === "success" && (
        <div className="captcha-gate flex flex-col items-center gap-6 w-80 text-center">
          <div className="text-green-400/80 font-mono text-xs tracking-widest uppercase">
            — Access Granted —
          </div>
          <div className="text-6xl font-mono text-green-400/60 flicker">◉</div>
          <div className="text-white/60 font-mono text-sm tracking-wider">
            Verification Passed!
          </div>
          <div className="w-full h-px bg-white/5 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-green-400/50"
              style={{ width: "100%", transition: "width 0.8s ease" }}
            />
          </div>
        </div>
      )}
      {phase === "blocked" && (
        <div className="captcha-gate flex flex-col items-center gap-6 w-80 text-center">
          <div className="text-red-400/80 font-mono text-xs tracking-widest uppercase">
            — Access Denied —
          </div>
          <div className="text-5xl font-mono text-red-400/40">⊗</div>
          <div className="text-white/50 font-mono text-sm">
            Suspicious Activity
          </div>
          <div className="text-white/25 font-mono text-xs">
            Try to open website in other browser
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.3em] text-white/10 uppercase">
        Protected by Escape The Matrix Security
      </div>
    </div>
  );
}