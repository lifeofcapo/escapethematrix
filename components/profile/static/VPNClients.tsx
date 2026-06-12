import { VPNClient } from "@/lib/types";
export const VPN_CLIENTS: VPNClient[] = [
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
        url: "https://github.com/pluralplay/FlClashX/releases/download/v0.3.2/FlClashX-macos-arm64.dmg",
      },
      {
        label: "macOS AMD64",
        url: "https://github.com/pluralplay/FlClashX/releases/download/v0.3.2/FlClashX-macos-amd64.dmg",
      },

      {
        label: "Windows",
        url: "https://github.com/pluralplay/FlClashX/releases/download/v0.3.2/FlClashX-windows-amd64-setup.exe",
      },

      {
        label: "Linux AppImage",
        url: "https://github.com/pluralplay/FlClashX/releases/download/v0.3.2/FlClashX-linux-amd64.AppImage",
      },

      {
        label: "Android APK",
        url: "https://github.com/pluralplay/FlClashX/releases/download/v0.3.2/FlClashX-android-universal.apk",
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
      {
        label: "Android (APK)",
        url: "https://github.com/MatsuriDayo/NekoBoxForAndroid/releases/download/1.4.2/NekoBox-1.4.2-x86_64.apk",
      }
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