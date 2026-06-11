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

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const [firebaseError, setFirebaseError] = useState("")

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
        setFirebaseError("Brak profilu. Skontaktuj się z administratorem.")
        await auth.signOut()
        return
      }

      const profile = userDoc.data() as UserProfile

      if (profile.role === "client") {
        router.push("/dashboard")
      } else if (profile.role === "admin" || profile.role === "employee") {
        router.push("/admin/dashboard")
      } else {
        setFirebaseError("Brak uprawnień.")
        await auth.signOut()
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-credential":
            setFirebaseError("Nieprawidłowy email lub hasło.")
            break
          case "auth/too-many-requests":
            setFirebaseError("Zbyt wiele prób. Spróbuj później.")
            break
          default:
            setFirebaseError("Wystąpił błąd. Spróbuj ponownie.")
        }
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <Image src="/img/logo.png" alt="Studio Figura" width={64} height={64} />
                <h1 className="text-2xl font-bold">Studio Figura</h1>
                <p className="text-balance text-sm text-muted-foreground">
                  Zaloguj się do swojego konta
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" {...register("email")} />
                  {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="password">Hasło</Label>
                  <Input id="password" type="password" {...register("password")} />
                  {errors.password && <span className="text-xs text-destructive">{errors.password.message}</span>}
                </div>
                {firebaseError && <span className="text-sm text-destructive text-center">{firebaseError}</span>}
                <Button type="submit" className="w-full" disabled={!isDirty || !isValid || isSubmitting}>
                  Zaloguj
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
