import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Terms of Service — Escape The Matrix VPN",
    description:
      "Terms of Service for Escape The Matrix VPN. Understand your rights and obligations when using our service.",
    metadataBase: new URL("https://escapethematrix.to"),
    alternates: {
      canonical: "https://escapethematrix.to/terms",
      languages: {
        "en": "https://escapethematrix.to/terms",
        "ru": "https://escapethematrix.to/terms",
        "de": "https://escapethematrix.to/terms",
        "es": "https://escapethematrix.to/terms",
        "zh": "https://escapethematrix.to/terms",
      },
    },
    openGraph: {
      title: "Terms of Service — Escape The Matrix VPN",
      description: "Terms of Service for Escape The Matrix VPN.",
      url: "https://escapethematrix.to/terms",
      siteName: "Escape The Matrix",
      type: "website",
    },
  };
}

export default function TermsPage() {
  return <TermsClient />;
}