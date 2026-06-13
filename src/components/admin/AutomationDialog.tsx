"use client"

import { useEffect, useRef, useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { IconDeviceMobile, IconMail, IconDeviceFloppy, IconPlus } from "@tabler/icons-react"
import {
  createAutomation, updateAutomation,
  TRIGGER_LABELS, TRIGGER_DESCRIPTIONS, AUDIENCE_LABELS, TEMPLATE_VARS,
  type Automation, type AutomationChannel, type AutomationTrigger, type AutomationAudience,
} from "@/lib/firebase/automations"

const TRIGGERS: AutomationTrigger[] = [
  "manual", "subscription_expiring", "no_visit", "birthday", "pre_visit",
]
const AUDIENCES: AutomationAudience[] = ["all", "subscribers", "non_subscribers"]
const DAYS_OFFSET_TRIGGERS: AutomationTrigger[] = ["subscription_expiring", "no_visit", "pre_visit"]

const EMPTY = {
  name: "",
  channel: "sms" as AutomationChannel,
  trigger: "manual" as AutomationTrigger,
  daysOffset: 7 as number | null,
  audience: "all" as AutomationAudience,
  message: "",
  subject: "",
  active: true,
}

interface Props {
  open: boolean
  onClose: () => void
  automation?: Automation | null
  defaultChannel?: AutomationChannel
  onDirtyChange?: (dirty: boolean) => void
}

function smsSegments(text: string) {
  const len = text.length
  if (len === 0) return { chars: 0, segments: 0 }
  const segments = len <= 160 ? 1 : Math.ceil(len / 153)
  return { chars: len, segments }
}

const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"

export function AutomationDialog({ open, onClose, automation, defaultChannel, onDirtyChange }: Props) {
  const [form, setForm] = useState(EMPTY)
  const [initialForm, setInitialForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isEdit = !!automation

  useEffect(() => {
    if (!open) return
    setError("")
    const initial = automation ? {
      name: automation.name,
      channel: automation.channel ?? defaultChannel ?? "sms",
      trigger: automation.trigger,
      daysOffset: automation.daysOffset,
      audience: automation.audience,
      message: automation.message,
      subject: automation.subject,
      active: automation.active,
    } : { ...EMPTY, channel: defaultChannel ?? "sms" }
    setForm(initial)
    setInitialForm(initial)
    onDirtyChange?.(false)
  }, [automation, open])

  useEffect(() => {
    if (!open) return
    const dirty = JSON.stringify(form) !== JSON.stringify(initialForm)
    onDirtyChange?.(dirty)
  }, [form, initialForm, open, onDirtyChange])

  const set = <K extends keyof typeof EMPTY>(field: K, value: typeof EMPTY[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const insertVar = (v: string) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const next = form.message.slice(0, start) + v + form.message.slice(end)
    set("message", next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + v.length, start + v.length)
    })
  }

  const handleSave = async () => {
    setError("")
    if (!form.name.trim()) { setError("Podaj nazwę automatyzacji."); return }
    if (!form.message.trim()) { setError("Treść wiadomości nie może być pusta."); return }
    if (form.channel === "email" && !form.subject.trim()) { setError("Podaj temat e-maila."); return }
    if (DAYS_OFFSET_TRIGGERS.includes(form.trigger) && (!form.daysOffset || form.daysOffset < 1)) {
      setError("Podaj liczbę dni (min. 1)."); return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        daysOffset: DAYS_OFFSET_TRIGGERS.includes(form.trigger) ? (form.daysOffset ?? 7) : null,
        subject: form.channel === "email" ? form.subject : "",
      }
      if (isEdit) {
        await updateAutomation(automation.id, payload)
      } else {
        await createAutomation(payload)
      }
      onClose()
    } catch {
      setError("Błąd zapisu. Spróbuj ponownie.")
    } finally {
      setSaving(false)
    }
  }

  const vars = TEMPLATE_VARS[form.trigger]
  const { chars, segments } = smsSegments(form.message)

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">

        {/* Header */}
        <div className="bg-primary/10 border-b border-primary/20 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {isEdit ? <IconDeviceFloppy size={22} className="text-primary" /> : <IconPlus size={22} className="text-primary" />}
              {isEdit ? "Edytuj automatyzację" : "Nowa automatyzacja"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              Skonfiguruj kiedy, do kogo i co zostanie wysłane.
            </p>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">

          {/* Kanał */}
          {!defaultChannel && (
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold uppercase tracking-widest text-primary text-xs">Kanał</Label>
              <div className="grid grid-cols-2 gap-3">
                {(["sms", "email"] as AutomationChannel[]).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => set("channel", ch)}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                      form.channel === ch
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    {ch === "sms"
                      ? <IconDeviceMobile size={18} />
                      : <IconMail size={18} />}
                    {ch === "sms" ? "SMS" : "E-mail"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nazwa */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Nazwa automatyzacji *</Label>
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="np. Przypomnienie o kończącym się karnecie"
              className="h-10"
            />
          </div>

          {/* Wyzwalacz */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Wyzwalacz *</Label>
            <select
              value={form.trigger}
              onChange={(e) => set("trigger", e.target.value as AutomationTrigger)}
              className={selectClass}
            >
              {TRIGGERS.map((t) => (
                <option key={t} value={t}>{TRIGGER_LABELS[t]}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">{TRIGGER_DESCRIPTIONS[form.trigger]}</p>
          </div>

          {/* Ile dni (conditional) */}
          {DAYS_OFFSET_TRIGGERS.includes(form.trigger) && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">
                {form.trigger === "no_visit" ? "Liczba dni od ostatniej wizyty *" : "Liczba dni *"}
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={form.daysOffset ?? ""}
                  onChange={(e) => set("daysOffset", parseInt(e.target.value) || null)}
                  className="h-10 w-32"
                />
                <span className="text-sm text-muted-foreground">
                  {form.trigger === "no_visit"
                    ? `dni po ostatniej wizycie`
                    : form.trigger === "pre_visit"
                    ? `dni przed wizytą`
                    : `dni przed końcem karnetu`}
                </span>
              </div>
            </div>
          )}

          {/* Odbiorcy */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Odbiorcy *</Label>
            <select
              value={form.audience}
              onChange={(e) => set("audience", e.target.value as AutomationAudience)}
              className={selectClass}
            >
              {AUDIENCES.map((a) => (
                <option key={a} value={a}>{AUDIENCE_LABELS[a]}</option>
              ))}
            </select>
          </div>

          {/* Temat (email only) */}
          {form.channel === "email" && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Temat e-maila *</Label>
              <Input
                value={form.subject}
                onChange={(e) => set("subject", e.target.value)}
                placeholder="np. Twój karnet kończy się za kilka dni"
                className="h-10"
              />
            </div>
          )}

          {/* Treść */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Treść wiadomości *</Label>
              {form.channel === "sms" && chars > 0 && (
                <span className="text-xs text-muted-foreground">
                  {chars} znaków · {segments} {segments === 1 ? "SMS" : "SMS-y"}
                </span>
              )}
            </div>

            {/* Zmienne */}
            {vars.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {vars.map(({ var: v, label }) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => insertVar(v)}
                    className="inline-flex items-center rounded-md border border-primary/40 bg-primary/5 px-2 py-0.5 text-xs text-primary hover:bg-primary/15 transition-colors font-mono"
                    title={`Wstaw: ${label}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            )}

            <textarea
              ref={textareaRef}
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              rows={5}
              placeholder={
                form.channel === "sms"
                  ? "Cześć {{imię}}! Twój karnet w Studio Figura kończy się za {{dni_do_końca}} dni. Zapraszamy do odnowienia!"
                  : "Napisz treść e-maila..."
              }
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>

          {/* Aktywna */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
            <div>
              <p className="text-sm font-medium">Aktywna</p>
              <p className="text-xs text-muted-foreground">Automatyzacja będzie działać po zapisaniu</p>
            </div>
            <Switch checked={form.active} onCheckedChange={(v) => set("active", v)} />
          </div>

          {error && <p className="text-sm text-destructive font-medium text-center">{error}</p>}
        </div>

        <div className="flex gap-3 border-t border-border px-6 py-4 bg-muted/20">
          <Button variant="outline" onClick={onClose} disabled={saving} className="flex-1">Anuluj</Button>
          <Button onClick={handleSave} disabled={saving} size="lg" className="flex-1 text-base font-semibold">
            <IconDeviceFloppy size={18} />
            {saving ? "Zapisuję..." : isEdit ? "Zapisz zmiany" : "Utwórz automatyzację"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
