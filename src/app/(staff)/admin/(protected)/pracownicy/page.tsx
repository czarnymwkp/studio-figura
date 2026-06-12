"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { IconUserPlus, IconUsers } from "@tabler/icons-react"
import { EmployeeCard } from "@/components/admin/EmployeeCard"
import { SkillsDialog } from "@/components/admin/SkillsDialog"
import { subscribeEmployees, type Employee } from "@/lib/firebase/schedule"
import { Skeleton } from "@/components/ui/skeleton"

export default function PracownicyPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [skillsTarget, setSkillsTarget] = useState<Employee | null>(null)

  useEffect(() => {
    return subscribeEmployees((data) => {
      setEmployees(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pracownicy</h1>
        <Button size="lg" className="text-base font-semibold px-6" onClick={() => router.push("/admin/pracownicy/dodaj")}>
          <IconUserPlus size={20} />
          Dodaj pracownika
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <Skeleton className="aspect-[3/4] rounded-2xl" />
          <Skeleton className="aspect-[3/4] rounded-2xl" />
          <Skeleton className="aspect-[3/4] rounded-2xl" />
        </div>
      ) : employees.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border p-12 text-center">
          <IconUsers size={32} className="text-muted-foreground" />
          <p className="font-semibold">Brak pracowników</p>
          <p className="text-sm text-muted-foreground">
            Dodaj pierwszego pracownika przyciskiem powyżej.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {employees.map((emp) => (
            <EmployeeCard
              key={emp.uid}
              name={`${emp.name} ${emp.surname}`}
              position={emp.position}
              skillsCount={emp.skills.length}
              onClick={() => setSkillsTarget(emp)}
            />
          ))}
        </div>
      )}

      <SkillsDialog employee={skillsTarget} onClose={() => setSkillsTarget(null)} />
    </div>
  )
}
