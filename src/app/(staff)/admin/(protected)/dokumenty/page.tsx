"use client"

import { useMemo, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  IconPlus, IconPencil, IconTrash, IconDownload, IconFileTypePdf, IconFileDescription,
} from "@tabler/icons-react"
import { useDocuments } from "@/lib/hooks/useDocuments"
import { deleteDocument, type StudioDocument } from "@/lib/firebase/documents"
import { DocumentDialog } from "@/components/admin/DocumentDialog"

export default function DokumentyPage() {
  const { documents, loading } = useDocuments()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDoc, setEditDoc] = useState<StudioDocument | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteTitle, setDeleteTitle] = useState("")
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(() => searchParams.get("kat") ?? "Wszystkie")

  useEffect(() => {
    setActiveCategory(searchParams.get("kat") ?? "Wszystkie")
  }, [searchParams])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(documents.map((d) => d.category).filter(Boolean)))
    return ["Wszystkie", ...cats.sort()]
  }, [documents])

  const filtered = activeCategory === "Wszystkie"
    ? documents
    : documents.filter((d) => d.category === activeCategory)

  const openAdd = () => { setEditDoc(null); setDialogOpen(true) }
  const openEdit = (d: StudioDocument) => { setEditDoc(d); setDialogOpen(true) }
  const confirmDelete = (d: StudioDocument) => { setDeleteId(d.id); setDeleteTitle(d.title) }
  const handleDelete = async () => { if (deleteId) await deleteDocument(deleteId); setDeleteId(null) }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dokumenty</h1>
        <Button size="lg" className="text-base font-semibold px-6" onClick={openAdd}>
          <IconPlus size={18} />
          Dodaj dokument
        </Button>
      </div>

      {/* Filtr kategorii */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="text-sm text-muted-foreground">Ładowanie...</p>}

      {!loading && documents.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-16 text-center">
          <IconFileDescription size={40} className="text-muted-foreground/40" />
          <p className="font-semibold text-muted-foreground">Brak dokumentów</p>
          <p className="text-sm text-muted-foreground">Kliknij „Dodaj dokument", aby dodać pierwszy plik PDF.</p>
        </div>
      )}

      {!loading && filtered.length === 0 && documents.length > 0 && (
        <p className="text-sm text-muted-foreground">Brak dokumentów w tej kategorii.</p>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4 transition-shadow hover:shadow-sm"
          >
            <IconFileTypePdf size={36} className="shrink-0 text-red-600" />

            <div className="flex flex-1 flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold leading-tight">{d.title}</span>
                {d.category && (
                  <Badge variant="outline" className="border-primary/30 text-primary text-xs shrink-0">
                    {d.category}
                  </Badge>
                )}
              </div>
              {d.description && (
                <p className="text-sm text-muted-foreground truncate">{d.description}</p>
              )}
              {d.fileName && (
                <p className="text-xs text-muted-foreground/60 truncate">{d.fileName}</p>
              )}
            </div>

            <div className="flex shrink-0 gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                asChild
              >
                <a href={d.fileUrl} target="_blank" rel="noopener noreferrer">
                  <IconDownload size={14} />
                  Pobierz
                </a>
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openEdit(d)}>
                <IconPencil size={14} />
                Edytuj
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => confirmDelete(d)}
              >
                <IconTrash size={15} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <DocumentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        document={editDoc}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć dokument?</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć <strong>{deleteTitle}</strong>? Tej operacji nie można cofnąć.
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
