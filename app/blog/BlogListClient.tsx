"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { translations, Language } from "../../lib/i18n";
import { getArticleList } from "./articles";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const pageTitle: Record<Language, string> = {
  ru: "Блог",
  en: "Blog",
  es: "Blog",
  de: "Blog",
  zh: "博客",
};

const pageSubtitle: Record<Language, string> = {
  ru: "Новости, гайды и обновления EscapeTheMatrix",
  en: "News, guides, and updates from EscapeTheMatrix",
  es: "Noticias, guías y novedades de EscapeTheMatrix",
  de: "Neuigkeiten, Anleitungen und Updates von EscapeTheMatrix",
  zh: "EscapeTheMatrix的新闻、指南与更新",
};

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
  "Новости": "text-purple-400/60 border-purple-400/20",
  "News": "text-purple-400/60 border-purple-400/20",
  "Noticias": "text-purple-400/60 border-purple-400/20",
  "Nachrichten": "text-purple-400/60 border-purple-400/20",
  "新闻": "text-purple-400/60 border-purple-400/20",
  "Обновления": "text-orange-400/60 border-orange-400/20",
  "Updates": "text-orange-400/60 border-orange-400/20",
  "Actualizaciones": "text-orange-400/60 border-orange-400/20",
  "Aktualisierungen": "text-orange-400/60 border-orange-400/20",
  "更新": "text-orange-400/60 border-orange-400/20",
};

export default function BlogListClient() {
  const [lang, setLang] = useState<Language>("ru");

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
  const articles = getArticleList(lang);
  const langSuffix = lang === "ru" ? "" : `?lang=${lang}`;

  return (
    <main className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      <div className="noise-overlay" />
      <Navbar t={t} lang={lang} setLang={setLang} />

      <div className="px-6 pt-24 pb-0">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="breadcrumb" className="flex items-center gap-2 font-mono text-xs text-white/25 tracking-widest mb-8">
            <Link href="/" className="hover:text-green-400/60 transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-white/50">{pageTitle[lang].toUpperCase()}</span>
          </nav>
        </div>
      </div>

      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-mono font-black text-white leading-tight mb-3">
            {pageTitle[lang]}
          </h1>
          <p className="text-white/40 font-mono text-sm leading-relaxed mb-12 border-l-2 border-green-400/30 pl-4">
            {pageSubtitle[lang]}
          </p>

          <div className="flex flex-col gap-4">
            {articles.map((article) => {
              const tagClass = tagColors[article.tag] ?? "text-white/40 border-white/10";
              return (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}${langSuffix}`}
                  className="group block p-6 border border-white/5 rounded-sm bg-white/[0.02] hover:border-green-400/20 hover:bg-green-400/[0.03] transition-all"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className={`font-mono text-[10px] tracking-[0.3em] uppercase border px-2 py-1 rounded-full ${tagClass}`}>
                      {article.tag}
                    </span>
                    <span className="text-white/20 font-mono text-[10px] tracking-widest">{article.date}</span>
                    <span className="text-white/20 font-mono text-[10px] tracking-widest">{article.readTime}</span>
                  </div>
                  <h2 className="font-mono font-bold text-lg md:text-xl text-white/85 leading-snug group-hover:text-green-400/80 transition-colors mb-2">
                    {article.title}
                  </h2>
                  <p className="text-white/45 font-mono text-sm leading-relaxed">
                    {article.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer t={t} />
    </main>
  );
}