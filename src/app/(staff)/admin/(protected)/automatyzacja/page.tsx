"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  IconPlus, IconPencil, IconTrash, IconRobot,
  IconDeviceMobile, IconMail, IconBellRinging,
  IconClock, IconGift, IconChevronRight, IconArrowLeft, IconPlayerPlay,
} from "@tabler/icons-react"
import {
  subscribeAutomations, toggleAutomation, deleteAutomation,
  TRIGGER_LABELS, AUDIENCE_LABELS,
  type Automation, type AutomationChannel,
} from "@/lib/firebase/automations"
import { AutomationDialog } from "@/components/admin/AutomationDialog"
import { AutomationSendDialog } from "@/components/admin/AutomationSendDialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Category {
  channel: AutomationChannel | null
  icon: React.ElementType
  title: string
  description: string
  available: boolean
}

const CATEGORIES: Category[] = [
  {
    channel: "sms",
    icon: IconDeviceMobile,
    title: "Automatyzacja SMS",
    description: "Potwierdzenie rezerwacji, przypomnienie przed wizytą, koniec karnetu.",
    available: true,
  },
  {
    channel: "email",
    icon: IconMail,
    title: "Automatyzacja e-mail",
    description: "Powitanie nowego klienta, follow-up po zabiegu, oferty specjalne.",
    available: true,
  },
  {
    channel: null,
    icon: IconBellRinging,
    title: "Powiadomienia push",
    description: "Powiadomienia dla klientów z aplikacji mobilnej.",
    available: false,
  },
  {
    channel: null,
    icon: IconClock,
    title: "Przypomnienia cykliczne",
    description: "Automatyczne wiadomości po upływie określonego czasu.",
    available: false,
  },
  {
    channel: null,
    icon: IconGift,
    title: "Kampanie promocyjne",
    description: "Wysyłka ofert do wybranych segmentów klientów.",
    available: false,
  },
]

function triggerSummary(a: Automation): string {
  const label = TRIGGER_LABELS[a.trigger]
  if (a.trigger === "subscription_expiring") return `${label} — ${a.daysOffset} dni przed`
  if (a.trigger === "no_visit") return `${label} — po ${a.daysOffset} dniach`
  if (a.trigger === "pre_visit") return `${label} — ${a.daysOffset} dni wcześniej`
  return label
}

