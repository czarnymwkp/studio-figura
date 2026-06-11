import {
  collection, query, where, onSnapshot,
  addDoc, doc, updateDoc, Timestamp,
} from "firebase/firestore"
import { db } from "./config"

export interface NewAppointment {
  clientId: string
  clientName: string
  treatment: string
  category: string
  date: Date
  duration: number // w godzinach
  price: number
}

export async function addAppointment(data: NewAppointment) {
  await addDoc(collection(db, "appointments"), {
    ...data,
    date: Timestamp.fromDate(data.date),
    status: "scheduled",
    createdAt: Timestamp.now(),
  })
}

export async function cancelAppointment(id: string) {
  await updateDoc(doc(db, "appointments", id), { status: "cancelled" })
}

/** Subskrybuje wizyty z danego dnia — do blokowania zajętych godzin. */
export function subscribeDayAppointments(
  day: Date,
  callback: (takenHours: number[]) => void
) {
  const start = new Date(day)
  start.setHours(0, 0, 0, 0)
  const end = new Date(day)
  end.setHours(23, 59, 59, 999)

  const q = query(
    collection(db, "appointments"),
    where("date", ">=", Timestamp.fromDate(start)),
    where("date", "<=", Timestamp.fromDate(end))
  )

  return onSnapshot(q, (snap) => {
    const taken = snap.docs
      .filter((d) => d.data().status !== "cancelled")
      .map((d) => (d.data().date as Timestamp).toDate().getHours())
    callback(taken)
  })
}

/** "30 min" → 0.5, "1 h" / "60 min" → 1 */
export function parseDuration(label: string): number {
  const n = parseInt(label, 10)
  if (isNaN(n)) return 1
  return label.includes("min") ? n / 60 : n
}

/** "199 zł" → 199 */
export function parsePrice(label: string): number {
  const n = parseInt(label.replace(/\s/g, ""), 10)
  return isNaN(n) ? 0 : n
}
