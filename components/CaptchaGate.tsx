"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface CaptchaGateProps {
  onPassed: () => void;
}

// Генерируем случайную math-задачу
function generateChallenge() {
  const ops = ["+", "-", "×"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;
  if (op === "+") {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
    answer = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * 20) + 10;
    b = Math.floor(Math.random() * 10) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 9) + 2;
    b = Math.floor(Math.random() * 9) + 2;
    answer = a * b;
  }
  return { a, b, op, answer };
}

// Генерируем сетку из символов
function generateGrid(rows = 6, cols = 8) {
  const chars = "01アイウエオカキクケコ∆◈◎◬◆◉◐░▒▓";
  return Array.from({ length: rows * cols }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  );
}

export default function CaptchaGate({ onPassed }: CaptchaGateProps) {
  const [phase, setPhase] = useState<"loading" | "challenge" | "success" | "error">("loading");
  const [challenge, setChallenge] = useState(generateChallenge());
  const [input, setInput] = useState("");
  const [grid, setGrid] = useState(generateGrid());
  const [attempts, setAttempts] = useState(0);
  const [shake, setShake] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [glitchIndex, setGlitchIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Фаза загрузки — имитация системного сканирования
  useEffect(() => {
    const steps = [0, 15, 35, 55, 70, 88, 100];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setLoadProgress(steps[i]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase("challenge"), 300);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Случайный глитч символов в сетке
  useEffect(() => {
    const chars = "01アイウエオカキクケコ∆◈◎◬◆◉◐░▒▓";
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * grid.length);
      setGlitchIndex(idx);
      setGrid(prev => {
        const next = [...prev];
        next[idx] = chars[Math.floor(Math.random() * chars.length)];
        return next;
      });
      setTimeout(() => setGlitchIndex(null), 150);
    }, 120);
    return () => clearInterval(interval);
  }, [grid.length]);

  // Блокировка на 30 сек после 3 неверных попыток
  useEffect(() => {
    if (attempts >= 3) {
      setCountdown(30);
      setPhase("error");
    }
  }, [attempts]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setAttempts(0);
      setCountdown(null);
      setChallenge(generateChallenge());
      setInput("");
      setPhase("challenge");
      return;
    }
    const t = setTimeout(() => setCountdown(c => (c ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);
  useEffect(() => {
    if (phase === "challenge") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [phase]);

  const handleSubmit = useCallback(() => {
    const val = parseInt(input.trim(), 10);
    if (val === challenge.answer) {
      setPhase("success");
      setTimeout(() => onPassed(), 1200);
    } else {
      setShake(true);
      setAttempts(a => a + 1);
      setInput("");
      setChallenge(generateChallenge());
      setTimeout(() => setShake(false), 500);
    }
  }, [input, challenge.answer, onPassed]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden">
      <div className="scan-line" />
      <div className="absolute inset-0 grid pointer-events-none select-none"
        style={{ gridTemplateColumns: "repeat(8, 1fr)", gridTemplateRows: "repeat(6, 1fr)", opacity: 0.04 }}>
        {grid.map((char, i) => (
          <div key={i} className={`flex items-center justify-center font-mono text-xs text-green-400 transition-all duration-150 ${glitchIndex === i ? "text-red-400 opacity-80" : ""}`}>
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
      {phase === "loading" && (
        <div className="captcha-gate flex flex-col items-center gap-6 w-80">
          <div className="text-green-400/60 font-mono text-xs tracking-widest uppercase">Initializing...</div>
          <div className="w-full h-px bg-white/5 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-green-400/70 transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <div className="text-white/20 font-mono text-[10px] tracking-widest">
            SCANNING ENVIRONMENT {loadProgress}%
          </div>
        </div>
      )}
      {phase === "challenge" && (
        <div className={`captcha-gate flex flex-col items-center gap-8 w-96 ${shake ? "animate-[shake_0.4s_ease]" : ""}`}
          style={shake ? { animation: "shake 0.4s ease" } : {}}>
          <div className="text-center">
            <div className="text-[10px] font-mono tracking-[0.5em] text-green-400/50 uppercase mb-3">
              — Access Verification —
            </div>
            <div className="text-white/80 font-mono text-sm tracking-wide">
              Подтвердите, что вы человек
            </div>
          </div>
          <div className="relative border border-white/8 rounded-sm p-8 w-full bg-white/[0.02] text-center">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />
            <div className="text-xs font-mono text-white/30 tracking-widest uppercase mb-4">
              Решите пример
            </div>
            <div className="text-4xl font-mono font-bold text-white flicker">
              {challenge.a} <span className="text-green-400">{challenge.op}</span> {challenge.b} <span className="text-white/30">=</span>
            </div>
          </div>
          <div className="w-full flex gap-3">
            <input
              ref={inputRef}
              type="number"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ответ..."
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-sm px-4 py-3 font-mono text-white text-sm tracking-wider focus:outline-none focus:border-green-400/50 placeholder:text-white/20 transition-colors"
              style={{ appearance: "textfield" }}
            />
            <button
              onClick={handleSubmit}
              className="px-6 py-3 border border-green-400/30 text-green-400 font-mono text-xs tracking-widest uppercase hover:bg-green-400/10 hover:border-green-400/60 transition-all rounded-sm"
            >
              →
            </button>
          </div>
          <div className="flex gap-2 items-center">
            {[0, 1, 2].map(i => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i < attempts ? "bg-red-400/60" : "bg-white/15"}`} />
            ))}
            <span className="text-white/20 font-mono text-[10px] ml-2">
              {3 - attempts} попытки осталось
            </span>
          </div>
        </div>
      )}
      {phase === "error" && (
        <div className="captcha-gate flex flex-col items-center gap-6 w-80 text-center">
          <div className="text-red-400/80 font-mono text-xs tracking-widest uppercase">
            — Access Denied —
          </div>
          <div className="text-5xl font-mono text-red-400/40">⊗</div>
          <div className="text-white/50 font-mono text-sm">
            Слишком много попыток
          </div>
          <div className="text-white/25 font-mono text-xs">
            Повторная попытка через{" "}
            <span className="text-red-400/70 font-bold text-sm">{countdown}s</span>
          </div>
          <div className="w-full h-px bg-white/5 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-red-400/40 transition-all duration-1000"
              style={{ width: `${((30 - (countdown ?? 0)) / 30) * 100}%` }}
            />
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
            Верификация пройдена
          </div>
          <div className="w-full h-px bg-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-green-400/50" style={{ width: "100%", transition: "width 1s ease" }} />
          </div>
        </div>
      )}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.3em] text-white/10 uppercase">
        Protected by Escape The Matrix Security
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
      `}</style>
    </div>
  );
}