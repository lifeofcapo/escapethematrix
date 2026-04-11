import type { Metadata } from "next";
import ArticlePageClient from "../ArticlePageClient";

export const metadata: Metadata = {
  title: "Is Public Wi-Fi Safe? How to Protect Your Data — Escape The Matrix",
  description:
    "Coffee shops, airports, hotels — public Wi-Fi is everywhere but dangerous. Learn about MITM attacks, evil twin hotspots, and how a VPN protects you.",
  metadataBase: new URL("https://escapethematrix.to"),
  alternates: {
    canonical: "https://escapethematrix.to/blog/public-wifi-safe",
  },
  openGraph: {
    title: "Is Public Wi-Fi Safe? How to Protect Your Data",
    description:
      "Learn how public Wi-Fi puts your data at risk and how to stay protected with a VPN.",
    url: "https://escapethematrix.to/blog/public-wifi-safe",
    siteName: "Escape The Matrix",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Is Public Wi-Fi Safe?",
    description: "Learn how public Wi-Fi puts your data at risk and how a VPN protects you.",
  },
  keywords: [
    "public wifi security",
    "public wifi safe",
    "wifi vpn protection",
    "MITM attack",
    "evil twin wifi",
    "vpn public wifi",
    "безопасный wifi",
    "публичный wifi",
    "vpn защита",
  ],
};

export default function Page() {
  return <ArticlePageClient slug="public-wifi-safe" />;
}