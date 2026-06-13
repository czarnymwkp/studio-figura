"use client"

import { useState } from "react"
import { IconBuilding, IconPlugConnected, IconWorld, IconCreditCard } from "@tabler/icons-react"
import { StudioTab } from "@/components/admin/settings/StudioTab"
import { IntegrationsTab } from "@/components/admin/settings/IntegrationsTab"
import { PortalTab } from "@/components/admin/settings/PortalTab"
import { PaymentsTab } from "@/components/admin/settings/PaymentsTab"

const TABS = [
  { id: "studio",       label: "Studio",          icon: IconBuilding,      component: StudioTab },
  { id: "integrations", label: "Integracje",       icon: IconPlugConnected, component: IntegrationsTab },
  { id: "portal",       label: "Portal klienta",   icon: IconWorld,         component: PortalTab },
  { id: "payments",     label: "Płatności",         icon: IconCreditCard,    component: PaymentsTab },
]

export default function UstawieniaPage() {
  const [activeTab, setActiveTab] = useState("studio")
  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.component ?? StudioTab

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Ustawienia</h1>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === id
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={16} className={activeTab === id ? "text-primary" : ""} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-2xl border border-border bg-card px-8 py-7">
        <ActiveComponent />
      </div>
    </div>
  )
}
