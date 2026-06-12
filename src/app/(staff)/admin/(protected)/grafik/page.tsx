"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  IconChevronLeft, IconChevronRight, IconGripVertical,
  IconSparkles, IconSunOff, IconUsers, IconX,
} from "@tabler/icons-react"

import {
  subscribeEmployees, subscribeRangeShifts, setShift, removeShift,
  isHoliday, SHIFT_DEFS, type Employee, type Shift,
} from "@/lib/firebase/schedule"
import { SkillsDialog } from "@/components/admin/SkillsDialog"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const VISIBLE_DAYS = 7

function getVisibleDates(offset: number) {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() + offset * 7)
  return Array.from({ length: VISIBLE_DAYS }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

/** Niedziela lub święto — studio zamknięte. */
function isClosed(date: Date) {
  return date.getDay() === 0 || isHoliday(date)
}

function weekdayName(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", { weekday: "long" }).format(date)
}

function monthLabel(dates: Date[]) {
  const fmt = (d: Date, withYear: boolean) =>
    new Intl.DateTimeFormat("pl-PL", { month: "long", ...(withYear && { year: "numeric" }) }).format(d)
  const first = dates[0]
  const last = dates[VISIBLE_DAYS - 1]
  if (first.getMonth() === last.getMonth()) return fmt(first, true)
  return `${fmt(first, false)} – ${fmt(last, true)}`
}

function initials(emp: Employee) {
  return `${emp.name[0] ?? ""}${emp.surname[0] ?? ""}`.toUpperCase()
}

export default function GrafikPage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [shifts, setShifts] = useState<Shift[]>([])
  const [skillsTarget, setSkillsTarget] = useState<Employee | null>(null)
  const [draggingUid, setDraggingUid] = useState<string | null>(null)
  const justDragged = useRef(false)
  const dates = useMemo(() => getVisibleDates(weekOffset), [weekOffset])

  useEffect(() => subscribeEmployees(setEmployees), [])

  useEffect(() => {
    const start = dates[0]
    const end = new Date(dates[VISIBLE_DAYS - 1])
    end.setHours(23, 59, 59, 999)
    return subscribeRangeShifts(start, end, setShifts)
  }, [dates])

  const employeeById = (uid: string) => employees.find((e) => e.uid === uid)

  const shiftsFor = (date: Date, shiftNo: 1 | 2) =>
    shifts.filter((s) => s.shiftNo === shiftNo && s.date.toDateString() === date.toDateString())

  const workingCount = (date: Date) =>
    new Set(shifts.filter((s) => s.date.toDateString() === date.toDateString()).map((s) => s.employeeId)).size

  async function handleDrop(date: Date, shiftNo: 1 | 2) {
    if (!draggingUid || isClosed(date)) return
    const uid = draggingUid
    setDraggingUid(null)
    await setShift(uid, date, shiftNo)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Grafik</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="size-8" onClick={() => setWeekOffset(w => w - 1)}>
            <IconChevronLeft size={16} />
          </Button>
          <span className="min-w-36 text-center font-semibold capitalize">{monthLabel(dates)}</span>
          <Button variant="outline" size="icon" className="size-8" onClick={() => setWeekOffset(w => w + 1)}>
            <IconChevronRight size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setWeekOffset(0)}>Dzisiaj</Button>
        </div>
      </div>

      {employees.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border p-12 text-center">
          <IconUsers size={32} className="text-muted-foreground" />
          <p className="font-semibold">Brak pracowników</p>
          <p className="text-sm text-muted-foreground">
            Dodaj pracowników w sekcji Pracownicy, aby ułożyć grafik.
          </p>
        </div>
      ) : (
        <div className="flex gap-4">
          {/* Panel pracowników */}
          <div className="flex w-52 shrink-0 flex-col gap-2">
            <p className="px-1 text-xs font-medium uppercase text-muted-foreground">
              Pracownicy — przeciągnij na zmianę
            </p>
            {employees.map((emp) => (
              <div
                key={emp.uid}
                draggable
                onDragStart={() => { setDraggingUid(emp.uid); justDragged.current = true }}
                onDragEnd={() => { setDraggingUid(null); setTimeout(() => { justDragged.current = false }, 100) }}
                onClick={() => { if (!justDragged.current) setSkillsTarget(emp) }}
                className={cn(
                  "flex cursor-grab items-center gap-2.5 rounded-xl border border-border/60 p-2.5 transition-all active:cursor-grabbing hover:border-primary/40",
                  draggingUid === emp.uid && "opacity-40"
                )}
              >
                <IconGripVertical size={16} className="shrink-0 text-muted-foreground/50" />
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {initials(emp)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold leading-tight">{emp.name} {emp.surname}</p>
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <IconSparkles size={11} className="shrink-0 text-primary" />
                    {emp.skills.length > 0 ? `${emp.skills.length} umiejętności` : "brak umiejętności"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Siatka zmian */}
          <div className="min-w-0 flex-1 overflow-x-auto rounded-2xl border border-primary/40">
            <div className="grid min-w-160" style={{ gridTemplateColumns: `6rem repeat(${VISIBLE_DAYS}, 1fr)` }}>
              {/* Nagłówek dni */}
              <div className="border-b border-r border-border bg-primary/10" />
              {dates.map((date) => {
                const closed = isClosed(date)
                const count = workingCount(date)
                return (
                  <div
                    key={date.toISOString()}
                    className={cn(
                      "border-b border-r border-border bg-primary/10 px-2 py-3 text-center last:border-r-0",
                      closed && "bg-muted/50 opacity-60"
                    )}
                  >
                    <p className="text-xs capitalize text-muted-foreground">{weekdayName(date)}</p>
                    <p className={cn("mt-0.5 text-lg font-bold", date.toDateString() === new Date().toDateString() && "text-primary")}>
                      {date.getDate()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isHoliday(date) ? "święto" : closed ? "zamknięte" : count > 0 ? `${count} os.` : "—"}
                    </p>
                  </div>
                )
              })}

              {/* Wiersze zmian */}
              {SHIFT_DEFS.map((def) => (
                <div key={def.no} className="contents">
                  <div className="flex flex-col items-center justify-center gap-0.5 border-b border-r border-border px-2 py-4 text-center">
                    <span className="text-sm font-bold text-primary">{def.label}</span>
                    <span className="text-xs text-muted-foreground">{def.start}–{def.end}</span>
                  </div>
                  {dates.map((date) => {
                    const closed = isClosed(date)
                    const assigned = shiftsFor(date, def.no)
                    return (
                      <div
                        key={date.toISOString()}
                        onDragOver={(e) => { if (!closed) e.preventDefault() }}
                        onDrop={() => handleDrop(date, def.no)}
                        className={cn(
                          "flex min-h-24 flex-col gap-1.5 border-b border-r border-border p-2 transition-colors last:border-r-0",
                          closed
                            ? "bg-muted/30"
                            : "hover:bg-primary/5",
                          draggingUid && !closed && "bg-primary/5 outline-1 outline-dashed -outline-offset-4 outline-primary/40"
                        )}
                      >
                        {closed ? (
                          <div className="flex flex-1 flex-col items-center justify-center gap-1 text-muted-foreground/60">
                            <IconSunOff size={18} />
                            <span className="text-xs">Zamknięte</span>
                          </div>
                        ) : (
                          assigned.map((shift) => {
                            const emp = employeeById(shift.employeeId)
                            if (!emp) return null
                            return (
                              <span
                                key={shift.id}
                                className="group flex items-center justify-between gap-1 rounded-full bg-primary/15 py-1 pl-3 pr-1.5 text-xs font-semibold text-primary"
                              >
                                <span className="truncate">{emp.name} {emp.surname[0]}.</span>
                                <button
                                  onClick={() => removeShift(emp.uid, shift.date, def.no)}
                                  className="rounded-full p-0.5 opacity-0 transition-opacity hover:bg-black/20 group-hover:opacity-100"
                                >
                                  <IconX size={12} />
                                </button>
                              </span>
                            )
                          })
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <SkillsDialog employee={skillsTarget} onClose={() => setSkillsTarget(null)} />
    </div>
  )
}
