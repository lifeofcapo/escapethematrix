"use client";

export default function PaymentSection() {
  const payments = [
    {
      id: "visa",
      label: "VISA",
      svg: (
        <svg viewBox="0 0 48 16" className="h-4 w-auto" fill="currentColor">
          <text x="0" y="13" fontSize="14" fontWeight="700" fontFamily="'IBM Plex Mono', monospace" letterSpacing="1">VISA</text>
        </svg>
      ),
    },
    {
      id: "mc",
      label: "MC",
      svg: (
        <svg viewBox="0 0 36 24" className="h-5 w-auto" fill="none">
          <circle cx="14" cy="12" r="10" fill="#EB001B" opacity="0.8" />
          <circle cx="22" cy="12" r="10" fill="#F79E1B" opacity="0.8" />
          <path d="M18 5.5a10 10 0 0 1 0 13A10 10 0 0 1 18 5.5z" fill="#FF5F00" opacity="0.8" />
        </svg>
      ),
    },
    {
      id: "mir",
      label: "МИР",
      svg: (
        <svg viewBox="0 0 48 20" className="h-4 w-auto" fill="none">
          <rect x="0" y="0" width="48" height="20" rx="3" fill="#0095D9" opacity="0.15" />
          <text x="5" y="14" fontSize="10" fontWeight="700" fontFamily="'IBM Plex Mono', monospace" fill="#0095D9">МИР</text>
        </svg>
      ),
    },
    {
      id: "sbp",
      label: "СБП",
      svg: (
        <svg viewBox="0 0 44 20" className="h-4 w-auto" fill="none">
          <rect x="0" y="0" width="44" height="20" rx="3" fill="#24B34B" opacity="0.15" />
          <text x="4" y="14" fontSize="10" fontWeight="700" fontFamily="'IBM Plex Mono', monospace" fill="#24B34B">СБП</text>
        </svg>
      ),
    },
    {
      id: "usdt",
      label: "USDT",
      svg: (
        <svg viewBox="0 0 44 20" className="h-4 w-auto" fill="none">
          <text x="0" y="14" fontSize="10" fontWeight="700" fontFamily="'IBM Plex Mono', monospace" fill="#26A17B">₮ USDT</text>
        </svg>
      ),
    },
    {
      id: "btc",
      label: "BTC",
      svg: (
        <svg viewBox="0 0 44 20" className="h-4 w-auto" fill="none">
          <text x="0" y="14" fontSize="10" fontWeight="700" fontFamily="'IBM Plex Mono', monospace" fill="#F7931A">₿ BTC</text>
        </svg>
      ),
    },
    {
      id: "eth",
      label: "ETH",
      svg: (
        <svg viewBox="0 0 44 20" className="h-4 w-auto" fill="none">
          <text x="0" y="14" fontSize="10" fontWeight="700" fontFamily="'IBM Plex Mono', monospace" fill="#627EEA">Ξ ETH</text>
        </svg>
      ),
    },
    {
      id: "sol",
      label: "SOL",
      svg: (
        <svg viewBox="0 0 48 20" className="h-4 w-auto" fill="none">
          <text x="0" y="14" fontSize="10" fontWeight="700" fontFamily="'IBM Plex Mono', monospace" fill="#9945FF">◎ SOL</text>
        </svg>
      ),
    },
    {
      id: "ton",
      label: "TON",
      svg: (
        <svg viewBox="0 0 44 20" className="h-4 w-auto" fill="none">
          <text x="0" y="14" fontSize="10" fontWeight="700" fontFamily="'IBM Plex Mono', monospace" fill="#0098EA">◆ TON</text>
        </svg>
      ),
    },
    {
      id: "bnb",
      label: "BNB",
      svg: (
        <svg viewBox="0 0 44 20" className="h-4 w-auto" fill="none">
          <text x="0" y="14" fontSize="10" fontWeight="700" fontFamily="'IBM Plex Mono', monospace" fill="#F0B90B">◈ BNB</text>
        </svg>
      ),
    },
  ];

  return (
    <section className="py-4 px-6 border-t border-b border-white/5 bg-white/[0.01]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-5 flex-1">
            {payments.map((p) => (
              <div
                key={p.id}
                className="flex-shrink-0 opacity-40 hover:opacity-80 transition-opacity duration-200 cursor-default"
                title={p.label}
              >
                {p.svg}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}