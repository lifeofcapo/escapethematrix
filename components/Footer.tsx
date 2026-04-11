"use client";

export default function Footer({ t }: { t: any }) {
  return (
    <footer className="py-16 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase">ESCAPE</span>
              <span className="w-px h-3 bg-white/15" />
              <span className="text-[10px] font-mono tracking-[0.3em] text-green-400/70 uppercase">THE MATRIX</span>
            </div>
            <p className="text-white/70 font-mono text-xs tracking-wider">{t.footer.sub}</p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://t.me/EscapeTheMatrix_Robot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 font-mono text-xs tracking-widest hover:text-green-400/60 transition-colors uppercase"
            >
              {t.footer.bot}
            </a>
            <a href="/privacy" className="text-white/70 font-mono text-xs tracking-widest hover:text-white/40 transition-colors">
              {t.footer.privacy}
            </a>
            <a href="/terms" className="text-white/70 font-mono text-xs tracking-widest hover:text-white/40 transition-colors">
              {t.footer.terms}
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-white/50 font-mono text-[10px] tracking-widest uppercase">
            © 2026 escapethematrix.to — All rights reserved
          </span>

          <div className="flex items-center gap-4">
            <a
              href="mailto:EscapeTheMatrixVPN@gmail.com"
              aria-label="Email us"
              className="text-white/30 hover:text-white/70 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
              </svg>
            </a>

            <a
              href="https://t.me/EscapeTheMatrix_Robot"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram bot"
              className="text-white/30 hover:text-green-400/70 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-2.01 9.47c-.148.659-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 14.607l-2.95-.924c-.641-.201-.654-.641.136-.949l11.532-4.447c.536-.194 1.004.131.834.961h.53z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}