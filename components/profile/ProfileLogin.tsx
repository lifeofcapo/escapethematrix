"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [showKeyForm, setShowKeyForm] = useState(false);
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

  const handleGoogle = () => {
    setGoogleLoading(true);
    signIn("google", { callbackUrl: "/profile" });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-green-500/5 blur-[140px] pointer-events-none" />
      <div className="absolute top-6 right-6 flex gap-1.5">
        {LANGS.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-2.5 py-1.5 font-mono text-xs tracking-widest uppercase transition-all rounded-sm ${
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
        className="absolute top-6 left-6 text-white/20 font-mono text-xs tracking-widest hover:text-green-400/60 transition-colors uppercase flex items-center gap-2"
      >
        ← escapethematrix.to
      </a>
      <div className="relative w-full max-w-sm">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-green-400/40 to-transparent mb-10" />

        <div className="mb-8 text-center">
          <div className="text-xs font-mono tracking-[0.5em] text-green-400/40 uppercase mb-4">
            ◈ escape the matrix
          </div>
          <h1 className="font-mono text-3xl text-white/85 tracking-[0.15em] uppercase">
            {t.loginTitle}
          </h1>
        </div>

        <div className="border border-white/8 bg-white/[0.025] rounded-sm p-8 backdrop-blur-sm flex flex-col gap-4">
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="relative w-full py-4 border border-white/12 bg-white/[0.04] rounded-sm font-mono text-sm tracking-wider text-white/80 hover:border-green-400/30 hover:bg-white/[0.07] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-center gap-3">
              {googleLoading ? (
                <span className="inline-block w-4 h-4 border border-white/30 border-t-white/80 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              <span>
                {googleLoading
                  ? lang === "ru" ? "Вход..." : "Signing in..."
                  : lang === "ru" ? "Войти через Google"
                  : lang === "de" ? "Mit Google anmelden"
                  : lang === "zh" ? "通过 Google 登录"
                  : "Continue with Google"}
              </span>
            </div>
          </button>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/6" />
            <span className="font-mono text-xs text-white/20 tracking-widest uppercase">
              {lang === "ru" ? "или" : lang === "de" ? "oder" : lang === "zh" ? "或" : "or"}
            </span>
            <div className="flex-1 h-px bg-white/6" />
          </div>
          {!showKeyForm ? (
            <button
              onClick={() => setShowKeyForm(true)}
              className="w-full py-3.5 border border-white/8 text-white/35 font-mono text-sm tracking-wider rounded-sm hover:border-white/18 hover:text-white/55 transition-all"
            >
              {lang === "ru" ? "Войти по ключу профиля" : lang === "de" ? "Mit Profilschlüssel" : lang === "zh" ? "使用个人密钥" : "Sign in with profile key"}
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-white/30 font-mono text-xs leading-relaxed text-center">
                {t.loginSub}
              </p>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
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
                className="w-full py-3.5 border border-green-400/30 text-green-400 font-mono text-sm tracking-[0.3em] uppercase hover:bg-green-400/8 hover:border-green-400/60 transition-all rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
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

              <button
                onClick={() => { setShowKeyForm(false); setError(""); setKey(""); }}
                className="text-white/20 font-mono text-xs hover:text-white/40 transition-colors text-center"
              >
                ← {lang === "ru" ? "Назад" : lang === "de" ? "Zurück" : lang === "zh" ? "返回" : "Back"}
              </button>
            </div>
          )}

          <div className="text-center mt-1">
            <a
              href="https://t.me/EscapeTheMatrixVPNBot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/18 font-mono text-xs tracking-wider hover:text-green-400/60 transition-colors"
            >
              {t.getKey}
            </a>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mt-10" />
      </div>
    </div>
  );
}