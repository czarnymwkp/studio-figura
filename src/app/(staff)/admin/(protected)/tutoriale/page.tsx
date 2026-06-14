"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { IconPlus, IconPencil, IconTrash, IconPlayerPlay, IconVideo } from "@tabler/icons-react"
import { useTutorials } from "@/lib/hooks/useTutorials"
import { deleteTutorial, getThumbnailUrl, getYouTubeId, getVimeoId, type Tutorial } from "@/lib/firebase/tutorials"
import { TutorialDialog } from "@/components/admin/TutorialDialog"

function getEmbedUrl(url: string): string {
  const ytId = getYouTubeId(url)
  if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`
  const vimeoId = getVimeoId(url)
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`
  return url
}

export default function TutorialePage() {
  const { tutorials, loading } = useTutorials()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTutorial, setEditTutorial] = useState<Tutorial | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteTitle, setDeleteTitle] = useState("")
  const [playerUrl, setPlayerUrl] = useState<string | null>(null)
  const [playerTitle, setPlayerTitle] = useState("")
  const [activeCategory, setActiveCategory] = useState("Wszystkie")

  const categories = useMemo(() => {
    const cats = Array.from(new Set(tutorials.map((t) => t.category).filter(Boolean)))
    return ["Wszystkie", ...cats.sort()]
  }, [tutorials])

  const filtered = activeCategory === "Wszystkie"
    ? tutorials
    : tutorials.filter((t) => t.category === activeCategory)

  const openAdd = () => { setEditTutorial(null); setDialogOpen(true) }
  const openEdit = (t: Tutorial) => { setEditTutorial(t); setDialogOpen(true) }
  const confirmDelete = (t: Tutorial) => { setDeleteId(t.id); setDeleteTitle(t.title) }
  const handleDelete = async () => { if (deleteId) await deleteTutorial(deleteId); setDeleteId(null) }

  const openPlayer = (t: Tutorial) => {
    setPlayerUrl(getEmbedUrl(t.url))
    setPlayerTitle(t.title)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tutoriale</h1>
        <Button size="lg" className="text-base font-semibold px-6" onClick={openAdd}>
          <IconPlus size={18} />
          Dodaj tutorial
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

      {!loading && tutorials.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-16 text-center">
          <IconVideo size={40} className="text-muted-foreground/40" />
          <p className="font-semibold text-muted-foreground">Brak tutoriali</p>
          <p className="text-sm text-muted-foreground">Kliknij „Dodaj tutorial", aby dodać pierwszy film.</p>
        </div>
      )}

      {!loading && filtered.length === 0 && tutorials.length > 0 && (
        <p className="text-sm text-muted-foreground">Brak tutoriali w tej kategorii.</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => {
          const thumb = getThumbnailUrl(t.url)
          return (
            <div
              key={t.id}
              className="flex flex-col rounded-2xl border border-border overflow-hidden bg-card transition-shadow hover:shadow-md"
            >
              {/* Thumbnail */}
              <button
                className="group relative aspect-video w-full bg-muted shrink-0"
                onClick={() => openPlayer(t)}
              >
                {thumb ? (
                  <Image src={thumb} alt={t.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <IconVideo size={36} className="text-muted-foreground/40" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex size-12 items-center justify-center rounded-full bg-white/90 shadow">
                    <IconPlayerPlay size={22} className="text-primary fill-primary" />
                  </div>
                </div>
              </button>

              {/* Treść */}
              <div className="flex flex-1 flex-col gap-2 p-4">
                {t.category && (
                  <Badge variant="outline" className="self-start border-primary/30 text-primary text-xs">
                    {t.category}
                  </Badge>
                )}
                <p className="font-semibold leading-tight line-clamp-2">{t.title}</p>
                {t.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{t.description}</p>
                )}
                <div className="mt-auto flex justify-end gap-2 pt-2">
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openEdit(t)}>
                    <IconPencil size={14} />
                    Edytuj
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => confirmDelete(t)}
                  >
                    <IconTrash size={15} />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <TutorialDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        tutorial={editTutorial}
      />

      {/* Odtwarzacz */}
      <Dialog open={!!playerUrl} onOpenChange={(v) => !v && setPlayerUrl(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogHeader className="px-5 pt-4 pb-0">
            <DialogTitle className="text-base">{playerTitle}</DialogTitle>
          </DialogHeader>
          {playerUrl && (
            <div className="aspect-video w-full">
              <iframe
                src={playerUrl}
                className="h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć tutorial?</AlertDialogTitle>
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
