"use client";

import { useState } from "react";
import { translations } from "@/lib/i18n";
import PaymentModal from "./PaymentModal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { signOut } from "next-auth/react";

import {
  Language,
  ProfileData,
  SubscriptionPlan,
  VPNClient,
} from "@/lib/types";

const LANGS: Language[] = ["ru", "en", "es", "de", "zh"];

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

const VPN_CLIENTS: VPNClient[] = [
  {
    name: "Happ",
    platforms: [
      "iOS",
      "Android",
      "Windows",
      "macOS",
      "Linux",
      "Android TV",
      "Apple TV",
    ],
    icon: "◆",
    accent: "#60a5fa",
    badge: {
      ru: "Рекомендуем",
      en: "Recommended",
      es: "Recomendado",
      de: "Empfohlen",
      zh: "推荐",
    },
    links: [
      {
        label: "App Store (RU)",
        url: "https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973",
      },
      {
        label: "App Store (Global)",
        url: "https://apps.apple.com/us/app/happ-proxy-utility/id6504287215",
      },
      {
        label: "Google Play",
        url: "https://play.google.com/store/apps/details?id=com.happproxy&pli=1",
      },
      {
        label: "Windows (x64)",
        url: "https://github.com/Happ-proxy/happ-desktop/releases/latest/download/setup-Happ.x64.exe",
      },
      {
        label: "Linux Debian",
        url: "https://github.com/Happ-proxy/happ-desktop/releases/latest/download/Happ.linux.x64.deb",
      },
    ],
  },

  {
    name: "FlClashX",
    platforms: [
      "Android",
      "Windows",
      "macOS",
      "Linux",
      "Android TV",
    ],
    icon: "⬢",
    accent: "#22c55e",
    badge: {
      ru: "Рекомендуем",
      en: "Recommended",
      es: "Recomendado",
      de: "Empfohlen",
      zh: "推荐",
    },
    links: [
      {
        label: "GitHub Releases",
        url: "https://github.com/pluralplay/FlClashX/releases/latest",
      },

      {
        label: "macOS ARM64",
        url: "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClash-darwin-arm64.dmg",
      },
      {
        label: "macOS AMD64",
        url: "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClash-darwin-amd64.dmg",
      },

      {
        label: "Windows",
        url: "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClash-windows-amd64-setup.exe",
      },

      {
        label: "Linux AppImage",
        url: "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClash-linux-amd64.AppImage",
      },

      {
        label: "Android APK",
        url: "https://github.com/pluralplay/FlClashX/releases/latest/download/app-release.apk",
      },

      {
        label: "Android TV Guide",
        url: "https://club.dns-shop.ru/blog/t-132-televizoryi/43999-failyi-apk-dlya-umnyih-televizorov-na-android/?utm_referrer=https%3A%2F%2Fwww.google.com%2F",
      },
    ],
  },

  {
    name: "Incy",
    platforms: ["iOS", "Android", "macOS"],
    icon: "◈",
    accent: "#4ade80",
    badge: {
      ru: "Новый",
      en: "New",
      es: "Nuevo",
      de: "Neu",
      zh: "新",
    },
    links: [
      {
        label: "App Store",
        url: "https://apps.apple.com/ru/app/incy/id6756943388",
      },
      {
        label: "Google Play",
        url: "https://play.google.com/store/apps/details?id=llc.itdev.incy&hl=ru&pli=1",
      },
    ],
  },

  {
    name: "V2RayTun",
    platforms: ["iOS", "Android"],
    icon: "▲",
    accent: "#34d399",
    badge: null,
    links: [
      {
        label: "iOS",
        url: "https://apps.apple.com/us/app/v2raytun/id6476628951",
      },
      {
        label: "Google Play",
        url: "https://play.google.com/store/apps/details?id=com.v2raytun.android",
      },
    ],
  },

  {
    name: "ClashMi",
    platforms: ["iOS"],
    icon: "◉",
    accent: "#c084fc",
    badge: null,
    links: [
      {
        label: "App Store",
        url: "https://apps.apple.com/us/app/clash-mi/id6744321968",
      },
    ],
  },

  {
    name: "NekoBox",
    platforms: ["Android"],
    icon: "◬",
    accent: "#fb923c",
    badge: null,
    links: [
      {
        label: "GitHub",
        url: "https://github.com/MatsuriDayo/NekoBoxForAndroid/releases/latest",
      },
    ],
  },

  {
    name: "NekoRay",
    platforms: ["Windows", "Linux"],
    icon: "◐",
    accent: "#f97316",
    badge: {
      ru: "Продвинутый",
      en: "Advanced",
      es: "Avanzado",
      de: "Erweitert",
      zh: "高级",
    },
    links: [
      {
        label: "GitHub",
        url: "https://github.com/MatsuriDayo/nekoray/releases/latest",
      },
    ],
  },

  {
    name: "Streisand",
    platforms: ["iOS", "macOS"],
    icon: "✦",
    accent: "#818cf8",
    badge: {
      ru: "iPhone",
      en: "iPhone",
      es: "iPhone",
      de: "iPhone",
      zh: "iPhone",
    },
    links: [
      {
        label: "App Store",
        url: "https://apps.apple.com/app/streisand/id6450534064",
      },
    ],
  },
];

