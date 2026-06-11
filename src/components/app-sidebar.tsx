"use client"

import * as React from "react"

import Image from "next/image"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { IconLayoutDashboard, IconUsersGroup, IconUserCheck, IconTool, IconTag, IconCamera, IconFileDescription, IconFileAi, IconSettings, IconHelp, IconSearch, IconContract, IconReport, IconSpeakerphone } from "@tabler/icons-react"

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
      title: "Cennik",
      url: "/admin/cennik",
      icon: <IconTag size={22} className="text-primary" />,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: (
        <IconCamera
        />
      ),
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: (
        <IconFileDescription
        />
      ),
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: (
        <IconFileAi
        />
      ),
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Ustawienia",
      url: "#",
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
  documents: [
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
        <SidebarSeparator className="mx-4 my-1 opacity-30" />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
