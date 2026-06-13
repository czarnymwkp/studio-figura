import type { Metadata } from "next"
import { HomeLang } from "@/components/public/pages/HomeLang"

export const metadata: Metadata = {
  title: { absolute: "Studio Figura — моделювання фігури, косметологія та велнес" },
  description:
    "Салони Studio Figura пропонують моделювання фігури для жінок: кріоліполіз, HIFU 4D, лазерна епіляція, ендермологія, лімфодренаж та інше. Запишіться онлайн.",
  alternates: {
    canonical: "/uk",
    languages: { pl: "/", en: "/en", uk: "/uk", "x-default": "/" },
  },
}

export default function UkHomePage() {
  return <HomeLang lang="uk" />
}
