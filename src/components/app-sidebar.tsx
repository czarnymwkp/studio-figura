"use client"

import * as React from "react"
import Image from "next/image"
import { NavMain } from "@/components/nav-main"
import { NavDocuments } from "@/components/nav-documents"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  IconLayoutDashboard, IconUsersGroup, IconUserCheck, IconTool,
  IconTag, IconSettings, IconHelp, IconSearch,
  IconSpeakerphone, IconCalendarTime, IconRobot,
  IconContract, IconReport, IconPhoto, IconSchool, IconFileDescription,
} from "@tabler/icons-react"

const data = {
  navMain: [
    {
      title: "Przegląd",
      url: "/admin/dashboard",
      icon: <IconLayoutDashboard size={22} className="text-primary" />,
    },
    {
      title: "Klienci",
      url: "/admin/klienci",
      icon: <IconUsersGroup size={22} className="text-primary" />,
    },
    {
      title: "Pracownicy",
      url: "/admin/pracownicy",
      icon: <IconUserCheck size={22} className="text-primary" />,
    },
    {
      title: "Grafik",
      url: "/admin/grafik",
      icon: <IconCalendarTime size={22} className="text-primary" />,
    },
    {
      title: "Urządzenia",
      url: "/admin/urzadzenia",
      icon: <IconTool size={22} className="text-primary" />,
    },
    {
      title: "Promocje",
      url: "/admin/promocje",
      icon: <IconSpeakerphone size={22} className="text-primary" />,
    },
    {
      title: "Multimedia",
      url: "/admin/multimedia",
      icon: <IconPhoto size={22} className="text-primary" />,
    },
    {
      title: "Tutoriale",
      url: "/admin/tutoriale",
      icon: <IconSchool size={22} className="text-primary" />,
    },
    {
      title: "Dokumenty",
      url: "/admin/dokumenty",
      icon: <IconFileDescription size={22} className="text-primary" />,
      items: [
        { title: "Przeciwwskazania", url: "/admin/dokumenty?kat=Przeciwwskazania" },
        { title: "Dokumentacja urządzeń", url: "/admin/dokumenty?kat=Dokumentacja+urządzeń" },
        { title: "Procedury zabiegowe", url: "/admin/dokumenty?kat=Procedury+zabiegowe" },
        { title: "Karty preparatów", url: "/admin/dokumenty?kat=Karty+preparatów" },
      ],
    },
    {
      title: "Cennik",
      url: "/admin/cennik",
      icon: <IconTag size={22} className="text-primary" />,
    },
    {
      title: "Automatyzacja",
      url: "/admin/automatyzacja",
      icon: <IconRobot size={22} className="text-primary" />,
      onClick: () => window.dispatchEvent(new CustomEvent("automatyzacja:reset")),
    },
  ],
  navDocuments: [
    {
      name: "Umowy z klientami",
      url: "#",
      icon: <IconContract size={22} className="text-primary" />,
    },
    {
      name: "Raporty",
      url: "#",
      icon: <IconReport size={22} className="text-primary" />,
    },
  ],
  navSecondary: [
    {
      title: "Ustawienia",
      url: "/admin/ustawienia",
      icon: <IconSettings size={22} className="text-primary" />,
    },
    {
      title: "Pomoc",
      url: "#",
      icon: <IconHelp size={22} className="text-primary" />,
    },
    {
      title: "Wyszukaj",
      url: "#",
      icon: <IconSearch size={22} className="text-primary" />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-auto py-2 data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <Image src="/img/logo.png" alt="Studio Figura" width={48} height={48} className="shrink-0" />
                <span className="text-base font-semibold">Studio Figura</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />

        {/* Separator */}
        <div className="mx-4 my-3 h-px bg-primary/30" />

        <NavDocuments items={data.navDocuments} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
