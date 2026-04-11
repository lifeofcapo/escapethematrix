"use client";

export default function HowToSection({ t }: { t: any }) {
  const howto = t.howto;

  const steps = [
    {
      num: "01",
      title: howto.steps[0].title,
      desc: howto.steps[0].desc,
      highlight: "@EscapeTheMatrix_Robot",
    },
    {
      num: "02",
      title: howto.steps[1].title,
      desc: howto.steps[1].desc,
      highlight: null,
    },
    {
      num: "03",
      title: howto.steps[2].title,
      desc: howto.steps[2].desc,
      highlight: null,
    },
    {
      num: "04",
      title: howto.steps[3].title,
      desc: howto.steps[3].desc,
      highlight: null,
    },
    {
      num: "05",
      title: howto.steps[4].title,
      desc: howto.steps[4].desc,
      highlight: null,
    },
  ];

  const apps = [
    { platform: "Android", icon: "▲", recommended: "FlClashX", others: ["Happ"] },
    { platform: "iOS", icon: "◆", recommended: "Happ", others: ["Streisand"] },
    { platform: "Windows", icon: "◈", recommended: "FlClashX", others: ["Happ", "Clash Verge"] },
    { platform: "macOS", icon: "◉", recommended: "FlClashX", others: ["Happ", "Clash Verge"] },
    { platform: "Linux", icon: "◐", recommended: "FlClashX", others: ["Clash Verge"] },
  ];

  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <span className="text-2xl md:text-3xl font-mono font-black tracking-wider text-green-400 uppercase">
            — {howto.title}
          </span>
        </div>
        <p className="text-white/25 font-mono text-sm tracking-wider mb-20">
          {howto.sub}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 mb-24 relative">
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-green-400/15 to-transparent" />

          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center px-4 pb-8 md:pb-0">

              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full border border-green-400/25 bg-[#080808] flex items-center justify-center relative z-10">
                  <span className="font-mono font-black text-green-400/60 text-sm">{step.num}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="md:hidden absolute top-1/2 left-full w-full h-px bg-white/5 -translate-y-1/2" />
                )}
              </div>

              <h3 className="font-mono font-bold text-white/70 text-xs tracking-wider uppercase mb-3">
                {step.title}
              </h3>
              <p className="font-mono text-white/30 text-xs leading-relaxed">
                {step.desc}
              </p>
              {step.highlight && (
                <a
                  href="https://t.me/EscapeTheMatrix_Robot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-green-400/60 font-mono text-xs hover:text-green-400 transition-colors"
                >
                  {step.highlight}
                </a>
              )}
            </div>
          ))}
        </div>
        <div>
          <div className="text-[10px] font-mono tracking-[0.4em] text-white/20 uppercase mb-6">
            — {howto.appsTitle}
            <span className="ml-3 text-green-400/40">{howto.starNote}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/5">
            {apps.map((app, i) => (
              <div key={i} className="bg-[#080808] p-6 hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-green-400/40 font-mono text-sm group-hover:text-green-400/70 transition-colors">
                    {app.icon}
                  </span>
                  <span className="font-mono text-white/60 text-xs font-bold tracking-wider uppercase">
                    {app.platform}
                  </span>
                </div>
                <div className="font-mono text-xs text-white/50 mb-1 flex items-center gap-1">
                  <span className="text-green-400/50">★</span>
                  <span>{app.recommended}</span>
                </div>
                {app.others.map((other, j) => (
                  <div key={j} className="font-mono text-xs text-white/20 pl-3">
                    {other}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <a
            href="https://t.me/EscapeTheMatrix_Robot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-green-400 text-[#080808] font-mono font-bold text-sm tracking-wider rounded hover:bg-green-300 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.01 9.47c-.148.659-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 14.607l-2.95-.924c-.641-.201-.654-.641.136-.949l11.532-4.447c.536-.194 1.004.131.834.961h.53z" />
            </svg>
            {howto.cta}
          </a>
          <span className="text-white/20 font-mono text-xs tracking-widest">
            {howto.ctaSub}
          </span>
        </div>
      </div>
    </section>
  );
}