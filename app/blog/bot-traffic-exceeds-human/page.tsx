import type { Metadata } from "next";
import ArticlePageClient from "../ArticlePageClient";

export const metadata: Metadata = {
  title: "Трафик ботов превысил трафик людей: что это значит — EscapeTheMatrix",
  description:
    "По данным Cloudflare, машинный трафик впервые превысил трафик людей — 57,5% против 42,5%. Главная причина — автономные ИИ-агенты. Что это значит для интернета и приватности.",
  metadataBase: new URL("https://www.escapethematrix.to"),
  alternates: {
    canonical: "https://www.escapethematrix.to/blog/bot-traffic-exceeds-human",
    languages: {
      "ru": "https://www.escapethematrix.to/blog/bot-traffic-exceeds-human",
      "en": "https://www.escapethematrix.to/blog/bot-traffic-exceeds-human?lang=en",
      "de": "https://www.escapethematrix.to/blog/bot-traffic-exceeds-human?lang=de",
      "es": "https://www.escapethematrix.to/blog/bot-traffic-exceeds-human?lang=es",
      "zh": "https://www.escapethematrix.to/blog/bot-traffic-exceeds-human?lang=zh",
      "x-default": "https://www.escapethematrix.to/blog/bot-traffic-exceeds-human",
    },
  },
  openGraph: {
    title: "Трафик ботов впервые превысил трафик людей",
    description:
      "Cloudflare: 57,5% интернет-трафика теперь генерируют боты и ИИ-агенты. Разбираем, что это значит для пользователей.",
    url: "https://www.escapethematrix.to/blog/bot-traffic-exceeds-human",
    siteName: "EscapeTheMatrix",
    type: "article",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Трафик ботов превысил трафик людей",
    description: "Cloudflare: автономные ИИ-агенты обеспечили 57,5% всего интернет-трафика.",
  },
  keywords: [
    "трафик ботов",
    "ии агенты интернет",
    "cloudflare статистика",
    "машинный трафик",
    "ии трафик 2026",
    "боты против людей интернет",
    "ии агенты безопасность",
  ],
};

export default function Page() {
  return <ArticlePageClient slug="bot-traffic-exceeds-human" />;
}