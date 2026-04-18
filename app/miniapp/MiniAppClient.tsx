"use client";


import { useEffect, useState, useCallback } from "react";

interface Subscription {
  status: "active" | "expired" | "none";
  plan: string;
  expires_at: string;
  days_left: number;
  devices_limit: number;
  sub_link: string;
  region: string;
}

interface Profile {
  user_id: number;
  username?: string;
  first_name?: string;
  profile_key: string;
  balance: number;
  referrals: number;
  language: string;
  subscription: Subscription | null;
}

type Phase = "loading" | "profile" | "error" | "not_registered";

const REGION_LABELS: Record<string, { flag: string; name: string }> = {
  fi: { flag: "🇫🇮", name: "Финляндия" },
  nl: { flag: "🇳🇱", name: "Нидерланды" },
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  const el = document.createElement("textarea");
  el.value = text;
  el.style.position = "fixed";
  el.style.opacity = "0";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  return Promise.resolve();
}


export default function MiniAppClient() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<string | null>(null);
  const [tgReady, setTgReady] = useState(false);

  useEffect(() => {
    const init = () => {
      const tg = (window as any).Telegram?.WebApp;
      if (!tg) {
        setError("Откройте через Telegram");
        setPhase("error");
        return;
      }

      tg.ready();
      tg.expand(); 

      tg.setHeaderColor?.("#0a0a0a");
      tg.setBackgroundColor?.("#080808");

      setTgReady(true);
    };

    if ((window as any).Telegram?.WebApp) {
      init();
    } else {
      window.addEventListener("telegram-ready", init, { once: true });
      const timer = setTimeout(init, 1500);
      return () => {
        window.removeEventListener("telegram-ready", init);
        clearTimeout(timer);
      };
    }
  }, []);

  const loadProfile = useCallback(async () => {
    const tg = (window as any).Telegram?.WebApp;
    const initData = tg?.initData;

    if (!initData) {
      setError("Нет данных авторизации Telegram");
      setPhase("error");
      return;
    }

    try {
      const res = await fetch("/api/miniapp/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData }),
      });

      if (res.status === 401) {
        setError("Ошибка авторизации");
        setPhase("error");
        return;
      }

      if (res.status === 404) {
        setPhase("not_registered");
        return;
      }

      if (!res.ok) {
        setError("Ошибка сервера. Попробуйте позже.");
        setPhase("error");
        return;
      }

      const data: Profile = await res.json();
      setProfile(data);
      setPhase("profile");
    } catch {
      setError("Нет соединения");
      setPhase("error");
    }
  }, []);

  useEffect(() => {
    if (tgReady) loadProfile();
  }, [tgReady, loadProfile]);

  const handleCopy = async (text: string, id: string) => {
    await copyToClipboard(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);

    (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred?.("light");
  };
  const sub = profile?.subscription;
  const subActive = sub?.status === "active";
  const subExpired = sub?.status === "expired";
  const regionInfo = sub ? (REGION_LABELS[sub.region] ?? { flag: "🌍", name: sub.region }) : null;

  return (
    <>
      <script src="https://telegram.org/js/telegram-web-app.js" async />

      <main className="min-h-screen bg-[#080808] text-white font-mono overflow-x-hidden pb-8">
        <div className="noise-overlay" />

        <div className="fixed top-3 left-3 w-5 h-5 border-t border-l border-green-400/20 pointer-events-none z-10" />
        <div className="fixed top-3 right-3 w-5 h-5 border-t border-r border-green-400/20 pointer-events-none z-10" />
        <div className="fixed bottom-3 left-3 w-5 h-5 border-b border-l border-green-400/20 pointer-events-none z-10" />
        <div className="fixed bottom-3 right-3 w-5 h-5 border-b border-r border-green-400/20 pointer-events-none z-10" />

        {phase === "loading" && (
          <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <div className="text-green-400/50 text-3xl flicker">◉</div>
            <div className="text-white/25 text-[10px] tracking-[0.4em] uppercase">
              Загрузка профиля...
            </div>
          </div>
        )}

        {phase === "error" && (
          <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center">
            <div className="text-red-400/50 text-4xl">⊗</div>
            <div className="text-red-400/70 text-xs tracking-[0.3em] uppercase">
              — Ошибка —
            </div>
            <div className="text-white/40 text-xs leading-relaxed max-w-xs">
              {error}
            </div>
            <button
              onClick={loadProfile}
              className="mt-4 px-6 py-3 border border-white/10 text-white/40 text-xs tracking-widest uppercase hover:border-green-400/30 hover:text-green-400/70 transition-all rounded-sm"
            >
              Повторить
            </button>
          </div>
        )}

        {phase === "not_registered" && (
          <div className="flex flex-col items-center justify-center min-h-screen gap-5 px-6 text-center">
            <div className="text-white/20 text-4xl font-mono">◈</div>
            <div className="text-white/50 text-xs tracking-[0.3em] uppercase">
              — Аккаунт не найден —
            </div>
            <div className="text-white/30 text-xs leading-relaxed max-w-xs">
              Вы ещё не зарегистрированы в боте. Запустите{" "}
              <span className="text-green-400/70">@EscapeTheMatrixVPNBot</span> и
              создайте аккаунт.
            </div>
            <a
              href="https://t.me/EscapeTheMatrixVPNBot"
              className="mt-2 px-6 py-3 bg-green-400 text-[#080808] text-xs tracking-widest uppercase font-bold rounded hover:bg-green-300 transition-all"
            >
              Открыть бота
            </a>
          </div>
        )}

        {phase === "profile" && profile && (
          <div className="px-4 pt-8">
            <div className="mb-6">
              <div className="text-[9px] tracking-[0.5em] text-green-400/40 uppercase mb-1">
                — Escape The Matrix VPN —
              </div>
              <div className="text-white/80 text-lg font-black tracking-wider">
                {profile.first_name
                  ? `Привет, ${profile.first_name}`
                  : "Ваш профиль"}
              </div>
              {profile.username && (
                <div className="text-white/30 text-xs mt-0.5">
                  @{profile.username}
                </div>
              )}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent mb-5" />

            <div
              className={`relative border rounded-sm p-4 mb-4 ${
                subActive
                  ? "border-green-400/25 bg-green-400/[0.03]"
                  : subExpired
                  ? "border-red-400/20 bg-red-400/[0.02]"
                  : "border-white/8 bg-white/[0.02]"
              }`}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/20 to-transparent" />

              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[9px] tracking-[0.4em] text-white/25 uppercase mb-1">
                    Подписка
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      subActive
                        ? "text-green-400"
                        : subExpired
                        ? "text-red-400/80"
                        : "text-white/30"
                    }`}
                  >
                    {subActive
                      ? "✓ Активна"
                      : subExpired
                      ? "⊗ Истекла"
                      : "— Нет подписки"}
                  </div>
                </div>

                {subActive && regionInfo && (
                  <div className="text-right">
                    <div className="text-lg">{regionInfo.flag}</div>
                    <div className="text-[9px] text-white/30 tracking-wider uppercase mt-0.5">
                      {regionInfo.name}
                    </div>
                  </div>
                )}
              </div>

              {sub && subActive && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-black/30 rounded-sm px-3 py-2">
                    <div className="text-[9px] text-white/25 tracking-widest uppercase mb-0.5">
                      Истекает
                    </div>
                    <div className="text-white/70 text-xs">
                      {formatDate(sub.expires_at)}
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-sm px-3 py-2">
                    <div className="text-[9px] text-white/25 tracking-widest uppercase mb-0.5">
                      Осталось
                    </div>
                    <div
                      className={`text-xs font-bold ${
                        sub.days_left <= 3
                          ? "text-red-400/80"
                          : sub.days_left <= 7
                          ? "text-yellow-400/80"
                          : "text-green-400/80"
                      }`}
                    >
                      {sub.days_left} дн.
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-sm px-3 py-2">
                    <div className="text-[9px] text-white/25 tracking-widest uppercase mb-0.5">
                      Тариф
                    </div>
                    <div className="text-white/60 text-xs uppercase">
                      {sub.plan}
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-sm px-3 py-2">
                    <div className="text-[9px] text-white/25 tracking-widest uppercase mb-0.5">
                      Устройств
                    </div>
                    <div className="text-white/70 text-xs">
                      до {sub.devices_limit}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {sub && subActive && (
              <div className="border border-white/6 rounded-sm p-4 mb-4 bg-white/[0.01]">
                <div className="text-[9px] tracking-[0.4em] text-white/20 uppercase mb-2">
                  — Ссылка подписки
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-black/50 border border-white/5 rounded-sm px-3 py-2 text-[10px] text-white/30 truncate">
                    {sub.sub_link}
                  </code>
                  <button
                    onClick={() => handleCopy(sub.sub_link, "sub_link")}
                    className={`flex-shrink-0 px-3 py-2 border rounded-sm text-[10px] tracking-wider transition-all ${
                      copied === "sub_link"
                        ? "border-green-400/40 text-green-400"
                        : "border-white/8 text-white/30 hover:border-green-400/25 hover:text-green-400/70"
                    }`}
                  >
                    {copied === "sub_link" ? "✓" : "Копировать"}
                  </button>
                </div>
                <div className="text-[9px] text-white/15 mt-2 leading-relaxed">
                  Вставьте ссылку в приложение: FlClashX, Happ, Streisand
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="border border-white/6 rounded-sm p-4 bg-white/[0.02]">
                <div className="text-[9px] text-white/25 tracking-widest uppercase mb-1">
                  Баланс
                </div>
                <div className="text-white/80 text-base font-black">
                  {profile.balance.toFixed(2)}{" "}
                  <span className="text-white/40 text-xs font-normal">₽</span>
                </div>
              </div>
              <div className="border border-white/6 rounded-sm p-4 bg-white/[0.02]">
                <div className="text-[9px] text-white/25 tracking-widest uppercase mb-1">
                  Рефералов
                </div>
                <div className="text-white/80 text-base font-black">
                  {profile.referrals}
                </div>
              </div>
            </div>

            <div className="border border-white/5 rounded-sm p-4 mb-5 bg-white/[0.01]">
              <div className="text-[9px] tracking-[0.4em] text-white/20 uppercase mb-2">
                — Ключ профиля
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-black/50 border border-white/5 rounded-sm px-3 py-2 text-[10px] text-white/40 truncate">
                  {profile.profile_key}
                </code>
                <button
                  onClick={() => handleCopy(profile.profile_key, "profile_key")}
                  className={`flex-shrink-0 px-3 py-2 border rounded-sm text-[10px] tracking-wider transition-all ${
                    copied === "profile_key"
                      ? "border-green-400/40 text-green-400"
                      : "border-white/8 text-white/30 hover:border-green-400/25 hover:text-green-400/70"
                  }`}
                >
                  {copied === "profile_key" ? "✓" : "Копировать"}
                </button>
              </div>
              <div className="text-[9px] text-white/15 mt-1.5">
                Используйте для входа на сайте escapethematrix.to
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {(!sub || !subActive || (sub.days_left <= 7)) && (
                <a
                  href="https://t.me/EscapeTheMatrixVPNBot"
                  className="w-full text-center py-3.5 bg-green-400 text-[#080808] text-xs tracking-widest uppercase font-bold rounded-sm hover:bg-green-300 transition-all"
                >
                  {!sub || !subActive
                    ? "💳 Купить подписку"
                    : "🔄 Продлить подписку"}
                </a>
              )}
              <a
                href="https://t.me/EscapeTheMatrixVPNBot"
                className="w-full text-center py-3 border border-white/10 text-white/50 text-xs tracking-widest uppercase hover:border-green-400/30 hover:text-green-400/70 transition-all rounded-sm"
              >
                💰 Пополнить баланс
              </a>

              <a
                href="https://t.me/EscapeTheMatrix_VPN?direct"
                className="w-full text-center py-3 border border-white/8 text-white/30 text-xs tracking-widest uppercase hover:border-white/20 hover:text-white/50 transition-all rounded-sm"
              >
                🆘 Поддержка
              </a>
            </div>
            <div className="mt-8 text-center">
              <div className="text-[9px] text-white/10 tracking-[0.3em] uppercase">
                Escape The Matrix VPN © 2026
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}