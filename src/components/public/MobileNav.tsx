"use client"

import { useState } from "react"
import Link from "next/link"
import { IconMenu2, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface NavLink {
  href: string
  label: string
}

interface Props {
  links: NavLink[]
  loginHref: string
  loginLabel: string
}

export function MobileNav({ links, loginHref, loginLabel }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
          <IconMenu2 size={22} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 p-0" showCloseButton={false}>
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
            <span className="text-sm font-semibold">Studio Figura</span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <IconX size={18} />
            </Button>
          </div>

          <nav className="flex flex-col gap-1 p-4">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-border/40 p-4">
            <Link
              href={loginHref}
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {loginLabel}
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
