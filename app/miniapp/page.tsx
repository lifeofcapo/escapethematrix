import type { Metadata } from "next";
import MiniAppClient from "./MiniAppClient";

export const metadata: Metadata = {
  title: "Профиль — EscapeTheMatrix VPN",
  description: "Ваш профиль EscapeTheMatrix VPN",
  // Forget index for robots for Mini App
  robots: { index: false, follow: false },
};

export default function MiniAppPage() {
  return <MiniAppClient />;
}