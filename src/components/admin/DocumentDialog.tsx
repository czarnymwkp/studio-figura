"use client"

import { useEffect, useRef, useState } from "react"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase/config"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { IconUpload, IconFileTypePdf, IconX } from "@tabler/icons-react"
import { addDocument, updateDocument, type StudioDocument } from "@/lib/firebase/documents"

const PRESET_CATEGORIES = ["Obsługa maszyn", "Przeciwwskazania", "Procedury", "BHP", "Szkolenia"]

interface Props {
  open: boolean
  onClose: () => void
  document?: StudioDocument | null
}

const EMPTY = { title: "", description: "", fileUrl: "", fileName: "", category: "" }

export function DocumentDialog({ open, onClose, document }: Props) {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setForm(document
        ? {
            title: document.title,
            description: document.description,
            fileUrl: document.fileUrl,
            fileName: document.fileName,
            category: document.category,
          }
        : EMPTY
      )
    }
  }, [open, document])

  const set = (key: keyof typeof EMPTY, val: string) =>
    setForm((f) => ({ ...f, [key]: val }))

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const storageRef = ref(storage, `documents/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      setForm((f) => ({ ...f, fileUrl: url, fileName: file.name }))
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.fileUrl) return
    setSaving(true)
    try {
      if (document) {
        await updateDocument(document.id, form)
      } else {
        await addDocument(form)
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const isEdit = !!document

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edytuj dokument" : "Nowy dokument"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Upload PDF */}
          <div className="flex flex-col gap-1.5">
            <Label>Plik PDF *</Label>
            {form.fileUrl ? (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
                <IconFileTypePdf size={28} className="shrink-0 text-red-600" />
                <span className="flex-1 truncate text-sm font-medium">{form.fileName}</span>
                <button
                  onClick={() => setForm((f) => ({ ...f, fileUrl: "", fileName: "" }))}
                  className="flex size-6 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
                >
                  <IconX size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors disabled:cursor-wait"
              >
                <IconUpload size={22} />
                <span className="text-sm">{uploading ? "Przesyłam..." : "Kliknij, aby wybrać plik PDF"}</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleFile} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="doc-title">Tytuł *</Label>
            <Input
              id="doc-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="np. Instrukcja obsługi lasera diodowego"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="doc-desc">Opis</Label>
            <textarea
              id="doc-desc"
              value={form.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => set("description", e.target.value)}
              rows={2}
              placeholder="Krótki opis zawartości dokumentu..."
              className={cn(
                "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="doc-category">Kategoria</Label>
            <Input
              id="doc-category"
              list="doc-category-list"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="np. Obsługa maszyn"
            />
            <datalist id="doc-category-list">
              {PRESET_CATEGORIES.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Anuluj</Button>
          <Button
            onClick={handleSave}
            disabled={saving || uploading || !form.title.trim() || !form.fileUrl}
            className="font-semibold"
          >
            {saving ? "Zapisuję..." : isEdit ? "Zapisz zmiany" : "Dodaj dokument"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
