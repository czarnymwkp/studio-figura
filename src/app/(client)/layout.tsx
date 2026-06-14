"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { IconCalendarHeart, IconHome, IconSparkles, IconLogout, IconUser, IconWorldOff } from "@tabler/icons-react"
import { toast } from "sonner"

import useRequireAuth from "@/lib/hooks/useRequireAuth"
import { usePortalSettings } from "@/lib/hooks/usePortalSettings"
import { logout } from "@/lib/firebase/auth"
import { claimDailyLoginBonus, LOGIN_STREAK_TARGET } from "@/lib/firebase/appointments"
import { UserRole } from "@/types"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Toaster } from "@/components/ui/sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LocaleProvider, useLocale } from "@/components/locale-context"
import { ClientLanguageSwitcher } from "@/components/ClientLanguageSwitcher"

const ALLOWED_ROLES: UserRole[] = ["client"]

function ClientLayoutInner({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useRequireAuth(ALLOWED_ROLES)
  const portal = usePortalSettings()
  const { dict } = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const navLinks = [
    { href: "/dashboard", label: dict.client.nav.home, icon: IconHome },
    { href: "/rezerwacje", label: dict.client.nav.bookings, icon: IconCalendarHeart },
    { href: "/promocje", label: dict.client.nav.promotions, icon: IconSparkles },
  ]

  useEffect(() => {
    if (!profile) return
    claimDailyLoginBonus(profile.uid).then(({ awarded, streak }) => {
      if (awarded) {
        toast.success(dict.client.streak.awarded(LOGIN_STREAK_TARGET))
        return
      }
      if (streak < 1) return
      const left = LOGIN_STREAK_TARGET - streak
      toast.info(
        streak === 1
          ? dict.client.streak.started(LOGIN_STREAK_TARGET)
          : dict.client.streak.progress(streak, left)
      )
    })
  }, [profile, dict])

  if (loading || !profile) return null

  if (!portal.loading && !portal.active) {
    const dp = dict.client.portal.inactive
    return (
      <div className="min-h-svh flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-background via-background to-primary/5 text-center px-4">
        <IconWorldOff size={52} className="text-muted-foreground" />
        <h2 className="text-2xl font-bold">{dp.title}</h2>
        <p className="text-muted-foreground max-w-sm">{dp.description}</p>
        <button
          onClick={async () => { await logout(); router.push("/login") }}
          className="mt-2 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          {dp.logout}
        </button>
        <Toaster position="top-center" />
      </div>
    )
  }

  const initials = profile.displayName
    ?.split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "?"

  return (
    <div className="min-h-svh bg-gradient-to-b from-background via-background to-primary/5">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 md:px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Image src="/img/logo.png" alt="Studio Figura" width={40} height={40} className="shrink-0" />
            <span className="hidden text-lg font-bold tracking-tight sm:block">Studio Figura</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon size={18} />
                <span className="hidden md:block">{label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <div className="hidden sm:flex items-center gap-1.5">
              <ClientLanguageSwitcher />
              <ThemeToggle />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-none ring-primary/50 focus-visible:ring-2">
                <Avatar className="size-10 border-2 border-primary/40">
                  <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-semibold">{profile.displayName}</span>
                    <span className="text-xs font-normal text-muted-foreground">{profile.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profil")}>
                  <IconUser size={18} />
                  {dict.client.dropdown.myProfile}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={async () => {
                    await logout()
                    router.push("/login")
                  }}
                >
                  <IconLogout size={18} />
                  {dict.client.dropdown.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6 md:py-8">{children}</main>
      <Toaster position="top-center" />
    </div>
  )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <ClientLayoutInner>{children}</ClientLayoutInner>
    </LocaleProvider>
  )
}
