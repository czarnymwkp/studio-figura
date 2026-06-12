import {
  collection, query, where, onSnapshot,
  addDoc, doc, updateDoc, Timestamp, increment, runTransaction,
} from "firebase/firestore"
import { db } from "./config"

/** 1 punkt za każde pełne 10 zł wartości zabiegu. */
export function pointsForPrice(price: number) {
  return Math.floor(price / 10)
}

export interface NewAppointment {
  clientId: string
  clientName: string
  treatment: string
  category: string
  date: Date
  duration: number // w godzinach
  price: number
  device?: string // id urządzenia
}

export async function addAppointment(data: NewAppointment) {
  await addDoc(collection(db, "appointments"), {
    ...data,
    device: data.device ?? "",
    date: Timestamp.fromDate(data.date),
    status: "scheduled",
    createdAt: Timestamp.now(),
  })
}

export async function cancelAppointment(id: string) {
  await updateDoc(doc(db, "appointments", id), { status: "cancelled" })
}

export async function rescheduleAppointment(id: string, newDate: Date) {
  await updateDoc(doc(db, "appointments", id), { date: Timestamp.fromDate(newDate) })
}

export async function updateAppointmentNote(id: string, note: string) {
  await updateDoc(doc(db, "appointments", id), { note })
}

export const LOGIN_STREAK_TARGET = 7

export interface LoginStreakResult {
  newDay: boolean   // pierwsze logowanie dzisiaj
  awarded: boolean  // naliczono punkt (pełna seria)
  streak: number    // aktualna długość serii
}

/**
 * Seria logowań: logowanie przez 7 kolejnych dni = +1 pkt, potem seria startuje od nowa.
 * Przerwa (dzień bez logowania) zeruje serię.
 */
export async function claimDailyLoginBonus(uid: string): Promise<LoginStreakResult> {
  const fmt = new Intl.DateTimeFormat("sv-SE") // YYYY-MM-DD lokalnie
  const today = fmt.format(new Date())
  const yesterday = fmt.format(new Date(Date.now() - 86400000))
  const ref = doc(db, "clients", uid)

  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref)
    if (!snap.exists()) return { newDay: false, awarded: false, streak: 0 }

    const data = snap.data()
    if (data.lastLoginBonus === today) {
      return { newDay: false, awarded: false, streak: data.loginStreak ?? 0 }
    }

    const streak = data.lastLoginBonus === yesterday ? (data.loginStreak ?? 0) + 1 : 1

    if (streak >= LOGIN_STREAK_TARGET) {
      tx.update(ref, { lastLoginBonus: today, loginStreak: 0, points: increment(1) })
      return { newDay: true, awarded: true, streak: LOGIN_STREAK_TARGET }
    }

    tx.update(ref, { lastLoginBonus: today, loginStreak: streak })
    return { newDay: true, awarded: false, streak }
  })
}

/** Oznacza wizytę jako zrealizowaną i nalicza klientowi punkty. */
export async function completeAppointment(id: string, clientId: string | undefined, price: number) {
  await updateDoc(doc(db, "appointments", id), { status: "completed" })
  if (clientId) {
    await updateDoc(doc(db, "clients", clientId), {
      points: increment(pointsForPrice(price)),
    })
  }
}

export interface WeekAppointment {
  id: string
  clientId?: string
  clientName: string
  treatment: string
  category: string
  date: Date
  duration: number
  price: number
  status: string
  note: string
}

/** Subskrybuje wizyty z zakresu dat — dla terminarza pracownika. */
export function subscribeRangeAppointments(
  start: Date,
  end: Date,
  callback: (appointments: WeekAppointment[]) => void
) {
  const q = query(
    collection(db, "appointments"),
    where("date", ">=", Timestamp.fromDate(start)),
    where("date", "<=", Timestamp.fromDate(end))
  )
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          clientId: data.clientId,
          clientName: data.clientName,
          treatment: data.treatment,
          category: data.category,
          date: (data.date as Timestamp).toDate(),
          duration: data.duration ?? 1,
          price: data.price ?? 0,
          status: data.status,
          note: data.note ?? "",
        }
      })
    )
  })
}

export interface DayAppointment {
  id: string
  treatment: string
  device: string
  date: Date
  duration: number
}

/** Subskrybuje aktywne wizyty z danego dnia — do liczenia dostępności slotów. */
export function subscribeDayAppointments(
  day: Date,
  callback: (appointments: DayAppointment[]) => void
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
    callback(
      snap.docs
        .filter((d) => d.data().status !== "cancelled")
        .map((d) => {
          const data = d.data()
          return {
            id: d.id,
            treatment: data.treatment,
            device: data.device ?? "",
            date: (data.date as Timestamp).toDate(),
            duration: data.duration ?? 1,
          }
        })
    )
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
