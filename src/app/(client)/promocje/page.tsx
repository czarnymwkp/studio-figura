"use client"

import Link from "next/link"
import Image from "next/image"
import { IconArrowRight, IconCalendarDue, IconSparkles } from "@tabler/icons-react"

import { useClientPortal } from "@/lib/hooks/useClientPortal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function PromocjePage() {
  const { promotions, loading } = useClientPortal()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Promocje</h1>
        <p className="mt-1 text-muted-foreground">
          Aktualne oferty specjalne — skorzystaj, zanim wygasną.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-5">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      ) : promotions.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border p-12 text-center">
          <IconSparkles size={32} className="text-muted-foreground" />
          <p className="font-semibold">Aktualnie brak promocji</p>
          <p className="text-sm text-muted-foreground">
            Zaglądaj tu regularnie — nowe oferty pojawiają się często.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {promotions.map((promo) => (
            <Card
              key={promo.id}
              className="group overflow-hidden border-border/60 p-0 transition-shadow hover:shadow-lg hover:shadow-primary/10"
            >
              <CardContent className="grid p-0 md:grid-cols-5">
                <div className="relative h-48 overflow-hidden md:col-span-2 md:h-full md:min-h-56">
                  <Image
                    src={promo.image}
                    alt={promo.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className="absolute left-4 top-4 bg-primary px-3 py-1 text-lg font-bold text-primary-foreground">
                    {promo.discount}
                  </Badge>
                </div>
                <div className="flex flex-col justify-between gap-4 p-6 md:col-span-3">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold tracking-tight">{promo.name}</h2>
                    <p className="text-muted-foreground">{promo.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <IconCalendarDue size={16} className="text-primary" />
                      Ważna do {promo.validUntil}
                    </span>
                    <Button asChild size="lg" className="text-base font-semibold px-6">
                      <Link href="/rezerwacje">
                        Zarezerwuj wizytę
                        <IconArrowRight size={18} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
