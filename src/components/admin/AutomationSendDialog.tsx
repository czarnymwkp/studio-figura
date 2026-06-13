"use client"

import { useEffect, useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  IconDeviceMobile, IconMail, IconUsers, IconPlayerPlay,
  IconCircleCheck, IconAlertTriangle,
} from "@tabler/icons-react"
import { auth } from "@/lib/firebase/config"
import { subscribeClients, type Client } from "@/lib/firebase/clients"
import { markAutomationRun, TRIGGER_LABELS, AUDIENCE_LABELS, type Automation } from "@/lib/firebase/automations"

interface Props {
  automation: Automation | null
  onClose: () => void
}

// Filtruje klientów wg odbiorców i wyzwalacza
function filterClients(clients: Client[], automation: Automation): Client[] {
  const today = new Date()

  let list = [...clients]

  if (automation.audience === "subscribers") {
    list = list.filter((c) => c.subscription)
  } else if (automation.audience === "non_subscribers") {
    list = list.filter((c) => !c.subscription)
  }

  const days = automation.daysOffset ?? 0

  if (automation.trigger === "subscription_expiring") {
    list = list.filter((c) => {
      if (!c.nextVisit) return false
      const diff = Math.ceil((new Date(c.nextVisit).getTime() - today.getTime()) / 86400000)
      return diff >= 0 && diff <= days
    })
  } else if (automation.trigger === "no_visit") {
    list = list.filter((c) => {
      if (!c.lastVisit) return false
      const diff = Math.floor((today.getTime() - new Date(c.lastVisit).getTime()) / 86400000)
      return diff >= days
    })
  } else if (automation.trigger === "pre_visit") {
    list = list.filter((c) => {
      if (!c.nextVisit) return false
      const diff = Math.ceil((new Date(c.nextVisit).getTime() - today.getTime()) / 86400000)
      return diff === days
    })
  }
  // manual / birthday: wszyscy z listy audience

  return list
}

// Podstawia zmienne w treści
function renderMessage(template: string, client: Client): string {
  const today = new Date()

  const daysUntilNext = client.nextVisit
    ? Math.ceil((new Date(client.nextVisit).getTime() - today.getTime()) / 86400000)
    : null

  const daysSinceLast = client.lastVisit
    ? Math.floor((today.getTime() - new Date(client.lastVisit).getTime()) / 86400000)
    : null

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" })

  return template
    .replace(/\{\{imię\}\}/g, client.name)
    .replace(/\{\{nazwisko\}\}/g, client.surname)
    .replace(/\{\{data_karnetu\}\}/g, client.nextVisit ? fmt(client.nextVisit) : "—")
    .replace(/\{\{dni_do_końca\}\}/g, daysUntilNext !== null ? String(daysUntilNext) : "—")
    .replace(/\{\{data_wizyty\}\}/g, client.nextVisit ? fmt(client.nextVisit) : "—")
    .replace(/\{\{godzina_wizyty\}\}/g, "—")
    .replace(/\{\{dni_od_wizyty\}\}/g, daysSinceLast !== null ? String(daysSinceLast) : "—")
}

export function AutomationSendDialog({ automation, onClose }: Props) {
  const [allClients, setAllClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(true)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendResult, setSendResult] = useState<{ ok: number; failed: number } | null>(null)

  useEffect(() => {
    if (!automation) return
    setSent(false)
    const unsub = subscribeClients((clients) => {
      setAllClients(clients)
      setLoadingClients(false)
    })
    return unsub
  }, [automation])

  if (!automation) return null

  const recipients = filterClients(allClients, automation)

  const handleSend = async () => {
    if (!automation) return
    setSending(true)
    setSendResult(null)
    try {
      const token = await auth.currentUser?.getIdToken(true)
      const toSend = recipients.filter((c) => c.phone)

      let ok = 0
      let failed = 0
      for (const client of toSend) {
        const message = renderMessage(automation.message, client)
        try {
          const res = await fetch("/api/sms/send", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ to: client.phone, message }),
          })
          if (res.ok) ok++
          else failed++
        } catch {
          failed++
        }
      }

      await markAutomationRun(automation.id)
      setSendResult({ ok, failed })
      setSent(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={!!automation} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">

        {/* Header */}
        <div className="bg-primary/10 border-b border-primary/20 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {automation.channel === "sms"
                ? <IconDeviceMobile size={22} className="text-primary" />
                : <IconMail size={22} className="text-primary" />}
              {automation.name}
            </DialogTitle>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="outline" className="border-primary/40 text-primary text-xs">
                {automation.channel === "sms" ? "SMS" : "E-mail"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {TRIGGER_LABELS[automation.trigger]}
                {automation.daysOffset ? ` — ${automation.daysOffset} dni` : ""}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {AUDIENCE_LABELS[automation.audience]}
              </Badge>
            </div>
          </DialogHeader>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5 max-h-[60vh] overflow-y-auto">

          {/* Treść szablonu */}
          <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Szablon wiadomości</p>
            <p className="text-sm whitespace-pre-wrap">{automation.message}</p>
          </div>

          {/* Lista odbiorców */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <IconUsers size={16} className="text-muted-foreground" />
              <p className="text-sm font-semibold">
                {loadingClients ? "Wczytuję klientów..." : `Odbiorcy (${recipients.length})`}
              </p>
            </div>

            {loadingClients ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-xl border border-border bg-muted/20 animate-pulse" />
                ))}
              </div>
            ) : recipients.length === 0 ? (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-border px-4 py-4">
                <IconAlertTriangle size={18} className="text-muted-foreground shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Brak klientów spełniających kryteria tej automatyzacji w tej chwili.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {recipients.map((client) => (
                  <div key={client.id} className="rounded-xl border border-border bg-card px-4 py-3">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <p className="text-sm font-semibold">{client.name} {client.surname}</p>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {automation.channel === "sms" ? client.phone || "brak tel." : client.email}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 whitespace-pre-wrap">
                      {renderMessage(automation.message, client)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wysłano */}
          {sent && sendResult && (
            <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${sendResult.failed === 0 ? "border-green-600/30 bg-green-600/10" : "border-orange-500/30 bg-orange-500/10"}`}>
              <IconCircleCheck size={18} className={`shrink-0 mt-0.5 ${sendResult.failed === 0 ? "text-green-500" : "text-orange-500"}`} />
              <div className="text-sm">
                <p className={`font-semibold ${sendResult.failed === 0 ? "text-green-600" : "text-orange-600"}`}>
                  Wysłano {sendResult.ok} z {sendResult.ok + sendResult.failed} SMS-ów
                </p>
                {sendResult.failed > 0 && (
                  <p className="text-muted-foreground mt-0.5">
                    {sendResult.failed} {sendResult.failed === 1 ? "wiadomość nie dotarła" : "wiadomości nie dotarły"} — sprawdź numery telefonów klientów.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 border-t border-border px-6 py-4 bg-muted/20">
          <Button variant="outline" onClick={onClose} className="flex-1">Zamknij</Button>
          {!sent && (
            <Button
              onClick={handleSend}
              disabled={sending || loadingClients || recipients.length === 0}
              size="lg"
              className="flex-1 text-base font-semibold"
            >
              <IconPlayerPlay size={18} />
              {sending
                ? "Wysyłam..."
                : `Wyślij do ${recipients.length} ${recipients.length === 1 ? "klientki" : "klientek"}`}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
