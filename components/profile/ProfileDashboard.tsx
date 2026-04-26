"use client";

import { useState } from "react";
import { translations } from "@/lib/i18n";
import PaymentModal from "./PaymentModal";
import VpnClientsSection from "./VpnClientsSection";

const LANGS = ["ru", "en", "de", "zh"] as const;
type ProfileLang = typeof LANGS[number];

interface ProfileData {
  tg_id: number;
  username?: string;
  subscription: "active" | "inactive" | "expired";
  expires_at: string | null;
  balance: number;
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

interface Props {
  profile: ProfileData;
  onLogout: () => void;
  onRefresh: () => void;
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function ProfileDashboard({ profile, onLogout, onRefresh }: Props) {
  const [lang, setLang] = useState<ProfileLang>("ru");
  const [copied, setCopied] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const t = translations[lang].profile;

  const days = daysUntil(profile.expires_at);
  const showWarning = profile.subscription === "active" && days !== null && days <= 7;

  const statusColor =
    profile.subscription === "active" ? "text-green-400" :
    profile.subscription === "expired" ? "text-red-400" : "text-white/30";

  const statusLabel =
    profile.subscription === "active" ? t.active :
    profile.subscription === "expired" ? t.expired : t.inactive;

  const expiresFormatted = profile.expires_at
    ? new Date(profile.expires_at).toLocaleDateString(
        lang === "zh" ? "zh-CN" : lang === "de" ? "de-DE" : lang === "en" ? "en-GB" : "ru-RU",
        { day: "numeric", month: "long", year: "numeric" }
      )
    : "—";

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative">
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-green-500/5 blur-[100px] pointer-events-none" />

      <header className="relative border-b border-white/6 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <a href="/" className="text-white/25 font-mono text-[10px] tracking-[0.4em] hover:text-green-400/60 transition-colors uppercase">
          ← escapethematrix.to
        </a>

        <div className="text-[10px] font-mono tracking-[0.5em] text-green-400/40 uppercase hidden sm:block">
          ◈ personal account
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {LANGS.map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 font-mono text-[10px] tracking-widest uppercase transition-all rounded-sm ${
                  lang === l
                    ? "border border-green-400/50 text-green-400"
                    : "border border-white/8 text-white/20 hover:text-white/40"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            className="px-3 py-1.5 border border-white/8 text-white/25 font-mono text-[10px] hover:border-white/20 hover:text-white/50 transition-all rounded-sm"
            title={t.refresh}
          >
            {refreshing ? (
              <span className="inline-block w-3 h-3 border border-white/30 border-t-white/70 rounded-full animate-spin" />
            ) : "↻"}
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-1.5 border border-white/8 text-white/25 font-mono text-[10px] hover:border-red-400/30 hover:text-red-400/60 transition-all rounded-sm uppercase tracking-wider"
          >
            {t.logout}
          </button>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
        <div>
          <div className="font-mono text-white/25 text-xs tracking-widest uppercase mb-1">{t.greeting}</div>
          <h1 className="font-mono text-xl text-white/70">
            {profile.username ? `@${profile.username}` : `ID ${profile.tg_id}`}
          </h1>
        </div>

        {showWarning && days !== null && (
          <div className="border border-amber-400/30 bg-amber-400/5 rounded-sm px-4 py-3 font-mono text-xs text-amber-400/80 flex items-center gap-2">
            <span className="text-lg">⚠</span>
            <span>{days === 0 ? t.expiresToday : t.expiresSoon(days)}</span>
            <button
              onClick={() => setShowPayment(true)}
              className="ml-auto px-3 py-1 border border-amber-400/40 text-amber-400 text-[10px] tracking-widest uppercase hover:bg-amber-400/10 transition-all rounded-sm"
            >
              {t.renew}
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="border border-white/6 bg-white/[0.02] rounded-sm p-4 col-span-2 sm:col-span-1">
            <div className="text-white/25 font-mono text-[10px] tracking-widest uppercase mb-2">{t.status}</div>
            <div className={`font-mono text-lg font-bold ${statusColor}`}>{statusLabel}</div>
            {profile.subscription === "active" && days !== null && (
              <div className="font-mono text-[10px] text-white/30 mt-1">{t.daysLeft(days)}</div>
            )}
          </div>

          <div className="border border-white/6 bg-white/[0.02] rounded-sm p-4">
            <div className="text-white/25 font-mono text-[10px] tracking-widest uppercase mb-2">{t.expires}</div>
            <div className="font-mono text-sm text-white/60 leading-tight">{expiresFormatted}</div>
          </div>

          <div className="border border-white/6 bg-white/[0.02] rounded-sm p-4">
            <div className="text-white/25 font-mono text-[10px] tracking-widest uppercase mb-2">{t.balance}</div>
            <div className="font-mono text-lg font-bold text-white/80">{profile.balance} {t.rub}</div>
          </div>

          <div className="border border-white/6 bg-white/[0.02] rounded-sm p-4">
            <div className="text-white/25 font-mono text-[10px] tracking-widest uppercase mb-2">{t.devices}</div>
            <div className="font-mono text-lg">
              <span className="text-green-400 font-bold">{profile.devices_used}</span>
              <span className="text-white/25"> / {profile.devices_max}</span>
            </div>
            {profile.devices_max > 0 && (
              <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400/50 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (profile.devices_used / profile.devices_max) * 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setShowPayment(true)}
            className="px-6 py-3 border border-green-400/30 text-green-400 font-mono text-xs tracking-[0.3em] uppercase hover:bg-green-400/8 hover:border-green-400/60 transition-all rounded-sm"
          >
            + {t.topup}
          </button>
          <a
            href="https://t.me/EscapeTheMatrixVPNBot"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-white/8 text-white/30 font-mono text-xs tracking-[0.3em] uppercase hover:border-white/20 hover:text-white/50 transition-all rounded-sm"
          >
            {t.manage}
          </a>
        </div>

        {profile.configs.length > 0 ? (
          <div>
            <div className="text-[10px] font-mono tracking-[0.4em] text-white/25 uppercase mb-3">
              — {t.configs}
            </div>
            <div className="flex flex-col gap-2">
              {profile.configs.map((cfg, i) => (
                <div key={i} className="border border-white/6 bg-white/[0.015] rounded-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cfg.flag}</span>
                      <div>
                        <div className="font-mono text-white/60 text-xs font-bold">{cfg.city}</div>
                        <div className="font-mono text-white/25 text-[10px]">{cfg.ping}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(cfg.vless_link, `cfg-${i}`)}
                      className={`px-3 py-1.5 border font-mono text-[10px] tracking-wider transition-all rounded-sm ${
                        copied === `cfg-${i}`
                          ? "border-green-400/40 text-green-400"
                          : "border-white/8 text-white/30 hover:border-green-400/25 hover:text-green-400/70"
                      }`}
                    >
                      {copied === `cfg-${i}` ? t.copied : t.copy}
                    </button>
                  </div>
                  <code className="block bg-black/40 border border-white/5 rounded-sm px-3 py-2 text-[10px] text-white/30 truncate font-mono">
                    {cfg.vless_link}
                  </code>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="border border-white/5 rounded-sm p-6 text-center">
            <div className="text-white/25 font-mono text-sm mb-3">{t.noSub}</div>
            <a
              href="https://t.me/EscapeTheMatrixVPNBot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400/60 font-mono text-xs hover:text-green-400 transition-colors"
            >
              {t.getSub}
            </a>
          </div>
        )}

        <div>
          <div className="text-[10px] font-mono tracking-[0.4em] text-white/25 uppercase mb-3">
            — {t.clients}
          </div>
          <VpnClientsSection lang={lang} />
        </div>
      </main>

      {showPayment && (
        <PaymentModal
          lang={lang}
          balance={profile.balance}
          tgId={profile.tg_id}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}