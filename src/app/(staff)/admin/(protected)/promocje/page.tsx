"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { IconPlus, IconBrandFacebook } from "@tabler/icons-react"

interface Promotion {
  id: number
  name: string
  description: string
  discount: string
  validUntil: string
  image: string
  active: boolean
}

const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 1,
    name: "Wakacyjny pakiet depilacji",
    description: "Skorzystaj z letniej promocji na depilację laserową. W cenie zabiegu na nogi całe otrzymujesz gratis depilację pach lub bikini. Oferta ograniczona czasowo — tylko przez lipiec i sierpień.",
    discount: "-20%",
    validUntil: "31.08.2026",
    image: "/img/studio-figura-login.jpg",
    active: true,
  },
  {
    id: 2,
    name: "HIFU 4D — bezpłatna konsultacja",
    description: "Przy pierwszym zabiegu HIFU 4D twarz otrzymujesz bezpłatną konsultację z naszą specjalistką. Dowiedz się, jakie efekty możesz osiągnąć i zaplanuj optymalną serię zabiegów.",
    discount: "Gratis",
    validUntil: "30.06.2026",
    image: "/img/studio-figura-login.jpg",
    active: true,
  },
  {
    id: 3,
    name: "Karnety kavitacja 5+1",
    description: "Kup karnet na 5 zabiegów kavitacji i szósty zabieg otrzymujesz całkowicie gratis. Idealny sposób na trwałe efekty modelowania sylwetki przy regularnej terapii.",
    discount: "-17%",
    validUntil: "31.07.2026",
    image: "/img/studio-figura-login.jpg",
    active: false,
  },
  {
    id: 4,
    name: "Zimowa pielęgnacja twarzy",
    description: "Pakiet trzech zabiegów Carbon Master w cenie dwóch. Dogłębne oczyszczenie skóry, redukcja porów i rozjaśnienie przebarwień — idealne przygotowanie skóry na jesień i zimę.",
    discount: "-33%",
    validUntil: "28.02.2027",
    image: "/img/studio-figura-login.jpg",
    active: false,
  },
]

export default function PromocjePage() {
  const [promotions, setPromotions] = useState(INITIAL_PROMOTIONS)

  const toggle = (id: number) =>
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Promocje</h1>
        <Button size="lg" className="text-base font-semibold px-6">
          <IconPlus size={18} />
          Dodaj promocję
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className={`flex rounded-2xl border overflow-hidden transition-colors ${promo.active ? "border-primary/40 bg-primary/5" : "border-border bg-muted/20 opacity-70"}`}
          >
            {/* Zdjęcie */}
            <div className="relative w-48 shrink-0">
              <Image
                src={promo.image}
                alt={promo.name}
                fill
                className="object-cover"
              />
              {/* Overlay z rabatem */}
              <div className="absolute top-3 left-3">
                <Badge className="bg-primary text-primary-foreground text-sm font-bold px-2 py-0.5 shadow">
                  {promo.discount}
                </Badge>
              </div>
            </div>

            {/* Treść */}
            <div className="flex flex-1 flex-col justify-between p-5 gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-base font-semibold leading-tight">{promo.name}</h2>
                  <Badge
                    variant="outline"
                    className={promo.active
                      ? "border-primary/40 text-primary shrink-0"
                      : "border-muted-foreground/30 text-muted-foreground shrink-0"}
                  >
                    {promo.active ? "Aktywna" : "Nieaktywna"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{promo.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Ważna do: <span className="font-medium text-foreground">{promo.validUntil}</span>
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-36 gap-1.5 border-[#1877F2]/40 text-[#1877F2] hover:bg-[#1877F2]/10 hover:text-[#1877F2]"
                  >
                    <IconBrandFacebook size={15} />
                    Post na FB
                  </Button>
                  <Button
                    size="sm"
                    variant={promo.active ? "outline" : "default"}
                    className="w-36"
                    onClick={() => toggle(promo.id)}
                  >
                    {promo.active ? "Dezaktywuj" : "Aktywuj"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
