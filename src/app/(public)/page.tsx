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
        <section className="relative overflow-hidden">
          <Image
            src="/img/studio-figura-login.jpg"
            alt="Kosmetolożka Studio Figura podczas zabiegu pielęgnacji twarzy"
            fill
            priority
            className="object-cover object-[70%_30%]"
            sizes="100vw"
          />
          {/* scrim pod tekst: w jasnym motywie delikatna mgiełka, w ciemnym mocniejszy gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/35 to-transparent dark:from-background/90 dark:via-background/70 dark:to-background/15" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

          <div className="relative mx-auto flex min-h-[70svh] max-w-6xl flex-col justify-center px-4 py-16 md:px-6">
            <div className="flex max-w-xl flex-col items-start gap-6">
              <span className="rounded-full border border-primary/40 bg-primary/15 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
                Salony modelowania sylwetki dla kobiet
              </span>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                Twoja figura.
                <br />
                <span className="text-primary">Nasza technologia.</span>
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-foreground/80">
                Kriolipoliza, HIFU 4D, depilacja laserowa i kilkanaście innych zabiegów —
                bez skalpela i bez rekonwalescencji. Pierwsza konsultacja z analizą składu
                ciała jest bezpłatna.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="px-7 text-base font-semibold shadow-lg shadow-primary/25">
                  <Link href="/#salony">Umów pierwszą wizytę</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-foreground/25 bg-background/40 px-7 text-base font-semibold backdrop-blur-sm"
                >
                  <Link href="/#oferta">Zobacz ofertę</Link>
                </Button>
              </div>
            </div>

            {/* pasek zaufania */}
            <dl className="mt-16 grid w-fit grid-cols-3 gap-x-10 gap-y-2 border-t border-foreground/15 pt-6 md:gap-x-16">
              <div>
                <dt className="text-2xl font-extrabold text-primary md:text-3xl">400+</dt>
                <dd className="text-sm text-foreground/70">salonów w Polsce</dd>
              </div>
              <div>
                <dt className="text-2xl font-extrabold text-primary md:text-3xl">30+</dt>
                <dd className="text-sm text-foreground/70">zabiegów i urządzeń</dd>
              </div>
              <div>
                <dt className="text-2xl font-extrabold text-primary md:text-3xl">0 zł</dt>
                <dd className="text-sm text-foreground/70">pierwsza konsultacja</dd>
              </div>
            </dl>
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
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-primary/25 shadow-xl">
            <Image
              src="/img/kobido.jpg"
              alt="Masaż kobido w Studio Figura"
              fill
              className="object-cover object-[center_35%]"
              sizes="(max-width: 1152px) 100vw, 1152px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/65 via-background/35 to-background/10 dark:from-background/90 dark:via-background/75 dark:to-background/40" />
            <div className="relative flex flex-col items-center gap-5 px-6 py-16 text-center md:px-16 md:py-24">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Gotowa na zmianę?</h2>
              <p className="max-w-md text-foreground/80">
                Wybierz salon i zadzwoń — pierwsza konsultacja z analizą składu ciała jest
                bezpłatna, a konto w panelu klienta założymy Ci na miejscu.
              </p>
              <Button asChild size="lg" className="px-7 text-base font-semibold shadow-lg shadow-primary/25">
                <Link href="/#salony">Wybierz swój salon</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
