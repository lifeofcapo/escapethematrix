"use client";

import { useState } from "react";
import PaymentModal from "./PaymentModal";
import VpnClientsSection from "./VpnClientsSection";

const LANGS = ["ru", "en", "de", "zh"] as const;
type Lang = typeof LANGS[number];

const T = {
  ru: {
    greeting: "Добро пожаловать",
    status: "Статус подписки",
    active: "Активна",
    inactive: "Неактивна",
    expired: "Истекла",
    expires: "Истекает",
    balance: "Баланс",
    devices: "Устройства",
    traffic: "Трафик",
    daysLeft: (n: number) => `${n} дн. осталось`,
    expiresSoon: (n: number) => `⚠ Подписка истекает через ${n} дней`,
    expiresToday: "⚠ Подписка истекает сегодня!",
    topup: "Пополнить",
    renew: "Продлить",
    configs: "Конфигурации",
    copy: "Копировать",
    copied: "✓ Скопировано",
    clients: "VPN-клиенты",
    logout: "Выйти",
    refresh: "Обновить",
    region: "Регион",
    server: "Сервер",
    ping: "Пинг",
    noSub: "У вас нет активной подписки",
    getSub: "Получить подписку в боте →",
    used: "использовано",
    of: "из",
    rub: "₽",
    key: "Ключ профиля",
    manage: "Управление в боте",
  },
  en: {
    greeting: "Welcome back",
    status: "Subscription",
    active: "Active",
    inactive: "Inactive",
    expired: "Expired",
    expires: "Expires",
    balance: "Balance",
    devices: "Devices",
    traffic: "Traffic",
    daysLeft: (n: number) => `${n} days left`,
    expiresSoon: (n: number) => `⚠ Subscription expires in ${n} days`,
    expiresToday: "⚠ Subscription expires today!",
    topup: "Top up",
    renew: "Renew",
    configs: "Configurations",
    copy: "Copy",
    copied: "✓ Copied",
    clients: "VPN clients",
    logout: "Logout",
    refresh: "Refresh",
    region: "Region",
    server: "Server",
    ping: "Ping",
    noSub: "You have no active subscription",
    getSub: "Get subscription in bot →",
    used: "used",
    of: "of",
    rub: "₽",
    key: "Profile key",
    manage: "Manage in bot",
  },
  de: {
    greeting: "Willkommen zurück",
    status: "Abonnement",
    active: "Aktiv",
    inactive: "Inaktiv",
    expired: "Abgelaufen",
    expires: "Läuft ab",
    balance: "Guthaben",
    devices: "Geräte",
    traffic: "Traffic",
    daysLeft: (n: number) => `Noch ${n} Tage`,
    expiresSoon: (n: number) => `⚠ Abonnement läuft in ${n} Tagen ab`,
    expiresToday: "⚠ Abonnement läuft heute ab!",
    topup: "Aufladen",
    renew: "Verlängern",
    configs: "Konfigurationen",
    copy: "Kopieren",
    copied: "✓ Kopiert",
    clients: "VPN-Clients",
    logout: "Abmelden",
    refresh: "Aktualisieren",
    region: "Region",
    server: "Server",
    ping: "Ping",
    noSub: "Kein aktives Abonnement",
    getSub: "Abonnement im Bot holen →",
    used: "genutzt",
    of: "von",
    rub: "₽",
    key: "Profilschlüssel",
    manage: "Im Bot verwalten",
  },
  zh: {
    greeting: "欢迎回来",
    status: "订阅状态",
    active: "有效",
    inactive: "未激活",
    expired: "已过期",
    expires: "到期",
    balance: "余额",
    devices: "设备",
    traffic: "流量",
    daysLeft: (n: number) => `剩余 ${n} 天`,
    expiresSoon: (n: number) => `⚠ 订阅将在 ${n} 天后到期`,
    expiresToday: "⚠ 订阅今天到期！",
    topup: "充值",
    renew: "续订",
    configs: "配置",
    copy: "复制",
    copied: "✓ 已复制",
    clients: "VPN 客户端",
    logout: "退出",
    refresh: "刷新",
    region: "地区",
    server: "服务器",
    ping: "延迟",
    noSub: "您没有有效订阅",
    getSub: "在机器人中获取订阅 →",
    used: "已用",
    of: "/",
    rub: "₽",
    key: "个人密钥",
    manage: "在机器人中管理",
  },
};

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
  const [lang, setLang] = useState<Lang>("ru");
  const [copied, setCopied] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const t = T[lang];

  const days = daysUntil(profile.expires_at);
  const showWarning =
    profile.subscription === "active" && days !== null && days <= 7;

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
      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />
      {/* Top glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-green-500/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative border-b border-white/6 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <a href="/" className="text-white/25 font-mono text-[10px] tracking-[0.4em] hover:text-green-400/60 transition-colors uppercase">
          ← escapethematrix.to
        </a>

        <div className="text-[10px] font-mono tracking-[0.5em] text-green-400/40 uppercase hidden sm:block">
          ◈ personal account
        </div>

        <div className="flex items-center gap-3">
          {/* Lang switcher */}
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
        {/* Greeting */}
        <div>
          <div className="font-mono text-white/25 text-xs tracking-widest uppercase mb-1">{t.greeting}</div>
          <h1 className="font-mono text-xl text-white/70">
            {profile.username ? `@${profile.username}` : `ID ${profile.tg_id}`}
          </h1>
        </div>

        {/* ⚠ Expiry warning */}
        {showWarning && days !== null && (
          <div className="border border-amber-400/30 bg-amber-400/5 rounded-sm px-4 py-3 font-mono text-xs text-amber-400/80 flex items-center gap-2">
            <span className="text-lg">⚠</span>
            <span>
              {days === 0 ? t.expiresToday : t.expiresSoon(days)}
            </span>
            <button
              onClick={() => setShowPayment(true)}
              className="ml-auto px-3 py-1 border border-amber-400/40 text-amber-400 text-[10px] tracking-widest uppercase hover:bg-amber-400/10 transition-all rounded-sm"
            >
              {t.renew}
            </button>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Subscription status */}
          <div className="border border-white/6 bg-white/[0.02] rounded-sm p-4 col-span-2 sm:col-span-1">
            <div className="text-white/25 font-mono text-[10px] tracking-widest uppercase mb-2">{t.status}</div>
            <div className={`font-mono text-lg font-bold ${statusColor}`}>{statusLabel}</div>
            {profile.subscription === "active" && days !== null && (
              <div className="font-mono text-[10px] text-white/30 mt-1">{t.daysLeft(days)}</div>
            )}
          </div>

          {/* Expires */}
          <div className="border border-white/6 bg-white/[0.02] rounded-sm p-4">
            <div className="text-white/25 font-mono text-[10px] tracking-widest uppercase mb-2">{t.expires}</div>
            <div className="font-mono text-sm text-white/60 leading-tight">{expiresFormatted}</div>
          </div>

          {/* Balance */}
          <div className="border border-white/6 bg-white/[0.02] rounded-sm p-4">
            <div className="text-white/25 font-mono text-[10px] tracking-widest uppercase mb-2">{t.balance}</div>
            <div className="font-mono text-lg font-bold text-white/80">{profile.balance} {t.rub}</div>
          </div>

          {/* Devices */}
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

        {/* Payment actions */}
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
            className="px-6 py-3 border border-white/10 text-white/40 font-mono text-xs tracking-[0.3em] uppercase hover:border-white/25 hover:text-white/60 transition-all rounded-sm"
          >
            {t.manage}
          </a>
        </div>

        {/* Configs */}
        {profile.configs.length > 0 ? (
          <div>
            <div className="text-[10px] font-mono tracking-[0.4em] text-white/25 uppercase mb-3">
              — {t.configs}
            </div>
            <div className="flex flex-col gap-3">
              {profile.configs.map((cfg, i) => (
                <div key={i} className="border border-white/6 bg-white/[0.02] rounded-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cfg.flag}</span>
                      <div>
                        <div className="font-mono text-sm text-white/80 font-bold">{cfg.city}</div>
                        <div className="font-mono text-[10px] text-white/30 uppercase tracking-wider">{cfg.region}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="font-mono text-[10px] text-white/35">{cfg.ping}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-black/50 border border-white/5 rounded-sm px-3 py-2 font-mono text-[10px] text-white/25 truncate">
                      {cfg.vless_link}
                    </code>
                    <button
                      onClick={() => copyToClipboard(cfg.vless_link, `cfg-${i}`)}
                      className="shrink-0 px-4 py-2 border border-white/8 text-white/30 font-mono text-[10px] hover:border-green-400/30 hover:text-green-400 transition-all rounded-sm whitespace-nowrap"
                    >
                      {copied === `cfg-${i}` ? t.copied : t.copy}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="border border-white/6 bg-white/[0.015] rounded-sm p-8 text-center">
            <div className="text-white/20 font-mono text-sm mb-3">{t.noSub}</div>
            <a
              href="https://t.me/EscapeTheMatrixVPNBot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400/50 font-mono text-xs hover:text-green-400 transition-colors"
            >
              {t.getSub}
            </a>
          </div>
        )}

        {/* VPN Clients */}
        <VpnClientsSection lang={lang} />

        {/* Footer */}
        <div className="border-t border-white/5 pt-4 flex items-center justify-between">
          <div className="font-mono text-[10px] text-white/15 tracking-wider">
            ID: {profile.tg_id}
          </div>
          <div className="font-mono text-[10px] text-white/15">
            escapethematrix.to
          </div>
        </div>
      </main>

    {showPayment && (
      <PaymentModal
        balance={profile.balance}
        tgId={profile.tg_id}
        lang={lang}
        onClose={() => setShowPayment(false)}
      />
    )}
    </div>
  );
}