import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  addDoc,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore"
import { db } from "./config"

export interface PriceItem {
  name: string
  duration: string
  price: string
  device?: string // id urządzenia z kolekcji devices
}

export interface PriceCategory {
  id: string
  category: string
  order: number
  items: PriceItem[]
}

export function subscribePricing(callback: (data: PriceCategory[]) => void) {
  const q = query(collection(db, "pricing"), orderBy("order", "asc"))
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PriceCategory, "id">) }))
    )
  })
}

export async function addCategory(category: string): Promise<string> {
  const ref = await addDoc(collection(db, "pricing"), {
    category,
    order: Date.now(),
    items: [],
    createdAt: Timestamp.now(),
  })
  return ref.id
}

export async function addItem(categoryId: string, item: PriceItem) {
  await updateDoc(doc(db, "pricing", categoryId), {
    items: arrayUnion(item),
  })
}

export async function updateItem(categoryId: string, oldItem: PriceItem, newItem: PriceItem) {
  const ref = doc(db, "pricing", categoryId)
  await updateDoc(ref, { items: arrayRemove(oldItem) })
  await updateDoc(ref, { items: arrayUnion(newItem) })
}

export async function deleteItem(categoryId: string, item: PriceItem) {
  await updateDoc(doc(db, "pricing", categoryId), {
    items: arrayRemove(item),
  })
}