function lastRunLabel(iso: string | null): string {
  if (!iso) return "Nigdy"
  return new Date(iso).toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export default function AutomatyzacjaPage() {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeChannel, setActiveChannel] = useState<AutomationChannel | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogDirty, setDialogDirty] = useState(false)
  const [editTarget, setEditTarget] = useState<Automation | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Automation | null>(null)
  const [sendTarget, setSendTarget] = useState<Automation | null>(null)
  const [leaveConfirm, setLeaveConfirm] = useState(false)

  useEffect(() => {
    const handler = () => {
      if (dialogOpen && dialogDirty) {
        setLeaveConfirm(true)
      } else {
        setDialogOpen(false)
        setActiveChannel(null)
        setSendTarget(null)
      }
    }
    window.addEventListener("automatyzacja:reset", handler)
    return () => window.removeEventListener("automatyzacja:reset", handler)
  }, [dialogOpen, dialogDirty])

  useEffect(() => {
    return subscribeAutomations((data) => {
      setAutomations(data)
      setLoading(false)
    })
  }, [])

  const openNew = () => { setEditTarget(null); setDialogOpen(true) }
  const openEdit = (a: Automation) => { setEditTarget(a); setDialogOpen(true) }

  const filtered = activeChannel ? automations.filter((a) => a.channel === activeChannel) : []
  const activeCategory = CATEGORIES.find((c) => c.channel === activeChannel)

  // — Widok listy dla wybranego kanału —
  if (activeChannel) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setActiveChannel(null)}>
              <IconArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{activeCategory?.title}</h1>
              <p className="text-sm text-muted-foreground">{activeCategory?.description}</p>
            </div>
          </div>
          <Button size="lg" className="text-base font-semibold px-6" onClick={openNew}>
            <IconPlus size={20} />
            Nowa automatyzacja
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <div key={i} className="h-20 rounded-2xl border border-border bg-muted/20 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-14 text-center">
            <div className="size-14 rounded-2xl bg-primary/15 flex items-center justify-center">
              {activeChannel === "sms"
                ? <IconDeviceMobile size={28} className="text-primary" />
                : <IconMail size={28} className="text-primary" />}
            </div>
            <div>
              <p className="font-semibold">Brak automatyzacji</p>
              <p className="text-sm text-muted-foreground mt-1">Dodaj pierwszą regułę dla tego kanału.</p>
            </div>
            <Button onClick={openNew}>
              <IconPlus size={16} />
              Dodaj automatyzację
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((a) => (
              <div key={a.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4">
                <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                  a.channel === "sms" ? "bg-primary/10" : "bg-blue-500/10"
                }`}>
                  {a.channel === "sms"
                    ? <IconDeviceMobile size={18} className="text-primary" />
                    : <IconMail size={18} className="text-blue-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{a.name}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">{triggerSummary(a)}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{AUDIENCE_LABELS[a.audience]}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">Ostatnio: {lastRunLabel(a.lastRunAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Switch checked={a.active} onCheckedChange={(v) => toggleAutomation(a.id, v)} />
                  <Button
                    size="icon" variant="ghost"
                    className="size-8 text-primary hover:text-primary hover:bg-primary/10"
                    title="Podgląd i wysyłka"
                    onClick={() => setSendTarget(a)}
                  >
                    <IconPlayerPlay size={15} />
                  </Button>
                  <Button size="icon" variant="ghost" className="size-8" onClick={() => openEdit(a)}>
                    <IconPencil size={15} />
                  </Button>
                  <Button
                    size="icon" variant="ghost"
                    className="size-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(a)}
                  >
                    <IconTrash size={15} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <AutomationDialog
          open={dialogOpen}
          onClose={() => { setDialogOpen(false); setDialogDirty(false) }}
          automation={editTarget}
          defaultChannel={activeChannel}
          onDirtyChange={setDialogDirty}
        />

        <AutomationSendDialog
          automation={sendTarget}
          onClose={() => setSendTarget(null)}
        />

        <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Usunąć automatyzację?</AlertDialogTitle>
              <AlertDialogDescription>
                Czy na pewno chcesz usunąć <strong>{deleteTarget?.name}</strong>? Tej operacji nie można cofnąć.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Anuluj</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => { if (deleteTarget) deleteAutomation(deleteTarget.id); setDeleteTarget(null) }}
              >
                Usuń
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={leaveConfirm} onOpenChange={(v) => !v && setLeaveConfirm(false)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Niezapisane zmiany</AlertDialogTitle>
              <AlertDialogDescription>
                Masz niezapisane zmiany w tej automatyzacji. Czy chcesz opuścić edycję bez zapisywania?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Wróć do edycji</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  setLeaveConfirm(false)
                  setDialogOpen(false)
                  setDialogDirty(false)
                  setActiveChannel(null)
                  setSendTarget(null)
                }}
              >
                Odrzuć zmiany
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }

  // — Widok kart kategorii —
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Automatyzacja</h1>
      </div>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-8 text-center">
        <div className="size-14 rounded-2xl bg-primary/15 flex items-center justify-center">
          <IconRobot size={30} className="text-primary" />
        </div>
        <p className="font-semibold text-lg">Wybierz kanał automatyzacji</p>
        <p className="text-sm text-muted-foreground max-w-md">
          Automatyczne wiadomości wysyłane do klientów na podstawie zdarzeń lub harmonogramu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {CATEGORIES.map(({ channel, icon: Icon, title, description, available }) => {
          const count = channel ? automations.filter((a) => a.channel === channel).length : 0
          const activeCount = channel ? automations.filter((a) => a.channel === channel && a.active).length : 0

          return (
            <button
              key={title}
              disabled={!available}
              onClick={() => channel && setActiveChannel(channel)}
              className={`group flex items-start gap-4 rounded-2xl border p-5 text-left transition-all ${
                available
                  ? "border-border hover:border-primary/50 hover:bg-primary/5 hover:shadow-md cursor-pointer"
                  : "border-border bg-muted/20 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon size={22} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm">{title}</p>
                  {available && (
                    <IconChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
                {available && !loading && (
                  <div className="flex items-center gap-2 mt-3">
                    {count > 0 ? (
                      <>
                        <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                          {count} {count === 1 ? "reguła" : "reguły"}
                        </Badge>
                        {activeCount > 0 && (
                          <Badge className="text-xs bg-green-600/15 text-green-500 border-green-600/20 hover:bg-green-600/15">
                            {activeCount} aktywne
                          </Badge>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">Brak reguł — kliknij, aby dodać</span>
                    )}
                  </div>
                )}
                {!available && (
                  <Badge variant="outline" className="mt-3 text-xs">Wkrótce</Badge>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
