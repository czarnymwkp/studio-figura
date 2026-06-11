"use client";

import useRequireAuth from "@/lib/hooks/useRequireAuth";
import { UserRole } from "@/types";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const ALLOWED_ROLES: UserRole[] = ["admin", "employee"];

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useRequireAuth(ALLOWED_ROLES);

  if (loading || !profile) return null;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
