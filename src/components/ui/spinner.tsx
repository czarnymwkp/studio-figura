"use client"

import { IconLoader2 } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export function Spinner({ className }: { className?: string }) {
  return <IconLoader2 className={cn("animate-spin", className)} aria-hidden />
}
