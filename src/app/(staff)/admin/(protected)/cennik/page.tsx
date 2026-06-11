"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { IconPlus, IconPencil, IconTrash } from "@tabler/icons-react"
import { usePricing } from "@/lib/hooks/usePricing"
import { deleteItem, type PriceItem, type PriceCategory } from "@/lib/firebase/pricing"
import { PricingItemDialog } from "@/components/admin/PricingItemDialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function CennikPage() {
  const { pricing, loading } = usePricing()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editData, setEditData] = useState<{ categoryId: string; item: PriceItem } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ categoryId: string; item: PriceItem } | null>(null)

  const openAdd = () => { setEditData(null); setDialogOpen(true) }
  const openEdit = (categoryId: string, item: PriceItem) => { setEditData({ categoryId, item }); setDialogOpen(true) }
  const confirmDelete = (categoryId: string, item: PriceItem) => setDeleteTarget({ categoryId, item })
  const handleDelete = async () => {
    if (deleteTarget) await deleteItem(deleteTarget.categoryId, deleteTarget.item)
    setDeleteTarget(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cennik</h1>
        <Button size="lg" className="text-base font-semibold px-6" onClick={openAdd}>
          <IconPlus size={20} />
          Dodaj usługę
        </Button>
      </div>

      {loading && <p className="text-muted-foreground text-sm">Ładowanie...</p>}

      <div className="flex flex-col gap-6">
        {pricing.map((section: PriceCategory) => (
          <div key={section.id} className="rounded-2xl border border-primary/40 overflow-hidden">
            <div className="bg-primary/10 px-4 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-base">{section.category}</h2>
              <Button
                size="sm"
                variant="ghost"
                className="gap-1.5 text-xs text-primary hover:text-primary"
                onClick={() => { setEditData(null); setDialogOpen(true) }}
              >
                <IconPlus size={14} />
                Dodaj do tej kategorii
              </Button>
            </div>
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col className="w-[55%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left px-4 py-2 font-medium">Zabieg</th>
                  <th className="text-left px-4 py-2 font-medium">Czas</th>
                  <th className="text-left px-4 py-2 font-medium">Cena</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {section.items.map((item, i) => (
                  <tr key={item.name + i} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.duration}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{item.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-end">
                        <Button size="icon" variant="ghost" className="size-8" onClick={() => openEdit(section.id, item)}>
                          <IconPencil size={15} />
                        </Button>
                        <Button size="icon" variant="ghost" className="size-8 text-destructive hover:text-destructive" onClick={() => confirmDelete(section.id, item)}>
                          <IconTrash size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <PricingItemDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        categories={pricing}
        editData={editData}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć usługę?</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć <strong>{deleteTarget?.item.name}</strong>? Tej operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
