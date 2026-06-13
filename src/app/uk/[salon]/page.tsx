import type { Metadata } from "next"
import { SalonLang, generateSalonStaticParams } from "@/components/public/pages/SalonLang"
import { getSalon, getCitySalons } from "@/lib/salons"

interface Props {
  params: Promise<{ salon: string }>
}

export function generateStaticParams() {
  return generateSalonStaticParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).salon
  const citySalons = getCitySalons(slug)
  if (citySalons) {
    const city = citySalons[0].city
    return {
      title: { absolute: `Studio Figura ${city} — моделювання фігури, косметологія та велнес` },
      description: `Studio Figura ${city} — ${citySalons.length} салони моделювання фігури для жінок: ${citySalons.map((s) => s.address).join(" та ")}. Кріоліполіз, HIFU 4D, лазерна епіляція. Зателефонуйте для безкоштовної консультації.`,
      alternates: {
        canonical: `/uk/${slug}`,
        languages: { pl: `/${slug}`, en: `/en/${slug}`, uk: `/uk/${slug}`, "x-default": `/${slug}` },
      },
    }
  }
  const salon = getSalon(slug)
  if (!salon) return {}
  return {
    title: { absolute: `${salon.name} — моделювання фігури, косметологія та велнес` },
    description: `${salon.name}, ${salon.address}, ${salon.postalCode}. Моделювання фігури, косметологія та велнес для жінок. Телефон: ${salon.phone} — безкоштовна консультація.`,
    alternates: {
      canonical: `/uk/${slug}`,
      languages: { pl: `/${slug}`, en: `/en/${slug}`, uk: `/uk/${slug}`, "x-default": `/${slug}` },
    },
  }
}

export default async function UkSalonPage({ params }: Props) {
  const { salon } = await params
  return <SalonLang lang="uk" slug={salon} />
}
