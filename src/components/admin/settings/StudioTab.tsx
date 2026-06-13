"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { IconBuilding, IconPhone, IconMail, IconId, IconMapPin, IconClock, IconDeviceFloppy } from "@tabler/icons-react"
import { loadStudio, saveStudio, DEFAULT_STUDIO, type StudioSettings, type WeekHours } from "@/lib/firebase/settings"

const DAYS: { key: keyof WeekHours; label: string }[] = [
  { key: "mon", label: "Poniedziałek" },
  { key: "tue", label: "Wtorek" },
  { key: "wed", label: "Środa" },
  { key: "thu", label: "Czwartek" },
  { key: "fri", label: "Piątek" },
  { key: "sat", label: "Sobota" },
  { key: "sun", label: "Niedziela" },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">{title}</p>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  )
}

const inputClass = "h-10"

export function StudioTab() {
  const [form, setForm] = useState<StudioSettings>(DEFAULT_STUDIO)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadStudio().then((s) => { setForm(s); setLoading(false) })
  }, [])

  const set = (field: keyof Omit<StudioSettings, "hours">, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const setHour = (day: keyof WeekHours, field: "open" | "close" | "closed", value: string | boolean) =>
    setForm((prev) => ({
      ...prev,
      hours: { ...prev.hours, [day]: { ...prev.hours[day], [field]: value } },
    }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveStudio(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="h-40 rounded-2xl border border-border bg-muted/20 animate-pulse" />

  return (
    <div className="flex flex-col gap-8">

      <Section title="Dane studia">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nazwa studia *">
            <div className="relative">
              <IconBuilding size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} className={`${inputClass} pl-9`} />
            </div>
          </Field>
          <Field label="NIP">
            <div className="relative">
              <IconId size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={form.nip} onChange={(e) => set("nip", e.target.value)} placeholder="000-000-00-00" className={`${inputClass} pl-9`} />
            </div>
          </Field>
        </div>
        <Field label="Adres">
          <div className="relative">
            <IconMapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="ul. Przykładowa 1" className={`${inputClass} pl-9`} />
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Miasto">
            <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Warszawa" className={inputClass} />
          </Field>
          <Field label="Kod pocztowy">
            <Input value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} placeholder="00-000" className={inputClass} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Telefon">
            <div className="relative">
              <IconPhone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="600 000 000" className={`${inputClass} pl-9`} />
            </div>
          </Field>
          <Field label="Email">
            <div className="relative">
              <IconMail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="kontakt@studiofigura.pl" className={`${inputClass} pl-9`} />
            </div>
          </Field>
        </div>
      </Section>

      <div className="border-t border-border" />

      <Section title="Wiadomość powitalna (portal klienta)">
        <textarea
          value={form.welcomeMessage}
          onChange={(e) => set("welcomeMessage", e.target.value)}
          rows={3}
          placeholder="Tekst wyświetlany klientom po zalogowaniu..."
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </Section>

      <div className="border-t border-border" />

      <Section title="Godziny otwarcia">
        <div className="rounded-2xl border border-border overflow-hidden">
          {DAYS.map(({ key, label }, i) => {
            const day = form.hours[key]
            return (
              <div
                key={key}
                className={`flex items-center gap-4 px-5 py-3 ${i % 2 === 0 ? "" : "bg-muted/20"} ${i > 0 ? "border-t border-border/50" : ""}`}
              >
                <div className="w-36 flex items-center gap-2">
                  <IconClock size={14} className="text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <Switch checked={!day.closed} onCheckedChange={(v) => setHour(key, "closed", !v)} />
                <span className="text-xs text-muted-foreground w-12">{day.closed ? "Zamknięte" : "Otwarte"}</span>
                {!day.closed && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={day.open}
                      onChange={(e) => setHour(key, "open", e.target.value)}
                      className="h-8 w-28 text-sm"
                    />
                    <span className="text-muted-foreground text-sm">—</span>
                    <Input
                      type="time"
                      value={day.close}
                      onChange={(e) => setHour(key, "close", e.target.value)}
                      className="h-8 w-28 text-sm"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Section>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg" className="px-8 text-base font-semibold">
          <IconDeviceFloppy size={18} />
          {saving ? "Zapisuję..." : saved ? "Zapisano!" : "Zapisz zmiany"}
        </Button>
      </div>
    </div>
  )
}
