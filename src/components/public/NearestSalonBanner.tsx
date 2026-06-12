"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { IconMapPin, IconX } from "@tabler/icons-react"
import { SALONS, type Salon } from "@/lib/salons"

const DISMISS_KEY = "sf-salon-banner-dismissed"

function nearestSalon(lat: number, lng: number): Salon {
  // Wystarczy przybliżenie kątowe — salony dzielą dziesiątki kilometrów
  return SALONS.reduce((best, s) => {
    const d = (s.lat - lat) ** 2 + (s.lng - lng) ** 2
    const bd = (best.lat - lat) ** 2 + (best.lng - lng) ** 2
    return d < bd ? s : best
  })
}

export function NearestSalonBanner() {
  const [visible, setVisible] = useState(false)
  const [nearest, setNearest] = useState<Salon | null>(null)
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    setVisible(localStorage.getItem(DISMISS_KEY) !== "1")
  }, [])

  if (!visible) return null

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1")
    setVisible(false)
  }

  function locate() {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setNearest(nearestSalon(coords.latitude, coords.longitude))
        setLocating(false)
      },
      () => setLocating(false)
    )
  }

  return (
    <div className="border-b border-primary/20 bg-primary/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 md:px-6">
        <div className="flex items-center gap-2 text-sm">
          <IconMapPin size={18} className="shrink-0 text-primary" />
          {nearest ? (
            <span>
              Najbliżej Ciebie:{" "}
              <Link href={`/${nearest.slug}`} className="font-semibold text-primary underline-offset-2 hover:underline">
                {nearest.name}
              </Link>
            </span>
          ) : (
            <button
              onClick={locate}
              disabled={locating}
              className="text-left font-medium text-primary underline-offset-2 hover:underline disabled:opacity-60"
            >
              {locating ? "Szukam najbliższego salonu..." : "Znajdź salon najbliżej Ciebie"}
            </button>
          )}
        </div>
        <button
          onClick={dismiss}
          aria-label="Zamknij"
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <IconX size={16} />
        </button>
      </div>
    </div>
  )
}
