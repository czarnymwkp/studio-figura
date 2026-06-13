"use client"

import { useState } from "react"
import Image from "next/image"
import { IconChevronDown, IconAlertTriangle, IconMinus, IconPlus } from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DeviceCardProps {
  name: string
  description: string
  image: string
  active: boolean
  count: number
  onToggleActive: () => void
  onChangeCount: (count: number) => void
}

export function DeviceCard({ name, description, image, active, count, onToggleActive, onChangeCount }: DeviceCardProps) {
  const [open, setOpen] = useState(false)
  const unavailable = count === 0

  return (
    <Card className={cn(
      "rounded-2xl border bg-card overflow-hidden flex flex-col p-0 transition-opacity",
      unavailable ? "border-border opacity-60" : "border-primary/40"
    )}>
      <div className="relative w-full aspect-square bg-white">
        <Image
          src={image} alt={name} fill
          className={cn("object-contain p-4", unavailable && "grayscale")}
        />
        <div className="absolute top-2 left-2">
          {unavailable ? (
            <Badge variant="outline" className="text-xs font-semibold bg-muted/80 text-muted-foreground border-border">
              Brak w salonie
            </Badge>
          ) : (
            <Badge
              onClick={onToggleActive}
              className={cn(
                "cursor-pointer text-xs font-semibold select-none",
                active
                  ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                  : "bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30"
              )}
              variant="outline"
            >
              {active ? "Aktywne" : "Nieaktywne"}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="flex flex-col gap-2 p-4 pt-0">
        <h1 className={cn("text-sm font-bold leading-tight", unavailable && "text-muted-foreground")}>{name}</h1>

        {/* Liczba sztuk */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Sztuk w studio</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onChangeCount(count - 1)}
              disabled={count <= 0}
              className="flex size-6 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IconMinus size={12} />
            </button>
            <span className={cn("min-w-5 text-center text-sm font-bold", unavailable ? "text-muted-foreground" : "text-primary")}>
              {count}
            </span>
            <button
              onClick={() => onChangeCount(count + 1)}
              className="flex size-6 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <IconPlus size={12} />
            </button>
          </div>
        </div>

        {!unavailable && !active && (
          <Button size="sm" variant="destructive" className="w-full gap-1.5 text-xs">
            <IconAlertTriangle size={14} />
            Zgłoś awarię
          </Button>
        )}

        {unavailable && (
          <p className="text-xs text-muted-foreground italic">
            Ustaw liczbę sztuk &gt; 0 aby aktywować urządzenie.
          </p>
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          Opis
          <IconChevronDown size={16} className={cn("transition-transform duration-200", open && "rotate-180")} />
        </button>
        {open && <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>}
      </CardContent>
    </Card>
  )
}
