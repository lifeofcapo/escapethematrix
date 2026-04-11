"use client";

import { useState } from "react";
import { translations, privacyTranslations, Language } from "../../lib/i18n";
import Navbar from "../../components/Navbar";
import FAQSection from "../../components/FAQSection";
import Footer from "../../components/Footer";
import ProfileModal from "../../components/ProfileModal";

export default function PrivacyClient() {
  const [lang, setLang] = useState<Language>("ru");
  const [profileOpen, setProfileOpen] = useState(false);

  const t = translations[lang];
  const p = privacyTranslations[lang];

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

        <article className="px-6 py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-mono font-black text-green-400 uppercase mb-8">
              {p.title}
            </h1>
            <div className="prose prose-invert prose-sm md:prose-base font-mono text-white/60 max-w-none">
              <p className="text-white/40">{p.updated}</p>

              {p.sections.map((section: any, i: number) => (
                <div key={i}>
                  <h2 className="text-white font-mono text-xl mt-8 mb-4">{section.h}</h2>
                  {section.p && <p>{section.p}</p>}
                  {section.list && (
                    <ul className="list-disc list-inside space-y-2">
                      {section.list.map((item: string, j: number) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.p2 && <p>{section.p2}</p>}
                  {section.bot && (
                    <p>
                      <a
                        href="https://t.me/EscapeTheMatrixVPNBot"
                        className="text-green-400 hover:underline ml-1"
                      >
                        @EscapeTheMatrix_Bot
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </article>

        <FAQSection t={t} />
        <Footer t={t} />

        {profileOpen && (
          <ProfileModal t={t} onClose={() => setProfileOpen(false)} />
        )}
      </main>
    </>
  );
}