"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { IconPlus, IconBrandFacebook, IconPencil, IconTrash } from "@tabler/icons-react"
import { usePromotions } from "@/lib/hooks/usePromotions"
import { togglePromotion, deletePromotion, type Promotion } from "@/lib/firebase/promotions"
import { PromotionDialog } from "@/components/admin/PromotionDialog"
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

function formatDate(iso: string) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export default function PromocjePage() {
  const { promotions, loading } = usePromotions()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editPromo, setEditPromo] = useState<Promotion | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteName, setDeleteName] = useState("")

  const openAdd = () => { setEditPromo(null); setDialogOpen(true) }
  const openEdit = (p: Promotion) => { setEditPromo(p); setDialogOpen(true) }
  const confirmDelete = (p: Promotion) => { setDeleteId(p.id); setDeleteName(p.name) }
  const handleDelete = async () => { if (deleteId) await deletePromotion(deleteId); setDeleteId(null) }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Promocje</h1>
        <Button size="lg" className="text-base font-semibold px-6" onClick={openAdd}>
          <IconPlus size={18} />
          Dodaj promocję
        </Button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Ładowanie...</p>}

      {!loading && promotions.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-16 text-center">
          <p className="font-semibold text-muted-foreground">Brak promocji</p>
          <p className="text-sm text-muted-foreground">Kliknij „Dodaj promocję", aby stworzyć pierwszą.</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className={`flex rounded-2xl border overflow-hidden transition-colors ${promo.active ? "border-primary/40 bg-primary/5" : "border-border bg-muted/20 opacity-70"}`}
          >
            {/* Zdjęcie */}
            <div className="relative w-48 shrink-0 bg-muted">
              {promo.image ? (
                <Image src={promo.image} alt={promo.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Brak zdjęcia</div>
              )}
              <div className="absolute top-3 left-3">
                <Badge className="bg-primary text-primary-foreground text-sm font-bold px-2 py-0.5 shadow">
                  {promo.discount}
                </Badge>
              </div>
            </div>

            {/* Treść */}
            <div className="flex flex-1 flex-col justify-between p-5 gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-base font-semibold leading-tight">{promo.name}</h2>
                  <Badge
                    variant="outline"
                    className={promo.active
                      ? "border-primary/40 text-primary shrink-0"
                      : "border-muted-foreground/30 text-muted-foreground shrink-0"}
                  >
                    {promo.active ? "Aktywna" : "Nieaktywna"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{promo.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Ważna do: <span className="font-medium text-foreground">{formatDate(promo.validUntil)}</span>
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 border-[#1877F2]/40 text-[#1877F2] hover:bg-[#1877F2]/10 hover:text-[#1877F2]"
                  >
                    <IconBrandFacebook size={15} />
                    Post na FB
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => openEdit(promo)}
                  >
                    <IconPencil size={14} />
                    Edytuj
                  </Button>
                  <Button
                    size="sm"
                    variant={promo.active ? "outline" : "default"}
                    onClick={() => togglePromotion(promo.id, !promo.active)}
                  >
                    {promo.active ? "Dezaktywuj" : "Aktywuj"}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => confirmDelete(promo)}
                  >
                    <IconTrash size={15} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PromotionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        promotion={editPromo}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć promocję?</AlertDialogTitle>
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
