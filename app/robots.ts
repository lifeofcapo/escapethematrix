import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/blog',
          '/privacy',
          '/terms',
          '/blog/public-wifi-safe',
          '/blog/vpn-legal',
          '/blog/vpn-devices',
        ],
        disallow: [
          '/admin/',       
          '/api/',       
          '/miniapp/',     
          '/profile/*',    
          '/failed-payment/', 
          '/successful-payment/', 
          '/_next/static/media/',
        ],
      },
    ],
    sitemap: 'https://escapethematrix.to/sitemap.xml',
  }
}