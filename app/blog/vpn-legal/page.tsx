import type { Metadata } from "next";
import ArticlePageClient from "../ArticlePageClient";

export const metadata: Metadata = {
  title: "Is Using a VPN Legal? Laws Around the World — Escape The Matrix",
  description:
    "VPNs are legal in most countries, but banned or restricted in some. Learn the legal status of VPNs in Russia, China, UAE, EU, US and more.",
  metadataBase: new URL("https://www.escapethematrix.to"),
  alternates: {
    canonical: "https://www.escapethematrix.to/blog/vpn-legal",
    languages: {
      "ru": "https://www.escapethematrix.to/blog/vpn-legal?lang=ru",
      "en": "https://www.escapethematrix.to/blog/vpn-legal",
      "de": "https://www.escapethematrix.to/blog/vpn-legal?lang=de",
      "es": "https://www.escapethematrix.to/blog/vpn-legal?lang=es",
      "zh": "https://www.escapethematrix.to/blog/vpn-legal?lang=zh",
      "x-default": "https://www.escapethematrix.to/blog/vpn-legal",
    },
  },
  openGraph: {
    title: "Is Using a VPN Legal? Laws Around the World",
    description:
      "Full overview of VPN legality in different countries — from fully legal to restricted or banned.",
    url: "https://www.escapethematrix.to/blog/vpn-legal",
    siteName: "Escape The Matrix",
    type: "article",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Is Using a VPN Legal?",
    description: "VPN legality worldwide — Russia, China, UAE, EU, US and more.",
  },
  keywords: [
    "vpn legal",
    "is vpn legal",
    "vpn laws by country",
    "vpn banned countries",
    "vpn china",
    "vpn russia",
    "vpn legal status",
    "законность vpn",
    "vpn запрещен",
    "vpn законы стран",
  ],
};

export default function Page() {
  return <ArticlePageClient slug="vpn-legal" />;
}