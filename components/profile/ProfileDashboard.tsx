"use client";

import { useState } from "react";
import { translations } from "@/lib/i18n";
import PaymentModal from "./PaymentModal";

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

const VPN_CLIENTS = [
  {
    name: "FlClashX",
    platforms: ["Android", "Windows", "macOS", "Linux"],
    icon: "◈",
    accent: "#4ade80",
    badge: { ru: "★ Рекомендуем", en: "★ Recommended", de: "★ Empfohlen", zh: "★ 推荐" },
    links: [
      { label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.follow.clash.x" },
      { label: "GitHub", url: "https://github.com/chen08209/FlClashX/releases/latest" },
    ],
  },
  {
    name: "Happ",
    platforms: ["Android", "iOS", "Windows"],
    icon: "◆",
    accent: "#60a5fa",
    badge: null,
    links: [
      { label: "App Store", url: "https://apps.apple.com/app/happ-proxy-utility/id6504287480" },
      { label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.happproxy" },
    ],
  },
  {
    name: "Streisand",
    platforms: ["iOS", "macOS"],
    icon: "◉",
    accent: "#c084fc",
    badge: null,
    links: [
      { label: "App Store", url: "https://apps.apple.com/app/streisand/id6450534064" },
    ],
  },
  {
    name: "Clash Verge",
    platforms: ["Windows", "macOS", "Linux"],
    icon: "◐",
    accent: "#f97316",
    badge: null,
    links: [
      { label: "GitHub", url: "https://github.com/clash-verge-rev/clash-verge-rev/releases/latest" },
    ],
  },
  {
    name: "V2rayNG",
    platforms: ["Android"],
    icon: "▲",
    accent: "#34d399",
    badge: null,
    links: [
      { label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.v2ray.ang" },
      { label: "GitHub APK", url: "https://github.com/2dust/v2rayNG/releases/latest" },
    ],
  },
  {
    name: "Streisand / NekoBox",
    platforms: ["Android", "Linux"],
    icon: "◬",
    accent: "#fb923c",
    badge: null,
    links: [
      { label: "GitHub", url: "https://github.com/MatsuriDayo/NekoBoxForAndroid/releases/latest" },
    ],
  },
];

const PLANS: Record<ProfileLang, { label: string; price: string; days: number; desc: string }[]> = {
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

const UI: Record<ProfileLang, {
  buyTitle: string; renewTitle: string; selectPlan: string;
  balance: string; notEnough: string; buyBtn: string; renewBtn: string;
  topupFirst: string; clients: string; configs: string; noSub: string;
  getSub: string; greeting: string; status: string; active: string;
  expired: string; inactive: string; expires: string; daysLeft: (n: number) => string;
  expiresSoon: (n: number) => string; expiresToday: string; devices: string;
  copy: string; copied: string; topup: string; logout: string; refresh: string;
  manage: string; renew: string; rub: string; key: string; purchaseOk: string;
  purchaseProcessing: string; insufficientBalance: string;
  selectRegion: string; regionFi: string; regionNl: string;
}> = {
  ru: {
    buyTitle: "Купить подписку", renewTitle: "Продлить подписку", selectPlan: "Выберите план",
    balance: "Баланс", notEnough: "Недостаточно средств", buyBtn: "Купить за",
    renewBtn: "Продлить за", topupFirst: "Пополнить баланс →",
    clients: "VPN клиенты", configs: "Конфигурации", noSub: "Нет активной подписки",
    getSub: "Получить подписку →", greeting: "личный кабинет", status: "Статус",
    active: "Активна", expired: "Истекла", inactive: "Неактивна",
    expires: "Истекает", daysLeft: (n) => `ещё ${n} дн.`,
    expiresSoon: (n) => `⚠ Подписка истекает через ${n} дн.`, expiresToday: "⚠ Подписка истекает сегодня",
    devices: "Устройства", copy: "Копировать", copied: "✓ Скопировано",
    topup: "Пополнить", logout: "Выйти", refresh: "Обновить", manage: "Управление в боте",
    renew: "Продлить", rub: "₽", key: "Ключ профиля",
    purchaseOk: "✓ Подписка активирована", purchaseProcessing: "Обработка...",
    insufficientBalance: "Пополните баланс для покупки",
    selectRegion: "Выберите регион", regionFi: "🇫🇮 Финляндия", regionNl: "🇳🇱 Нидерланды",
  },
  en: {
    buyTitle: "Buy subscription", renewTitle: "Renew subscription", selectPlan: "Choose plan",
    balance: "Balance", notEnough: "Insufficient funds", buyBtn: "Buy for",
    renewBtn: "Renew for", topupFirst: "Top up balance →",
    clients: "VPN clients", configs: "Configs", noSub: "No active subscription",
    getSub: "Get subscription →", greeting: "personal account", status: "Status",
    active: "Active", expired: "Expired", inactive: "Inactive",
    expires: "Expires", daysLeft: (n) => `${n} days left`,
    expiresSoon: (n) => `⚠ Subscription expires in ${n} days`, expiresToday: "⚠ Subscription expires today",
    devices: "Devices", copy: "Copy", copied: "✓ Copied",
    topup: "Top up", logout: "Logout", refresh: "Refresh", manage: "Manage in bot",
    renew: "Renew", rub: "₽", key: "Profile key",
    purchaseOk: "✓ Subscription activated", purchaseProcessing: "Processing...",
    insufficientBalance: "Top up balance to purchase",
    selectRegion: "Select region", regionFi: "🇫🇮 Finland", regionNl: "🇳🇱 Netherlands",
  },
  de: {
    buyTitle: "Abonnement kaufen", renewTitle: "Abonnement verlängern", selectPlan: "Plan wählen",
    balance: "Guthaben", notEnough: "Unzureichendes Guthaben", buyBtn: "Kaufen für",
    renewBtn: "Verlängern für", topupFirst: "Guthaben aufladen →",
    clients: "VPN-Clients", configs: "Konfigurationen", noSub: "Kein aktives Abonnement",
    getSub: "Abonnement erhalten →", greeting: "persönliches Konto", status: "Status",
    active: "Aktiv", expired: "Abgelaufen", inactive: "Inaktiv",
    expires: "Läuft ab", daysLeft: (n) => `noch ${n} Tage`,
    expiresSoon: (n) => `⚠ Abonnement läuft in ${n} Tagen ab`, expiresToday: "⚠ Abonnement läuft heute ab",
    devices: "Geräte", copy: "Kopieren", copied: "✓ Kopiert",
    topup: "Aufladen", logout: "Abmelden", refresh: "Aktualisieren", manage: "Im Bot verwalten",
    renew: "Verlängern", rub: "₽", key: "Profilschlüssel",
    purchaseOk: "✓ Abonnement aktiviert", purchaseProcessing: "Verarbeitung...",
    insufficientBalance: "Guthaben aufladen zum Kaufen",
    selectRegion: "Region wählen", regionFi: "🇫🇮 Finnland", regionNl: "🇳🇱 Niederlande",
  },
  zh: {
    buyTitle: "购买订阅", renewTitle: "续订", selectPlan: "选择套餐",
    balance: "余额", notEnough: "余额不足", buyBtn: "购买",
    renewBtn: "续订", topupFirst: "充值 →",
    clients: "VPN客户端", configs: "配置", noSub: "没有有效订阅",
    getSub: "获取订阅 →", greeting: "个人中心", status: "状态",
    active: "有效", expired: "已过期", inactive: "未激活",
    expires: "到期", daysLeft: (n) => `剩余${n}天`,
    expiresSoon: (n) => `⚠ 订阅将在${n}天后到期`, expiresToday: "⚠ 订阅今天到期",
    devices: "设备", copy: "复制", copied: "✓ 已复制",
    topup: "充值", logout: "退出", refresh: "刷新", manage: "在机器人管理",
    renew: "续订", rub: "₽", key: "个人密钥",
    purchaseOk: "✓ 订阅已激活", purchaseProcessing: "处理中...",
    insufficientBalance: "余额不足，请充值",
    selectRegion: "选择地区", regionFi: "🇫🇮 芬兰", regionNl: "🇳🇱 荷兰",
  },
};

function SubscriptionModal({
  lang, balance, tgId, mode, currentRegion, onClose, onSuccess,
}: {
  lang: ProfileLang;
  balance: number;
  tgId: number;
  mode: "buy" | "renew";
  currentRegion?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const t = UI[lang];
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
  const [lang, setLang] = useState<ProfileLang>("ru");
  const [copied, setCopied] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [subMode, setSubMode] = useState<"buy" | "renew">("buy");
  const [refreshing, setRefreshing] = useState(false);
  const t = UI[lang];

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

  const openBuy = () => { setSubMode("buy"); setShowSubscription(true); };
  const openRenew = () => { setSubMode("renew"); setShowSubscription(true); };

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
      <header className="relative border-b border-white/6 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="text-white/25 font-mono text-xs tracking-[0.4em] hover:text-green-400/60 transition-colors uppercase">
            ← escapethematrix.to
          </a>
          <div className="text-xs font-mono tracking-[0.5em] text-green-400/40 uppercase hidden sm:block">
            ◈ {t.greeting}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {LANGS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 font-mono text-xs tracking-widest uppercase transition-all rounded-sm ${
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
              className="px-3 py-1.5 border border-white/8 text-white/25 font-mono text-xs hover:border-white/20 hover:text-white/50 transition-all rounded-sm"
            >
              {refreshing ? (
                <span className="inline-block w-3 h-3 border border-white/30 border-t-white/70 rounded-full animate-spin" />
              ) : "↻"}
            </button>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 border border-white/8 text-white/25 font-mono text-xs hover:border-red-400/30 hover:text-red-400/60 transition-all rounded-sm uppercase tracking-wider"
            >
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 py-10 flex flex-col gap-8">
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
              <span className="text-green-400 font-bold">{profile.devices_used}</span>
              <span className="text-white/25 text-base"> / {profile.devices_max}</span>
            </div>
            {profile.devices_max > 0 && (
              <div className="mt-2.5 h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400/50 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (profile.devices_used / profile.devices_max) * 100)}%` }}
                />
              </div>
            )}
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

        <div className="text-center">
          <div className="text-[10px] font-mono text-white/10 tracking-[0.3em] uppercase">
            Escape The Matrix VPN © 2026
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
    </div>
  );
}