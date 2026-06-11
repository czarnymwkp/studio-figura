"use client"

import { useEffect, useMemo, useState } from "react"
import {
  IconCalendarHeart, IconCheck, IconChevronLeft, IconChevronRight,
  IconClock, IconSparkles, IconX,
} from "@tabler/icons-react"
import { toast } from "sonner"

import useAuthState from "@/lib/hooks/useAuthState"
import { usePricing } from "@/lib/hooks/usePricing"
import { useClientPortal } from "@/lib/hooks/useClientPortal"
import {
  addAppointment, cancelAppointment, subscribeDayAppointments,
  parseDuration, parsePrice,
} from "@/lib/firebase/appointments"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
const WEEKDAYS = ["pn", "wt", "śr", "cz", "pt", "so", "nd"]

/** Pełna siatka miesiąca — od poniedziałku pierwszego tygodnia do niedzieli ostatniego. */
function getMonthGrid(viewMonth: Date): Date[] {
  const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1)
  const start = new Date(first)
  start.setDate(first.getDate() - ((first.getDay() + 6) % 7))
  const days: Date[] = []
  const d = new Date(start)
  do {
    days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  } while (d.getMonth() === viewMonth.getMonth() || days.length % 7 !== 0)
  return days
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric" }).format(date)
}

function fullDate(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long", day: "numeric", month: "long",
  }).format(date)
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", { hour: "2-digit", minute: "2-digit" }).format(date)
}

