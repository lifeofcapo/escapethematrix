"use client";

import { TranslationSet } from "@/lib/i18n";

export default function PricingSection({ t }: { t: TranslationSet }) {
  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <span className="text-2xl md:text-3xl font-mono font-black tracking-wider text-green-400 uppercase">
            — {t.pricing.title}
          </span>
        </div>
        <p className="text-white/25 font-mono text-sm tracking-wider mb-16">
          {t.pricing.sub}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          {t.pricing.regions.map((region: any, i: number) => (
            <div
              key={i}
              className="group relative border border-white/8 rounded-sm p-8 hover:border-green-400/30 transition-all bg-white/[0.02] hover:bg-white/[0.04]"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="text-3xl mb-2">{region.flag}</div>
                  <div className="text-white font-mono font-bold tracking-wider text-lg">
                    {region.city}
                  </div>
                  <div className="text-white/30 font-mono text-xs tracking-widest uppercase mt-0.5">
                    {region.country}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-mono font-black text-2xl">
                    {t.pricing.perMonth}
                  </div>
                  <div className="text-white/25 font-mono text-xs">{t.pricing.month}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/40 font-mono text-xs tracking-widest">
                  {region.ping}
                </span>
                <span className="ml-auto text-xs font-mono text-green-400/60 border border-green-400/20 px-2 py-0.5 rounded-full">
                  {t.pricing.badge}
                </span>
              </div>
              <ul className="space-y-2 mb-8">
                {t.pricing.features.map((f: string, j: number) => (
                  <li key={j} className="flex items-center gap-2 text-white/40 font-mono text-xs">
                    <span className="text-green-400/60">›</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="https://t.me/EscapeTheMatrixVPNBot"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 border border-white/10 text-white/60 font-mono text-xs tracking-widest uppercase hover:border-green-400/40 hover:text-green-400 transition-all rounded-sm"
              >
                {t.pricing.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}