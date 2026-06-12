import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { IconCalendarHeart, IconChevronDown, IconPhone, IconSparkles } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/public/SiteHeader"
import { SiteFooter } from "@/components/public/SiteFooter"
import { NearestSalonBanner } from "@/components/public/NearestSalonBanner"
import { SalonFinder } from "@/components/public/SalonFinder"
import { TREATMENTS } from "@/lib/treatments"

export const metadata: Metadata = {
  title: { absolute: "Studio Figura — modelowanie sylwetki, kosmetologia i wellness" },
  alternates: { canonical: "/" },
  description:
    "Studio Figura to salony modelowania sylwetki dla kobiet: kriolipoliza, HIFU 4D, depilacja laserowa, endomasaż, limfodrenaż i wiele więcej. Umów wizytę online.",
}

const STEPS = [
  {
    icon: IconPhone,
    title: "Zadzwoń do salonu",
    description: "Umów pierwszą wizytę telefonicznie. Na miejscu recepcja założy Ci konto w panelu klienta.",
  },
  {
    icon: IconCalendarHeart,
    title: "Rezerwuj online",
    description: "Kolejne wizyty rezerwujesz już w panelu klienta — bez dzwonienia, o każdej porze.",
  },
  {
    icon: IconSparkles,
    title: "Zbieraj punkty",
    description: "Za zabiegi i codzienne logowania zbierasz punkty lojalnościowe, które wymieniasz na rabaty.",
  },
]

const FAQ = [
  {
    q: "Czy zabiegi modelowania sylwetki są bolesne?",
    a: "Nie — zdecydowana większość naszych zabiegów (endomasaż, kriolipoliza, fale radiowe, lipolaser) jest bezbolesna i nie wymaga rekonwalescencji. Po zabiegu od razu wracasz do codziennych aktywności.",
  },
  {
    q: "Ile zabiegów potrzeba, żeby zobaczyć efekty?",
    a: "Pierwsze efekty często widać już po jednym zabiegu, ale trwałe rezultaty daje seria — zwykle 6–10 spotkań w odstępach kilku dni. Na pierwszej wizycie dobierzemy plan do Twoich celów.",
  },
  {
    q: "Jak założyć konto w panelu klienta?",
    a: "Konto zakłada dla Ciebie salon podczas pierwszej wizyty — wystarczy, że zadzwonisz i umówisz termin. Z kontem rezerwujesz kolejne wizyty online, śledzisz historię zabiegów i zbierasz punkty lojalnościowe.",
  },
  {
    q: "Czy depilacja laserowa jest bezpieczna latem?",
    a: "Laser Diamond pracuje bezpiecznie także przy ciemniejszej karnacji, jednak skóry świeżo opalonej nie depilujemy. Na konsultacji ocenimy, czy zabieg można wykonać od razu.",
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-background via-background to-primary/5">
      <SiteHeader />
      <NearestSalonBanner />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div className="flex flex-col items-start gap-6">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Salony modelowania sylwetki dla kobiet
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Twoja figura.
              <br />
              <span className="text-primary">Nasza technologia.</span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
              Modelowanie sylwetki, kosmetologia i wellness w jednym miejscu. Kriolipoliza,
              HIFU 4D, depilacja laserowa i kilkanaście innych zabiegów — bez skalpela
              i bez rekonwalescencji.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="px-6 text-base font-semibold">
                <Link href="/#salony">Umów pierwszą wizytę</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-6 text-base font-semibold">
                <Link href="/#oferta">Zobacz ofertę</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-primary/20">
            <Image
              src="/img/studio-figura-login.jpg"
              alt="Wnętrze salonu Studio Figura"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </section>

        {/* Salony */}
        <section id="salony" className="scroll-mt-20 border-y border-border/40 bg-card/30">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight">Nasze salony</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Wpisz swoją miejscowość i znajdź salon najbliżej Ciebie — pierwsza rozmowa
              i analiza składu ciała są bezpłatne.
            </p>
            <div className="mt-8">
              <SalonFinder />
            </div>
          </div>
        </section>

        {/* Oferta */}
        <section id="oferta" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight">Nasze zabiegi</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Pracujemy wyłącznie na certyfikowanych urządzeniach Studio Figura —
              od redukcji tkanki tłuszczowej po pielęgnację twarzy.
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

        {/* Jak to działa */}
        <section id="jak-to-dziala" className="scroll-mt-20 border-y border-border/40 bg-card/30">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight">Jak to działa</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {STEPS.map(({ icon: Icon, title, description }, i) => (
                <div key={title} className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-6">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold">
                    {i + 1}. {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20">
          <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight">Najczęstsze pytania</h2>
            <div className="mt-8 flex flex-col gap-3">
              {FAQ.map(({ q, a }) => (
                <details
                  key={q}
                  className="group rounded-2xl border border-border/60 bg-card px-5 py-4 open:border-primary/40"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold [&::-webkit-details-marker]:hidden">
                    {q}
                    <IconChevronDown
                      size={18}
                      className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/40 bg-primary/10">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-16 text-center md:px-6">
            <h2 className="text-3xl font-bold tracking-tight">Gotowa na zmianę?</h2>
            <p className="max-w-md text-muted-foreground">
              Wybierz salon i zadzwoń — pierwsza konsultacja z analizą składu ciała jest
              bezpłatna, a konto w panelu klienta założymy Ci na miejscu.
            </p>
            <Button asChild size="lg" className="px-6 text-base font-semibold">
              <Link href="/#salony">Wybierz swój salon</Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
