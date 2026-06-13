"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { IconDeviceFloppy, IconWorld, IconCalendar, IconTag, IconFileText, IconLink } from "@tabler/icons-react"
import { loadPortal, savePortal, DEFAULT_PORTAL, type PortalSettings } from "@/lib/firebase/settings"

function ToggleRow({
  icon, title, description, checked, onChange,
}: { icon: React.ReactNode; title: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-3.5">
      <div className="flex items-center gap-3">
        <span className="text-primary">{icon}</span>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

export function PortalTab() {
  const [form, setForm] = useState<PortalSettings>(DEFAULT_PORTAL)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadPortal().then((p) => { setForm(p); setLoading(false) })
  }, [])

  const set = <K extends keyof PortalSettings>(k: K, v: PortalSettings[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await savePortal(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="h-40 rounded-2xl border border-border bg-muted/20 animate-pulse" />

  return (
    <div className="flex flex-col gap-8">

      {/* Dostępność */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Dostępność</p>
        <ToggleRow
          icon={<IconWorld size={18} />}
          title="Portal klienta aktywny"
          description="Klienci mogą logować się i korzystać z portalu"
          checked={form.active}
          onChange={(v) => set("active", v)}
        />
        <ToggleRow
          icon={<IconCalendar size={18} />}
          title="Rezerwacje online"
          description="Klienci mogą samodzielnie rezerwować wizyty przez portal"
          checked={form.allowBookings}
          onChange={(v) => set("allowBookings", v)}
        />
        <ToggleRow
          icon={<IconTag size={18} />}
          title="Widoczny cennik"
          description="Klienci widzą ceny zabiegów w portalu"
          checked={form.showPricing}
          onChange={(v) => set("showPricing", v)}
        />
      </div>

      <div className="border-t border-border" />

      {/* Treści powitalne */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Treści na stronie głównej portalu</p>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium">Tytuł powitalny</Label>
          <Input
            value={form.welcomeTitle}
            onChange={(e) => set("welcomeTitle", e.target.value)}
            placeholder="Witaj w Studio Figura"
            className="h-10"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium">Tekst powitalny</Label>
          <textarea
            value={form.welcomeText}
            onChange={(e) => set("welcomeText", e.target.value)}
            rows={3}
            placeholder="Krótki opis dla klientów..."
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Regulamin i polityka */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Regulamin i polityka prywatności</p>
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <IconLink size={14} className="text-primary" />
            Link do polityki prywatności
          </Label>
          <Input
            value={form.privacyUrl}
            onChange={(e) => set("privacyUrl", e.target.value)}
            placeholder="https://studiofigura.pl/polityka-prywatnosci"
            className="h-10"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <IconFileText size={14} className="text-primary" />
            Treść regulaminu
          </Label>
          <textarea
            value={form.termsText}
            onChange={(e) => set("termsText", e.target.value)}
            rows={8}
            placeholder="Wklej lub wpisz treść regulaminu..."
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg" className="px-8 text-base font-semibold">
          <IconDeviceFloppy size={18} />
          {saving ? "Zapisuję..." : saved ? "Zapisano!" : "Zapisz zmiany"}
        </Button>
      </div>
    </div>
  )
}
