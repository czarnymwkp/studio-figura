"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { IconUserPlus, IconTrash, IconGripVertical, IconPencil, IconSearch, IconMinus, IconMessage } from "@tabler/icons-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useClients } from "@/lib/hooks/useClients"
import { deleteClient, subtractVisit, type Client } from "@/lib/firebase/clients"
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
              <TableHead className="w-8" />
              <TableHead className="font-semibold text-foreground">Imię</TableHead>
              <TableHead className="font-semibold text-foreground">Nazwisko</TableHead>
              <TableHead className="font-semibold text-foreground">Email</TableHead>
              <TableHead className="font-semibold text-foreground">Telefon</TableHead>
              <TableHead className="font-semibold text-foreground text-center">Karnet</TableHead>
              <TableHead className="font-semibold text-foreground">Ostatnia wizyta</TableHead>
              <TableHead className="font-semibold text-foreground">Następna wizyta</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-10">
                  Ładowanie...
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-10">
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
                  <div className="flex gap-1">
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