const PLANS: Record<Language, SubscriptionPlan[]> = {
  ru: [
    { label: "1 месяц", price: "100 ₽", days: 30, desc: "Финляндия или Нидерланды" },
    { label: "3 месяца", price: "270 ₽", days: 90, desc: "Скидка 10%" },
    { label: "6 месяцев", price: "500 ₽", days: 180, desc: "Скидка 17%" },
    { label: "1 год", price: "900 ₽", days: 365, desc: "Скидка 25%" },
  ],
  en: [
    { label: "1 month", price: "100 ₽", days: 30, desc: "Finland or Netherlands" },
    { label: "3 months", price: "270 ₽", days: 90, desc: "10% discount" },
    { label: "6 months", price: "500 ₽", days: 180, desc: "17% discount" },
    { label: "1 year", price: "900 ₽", days: 365, desc: "25% discount" },
  ],
  es: [
    { label: "1 mes", price: "100 ₽", days: 30, desc: "Finlandia o Países Bajos" },
    { label: "3 meses", price: "270 ₽", days: 90, desc: "10% de descuento" },
    { label: "6 meses", price: "500 ₽", days: 180, desc: "17% de descuento" },
    { label: "1 año", price: "900 ₽", days: 365, desc: "25% de descuento" },
  ],
  de: [
    { label: "1 Monat", price: "100 ₽", days: 30, desc: "Finnland oder Niederlande" },
    { label: "3 Monate", price: "270 ₽", days: 90, desc: "10% Rabatt" },
    { label: "6 Monate", price: "500 ₽", days: 180, desc: "17% Rabatt" },
    { label: "1 Jahr", price: "900 ₽", days: 365, desc: "25% Rabatt" },
  ],
  zh: [
    { label: "1个月", price: "100 ₽", days: 30, desc: "芬兰或荷兰" },
    { label: "3个月", price: "270 ₽", days: 90, desc: "9折优惠" },
    { label: "6个月", price: "500 ₽", days: 180, desc: "83折优惠" },
    { label: "1年", price: "900 ₽", days: 365, desc: "75折优惠" },
  ],
};

