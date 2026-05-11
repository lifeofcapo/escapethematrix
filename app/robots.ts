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