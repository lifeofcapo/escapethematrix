import type { Metadata } from "next";
import ArticlePageClient from "../ArticlePageClient";

export const metadata: Metadata = {
  title: "Новые протоколы подключения и переход на INCY — обновления EscapeTheMatrix",
  description:
    "Из-за новых блокировок РКН на мобильных устройствах мы добавили протоколы VLESS+gRPC, VLESS+xHTTP и Hysteria2, а также рекомендуем перейти на приложение INCY вместо Happ и V2rayTun.",
  metadataBase: new URL("https://www.escapethematrix.to"),
  alternates: {
    canonical: "https://www.escapethematrix.to/blog/escapethematrix-news",
    languages: {
      "ru": "https://www.escapethematrix.to/blog/escapethematrix-news",
      "en": "https://www.escapethematrix.to/blog/escapethematrix-news?lang=en",
      "de": "https://www.escapethematrix.to/blog/escapethematrix-news?lang=de",
      "es": "https://www.escapethematrix.to/blog/escapethematrix-news?lang=es",
      "zh": "https://www.escapethematrix.to/blog/escapethematrix-news?lang=zh",
      "x-default": "https://www.escapethematrix.to/blog/escapethematrix-news",
    },
  },
  openGraph: {
    title: "Новые протоколы подключения и переход на INCY",
    description:
      "EscapeTheMatrix добавил VLESS+gRPC, VLESS+xHTTP и Hysteria2 и рекомендует приложение INCY для стабильного подключения.",
    url: "https://www.escapethematrix.to/blog/escapethematrix-news",
    siteName: "EscapeTheMatrix",
    type: "article",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Новые протоколы подключения EscapeTheMatrix",
    description: "VLESS+gRPC, VLESS+xHTTP, Hysteria2 и переход на INCY для стабильного VPN.",
  },
  keywords: [
    "incy vpn приложение",
    "vless grpc",
    "vless xhttp",
    "hysteria2",
    "escapethematrix обновление",
    "стабильный vpn протокол",
    "альтернатива happ v2raytun",
  ],
};

export default function Page() {
  return <ArticlePageClient slug="escapethematrix-news" />;
}