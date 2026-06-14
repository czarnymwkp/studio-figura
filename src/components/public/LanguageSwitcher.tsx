"use client"

import { IconLanguage } from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const LANGS = [
  { code: "pl", label: "Polski",    short: "PL", href: "/" },
  { code: "en", label: "English",   short: "EN", href: "/en" },
  { code: "uk", label: "Українська", short: "UK", href: "/uk" },
]

export function LanguageSwitcher({ lang }: { lang: string }) {
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground outline-none">
        <IconLanguage size={15} />
        {current.short}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px] rounded-xl">
        {LANGS.map(({ code, label, short, href }) => (
          <DropdownMenuItem key={code} asChild>
            <a href={href} className={code === lang ? "font-semibold text-primary" : ""}>
              <span className="w-7 text-xs font-bold text-muted-foreground">{short}</span>
              {label}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
