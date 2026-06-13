"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  IconBrandFacebook, IconBrandGoogle, IconBrandStripe,
  IconReceipt2, IconMessage, IconCreditCard, IconDeviceFloppy, IconPlugConnected, IconPlugConnectedX,
  IconSend,
} from "@tabler/icons-react"
import { auth } from "@/lib/firebase/config"
import {
  loadIntegrations, saveIntegration,
  DEFAULT_INTEGRATIONS, type IntegrationsSettings,
} from "@/lib/firebase/settings"

type IntKey = keyof IntegrationsSettings

interface IntegrationMeta {
  key: IntKey
  name: string
  description: string
  icon: React.ReactNode
  fields: { key: string; label: string; placeholder: string; secret?: boolean }[]
}

const INTEGRATIONS: IntegrationMeta[] = [
  {
    key: "wfirma",
    name: "wFirma",
    description: "Wystawianie faktur i synchronizacja klientów z systemem księgowym.",
    icon: <IconReceipt2 size={22} className="text-primary" />,
    fields: [
      { key: "apiKey", label: "API Key", placeholder: "wf_xxxxxxxxxxxxxxxx", secret: true },
      { key: "apiSecret", label: "API Secret", placeholder: "xxxxxxxxxxxxxxxx", secret: true },
    ],
  },
  {
    key: "smsapi",
    name: "SMSAPI",
    description: "Bramka SMS dla automatyzacji — wysyłka przypomnień i powiadomień.",
    icon: <IconMessage size={22} className="text-primary" />,
    fields: [
      { key: "apiToken", label: "Token API", placeholder: "your_token_here", secret: true },
      { key: "sender", label: "Nazwa nadawcy", placeholder: "StudioFigura" },
    ],
  },
  {
    key: "sendgrid",
    name: "SendGrid",
    description: "Bramka e-mail dla automatyzacji i komunikacji z klientami.",
    icon: <IconMessage size={22} className="text-blue-500" />,
    fields: [
      { key: "apiKey", label: "API Key", placeholder: "SG.xxxxxxxxxxxxxxxx", secret: true },
      { key: "fromEmail", label: "Adres nadawcy", placeholder: "kontakt@studiofigura.pl" },
      { key: "fromName", label: "Nazwa nadawcy", placeholder: "Studio Figura" },
    ],
  },
  {
    key: "facebook",
    name: "Facebook / Meta",
    description: "Pixel Facebooka do śledzenia konwersji i reklam.",
    icon: <IconBrandFacebook size={22} className="text-blue-600" />,
    fields: [
      { key: "pixelId", label: "Pixel ID", placeholder: "123456789012345" },
      { key: "accessToken", label: "Access Token", placeholder: "EAAxxxxxxx...", secret: true },
    ],
  },
  {
    key: "google",
    name: "Google Calendar",
    description: "Synchronizacja rezerwacji z Google Calendar.",
    icon: <IconBrandGoogle size={22} className="text-red-500" />,
    fields: [
      { key: "calendarId", label: "Calendar ID", placeholder: "primary lub xxx@group.calendar.google.com" },
    ],
  },
  {
    key: "przelewy24",
    name: "Przelewy24",
    description: "Płatności online w portalu klienta (Blik, karta, przelew).",
    icon: <IconCreditCard size={22} className="text-green-600" />,
    fields: [
      { key: "merchantId", label: "Merchant ID", placeholder: "123456" },
      { key: "apiKey", label: "API Key", placeholder: "xxxxxxxxxxxxxxxx", secret: true },
      { key: "crc", label: "CRC (klucz podpisu)", placeholder: "xxxxxxxxxxxxxxxx", secret: true },
    ],
  },
  {
    key: "stripe",
    name: "Stripe",
    description: "Płatności kartą — alternatywa dla Przelewy24.",
    icon: <IconBrandStripe size={22} className="text-indigo-500" />,
    fields: [
      { key: "publishableKey", label: "Publishable Key", placeholder: "pk_live_xxxxxxxx" },
      { key: "secretKey", label: "Secret Key", placeholder: "sk_live_xxxxxxxx", secret: true },
    ],
  },
]

function mask(val: string): string {
  if (!val || val.length <= 4) return val
  return "••••••••" + val.slice(-4)
}

