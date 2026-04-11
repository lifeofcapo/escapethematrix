"use client";

export default function Footer({ t }: { t: any }) {
  return (
    <footer className="py-16 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase">ESCAPE</span>
              <span className="w-px h-3 bg-white/15" />
              <span className="text-[10px] font-mono tracking-[0.3em] text-green-400/50 uppercase">THE MATRIX</span>
            </div>
            <p className="text-white/20 font-mono text-xs tracking-wider">{t.footer.sub}</p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://t.me/EscapeTheMatrix_Robot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 font-mono text-xs tracking-widest hover:text-green-400/60 transition-colors uppercase"
            >
              {t.footer.bot}
            </a>
            <a href="/privacy" className="text-white/20 font-mono text-xs tracking-widest hover:text-white/40 transition-colors">
              {t.footer.privacy}
            </a>
            <a href="/terms" className="text-white/20 font-mono text-xs tracking-widest hover:text-white/40 transition-colors">
              {t.footer.terms}
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-white/10 font-mono text-[10px] tracking-widest uppercase">
            © 2025 escapethematrix.to — All rights reserved
          </span>
          <span className="text-white/10 font-mono text-[10px] tracking-widest">
            Helsinki · Amsterdam
          </span>
        </div>
      </div>
    </footer>
  );
}