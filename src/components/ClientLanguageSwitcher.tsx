"use client"

import { IconLanguage } from "@tabler/icons-react"
import { useLocale } from "@/components/locale-context"
import type { Locale } from "@/lib/i18n"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const LANGS: { code: Locale; label: string; short: string }[] = [
  { code: "pl", label: "Polski",     short: "PL" },
  { code: "en", label: "English",    short: "EN" },
  { code: "uk", label: "Українська", short: "UK" },
]

export function ClientLanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const current = LANGS.find((l) => l.code === locale) ?? LANGS[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground outline-none">
        <IconLanguage size={15} />
        {current.short}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px] rounded-xl">
        {LANGS.map(({ code, label, short }) => (
          <DropdownMenuItem key={code} onClick={() => setLocale(code)}>
            <span className="w-7 text-xs font-bold text-muted-foreground">{short}</span>
            <span className={code === locale ? "font-semibold text-primary" : ""}>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
