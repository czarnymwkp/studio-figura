import { getDictionary } from "@/lib/i18n"
import { LoginForm } from "@/components/login-form"

export default async function EnLoginPage() {
  const dict = await getDictionary("en")
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-background via-background to-primary/10 p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm lang="en" loginDict={dict.login} />
      </div>
    </div>
  )
}
