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

const EMPTY = { name: "", description: "", discount: "", validUntil: "", imageSquare: "", imageWide: "", active: true }

export function PromotionDialog({ open, onClose, promotion }: Props) {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploadingSquare, setUploadingSquare] = useState(false)
  const [uploadingWide, setUploadingWide] = useState(false)
  const fileSquareRef = useRef<HTMLInputElement>(null)
  const fileWideRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setForm(promotion
        ? {
            name: promotion.name,
            description: promotion.description,
            discount: promotion.discount,
            validUntil: promotion.validUntil,
            imageSquare: promotion.imageSquare ?? "",
            imageWide: promotion.imageWide ?? "",
            active: promotion.active,
          }
        : EMPTY
      )
    }
  }, [open, promotion])

  const set = (key: keyof typeof EMPTY, val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }))

  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "imageSquare" | "imageWide",
    setUploading: (v: boolean) => void,
    fileRef: React.RefObject<HTMLInputElement | null>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const storageRef = ref(storage, `promotions/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      set(field, url)
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
  const anyUploading = uploadingSquare || uploadingWide

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edytuj promocję" : "Nowa promocja"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Banery */}
          <div className="flex flex-col gap-3">
            <Label>Banery</Label>
            <div className="grid grid-cols-2 gap-3">
              {/* Kwadratowy — Instagram */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground">Instagram (1:1)</span>
                {form.imageSquare ? (
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-border">
                    <Image src={form.imageSquare} alt="baner instagram" fill className="object-cover" />
                    <button
                      onClick={() => set("imageSquare", "")}
                      className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                    >
                      <IconX size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileSquareRef.current?.click()}
                    disabled={uploadingSquare}
                    className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors disabled:cursor-wait"
                  >
                    <IconUpload size={20} />
                    <span className="text-xs">{uploadingSquare ? "Przesyłam..." : "Dodaj"}</span>
                  </button>
                )}
                <input
                  ref={fileSquareRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e, "imageSquare", setUploadingSquare, fileSquareRef)}
                />
              </div>

              {/* Poziomy — Facebook + strona */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground">Facebook / Strona (16:9)</span>
                {form.imageWide ? (
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-border">
                    <Image src={form.imageWide} alt="baner facebook" fill className="object-cover" />
                    <button
                      onClick={() => set("imageWide", "")}
                      className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                    >
                      <IconX size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileWideRef.current?.click()}
                    disabled={uploadingWide}
                    className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors disabled:cursor-wait"
                  >
                    <IconUpload size={20} />
                    <span className="text-xs">{uploadingWide ? "Przesyłam..." : "Dodaj"}</span>
                  </button>
                )}
                <input
                  ref={fileWideRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e, "imageWide", setUploadingWide, fileWideRef)}
                />
              </div>
            </div>
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
            disabled={saving || anyUploading || !form.name.trim() || !form.discount.trim()}
            className="font-semibold"
          >
            {saving ? "Zapisuję..." : isEdit ? "Zapisz zmiany" : "Dodaj promocję"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
