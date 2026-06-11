"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { IconUserPlus } from "@tabler/icons-react"
import { EmployeeCard } from "@/components/admin/EmployeeCard"

const INITIAL_EMPLOYEES = [
  { id: 1, name: "Anna Kowalska", position: "Kosmetolog", image: "/img/logo.png" },
  { id: 2, name: "Marta Nowak", position: "Specjalista modelowania sylwetki", image: "/img/logo.png" },
  { id: 3, name: "Karolina Wiśniewska", position: "Laser & Depilacja", image: "/img/logo.png" },
]

export default function PracownicyPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES)
  const dragIndex = useRef<number | null>(null)

  const handleDragStart = (index: number) => {
    dragIndex.current = index
  }

  const handleDrop = (dropIndex: number) => {
    const from = dragIndex.current
    if (from === null || from === dropIndex) return

    const updated = [...employees]
    const [moved] = updated.splice(from, 1)
    updated.splice(dropIndex, 0, moved)
    setEmployees(updated)
    dragIndex.current = null
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pracownicy</h1>
        <Button size="lg" className="text-base font-semibold px-6" onClick={() => router.push("/admin/pracownicy/dodaj")}>
          <IconUserPlus size={20} />
          Dodaj pracownika
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {employees.map((emp, index) => (
          <EmployeeCard
            key={emp.id}
            {...emp}
            dragging={dragIndex.current === index}
            onDragStart={() => handleDragStart(index)}
            onDrop={() => handleDrop(index)}
          />
        ))}
      </div>
    </div>
  )
}
