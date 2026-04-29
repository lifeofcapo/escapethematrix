"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Language } from "@/lib/i18n";

const LANGS: { code: Language; label: string; flag: string }[] = [
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
];

interface NavbarProps {
  t: any;
  lang: Language;
  setLang: (l: Language) => void;
}

export default function Navbar({ t, lang, setLang }: NavbarProps) {
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentLang = LANGS.find((l) => l.code === lang)!;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        <a href="/" className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Escape The Matrix"
            width={64}
            height={64}
            className="h-8 w-8 object-contain"
            priority
          />
        </a>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-2 border border-white/8 text-white/40 font-mono text-xs tracking-widest hover:border-white/20 hover:text-white/60 transition-all rounded-sm"
            >
              <span className="text-sm">{currentLang.flag}</span>
              <span className="uppercase hidden sm:inline">{currentLang.label}</span>
              <span
                className={`text-[10px] text-white/30 transition-transform duration-200 ${
                  langOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {langOpen && (
              <div className="absolute top-full mt-2 right-0 w-44 border border-white/10 bg-[#0e0e0e] rounded-sm overflow-hidden shadow-xl z-50">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent" />
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 font-mono text-xs tracking-widest transition-colors text-left
                      ${
                        lang === l.code
                          ? "text-green-400 bg-green-400/5"
                          : "text-white/50 hover:text-white/80 hover:bg-white/[0.03]"
                      }`}
                  >
                    <span>{l.flag}</span>
                    <span className="uppercase">{l.label}</span>
                    {lang === l.code && <span className="ml-auto text-green-400/60">◉</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <a
            href="/profile"
            className="hidden xs:flex px-3 sm:px-5 py-2 border border-white/10 text-white/60 font-mono text-xs sm:text-sm tracking-wider uppercase hover:border-green-400/40 hover:text-green-400 transition-all rounded-sm"
          >
            {t.nav.profile}
          </a>
          <a
            href="https://t.me/EscapeTheMatrixVPNBot"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 sm:px-5 py-2 border border-green-400/40 text-green-400 font-mono text-xs sm:text-sm tracking-wider uppercase hover:bg-green-400/10 hover:border-green-400/70 transition-all rounded-sm whitespace-nowrap"
          >
            <span className="hidden sm:inline">{t.nav.connect}</span>
            <span className="sm:hidden">TG</span>
          </a>
        </div>
      </div>
    </nav>
  );
}