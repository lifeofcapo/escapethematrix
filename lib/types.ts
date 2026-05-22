export type Language = "ru" | "en" | "es" | "de" | "zh";

export type SubscriptionStatus = "active" | "inactive" | "expired";

export interface VPNConfig {
  region: string;
  city: string;
  flag: string;
  vless_link: string;
  ping: string;
}

export interface ProfileData {
  tg_id: number;
  username?: string;
  subscription: SubscriptionStatus;
  expires_at: string | null;
  balance: number;
  devices_used: number;
  devices_max: number;
  referrals?: number;
  bot_username?: string;
  configs: VPNConfig[];
}

export interface SubscriptionPlan {
  label: string;
  price: string;
  days: number;
  desc: string;
}

export interface VPNClientLink {
  url: string;
  label: string;
}

export interface VPNClient {
  name: string;
  platforms: string[];
  icon?: string;
  icons?: string[];
  accent: string;
  badge?: Record<Language, string> | null;
  description?: Record<Language, string>;
  links: VPNClientLink[];
}

export interface NavbarProps {
  t: any;
  lang: Language;
  setLang: (lang: Language) => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export interface Subscription {
  status: "active" | "expired" | "none";
  plan: string;
  expires_at: string;
  days_left: number;
  devices_limit: number;
  sub_link: string;
  region: string;
}

export interface Profile {
  user_id: number;
  username?: string;
  first_name?: string;
  profile_key: string;
  balance: number;
  referrals: number;
  language: string;
  subscription: Subscription | null;
}

export type Phase = "loading" | "profile" | "error" | "not_registered";