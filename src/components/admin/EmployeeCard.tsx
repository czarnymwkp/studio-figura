"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EmployeeCardProps {
  name: string
  position: string
  image: string
  dragging?: boolean
  onDragStart?: () => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: () => void
}

export function EmployeeCard({ name, position, image, dragging, onDragStart, onDragOver, onDrop }: EmployeeCardProps) {
  return (
    <Card
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => { e.preventDefault(); onDragOver?.(e) }}
      onDrop={onDrop}
      className={`rounded-2xl border border-primary/40 overflow-hidden flex flex-col cursor-grab active:cursor-grabbing select-none transition-opacity ${dragging ? "opacity-40" : "opacity-100"}`}
    >
      <div className="relative w-full aspect-square bg-muted">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <CardContent className="flex flex-col gap-2 p-4">
        <p className="font-bold text-base">{name}</p>
        <Badge variant="outline" className="w-fit border-primary/50 text-primary text-xs">
          {position}
        </Badge>
      </CardContent>
    </Card>
  )
}
