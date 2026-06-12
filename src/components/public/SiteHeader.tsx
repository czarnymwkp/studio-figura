import Link from "next/link"
import Image from "next/image"
import { IconUser } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"

const navLinks = [
  { href: "/#oferta", label: "Oferta" },
  { href: "/#salony", label: "Salony" },
  { href: "/#jak-to-dziala", label: "Jak to działa" },
  { href: "/#faq", label: "FAQ" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5">
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

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button asChild variant="outline" className="gap-2">
            <Link href="/login">
              <IconUser size={18} />
              Panel klienta
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
