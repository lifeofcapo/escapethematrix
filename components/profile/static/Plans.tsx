import { Language, SubscriptionPlan } from "@/lib/types";

export const PLANS: Record<Language, SubscriptionPlan[]> = {
  ru: [
    { label: "1 месяц", price: "100 ₽", days: 30, desc: "Финляндия или Нидерланды" },
    { label: "3 месяца", price: "290 ₽", days: 90, desc: "Скидка 10%" },
    { label: "6 месяцев", price: "580 ₽", days: 180, desc: "Скидка 17%" },
    { label: "1 год", price: "990 ₽", days: 365, desc: "Скидка 25%" },
  ],
  en: [
    { label: "1 month", price: "100 ₽", days: 30, desc: "Finland or Netherlands" },
    { label: "3 months", price: "290 ₽", days: 90, desc: "10% discount" },
    { label: "6 months", price: "580 ₽", days: 180, desc: "17% discount" },
    { label: "1 year", price: "990 ₽", days: 365, desc: "25% discount" },
  ],
  es: [
    { label: "1 mes", price: "100 ₽", days: 30, desc: "Finlandia o Países Bajos" },
    { label: "3 meses", price: "290 ₽", days: 90, desc: "10% de descuento" },
    { label: "6 meses", price: "580 ₽", days: 180, desc: "17% de descuento" },
    { label: "1 año", price: "990 ₽", days: 365, desc: "25% de descuento" },
  ],
  de: [
    { label: "1 Monat", price: "100 ₽", days: 30, desc: "Finnland oder Niederlande" },
    { label: "3 Monate", price: "290 ₽", days: 90, desc: "10% Rabatt" },
    { label: "6 Monate", price: "580 ₽", days: 180, desc: "17% Rabatt" },
    { label: "1 Jahr", price: "990 ₽", days: 365, desc: "25% Rabatt" },
  ],
  zh: [
    { label: "1个月", price: "100 ₽", days: 30, desc: "芬兰或荷兰" },
    { label: "3个月", price: "290 ₽", days: 90, desc: "9折优惠" },
    { label: "6个月", price: "580 ₽", days: 180, desc: "83折优惠" },
    { label: "1年", price: "990 ₽", days: 365, desc: "75折优惠" },
  ],
};