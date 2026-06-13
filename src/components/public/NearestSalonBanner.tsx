"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { IconMapPin, IconX } from "@tabler/icons-react"
import { SALONS, type Salon } from "@/lib/salons"
import type { Dictionary } from "@/lib/i18n"

const DISMISS_KEY = "sf-salon-banner-dismissed"

function nearestSalon(lat: number, lng: number): Salon {
  return SALONS.reduce((best, s) => {
    const d = (s.lat - lat) ** 2 + (s.lng - lng) ** 2
    const bd = (best.lat - lat) ** 2 + (best.lng - lng) ** 2
    return d < bd ? s : best
  })
}

interface Props {
  bannerDict?: Dictionary["banner"]
  finderPrefix?: string
}

export function NearestSalonBanner({
  bannerDict = {
    nearest: "Najbliżej Ciebie:",
    locate: "Znajdź salon najbliżej Ciebie",
    locating: "Szukam najbliższego salonu...",
  },
  finderPrefix = "",
}: Props) {
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
              {bannerDict.nearest}{" "}
              <Link
                href={`${finderPrefix}/${nearest.slug}`}
                className="font-semibold text-primary underline-offset-2 hover:underline"
              >
                {nearest.name}
              </Link>
            </span>
          ) : (
            <button
              onClick={locate}
              disabled={locating}
              className="text-left font-medium text-primary underline-offset-2 hover:underline disabled:opacity-60"
            >
              {locating ? bannerDict.locating : bannerDict.locate}
            </button>
          )}
        </div>
        <button
          onClick={dismiss}
          aria-label="Close"
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <IconX size={16} />
        </button>
      </div>
    </div>
  )
}
