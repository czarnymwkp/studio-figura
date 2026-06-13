import type { Metadata } from "next"
import { HomeLang } from "@/components/public/pages/HomeLang"

export const metadata: Metadata = {
  title: { absolute: "Studio Figura — body shaping, cosmetology and wellness" },
  description:
    "Studio Figura salons offer body shaping for women: cryolipolysis, HIFU 4D, laser hair removal, endermologie, lymphatic drainage and more. Book online.",
  alternates: {
    canonical: "/en",
    languages: { pl: "/", en: "/en", uk: "/uk", "x-default": "/" },
  },
}

export default function EnHomePage() {
  return <HomeLang lang="en" />
}
