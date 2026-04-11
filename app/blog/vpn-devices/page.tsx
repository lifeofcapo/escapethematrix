import type { Metadata } from "next";
import ArticlePageClient from "../ArticlePageClient";

export const metadata: Metadata = {
  title: "Where to Install a VPN? Complete Device Guide — Escape The Matrix",
  description:
    "How to install a VPN on Android, iOS, Windows, macOS, Linux, router, and Smart TV. Step-by-step guide for all devices and platforms.",
  metadataBase: new URL("https://escapethematrix.to"),
  alternates: {
    canonical: "https://escapethematrix.to/blog/vpn-devices",
  },
  openGraph: {
    title: "Where to Install a VPN? Complete Device Guide",
    description:
      "Install VPN on Android, iOS, Windows, macOS, Linux, router, Smart TV — full guide for all devices.",
    url: "https://escapethematrix.to/blog/vpn-devices",
    siteName: "Escape The Matrix",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Where to Install a VPN? Complete Device Guide",
    description: "VPN setup guide for Android, iOS, Windows, macOS, Linux, router, Smart TV.",
  },
  keywords: [
    "vpn install android",
    "vpn install ios",
    "vpn windows setup",
    "vpn macos",
    "vpn router",
    "vpn smart tv",
    "vpn linux",
    "vpn all devices",
    "установить vpn android",
    "vpn роутер настройка",
    "vpn на всех устройствах",
  ],
};

export default function Page() {
  return <ArticlePageClient slug="vpn-devices" />;
}