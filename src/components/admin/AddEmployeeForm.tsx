"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { IconUser, IconMail, IconPhone, IconBriefcase, IconLock, IconShield, IconUserPlus } from "@tabler/icons-react"
import { auth } from "@/lib/firebase/config"

const POSITIONS = [
  "Kosmetolog",
  "Specjalista modelowania sylwetki",
  "Laser & Depilacja",
  "Recepcjonistka",
  "Manager",
  "Fizjoterapeuta",
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">{title}</p>
      {children}
    </div>
  )
}

function FieldRow({ icon, label, hint, children }: { icon: React.ReactNode; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="flex items-center gap-1.5 text-sm font-medium">
        <span className="text-primary">{icon}</span>
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function AddEmployeeForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    password: "",
    confirmPassword: "",
    role: "employee" as "employee" | "admin",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const set = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (form.password !== form.confirmPassword) { setError("Hasła nie są identyczne."); return }
    if (form.password.length < 6) { setError("Hasło musi mieć co najmniej 6 znaków."); return }
    if (!form.position) { setError("Wybierz stanowisko."); return }

    setSaving(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Wystąpił błąd."); return }
      router.push("/admin/pracownicy")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border border-primary/40 overflow-hidden">

      {/* Header */}
      <div className="bg-primary/10 border-b border-primary/20 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <IconUserPlus size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Dodaj pracownika</h1>
            <p className="text-sm text-muted-foreground">Nowy pracownik otrzyma dostęp do panelu Studio Figura.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="px-8 py-6 flex flex-col gap-8">

          {/* Dane osobowe */}
          <Section title="Dane osobowe">
            <div className="grid grid-cols-2 gap-4">
              <FieldRow icon={<IconUser size={15} />} label="Imię *">
                <Input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="Anna" required className="h-10" />
              </FieldRow>
              <FieldRow icon={<IconUser size={15} />} label="Nazwisko *">
                <Input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Kowalska" required className="h-10" />
              </FieldRow>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FieldRow icon={<IconMail size={15} />} label="Email *" hint="Na ten adres pracownik będzie się logować.">
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="anna@studiofigura.pl" required className="h-10" />
              </FieldRow>
              <FieldRow icon={<IconPhone size={15} />} label="Telefon">
                <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="600 000 000" className="h-10" />
              </FieldRow>
            </div>
          </Section>

          <div className="border-t border-border" />

          {/* Stanowisko i rola */}
          <Section title="Stanowisko i dostęp">
            <FieldRow icon={<IconBriefcase size={15} />} label="Stanowisko *">
              <select
                value={form.position}
                onChange={(e) => set("position", e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Wybierz stanowisko...</option>
                {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </FieldRow>

            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3.5">
              <div className="flex items-center gap-3">
                <IconShield size={18} className="text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium">Uprawnienia administratora</p>
                  <p className="text-xs text-muted-foreground">Pełny dostęp do wszystkich sekcji panelu</p>
                </div>
              </div>
              <Switch
                checked={form.role === "admin"}
                onCheckedChange={(v) => setForm((prev) => ({ ...prev, role: v ? "admin" : "employee" }))}
              />
            </div>
          </Section>

          <div className="border-t border-border" />

          {/* Hasło */}
          <Section title="Hasło dostępu">
            <div className="grid grid-cols-2 gap-4">
              <FieldRow icon={<IconLock size={15} />} label="Hasło *" hint="Minimum 6 znaków.">
                <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} required className="h-10" />
              </FieldRow>
              <FieldRow icon={<IconLock size={15} />} label="Powtórz hasło *">
                <Input type="password" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} required className="h-10" />
              </FieldRow>
            </div>
          </Section>

          {error && (
            <p className="text-sm text-destructive text-center font-medium">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-border px-8 py-5 bg-muted/20">
          <Button type="button" variant="outline" className="flex-1 h-11" onClick={() => router.push("/admin/pracownicy")} disabled={saving}>
            Anuluj
          </Button>
          <Button type="submit" size="lg" className="flex-1 h-11 text-base font-semibold" disabled={saving}>
            {saving ? "Tworzę konto..." : "Dodaj pracownika"}
          </Button>
        </div>
      </form>
    </div>
  )
}
