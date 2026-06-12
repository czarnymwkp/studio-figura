"use client"

import { useEffect, useState } from "react"
import { IconCheck, IconCreditCard, IconMessage } from "@tabler/icons-react"

import {
  subscribePlan, setSmsPackage,
  BASE_PLAN_PRICE, SMS_ADDON_PRICE, type StudioPlan,
} from "@/lib/firebase/plan"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function PlanCard() {
  const [plan, setPlan] = useState<StudioPlan | null>(null)

  useEffect(() => subscribePlan(setPlan), [])

  const total = BASE_PLAN_PRICE + (plan?.smsPackage ? SMS_ADDON_PRICE : 0)
  const usagePct = plan ? Math.min((plan.smsUsed / plan.smsLimit) * 100, 100) : 0

  return (
    <Card className="rounded-2xl border border-primary/40">
      <CardHeader className="pb-2 flex flex-row items-center gap-2">
        <IconCreditCard size={18} className="text-primary" />
        <span className="font-semibold">Twój abonament</span>
        <Badge variant="outline" className="ml-auto border-primary/40 text-primary">
          {total} zł/mies.
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Plan Standard</span>
            <span className="text-xs text-muted-foreground">panel, rezerwacje, przypomnienia e-mail</span>
          </div>
          <span className="text-sm font-bold text-primary">{BASE_PLAN_PRICE} zł</span>
        </div>

        {plan?.smsPackage ? (
          <div className="flex flex-col gap-2 rounded-xl border border-green-600/30 bg-green-600/5 p-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <IconMessage size={15} className="text-green-400" />
                Pakiet SMS
                <Badge variant="outline" className="border-green-600/40 text-green-400 text-xs">Aktywny</Badge>
              </span>
              <span className="text-sm font-bold text-green-400">+{SMS_ADDON_PRICE} zł</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${usagePct}%` }} />
              </div>
              <span className="text-xs text-muted-foreground">
                Wykorzystane {plan.smsUsed} z {plan.smsLimit} SMS w tym miesiącu
              </span>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-fit self-end text-xs text-muted-foreground hover:text-destructive">
                  Wyłącz pakiet
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Wyłączyć pakiet SMS?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Klientki przestaną otrzymywać przypomnienia SMS o wizytach.
                    Pakiet przestanie być naliczany od kolejnego okresu rozliczeniowego.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Zostaw</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-white hover:bg-destructive/90"
                    onClick={() => setSmsPackage(false)}
                  >
                    Wyłącz
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 rounded-xl border border-dashed border-border p-3">
            <span className="flex items-center gap-1.5 text-sm font-medium">
              <IconMessage size={15} className="text-primary" />
              Pakiet SMS
              <span className="ml-auto text-sm font-bold text-primary">+{SMS_ADDON_PRICE} zł/mies.</span>
            </span>
            <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
              <li className="flex items-center gap-1.5"><IconCheck size={13} className="text-primary" />Przypomnienia SMS 24h przed wizytą</li>
              <li className="flex items-center gap-1.5"><IconCheck size={13} className="text-primary" />{plan?.smsLimit ?? 300} SMS miesięcznie w cenie</li>
              <li className="flex items-center gap-1.5"><IconCheck size={13} className="text-primary" />Mniej nieodwołanych wizyt</li>
            </ul>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" className="w-full font-semibold">
                  Aktywuj pakiet SMS
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Aktywować pakiet SMS?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Do abonamentu zostanie doliczone {SMS_ADDON_PRICE} zł/mies.
                    W cenie {plan?.smsLimit ?? 300} SMS miesięcznie — przypomnienia wysyłają się automatycznie 24h przed wizytą.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anuluj</AlertDialogCancel>
                  <AlertDialogAction onClick={() => setSmsPackage(true)}>
                    Aktywuj (+{SMS_ADDON_PRICE} zł/mies.)
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
