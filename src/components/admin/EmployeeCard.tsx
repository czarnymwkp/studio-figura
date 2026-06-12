"use client"

import { IconSparkles } from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EmployeeCardProps {
  name: string
  position: string
  skillsCount?: number
  onClick?: () => void
}

function initials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function EmployeeCard({ name, position, skillsCount = 0, onClick }: EmployeeCardProps) {
  return (
    <Card
      onClick={onClick}
      className="rounded-2xl border border-primary/40 overflow-hidden flex flex-col select-none p-0 transition-shadow hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
    >
      <div className="relative flex w-full aspect-square items-center justify-center bg-gradient-to-br from-primary/25 to-primary/5">
        <span className="text-5xl font-extrabold text-primary">{initials(name)}</span>
      </div>
      <CardContent className="flex flex-col gap-2 p-4 pt-0">
        <p className="font-bold text-base">{name}</p>
        <Badge variant="outline" className="w-fit border-primary/50 text-primary text-xs">
          {position}
        </Badge>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <IconSparkles size={12} className="text-primary" />
          {skillsCount > 0 ? `${skillsCount} umiejętności` : "brak umiejętności"}
        </p>
      </CardContent>
    </Card>
  )
}
