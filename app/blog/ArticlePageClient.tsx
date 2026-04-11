"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { translations, articleContent, Language } from "../../lib/i18n";
import Navbar from "../../components/Navbar";
import FAQSection from "../../components/FAQSection";
import Footer from "../../components/Footer";
import ProfileModal from "../../components/ProfileModal";

interface ArticlePageClientProps {
  slug: "public-wifi-safe" | "vpn-legal" | "vpn-devices";
}

export default function ArticlePageClient({ slug }: ArticlePageClientProps) {
  const [lang, setLang] = useState<Language>("ru");
  const [profileOpen, setProfileOpen] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get("lang") as Language;
      if (urlLang && ["ru", "en", "es", "de", "zh"].includes(urlLang)) {
        setLang(urlLang);
      }
    }
  }, []);

  const t = translations[lang];
  const article = articleContent[slug][lang];

  const tagColors: Record<string, string> = {
    "Безопасность": "text-blue-400/60 border-blue-400/20",
    "Security": "text-blue-400/60 border-blue-400/20",
    "Sicherheit": "text-blue-400/60 border-blue-400/20",
    "Seguridad": "text-blue-400/60 border-blue-400/20",
    "安全": "text-blue-400/60 border-blue-400/20",
    "Право": "text-yellow-400/60 border-yellow-400/20",
    "Legal": "text-yellow-400/60 border-yellow-400/20",
    "Recht": "text-yellow-400/60 border-yellow-400/20",
    "法律": "text-yellow-400/60 border-yellow-400/20",
    "Руководство": "text-green-400/60 border-green-400/20",
    "Guide": "text-green-400/60 border-green-400/20",
    "Anleitung": "text-green-400/60 border-green-400/20",
    "Guía": "text-green-400/60 border-green-400/20",
    "指南": "text-green-400/60 border-green-400/20",
  };
  const tagClass = tagColors[article.tag] ?? "text-white/40 border-white/10";

  return (
    <>
      <main className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
        <div className="noise-overlay" />
        <Navbar
          t={t}
          lang={lang}
          setLang={setLang}
          onProfileOpen={() => setProfileOpen(true)}
        />
        <div className="px-6 pt-24 pb-0">
          <div className="max-w-3xl mx-auto">
            <nav aria-label="breadcrumb" className="flex items-center gap-2 font-mono text-xs text-white/25 tracking-widest mb-8">
              <Link href="/" className="hover:text-green-400/60 transition-colors">HOME</Link>
              <span>/</span>
              <Link href="/#blog" className="hover:text-green-400/60 transition-colors">BLOG</Link>
              <span>/</span>
              <span className="text-white/50">{article.tag.toUpperCase()}</span>
            </nav>
          </div>
        </div>

        <article className="px-6 pb-24" itemScope itemType="https://schema.org/Article">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <span className={`font-mono text-[10px] tracking-[0.3em] uppercase border px-2 py-1 rounded-full ${tagClass}`}>
                {article.tag}
              </span>
              <span className="text-white/20 font-mono text-[10px] tracking-widest">{article.date}</span>
              <span className="text-white/20 font-mono text-[10px] tracking-widest">{article.readTime}</span>
            </div>
            <h1
              itemProp="headline"
              className="text-2xl md:text-4xl font-mono font-black text-white leading-tight mb-8"
            >
              {article.title}
            </h1>
            <p
              itemProp="description"
              className="text-white/50 font-mono text-base leading-relaxed mb-12 border-l-2 border-green-400/30 pl-4"
            >
              {article.description}
            </p>
            <div
              itemProp="articleBody"
              className="font-mono text-white/60 space-y-6 max-w-none"
            >
              {article.content.map((block: any, i: number) => {
                if (block.type === "intro") {
                  return (
                    <p key={i} className="text-white/70 text-base leading-relaxed">
                      {block.text}
                    </p>
                  );
                }
                if (block.type === "h2") {
                  return (
                    <h2 key={i} className="text-white font-mono font-bold text-xl mt-10 mb-4 text-green-400/80">
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "p") {
                  return (
                    <p key={i} className="text-white/55 leading-relaxed">
                      {block.text}
                    </p>
                  );
                }
                if (block.type === "list") {
                  return (
                    <ul key={i} className="space-y-3 pl-4">
                      {block.items.map((item: string, j: number) => (
                        <li key={j} className="flex items-start gap-3 text-white/50 text-sm leading-relaxed">
                          <span className="text-green-400/50 mt-0.5 flex-shrink-0">◆</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (block.type === "conclusion") {
                  return (
                    <div key={i} className="mt-12 p-6 border border-green-400/15 bg-green-400/[0.03] rounded-sm">
                      <div className="text-[10px] font-mono tracking-[0.4em] text-green-400/50 uppercase mb-3">— Вывод</div>
                      <p className="text-white/60 font-mono text-sm leading-relaxed">
                        {block.text}
                      </p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
            <div className="mt-16 pt-10 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <a
                href="EscapeTheMatrixVPNBot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-green-400 text-[#080808] font-mono font-bold text-sm tracking-wider rounded hover:bg-green-300 transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.01 9.47c-.148.659-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 14.607l-2.95-.924c-.641-.201-.654-.641.136-.949l11.532-4.447c.536-.194 1.004.131.834.961h.53z" />
                </svg>
                {t.howto.cta}
              </a>
              <Link
                href="/"
                className="text-white/30 font-mono text-xs tracking-widest hover:text-white/60 transition-colors"
              >
                ← {lang === "ru" ? "На главную" : lang === "de" ? "Zurück" : lang === "es" ? "Volver" : lang === "zh" ? "返回首页" : "Back to home"}
              </Link>
            </div>
          </div>
        </article>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": article.title,
              "description": article.description,
              "datePublished": "2026-04-09",
              "dateModified": "2026-04-09",
              "author": {
                "@type": "Organization",
                "name": "Escape The Matrix",
                "url": "https://escapethematrix.to"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Escape The Matrix",
                "url": "https://escapethematrix.to"
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://escapethematrix.to/blog/${slug}`
              }
            })
          }}
        />

        <FAQSection t={t} />
        <Footer t={t} />

        {profileOpen && (
          <ProfileModal t={t} onClose={() => setProfileOpen(false)} />
        )}
      </main>
    </>
  );
}