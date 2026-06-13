"use client";

import Link from "next/link";
import { Language } from "@/lib/types";
import { getRelatedArticles } from "./articles";

interface RelatedArticlesProps {
  lang: Language;
  currentSlug: string;
}

const sectionTitle: Record<Language, string> = {
  ru: "Читайте также",
  en: "Read also",
  es: "Lee también",
  de: "Lesen Sie auch",
  zh: "推荐阅读",
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
  "Updates ": "text-orange-400/60 border-orange-400/20",
  "更新": "text-orange-400/60 border-orange-400/20",
};

export default function RelatedArticles({ lang, currentSlug }: RelatedArticlesProps) {
  const related = getRelatedArticles(lang, currentSlug, 3);
  const langSuffix = lang === "ru" ? "" : `?lang=${lang}`;

  if (related.length === 0) return null;

  return (
    <section className="px-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase mb-6">
          {sectionTitle[lang]}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {related.map((article) => {
            const tagClass = tagColors[article.tag] ?? "text-white/40 border-white/10";
            return (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}${langSuffix}`}
                className="group block p-5 border border-white/5 rounded-sm bg-white/[0.02] hover:border-green-400/20 hover:bg-green-400/[0.03] transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`font-mono text-[9px] tracking-[0.3em] uppercase border px-2 py-0.5 rounded-full ${tagClass}`}>
                    {article.tag}
                  </span>
                  <span className="text-white/20 font-mono text-[9px] tracking-widest">{article.date}</span>
                </div>
                <h3 className="font-mono font-bold text-sm text-white/80 leading-snug group-hover:text-green-400/80 transition-colors mb-2">
                  {article.title}
                </h3>
                <p className="text-white/40 font-mono text-xs leading-relaxed line-clamp-3">
                  {article.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}