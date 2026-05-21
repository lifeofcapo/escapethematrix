import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/blog',
          '/blog/public-wifi-safe',
          '/blog/vpn-legal',
          '/blog/vpn-devices',
          '/privacy',
          '/terms',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/miniapp/',
          '/profile',
          '/profile/',
          '/failed-payment/',
          '/successful-payment/',
          '/_next/static/media/',
        ],
      },
    ],
    sitemap: 'https://www.escapethematrix.to/sitemap.xml',
  }
}