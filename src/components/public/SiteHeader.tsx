import Link from "next/link"
import Image from "next/image"
import { IconUser } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageSwitcher } from "@/components/public/LanguageSwitcher"
import { getDictionary, type Dictionary } from "@/lib/i18n"

interface Props {
  lang?: string
  dict?: Dictionary
}

export async function SiteHeader({ lang = "pl", dict: dictProp }: Props) {
  const dict = dictProp ?? (await getDictionary(lang))
  const prefix = lang === "pl" ? "" : `/${lang}`

  const navLinks = [
    { href: `${prefix}/#oferta`, label: dict.nav.offer },
    { href: `${prefix}/#salony`, label: dict.nav.salons },
    { href: `${prefix}/#jak-to-dziala`, label: dict.nav.howItWorks },
    { href: `${prefix}/#faq`, label: dict.nav.faq },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href={prefix || "/"} className="flex items-center gap-2.5">
          <Image src="/img/logo.png" alt="Studio Figura" width={40} height={40} className="shrink-0" />
          <span className="text-lg font-bold tracking-tight">Studio Figura</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitcher lang={lang} />
          <ThemeToggle />
          <Button asChild variant="outline" className="gap-2">
            <Link href={`${prefix}/login`}>
              <IconUser size={18} />
              <span className="hidden sm:inline">{dict.nav.clientPortal}</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
