"use client";

import { useState } from "react";
import { translations } from "@/lib/i18n";

const LANGS = ["ru", "en", "de", "zh"] as const;
type ProfileLang = typeof LANGS[number];

interface Props {
  onLogin: (data: any, key: string) => void;
}

export default function ProfileLogin({ onLogin }: Props) {
  const [lang, setLang] = useState<ProfileLang>("ru");
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = translations[lang].profile;

  const handleSubmit = async () => {
    if (!key.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: key.trim() }),
      });
      if (!res.ok) throw new Error("invalid");
      const data = await res.json();
      onLogin(data, key.trim());
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-green-500/5 blur-[120px] pointer-events-none" />

      <div className="absolute top-6 right-6 flex gap-1">
        {LANGS.map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-2 py-1 font-mono text-[10px] tracking-widest uppercase transition-all rounded-sm ${
              lang === l
                ? "border border-green-400/50 text-green-400"
                : "border border-white/10 text-white/25 hover:text-white/50"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <a
        href="/"
        className="absolute top-6 left-6 text-white/20 font-mono text-[10px] tracking-widest hover:text-green-400/60 transition-colors uppercase flex items-center gap-2"
      >
        ← escapethematrix.to
      </a>

      <div className="relative w-full max-w-md">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-green-400/40 to-transparent mb-8" />

        <div className="mb-8 text-center">
          <div className="text-[10px] font-mono tracking-[0.5em] text-green-400/40 uppercase mb-3">
            ◈ escape the matrix
          </div>
          <h1 className="font-mono text-2xl text-white/80 tracking-[0.2em] uppercase">
            {t.loginTitle}
          </h1>
        </div>

        <div className="border border-white/8 bg-white/[0.02] rounded-sm p-8 backdrop-blur-sm">
          <p className="text-white/35 font-mono text-xs leading-relaxed mb-6 text-center">
            {t.loginSub}
          </p>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={key}
              onChange={e => setKey(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder={t.placeholder}
              autoFocus
              className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-3 font-mono text-white/80 text-sm tracking-wider focus:outline-none focus:border-green-400/40 placeholder:text-white/15 transition-colors"
            />

            {error && (
              <div className="text-red-400/70 font-mono text-xs border border-red-400/15 px-3 py-2 rounded-sm bg-red-400/5">
                ⊗ {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!key.trim() || loading}
              className="w-full py-3 border border-green-400/30 text-green-400 font-mono text-xs tracking-[0.3em] uppercase hover:bg-green-400/8 hover:border-green-400/60 transition-all rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-3 h-3 border border-green-400/50 border-t-green-400 rounded-full animate-spin" />
                  {t.loading}
                </span>
              ) : (
                t.btn
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <a
              href="https://t.me/EscapeTheMatrixVPNBot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/18 font-mono text-[10px] tracking-wider hover:text-green-400/60 transition-colors"
            >
              {t.getKey}
            </a>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mt-8" />
      </div>
    </div>
  );
}