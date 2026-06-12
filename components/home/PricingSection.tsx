"use client";
import { TranslationSet } from "@/lib/i18n";

export default function PricingSection({ t }: { t: TranslationSet }) {
  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <span className="text-2xl md:text-3xl font-mono font-black tracking-wider text-green-400 uppercase">
            — {t.pricing.title}
          </span>
        </div>
        <p className="text-white/25 font-mono text-sm tracking-wider mb-16">
          {t.pricing.sub}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/8 rounded-sm overflow-hidden mb-4 border border-white/8">
          {t.pricing.regions.map((region: any, i: number) => (
            <div key={i} className="bg-white/[0.02] p-6">
              <div className="text-3xl mb-2">{region.flag}</div>
              <div className="text-white font-mono font-bold tracking-wider text-base">
                {region.city}
              </div>
              <div className="text-white/30 font-mono text-[11px] tracking-widest uppercase mt-0.5">
                {region.country}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/40 font-mono text-xs tracking-wider">
                  {region.ping}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="border border-green-400/15 rounded-sm p-6 md:p-8 bg-white/[0.02] mb-8">
          <div className="text-white/35 font-mono text-[11px] tracking-[0.2em] uppercase mb-4">
            {t.pricing.includedTitle}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {t.pricing.protocols.map((proto: any, i: number) => (
              <div
                key={i}
                className="border border-white/8 rounded-sm p-3.5 hover:border-green-400/20 transition-colors"
              >
                <div className="text-green-400 text-lg mb-1.5">{proto.icon}</div>
                <div className="text-white font-bold font-mono text-[13px] tracking-wide">
                  {proto.name}
                </div>
                <div className="text-white/35 font-mono text-[11px] tracking-wider mt-0.5">
                  {proto.sub}
                </div>
              </div>
            ))}
          </div>
          <div className="text-white/30 font-mono text-xs tracking-wide mt-4 leading-relaxed">
            {t.pricing.protocolsNote}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {t.pricing.plans.map((plan: any, i: number) => {
            const featured = i === 1;
            return (
              <div
                key={i}
                className={`relative rounded-sm p-7 text-center transition-all ${
                  featured
                    ? "border-2 border-green-400 bg-green-400/[0.04]"
                    : "border border-white/8 hover:border-white/20"
                }`}
              >
                {plan.badge && (
                  <div
                    className={`absolute -top-2.5 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-sm ${
                      featured ? "bg-green-400 text-black" : "bg-white/10 text-white"
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}
                <div className="text-white/30 font-mono text-[11px] tracking-[0.15em] uppercase mb-3">
                  {plan.period}
                </div>
                <div
                  className={`font-mono font-black text-3xl ${
                    featured ? "text-green-400" : "text-white"
                  }`}
                >
                  {plan.price} ₽
                </div>
                {plan.perMonth && (
                  <div className="text-white/25 font-mono text-[11px] mt-1">
                    ~{plan.perMonth} {t.pricing.perMonthShort}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <a
          href="https://t.me/EscapeTheMatrixVPNBot"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-4 border border-green-400/40 text-green-400 font-mono text-xs font-bold tracking-[0.2em] uppercase hover:bg-green-400/5 hover:border-green-400 transition-all rounded-sm"
        >
          {t.pricing.cta} →
        </a>
      </div>
    </section>
  );
}