"use client"

import { useEffect, useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { addTutorial, updateTutorial, type Tutorial } from "@/lib/firebase/tutorials"

const PRESET_CATEGORIES = ["Maszyny", "Zabiegi", "Szkolenia", "Procedury"]

interface Props {
  open: boolean
  onClose: () => void
  tutorial?: Tutorial | null
}

const EMPTY = { title: "", description: "", url: "", category: "" }

export function TutorialDialog({ open, onClose, tutorial }: Props) {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(tutorial
        ? { title: tutorial.title, description: tutorial.description, url: tutorial.url, category: tutorial.category }
        : EMPTY
      )
    }
  }, [open, tutorial])

  const set = (key: keyof typeof EMPTY, val: string) =>
    setForm((f) => ({ ...f, [key]: val }))

  const handleSave = async () => {
    if (!form.title.trim() || !form.url.trim()) return
    setSaving(true)
    try {
      if (tutorial) {
        await updateTutorial(tutorial.id, form)
      } else {
        await addTutorial(form)
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const isEdit = !!tutorial

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edytuj tutorial" : "Nowy tutorial"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tut-url">Link YouTube / Vimeo *</Label>
            <Input
              id="tut-url"
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tut-title">Tytuł *</Label>
            <Input
              id="tut-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="np. Obsługa lasera diodowego"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tut-desc">Opis</Label>
            <textarea
              id="tut-desc"
              value={form.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => set("description", e.target.value)}
              rows={3}
              placeholder="Krótki opis czego dotyczy tutorial..."
              className={cn(
                "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tut-category">Kategoria</Label>
            <Input
              id="tut-category"
              list="tut-category-list"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="np. Maszyny"
            />
            <datalist id="tut-category-list">
              {PRESET_CATEGORIES.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Anuluj</Button>
          <Button
            onClick={handleSave}
            disabled={saving || !form.title.trim() || !form.url.trim()}
            className="font-semibold"
          >
            {saving ? "Zapisuję..." : isEdit ? "Zapisz zmiany" : "Dodaj tutorial"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
