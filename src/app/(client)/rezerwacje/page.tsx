"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  IconCalendarHeart, IconCheck, IconChevronLeft, IconChevronRight,
  IconClock, IconSparkles, IconX,
} from "@tabler/icons-react"
import { toast } from "sonner"

import useAuthState from "@/lib/hooks/useAuthState"
import { usePricing } from "@/lib/hooks/usePricing"
import { useClientPortal } from "@/lib/hooks/useClientPortal"
import { useLocale } from "@/components/locale-context"
import {
  addAppointment, cancelAppointment, subscribeDayAppointments,
  parseDuration, parsePrice, type DayAppointment,
} from "@/lib/firebase/appointments"
import { subscribeEmployees, subscribeRangeShifts, type Employee, type Shift } from "@/lib/firebase/schedule"
import { subscribeDevices, type Device } from "@/lib/firebase/devices"
import type { PriceItem } from "@/lib/firebase/pricing"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const SLOTS = Array.from({ length: 20 }, (_, i) => 8 + i * 0.5)
const CLOSING_HOUR = 18

function slotLabel(slot: number) {
  const h = Math.floor(slot)
  const m = Math.round((slot - h) * 60)
  return `${h}:${String(m).padStart(2, "0")}`
}

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

export default function RezerwacjePage() {
  const { profile } = useAuthState()
  const { pricing, loading: pricingLoading } = usePricing()
  const { upcoming } = useClientPortal()
  const { dict } = useLocale()
  const d = dict.client.bookings

  function monthLabel(date: Date) {
    return new Intl.DateTimeFormat(dict.dateLocale, { month: "long", year: "numeric" }).format(date)
  }

  function fullDate(date: Date) {
    return new Intl.DateTimeFormat(dict.dateLocale, {
      weekday: "long", day: "numeric", month: "long",
    }).format(date)
  }

  function formatTime(date: Date) {
    return new Intl.DateTimeFormat(dict.dateLocale, { hour: "2-digit", minute: "2-digit" }).format(date)
  }

  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const monthGrid = useMemo(() => getMonthGrid(viewMonth), [viewMonth])
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [treatment, setTreatment] = useState<PriceItem | null>(null)
  const [day, setDay] = useState<Date | null>(null)
  const [hour, setHour] = useState<number | null>(null)
  const [dayAppointments, setDayAppointments] = useState<DayAppointment[]>([])
  const [dayShifts, setDayShifts] = useState<Shift[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [saving, setSaving] = useState(false)

  const activeCategory = pricing.find((c) => c.id === categoryId) ?? pricing[0]

  useEffect(() => subscribeEmployees(setEmployees), [])
  useEffect(() => subscribeDevices(setDevices), [])

  const preselected = useRef(false)
  useEffect(() => {
    if (preselected.current || pricing.length === 0) return
    const wanted = new URLSearchParams(window.location.search).get("zabieg")
    if (!wanted) { preselected.current = true; return }
    for (const cat of pricing) {
      const item = cat.items.find((i) => i.name === wanted)
      if (item) {
        setCategoryId(cat.id)
        setTreatment(item)
        break
      }
    }
    preselected.current = true
  }, [pricing])

  useEffect(() => {
    if (!day) return
    setHour(null)
    const end = new Date(day)
    end.setHours(23, 59, 59, 999)
    const unsubAppts = subscribeDayAppointments(day, setDayAppointments)
    const unsubShifts = subscribeRangeShifts(day, end, setDayShifts)
    return () => { unsubAppts(); unsubShifts() }
  }, [day])

  const duration = treatment ? parseDuration(treatment.duration) : 0

  const staffAvailable = (slot: number) => {
    if (!treatment) return false
    const end = slot + duration
    return employees.some((emp) => {
      if (!emp.skills.includes(treatment.name)) return false
      const empShifts = dayShifts.filter((s) => s.employeeId === emp.uid)
      if (empShifts.length === 0) return false
      let cursor = slot
      const sorted = [...empShifts].sort((a, b) => a.startHour - b.startHour)
      for (const s of sorted) {
        if (s.startHour <= cursor && cursor < s.endHour) cursor = s.endHour
      }
      return cursor >= end
    })
  }

  const deviceAvailable = (slot: number) => {
    if (!treatment?.device) return true
    const device = devices.find((dv) => dv.id === treatment.device)
    if (!device) return true
    if (!device.active) return false
    const end = slot + duration
    const overlapping = dayAppointments.filter((a) => {
      if (a.device !== treatment.device) return false
      const aStart = a.date.getHours() + a.date.getMinutes() / 60
      const aEnd = aStart + a.duration
      return aStart < end && aEnd > slot
    })
    return overlapping.length < device.count
  }

  const anyStaffToday = treatment
    ? employees.some((emp) =>
        emp.skills.includes(treatment.name) &&
        dayShifts.some((s) => s.employeeId === emp.uid)
      )
    : false

  const slotAvailable = (slot: number) => {
    if (!treatment || !day) return false
    if (slot + duration > CLOSING_HOUR) return false
    const now = new Date()
    const isToday = day.toDateString() === now.toDateString()
    if (isToday && slot <= now.getHours() + now.getMinutes() / 60) return false
    return staffAvailable(slot) && deviceAvailable(slot)
  }

  const canBook = treatment && day && hour !== null && !saving

  async function handleBook() {
    if (!profile || !treatment || !day || hour === null) return
    setSaving(true)
    try {
      const date = new Date(day)
      date.setHours(Math.floor(hour), Math.round((hour - Math.floor(hour)) * 60), 0, 0)
      await addAppointment({
        clientId: profile.uid,
        clientName: profile.displayName ?? "",
        treatment: treatment.name,
        category: activeCategory?.category ?? "",
        date,
        duration: parseDuration(treatment.duration),
        price: parsePrice(treatment.price),
        device: treatment.device ?? "",
      })
      toast.success(d.bookBtn, {
        description: `${treatment.name} — ${fullDate(date)}, ${slotLabel(hour)}`,
      })
      setTreatment(null)
      setDay(null)
      setHour(null)
    } catch {
      toast.error(d.bookingFailed)
    } finally {
      setSaving(false)
    }
  }

  const isToday = (date: Date) => date.toDateString() === new Date().toDateString()

  return (
    <div className="flex flex-col gap-8 pb-28">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{d.h1}</h1>
        <p className="mt-1 text-muted-foreground">{d.subtitle}</p>
      </div>

      {/* Step 1 — treatment */}
      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">1</span>
          {d.step1}
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

      {/* Step 2 — day */}
      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">2</span>
          {d.step2}
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
              {dict.weekdays.map((wd) => (
                <span key={wd} className="py-1 text-xs font-medium uppercase text-muted-foreground">
                  {wd}
                </span>
              ))}
              {monthGrid.map((date) => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const outsideMonth = date.getMonth() !== viewMonth.getMonth()
                const disabled = date < today || date.getDay() === 0 || outsideMonth
                const selected = day?.toDateString() === date.toDateString()
                return (
                  <button
                    key={date.toISOString()}
                    disabled={disabled}
                    onClick={() => setDay(date)}
                    className={cn(
                      "h-12 rounded-lg text-sm font-medium transition-colors",
                      selected
                        ? "bg-primary font-bold text-primary-foreground"
                        : disabled
                          ? outsideMonth
                            ? "text-transparent"
                            : "cursor-not-allowed text-muted-foreground/30"
                          : "hover:bg-accent",
                      isToday(date) && !selected && "ring-1 ring-inset ring-primary text-primary"
                    )}
                  >
                    {date.getDate()}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Step 3 — time */}
      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">3</span>
          {d.step3}
        </h2>
        {!day ? (
          <p className="text-sm text-muted-foreground">{d.noDay}</p>
        ) : !treatment ? (
          <p className="text-sm text-muted-foreground">{d.noTreatment}</p>
        ) : !anyStaffToday ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            {d.noStaff(treatment.name)}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {SLOTS.map((slot) => {
              const available = slotAvailable(slot)
              const selected = hour === slot
              return (
                <button
                  key={slot}
                  disabled={!available}
                  onClick={() => setHour(slot)}
                  className={cn(
                    "rounded-xl border py-2.5 text-sm font-semibold transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : !available
                        ? "cursor-not-allowed border-border/40 text-muted-foreground/40 line-through"
                        : "border-border/60 hover:border-primary/40"
                  )}
                >
                  {slotLabel(slot)}
                </button>
              )
            })}
          </div>
        )}
      </section>

      {/* Your bookings */}
      {upcoming.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <IconCalendarHeart size={22} className="text-primary" />
            {d.yourBookings}
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
                          <AlertDialogTitle>{d.cancelTitle}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {d.cancelDescription(appt.treatment, fullDate(appt.date), formatTime(appt.date))}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{d.cancelKeep}</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-white hover:bg-destructive/90"
                            onClick={async () => {
                              await cancelAppointment(appt.id)
                              toast.success(d.cancelled)
                            }}
                          >
                            {d.cancelConfirm}
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

      {/* Summary bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="min-w-0">
            {treatment ? (
              <>
                <div className="truncate font-semibold">{treatment.name}</div>
                <div className="truncate text-sm capitalize text-muted-foreground">
                  {day ? fullDate(day) : d.chooseDay}
                  {day && (hour !== null ? `, ${slotLabel(hour)}` : `, ${d.chooseTime}`)}
                  {" · "}
                  <span className="font-semibold text-primary">{treatment.price}</span>
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">{d.chooseFirst}</div>
            )}
          </div>
          <Button
            size="lg"
            className="shrink-0 text-base font-semibold"
            disabled={!canBook}
            onClick={handleBook}
          >
            <IconSparkles size={18} />
            {saving ? d.saving : d.bookBtn}
          </Button>
        </div>
      </div>
    </div>
  )
}
