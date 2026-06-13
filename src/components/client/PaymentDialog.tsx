"use client"

import { useState } from "react"
import {
  IconBuildingStore, IconCheck, IconCreditCard, IconDeviceMobile,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

interface Props {
  open: boolean
  onClose: () => void
  treatment: string
  price: string
  date: string
}

type Step = "method" | "blik" | "card" | "processing" | "done"

const METHODS = [
  {
    id: "blik" as const,
    label: "BLIK",
    description: "6-cyfrowy kod z aplikacji bankowej",
    Icon: IconDeviceMobile,
  },
  {
    id: "card" as const,
    label: "Karta płatnicza",
    description: "Visa, Mastercard, Maestro",
    Icon: IconCreditCard,
  },
  {
    id: "salon" as const,
    label: "W salonie",
    description: "Gotówką lub kartą przy wizycie",
    Icon: IconBuildingStore,
  },
]

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ")
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4)
  return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

export function PaymentDialog({ open, onClose, treatment, price, date }: Props) {
  const [step, setStep] = useState<Step>("method")
  const [blikCode, setBlikCode] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")

  function reset() {
    setStep("method")
    setBlikCode("")
    setCardNumber("")
    setExpiry("")
    setCvv("")
    setCardName("")
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function processPayment() {
    setStep("processing")
    await new Promise((r) => setTimeout(r, 1800))
    setStep("done")
  }

  const cardValid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiry.length === 5 &&
    cvv.length === 3 &&
    cardName.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && step !== "processing") handleClose() }}>
      <DialogContent className="max-w-sm gap-5">
        <DialogHeader>
          <DialogTitle>Płatność za wizytę</DialogTitle>
        </DialogHeader>

        {/* Booking summary */}
        <div className="rounded-xl border border-border/60 bg-card px-4 py-3">
          <div className="font-semibold">{treatment}</div>
          <div className="mt-0.5 flex items-center justify-between text-sm text-muted-foreground">
            <span>{date}</span>
            <span className="text-base font-bold text-primary">{price}</span>
          </div>
        </div>

        {step === "method" && (
          <div className="flex flex-col gap-2">
            {METHODS.map(({ id, label, description, Icon }) => (
              <button
                key={id}
                onClick={() => {
                  if (id === "blik") setStep("blik")
                  else if (id === "card") setStep("card")
                  else setStep("done")
                }}
                className="flex items-center gap-4 rounded-xl border border-border/60 p-4 text-left transition-colors hover:border-primary/60 hover:bg-accent"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={22} />
                </div>
                <div>
                  <div className="font-semibold">{label}</div>
                  <div className="text-xs text-muted-foreground">{description}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === "blik" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Otwórz aplikację swojego banku i wygeneruj kod BLIK.
            </p>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="blik-code">Kod BLIK</Label>
              <Input
                id="blik-code"
                value={blikCode}
                onChange={(e) => setBlikCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000 000"
                className="text-center text-2xl font-bold tracking-[0.4em]"
                inputMode="numeric"
                maxLength={6}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep("method")}>
                Wróć
              </Button>
              <Button className="flex-1" disabled={blikCode.length !== 6} onClick={processPayment}>
                Zatwierdź
              </Button>
            </div>
          </div>
        )}

        {step === "card" && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="card-name">Imię i nazwisko</Label>
              <Input
                id="card-name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Anna Kowalska"
                autoComplete="cc-name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="card-number">Numer karty</Label>
              <Input
                id="card-number"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="0000 0000 0000 0000"
                inputMode="numeric"
                autoComplete="cc-number"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="expiry">Data ważności</Label>
                <Input
                  id="expiry"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/RR"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  placeholder="000"
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setStep("method")}>
                Wróć
              </Button>
              <Button className="flex-1 font-semibold" disabled={!cardValid} onClick={processPayment}>
                Zapłać {price}
              </Button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <Spinner className="h-10 w-10 text-primary" />
            <p className="text-sm text-muted-foreground">Przetwarzam płatność...</p>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary">
              <IconCheck size={32} />
            </div>
            <div className="text-center">
              <p className="font-semibold">Wizyta zarezerwowana!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Do zobaczenia wkrótce w salonie Studio Figura.
              </p>
            </div>
            <Button className="w-full text-base font-semibold" onClick={handleClose}>
              Gotowe
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
