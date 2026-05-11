import type { Metadata } from "next";
import HomeClient from "../components/HomeClient";

export const metadata: Metadata = {
  title: "EscapeTheMatrix — VPN без логов | VLESS + Reality",
  description:
    "VPN с нулевыми логами на протоколе VLESS + Reality. Серверы в Хельсинки и Амстердаме. Без рекламы и слежки. От 100₽/мес.",
  metadataBase: new URL("https://www.escapethematrix.to"),
  alternates: {
    canonical: "https://www.escapethematrix.to",
  },
  openGraph: {
    title: "Escape The Matrix — VPN без логов | VLESS + Reality",
    description:
      "Zero logs. Zero trace. VLESS + Reality. Серверы в Хельсинки и Амстердаме. От 100₽/мес.",
    url: "https://www.escapethematrix.to",
    siteName: "Escape The Matrix",
    locale: "ru_RU",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Escape The Matrix — VPN без логов",
    description: "Zero logs. Zero trace. VLESS + Reality. От 100₽/мес.",
  },
  keywords: [
    "vpn",
    "vless vpn",
    "vpn без логов",
    "купить vpn",
    "vpn россия",
    "vpn хельсинки",
    "vpn амстердам",
    "дешевый vpn",
    "reality vpn",
    "vpn без рекламы",
  ],
};

export default function Home() {
  return <HomeClient />;
}