export default function RezerwacjePage() {
  const { profile } = useAuthState()
  const { pricing, loading: pricingLoading } = usePricing()
  const { upcoming } = useClientPortal()

  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const monthGrid = useMemo(() => getMonthGrid(viewMonth), [viewMonth])
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [treatment, setTreatment] = useState<{ name: string; duration: string; price: string } | null>(null)
  const [day, setDay] = useState<Date | null>(null)
  const [hour, setHour] = useState<number | null>(null)
  const [takenHours, setTakenHours] = useState<number[]>([])
  const [saving, setSaving] = useState(false)

  const activeCategory = pricing.find((c) => c.id === categoryId) ?? pricing[0]

  useEffect(() => {
    if (!day) return
    setHour(null)
    return subscribeDayAppointments(day, setTakenHours)
  }, [day])

  const canBook = treatment && day && hour !== null && !saving

  async function handleBook() {
    if (!profile || !treatment || !day || hour === null) return
    setSaving(true)
    try {
      const date = new Date(day)
      date.setHours(hour, 0, 0, 0)
      await addAppointment({
        clientId: profile.uid,
        clientName: profile.displayName ?? "",
        treatment: treatment.name,
        category: activeCategory?.category ?? "",
        date,
        duration: parseDuration(treatment.duration),
        price: parsePrice(treatment.price),
      })
      toast.success("Wizyta zarezerwowana", {
        description: `${treatment.name} — ${fullDate(date)}, ${hour}:00`,
      })
      setTreatment(null)
      setDay(null)
      setHour(null)
    } catch {
      toast.error("Nie udało się zarezerwować wizyty. Spróbuj ponownie.")
    } finally {
      setSaving(false)
    }
  }

  const isToday = (d: Date) => d.toDateString() === new Date().toDateString()

  return (
    <div className="flex flex-col gap-8 pb-28">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rezerwacja wizyty</h1>
        <p className="mt-1 text-muted-foreground">
          Wybierz zabieg, dzień i godzinę — resztą zajmiemy się my.
        </p>
      </div>

      {/* Krok 1 — zabieg */}
      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">1</span>
          Wybierz zabieg
        </h2>

        {pricingLoading ? (
          <Skeleton className="h-40 rounded-xl" />
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {pricing.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setCategoryId(cat.id); setTreatment(null) }}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    activeCategory?.id === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {activeCategory?.items.map((item) => {
                const selected = treatment?.name === item.name
                return (
                  <button
                    key={item.name}
                    onClick={() => setTreatment(item)}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors",
                      selected
                        ? "border-primary bg-primary/10"
                        : "border-border/60 hover:border-primary/40"
                    )}
                  >
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <IconClock size={14} />
                        {item.duration}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">{item.price}</span>
                      {selected && <IconCheck size={18} className="text-primary" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </section>

      {/* Krok 2 — dzień */}
      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">2</span>
          Wybierz dzień
        </h2>
        <Card className="border-border/60 p-0">
          <CardContent className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                disabled={viewMonth <= new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
                onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
              >
                <IconChevronLeft size={18} />
              </Button>
              <span className="font-semibold capitalize">{monthLabel(viewMonth)}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
              >
                <IconChevronRight size={18} />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((wd) => (
                <span key={wd} className="py-1 text-xs font-medium uppercase text-muted-foreground">
                  {wd}
                </span>
              ))}
              {monthGrid.map((d) => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const outsideMonth = d.getMonth() !== viewMonth.getMonth()
                const disabled = d < today || d.getDay() === 0 || outsideMonth
                const selected = day?.toDateString() === d.toDateString()
                return (
                  <button
                    key={d.toISOString()}
                    disabled={disabled}
                    onClick={() => setDay(d)}
                    className={cn(
                      "h-12 rounded-lg text-sm font-medium transition-colors",
                      selected
                        ? "bg-primary font-bold text-primary-foreground"
                        : disabled
                          ? outsideMonth
                            ? "text-transparent"
                            : "cursor-not-allowed text-muted-foreground/30"
                          : "hover:bg-accent",
                      isToday(d) && !selected && "ring-1 ring-inset ring-primary text-primary"
                    )}
                  >
                    {d.getDate()}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Krok 3 — godzina */}
      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">3</span>
          Wybierz godzinę
        </h2>
        {!day ? (
          <p className="text-sm text-muted-foreground">Najpierw wybierz dzień.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {HOURS.map((h) => {
              const past = isToday(day) && h <= new Date().getHours()
              const taken = takenHours.includes(h)
              const disabled = past || taken
              const selected = hour === h
              return (
                <button
                  key={h}
                  disabled={disabled}
                  onClick={() => setHour(h)}
                  className={cn(
                    "rounded-xl border py-2.5 text-sm font-semibold transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : disabled
                        ? "cursor-not-allowed border-border/40 text-muted-foreground/40 line-through"
                        : "border-border/60 hover:border-primary/40"
                  )}
                >
                  {h}:00
                </button>
              )
            })}
          </div>
        )}
      </section>

      {/* Twoje rezerwacje */}
      {upcoming.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <IconCalendarHeart size={22} className="text-primary" />
            Twoje rezerwacje
          </h2>
          <div className="flex flex-col gap-2">
            {upcoming.map((appt) => (
              <Card key={appt.id} className="border-border/60 p-0">
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <div className="font-semibold">{appt.treatment}</div>
                    <div className="text-sm capitalize text-muted-foreground">
                      {fullDate(appt.date)}, {formatTime(appt.date)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary">{appt.price} zł</span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                          <IconX size={18} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Odwołać wizytę?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {appt.treatment} — {fullDate(appt.date)}, {formatTime(appt.date)}.
                            Tej operacji nie można cofnąć.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Zostaw</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-white hover:bg-destructive/90"
                            onClick={async () => {
                              await cancelAppointment(appt.id)
                              toast.success("Wizyta odwołana")
                            }}
                          >
                            Odwołaj wizytę
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Pasek podsumowania */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="min-w-0">
            {treatment ? (
              <>
                <div className="truncate font-semibold">{treatment.name}</div>
                <div className="truncate text-sm capitalize text-muted-foreground">
                  {day ? fullDate(day) : "wybierz dzień"}
                  {day && (hour !== null ? `, ${hour}:00` : ", wybierz godzinę")}
                  {" · "}
                  <span className="font-semibold text-primary">{treatment.price}</span>
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                Wybierz zabieg, dzień i godzinę, aby zarezerwować wizytę.
              </div>
            )}
          </div>
          <Button
            size="lg"
            className="shrink-0 text-base font-semibold"
            disabled={!canBook}
            onClick={handleBook}
          >
            <IconSparkles size={18} />
            {saving ? "Rezerwuję..." : "Zarezerwuj"}
          </Button>
        </div>
      </div>
    </div>
  )
}
