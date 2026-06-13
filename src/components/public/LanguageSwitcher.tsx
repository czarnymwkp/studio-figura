"use client"

import { cn } from "@/lib/utils"

const LANGS = [
  { code: "pl", label: "PL", href: "/" },
  { code: "en", label: "EN", href: "/en" },
  { code: "uk", label: "UK", href: "/uk" },
]

export function LanguageSwitcher({ lang }: { lang: string }) {
  return (
    <div className="flex items-center gap-0.5 text-xs font-bold">
      {LANGS.map(({ code, label, href }, i) => (
        <span key={code} className="flex items-center">
          {i > 0 && <span className="mx-0.5 text-muted-foreground/40">·</span>}
          {lang === code ? (
            <span className="text-foreground">{label}</span>
          ) : (
            <a href={href} className="text-muted-foreground transition-colors hover:text-foreground">
              {label}
            </a>
          )}
        </span>
      ))}
    </div>
  )
}
