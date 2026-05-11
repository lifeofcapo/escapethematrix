import type { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Privacy Policy — Escape The Matrix VPN | Zero Logs",
    description:
      "Escape The Matrix VPN Privacy Policy. We collect zero user data — no logs, no IPs, no traffic records. Your privacy is fully protected.",
    metadataBase: new URL("https://www.escapethematrix.to"),
    alternates: {
      canonical: "https://www.escapethematrix.to/privacy",
      languages: {
        "en": "https://www.escapethematrix.to/privacy",
        "ru": "https://www.escapethematrix.to/privacy",
        "de": "https://www.escapethematrix.to/privacy",
        "es": "https://www.escapethematrix.to/privacy",
        "zh": "https://www.escapethematrix.to/privacy",
      },
    },
    openGraph: {
      title: "Privacy Policy — Escape The Matrix VPN",
      description: "Zero logs. Zero data. Read our full privacy policy.",
      url: "https://www.escapethematrix.to/privacy",
      siteName: "Escape The Matrix",
      type: "website",
    },
  };
}

export default function PrivacyPage() {
  return <PrivacyClient />;
}