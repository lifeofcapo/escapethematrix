import type { Metadata } from "next";
import { IBM_Plex_Mono, Anton } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
});

const anton = Anton({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-anton",
});

export const metadata: Metadata = {
  title: "Escape The Matrix — VPN",
  description: "Zero logs. Zero trace. VLESS + Reality. Helsinki & Amsterdam. 100₽/мес.",
  metadataBase: new URL("https://escapethematrix.to"),
  openGraph: {
    title: "Escape The Matrix — VPN",
    description: "Zero logs. Zero trace. Unlimited. 100₽/мес.",
    url: "https://escapethematrix.to",
    siteName: "Escape The Matrix",
    locale: "ru_RU",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Escape The Matrix — VPN",
    description: "Zero logs. Zero trace. Unlimited. 100₽/мес.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`dark ${ibmPlexMono.variable} ${anton.variable}`}>
      <body className={ibmPlexMono.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}