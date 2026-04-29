import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Accept Telegram to integrate Mini App page in iframe
        source: "/miniapp",
        headers: [
          { key: "Content-Security-Policy",
            value: "frame-ancestors https://web.telegram.org",
          },
        ],
      },
      {
        source: "/admin",
        headers: [
          { 
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
};

export default nextConfig;