"use client";

import { useState, useEffect } from "react";

interface ProfileModalProps {
  t: any;
  onClose: () => void;
}

interface ProfileData {
  tg_id: number;
  username?: string;
  subscription: string;       // "active" | "inactive" | "expired"
  expires_at: string;         // ISO date
  balance: number;            // в рублях
  devices_used: number;
  devices_max: number;
  configs: {
    region: string;
    city: string;
    flag: string;
    vless_link: string;
    ping: string;
  }[];
}


const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.escapethematrix.to";

async function verifyToken(token: string): Promise<ProfileData> {
  const res = await fetch(`${API_BASE}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "invalid_token");
  }
  return res.json();
}

export default function ProfileModal({ t, onClose }: ProfileModalProps) {
  const [phase, setPhase] = useState<"input" | "loading" | "profile">("input");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Закрытие по Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleLogin = async () => {
    if (!token.trim()) return;
    setError("");
    setPhase("loading");
    try {
      const data = await verifyToken(token.trim());
      setProfile(data);
      setPhase("profile");
    } catch {
      setError(t.profile.error ?? "Неверный токен. Проверьте и попробуйте снова.");
      setPhase("input");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const statusColor =
    profile?.subscription === "active" ? "text-green-400" :
    profile?.subscription === "expired" ? "text-red-400/80" : "text-white/30";

  const statusLabel =
    profile?.subscription === "active" ? (t.profile.statusActive ?? "Активна") :
    profile?.subscription === "expired" ? "Истекла" : (t.profile.statusInactive ?? "Неактивна");

  const expiresFormatted = profile?.expires_at
    ? new Date(profile.expires_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <div className="text-[10px] font-mono tracking-[0.4em] text-green-400/50 uppercase">
              — {t.profile.title ?? "Профиль"}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/70 font-mono text-lg transition-colors"
          >
            ✕
          </button>
        </div>
        {phase === "input" && (
          <div className="p-6 flex flex-col gap-5">
            <p className="text-white/40 font-mono text-xs leading-relaxed">
              {t.profile.sub ?? "Получите токен в боте @EscapeTheMatrix_Robot и введите его ниже."}
            </p>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={token}
                onChange={e => setToken(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder={t.profile.placeholder ?? "Введите токен доступа..."}
                className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-3 font-mono text-white/80 text-sm tracking-wider focus:outline-none focus:border-green-400/40 placeholder:text-white/20 transition-colors"
                autoFocus
              />

              {error && (
                <div className="text-red-400/70 font-mono text-xs border border-red-400/20 px-3 py-2 rounded-sm bg-red-400/5">
                  ⊗ {error}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={!token.trim()}
                className="w-full py-3 border border-green-400/30 text-green-400 font-mono text-xs tracking-widest uppercase hover:bg-green-400/10 hover:border-green-400/60 transition-all rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {t.profile.btn ?? "Войти"}
              </button>
            </div>

            <div className="text-center">
              <a
                href="https://t.me/EscapeTheMatrix_Robot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/20 font-mono text-[10px] tracking-wider hover:text-green-400/60 transition-colors"
              >
                Получить токен →
              </a>
            </div>
          </div>
        )}
        {phase === "loading" && (
          <div className="p-10 flex flex-col items-center gap-4">
            <div className="text-green-400/50 font-mono text-2xl flicker">◉</div>
            <div className="text-white/30 font-mono text-xs tracking-widest uppercase">
              {t.profile.loading ?? "Проверка токена..."}
            </div>
          </div>
        )}
        {phase === "profile" && profile && (
          <div className="p-6 flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-white/6 rounded-sm p-4 bg-white/[0.02]">
                <div className="text-white/25 font-mono text-[10px] tracking-widest uppercase mb-1">Подписка</div>
                <div className={`font-mono text-sm font-bold ${statusColor}`}>{statusLabel}</div>
              </div>
              <div className="border border-white/6 rounded-sm p-4 bg-white/[0.02]">
                <div className="text-white/25 font-mono text-[10px] tracking-widest uppercase mb-1">Баланс</div>
                <div className="font-mono text-sm font-bold text-white/80">{profile.balance} ₽</div>
              </div>
              <div className="border border-white/6 rounded-sm p-4 bg-white/[0.02]">
                <div className="text-white/25 font-mono text-[10px] tracking-widest uppercase mb-1">Истекает</div>
                <div className="font-mono text-xs text-white/60">{expiresFormatted}</div>
              </div>
              <div className="border border-white/6 rounded-sm p-4 bg-white/[0.02]">
                <div className="text-white/25 font-mono text-[10px] tracking-widest uppercase mb-1">Устройства</div>
                <div className="font-mono text-sm text-white/80">
                  <span className="text-green-400">{profile.devices_used}</span>
                  <span className="text-white/30"> / {profile.devices_max}</span>
                </div>
              </div>
            </div>
            {profile.configs.length > 0 && (
              <div>
                <div className="text-[10px] font-mono tracking-[0.4em] text-white/25 uppercase mb-3">
                  — Серверы и конфиги
                </div>
                <div className="flex flex-col gap-3">
                  {profile.configs.map((cfg, i) => (
                    <div key={i} className="border border-white/6 rounded-sm p-4 bg-white/[0.02] group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{cfg.flag}</span>
                          <div>
                            <div className="font-mono text-sm text-white/80 font-bold">{cfg.city}</div>
                            <div className="font-mono text-[10px] text-white/30 uppercase tracking-wider">{cfg.region}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-white/35 font-mono text-[10px]">{cfg.ping}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-black/40 border border-white/5 rounded-sm px-3 py-2 font-mono text-[10px] text-white/30 truncate">
                          {cfg.vless_link}
                        </code>
                        <button
                          onClick={() => copyToClipboard(cfg.vless_link, `vless-${i}`)}
                          className="px-3 py-2 border border-white/8 text-white/30 font-mono text-[10px] hover:border-green-400/30 hover:text-green-400 transition-all rounded-sm whitespace-nowrap"
                        >
                          {copied === `vless-${i}` ? "✓ Скопировано" : "Копировать"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3 pt-1">
              <a
                href="https://t.me/EscapeTheMatrix_Robot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-3 border border-green-400/25 text-green-400/80 font-mono text-xs tracking-widest uppercase hover:border-green-400/50 hover:text-green-400 transition-all rounded-sm"
              >
                {t.profile.manage ?? "Управление в боте"}
              </a>
              <button
                onClick={() => { setPhase("input"); setToken(""); setProfile(null); }}
                className="px-4 py-3 border border-white/8 text-white/30 font-mono text-xs hover:border-white/20 hover:text-white/50 transition-all rounded-sm"
              >
                {t.profile.close ?? "Выйти"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}