import type { Metadata } from "next";
import ArticlePageClient from "../ArticlePageClient";

export const metadata: Metadata = {
  title: "«ГосVPN» для разработчиков: что планирует Роскомнадзор — EscapeTheMatrix",
  description:
    "Роскомнадзор обсудил с IT-компаниями создание единого «ГосVPN» для доступа к зарубежным репозиториям. Разбираем, что это значит для разработчиков и почему личный VPN надёжнее.",
  metadataBase: new URL("https://www.escapethematrix.to"),
  alternates: {
    canonical: "https://www.escapethematrix.to/blog/gosvpn-developers",
    languages: {
      "ru": "https://www.escapethematrix.to/blog/gosvpn-developers",
      "en": "https://www.escapethematrix.to/blog/gosvpn-developers?lang=en",
      "de": "https://www.escapethematrix.to/blog/gosvpn-developers?lang=de",
      "es": "https://www.escapethematrix.to/blog/gosvpn-developers?lang=es",
      "zh": "https://www.escapethematrix.to/blog/gosvpn-developers?lang=zh",
      "x-default": "https://www.escapethematrix.to/blog/gosvpn-developers",
    },
  },
  openGraph: {
    title: "«ГосVPN» для разработчиков: что планирует Роскомнадзор",
    description:
      "Что значит единый «ГосVPN» для доступа к GitHub и зарубежным репозиториям, и почему личный VPN остаётся надёжнее.",
    url: "https://www.escapethematrix.to/blog/gosvpn-developers",
    siteName: "EscapeTheMatrix",
    type: "article",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "«ГосVPN» для разработчиков",
    description: "Что меняется в доступе к GitHub и репозиториям, и как разработчикам сохранить стабильный доступ.",
  },
  keywords: [
    "госvpn",
    "vpn для разработчиков",
    "доступ к github",
    "роскомнадзор vpn",
    "белые списки ркн",
    "vpn репозитории",
    "github доступ россия",
    "vpn для it компаний",
  ],
};

export default function Page() {
  return <ArticlePageClient slug="gosvpn-developers" />;
}