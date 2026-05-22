"use client";

import { useState } from "react";
import { translations, Language } from "../../lib/i18n";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import PricingSection from "./PricingSection";
import PaymentSection from "./PaymentSection";
import CompareSection from "./CompareSection";
import BlogSection from "./BlogSection";
import HowToSection from "./HowToSection";
import FAQSection from "../FAQSection";
import Navbar from "../Navbar";
import Footer from "../Footer";

export default function HomeClient() {
  const [lang, setLang] = useState<Language>("ru");
  const t = translations[lang];

  return (
    <main className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      <div className="noise-overlay" />
      <Navbar t={t} lang={lang} setLang={setLang} />
      <HeroSection t={t} />
      <FeaturesSection t={t} />
      <CompareSection t={t} />
      <PricingSection t={t} />
      <PaymentSection t={t} />
      <HowToSection t={t} />
      <BlogSection t={t} lang={lang} />
      <FAQSection t={t} />
      <Footer t={t} />
    </main>
  );
}