// app/blog/page.tsx
import type { Metadata } from "next";
import BlogListClient from "./BlogListClient";

export const metadata: Metadata = {
  title: "Блог — EscapeTheMatrix",
  description:
    "Новости, гайды и обновления EscapeTheMatrix: безопасность, VPN, блокировки и советы по защите данных.",
  metadataBase: new URL("https://www.escapethematrix.to"),
  alternates: {
    canonical: "https://www.escapethematrix.to/blog",
    languages: {
      "ru": "https://www.escapethematrix.to/blog",
      "en": "https://www.escapethematrix.to/blog?lang=en",
      "de": "https://www.escapethematrix.to/blog?lang=de",
      "es": "https://www.escapethematrix.to/blog?lang=es",
      "zh": "https://www.escapethematrix.to/blog?lang=zh",
      "x-default": "https://www.escapethematrix.to/blog",
    },
  },
  openGraph: {
    title: "Блог — EscapeTheMatrix",
    description: "Новости, гайды и обновления EscapeTheMatrix.",
    url: "https://www.escapethematrix.to/blog",
    siteName: "EscapeTheMatrix",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Блог — EscapeTheMatrix",
    description: "Новости, гайды и обновления EscapeTheMatrix.",
  },
};

export default function Page() {
  return <BlogListClient />;
}