"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IconDeviceMobile, IconSend, IconCircleCheck } from "@tabler/icons-react"
import { auth } from "@/lib/firebase/config"
import type { Client } from "@/lib/firebase/clients"

interface Props {
  client: Client | null
  onClose: () => void
}

const MAX_CHARS = 160

export function ClientSmsDialog({ client, onClose }: Props) {
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle")
  const [error, setError] = useState("")

  const handleClose = () => {
    setMessage("")
    setStatus("idle")
    setError("")
    onClose()
  }

  const handleSend = async () => {
    if (!client?.phone || !message.trim()) return
    setStatus("sending")
    setError("")
    try {
      const token = await auth.currentUser?.getIdToken(true)
      const res = await fetch("/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ to: client.phone, message: message.trim() }),
      })
      const json = await res.json()
      if (!res.ok) {
        setStatus("error")
        setError(json.error ?? "Nieznany błąd")
      } else {
        setStatus("ok")
      }
    } catch {
      setStatus("error")
      setError("Błąd połączenia z serwerem")
    }
  }

  const remaining = MAX_CHARS - message.length
  const overLimit = remaining < 0

  return (
    <Dialog open={!!client} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="bg-primary/10 border-b border-primary/20 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <IconDeviceMobile size={22} className="text-primary" />
              Wyślij SMS
            </DialogTitle>
            {client && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {client.name} {client.surname}
                {client.phone
                  ? <span className="ml-2 font-medium text-foreground">{client.phone}</span>
                  : <span className="ml-2 text-destructive">brak numeru telefonu</span>
                }
              </p>
            )}
          </DialogHeader>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {status === "ok" ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <IconCircleCheck size={44} className="text-green-500" />
              <p className="font-semibold text-green-600">SMS wysłany!</p>
              <p className="text-sm text-muted-foreground">
                Wiadomość dotarła do {client?.name} {client?.surname}.
              </p>
              <Button onClick={handleClose} className="mt-2">Zamknij</Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Treść wiadomości SMS..."
                  rows={5}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
                <p className={`text-xs text-right ${overLimit ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                  {overLimit ? `Przekroczono o ${-remaining} znaków` : `Pozostało ${remaining} znaków`}
                </p>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              {!client?.phone && (
                <p className="text-sm text-destructive text-center">
                  Ten klient nie ma przypisanego numeru telefonu.
                </p>
              )}
            </>
          )}
        </div>

        {status !== "ok" && (
          <div className="flex gap-3 border-t border-border px-6 py-4 bg-muted/20">
            <Button variant="outline" onClick={handleClose} className="flex-1">Anuluj</Button>
            <Button
              onClick={handleSend}
              disabled={!client?.phone || !message.trim() || overLimit || status === "sending"}
              size="lg"
              className="flex-1 text-base font-semibold"
            >
              <IconSend size={18} />
              {status === "sending" ? "Wysyłam..." : "Wyślij SMS"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
