"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Przegląd",
  "/admin/klienci": "Klienci",
  "/admin/klienci/dodaj": "Dodaj klienta",
  "/admin/pracownicy": "Pracownicy",
  "/admin/pracownicy/dodaj": "Dodaj pracownika",
  "/admin/grafik": "Grafik",
  "/admin/urzadzenia": "Urządzenia",
  "/admin/promocje": "Promocje",
  "/admin/multimedia": "Multimedia",
  "/admin/tutoriale": "Tutoriale",
  "/admin/dokumenty": "Dokumenty",
  "/admin/cennik": "Cennik",
  "/admin/automatyzacja": "Automatyzacja",
  "/admin/konto": "Moje konto",
  "/admin/ustawienia": "Ustawienia",
  "/admin/terminarz": "Terminarz",
}

export function SiteHeader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const baseTitle = PAGE_TITLES[pathname] ?? "Panel administracyjny"
  const kat = searchParams.get("kat")
  const title = kat ?? baseTitle

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  )
}
