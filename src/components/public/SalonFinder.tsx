"use client"

import { useState } from "react"
import Link from "next/link"
import { IconArrowRight, IconClock, IconMapPin, IconPhone, IconSearch } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SALONS } from "@/lib/salons"

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l")
}

interface Props {
  placeholder?: string
  notFoundText?: string
  callLabel?: string
  viewOfferLabel?: string
  salonPrefix?: string
}

export function SalonFinder({
  placeholder = "Wpisz miasto, np. Kraśnik...",
  notFoundText = "Nie znaleźliśmy salonu w tej miejscowości. Sieć Studio Figura cały czas rośnie — sprawdź ponownie wkrótce.",
  callLabel = "Zadzwoń i umów wizytę",
  viewOfferLabel = "Sprawdź, co mamy w ofercie",
  salonPrefix = "",
}: Props) {
  const [query, setQuery] = useState("")

  const q = normalize(query.trim())
  const results = q
    ? SALONS.filter((s) => normalize(`${s.city} ${s.name} ${s.address}`).includes(q))
    : SALONS

  return (
    <div className="flex flex-col gap-6">
      <div className="relative max-w-md">
        <IconSearch
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="h-11 rounded-full pl-10"
        />
      </div>

      {results.length === 0 ? (
        <p className="text-sm text-muted-foreground">{notFoundText}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {results.map((salon) => (
            <div
              key={salon.slug}
              className="flex flex-col gap-4 rounded-2xl border border-primary/30 bg-card p-6"
            >
              <h3 className="text-xl font-bold">{salon.name}</h3>
              <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2.5">
                  <IconMapPin size={18} className="shrink-0 text-primary" />
                  {salon.address}, {salon.postalCode}
                </li>
                <li className="flex items-center gap-2.5">
                  <IconPhone size={18} className="shrink-0 text-primary" />
                  <a
                    href={`tel:${salon.phone.replace(/\s/g, "")}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {salon.phone}
                  </a>
                </li>
                {salon.hours.length > 0 && (
                  <li className="flex items-start gap-2.5">
                    <IconClock size={18} className="mt-0.5 shrink-0 text-primary" />
                    <span>{salon.hours.join(", ")}</span>
                  </li>
                )}
              </ul>
              <div className="mt-auto flex flex-wrap gap-3">
                <Button asChild size="sm">
                  <a href={`tel:${salon.phone.replace(/\s/g, "")}`}>{callLabel}</a>
                </Button>
                <Button asChild variant="outline" size="sm" className="gap-1.5">
                  <Link href={`${salonPrefix}/${salon.slug}`}>
                    {viewOfferLabel}
                    <IconArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
