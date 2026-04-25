"use client";

import { useState } from "react";
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

  const t = translations[lang];

  return (
    <>
      {!captchaPassed && (
        <CaptchaGate onPassed={() => setCaptchaPassed(true)} />
      )}
      <main className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
        <div className="noise-overlay" />
        <Navbar
          t={t}
          lang={lang}
          setLang={setLang}
        />
        <HeroSection t={t} />
        <FeaturesSection t={t} />
        <CompareSection t={t} />
        <PricingSection t={t} />
        <PaymentSection t={t}/>
        <HowToSection t={t} />
        <BlogSection t={t} lang={lang} />
        <FAQSection t={t} />
        <Footer t={t} />
      </main>
    </>
  );
}