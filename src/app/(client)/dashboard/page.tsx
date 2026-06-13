"use client"

import Link from "next/link"
import Image from "next/image"
import {
  IconCalendarHeart, IconClock, IconSparkles,
  IconStar, IconArrowRight, IconGift, IconHistory, IconRepeat,
} from "@tabler/icons-react"

import useAuthState from "@/lib/hooks/useAuthState"
import { useClientPortal } from "@/lib/hooks/useClientPortal"
import { useLocale } from "@/components/locale-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const REWARD_THRESHOLD = 100

export default function ClientDashboardPage() {
  const { profile } = useAuthState()
  const { points, upcoming, history, promotions, loading } = useClientPortal()
  const { dict } = useLocale()
  const d = dict.client.dashboard

  const firstName = profile?.displayName?.split(" ")[0]
  const nextVisit = upcoming[0]
  const progress = Math.min((points % REWARD_THRESHOLD) / REWARD_THRESHOLD * 100, 100)
  const toReward = REWARD_THRESHOLD - (points % REWARD_THRESHOLD)

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat(dict.dateLocale, {
      weekday: "long", day: "numeric", month: "long",
    }).format(date)
  }

  function formatTime(date: Date) {
    return new Intl.DateTimeFormat(dict.dateLocale, { hour: "2-digit", minute: "2-digit" }).format(date)
  }

  function formatDuration(hours: number) {
    const minutes = Math.round(hours * 60)
    return minutes >= 60
      ? `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${minutes % 60} min` : ""}`
      : `${minutes} min`
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{d.greeting(firstName)}</h1>
        <p className="mt-1 text-muted-foreground">{d.subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Points */}
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary to-orange-700 text-primary-foreground">
          <IconStar className="absolute -right-6 -top-6 size-36 rotate-12 opacity-10" />
          <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
            <div className="flex items-center gap-2 text-sm font-medium opacity-90">
              <IconGift size={18} />
              {d.points.label}
            </div>
            <div>
              <div className="text-5xl font-extrabold tracking-tight">{points}</div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm opacity-90">{d.points.toReward(toReward)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Next visit */}
        <Card className="border-border/60">
          <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <IconCalendarHeart size={18} className="text-primary" />
              {d.nextVisit.label}
            </div>
            {loading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            ) : nextVisit ? (
              <div className="flex flex-col gap-1.5">
                <div className="text-xl font-bold">{nextVisit.treatment}</div>
                <div className="capitalize text-muted-foreground">{formatDate(nextVisit.date)}</div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <IconClock size={16} />
                    {formatTime(nextVisit.date)}
                  </span>
                  <span>{formatDuration(nextVisit.duration)}</span>
                  <span className="font-semibold text-foreground">{nextVisit.price} zł</span>
                </div>

                {upcoming.length > 1 && (
                  <div className="mt-3 flex flex-col gap-2 border-t border-border/60 pt-3">
                    <p className="text-xs font-medium uppercase text-muted-foreground">{d.nextVisit.more}</p>
                    {upcoming.slice(1, 4).map((visit) => (
                      <div key={visit.id} className="flex items-center justify-between gap-3 text-sm">
                        <span className="truncate font-medium">{visit.treatment}</span>
                        <span className="shrink-0 capitalize text-muted-foreground">
                          {new Intl.DateTimeFormat(dict.dateLocale, { day: "numeric", month: "short" }).format(visit.date)}
                          {", "}
                          {formatTime(visit.date)}
                        </span>
                      </div>
                    ))}
                    {upcoming.length > 4 && (
                      <p className="text-xs text-muted-foreground">
                        {d.nextVisit.andMore(upcoming.length - 4)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">{d.nextVisit.noVisit}</p>
            )}
            <Button asChild size="lg" className="w-full text-base font-semibold">
              <Link href="/rezerwacje">
                {nextVisit ? d.nextVisit.manage : d.nextVisit.book}
                <IconArrowRight size={18} />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Promotions */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <IconSparkles size={22} className="text-primary" />
            {d.promotions.heading}
          </h2>
          <Button asChild variant="ghost" className="text-primary hover:text-primary">
            <Link href="/promocje">
              {d.promotions.all}
              <IconArrowRight size={16} />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-44 rounded-xl" />
            <Skeleton className="h-44 rounded-xl" />
          </div>
        ) : promotions.length === 0 ? (
          <p className="text-muted-foreground">{d.promotions.empty}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {promotions.map((promo) => (
              <Card key={promo.id} className="group overflow-hidden border-border/60 p-0 transition-shadow hover:shadow-lg hover:shadow-primary/10">
                <div className="relative h-36 overflow-hidden">
                  <Image
                    src={promo.image}
                    alt={promo.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className="absolute left-3 top-3 bg-primary text-base font-bold text-primary-foreground">
                    {promo.discount}
                  </Badge>
                </div>
                <CardContent className="flex flex-col gap-1.5 p-4 pt-0">
                  <div className="font-bold">{promo.name}</div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{promo.description}</p>
                  <p className="text-xs text-muted-foreground">{d.promotions.validUntil(promo.validUntil)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <IconHistory size={22} className="text-primary" />
            {d.history.heading}
          </h2>
          <div className="flex flex-col gap-2">
            {history.slice(0, 5).map((visit) => (
              <Card key={visit.id} className="border-border/60 p-0">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{visit.treatment}</div>
                    <div className="text-sm capitalize text-muted-foreground">
                      {formatDate(visit.date)} · {visit.price} zł
                    </div>
                  </div>
                  <Button asChild variant="outline" className="shrink-0 gap-1.5 border-primary/40 text-primary hover:text-primary">
                    <Link href={`/rezerwacje?zabieg=${encodeURIComponent(visit.treatment)}`}>
                      <IconRepeat size={16} />
                      {d.history.bookAgain}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
