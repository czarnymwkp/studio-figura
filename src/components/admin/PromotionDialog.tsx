"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase/config"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { IconUpload, IconX } from "@tabler/icons-react"
import { addPromotion, updatePromotion, type Promotion } from "@/lib/firebase/promotions"


interface Props {
  open: boolean
  onClose: () => void
  promotion?: Promotion | null
}

const EMPTY = { name: "", description: "", discount: "", validUntil: "", image: "", active: true }

export function PromotionDialog({ open, onClose, promotion }: Props) {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setForm(promotion
        ? { name: promotion.name, description: promotion.description, discount: promotion.discount, validUntil: promotion.validUntil, image: promotion.image, active: promotion.active }
        : EMPTY
      )
    }
  }, [open, promotion])

  const set = (key: keyof typeof EMPTY, val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }))

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const storageRef = ref(storage, `promotions/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      set("image", url)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.discount.trim()) return
    setSaving(true)
    try {
      if (promotion) {
        await updatePromotion(promotion.id, form)
      } else {
        await addPromotion(form)
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const isEdit = !!promotion

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edytuj promocję" : "Nowa promocja"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Zdjęcie */}
          <div className="flex flex-col gap-2">
            <Label>Zdjęcie</Label>
            {form.image ? (
              <div className="relative h-40 w-full rounded-xl overflow-hidden border border-border">
                <Image src={form.image} alt="promo" fill className="object-cover" />
                <button
                  onClick={() => set("image", "")}
                  className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <IconX size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors disabled:cursor-wait"
              >
                <IconUpload size={24} />
                <span className="text-sm">{uploading ? "Przesyłam..." : "Kliknij, aby wybrać zdjęcie"}</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="promo-name">Nazwa promocji *</Label>
            <Input id="promo-name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="np. Lato z laserami" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="promo-desc">Opis</Label>
            <textarea
              id="promo-desc"
              value={form.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => set("description", e.target.value)}
              rows={3}
              placeholder="Krótki opis promocji widoczny dla klientów..."
              className={cn(
                "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="promo-discount">Rabat *</Label>
              <Input id="promo-discount" value={form.discount} onChange={(e) => set("discount", e.target.value)} placeholder="np. -20% lub 50 zł" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="promo-until">Ważna do</Label>
              <Input id="promo-until" type="date" value={form.validUntil} onChange={(e) => set("validUntil", e.target.value)} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Anuluj</Button>
          <Button
            onClick={handleSave}
            disabled={saving || uploading || !form.name.trim() || !form.discount.trim()}
            className="font-semibold"
          >
            {saving ? "Zapisuję..." : isEdit ? "Zapisz zmiany" : "Dodaj promocję"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
