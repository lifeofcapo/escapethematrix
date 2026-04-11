"use client";

export default function BlogSection({ t }: { t: any }) {
  const blog = t.blog;

  const articles = [
    {
      slug: "public-wifi-safe",
      icon: "◐",
      tag: blog.tagSecurity,
      title: blog.articles[0].title,
      desc: blog.articles[0].desc,
      readTime: blog.articles[0].readTime,
    },
    {
      slug: "vpn-legal",
      icon: "◬",
      tag: blog.tagLegal,
      title: blog.articles[1].title,
      desc: blog.articles[1].desc,
      readTime: blog.articles[1].readTime,
    },
    {
      slug: "vpn-devices",
      icon: "◈",
      tag: blog.tagGuide,
      title: blog.articles[2].title,
      desc: blog.articles[2].desc,
      readTime: blog.articles[2].readTime,
    },
  ];

  return (
    <section className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="mb-4">
          <span className="text-2xl md:text-3xl font-mono font-black tracking-wider text-green-400 uppercase">
            — {blog.title}
          </span>
        </div>
        <p className="text-white/25 font-mono text-sm tracking-wider mb-2">
          {blog.sub}
        </p>
        <p className="text-white/15 font-mono text-xs tracking-widest mb-16">
          {blog.desc}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
          {articles.map((article, i) => (
            <div
              key={i}
              className="group bg-[#080808] p-8 hover:bg-white/[0.02] transition-colors cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center justify-between mb-6">
                <span className="text-white/15 font-mono text-[10px] tracking-[0.3em] uppercase border border-white/8 px-2 py-1 rounded-full">
                  {article.tag}
                </span>
                <span className="text-green-400/30 font-mono text-2xl group-hover:text-green-400/60 transition-colors">
                  {article.icon}
                </span>
              </div>

              <h3 className="text-white/70 font-mono font-bold text-sm tracking-wider mb-4 leading-relaxed group-hover:text-white transition-colors">
                {article.title}
              </h3>

              <p className="text-white/25 font-mono text-xs leading-relaxed mb-6">
                {article.desc}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-white/15 font-mono text-[10px] tracking-widest">
                  {article.readTime}
                </span>
                <span className="text-green-400/0 group-hover:text-green-400/60 font-mono text-xs transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                  {blog.read} →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}