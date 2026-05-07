"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { translations, Language } from "@/lib/i18n";

const LABELS: Record<Language, { heading: string; sub: string; btn: string }> = {
  ru: { heading: "Страница не найдена", sub: "Возможно, она была удалена или вы перешли по неверной ссылке.", btn: "← На главную" },
  en: { heading: "Page not found",      sub: "It may have been removed or the link is incorrect.",               btn: "← Back to home" },
  es: { heading: "Página no encontrada", sub: "Es posible que haya sido eliminada o el enlace sea incorrecto.",  btn: "← Volver al inicio" },
  de: { heading: "Seite nicht gefunden", sub: "Sie wurde möglicherweise entfernt oder der Link ist falsch.",    btn: "← Zur Startseite" },
  zh: { heading: "页面未找到",            sub: "该页面可能已被删除或链接不正确。",                                    btn: "← 返回首页" },
};

export default function NotFound() {
  const [lang, setLang] = useState<Language>("ru");
  const t = translations[lang];
  const labels = LABELS[lang];
  const router = useRouter();
  const lottieRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: any;
    import("lottie-web").then((lottie) => {
      if (!lottieRef.current) return;
      anim = lottie.default.loadAnimation({
        container: lottieRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/animations/404error.json",
      });
    });
    return () => anim?.destroy();
  }, []);

  return (
    <main className="min-h-screen bg-[#080808] text-white flex flex-col overflow-x-hidden">
      <div className="noise-overlay" />

      <Navbar t={t} lang={lang} setLang={setLang} />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-32">

        <div
          ref={lottieRef}
          className="w-64 h-40 sm:w-80 sm:h-52 select-none pointer-events-none"
          aria-hidden="true"
        />
        <h1 className="font-mono text-xl sm:text-2xl text-white/70 tracking-[0.15em] uppercase mt-4 text-center">
          {labels.heading}
        </h1>
        <p className="font-mono text-sm text-white/30 tracking-wider mt-3 text-center max-w-sm leading-relaxed">
          {labels.sub}
        </p>

        <button
          onClick={() => router.push("/")}
          className="mt-10 px-8 py-3.5 border border-green-400/30 text-green-400 font-mono text-sm tracking-[0.3em] uppercase hover:bg-green-400/8 hover:border-green-400/60 transition-all rounded-sm"
        >
          {labels.btn}
        </button>
      </div>

      <Footer t={t} />
    </main>
  );
}