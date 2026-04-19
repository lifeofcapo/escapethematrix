"use client";

import { TranslationSet } from "@/lib/i18n";

export default function FeaturesSection({ t }: { t: TranslationSet }) {
  return (
    <section className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="mb-16">
          <span className="text-2xl md:text-3xl font-mono font-black tracking-wider text-green-400 uppercase">
            — {t.features.title}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {t.features.items.map((item: any, i: number) => (
            <div
              key={i}
              className="group bg-[#080808] p-10 hover:bg-white/[0.02] transition-colors cursor-default"
            >
              <div className="text-3xl text-green-400/40 mb-5 font-mono group-hover:text-green-400/70 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-white font-mono font-bold text-base tracking-wider mb-4 uppercase">
                {item.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed font-mono">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}