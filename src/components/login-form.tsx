"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FirebaseError } from "firebase/app"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { auth, db } from "@/lib/firebase/config"
import { UserProfile } from "@/types"
import loginSchema, { LoginFormValues } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import type { Dictionary } from "@/lib/i18n"
import { pl } from "@/dictionaries/pl"

const DEFAULT_LOGIN_DICT = pl.login

interface LoginFormProps extends React.ComponentProps<"div"> {
  lang?: string
  loginDict?: Dictionary["login"]
}

export function LoginForm({ className, lang = "pl", loginDict = DEFAULT_LOGIN_DICT, ...props }: LoginFormProps) {
  const router = useRouter()
  const [firebaseError, setFirebaseError] = useState("")
  const [redirecting, setRedirecting] = useState(false)
  const d = loginDict

  const { register, handleSubmit, formState: { errors, isDirty, isValid, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  })

  const onSubmit = async (data: LoginFormValues) => {
    setFirebaseError("")
    try {
      const credentials = await signInWithEmailAndPassword(auth, data.email, data.password)
      const userDoc = await getDoc(doc(db, "users", credentials.user.uid))

      if (!userDoc.exists()) {
        setFirebaseError(d.errors.noProfile)
        await auth.signOut()
        return
      }

      const profile = userDoc.data() as UserProfile

      if (profile.role === "client") {
        setRedirecting(true)
        router.push("/dashboard")
      } else if (profile.role === "admin" || profile.role === "employee") {
        setRedirecting(true)
        router.push("/admin/dashboard")
      } else {
        setFirebaseError(d.errors.noPermission)
        await auth.signOut()
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-credential":
            setFirebaseError(d.errors.invalidCredentials)
            break
          case "auth/too-many-requests":
            setFirebaseError(d.errors.tooManyRequests)
            break
          default:
            setFirebaseError(d.errors.generic)
        }
      }
    }
  }

  if (redirecting) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background">
        <Image src="/img/logo.png" alt="Studio Figura" width={72} height={72} className="rounded-xl" />
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-primary/20 bg-background p-0 shadow-xl ring-2 ring-primary/50 dark:ring-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <Image src="/img/logo.png" alt="Studio Figura" width={64} height={64} />
                <h1 className="text-2xl font-bold">Studio Figura</h1>
                <p className="text-balance text-sm text-muted-foreground">
                  {d.subtitle}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="email">{d.email}</Label>
                  <Input id="email" type="email" placeholder="email@example.com" className="border-primary/50 dark:border-input" {...register("email")} />
                  {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="password">{d.password}</Label>
                  <Input id="password" type="password" className="border-primary/50 dark:border-input" {...register("password")} />
                  {errors.password && <span className="text-xs text-destructive">{errors.password.message}</span>}
                </div>
                {firebaseError && <span className="text-sm text-destructive text-center">{firebaseError}</span>}
                <Button type="submit" className="w-full" disabled={!isDirty || !isValid || isSubmitting}>
                  {d.submit}
                </Button>
              </div>
            </div>
          </form>
          <div className="relative hidden overflow-hidden bg-muted md:block">
            <Image
              src="/img/studio-figura-login.jpg"
              alt="Studio Figura"
              fill
              className="object-cover animate-kenburns"
            />
            <div className="absolute bottom-4 right-4">
              <Image
                src="/img/logo.png"
                alt="Logo"
                width={64}
                height={64}
                className="rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
