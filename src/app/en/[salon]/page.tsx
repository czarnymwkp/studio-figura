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
      title: { absolute: `Studio Figura ${city} — body shaping, cosmetology and wellness` },
      description: `Studio Figura ${city} — ${citySalons.length} body shaping salons for women: ${citySalons.map((s) => s.address).join(" and ")}. Cryolipolysis, HIFU 4D, laser hair removal. Call us for a free consultation.`,
      alternates: {
        canonical: `/en/${slug}`,
        languages: { pl: `/${slug}`, en: `/en/${slug}`, uk: `/uk/${slug}`, "x-default": `/${slug}` },
      },
    }
  }
  const salon = getSalon(slug)
  if (!salon) return {}
  return {
    title: { absolute: `${salon.name} — body shaping, cosmetology and wellness` },
    description: `${salon.name}, ${salon.address}, ${salon.postalCode}. Body shaping, cosmetology and wellness for women. Call: ${salon.phone} for a free consultation.`,
    alternates: {
      canonical: `/en/${slug}`,
      languages: { pl: `/${slug}`, en: `/en/${slug}`, uk: `/uk/${slug}`, "x-default": `/${slug}` },
    },
  }
}

export default async function EnSalonPage({ params }: Props) {
  const { salon } = await params
  return <SalonLang lang="en" slug={salon} />
}
