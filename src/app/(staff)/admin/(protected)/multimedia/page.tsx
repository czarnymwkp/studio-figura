"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { IconVideo, IconUpload, IconDownload, IconX, IconChevronLeft, IconChevronRight, IconPhoto, IconSortAscending, IconSortDescending, IconLayoutGrid } from "@tabler/icons-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

type Category = "zabiegi" | "ogólne"
type SortMode = "custom" | "newest" | "oldest"

interface Grafika {
  src: string
  cat: Category
  addedAt: string
}

const BASE = "https://www.studiofigurakrasnik.com.pl/images/bagallery/original/"

const GRAFIKI_INIT: Grafika[] = [
  { src: "img-20241203-wa0005.jpg", cat: "zabiegi", addedAt: "2024-12-03" },
  { src: "img-20241203-wa0007.jpg", cat: "zabiegi", addedAt: "2024-12-03" },
  { src: "img-20241203-wa0009.jpg", cat: "zabiegi", addedAt: "2024-12-03" },
  { src: "img-20241203-wa0011.jpg", cat: "zabiegi", addedAt: "2024-12-03" },
  { src: "14.jpg",                  cat: "zabiegi", addedAt: "2024-11-01" },
  { src: "15.jpg",                  cat: "zabiegi", addedAt: "2024-11-01" },
  { src: "kobido-2.jpg",            cat: "zabiegi", addedAt: "2024-10-15" },
  { src: "kobido-4.jpg",            cat: "zabiegi", addedAt: "2024-10-15" },
  { src: "kobido-5.jpg",            cat: "zabiegi", addedAt: "2024-10-15" },
  { src: "kobido-7.jpg",            cat: "zabiegi", addedAt: "2024-10-15" },
  { src: "kobido-8.jpg",            cat: "zabiegi", addedAt: "2024-10-15" },
  { src: "p-1.jpg",                 cat: "zabiegi", addedAt: "2024-09-01" },
  { src: "p3.jpg",                  cat: "zabiegi", addedAt: "2024-09-01" },
  { src: "p8.jpg",                  cat: "zabiegi", addedAt: "2024-09-01" },
  { src: "p11.jpg",                 cat: "zabiegi", addedAt: "2024-09-01" },
  { src: "1.jpg",                   cat: "ogólne",  addedAt: "2024-08-01" },
  { src: "2.jpg",                   cat: "ogólne",  addedAt: "2024-08-01" },
  { src: "3.jpg",                   cat: "ogólne",  addedAt: "2024-08-01" },
  { src: "img-20241203-wa0015.jpg", cat: "zabiegi", addedAt: "2024-12-03" },
  { src: "img-20241203-wa0017.jpg", cat: "zabiegi", addedAt: "2024-12-03" },
  { src: "img-20241203-wa0023.jpg", cat: "zabiegi", addedAt: "2024-12-03" },
  { src: "img-20241203-wa0026.jpg", cat: "zabiegi", addedAt: "2024-12-03" },
  { src: "zdjcie-whatsapp-2024-12-03-o-18-36-33_55a364d3.jpg", cat: "ogólne", addedAt: "2024-12-03" },
  { src: "krio-1.jpg",              cat: "zabiegi", addedAt: "2024-11-15" },
  { src: "krio-6.jpg",              cat: "zabiegi", addedAt: "2024-11-15" },
  { src: "krio-9.jpg",              cat: "zabiegi", addedAt: "2024-11-15" },
  { src: "r-2.jpg",                 cat: "zabiegi", addedAt: "2024-10-01" },
  { src: "r8.jpg",                  cat: "zabiegi", addedAt: "2024-10-01" },
  { src: "r12.jpg",                 cat: "zabiegi", addedAt: "2024-10-01" },
].map((g) => ({ ...g, src: BASE + g.src }))

const GRAFIKI_MAP = Object.fromEntries(GRAFIKI_INIT.map((g) => [g.src, g]))

const CAT_FILTERS: { label: string; value: Category | "wszystkie" }[] = [
  { label: "Wszystkie", value: "wszystkie" },
  { label: "Zabiegi",   value: "zabiegi"  },
  { label: "Ogólne",    value: "ogólne"   },
]

function triggerDownload(src: string) {
  const filename = src.split("/").pop()?.split("?")[0] ?? "grafika.jpg"
  const a = document.createElement("a")
  a.href = `/api/download?url=${encodeURIComponent(src)}`
  a.download = filename
  a.click()
}

