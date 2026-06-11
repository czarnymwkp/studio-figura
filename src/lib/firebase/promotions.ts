import {
  collection, onSnapshot, query, orderBy,
  doc, updateDoc, addDoc, deleteDoc, Timestamp,
} from "firebase/firestore"
import { db } from "./config"

export interface Promotion {
  id: string
  name: string
  description: string
  discount: string
  validUntil: string
  image: string
  active: boolean
}

export function subscribePromotions(callback: (data: Promotion[]) => void) {
  const q = query(collection(db, "promotions"), orderBy("createdAt", "asc"))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Promotion)))
  })
}

export async function togglePromotion(id: string, active: boolean) {
  await updateDoc(doc(db, "promotions", id), { active })
}

export async function addPromotion(data: Omit<Promotion, "id">) {
  await addDoc(collection(db, "promotions"), { ...data, createdAt: Timestamp.now() })
}

export async function deletePromotion(id: string) {
  await deleteDoc(doc(db, "promotions", id))
}
