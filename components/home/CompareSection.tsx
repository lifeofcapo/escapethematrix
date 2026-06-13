"use client";
import { useState } from "react";
import { TranslationSet } from "@/lib/i18n";

export default function CompareSection({ t }: { t: TranslationSet }) {
  const compareData = t.compare;
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      <div className="max-w-2xl mx-auto relative">
        <div className="mb-4">
          <span className="text-2xl md:text-3xl font-mono font-black tracking-wider text-green-400 uppercase">
            — {compareData.title}
          </span>
        </div>
        <p className="text-white/25 font-mono text-sm tracking-wider mb-16 max-w-md">
          {compareData.sub}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[440px]">
            <thead>
              <tr>
                <th className="text-left pb-6 font-mono text-xs text-white/20 tracking-widest uppercase font-normal w-1/2">
                  {compareData.feature}
                </th>
                <th className="pb-6 font-mono text-xs tracking-widest uppercase font-normal text-center">
                  <span className="text-green-400">◈ {compareData.us}</span>
                </th>
                <th className="pb-6 font-mono text-xs tracking-widest uppercase font-normal text-center">
                  <span className="text-white/30">{compareData.free}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {compareData.rows.map((row: any, i: number) => (
                <tr
                  key={i}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className={`border-t border-white/5 transition-all duration-200 ${
                    hovered === i ? "bg-green-400/[0.03]" : ""
                  }`}
                >
                  <td
                    className={`py-5 font-mono text-sm transition-colors duration-200 ${
                      hovered === i ? "text-white/80" : "text-white/50"
                    }`}
                  >
                    <span className="relative">
                      {row.feature}
                      <span
                        className={`absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-green-400 transition-opacity duration-200 ${
                          hovered === i ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </span>
                  </td>
                  <td className="py-5 text-center">
                    {row.us === true ? (
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-200 ${
                          hovered === i
                            ? "border-green-400/50 bg-green-400/10 scale-110"
                            : "border-green-400/20 bg-green-400/5"
                        }`}
                      >
                        <span className="text-green-400 font-mono text-sm">✓</span>
                      </span>
                    ) : row.us === false ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-red-400/15 bg-red-400/5">
                        <span className="text-red-400/50 font-mono text-sm">✕</span>
                      </span>
                    ) : (
                      <span
                        className={`font-mono text-xs px-2 py-1 rounded-full border transition-all duration-200 ${
                          hovered === i
                            ? "text-green-400 border-green-400/30 bg-green-400/5"
                            : "text-green-400/80 border-green-400/15"
                        }`}
                      >
                        {row.us}
                      </span>
                    )}
                  </td>
                  <td className="py-5 text-center">
                    {row.free === true ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-white/10">
                        <span className="text-green-400/40 font-mono text-sm">✓</span>
                      </span>
                    ) : row.free === false ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-red-400/10">
                        <span className="text-red-400/40 font-mono text-sm">✕</span>
                      </span>
                    ) : (
                      <span className="text-white/25 font-mono text-xs px-2 py-1 rounded-full border border-white/5">
                        {row.free}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 border border-red-400/15 rounded-sm p-5 bg-red-400/[0.03] max-w-2xl">
          <div className="flex items-start gap-3">
            <span className="text-red-400/60 font-mono text-lg mt-0.5 flex-shrink-0">⚠</span>
            <p className="text-white/40 font-mono text-xs leading-relaxed tracking-wider">
              {compareData.warning}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}