import {
  collection, query, orderBy, onSnapshot, doc, updateDoc,
} from "firebase/firestore"
import { db } from "./config"

export interface Device {
  id: string
  name: string
  description: string
  image: string
  active: boolean
  count: number // liczba sztuk w studio
}

export function subscribeDevices(callback: (devices: Device[]) => void) {
  const q = query(collection(db, "devices"), orderBy("name", "asc"))
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          name: data.name,
          description: data.description ?? "",
          image: data.image ?? "",
          active: data.active ?? true,
          count: data.count ?? 1,
        }
      })
    )
  })
}

export async function setDeviceActive(id: string, active: boolean) {
  await updateDoc(doc(db, "devices", id), { active })
}

export async function setDeviceCount(id: string, count: number) {
  await updateDoc(doc(db, "devices", id), { count: Math.max(1, count) })
}
