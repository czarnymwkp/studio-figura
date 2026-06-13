"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { pl } from "@/dictionaries/pl"
import { en } from "@/dictionaries/en"
import { uk } from "@/dictionaries/uk"
import type { Dictionary, Locale } from "@/lib/i18n"

const DICTIONARIES: Record<Locale, Dictionary> = { pl, en, uk }
const STORAGE_KEY = "sf-locale"

interface LocaleContextValue {
  locale: Locale
  dict: Dictionary
  setLocale: (l: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "pl",
  dict: pl,
  setLocale: () => {},
})

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pl")

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored && stored in DICTIONARIES) setLocaleState(stored)
  }, [])

  function setLocale(l: Locale) {
    localStorage.setItem(STORAGE_KEY, l)
    setLocaleState(l)
  }

  return (
    <LocaleContext.Provider value={{ locale, dict: DICTIONARIES[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
