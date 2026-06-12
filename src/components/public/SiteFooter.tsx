import Link from "next/link"
import Image from "next/image"
import { SALONS } from "@/lib/salons"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <Image src="/img/logo.png" alt="Studio Figura" width={36} height={36} />
            <span className="font-bold">Studio Figura</span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Modelowanie sylwetki, kosmetologia i wellness dla kobiet. Umów wizytę w salonie
            najbliżej Ciebie.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Nasze salony
          </h3>
          <ul className="flex flex-col gap-2">
            {SALONS.map((salon) => (
              <li key={salon.slug}>
                <Link
                  href={`/${salon.slug}`}
                  className="text-sm text-foreground/80 transition-colors hover:text-primary"
                >
                  {salon.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Dla klientek
          </h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link href="/login" className="text-foreground/80 transition-colors hover:text-primary">
                Logowanie do panelu klienta
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="text-foreground/80 transition-colors hover:text-primary">
                Najczęstsze pytania
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Studio Figura. Wszystkie prawa zastrzeżone.
      </div>
    </footer>
  )
}
