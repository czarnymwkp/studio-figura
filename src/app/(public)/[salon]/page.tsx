import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import {
  IconArrowLeft, IconArrowRight, IconClock, IconMapPin, IconPhone, IconUser,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/public/SiteHeader"
import { SiteFooter } from "@/components/public/SiteFooter"
import { SALONS, CITY_PAGES, getSalon, getCitySalons, type Salon } from "@/lib/salons"
import { TREATMENTS } from "@/lib/treatments"

interface Props {
  params: Promise<{ salon: string }>
}

export function generateStaticParams() {
  return [
    ...SALONS.map((s) => ({ salon: s.slug })),
    ...CITY_PAGES.map((slug) => ({ salon: slug })),
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).salon
  const citySalons = getCitySalons(slug)
  if (citySalons) {
    const city = citySalons[0].city
    return {
      title: { absolute: `Studio Figura ${city} — modelowanie sylwetki, kosmetologia i wellness` },
      description: `Studio Figura ${city} — ${citySalons.length} salony modelowania sylwetki dla kobiet: ${citySalons.map((s) => s.address).join(" oraz ")}. Kriolipoliza, HIFU 4D, depilacja laserowa. Zadzwoń i umów bezpłatną konsultację.`,
      alternates: {
        canonical: `/${slug}`,
        languages: { pl: `/${slug}`, en: `/en/${slug}`, uk: `/uk/${slug}`, "x-default": `/${slug}` },
      },
    }
  }
  const salon = getSalon(slug)
  if (!salon) return {}
  return {
    title: { absolute: `${salon.name} — modelowanie sylwetki, kosmetologia i wellness` },
    description: `${salon.name}, ${salon.address}, ${salon.postalCode}. Modelowanie sylwetki, kosmetologia i wellness dla kobiet. Zadzwoń: ${salon.phone} i umów bezpłatną konsultację.`,
    alternates: {
      canonical: `/${slug}`,
      languages: { pl: `/${slug}`, en: `/en/${slug}`, uk: `/uk/${slug}`, "x-default": `/${slug}` },
    },
  }
}

function salonJsonLd(salon: Salon) {
  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: salon.name,
    telephone: salon.phone,
    email: salon.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: salon.address,
      postalCode: salon.postalCode.split(" ")[0],
      addressLocality: salon.city,
      addressCountry: "PL",
    },
    geo: { "@type": "GeoCoordinates", latitude: salon.lat, longitude: salon.lng },
    openingHours: salon.openingHoursSchema,
    hasMap: salon.mapsUrl,
  }
}

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}

function SalonContactList({ salon }: { salon: Salon }) {
  return (
    <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
      <li className="flex items-center gap-2.5">
        <IconMapPin size={18} className="shrink-0 text-primary" />
        {salon.address}, {salon.postalCode}
      </li>
      <li className="flex items-center gap-2.5">
        <IconPhone size={18} className="shrink-0 text-primary" />
        <a href={`tel:${salon.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-foreground">
          {salon.phone}
        </a>
      </li>
      {salon.hours.length > 0 && (
        <li className="flex items-start gap-2.5">
          <IconClock size={18} className="mt-0.5 shrink-0 text-primary" />
          <span>{salon.hours.join(" · ")}</span>
        </li>
      )}
    </ul>
  )
}

function TreatmentsSection() {
  return (
    <section className="border-y border-border/40 bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight">Co znajdziesz w naszej ofercie</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Pracujemy na certyfikowanych urządzeniach Studio Figura. Zadzwoń, a dobierzemy
          zabiegi do Twoich celów.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {TREATMENTS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-colors hover:border-primary/40"
            >
              <div className="relative aspect-square bg-white">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="flex flex-col gap-1.5 p-4">
                <h3 className="text-sm font-bold leading-tight">{t.name}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{t.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CityPage({ salons }: { salons: Salon[] }) {
  const city = salons[0].city
  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-background via-background to-primary/5">
      <JsonLd data={salons.map(salonJsonLd)} />
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <Link
            href="/#salony"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <IconArrowLeft size={16} />
            Wszystkie salony
          </Link>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            Studio Figura {city}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            W {city === "Kraśnik" ? "Kraśniku" : city} znajdziesz {salons.length} salony Studio
            Figura. Modelowanie sylwetki, kosmetologia i wellness dla kobiet — wybierz salon
            bliżej Ciebie i zadzwoń, aby umówić bezpłatną konsultację z analizą składu ciała.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {salons.map((salon) => (
              <div
                key={salon.slug}
                className="flex flex-col gap-4 rounded-2xl border border-primary/30 bg-card p-6"
              >
                <h2 className="text-xl font-bold">{salon.name}</h2>
                <SalonContactList salon={salon} />
                <div className="mt-auto flex flex-wrap gap-3">
                  <Button asChild size="sm">
                    <a href={`tel:${salon.phone.replace(/\s/g, "")}`}>Zadzwoń i umów wizytę</a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="gap-1.5">
                    <Link href={`/${salon.slug}`}>
                      Strona salonu
                      <IconArrowRight size={16} />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <TreatmentsSection />
      </main>
      <SiteFooter />
    </div>
  )
}

export default async function SalonPage({ params }: Props) {
  const slug = (await params).salon

  const citySalons = getCitySalons(slug)
  if (citySalons) return <CityPage salons={citySalons} />

  const salon = getSalon(slug)
  if (!salon) notFound()

  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-background via-background to-primary/5">
      <JsonLd data={salonJsonLd(salon)} />
      <SiteHeader />

      <main className="flex-1">
        {/* Hero salonu */}
        <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <Link
            href="/#salony"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <IconArrowLeft size={16} />
            Wszystkie salony
          </Link>
          <div className="grid items-start gap-10 md:grid-cols-2">
            <div className="flex flex-col items-start gap-5">
              <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                {salon.city}
              </span>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
                {salon.name}
              </h1>
              <SalonContactList salon={salon} />
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="px-6 text-base font-semibold">
                  <a href={`tel:${salon.phone.replace(/\s/g, "")}`}>Zadzwoń i umów wizytę</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="px-6 text-base font-semibold">
                  <a href={salon.mapsUrl} target="_blank" rel="noopener noreferrer">
                    Pokaż na mapie
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-primary/20">
              <Image
                src="/img/studio-figura-login.jpg"
                alt={`Wnętrze salonu ${salon.name}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        <TreatmentsSection />

        {/* CTA */}
        <section className="bg-primary/10">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-16 text-center md:px-6">
            <h2 className="text-3xl font-bold tracking-tight">Umów się na bezpłatną konsultację</h2>
            <p className="max-w-md text-muted-foreground">
              Zadzwoń do nas — porozmawiamy o Twoich celach i wykonamy bezpłatną analizę
              składu ciała. Jesteś już naszą klientką? Zaloguj się do panelu.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="px-6 text-base font-semibold">
                <a href={`tel:${salon.phone.replace(/\s/g, "")}`}>{salon.phone}</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 px-6 text-base font-semibold">
                <Link href="/login">
                  <IconUser size={20} />
                  Panel klienta
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
