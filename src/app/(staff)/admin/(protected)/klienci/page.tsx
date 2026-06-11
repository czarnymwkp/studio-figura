"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconUserPlus, IconTrash, IconGripVertical, IconPencil, IconSearch } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const CLIENTS = [
  {
    name: "Anna",
    surname: "Kowalska",
    email: "anna.kowalska@gmail.com",
    phone: "601 234 567",
    subscription: true,
    lastVisit: "2026-05-28",
    nextVisit: "2026-06-18",
  },
  {
    name: "Marta",
    surname: "Wiśniewska",
    email: "marta.w@gmail.com",
    phone: "512 345 678",
    subscription: false,
    lastVisit: "2026-06-01",
    nextVisit: "2026-06-20",
  },
  {
    name: "Karolina",
    surname: "Nowak",
    email: "karolina.nowak@wp.pl",
    phone: "698 456 789",
    subscription: true,
    lastVisit: "2026-06-05",
    nextVisit: "2026-06-25",
  },
  {
    name: "Joanna",
    surname: "Zielińska",
    email: "joanna.z@onet.pl",
    phone: "724 567 890",
    subscription: true,
    lastVisit: "2026-05-20",
    nextVisit: "2026-07-01",
  },
  {
    name: "Paulina",
    surname: "Wójcik",
    email: "paulina.wojcik@gmail.com",
    phone: "531 678 901",
    subscription: false,
    lastVisit: "2026-05-15",
    nextVisit: null,
  },
  {
    name: "Ewa",
    surname: "Kaczmarek",
    email: "ewa.k@interia.pl",
    phone: "603 789 012",
    subscription: false,
    lastVisit: "2026-06-08",
    nextVisit: "2026-06-22",
  },
  {
    name: "Agnieszka",
    surname: "Lewandowska",
    email: "agnieszka.l@gmail.com",
    phone: "789 012 345",
    subscription: true,
    lastVisit: "2026-06-10",
    nextVisit: "2026-06-30",
  },
]

function formatDate(date: string | null) {
  if (!date) return <span className="text-muted-foreground">—</span>
  return new Date(date).toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export default function KlienciPage() {
  const router = useRouter()
  const [clients, setClients] = useState(CLIENTS)
  const [query, setQuery] = useState("")
  const dragIndex = useRef<number | null>(null)

  const filtered = query.trim().length < 3
    ? clients
    : clients.filter((c) => {
        const q = query.toLowerCase()
        return (
          c.name.toLowerCase().includes(q) ||
          c.surname.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.replace(/\s/g, "").includes(q.replace(/\s/g, ""))
        )
      })

  const handleDragStart = (index: number) => {
    dragIndex.current = index
  }

  const handleDrop = (dropIndex: number) => {
    const from = dragIndex.current
    if (from === null || from === dropIndex) return
    const updated = [...clients]
    const [moved] = updated.splice(from, 1)
    updated.splice(dropIndex, 0, moved)
    setClients(updated)
    dragIndex.current = null
  }

  const handleDelete = (email: string) => {
    setClients((prev) => prev.filter((c) => c.email !== email))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Klienci</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Szukaj po imieniu, nazwisku, emailu lub telefonie..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 w-80"
            />
          </div>
          <Button size="lg" className="text-base font-semibold px-6" onClick={() => router.push("/admin/klienci/dodaj")}>
            <IconUserPlus size={20} />
            Dodaj klienta
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/40 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/10 hover:bg-primary/10">
              <TableHead className="w-8" />
              <TableHead className="font-semibold text-foreground">Imię</TableHead>
              <TableHead className="font-semibold text-foreground">Nazwisko</TableHead>
              <TableHead className="font-semibold text-foreground">Email</TableHead>
              <TableHead className="font-semibold text-foreground">Telefon</TableHead>
              <TableHead className="font-semibold text-foreground text-center">Subskrypcja</TableHead>
              <TableHead className="font-semibold text-foreground">Ostatnia wizyta</TableHead>
              <TableHead className="font-semibold text-foreground">Następna wizyta</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((client, i) => (
              <TableRow
                key={client.email}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(i)}
                className={`transition-colors ${dragIndex.current === i ? "opacity-40" : ""} ${i % 2 === 0 ? "" : "bg-muted/30"}`}
              >
                <TableCell className="text-muted-foreground cursor-grab active:cursor-grabbing">
                  <IconGripVertical size={16} />
                </TableCell>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.surname}</TableCell>
                <TableCell className="text-muted-foreground">{client.email}</TableCell>
                <TableCell className="text-muted-foreground">{client.phone}</TableCell>
                <TableCell className="text-center">
                  {client.subscription
                    ? <Badge className="bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/20">Aktywna</Badge>
                    : <Badge variant="outline" className="text-muted-foreground">Brak</Badge>
                  }
                </TableCell>
                <TableCell>{formatDate(client.lastVisit)}</TableCell>
                <TableCell>{formatDate(client.nextVisit)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="size-8">
                      <IconPencil size={15} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(client.email)}
                    >
                      <IconTrash size={15} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
