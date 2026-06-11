"use client"

import { useRouter } from "next/navigation"
import { ClientDialog } from "@/components/admin/ClientDialog"

export default function DodajKlientaPage() {
  const router = useRouter()
  return (
    <ClientDialog
      open={true}
      onClose={() => router.push("/admin/klienci")}
      client={null}
    />
  )
}
