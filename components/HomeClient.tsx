"use client";

import { useState, useEffect } from "react";
import { translations, Language } from "../lib/i18n";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import PricingSection from "../components/PricingSection";
import PaymentSection from "../components/PaymentSection";
import CompareSection from "../components/CompareSection";
import BlogSection from "../components/BlogSection";
import HowToSection from "../components/HowToSection";
import FAQSection from "../components/FAQSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CaptchaGate from "../components/CaptchaGate";

export default function HomeClient() {
  const [lang, setLang] = useState<Language>("ru");
  const [profileOpen, setProfileOpen] = useState(false);
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Предзагрузка контента после быстрой проверки кэша
  useEffect(() => {
    const cached = localStorage.getItem("captcha_passed");
    if (cached) {
      try {
        const { timestamp } = JSON.parse(cached);
        const oneDay = 24 * 60 * 60 * 1000;
        if (Date.now() - timestamp < oneDay) {
          setCaptchaPassed(true);
        }
      } catch {}
    }
    setShowContent(true);
  }, []);

  const t = translations[lang];

  // Рендер контента параллельно с капчей для SEO и производительности
  const mainContent = (
    <main className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      <div className="noise-overlay" />
      <Navbar
        t={t}
        lang={lang}
        setLang={setLang}
      />
      {captchaPassed ? (
        <>
          <HeroSection t={t} />
          <FeaturesSection t={t} />
          <CompareSection t={t} />
          <PricingSection t={t} />
          <PaymentSection t={t}/>
          <HowToSection t={t} />
          <BlogSection t={t} lang={lang} />
          <FAQSection t={t} />
          <Footer t={t} />
        </>
      ) : (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-green-400/50 font-mono text-3xl flicker">◉</div>
        </div>
      )}
    </main>
  );

  return (
    <>
      {!captchaPassed && showContent && (
        <CaptchaGate onPassed={() => setCaptchaPassed(true)} />
      )}
      {showContent && mainContent}
      {!showContent && (
        <div className="min-h-screen bg-[#080808] flex items-center justify-center">
          <div className="text-green-400/50 font-mono text-3xl flicker">◉</div>
        </div>
      )}
    </>
  );
}