export default function MultimediaPage() {
  const [order, setOrder]         = useState<string[]>(GRAFIKI_INIT.map((g) => g.src))
  const [catFilter, setCatFilter] = useState<Category | "wszystkie">("wszystkie")
  const [sortMode, setSortMode]   = useState<SortMode>("custom")
  const [lightbox, setLightbox]   = useState<number | null>(null)
  const [selected, setSelected]   = useState<Set<string>>(new Set())
  const [dragOver, setDragOver]   = useState<string | null>(null)
  const dragSrc                   = useRef<string | null>(null)

  // Sorted full list
  const sorted: Grafika[] =
    sortMode === "custom"
      ? order.map((src) => GRAFIKI_MAP[src]).filter(Boolean)
      : [...GRAFIKI_INIT].sort((a, b) => {
          const diff = new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
          return sortMode === "newest" ? -diff : diff
        })

  const visible = catFilter === "wszystkie" ? sorted : sorted.filter((g) => g.cat === catFilter)

  // Drag & drop — reorders within visible subset, preserving positions of hidden items
  const handleDrop = (toSrc: string) => {
    const from = dragSrc.current
    if (!from || from === toSrc) { setDragOver(null); return }

    const visibleSrcs = visible.map((g) => g.src)
    const fromIdx = visibleSrcs.indexOf(from)
    const toIdx   = visibleSrcs.indexOf(toSrc)
    if (fromIdx === -1 || toIdx === -1) { setDragOver(null); return }

    const newVisible = [...visibleSrcs]
    newVisible.splice(fromIdx, 1)
    newVisible.splice(toIdx, 0, from)

    // Rebuild full order: replace positions occupied by visible items
    const visibleSet = new Set(visibleSrcs)
    const positions  = order.reduce<number[]>((acc, src, i) => { if (visibleSet.has(src)) acc.push(i); return acc }, [])
    const newOrder   = [...order]
    positions.forEach((pos, i) => { newOrder[pos] = newVisible[i] })

    setOrder(newOrder)
    setSortMode("custom")
    setDragOver(null)
  }

  const toggleSelect = (src: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(src)) next.delete(src)
      else next.add(src)
      return next
    })
  }

  const prev = () => setLightbox((i) => (i !== null ? (i - 1 + visible.length) % visible.length : null))
  const next = () => setLightbox((i) => (i !== null ? (i + 1) % visible.length : null))

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")      setLightbox(null)
      if (e.key === "ArrowLeft")   prev()
      if (e.key === "ArrowRight")  next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightbox, visible])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Multimedia</h1>
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => Array.from(selected).forEach(triggerDownload)}>
              <IconDownload size={15} />
              Pobierz ({selected.size})
            </Button>
          )}
          <Button size="lg" className="text-base font-semibold px-6" disabled>
            <IconUpload size={20} />
            Dodaj plik
          </Button>
        </div>
      </div>

      <Tabs defaultValue="grafiki">
        <TabsList>
          <TabsTrigger value="grafiki" className="gap-1.5">
            <IconPhoto size={15} />
            Grafiki
          </TabsTrigger>
          <TabsTrigger value="wideo" className="gap-1.5">
            <IconVideo size={15} />
            Wideo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grafiki" className="mt-4">
          <div className="flex flex-col gap-4">

            {/* Filtry + sortowanie */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-2">
                {CAT_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => { setCatFilter(f.value); setLightbox(null) }}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      catFilter === f.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}
                  >
                    {f.label}
                    <span className="ml-1.5 text-xs opacity-60">
                      {f.value === "wszystkie" ? GRAFIKI_INIT.length : GRAFIKI_INIT.filter((g) => g.cat === f.value).length}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  title="Własna kolejność"
                  onClick={() => setSortMode("custom")}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    sortMode === "custom" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <IconLayoutGrid size={14} />
                  Własna
                </button>
                <button
                  title="Najnowsze pierwsze"
                  onClick={() => setSortMode("newest")}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    sortMode === "newest" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <IconSortDescending size={14} />
                  Najnowsze
                </button>
                <button
                  title="Najstarsze pierwsze"
                  onClick={() => setSortMode("oldest")}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    sortMode === "oldest" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <IconSortAscending size={14} />
                  Najstarsze
                </button>
              </div>
            </div>

            {/* Siatka */}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {visible.map((grafika, i) => (
                <div
                  key={grafika.src}
                  draggable
                  onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; dragSrc.current = grafika.src }}
                  onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOver(grafika.src) }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => { e.preventDefault(); handleDrop(grafika.src) }}
                  onDragEnd={() => { dragSrc.current = null; setDragOver(null) }}
                  onClick={() => setLightbox(i)}
                  className={`group relative aspect-square overflow-hidden rounded-xl border bg-muted transition-all cursor-grab active:cursor-grabbing select-none ${
                    dragOver === grafika.src
                      ? "ring-2 ring-primary scale-95 opacity-60"
                      : selected.has(grafika.src)
                      ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : "border-border"
                  }`}
                >
                  <div
                    className={`absolute top-2 left-2 z-10 transition-opacity ${
                      selected.size > 0 ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                    onClick={(e) => { e.stopPropagation(); toggleSelect(grafika.src) }}
                  >
                    <Checkbox checked={selected.has(grafika.src)} onCheckedChange={() => toggleSelect(grafika.src)} />
                  </div>
                  <Image
                    src={grafika.src}
                    alt={`Zdjęcie ${i + 1}`}
                    fill
                    unoptimized
                    draggable={false}
                    className="object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 16vw, 12vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="wideo" className="mt-4">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-16 text-center">
            <IconVideo size={40} className="text-muted-foreground/40" />
            <p className="font-semibold text-muted-foreground">Brak filmów</p>
            <p className="text-sm text-muted-foreground">Tu pojawią się filmy i nagrania studia.</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Lightbox */}
      {lightbox !== null && visible[lightbox] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setLightbox(null)}>
          <Button size="icon" variant="ghost" className="absolute top-4 right-4 text-white hover:text-white hover:bg-white/10" onClick={() => setLightbox(null)}>
            <IconX size={22} />
          </Button>
          <Button size="icon" variant="ghost" className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-white hover:bg-white/10" onClick={(e) => { e.stopPropagation(); prev() }}>
            <IconChevronLeft size={28} />
          </Button>
          <div className="relative mx-16 h-[80vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image src={visible[lightbox].src} alt={`Zdjęcie ${lightbox + 1}`} fill unoptimized className="object-contain" sizes="100vw" />
          </div>
          <Button size="icon" variant="ghost" className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-white hover:bg-white/10" onClick={(e) => { e.stopPropagation(); next() }}>
            <IconChevronRight size={28} />
          </Button>
          <Button size="sm" variant="ghost" className="absolute bottom-4 gap-1.5 text-white hover:text-white hover:bg-white/10" onClick={(e) => { e.stopPropagation(); triggerDownload(visible[lightbox].src) }}>
            <IconDownload size={16} />
            Pobierz
          </Button>
        </div>
      )}
    </div>
  )
}
