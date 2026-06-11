"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react"

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8)
const DAYS = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"]
const CELL_HEIGHT = 72

const LEGEND = [
  { label: "Depilacja laserowa", color: "bg-primary/20 border-primary/50 text-primary", dot: "bg-primary" },
  { label: "Zabiegi na twarz", color: "bg-blue-500/20 border-blue-500/50 text-blue-400", dot: "bg-blue-400" },
  { label: "Modelowanie sylwetki", color: "bg-green-500/20 border-green-500/50 text-green-400", dot: "bg-green-400" },
  { label: "Masaże i relaks", color: "bg-purple-500/20 border-purple-500/50 text-purple-400", dot: "bg-purple-400" },
]

const INITIAL_APPOINTMENTS = [
  { id: 1,  day: 0, hour: 8,  duration: 1,   client: "Anna Kowalska",        treatment: "Depilacja — pachy",     color: "bg-primary/20 border-primary/50 text-primary" },
  { id: 2,  day: 0, hour: 10, duration: 1.5, client: "Marta Wiśniewska",     treatment: "HIFU 4D twarz",         color: "bg-blue-500/20 border-blue-500/50 text-blue-400" },
  { id: 3,  day: 0, hour: 14, duration: 1,   client: "Joanna Zielińska",     treatment: "Roll Shaper",           color: "bg-purple-500/20 border-purple-500/50 text-purple-400" },
  { id: 4,  day: 1, hour: 9,  duration: 0.5, client: "Karolina Nowak",       treatment: "Kavitacja",             color: "bg-green-500/20 border-green-500/50 text-green-400" },
  { id: 5,  day: 1, hour: 11, duration: 1,   client: "Ewa Kaczmarek",        treatment: "Laser frakcyjny",       color: "bg-blue-500/20 border-blue-500/50 text-blue-400" },
  { id: 6,  day: 1, hour: 15, duration: 1,   client: "Paulina Wójcik",       treatment: "RF Multipolar",         color: "bg-green-500/20 border-green-500/50 text-green-400" },
  { id: 7,  day: 2, hour: 8,  duration: 1,   client: "Agnieszka Lewandowska",treatment: "Limfodrenaż",           color: "bg-purple-500/20 border-purple-500/50 text-purple-400" },
  { id: 8,  day: 2, hour: 10, duration: 0.5, client: "Anna Kowalska",        treatment: "Depilacja — bikini",    color: "bg-primary/20 border-primary/50 text-primary" },
  { id: 9,  day: 2, hour: 13, duration: 1,   client: "Marta Wiśniewska",     treatment: "Kriolipoliza",          color: "bg-green-500/20 border-green-500/50 text-green-400" },
  { id: 10, day: 3, hour: 9,  duration: 1.5, client: "Joanna Zielińska",     treatment: "HIFU 4D twarz",         color: "bg-blue-500/20 border-blue-500/50 text-blue-400" },
  { id: 11, day: 3, hour: 12, duration: 1,   client: "Karolina Nowak",       treatment: "Carbon Master",         color: "bg-blue-500/20 border-blue-500/50 text-blue-400" },
  { id: 12, day: 3, hour: 16, duration: 0.5, client: "Ewa Kaczmarek",        treatment: "Elektrostymulacja",     color: "bg-green-500/20 border-green-500/50 text-green-400" },
  { id: 13, day: 4, hour: 8,  duration: 1,   client: "Paulina Wójcik",       treatment: "Lipolaser",             color: "bg-green-500/20 border-green-500/50 text-green-400" },
  { id: 14, day: 4, hour: 10, duration: 1,   client: "Agnieszka Lewandowska",treatment: "Roll Shaper",           color: "bg-purple-500/20 border-purple-500/50 text-purple-400" },
  { id: 15, day: 4, hour: 14, duration: 1.5, client: "Anna Kowalska",        treatment: "Depilacja — nogi całe", color: "bg-primary/20 border-primary/50 text-primary" },
  { id: 16, day: 5, hour: 9,  duration: 1,   client: "Marta Wiśniewska",     treatment: "Kavitacja",             color: "bg-green-500/20 border-green-500/50 text-green-400" },
  { id: 17, day: 5, hour: 11, duration: 1,   client: "Karolina Nowak",       treatment: "RF Multipolar",         color: "bg-green-500/20 border-green-500/50 text-green-400" },
]

function getWeekDates(offset: number) {
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7)
  return DAYS.map((_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export default function TerminarzPage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS)
  const [draggingId, setDraggingId] = useState<number | null>(null)
  const dates = getWeekDates(weekOffset)

  const handleDragStart = (id: number) => setDraggingId(id)

  const handleDropOnCell = (day: number, hour: number) => {
    if (draggingId === null) return
    setAppointments(prev =>
      prev.map(a => a.id === draggingId ? { ...a, day, hour } : a)
    )
    setDraggingId(null)
  }

  const handleCancel = (id: number) => {
    setAppointments(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Terminarz</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="size-8" onClick={() => setWeekOffset(w => w - 1)}>
            <IconChevronLeft size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setWeekOffset(0)}>Dzisiaj</Button>
          <Button variant="outline" size="icon" className="size-8" onClick={() => setWeekOffset(w => w + 1)}>
            <IconChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/40 overflow-hidden">
        {/* Header */}
        <div className="grid border-b border-border bg-primary/10" style={{ gridTemplateColumns: "4rem repeat(6, 1fr)" }}>
          <div className="border-r border-border" />
          {DAYS.map((day, i) => (
            <div key={day} className="px-2 py-3 text-center border-r border-border last:border-r-0">
              <p className="text-xs text-muted-foreground">{day}</p>
              <p className={`text-lg font-bold mt-0.5 ${dates[i].toDateString() === new Date().toDateString() ? "text-primary" : ""}`}>
                {dates[i].getDate()}
              </p>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="overflow-y-auto max-h-[calc(100vh-320px)]">
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
            {DAYS.map((_, dayIndex) => (
              <div key={dayIndex} className="relative border-r border-border last:border-r-0">
                {HOURS.map(hour => (
                  <div
                    key={hour}
                    className="border-b border-border hover:bg-primary/5 transition-colors"
                    style={{ height: CELL_HEIGHT }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDropOnCell(dayIndex, hour)}
                  />
                ))}

                {appointments.filter(a => a.day === dayIndex).map((appt) => (
                  <div
                    key={appt.id}
                    draggable
                    onDragStart={() => handleDragStart(appt.id)}
                    onDragEnd={() => setDraggingId(null)}
                    className={`absolute left-1 right-1 rounded-lg border p-2 overflow-hidden cursor-grab active:cursor-grabbing group transition-opacity ${appt.color} ${draggingId === appt.id ? "opacity-30" : "opacity-100"}`}
                    style={{
                      top: (appt.hour - 8) * CELL_HEIGHT + 2,
                      height: appt.duration * CELL_HEIGHT - 4,
                    }}
                  >
                    <button
                      onClick={() => handleCancel(appt.id)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-black/20 p-0.5"
                    >
                      <IconX size={12} />
                    </button>
                    <p className="text-xs font-semibold leading-tight truncate pr-4">{appt.client}</p>
                    <p className="text-xs opacity-75 leading-tight truncate">{appt.treatment}</p>
                    <p className="text-xs opacity-60 leading-tight">{appt.hour}:00</p>
                  </div>
                ))}
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
    </div>
  )
}
