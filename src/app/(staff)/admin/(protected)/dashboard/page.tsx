"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  IconUsers, IconCalendar, IconCurrencyZloty,
  IconStar, IconClock, IconSparkles, IconTrendingUp, IconTrendingDown,
} from "@tabler/icons-react"
import { useDashboard } from "@/lib/hooks/useDashboard"

function formatRevenue(n: number) {
  return n.toLocaleString("pl-PL") + " zł"
}

function Trend({ current, prev, suffix = "" }: { current: number; prev: number; suffix?: string }) {
  if (prev === 0) return null
  const diff = current - prev
  const pct = Math.round(Math.abs(diff) / prev * 100)
  const up = diff >= 0
  return (
    <span className={`flex items-center gap-0.5 text-xs ${up ? "text-green-400" : "text-red-400"}`}>
      {up ? <IconTrendingUp size={13} /> : <IconTrendingDown size={13} />}
      {up ? "+" : "-"}{pct}%{suffix} vs poprzedni
    </span>
  )
}

function formatTime(ts: { toDate: () => Date }) {
  return ts.toDate().toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
}

function formatDuration(hours: number) {
  if (hours < 1) return `${Math.round(hours * 60)} min`
  if (hours === 1) return "60 min"
  return `${Math.round(hours * 60)} min`
}

export default function AdminDashboardPage() {
  const {
    todayCount, weekCount, monthCount,
    monthRevenue, prevMonthRevenue,
    prevWeekCount, prevMonthCount,
    todayAppointments, topTreatments,
    activePromotions, loading,
  } = useDashboard()

  const STATS = [
    {
      label: "Klienci dziś",
      value: loading ? "—" : String(todayCount),
      icon: IconCalendar,
      trend: null,
    },
    {
      label: "Klienci w tygodniu",
      value: loading ? "—" : String(weekCount),
      icon: IconUsers,
      trend: <Trend current={weekCount} prev={prevWeekCount} />,
    },
    {
      label: "Klienci w miesiącu",
      value: loading ? "—" : String(monthCount),
      icon: IconTrendingUp,
      trend: <Trend current={monthCount} prev={prevMonthCount} />,
    },
    {
      label: "Przychód (miesiąc)",
      value: loading ? "—" : formatRevenue(monthRevenue),
      icon: IconCurrencyZloty,
      trend: <Trend current={monthRevenue} prev={prevMonthRevenue} suffix=" przychodu" />,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Przegląd</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label} className="rounded-2xl border border-primary/40">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <stat.icon size={18} className="text-primary" />
              </div>
              <span className="text-3xl font-bold">{stat.value}</span>
              {stat.trend ?? <span className="text-xs text-muted-foreground h-4" />}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Top zabiegi */}
        <Card className="xl:col-span-2 rounded-2xl border border-primary/40">
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <IconStar size={18} className="text-primary" />
            <span className="font-semibold">Najczęściej wykonywane zabiegi</span>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left px-4 py-2 font-medium w-8">#</th>
                  <th className="text-left px-4 py-2 font-medium">Zabieg</th>
                  <th className="text-left px-4 py-2 font-medium">Wizyty</th>
                  <th className="text-left px-4 py-2 font-medium">Przychód</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/30"}>
                        <td colSpan={4} className="px-4 py-3 text-muted-foreground text-xs">Ładowanie...</td>
                      </tr>
                    ))
                  : topTreatments.map((t, i) => (
                      <tr key={t.name} className={i % 2 === 0 ? "" : "bg-muted/30"}>
                        <td className="px-4 py-3 text-primary font-bold">{i + 1}</td>
                        <td className="px-4 py-3">{t.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{t.count}</td>
                        <td className="px-4 py-3 font-semibold text-primary">{formatRevenue(t.revenue)}</td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Aktywne promocje */}
        <Card className="rounded-2xl border border-primary/40">
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <IconSparkles size={18} className="text-primary" />
            <span className="font-semibold">Aktywne promocje</span>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {loading
              ? <p className="text-xs text-muted-foreground">Ładowanie...</p>
              : activePromotions.length === 0
                ? <p className="text-sm text-muted-foreground">Brak aktywnych promocji</p>
                : activePromotions.map((promo) => (
                    <div key={promo.id} className="flex flex-col gap-1 p-3 rounded-xl border border-primary/20 bg-primary/5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium leading-tight">{promo.name}</span>
                        <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/20 shrink-0">
                          {promo.discount}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">do {promo.validUntil}</span>
                    </div>
                  ))
            }
          </CardContent>
        </Card>
      </div>

      {/* Dzisiejsze wizyty */}
      <Card className="rounded-2xl border border-primary/40">
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <IconClock size={18} className="text-primary" />
          <span className="font-semibold">Dzisiejsze wizyty</span>
          <Badge variant="outline" className="ml-auto border-primary/40 text-primary">
            {new Date().toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long" })}
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left px-4 py-2 font-medium">Godzina</th>
                <th className="text-left px-4 py-2 font-medium">Klient</th>
                <th className="text-left px-4 py-2 font-medium">Zabieg</th>
                <th className="text-left px-4 py-2 font-medium">Czas</th>
                <th className="text-left px-4 py-2 font-medium">Cena</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Ładowanie...</td></tr>
                : todayAppointments.length === 0
                  ? <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Brak wizyt na dziś</td></tr>
                  : todayAppointments.map((v, i) => (
                      <tr key={v.id} className={i % 2 === 0 ? "" : "bg-muted/30"}>
                        <td className="px-4 py-3 font-bold text-primary">{formatTime(v.date)}</td>
                        <td className="px-4 py-3 font-medium">{v.clientName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{v.treatment}</td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDuration(v.duration)}</td>
                        <td className="px-4 py-3 font-semibold text-primary">{v.price} zł</td>
                      </tr>
                    ))
              }
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
