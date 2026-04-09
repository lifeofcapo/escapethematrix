"use client";

import { useState } from "react";

export default function FAQSection({ t }: { t: any }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <span className="text-2xl md:text-3xl font-mono font-black tracking-wider text-green-400 uppercase">
            — {t.faq.title}
          </span>
        </div>
        <div className="max-w-2xl mx-auto space-y-0">
          {t.faq.items.map((item: any, i: number) => (
            <div key={i} className="border-t border-white/6 first:border-t-0">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-6 text-left group"
              >
                <span
                  className={`font-mono text-base tracking-wider transition-colors text-center flex-1 ${
                    open === i ? "text-white" : "text-white/50 group-hover:text-white/75"
                  }`}
                >
                  {item.q}
                </span>
                <span
                  className={`font-mono text-green-400/60 text-2xl ml-4 flex-shrink-0 transition-transform duration-200 ${
                    open === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  open === i ? "max-h-48 pb-6" : "max-h-0"
                }`}
              >
                <p className="text-white/35 font-mono text-base leading-relaxed tracking-wide text-center max-w-xl mx-auto">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}