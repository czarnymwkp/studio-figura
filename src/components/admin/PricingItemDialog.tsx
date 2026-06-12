"use client"

import { useEffect, useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconPlus, IconTag, IconClock, IconCurrencyZloty, IconLayoutList, IconTool } from "@tabler/icons-react"
import {
  addItem, updateItem, addCategory,
  type PriceItem, type PriceCategory,
} from "@/lib/firebase/pricing"
import { subscribeDevices, type Device } from "@/lib/firebase/devices"

interface Props {
  open: boolean
  onClose: () => void
  categories: PriceCategory[]
  editData?: { categoryId: string; item: PriceItem } | null
}

const EMPTY: PriceItem = { name: "", duration: "", price: "", device: "" }

export function PricingItemDialog({ open, onClose, categories, editData }: Props) {
  const [item, setItem] = useState<PriceItem>(EMPTY)
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [isNewCategory, setIsNewCategory] = useState(false)
  const [saving, setSaving] = useState(false)
  const [devices, setDevices] = useState<Device[]>([])

  useEffect(() => subscribeDevices(setDevices), [])

  useEffect(() => {
    if (!open) return
    if (editData) {
      setItem({ device: "", ...editData.item })
      setSelectedCategoryId(editData.categoryId)
      setIsNewCategory(false)
      setNewCategory("")
    } else {
      setItem(EMPTY)
      setSelectedCategoryId(categories[0]?.id ?? "")
      setIsNewCategory(false)
      setNewCategory("")
    }
  }, [open, editData, categories])

  const set = (field: keyof PriceItem, value: string) =>
    setItem((prev) => ({ ...prev, [field]: value }))

  const canSave = item.name.trim() && item.duration.trim() && item.price.trim() &&
    (isNewCategory ? newCategory.trim() : selectedCategoryId)

  const handleSave = async () => {
    if (!canSave) return
    setSaving(true)
    try {
      let catId = selectedCategoryId
      if (isNewCategory) {
        catId = await addCategory(newCategory.trim())
      }
      if (editData) {
        await updateItem(catId, editData.item, item)
      } else {
        await addItem(catId, item)
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const isEdit = !!editData

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">

        <div className="bg-primary/10 border-b border-primary/20 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <IconTag size={20} className="text-primary" />
              {isEdit ? "Edytuj pozycję cennika" : "Dodaj usługę do cennika"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isEdit ? "Zmień dane wybranej usługi." : "Wypełnij dane nowej usługi."}
            </p>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Kategoria */}
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-1.5 text-sm font-medium">
              <IconLayoutList size={15} className="text-primary" />
              Kategoria *
            </Label>
            {!isNewCategory ? (
              <div className="flex gap-2">
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.category}</option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 h-10 gap-1"
                  onClick={() => setIsNewCategory(true)}
                >
                  <IconPlus size={14} />
                  Nowa
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nazwa nowej kategorii..."
                  className="h-10 flex-1"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 h-10"
                  onClick={() => setIsNewCategory(false)}
                >
                  Anuluj
                </Button>
              </div>
            )}
          </div>

          {/* Nazwa usługi */}
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-1.5 text-sm font-medium">
              <IconTag size={15} className="text-primary" />
              Nazwa usługi *
            </Label>
            <Input
              value={item.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="np. Depilacja laserowa — nogi całe"
              className="h-10"
            />
          </div>

          {/* Urządzenie */}
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-1.5 text-sm font-medium">
              <IconTool size={15} className="text-primary" />
              Urządzenie
            </Label>
            <select
              value={item.device ?? ""}
              onChange={(e) => set("device", e.target.value)}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Bez urządzenia (np. masaż ręczny)</option>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.count} szt.)</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Liczba sztuk urządzenia ogranicza ile rezerwacji może trwać równolegle.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Czas */}
            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <IconClock size={15} className="text-primary" />
                Czas trwania *
              </Label>
              <Input
                value={item.duration}
                onChange={(e) => set("duration", e.target.value)}
                placeholder="np. 45 min"
                className="h-10"
              />
            </div>

            {/* Cena */}
            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <IconCurrencyZloty size={15} className="text-primary" />
                Cena *
              </Label>
              <Input
                value={item.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="np. 199 zł"
                className="h-10"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-border px-6 py-4 bg-muted/20">
          <Button variant="outline" onClick={onClose} disabled={saving} className="flex-1">
            Anuluj
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !canSave}
            size="lg"
            className="flex-1 text-base font-semibold"
          >
            {saving ? "Zapisuję..." : isEdit ? "Zapisz zmiany" : "Dodaj usługę"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
