"use client"

import { useLocale } from "@/components/locale-context"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const LANGS: { code: Locale; label: string }[] = [
  { code: "pl", label: "PL" },
  { code: "en", label: "EN" },
  { code: "uk", label: "UK" },
]

export function ClientLanguageSwitcher() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex items-center gap-0.5 text-xs font-bold">
      {LANGS.map(({ code, label }, i) => (
        <span key={code} className="flex items-center">
          {i > 0 && <span className="mx-0.5 text-muted-foreground/40">·</span>}
          <button
            onClick={() => setLocale(code)}
            className={cn(
              "transition-colors",
              locale === code
                ? "text-foreground cursor-default"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        </span>
      ))}
    </div>
  )
}
