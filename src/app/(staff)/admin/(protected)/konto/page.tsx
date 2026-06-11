"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { IconUserCircle, IconLock, IconDeviceFloppy } from "@tabler/icons-react"
import useAuthState from "@/lib/hooks/useAuthState"
import Image from "next/image"

export default function KontoPage() {
  const { profile } = useAuthState()

  const [displayName, setDisplayName] = useState(profile?.displayName ?? "")
  const [email] = useState(profile?.email ?? "")

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Konto</h1>

      {/* Avatar + info */}
      <Card className="rounded-2xl border border-primary/40">
        <CardContent className="flex items-center gap-5 p-5">
          <div className="size-16 rounded-2xl overflow-hidden bg-muted shrink-0 flex items-center justify-center border border-primary/30">
            <Image src="/img/logo.png" alt="Avatar" width={64} height={64} className="object-contain p-1" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base font-semibold">{profile?.displayName ?? profile?.email}</p>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
            <Badge variant="outline" className="w-fit mt-1 border-primary/40 text-primary capitalize">
              {profile?.role ?? "pracownik"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Dane osobowe */}
      <Card className="rounded-2xl border border-primary/40">
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <IconUserCircle size={18} className="text-primary" />
          <span className="font-semibold">Dane osobowe</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="displayName">Imię i nazwisko</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Imię i nazwisko"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled className="opacity-50 cursor-not-allowed" />
            <p className="text-xs text-muted-foreground">Adres email nie może być zmieniony.</p>
          </div>
          <div className="flex justify-end">
            <Button size="lg" className="text-base font-semibold px-6 gap-2">
              <IconDeviceFloppy size={18} />
              Zapisz zmiany
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Zmiana hasła */}
      <Card className="rounded-2xl border border-primary/40">
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <IconLock size={18} className="text-primary" />
          <span className="font-semibold">Zmiana hasła</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="currentPassword">Obecne hasło</Label>
            <Input id="currentPassword" type="password" placeholder="••••••••" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="newPassword">Nowe hasło</Label>
            <Input id="newPassword" type="password" placeholder="••••••••" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">Powtórz nowe hasło</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••••" />
          </div>
          <div className="flex justify-end">
            <Button size="lg" variant="outline" className="text-base font-semibold px-6 gap-2">
              <IconLock size={18} />
              Zmień hasło
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
