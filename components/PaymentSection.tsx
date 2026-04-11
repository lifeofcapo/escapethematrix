"use client";

export default function PaymentSection() {
  const payments = [
    {
      id: "visa",
      label: "VISA",
      src: "https://cdn.simpleicons.org/visa",
    },
    {
      id: "mc",
      label: "Mastercard",
      src: "https://cdn.simpleicons.org/mastercard",
    },
    {
      id: "mir",
      label: "МИР",
      src: "/payments/mir.png",
    },
    {
      id: "sbp",
      label: "СБП",
      src: "/payments/sbp.png",
    },
    {
      id: "btc",
      label: "Bitcoin",
      src: "https://cdn.simpleicons.org/bitcoin",
    },
    {
      id: "eth",
      label: "Ethereum",
      src: "https://cdn.simpleicons.org/ethereum",
    },
    {
      id: "usdt",
      label: "Tether",
      src: "https://cdn.simpleicons.org/tether",
    },
    {
      id: "sol",
      label: "Solana",
      src: "https://cdn.simpleicons.org/solana",
    },
    {
      id: "ton",
      label: "TON",
      src: "https://cdn.simpleicons.org/ton",
    },
    {
      id: "bnb",
      label: "BNB",
      src: "https://cdn.simpleicons.org/binance",
    },
  ];

  return (
    <section className="py-4 px-6 border-t border-b border-white/5 bg-white/[0.01]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-8 flex-wrap">
        {payments.map((p) => (
            <div
            key={p.id}
            className="w-16 flex justify-center items-center"
            title={p.label}
            >
            <img
                src={p.src}
                alt={p.label}
                className="h-8 w-auto object-contain"
                loading="lazy"
            />
            </div>
        ))}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}