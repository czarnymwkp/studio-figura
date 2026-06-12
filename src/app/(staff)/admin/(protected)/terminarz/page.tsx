"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { IconCheck, IconChevronLeft, IconChevronRight, IconNote, IconX } from "@tabler/icons-react"
import {
  subscribeRangeAppointments, rescheduleAppointment, cancelAppointment,
  updateAppointmentNote, completeAppointment, pointsForPrice,
  type WeekAppointment,
} from "@/lib/firebase/appointments"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8)
const VISIBLE_DAYS = 6
const CELL_HEIGHT = 96 // 1h = 96px, kwadrans = 24px

function timeLabel(date: Date) {
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`
}

const CATEGORY_COLORS: Record<string, string> = {
  "Depilacja laserowa":   "bg-primary/20 border-primary/50 text-primary",
  "Zabiegi na twarz":     "bg-blue-500/20 border-blue-500/50 text-blue-400",
  "Modelowanie sylwetki": "bg-green-500/20 border-green-500/50 text-green-400",
  "Masaże i relaks":      "bg-purple-500/20 border-purple-500/50 text-purple-400",
}
const FALLBACK_COLOR = "bg-zinc-500/20 border-zinc-500/50 text-zinc-300"

const LEGEND = [
  { label: "Depilacja laserowa", color: CATEGORY_COLORS["Depilacja laserowa"], dot: "bg-primary" },
  { label: "Zabiegi na twarz", color: CATEGORY_COLORS["Zabiegi na twarz"], dot: "bg-blue-400" },
  { label: "Modelowanie sylwetki", color: CATEGORY_COLORS["Modelowanie sylwetki"], dot: "bg-green-400" },
  { label: "Masaże i relaks", color: CATEGORY_COLORS["Masaże i relaks"], dot: "bg-purple-400" },
]

/** "czerwiec 2026" albo "czerwiec – lipiec 2026" gdy tydzień przechodzi przez dwa miesiące. */
function weekMonthLabel(dates: Date[]) {
  const fmt = (d: Date, withYear: boolean) =>
    new Intl.DateTimeFormat("pl-PL", { month: "long", ...(withYear && { year: "numeric" }) }).format(d)
  const first = dates[0]
  const last = dates[5]
  if (first.getMonth() === last.getMonth()) return fmt(first, true)
  return `${fmt(first, false)} – ${fmt(last, true)}`
}

/** 6 dni roboczych (bez niedziel) zaczynając od dziś; offset przesuwa o tydzień. */
function getVisibleDates(offset: number) {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() + offset * 7)
  const days: Date[] = []
  const d = new Date(start)
  while (days.length < VISIBLE_DAYS) {
    if (d.getDay() !== 0) days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

function weekdayName(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", { weekday: "long" }).format(date)
}

export default function TerminarzPage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [appointments, setAppointments] = useState<WeekAppointment[]>([])
  const [nextWeekCount, setNextWeekCount] = useState(0)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [toCancel, setToCancel] = useState<WeekAppointment | null>(null)
  const [noteAppt, setNoteAppt] = useState<WeekAppointment | null>(null)
  const [noteText, setNoteText] = useState("")
  const [savingNote, setSavingNote] = useState(false)
  const justDragged = useRef(false)
  const dates = useMemo(() => getVisibleDates(weekOffset), [weekOffset])
  const nextDates = useMemo(() => getVisibleDates(weekOffset + 1), [weekOffset])

  useEffect(() => {
    const start = dates[0]
    const end = new Date(dates[5])
    end.setHours(23, 59, 59, 999)
    return subscribeRangeAppointments(start, end, setAppointments)
  }, [dates])

  useEffect(() => {
    const start = nextDates[0]
    const end = new Date(nextDates[5])
    end.setHours(23, 59, 59, 999)
    return subscribeRangeAppointments(start, end, (appts) =>
      setNextWeekCount(appts.filter((a) => a.status !== "cancelled").length)
    )
  }, [nextDates])

  const visible = appointments.filter((a) => a.status !== "cancelled")

  const dayIndexOf = (date: Date) =>
    dates.findIndex((d) => d.toDateString() === date.toDateString())

  const handleDropOnCell = async (day: number, hour: number, quarter: number) => {
    if (draggingId === null) return
    const appt = appointments.find((a) => a.id === draggingId)
    setDraggingId(null)
    if (!appt) return
    const newDate = new Date(dates[day])
    newDate.setHours(hour, quarter * 15, 0, 0)
    await rescheduleAppointment(appt.id, newDate)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Terminarz</h1>
        <div className="flex items-center gap-2">
          {nextWeekCount > 0 && (
            <button
              onClick={() => setWeekOffset(w => w + 1)}
              className="mr-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/25"
            >
              Przyszły tydzień: {nextWeekCount} {nextWeekCount === 1 ? "wizyta" : nextWeekCount < 5 ? "wizyty" : "wizyt"}
            </button>
          )}
          <Button variant="outline" size="icon" className="size-8" onClick={() => setWeekOffset(w => w - 1)}>
            <IconChevronLeft size={16} />
          </Button>
          <span className="min-w-36 text-center font-semibold capitalize">{weekMonthLabel(dates)}</span>
          <Button variant="outline" size="icon" className="size-8 relative" onClick={() => setWeekOffset(w => w + 1)}>
            <IconChevronRight size={16} />
            {nextWeekCount > 0 && (
              <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-primary" />
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setWeekOffset(0)}>Dzisiaj</Button>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/40 overflow-hidden">
        {/* Header + grid w jednym kontenerze przewijania — kolumny zawsze równe */}
        <div className="overflow-y-auto max-h-[calc(100vh-320px)]">
          <div className="sticky top-0 z-20 bg-background">
            <div className="grid border-b border-border bg-primary/10" style={{ gridTemplateColumns: "4rem repeat(6, 1fr)" }}>
              <div className="border-r border-border" />
              {dates.map((date) => (
                <div key={date.toISOString()} className="px-2 py-3 text-center border-r border-border last:border-r-0">
                  <p className="text-xs capitalize text-muted-foreground">{weekdayName(date)}</p>
                  <p className={`text-lg font-bold mt-0.5 ${date.toDateString() === new Date().toDateString() ? "text-primary" : ""}`}>
                    {date.getDate()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: "4rem repeat(6, 1fr)" }}>
            {/* Godziny */}
            <div className="border-r border-border">
              {HOURS.map(hour => (
                <div key={hour} className="border-b border-border flex items-start justify-end pr-2 pt-1" style={{ height: CELL_HEIGHT }}>
                  <span className="text-xs text-muted-foreground">{hour}:00</span>
                </div>
              ))}
            </div>

            {/* Kolumny dni */}
            {dates.map((_, dayIndex) => (
              <div key={dayIndex} className="relative border-r border-border last:border-r-0">
                {HOURS.map(hour => (
                  <div key={hour} className="border-b border-border" style={{ height: CELL_HEIGHT }}>
                    {[0, 1, 2, 3].map((quarter) => (
                      <div
                        key={quarter}
                        className={`hover:bg-primary/5 transition-colors ${quarter === 1 ? "border-b border-dashed border-border/40" : ""}`}
                        style={{ height: CELL_HEIGHT / 4 }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDropOnCell(dayIndex, hour, quarter)}
                      />
                    ))}
                  </div>
                ))}

                {visible.filter(a => dayIndexOf(a.date) === dayIndex).map((appt) => {
                  const startOffset = appt.date.getHours() + appt.date.getMinutes() / 60 - 8
                  const color = CATEGORY_COLORS[appt.category] ?? FALLBACK_COLOR
                  const tileHeight = appt.duration * CELL_HEIGHT - 4
                  const compact = tileHeight < 44  // 15 min — jedna linia
                  const medium = !compact && tileHeight < 68 // 30 min — dwie linie

                  const tile = (
                    <div
                      key={appt.id}
                      draggable
                      onDragStart={() => { setDraggingId(appt.id); justDragged.current = true }}
                      onDragEnd={() => { setDraggingId(null); setTimeout(() => { justDragged.current = false }, 100) }}
                      onClick={() => {
                        if (justDragged.current) return
                        setNoteAppt(appt)
                        setNoteText(appt.note)
                      }}
                      className={`absolute left-1 right-1 rounded-lg border overflow-hidden cursor-grab active:cursor-grabbing group transition-opacity ${compact ? "px-1.5 py-0.5" : "p-2"} ${color} ${draggingId === appt.id ? "opacity-30" : appt.status === "completed" ? "opacity-50" : "opacity-100"}`}
                      style={{
                        top: startOffset * CELL_HEIGHT + 2,
                        height: tileHeight,
                      }}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); setToCancel(appt) }}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-black/20 p-0.5 z-10"
                      >
                        <IconX size={12} />
                      </button>
                      {compact ? (
                        <p className="text-[11px] font-semibold leading-tight truncate pr-4">
                          {timeLabel(appt.date)} · {appt.clientName} · {appt.treatment}
                          {appt.note && <IconNote size={11} className="ml-1 inline shrink-0" />}
                          {appt.status === "completed" && <IconCheck size={11} className="ml-1 inline shrink-0" />}
                        </p>
                      ) : medium ? (
                        <>
                          <p className="text-xs font-semibold leading-tight truncate pr-4">
                            {timeLabel(appt.date)} · {appt.clientName}
                            {appt.note && <IconNote size={11} className="ml-1 inline shrink-0" />}
                            {appt.status === "completed" && <IconCheck size={11} className="ml-1 inline shrink-0" />}
                          </p>
                          <p className="text-xs opacity-75 leading-tight truncate">{appt.treatment}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-xs font-semibold leading-tight truncate pr-4">{appt.clientName}</p>
                          <p className="text-xs opacity-75 leading-tight truncate">{appt.treatment}</p>
                          <p className="flex items-center gap-1 text-xs opacity-60 leading-tight">
                            {timeLabel(appt.date)}
                            {appt.note && <IconNote size={12} className="shrink-0" />}
                            {appt.status === "completed" && <IconCheck size={12} className="shrink-0" />}
                          </p>
                        </>
                      )}
                    </div>
                  )

                  if (!appt.note) return tile
                  return (
                    <Tooltip key={appt.id}>
                      <TooltipTrigger asChild>{tile}</TooltipTrigger>
                      <TooltipContent side="top" className="max-w-64">
                        <p className="flex items-start gap-1.5 whitespace-pre-wrap">
                          <IconNote size={14} className="mt-0.5 shrink-0" />
                          {appt.note}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {LEGEND.map((item) => (
          <div key={item.label} className={`flex items-center gap-3 rounded-xl border p-3 ${item.color}`}>
            <div className={`size-3 rounded-full shrink-0 ${item.dot}`} />
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Notatka do wizyty */}
      <Dialog open={noteAppt !== null} onOpenChange={(open) => !open && setNoteAppt(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconNote size={20} className="text-primary" />
              Notatka do wizyty
            </DialogTitle>
            <DialogDescription>
              {noteAppt && `${noteAppt.clientName} — ${noteAppt.treatment}, ${noteAppt.date.toLocaleDateString("pl-PL")} o ${timeLabel(noteAppt.date)}`}
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={5}
            placeholder="Np. preferencje klientki, przebieg zabiegu, na co zwrócić uwagę..."
            className="w-full resize-none rounded-lg border border-input bg-transparent p-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
          <DialogFooter className="gap-2 sm:justify-between">
            {noteAppt?.status === "completed" ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-500">
                <IconCheck size={16} />
                Zrealizowana
              </span>
            ) : (
              <Button
                variant="outline"
                className="border-green-600/50 text-green-500 hover:bg-green-600/10 hover:text-green-400"
                disabled={savingNote}
                onClick={async () => {
                  if (!noteAppt) return
                  setSavingNote(true)
                  await completeAppointment(noteAppt.id, noteAppt.clientId, noteAppt.price)
                  setSavingNote(false)
                  setNoteAppt(null)
                }}
              >
                <IconCheck size={16} />
                Zrealizowana (+{noteAppt ? pointsForPrice(noteAppt.price) : 0} pkt)
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setNoteAppt(null)}>
                Anuluj
              </Button>
              <Button
                disabled={savingNote}
                onClick={async () => {
                  if (!noteAppt) return
                  setSavingNote(true)
                  await updateAppointmentNote(noteAppt.id, noteText.trim())
                  setSavingNote(false)
                  setNoteAppt(null)
                }}
              >
                {savingNote ? "Zapisywanie..." : "Zapisz notatkę"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Potwierdzenie odwołania */}
      <AlertDialog open={toCancel !== null} onOpenChange={(open) => !open && setToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Odwołać wizytę?</AlertDialogTitle>
            <AlertDialogDescription>
              {toCancel && `${toCancel.clientName} — ${toCancel.treatment}, ${toCancel.date.toLocaleDateString("pl-PL")} o ${timeLabel(toCancel.date)}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zostaw</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={async () => {
                if (toCancel) await cancelAppointment(toCancel.id)
                setToCancel(null)
              }}
            >
              Odwołaj wizytę
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
