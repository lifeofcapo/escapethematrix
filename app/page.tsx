"use client";

import { useState } from "react";
import { translations, Language } from "../lib/i18n";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import PricingSection from "../components/PricingSection";
import FAQSection from "../components/FAQSection";
import ProfileModal from "../components/ProfileModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CaptchaGate from "../components/CaptchaGate";

export default function Home() {
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
          onProfileOpen={() => setProfileOpen(true)}
        />
        <HeroSection t={t} />
        <FeaturesSection t={t} />
        <PricingSection t={t} />
        <FAQSection t={t} />
        <Footer t={t} />
        {profileOpen && (
          <ProfileModal t={t} onClose={() => setProfileOpen(false)} />
        )}
      </main>
    </>
  );
}