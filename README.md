# EscapeTheMatrix — VPN Service Platform

A full-stack, multilingual VPN subscription platform built with Next.js (App Router), featuring authentication, automated payments, subscription management, and SEO-optimized content delivery.

This project was built as a production system for a real VPN service and showcases end-to-end ownership: frontend, backend integrations, payments, database, internationalization, and SEO.

---

## Overview

EscapeTheMatrix is the marketing site and customer dashboard for a VPN service. Users authenticate, manage their subscriptions, and pay through integrated payment providers, while the platform serves localized content (5 languages) optimized for organic search.

**Live focus areas:**
- Customer-facing subscription management (purchase, renewal, status)
- Dual authentication: Google OAuth and Telegram-bot-issued access keys
- Payment processing with webhook-based status callbacks
- Multilingual content delivery and SEO-first architecture
- A growing content hub (blog) with structured data for search engines

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router, Server & Client Components) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Authentication | NextAuth.js (Google OAuth) + custom token-based login |
| Database | Remote database service (accessed via internal API layer) |
| Payments | CryptoCloud Pay, YooKassa |
| i18n | Custom translation system (ru, en, es, de, zh) |
| Deployment | Vercel |

---

## Key Features

### Authentication
- **Google OAuth** via NextAuth.js for one-click sign-in
- **Profile key login** — an alternative auth flow where users receive a unique access key through a Telegram bot, which is verified server-side against the subscription database
- Session-aware profile dashboard with automatic data refresh

### Subscriptions & Payments
- Full subscription lifecycle: purchase, renewal, and status tracking
- Dual payment gateway integration:
  - **CryptoCloud Pay** — cryptocurrency payments
  - **YooKassa** — card/local payment methods
- Dedicated webhook endpoints handling `successful-payment` and `failed-payment` callbacks, keeping subscription state in sync with payment provider events
- Real-time subscription info displayed in the user dashboard (plan, expiry, status)

### Internationalization (i18n)
- Fully localized UI and content across **5 languages**: Russian, English, Spanish, German, Chinese
- Centralized translation dictionary with strict typing (`TranslationSet`)
- Locale-aware routing via query parameters with `hreflang` alternates for SEO

### SEO Architecture
- Per-page `Metadata` exports (title, description, Open Graph, Twitter cards, keywords)
- `hreflang` alternates for all 5 locales plus `x-default`
- JSON-LD structured data (`schema.org/Article`) on blog posts for rich search results
- Canonical URLs, semantic HTML (`itemScope`, `itemProp`), and crawlable breadcrumb navigation
- Custom **404 page** matching the site's design system

### Content / Blog
- Statically defined, fully localized articles (5 languages each)
- Reusable content-block renderer supporting intros, headings, paragraphs, lists, images, and conclusions
- "Related articles" recommendations (3 most recent posts) on every article page
- Dedicated `/blog` index listing all posts

### Legal & Compliance
- Dedicated **Privacy Policy** and **Terms of Service** pages
- Personal data processing consent flow integrated into the OAuth login screen

### Client Compatibility
- Maintained, up-to-date list of recommended VPN client apps across platforms (iOS, Android, desktop), with protocol-specific guidance (VLESS, Hysteria2, etc.)

### Architecture
- Centralized type definitions (`lib/types.ts`) shared across components, API routes, and payment/database layers
- Clear separation between server-rendered metadata (SEO) and client-rendered interactivity (`"use client"` components)
- Modular component structure: `Navbar`, `Footer`, `FAQSection`, `ProfileDashboard`, `ProfileLogin`, `CompareSection`, etc.

---

## Highlights

- **Production system**, not a demo — built for real users, real payments, and real traffic
- **Two independent auth flows** working side by side (OAuth + custom token-based login via external Telegram bot)
- **Two payment providers** with reconciled webhook handling for both success and failure states
- **5-language localization** across UI, blog content, and SEO metadata
- **SEO-first design**: structured data, hreflang, canonical URLs, and a custom 404 — built to rank

---

## Disclaimer

This repository is shared as a **portfolio piece** to demonstrate engineering capability and project scope. It is not intended for reuse, redeployment, or as a template. 