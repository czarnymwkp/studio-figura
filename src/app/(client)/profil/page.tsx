"use client"

import { useEffect, useState } from "react"
import { FirebaseError } from "firebase/app"
import {
  EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile,
} from "firebase/auth"
import { doc, onSnapshot, updateDoc } from "firebase/firestore"
import { IconDeviceFloppy, IconGift, IconLock, IconUserCircle } from "@tabler/icons-react"
import { toast } from "sonner"

import { auth, db } from "@/lib/firebase/config"
import useAuthState from "@/lib/hooks/useAuthState"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfilPage() {
  const { profile } = useAuthState()

  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [phone, setPhone] = useState("")
  const [points, setPoints] = useState(0)
  const [savingData, setSavingData] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newPassword2, setNewPassword2] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    if (!profile) return
    return onSnapshot(doc(db, "clients", profile.uid), (snap) => {
      const data = snap.data()
      if (!data) return
      setName(data.name ?? "")
      setSurname(data.surname ?? "")
      setPhone(data.phone ?? "")
      setPoints(data.points ?? 0)
    })
  }, [profile])

  const initials = `${name[0] ?? ""}${surname[0] ?? ""}`.toUpperCase() || "?"

  async function saveData() {
    if (!profile || !name.trim() || !surname.trim()) return
    setSavingData(true)
    try {
      const displayName = `${name.trim()} ${surname.trim()}`
      await Promise.all([
        updateDoc(doc(db, "clients", profile.uid), {
          name: name.trim(),
          surname: surname.trim(),
          phone: phone.trim(),
        }),
        updateDoc(doc(db, "users", profile.uid), { displayName }),
        auth.currentUser ? updateProfile(auth.currentUser, { displayName }) : Promise.resolve(),
      ])
      toast.success("Dane zapisane")
    } catch {
      toast.error("Nie udało się zapisać danych")
    } finally {
      setSavingData(false)
    }
  }

  async function changePassword() {
    const user = auth.currentUser
    if (!user?.email) return
    if (newPassword.length < 6) {
      toast.error("Nowe hasło musi mieć co najmniej 6 znaków")
      return
    }
    if (newPassword !== newPassword2) {
      toast.error("Hasła nie są takie same")
      return
    }
    setSavingPassword(true)
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)
      setCurrentPassword("")
      setNewPassword("")
      setNewPassword2("")
      toast.success("Hasło zmienione")
    } catch (error) {
      if (error instanceof FirebaseError && error.code === "auth/invalid-credential") {
        toast.error("Obecne hasło jest nieprawidłowe")
      } else {
        toast.error("Nie udało się zmienić hasła")
      }
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Mój profil</h1>

      {/* Wizytówka */}
      <Card className="border-border/60">
        <CardContent className="flex items-center gap-5 p-5">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/15 text-xl font-bold text-primary">
            {initials}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base font-semibold">{name} {surname}</p>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
            <Badge variant="outline" className="mt-1 w-fit gap-1 border-primary/40 text-primary">
              <IconGift size={13} />
              {points} pkt
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Dane osobowe */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <IconUserCircle size={18} className="text-primary" />
          <span className="font-semibold">Dane osobowe</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Imię</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="surname">Nazwisko</Label>
              <Input id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Telefon</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="np. 500 600 700" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile?.email ?? ""} disabled className="cursor-not-allowed opacity-50" />
            <p className="text-xs text-muted-foreground">Adres email nie może być zmieniony.</p>
          </div>
          <div className="flex justify-end">
            <Button
              size="lg"
              className="gap-2 px-6 text-base font-semibold"
              disabled={savingData || !name.trim() || !surname.trim()}
              onClick={saveData}
            >
              <IconDeviceFloppy size={18} />
              {savingData ? "Zapisywanie..." : "Zapisz zmiany"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Zmiana hasła */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <IconLock size={18} className="text-primary" />
          <span className="font-semibold">Zmiana hasła</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="currentPassword">Obecne hasło</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newPassword">Nowe hasło</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newPassword2">Powtórz nowe hasło</Label>
              <Input
                id="newPassword2"
                type="password"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 px-6 text-base font-semibold"
              disabled={savingPassword || !currentPassword || !newPassword || !newPassword2}
              onClick={changePassword}
            >
              <IconLock size={18} />
              {savingPassword ? "Zmienianie..." : "Zmień hasło"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
