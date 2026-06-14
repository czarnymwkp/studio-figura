"use client"

import { useEffect, useState } from "react"
import { FirebaseError } from "firebase/app"
import {
  EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile,
} from "firebase/auth"
import { doc, onSnapshot, updateDoc } from "firebase/firestore"
import { IconDeviceFloppy, IconGift, IconLock, IconUserCircle, IconShield } from "@tabler/icons-react"
import { toast } from "sonner"

import { auth, db } from "@/lib/firebase/config"
import useAuthState from "@/lib/hooks/useAuthState"
import { useLocale } from "@/components/locale-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function ProfilPage() {
  const { profile } = useAuthState()
  const { dict } = useLocale()
  const d = dict.client.profile

  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [phone, setPhone] = useState("")
  const [points, setPoints] = useState(0)
  const [savingData, setSavingData] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newPassword2, setNewPassword2] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)

  const [smsConsent, setSmsConsent] = useState(false)
  const [smsConsentDate, setSmsConsentDate] = useState<string | null>(null)
  const [savingConsent, setSavingConsent] = useState(false)

  useEffect(() => {
    if (!profile) return
    return onSnapshot(doc(db, "clients", profile.uid), (snap) => {
      const data = snap.data()
      if (!data) return
      setName(data.name ?? "")
      setSurname(data.surname ?? "")
      setPhone(data.phone ?? "")
      setPoints(data.points ?? 0)
      setSmsConsent(data.smsConsent ?? false)
      setSmsConsentDate(data.smsConsentDate ?? null)
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
      toast.success(d.saved)
    } catch {
      toast.error(d.saveFailed)
    } finally {
      setSavingData(false)
    }
  }

  async function changePassword() {
    const user = auth.currentUser
    if (!user?.email) return
    if (newPassword.length < 6) {
      toast.error(d.passwordTooShort)
      return
    }
    if (newPassword !== newPassword2) {
      toast.error(d.passwordMismatch)
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
      toast.success(d.passwordChanged)
    } catch (error) {
      if (error instanceof FirebaseError && error.code === "auth/invalid-credential") {
        toast.error(d.wrongPassword)
      } else {
        toast.error(d.passwordChangeFailed)
      }
    } finally {
      setSavingPassword(false)
    }
  }

  async function toggleSmsConsent(value: boolean) {
    if (!profile) return
    setSavingConsent(true)
    const date = value ? new Date().toISOString().split("T")[0] : null
    try {
      await updateDoc(doc(db, "clients", profile.uid), {
        smsConsent: value,
        smsConsentDate: date,
      })
      setSmsConsent(value)
      setSmsConsentDate(date)
      toast.success(value ? d.smsConsentSaved : d.smsConsentRevoked)
    } catch {
      toast.error(d.smsConsentError)
    } finally {
      setSavingConsent(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">{d.h1}</h1>

      {/* Card */}
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

      {/* Personal data */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <IconUserCircle size={18} className="text-primary" />
          <span className="font-semibold">{d.personalData}</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">{d.firstName}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="surname">{d.lastName}</Label>
              <Input id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">{d.phone}</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="np. 500 600 700" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">{d.email}</Label>
            <Input id="email" value={profile?.email ?? ""} disabled className="cursor-not-allowed opacity-50" />
            <p className="text-xs text-muted-foreground">{d.emailNote}</p>
          </div>
          <div className="flex justify-end">
            <Button
              size="lg"
              className="gap-2 px-6 text-base font-semibold"
              disabled={savingData || !name.trim() || !surname.trim()}
              onClick={saveData}
            >
              <IconDeviceFloppy size={18} />
              {savingData ? d.saving : d.saveChanges}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Zgody */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <IconShield size={18} className="text-primary" />
          <span className="font-semibold">{d.consents}</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">{d.smsConsentLabel}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {d.smsConsentText}
              </p>
              {smsConsent && smsConsentDate && (
                <p className="mt-1 text-xs text-green-600 dark:text-green-400 font-medium">
                  {d.smsConsentGranted(new Date(smsConsentDate).toLocaleDateString(dict.dateLocale, { day: "2-digit", month: "long", year: "numeric" }))}
                </p>
              )}
            </div>
            <Switch
              checked={smsConsent}
              onCheckedChange={toggleSmsConsent}
              disabled={savingConsent}
              className="mt-0.5 shrink-0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <IconLock size={18} className="text-primary" />
          <span className="font-semibold">{d.changePassword}</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="currentPassword">{d.currentPassword}</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newPassword">{d.newPassword}</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newPassword2">{d.repeatNewPassword}</Label>
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
              {savingPassword ? d.changingPassword : d.changePasswordBtn}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
