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
  IconUser, IconMail, IconPhone, IconBriefcase,
  IconShield, IconDeviceFloppy, IconArchive, IconTrash, IconAlertTriangle,
} from "@tabler/icons-react"
import { auth } from "@/lib/firebase/config"
import type { Employee } from "@/lib/firebase/schedule"

const POSITIONS = [
  "Kosmetolog",
  "Specjalista modelowania sylwetki",
  "Laser & Depilacja",
  "Recepcjonistka",
  "Manager",
  "Fizjoterapeuta",
]

interface Props {
  employee: Employee | null
  currentUserUid: string | undefined
  onClose: () => void
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

type Confirm = "archive" | "delete" | null

export function EmployeeEditDialog({ employee, currentUserUid, onClose }: Props) {
  const [form, setForm] = useState({ name: "", surname: "", email: "", phone: "", position: "", role: "employee" as "admin" | "employee" })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [confirm, setConfirm] = useState<Confirm>(null)
  const [danger, setDanger] = useState(false)

  const isSelf = !!employee && employee.uid === currentUserUid

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name,
        surname: employee.surname,
        email: employee.email,
        phone: employee.phone,
        position: employee.position,
        role: employee.role,
      })
      setError("")
      setConfirm(null)
      setDanger(false)
    }
  }, [employee])

  const set = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    if (!employee) return
    setError("")
    if (!form.name || !form.surname || !form.email || !form.position) {
      setError("Wypełnij wszystkie wymagane pola.")
      return
    }
    setSaving(true)
    try {
      const token = await auth.currentUser?.getIdToken(true)
      const res = await fetch(`/api/employees/${employee.uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Błąd serwera."); return }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const handleDanger = async (action: "archive" | "delete") => {
    if (!employee) return
    setSaving(true)
    setError("")
    try {
      const token = await auth.currentUser?.getIdToken(true)
      const url = action === "archive"
        ? `/api/employees/${employee.uid}?archive=1`
        : `/api/employees/${employee.uid}`
      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Błąd serwera."); setConfirm(null); return }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={!!employee} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-xl p-0 overflow-hidden">

        <div className="bg-primary/10 border-b border-primary/20 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <IconUser size={22} className="text-primary" />
              Edytuj pracownika
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              {employee?.name} {employee?.surname} &middot; {employee?.position}
            </p>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">

          {/* Dane osobowe */}
          <div className="grid grid-cols-2 gap-4">
            <FieldRow icon={<IconUser size={15} />} label="Imię *">
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} className="h-10" />
            </FieldRow>
            <FieldRow icon={<IconUser size={15} />} label="Nazwisko *">
              <Input value={form.surname} onChange={(e) => set("surname", e.target.value)} className="h-10" />
            </FieldRow>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FieldRow icon={<IconMail size={15} />} label="Email *">
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="h-10" />
            </FieldRow>
            <FieldRow icon={<IconPhone size={15} />} label="Telefon">
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="600 000 000" className="h-10" />
            </FieldRow>
          </div>

          <FieldRow icon={<IconBriefcase size={15} />} label="Stanowisko *">
            <select
              value={form.position}
              onChange={(e) => set("position", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Wybierz stanowisko...</option>
              {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </FieldRow>

          {/* Rola */}
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
              disabled={isSelf}
              onCheckedChange={(v) => setForm((prev) => ({ ...prev, role: v ? "admin" : "employee" }))}
            />
          </div>
          {isSelf && (
            <p className="text-xs text-muted-foreground -mt-3">Nie możesz zmienić własnej roli.</p>
          )}

          {error && <p className="text-sm text-destructive font-medium text-center">{error}</p>}

          {/* Strefa niebezpieczna */}
          {!isSelf && (
            <div className="border border-destructive/30 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setDanger((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <IconAlertTriangle size={15} />
                  Strefa niebezpieczna
                </span>
                <span className="text-xs text-muted-foreground">{danger ? "zwiń" : "rozwiń"}</span>
              </button>

              {danger && (
                <div className="border-t border-destructive/20 px-4 py-4 flex flex-col gap-3 bg-destructive/5">
                  {confirm === null && (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setConfirm("archive")}
                        disabled={saving}
                      >
                        <IconArchive size={14} />
                        Archiwizuj
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-destructive/60 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => setConfirm("delete")}
                        disabled={saving}
                      >
                        <IconTrash size={14} />
                        Usuń konto
                      </Button>
                    </div>
                  )}

                  {confirm === "archive" && (
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-destructive">
                        Pracownik straci dostęp do panelu. Dane pozostaną w systemie i można to cofnąć.
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setConfirm(null)} disabled={saving}>Anuluj</Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleDanger("archive")}
                          disabled={saving}
                        >
                          {saving ? "Archiwizuję..." : "Potwierdź archiwizację"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {confirm === "delete" && (
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-destructive font-medium">
                        Tej operacji nie można cofnąć. Konto zostanie trwale usunięte z Firebase Auth i bazy danych.
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setConfirm(null)} disabled={saving}>Anuluj</Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleDanger("delete")}
                          disabled={saving}
                        >
                          {saving ? "Usuwam..." : "Usuń trwale"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 border-t border-border px-6 py-4 bg-muted/20">
          <Button variant="outline" onClick={onClose} disabled={saving} className="flex-1">Anuluj</Button>
          <Button
            onClick={handleSave}
            disabled={saving || !form.name || !form.surname || !form.email || !form.position}
            size="lg"
            className="flex-1 text-base font-semibold"
          >
            <IconDeviceFloppy size={18} />
            {saving ? "Zapisuję..." : "Zapisz zmiany"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
