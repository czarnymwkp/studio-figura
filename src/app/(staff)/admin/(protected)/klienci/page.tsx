"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { IconUserPlus, IconTrash, IconGripVertical, IconPencil, IconSearch, IconMinus, IconMessage, IconDownload, IconUpload } from "@tabler/icons-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useClients } from "@/lib/hooks/useClients"
import { addClient, deleteClient, subtractVisit, type Client } from "@/lib/firebase/clients"
import { ClientDialog } from "@/components/admin/ClientDialog"
import { ClientSmsDialog } from "@/components/admin/ClientSmsDialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// --- CSV export ---
function exportCSV(clients: Client[]) {
  const headers = ["Imię", "Nazwisko", "Email", "Telefon", "Karnet", "Wejść w karnecie", "Wejść użytych", "Ostatnia wizyta", "Następna wizyta"]
  const rows = clients.map((c) => [
    c.name, c.surname, c.email, c.phone,
    c.subscription ? "TAK" : "NIE",
    c.subscriptionTotal ?? "",
    c.subscriptionUsed ?? "",
    c.lastVisit ?? "",
    c.nextVisit ?? "",
  ])
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n")
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `klienci_${new Date().toISOString().split("T")[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// --- CSV import ---
function parseCSVRows(text: string): string[][] {
  return text.trim().split(/\r?\n/).map((line) => {
    const cells: string[] = []
    let cur = ""
    let inQ = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++ }
        else inQ = !inQ
      } else if (ch === "," && !inQ) {
        cells.push(cur.trim())
        cur = ""
      } else {
        cur += ch
      }
    }
    cells.push(cur.trim())
    return cells
  })
}

const COL_MAP: Record<string, keyof Omit<Client, "id">> = {
  "imię": "name", "imie": "name", "name": "name",
  "nazwisko": "surname", "surname": "surname",
  "email": "email", "e-mail": "email",
  "telefon": "phone", "phone": "phone", "tel": "phone",
  "karnet": "subscription", "subscription": "subscription",
  "wejść w karnecie": "subscriptionTotal", "wejsc w karnecie": "subscriptionTotal", "subscriptiontotal": "subscriptionTotal",
  "wejść użytych": "subscriptionUsed", "wejsc uzytych": "subscriptionUsed", "subscriptionused": "subscriptionUsed",
  "ostatnia wizyta": "lastVisit", "lastvisit": "lastVisit",
  "następna wizyta": "nextVisit", "nastepna wizyta": "nextVisit", "nextvisit": "nextVisit",
}

function parseImport(text: string): Omit<Client, "id">[] {
  const rows = parseCSVRows(text)
  if (rows.length < 2) return []
  const headerRow = rows[0].map((h) => h.toLowerCase().replace(/["﻿]/g, "").trim())
  const colIdx: Partial<Record<keyof Omit<Client, "id">, number>> = {}
  headerRow.forEach((h, i) => {
    const field = COL_MAP[h]
    if (field) colIdx[field] = i
  })
  const get = (row: string[], field: keyof Omit<Client, "id">) => {
    const i = colIdx[field]
    return i !== undefined ? row[i]?.trim() ?? "" : ""
  }
  return rows.slice(1).flatMap((row) => {
    const name = get(row, "name")
    const surname = get(row, "surname")
    if (!name && !surname) return []
    const subRaw = get(row, "subscription").toUpperCase()
    const subscription = subRaw === "TAK" || subRaw === "TRUE" || subRaw === "1"
    const total = parseInt(get(row, "subscriptionTotal"))
    const used = parseInt(get(row, "subscriptionUsed"))
    return [{
      name,
      surname,
      email: get(row, "email"),
      phone: get(row, "phone"),
      subscription,
      subscriptionTotal: isNaN(total) ? null : total,
      subscriptionUsed: isNaN(used) ? null : used,
      lastVisit: get(row, "lastVisit") || null,
      nextVisit: get(row, "nextVisit") || null,
    }]
  })
}

function formatDate(date: string | null) {
  if (!date) return <span className="text-muted-foreground">—</span>
  return new Date(date).toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export default function KlienciPage() {
  const { clients, loading } = useClients()
  const [query, setQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editClient, setEditClient] = useState<Client | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteName, setDeleteName] = useState("")
  const [subtractConfirm, setSubtractConfirm] = useState<string | null>(null)
  const [smsClient, setSmsClient] = useState<Client | null>(null)
  const [importData, setImportData] = useState<Omit<Client, "id">[] | null>(null)
  const [importing, setImporting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const dragIndex = useRef<number | null>(null)
  const csvImportRef = useRef<HTMLInputElement>(null)

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setImportData(parseImport(text))
    }
    reader.readAsText(file, "UTF-8")
    if (csvImportRef.current) csvImportRef.current.value = ""
  }

  const handleImportConfirm = async () => {
    if (!importData) return
    setImporting(true)
    try {
      await Promise.all(importData.map((c) => addClient(c)))
    } finally {
      setImporting(false)
      setImportData(null)
    }
  }

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

  const allSelected = filtered.length > 0 && filtered.every((c) => selectedIds.has(c.id))
  const someSelected = !allSelected && filtered.some((c) => selectedIds.has(c.id))

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(filtered.map((c) => c.id)))
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openAdd = () => { setEditClient(null); setDialogOpen(true) }
  const openEdit = (client: Client) => { setEditClient(client); setDialogOpen(true) }
  const confirmDelete = (client: Client) => { setDeleteId(client.id); setDeleteName(`${client.name} ${client.surname}`) }
  const handleDelete = () => { if (deleteId) deleteClient(deleteId); setDeleteId(null) }

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
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => exportCSV(selectedIds.size > 0 ? clients.filter((c) => selectedIds.has(c.id)) : clients)}>
            <IconDownload size={15} />
            {selectedIds.size > 0 ? `Eksportuj (${selectedIds.size})` : "Eksportuj CSV"}
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => csvImportRef.current?.click()}>
            <IconUpload size={15} />
            Importuj CSV
          </Button>
          <input ref={csvImportRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleImportFile} />
          <Button size="lg" className="text-base font-semibold px-6" onClick={openAdd}>
            <IconUserPlus size={20} />
            Dodaj klienta
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/40 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/10 hover:bg-primary/10">
              <TableHead className="w-8 pl-4">
                <Checkbox
                  checked={someSelected ? "indeterminate" : allSelected}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="w-8" />
              <TableHead className="font-semibold text-foreground">Imię</TableHead>
              <TableHead className="font-semibold text-foreground">Nazwisko</TableHead>
              <TableHead className="font-semibold text-foreground">Email</TableHead>
              <TableHead className="font-semibold text-foreground">Telefon</TableHead>
              <TableHead className="font-semibold text-foreground text-center">Karnet</TableHead>
              <TableHead className="font-semibold text-foreground">Ostatnia wizyta</TableHead>
              <TableHead className="font-semibold text-foreground">Następna wizyta</TableHead>
              <TableHead className="w-40" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground py-10">
                  Ładowanie...
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground py-10">
                  Brak klientów
                </TableCell>
              </TableRow>
            )}
            {filtered.map((client, i) => (
              <TableRow
                key={client.id}
                draggable
                onDragStart={() => { dragIndex.current = i }}
                onDragOver={(e) => e.preventDefault()}
                className={i % 2 === 0 ? "" : "bg-muted/30"}
              >
                <TableCell className="pl-4">
                  <Checkbox
                    checked={selectedIds.has(client.id)}
                    onCheckedChange={() => toggleSelect(client.id)}
                  />
                </TableCell>
                <TableCell className="text-muted-foreground cursor-grab active:cursor-grabbing">
                  <IconGripVertical size={16} />
                </TableCell>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.surname}</TableCell>
                <TableCell className="text-muted-foreground">{client.email}</TableCell>
                <TableCell className="text-muted-foreground">{client.phone}</TableCell>
                <TableCell className="text-center">
                  {client.subscription && client.subscriptionTotal != null ? (() => {
                    const used = client.subscriptionUsed ?? 0
                    const remaining = Math.max(0, client.subscriptionTotal - used)
                    const low = remaining <= 2
                    return (
                      <span className={`text-sm font-semibold tabular-nums ${low ? "text-destructive" : "text-green-500"}`}>
                        {remaining}/{client.subscriptionTotal}
                      </span>
                    )
                  })() : client.subscription
                    ? <Badge className="bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/20">Aktywny</Badge>
                    : <Badge variant="outline" className="text-muted-foreground">Brak</Badge>
                  }
                </TableCell>
                <TableCell>{formatDate(client.lastVisit)}</TableCell>
                <TableCell>{formatDate(client.nextVisit)}</TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    {client.subscription && client.subscriptionTotal != null && (
                      subtractConfirm === client.id ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                          onClick={async () => {
                            await subtractVisit(client.id)
                            setSubtractConfirm(null)
                          }}
                        >
                          Potwierdź −1
                        </Button>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-primary hover:text-primary hover:bg-primary/10"
                          title="Odejmij zabieg z karnetu"
                          onClick={() => setSubtractConfirm(client.id)}
                          onBlur={() => setTimeout(() => setSubtractConfirm(null), 200)}
                        >
                          <IconMinus size={15} />
                        </Button>
                      )
                    )}
                    <Button
                      size="icon" variant="ghost"
                      className="size-8 text-primary hover:text-primary hover:bg-primary/10"
                      title="Wyślij SMS"
                      onClick={() => setSmsClient(client)}
                    >
                      <IconMessage size={15} />
                    </Button>
                    <Button size="icon" variant="ghost" className="size-8" onClick={() => openEdit(client)}>
                      <IconPencil size={15} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => confirmDelete(client)}
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

      <ClientDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        client={editClient}
      />

      <ClientSmsDialog
        client={smsClient}
        onClose={() => setSmsClient(null)}
      />

      {/* Import confirm */}
      <AlertDialog open={importData !== null} onOpenChange={(v) => !v && setImportData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Importować klientów?</AlertDialogTitle>
            <AlertDialogDescription>
              {importData?.length === 0
                ? "Nie znaleziono żadnych prawidłowych wierszy w pliku. Sprawdź czy plik ma nagłówki: Imię, Nazwisko, Email, Telefon."
                : <>Znaleziono <strong>{importData?.length}</strong> klientów do zaimportowania. Zostaną dodani do istniejącej listy (duplikaty nie są usuwane automatycznie).</>
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            {(importData?.length ?? 0) > 0 && (
              <AlertDialogAction onClick={handleImportConfirm} disabled={importing}>
                {importing ? "Importuję..." : `Importuj ${importData?.length} klientów`}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć klienta?</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć <strong>{deleteName}</strong>? Tej operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
