import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Terms of Service — EscapeTheMatrix VPN",
    description:
      "Terms of Service for EscapeTheMatrix VPN. Understand your rights and obligations when using our service.",
    metadataBase: new URL("https://www.escapethematrix.to"),
    alternates: {
      canonical: "https://www.escapethematrix.to/terms",
      languages: {
        "en": "https://www.escapethematrix.to/terms",
        "ru": "https://www.escapethematrix.to/terms",
        "de": "https://www.escapethematrix.to/terms",
        "es": "https://www.escapethematrix.to/terms",
        "zh": "https://www.escapethematrix.to/terms",
      },
    },
    openGraph: {
      title: "Terms of Service — EscapeTheMatrix VPN",
      description: "Terms of Service for Escape The Matrix VPN.",
      url: "https://www.escapethematrix.to/terms",
      siteName: "Escape The Matrix",
      type: "website",
    },
  };
}

export default function TermsPage() {
  return <TermsClient />;
}