export function IntegrationsTab() {
  const [data, setData] = useState<IntegrationsSettings>(DEFAULT_INTEGRATIONS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<IntKey | null>(null)
  const [saved, setSaved] = useState<IntKey | null>(null)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [testPhone, setTestPhone] = useState("")
  const [testStatus, setTestStatus] = useState<"idle" | "sending" | "ok" | "error">("idle")
  const [testError, setTestError] = useState("")

  useEffect(() => {
    loadIntegrations().then((d) => { setData(d); setLoading(false) })
  }, [])

  const setField = (intKey: IntKey, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [intKey]: { ...prev[intKey], [field]: value },
    }))
  }

  const handleSave = async (intKey: IntKey) => {
    setSaving(intKey)
    try {
      const entry = data[intKey]
      const connected = Object.entries(entry)
        .filter(([k]) => k !== "connected")
        .some(([, v]) => typeof v === "string" && v.length > 0)
      const updated = { ...entry, connected } as typeof entry
      await saveIntegration(intKey, updated)
      setData((prev) => ({ ...prev, [intKey]: updated }))
      setSaved(intKey)
      setTimeout(() => setSaved(null), 2500)
    } finally {
      setSaving(null)
    }
  }

  const handleDisconnect = async (intKey: IntKey) => {
    const reset = { ...DEFAULT_INTEGRATIONS[intKey], connected: false } as typeof data[typeof intKey]
    await saveIntegration(intKey, reset)
    setData((prev) => ({ ...prev, [intKey]: reset }))
  }

  const handleTestSms = async () => {
    setTestStatus("sending")
    setTestError("")
    try {
      const token = await auth.currentUser?.getIdToken(true)
      const res = await fetch("/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ to: testPhone, message: "Test Studio Figura — połączenie z SMSAPI działa poprawnie." }),
      })
      const json = await res.json()
      if (!res.ok) { setTestStatus("error"); setTestError(json.error ?? "Nieznany błąd") }
      else { setTestStatus("ok"); setTimeout(() => setTestStatus("idle"), 4000) }
    } catch {
      setTestStatus("error")
      setTestError("Błąd połączenia z serwerem")
    }
  }

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1,2,3,4].map(i => <div key={i} className="h-48 rounded-2xl border border-border bg-muted/20 animate-pulse" />)}
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {INTEGRATIONS.map(({ key, name, description, icon, fields }) => {
        const entry = data[key]
        const isSaving = saving === key
        const isSaved = saved === key

        return (
          <div key={key} className="flex flex-col gap-4 rounded-2xl border border-border p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="font-semibold text-sm">{name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>
              </div>
              <Badge
                className={entry.connected
                  ? "bg-green-600/15 text-green-500 border-green-600/20 hover:bg-green-600/15 shrink-0"
                  : "shrink-0"}
                variant={entry.connected ? undefined : "outline"}
              >
                {entry.connected ? "Połączone" : "Niepołączone"}
              </Badge>
            </div>

            <div className="flex flex-col gap-3">
              {fields.map(({ key: fk, label, placeholder, secret }) => {
                const val = (entry as Record<string, string | boolean>)[fk] as string ?? ""
                const revealKey = `${key}.${fk}`
                const isRevealed = revealed.has(revealKey)

                return (
                  <div key={fk} className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium">{label}</Label>
                    <div className="flex gap-2">
                      <Input
                        type={secret && !isRevealed ? "password" : "text"}
                        value={val}
                        onChange={(e) => setField(key, fk, e.target.value)}
                        placeholder={placeholder}
                        className="h-9 text-xs"
                      />
                      {secret && val && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-9 px-2 text-xs shrink-0"
                          onClick={() => setRevealed((prev) => {
                            const next = new Set(prev)
                            next.has(revealKey) ? next.delete(revealKey) : next.add(revealKey)
                            return next
                          })}
                        >
                          {isRevealed ? "Ukryj" : "Pokaż"}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-2 pt-1">
              {entry.connected && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleDisconnect(key)}
                >
                  <IconPlugConnectedX size={14} />
                  Odłącz
                </Button>
              )}
              <Button
                size="sm"
                className="ml-auto"
                onClick={() => handleSave(key)}
                disabled={isSaving}
              >
                {entry.connected
                  ? <><IconDeviceFloppy size={14} />{isSaving ? "Zapisuję..." : isSaved ? "Zapisano!" : "Zapisz"}</>
                  : <><IconPlugConnected size={14} />{isSaving ? "Łączę..." : "Połącz"}</>}
              </Button>
            </div>

            {key === "smsapi" && entry.connected && (
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <p className="text-xs font-medium text-muted-foreground">Wyślij testowego SMS</p>
                <div className="flex gap-2">
                  <Input
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="+48 600 000 000"
                    className="h-9 text-xs"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    disabled={testStatus === "sending" || !testPhone.trim()}
                    onClick={handleTestSms}
                  >
                    <IconSend size={14} />
                    {testStatus === "sending" ? "Wysyłam..." : testStatus === "ok" ? "Wysłano!" : "Wyślij test"}
                  </Button>
                </div>
                {testStatus === "error" && (
                  <p className="text-xs text-destructive">{testError}</p>
                )}
                {testStatus === "ok" && (
                  <p className="text-xs text-green-600">SMS wysłany pomyślnie.</p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
