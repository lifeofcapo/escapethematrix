"use client";

type Lang = "ru" | "en" | "de" | "zh";

const T = {
  ru: { title: "VPN-клиенты", subtitle: "Скачайте приложение для вашего устройства", download: "Скачать", guide: "Инструкция" },
  en: { title: "VPN Clients", subtitle: "Download the app for your device", download: "Download", guide: "Guide" },
  de: { title: "VPN-Clients", subtitle: "App für Ihr Gerät herunterladen", download: "Herunterladen", guide: "Anleitung" },
  zh: { title: "VPN 客户端", subtitle: "下载适合您设备的应用", download: "下载", guide: "使用指南" },
};

const CLIENTS = [
  {
    name: "Hiddify",
    platforms: ["Windows", "macOS", "Linux", "Android", "iOS"],
    icons: ["🪟", "🍎", "🐧", "🤖", "📱"],
    description: { ru: "Универсальный клиент для всех платформ", en: "Universal client for all platforms", de: "Universeller Client für alle Plattformen", zh: "全平台通用客户端" },
    links: [
      { platform: "Windows", url: "https://github.com/hiddify/hiddify-app/releases/latest", label: "Windows" },
      { platform: "macOS", url: "https://github.com/hiddify/hiddify-app/releases/latest", label: "macOS" },
      { platform: "Android", url: "https://play.google.com/store/apps/details?id=app.hiddify.com", label: "Google Play" },
      { platform: "iOS", url: "https://apps.apple.com/app/hiddify-proxy-vpn/id6596777532", label: "App Store" },
    ],
    accent: "#00ff88",
  },
  {
    name: "V2rayNG",
    platforms: ["Android"],
    icons: ["🤖"],
    description: { ru: "Лучший клиент для Android", en: "Best client for Android", de: "Bester Android-Client", zh: "安卓最佳客户端" },
    links: [
      { platform: "Android", url: "https://play.google.com/store/apps/details?id=com.v2ray.ang", label: "Google Play" },
      { platform: "Android APK", url: "https://github.com/2dust/v2rayNG/releases/latest", label: "GitHub APK" },
    ],
    accent: "#4ade80",
  },
  {
    name: "V2rayN",
    platforms: ["Windows"],
    icons: ["🪟"],
    description: { ru: "Популярный клиент для Windows", en: "Popular Windows client", de: "Beliebter Windows-Client", zh: "流行的 Windows 客户端" },
    links: [
      { platform: "Windows", url: "https://github.com/2dust/v2rayN/releases/latest", label: "GitHub" },
    ],
    accent: "#60a5fa",
  },
  {
    name: "Streisand",
    platforms: ["iOS", "macOS"],
    icons: ["📱", "🍎"],
    description: { ru: "Лучший клиент для iPhone и Mac", en: "Best client for iPhone & Mac", de: "Bester Client für iPhone & Mac", zh: "iPhone 和 Mac 最佳客户端" },
    links: [
      { platform: "iOS", url: "https://apps.apple.com/app/streisand/id6450534064", label: "App Store" },
      { platform: "macOS", url: "https://apps.apple.com/app/streisand/id6450534064", label: "App Store" },
    ],
    accent: "#c084fc",
  },
  {
    name: "NekoBox",
    platforms: ["Android", "Windows", "Linux"],
    icons: ["🤖", "🪟", "🐧"],
    description: { ru: "Продвинутый клиент для Android и PC", en: "Advanced client for Android & PC", de: "Erweiterter Client für Android & PC", zh: "安卓和 PC 高级客户端" },
    links: [
      { platform: "Android", url: "https://github.com/MatsuriDayo/NekoBoxForAndroid/releases/latest", label: "GitHub APK" },
      { platform: "Windows/Linux", url: "https://github.com/MatsuriDayo/nekoray/releases/latest", label: "GitHub" },
    ],
    accent: "#fb923c",
  },
];

interface Props {
  lang: Lang;
}

export default function VpnClientsSection({ lang }: Props) {
  const t = T[lang];

  return (
    <div>
      <div className="text-[10px] font-mono tracking-[0.4em] text-white/25 uppercase mb-1">
        — {t.title}
      </div>
      <p className="text-white/20 font-mono text-xs mb-4">{t.subtitle}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CLIENTS.map((client) => (
          <div
            key={client.name}
            className="border border-white/6 bg-white/[0.015] rounded-sm p-4 flex flex-col gap-3 group hover:border-white/12 transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono font-bold text-white/70 text-sm">{client.name}</div>
                <div className="font-mono text-[10px] text-white/25 mt-0.5">
                  {client.icons.join(" ")} {client.platforms.join(", ")}
                </div>
              </div>
              <div
                className="w-2 h-2 rounded-full mt-1 opacity-60"
                style={{ backgroundColor: client.accent }}
              />
            </div>

            {/* Description */}
            <p className="font-mono text-[10px] text-white/30 leading-relaxed">
              {client.description[lang]}
            </p>

            {/* Download links */}
            <div className="flex flex-wrap gap-2 mt-auto">
              {client.links.map((link) => (
                <a
                  key={link.url + link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 border border-white/8 text-white/35 font-mono text-[10px] tracking-wider hover:text-white/70 hover:border-white/20 transition-all rounded-sm flex items-center gap-1.5"
                  style={{ "--hover-color": client.accent } as any}
                >
                  ↓ {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}