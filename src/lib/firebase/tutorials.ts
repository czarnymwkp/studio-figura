import {
  collection, onSnapshot, query, orderBy,
  doc, updateDoc, addDoc, deleteDoc, Timestamp,
} from "firebase/firestore"
import { db } from "./config"

export interface Tutorial {
  id: string
  title: string
  description: string
  url: string
  category: string
}

export function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\n?#]+)/)
  return match?.[1] ?? null
}

export function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return match?.[1] ?? null
}

export function getThumbnailUrl(url: string): string {
  const ytId = getYouTubeId(url)
  if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
  return ""
}

export function subscribesTutorials(callback: (data: Tutorial[]) => void) {
  const q = query(collection(db, "tutorials"), orderBy("createdAt", "desc"))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Tutorial)))
  })
}

export async function addTutorial(data: Omit<Tutorial, "id">) {
  await addDoc(collection(db, "tutorials"), { ...data, createdAt: Timestamp.now() })
}

export async function updateTutorial(id: string, data: Partial<Omit<Tutorial, "id">>) {
  await updateDoc(doc(db, "tutorials", id), data)
}

export async function deleteTutorial(id: string) {
  await deleteDoc(doc(db, "tutorials", id))
}