function SubscriptionModal({
  lang, balance, tgId, mode, currentRegion, onClose, onSuccess,
}: {
  lang: Language;
  balance: number;
  tgId: number;
  mode: "buy" | "renew";
  currentRegion?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const t = translations[lang].profile.dashboard;
  const plans = PLANS[lang];
  const [selected, setSelected] = useState(0);
  const [region, setRegion] = useState<"fi" | "nl">(
    mode === "renew" && currentRegion === "nl" ? "nl" : "fi"
  );
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const plan = plans[selected];
  const priceNum = parseInt(plan.price.replace(/\D/g, ""));
  const canAfford = balance >= priceNum;

  const handleBuy = async () => {
    if (!canAfford || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/subscription/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tg_id: tgId, days: plan.days, amount: priceNum, region }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm bg-[#080808] border border-white/10 rounded-sm shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />

        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
          <div>
            <div className="text-[10px] font-mono tracking-[0.4em] text-green-400/50 uppercase">
              ◈ {mode === "buy" ? t.buyTitle : t.renewTitle}
            </div>
            <div className="font-mono text-sm text-white/40 mt-0.5">
              {t.balance}: <span className="text-white/70">{balance} {t.rub}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-white/25 hover:text-white/60 font-mono text-lg transition-colors">✕</button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {mode === "buy" && (
            <div>
              <div className="text-white/30 font-mono text-xs tracking-widest uppercase mb-2">
                {t.selectRegion}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(["fi", "nl"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegion(r)}
                    className={`py-3 px-4 border rounded-sm font-mono text-sm transition-all text-left ${
                      region === r
                        ? "border-green-400/50 bg-green-400/6 text-green-400"
                        : "border-white/8 text-white/45 hover:border-white/18"
                    }`}
                  >
                    {r === "fi" ? t.regionFi : t.regionNl}
                  </button>
                ))}
              </div>
            </div>
          )}
          {mode === "renew" && (
            <div className="font-mono text-xs text-white/25 border border-white/6 rounded-sm px-3 py-2.5">
              {t.selectRegion}: <span className="text-white/50">{region === "nl" ? t.regionNl : t.regionFi}</span>
            </div>
          )}

          <div className="text-white/30 font-mono text-xs tracking-widest uppercase">{t.selectPlan}</div>

          <div className="grid grid-cols-2 gap-2">
            {plans.map((p, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`p-3.5 border rounded-sm text-left transition-all ${
                  selected === i
                    ? "border-green-400/50 bg-green-400/6"
                    : "border-white/8 hover:border-white/15"
                }`}
              >
                <div className={`font-mono text-sm font-bold ${selected === i ? "text-green-400" : "text-white/70"}`}>
                  {p.price}
                </div>
                <div className="font-mono text-xs text-white/40 mt-0.5">{p.label}</div>
                <div className="font-mono text-[10px] text-white/20 mt-1">{p.desc}</div>
              </button>
            ))}
          </div>

          {done ? (
            <div className="py-4 text-center font-mono text-green-400 text-sm tracking-wider">
              {t.purchaseOk}
            </div>
          ) : canAfford ? (
            <button
              onClick={handleBuy}
              disabled={loading}
              className="w-full py-4 bg-green-400 text-[#080808] font-mono text-sm font-bold tracking-wider uppercase hover:bg-green-300 transition-all rounded-sm disabled:opacity-50"
            >
              {loading ? t.purchaseProcessing : `${mode === "buy" ? t.buyBtn : t.renewBtn} ${plan.price}`}
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="py-3 text-center font-mono text-xs text-amber-400/70 border border-amber-400/20 rounded-sm bg-amber-400/5">
                {t.insufficientBalance}
              </div>
              <button
                onClick={onClose}
                className="w-full py-3.5 border border-green-400/30 text-green-400 font-mono text-sm tracking-wider hover:bg-green-400/8 transition-all rounded-sm"
              >
                {t.topupFirst}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default function ProfileDashboard({ profile, onLogout, onRefresh }: Props) {
  const [lang, setLang] = useState<Language>("ru");
  const [copied, setCopied] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);  
  const [showPayment, setShowPayment] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [subMode, setSubMode] = useState<"buy" | "renew">("buy");
  const [refreshing, setRefreshing] = useState(false);
  const t = translations[lang].profile.dashboard;

  const days = daysUntil(profile.expires_at);
  const showWarning = profile.subscription === "active" && days !== null && days <= 7;

  const statusColor =
    profile.subscription === "active" ? "text-green-400" :
    profile.subscription === "expired" ? "text-red-400/80" : "text-white/30";
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
  
  const handleLogout = async () => {
  try {
    localStorage.removeItem("profile_key");

    sessionStorage.clear();

    await signOut({
      redirect: false,
    });

    window.location.href = "/profile";
  } catch (err) {
    console.error(err);
  }
};

  const openBuy = () => { setSubMode("buy"); setShowSubscription(true); };
  const openRenew = () => { setSubMode("renew"); setShowSubscription(true); };
  const refLink = `https://t.me/${profile.bot_username ?? "EscapeTheMatrixVPNBot"}?start=${profile.tg_id}`;
  const refCount = profile.referrals ?? 0;
  return (
    <div className="min-h-screen bg-[#050505] text-white relative">
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[280px] bg-green-500/5 blur-[100px] pointer-events-none" />
      <Navbar
        t={translations[lang]}
        lang={lang}
        setLang={setLang}
        isAuthenticated={true}
        onLogout={handleLogout}
      />

      <main className="relative max-w-5xl mx-auto px-4 pt-28 pb-10 flex flex-col gap-8">
        <div>
          <div className="font-mono text-white/30 text-sm tracking-widest uppercase mb-1">{t.greeting}</div>
          <h1 className="font-mono text-2xl text-white/75">
            {profile.username ? `@${profile.username}` : `ID ${profile.tg_id}`}
          </h1>
        </div>
        {showWarning && days !== null && (
          <div className="border border-amber-400/30 bg-amber-400/5 rounded-sm px-5 py-4 font-mono text-sm text-amber-400/80 flex items-center gap-3">
            <span className="text-xl flex-shrink-0">⚠</span>
            <span>{days === 0 ? t.expiresToday : t.expiresSoon(days)}</span>
            <button
              onClick={openRenew}
              className="ml-auto px-4 py-2 border border-amber-400/40 text-amber-400 text-xs tracking-widest uppercase hover:bg-amber-400/10 transition-all rounded-sm flex-shrink-0"
            >
              {t.renew}
            </button>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="border border-white/6 bg-white/[0.02] rounded-sm p-5 col-span-2 sm:col-span-1">
            <div className="text-white/30 font-mono text-xs tracking-widest uppercase mb-2">{t.status}</div>
            <div className={`font-mono text-xl font-bold ${statusColor}`}>{statusLabel}</div>
            {profile.subscription === "active" && days !== null && (
              <div className="font-mono text-xs text-white/30 mt-1">{t.daysLeft(days)}</div>
            )}
          </div>
          <div className="border border-white/6 bg-white/[0.02] rounded-sm p-5">
            <div className="text-white/30 font-mono text-xs tracking-widest uppercase mb-2">{t.expires}</div>
            <div className="font-mono text-base text-white/60 leading-snug">{expiresFormatted}</div>
          </div>
          <div className="border border-white/6 bg-white/[0.02] rounded-sm p-5">
            <div className="text-white/30 font-mono text-xs tracking-widest uppercase mb-2">{t.balance}</div>
            <div className="font-mono text-xl font-bold text-white/80">{profile.balance} <span className="text-white/30 text-sm font-normal">{t.rub}</span></div>
          </div>

          <div className="border border-white/6 bg-white/[0.02] rounded-sm p-5">
            <div className="text-white/30 font-mono text-xs tracking-widest uppercase mb-2">{t.devices}</div>
            <div className="font-mono text-xl">
              <span className="text-green-400 font-bold">{profile.devices_max}</span>
            </div>
            <div className="font-mono text-[10px] text-white/25 mt-1">
              {t.availableDevices}
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {profile.subscription !== "active" ? (
            <button
              onClick={openBuy}
              className="px-7 py-3.5 bg-green-400 text-[#080808] font-mono text-sm font-bold tracking-wider uppercase hover:bg-green-300 transition-all rounded-sm"
            >
              + {t.buyTitle}
            </button>
          ) : (
            <button
              onClick={openRenew}
              className="px-7 py-3.5 border border-green-400/40 text-green-400 font-mono text-sm tracking-wider uppercase hover:bg-green-400/8 hover:border-green-400/70 transition-all rounded-sm"
            >
              ↻ {t.renewTitle}
            </button>
          )}
          <button
            onClick={() => setShowPayment(true)}
            className="px-7 py-3.5 border border-white/10 text-white/50 font-mono text-sm tracking-wider uppercase hover:border-white/25 hover:text-white/75 transition-all rounded-sm"
          >
            + {t.topup}
          </button>
          <a
            href="https://t.me/EscapeTheMatrixVPNBot"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 border border-white/6 text-white/25 font-mono text-sm tracking-wider uppercase hover:border-white/15 hover:text-white/45 transition-all rounded-sm"
          >
            {t.manage}
          </a>
        </div>
        {profile.configs.length > 0 ? (
          <div>
            <div className="text-xs font-mono tracking-[0.4em] text-white/25 uppercase mb-4">
              — {t.configs}
            </div>
            <div className="flex flex-col gap-2">
              {profile.configs.map((cfg, i) => (
                <div key={i} className="border border-white/6 bg-white/[0.015] rounded-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cfg.flag}</span>
                      <div>
                        <div className="font-mono text-white/70 text-base font-bold">{cfg.city}</div>
                        <div className="font-mono text-white/30 text-xs mt-0.5">{cfg.ping}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(cfg.vless_link, `cfg-${i}`)}
                      className={`px-4 py-2 border font-mono text-xs tracking-wider transition-all rounded-sm ${
                        copied === `cfg-${i}`
                          ? "border-green-400/40 text-green-400 bg-green-400/5"
                          : "border-white/8 text-white/35 hover:border-green-400/30 hover:text-green-400/80"
                      }`}
                    >
                      {copied === `cfg-${i}` ? t.copied : t.copy}
                    </button>
                  </div>
                  <code className="block bg-black/40 border border-white/5 rounded-sm px-4 py-2.5 text-xs text-white/30 truncate font-mono">
                    {cfg.vless_link}
                  </code>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="border border-white/5 rounded-sm p-8 text-center">
            <div className="text-white/30 font-mono text-base mb-4">{t.noSub}</div>
            <button
              onClick={openBuy}
              className="inline-block px-6 py-3 border border-green-400/30 text-green-400 font-mono text-sm tracking-wider uppercase hover:bg-green-400/8 transition-all rounded-sm"
            >
              {t.buyTitle} →
            </button>
          </div>
        )}
        <div>
          <div className="text-xs font-mono tracking-[0.4em] text-white/25 uppercase mb-4">
            — {t.referralTitle}
          </div>
          <div className="border border-white/6 bg-white/[0.015] rounded-sm p-5 flex flex-col gap-4">
            <p className="font-mono text-xs text-white/40 leading-relaxed">
              {t.referralSub}
            </p>
            <div className="flex items-center gap-3">
              <code className="flex-1 bg-black/40 border border-white/8 rounded-sm px-4 py-2.5 text-xs text-green-400/70 font-mono truncate">
                {refLink}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(refLink).then(() => {
                    setCopiedRef(true);
                    setTimeout(() => setCopiedRef(false), 2000);
                  });
                }}
                className={`px-4 py-2.5 border font-mono text-xs tracking-wider transition-all rounded-sm flex-shrink-0 ${
                  copiedRef
                    ? "border-green-400/40 text-green-400 bg-green-400/5"
                    : "border-white/8 text-white/35 hover:border-green-400/30 hover:text-green-400/80"
                }`}
              >
                {copiedRef ? t.copied : t.copy}
              </button>
            </div>
            <div className="font-mono text-xs text-white/25">
              👥 {t.invited}
              <span className="text-white/60 font-bold">{refCount}</span>
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs font-mono tracking-[0.4em] text-white/25 uppercase mb-5">
            — {t.clients}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {VPN_CLIENTS.map((client) => (
              <div
                key={client.name}
                className="border border-white/6 bg-white/[0.015] rounded-sm p-5 flex flex-col gap-3 hover:border-white/12 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono font-bold text-white/75 text-base">{client.name}</div>
                    <div className="font-mono text-xs text-white/25 mt-0.5">
                      {client.icon} {client.platforms.join(", ")}
                    </div>
                  </div>
                  {client.badge && (
                    <span className="text-[10px] font-mono text-green-400/60 border border-green-400/20 px-2 py-0.5 rounded-full">
                      {client.badge[lang]}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {client.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 border border-white/8 text-white/35 font-mono text-xs tracking-wider hover:text-white/70 hover:border-white/20 transition-all rounded-sm"
                    >
                      ↓ {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
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

      {showSubscription && (
        <SubscriptionModal
          lang={lang}
          balance={profile.balance}
          tgId={profile.tg_id}
          mode={subMode}
          currentRegion={profile.configs[0]?.region ?? null}
          onClose={() => setShowSubscription(false)}
          onSuccess={handleRefresh}
        />
      )}
      <Footer t={translations[lang]} />
    </div>
  );
}