"use client";

export default function CompareSection({ t }: { t: any }) {
  const compareData = t.compare;

  return (
    <section className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="mb-4">
          <span className="text-2xl md:text-3xl font-mono font-black tracking-wider text-green-400 uppercase">
            — {compareData.title}
          </span>
        </div>
        <p className="text-white/25 font-mono text-sm tracking-wider mb-16 max-w-2xl">
          {compareData.sub}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
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
                <tr key={i} className="border-t border-white/5 group">
                  <td className="py-5 font-mono text-sm text-white/50 group-hover:text-white/70 transition-colors">
                    {row.feature}
                  </td>
                  <td className="py-5 text-center">
                    {row.us === true ? (
                      <span className="text-green-400 font-mono text-base">✓</span>
                    ) : row.us === false ? (
                      <span className="text-red-400/50 font-mono text-base">✕</span>
                    ) : (
                      <span className="text-green-400 font-mono text-xs">{row.us}</span>
                    )}
                  </td>
                  <td className="py-5 text-center">
                    {row.free === true ? (
                      <span className="text-green-400/50 font-mono text-base">✓</span>
                    ) : row.free === false ? (
                      <span className="text-red-400/60 font-mono text-base">✕</span>
                    ) : (
                      <span className="text-white/25 font-mono text-xs">{row.free}</span>
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