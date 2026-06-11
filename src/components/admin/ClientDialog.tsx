"use client"

import { useEffect, useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  IconUser, IconMail, IconPhone, IconCalendar,
  IconUserPlus, IconDeviceFloppy, IconLock,
} from "@tabler/icons-react"
import { updateClient, type Client } from "@/lib/firebase/clients"
import { auth } from "@/lib/firebase/config"

interface Props {
  open: boolean
  onClose: () => void
  client?: Client | null
}

const EMPTY = {
  name: "", surname: "", email: "", phone: "",
  subscription: false, lastVisit: null as string | null, nextVisit: null as string | null,
  password: "",
}

function FieldRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="flex items-center gap-1.5 text-sm font-medium">
        <span className="text-primary">{icon}</span>
        {label}
      </Label>
      {children}
    </div>
  )
}

export function ClientDialog({ open, onClose, client }: Props) {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const isEdit = !!client

  useEffect(() => {
    if (!open) return
    setError("")
    setForm(client
      ? { name: client.name, surname: client.surname, email: client.email, phone: client.phone, subscription: client.subscription, lastVisit: client.lastVisit, nextVisit: client.nextVisit, password: "" }
      : EMPTY
    )
  }, [client, open])

  const set = (field: keyof typeof EMPTY, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    setError("")
    if (!form.name || !form.surname || !form.email) return
    if (!isEdit && form.password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków.")
      return
    }

    setSaving(true)
    try {
      if (isEdit) {
        await updateClient(client.id, {
          name: form.name, surname: form.surname, email: form.email,
          phone: form.phone, subscription: form.subscription,
          lastVisit: form.lastVisit, nextVisit: form.nextVisit,
        })
      } else {
        const token = await auth.currentUser?.getIdToken()
        const res = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error ?? "Błąd serwera."); return }
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const canSave = !!form.name && !!form.surname && !!form.email && (isEdit || form.password.length >= 6)

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl p-0 overflow-hidden">

        <div className="bg-primary/10 border-b border-primary/20 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {isEdit
                ? <><IconDeviceFloppy size={22} className="text-primary" />Edytuj klienta</>
                : <><IconUserPlus size={22} className="text-primary" />Dodaj klienta</>
              }
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isEdit ? "Zaktualizuj dane klienta." : "Klient otrzyma dane dostępowe do swojego portalu."}
            </p>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <FieldRow icon={<IconUser size={15} />} label="Imię *">
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Anna" className="h-10" />
            </FieldRow>
            <FieldRow icon={<IconUser size={15} />} label="Nazwisko *">
              <Input value={form.surname} onChange={(e) => set("surname", e.target.value)} placeholder="Kowalska" className="h-10" />
            </FieldRow>
          </div>

          <FieldRow icon={<IconMail size={15} />} label="Email *">
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="anna@example.com" className="h-10" disabled={isEdit} />
          </FieldRow>

          <FieldRow icon={<IconPhone size={15} />} label="Telefon">
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="600 000 000" className="h-10" />
          </FieldRow>

          {!isEdit && (
            <FieldRow icon={<IconLock size={15} />} label="Hasło tymczasowe *">
              <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Min. 6 znaków" className="h-10" />
              <p className="text-xs text-muted-foreground">Klient użyje tego hasła przy pierwszym logowaniu.</p>
            </FieldRow>
          )}

          <div className="grid grid-cols-2 gap-4">
            <FieldRow icon={<IconCalendar size={15} />} label="Ostatnia wizyta">
              <Input type="date" value={form.lastVisit ?? ""} onChange={(e) => set("lastVisit", e.target.value || null)} className="h-10" />
            </FieldRow>
            <FieldRow icon={<IconCalendar size={15} />} label="Następna wizyta">
              <Input type="date" value={form.nextVisit ?? ""} onChange={(e) => set("nextVisit", e.target.value || null)} className="h-10" />
            </FieldRow>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
            <div>
              <p className="text-sm font-medium">Aktywna subskrypcja</p>
              <p className="text-xs text-muted-foreground">Klient posiada aktywny pakiet zabiegów</p>
            </div>
            <Switch checked={form.subscription} onCheckedChange={(v) => set("subscription", v)} />
          </div>

          {error && <p className="text-sm text-destructive font-medium text-center">{error}</p>}
        </div>

        <div className="flex gap-3 border-t border-border px-6 py-4 bg-muted/20">
          <Button variant="outline" onClick={onClose} disabled={saving} className="flex-1">Anuluj</Button>
          <Button onClick={handleSave} disabled={saving || !canSave} size="lg" className="flex-1 text-base font-semibold">
            {saving ? "Zapisuję..." : isEdit ? "Zapisz zmiany" : "Dodaj klienta"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
