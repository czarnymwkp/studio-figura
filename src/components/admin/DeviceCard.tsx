"use client"

import { useState } from "react"
import Image from "next/image"
import { IconChevronDown, IconAlertTriangle } from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DeviceCardProps {
  name: string
  description: string
  image: string
  active?: boolean
}

export function DeviceCard({ name, description, image, active = true }: DeviceCardProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(active)

  return (
    <Card className="rounded-2xl border border-primary/40 bg-card overflow-hidden flex flex-col">
      <div className="relative w-full aspect-square bg-muted">
        <Image src={image} alt={name} fill className="object-contain p-4" />
        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <Badge
            onClick={() => setStatus(v => !v)}
            className={cn(
              "cursor-pointer text-xs font-semibold select-none",
              status
                ? "bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30"
                : "bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30"
            )}
            variant="outline"
          >
            {status ? "Aktywne" : "Nieaktywne"}
          </Badge>
        </div>
      </div>
      <CardContent className="flex flex-col gap-2 p-4">
        <h1 className="text-sm font-bold leading-tight">{name}</h1>
        {!status && (
          <Button
            size="sm"
            variant="destructive"
            className="w-full gap-1.5 text-xs"
          >
            <IconAlertTriangle size={14} />
            Zgłoś awarię
          </Button>
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          Opis
          <IconChevronDown
            size={16}
            className={cn("transition-transform duration-200", open && "rotate-180")}
          />
        </button>
        {open && (
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
