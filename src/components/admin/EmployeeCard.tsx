"use client"

import { IconSparkles, IconShield, IconSettings } from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface EmployeeCardProps {
  name: string
  position: string
  role: "admin" | "employee"
  skillsCount?: number
  onClick?: () => void
  onEditRole?: () => void
}

function initials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function EmployeeCard({ name, position, role, skillsCount = 0, onClick, onEditRole }: EmployeeCardProps) {
  return (
    <Card className="rounded-2xl border border-primary/40 overflow-hidden flex flex-col select-none p-0 transition-shadow hover:shadow-lg hover:shadow-primary/10">
      <div
        className="relative flex w-full aspect-square items-center justify-center bg-gradient-to-br from-primary/25 to-primary/5 cursor-pointer"
        onClick={onClick}
      >
        <span className="text-5xl font-extrabold text-primary">{initials(name)}</span>
        {role === "admin" && (
          <div className="absolute top-2 right-2">
            <IconShield size={16} className="text-primary" />
          </div>
        )}
      </div>
      <CardContent className="flex flex-col gap-2 p-4 pt-3">
        <div className="flex items-start justify-between gap-1">
          <p className="font-bold text-base leading-tight">{name}</p>
          {onEditRole && (
            <Button
              size="icon"
              variant="ghost"
              className="size-11 shrink-0 -mt-1.5 text-primary hover:text-primary hover:bg-primary/10"
              onClick={(e) => { e.stopPropagation(); onEditRole() }}
              title="Edytuj pracownika"
            >
              <IconSettings size={28} />
            </Button>
          )}
        </div>
        <Badge variant="outline" className="w-fit border-primary/50 text-primary text-xs">
          {position}
        </Badge>
        {role === "admin" && (
          <Badge className="w-fit bg-primary/10 text-primary border-primary/30 hover:bg-primary/10 text-xs">
            <IconShield size={10} className="mr-1" />
            Administrator
          </Badge>
        )}
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <IconSparkles size={12} className="text-primary" />
          {skillsCount > 0 ? `${skillsCount} umiejętności` : "brak umiejętności"}
        </p>
      </CardContent>
    </Card>
  )
}
