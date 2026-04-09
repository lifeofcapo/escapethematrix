import type { Metadata } from "next";
import "./globals.css";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="dark">
      <body>{children}</body>
    </html>
  );
}