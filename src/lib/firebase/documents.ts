import {
  collection, onSnapshot, query, orderBy,
  doc, updateDoc, addDoc, deleteDoc, Timestamp,
} from "firebase/firestore"
import { db } from "./config"

export interface StudioDocument {
  id: string
  title: string
  description: string
  fileUrl: string
  fileName: string
  category: string
}

export function subscribeDocuments(callback: (data: StudioDocument[]) => void) {
  const q = query(collection(db, "documents"), orderBy("createdAt", "desc"))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as StudioDocument)))
  })
}

export async function addDocument(data: Omit<StudioDocument, "id">) {
  await addDoc(collection(db, "documents"), { ...data, createdAt: Timestamp.now() })
}

export async function updateDocument(id: string, data: Partial<Omit<StudioDocument, "id">>) {
  await updateDoc(doc(db, "documents", id), data)
}

export async function deleteDocument(id: string) {
  await deleteDoc(doc(db, "documents", id))
}
