import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  IconUsers,
  IconCalendar,
  IconCurrencyZloty,
  IconStar,
  IconClock,
  IconSparkles,
  IconTrendingUp,
} from "@tabler/icons-react"

const STATS = [
  { label: "Klienci dziś", value: "4", icon: IconCalendar, trend: "+1 vs wczoraj" },
  { label: "Klienci w tygodniu", value: "23", icon: IconUsers, trend: "+5 vs poprzedni" },
  { label: "Klienci w miesiącu", value: "87", icon: IconTrendingUp, trend: "+12 vs poprzedni" },
  { label: "Przychód (miesiąc)", value: "14 200 zł", icon: IconCurrencyZloty, trend: "+8% vs poprzedni" },
]

const TOP_TREATMENTS = [
  { rank: 1, name: "Depilacja laserowa — nogi całe", count: 34, revenue: "11 866 zł" },
  { rank: 2, name: "HIFU 4D twarz", count: 18, revenue: "8 982 zł" },
  { rank: 3, name: "Kriolipoliza", count: 15, revenue: "4 485 zł" },
  { rank: 4, name: "Kavitacja", count: 14, revenue: "2 786 zł" },
  { rank: 5, name: "Carbon Master", count: 11, revenue: "3 839 zł" },
]

const PROMOTIONS = [
  { name: "Wakacyjny pakiet depilacji", discount: "-20%", until: "31.08.2026", active: true },
  { name: "Pierwsze HIFU gratis konsultacja", discount: "Gratis", until: "30.06.2026", active: true },
  { name: "Karnety 5+1 na kavitację", discount: "-17%", until: "31.07.2026", active: true },
]

const UPCOMING = [
  { time: "09:00", client: "Anna Kowalska", treatment: "Depilacja — pachy", duration: "15 min" },
  { time: "10:00", client: "Marta Wiśniewska", treatment: "HIFU 4D twarz", duration: "60 min" },
  { time: "12:30", client: "Karolina Nowak", treatment: "Kavitacja brzuch", duration: "45 min" },
  { time: "14:00", client: "Joanna Zielińska", treatment: "Roll Shaper", duration: "30 min" },
]

export default function AdminDashboardPage() {
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
              <span className="text-xs text-muted-foreground">{stat.trend}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Top zabiegi */}
        <Card className="xl:col-span-2 rounded-2xl border border-primary/40">
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <IconStar size={18} className="text-primary" />
            <span className="font-semibold">Najlepiej sprzedające się zabiegi</span>
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
                {TOP_TREATMENTS.map((t, i) => (
                  <tr key={t.name} className={i % 2 === 0 ? "" : "bg-muted/30"}>
                    <td className="px-4 py-3 text-primary font-bold">{t.rank}</td>
                    <td className="px-4 py-3">{t.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.count}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{t.revenue}</td>
                  </tr>
                ))}
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
            {PROMOTIONS.map((promo) => (
              <div key={promo.name} className="flex flex-col gap-1 p-3 rounded-xl border border-primary/20 bg-primary/5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium leading-tight">{promo.name}</span>
                  <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/20 shrink-0">
                    {promo.discount}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">do {promo.until}</span>
              </div>
            ))}
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
                <th className="text-left px-4 py-2 font-medium">Czas trwania</th>
              </tr>
            </thead>
            <tbody>
              {UPCOMING.map((v, i) => (
                <tr key={v.time} className={i % 2 === 0 ? "" : "bg-muted/30"}>
                  <td className="px-4 py-3 font-bold text-primary">{v.time}</td>
                  <td className="px-4 py-3 font-medium">{v.client}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.treatment}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
