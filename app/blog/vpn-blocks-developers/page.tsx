import type { Metadata } from "next";
import ArticlePageClient from "../ArticlePageClient";

export const metadata: Metadata = {
  title: "Блокировки VPN бьют по разработчикам: проблемы с GitHub и open source — EscapeTheMatrix",
  description:
    "Российские IT-компании столкнулись с серьёзными сбоями из-за ограничений VPN-трафика: GitHub, библиотеки и облачные среды разработки работают с перебоями. Причины и решения.",
  metadataBase: new URL("https://www.escapethematrix.to"),
  alternates: {
    canonical: "https://www.escapethematrix.to/blog/vpn-blocks-developers",
    languages: {
      "ru": "https://www.escapethematrix.to/blog/vpn-blocks-developers",
      "en": "https://www.escapethematrix.to/blog/vpn-blocks-developers?lang=en",
      "de": "https://www.escapethematrix.to/blog/vpn-blocks-developers?lang=de",
      "es": "https://www.escapethematrix.to/blog/vpn-blocks-developers?lang=es",
      "zh": "https://www.escapethematrix.to/blog/vpn-blocks-developers?lang=zh",
      "x-default": "https://www.escapethematrix.to/blog/vpn-blocks-developers",
    },
  },
  openGraph: {
    title: "Блокировки VPN бьют по разработчикам: проблемы с GitHub и open source",
    description:
      "Сбои с доступом к GitHub и репозиториям из-за блокировок VPN. Масштаб проблемы и как разработчикам сохранить стабильный доступ.",
    url: "https://www.escapethematrix.to/blog/vpn-blocks-developers",
    siteName: "EscapeTheMatrix",
    type: "article",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Блокировки VPN бьют по разработчикам",
    description: "GitHub, open source и облачная разработка под давлением блокировок. Как сохранить доступ.",
  },
  keywords: [
    "vpn блокировки разработчики",
    "github доступ проблемы",
    "open source россия",
    "vpn для it",
    "белый список ркн github",
    "стабильный vpn для разработки",
    "vpn npm pypi docker",
  ],
};

export default function Page() {
  return <ArticlePageClient slug="vpn-blocks-developers" />;
}