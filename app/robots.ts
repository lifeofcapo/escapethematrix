import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',       
          '/api/',       
          '/miniapp/',     
          '/profile/*',    
          '/failed-payment/', 
          '/successful-payment/', 
        ],
      },
    ],
    sitemap: 'https://escapethematrix.to/sitemap.xml',
  }
}