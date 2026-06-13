"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  IconCash, IconCreditCard, IconBuildingBank, IconWorld,
  IconBuilding, IconId, IconDeviceFloppy,
} from "@tabler/icons-react"
import { loadPayments, savePayments, DEFAULT_PAYMENTS, type PaymentsSettings } from "@/lib/firebase/settings"

const VAT_RATES = [0, 5, 8, 23]
const CURRENCIES = ["PLN", "EUR", "USD"]

const METHODS: { key: keyof Pick<PaymentsSettings, "cash"|"card"|"transfer"|"online">; label: string; description: string; icon: React.ReactNode }[] = [
  { key: "cash",     label: "Gotówka",         description: "Płatność przy wizycie",             icon: <IconCash size={18} /> },
  { key: "card",     label: "Karta płatnicza", description: "Terminal w studiu",                  icon: <IconCreditCard size={18} /> },
  { key: "transfer", label: "Przelew",          description: "Przelew bankowy przed wizytą",       icon: <IconBuildingBank size={18} /> },
  { key: "online",   label: "Online",           description: "Przelewy24 / Stripe w portalu",      icon: <IconWorld size={18} /> },
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  )
}

const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"

export function PaymentsTab() {
  const [form, setForm] = useState<PaymentsSettings>(DEFAULT_PAYMENTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadPayments().then((p) => { setForm(p); setLoading(false) })
  }, [])

  const set = <K extends keyof PaymentsSettings>(k: K, v: PaymentsSettings[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await savePayments(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="h-40 rounded-2xl border border-border bg-muted/20 animate-pulse" />

  return (
    <div className="flex flex-col gap-8">

      {/* Metody płatności */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Metody płatności</p>
        {METHODS.map(({ key, label, description, icon }) => (
          <div key={key} className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="text-primary">{icon}</span>
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
            <Switch checked={form[key]} onCheckedChange={(v) => set(key, v)} />
          </div>
        ))}
      </div>

      <div className="border-t border-border" />

      {/* Podatki */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Podatki i waluta</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Stawka VAT">
            <select value={form.vatRate} onChange={(e) => set("vatRate", Number(e.target.value))} className={selectClass}>
              {VAT_RATES.map((r) => (
                <option key={r} value={r}>{r}%</option>
              ))}
            </select>
          </Field>
          <Field label="Waluta">
            <select value={form.currency} onChange={(e) => set("currency", e.target.value)} className={selectClass}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Dane do faktury */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Dane do faktur</p>
        <Field label="Nazwa firmy">
          <div className="relative">
            <IconBuilding size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={form.invoiceName} onChange={(e) => set("invoiceName", e.target.value)} placeholder="Studio Figura sp. z o.o." className="h-10 pl-9" />
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="NIP">
            <div className="relative">
              <IconId size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={form.invoiceNip} onChange={(e) => set("invoiceNip", e.target.value)} placeholder="000-000-00-00" className="h-10 pl-9" />
            </div>
          </Field>
          <Field label="REGON">
            <Input value={form.invoiceRegon} onChange={(e) => set("invoiceRegon", e.target.value)} placeholder="000000000" className="h-10" />
          </Field>
        </div>
        <Field label="Adres">
          <Input value={form.invoiceAddress} onChange={(e) => set("invoiceAddress", e.target.value)} placeholder="ul. Przykładowa 1" className="h-10" />
        </Field>
        <Field label="Miasto">
          <Input value={form.invoiceCity} onChange={(e) => set("invoiceCity", e.target.value)} placeholder="00-000 Warszawa" className="h-10" />
        </Field>
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
