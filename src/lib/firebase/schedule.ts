import {
  collection, query, where, orderBy, onSnapshot,
  doc, setDoc, deleteDoc, updateDoc, Timestamp,
} from "firebase/firestore"
import { db } from "./config"

export interface Employee {
  uid: string
  name: string
  surname: string
  position: string
  skills: string[]
}

export interface Shift {
  id: string
  employeeId: string
  date: Date
  startHour: number
  endHour: number
  shiftNo: 1 | 2
}

/** Definicje zmian — studio pracuje dwuzmianowo, pn–sob. */
export const SHIFT_DEFS = [
  { no: 1 as const, label: "Zmiana I", start: 8, end: 13 },
  { no: 2 as const, label: "Zmiana II", start: 13, end: 18 },
]

export function subscribeEmployees(callback: (employees: Employee[]) => void) {
  const q = query(collection(db, "employees"), orderBy("name", "asc"))
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => {
        const data = d.data()
        return {
          uid: d.id,
          name: data.name,
          surname: data.surname,
          position: data.position ?? "",
          skills: data.skills ?? [],
        }
      })
    )
  })
}

export async function updateEmployeeSkills(uid: string, skills: string[]) {
  await updateDoc(doc(db, "employees", uid), { skills })
}

function shiftKey(employeeId: string, date: Date, shiftNo: number) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${employeeId}_${y}-${m}-${d}_z${shiftNo}`
}

/** Przypisuje pracownika do zmiany danego dnia (jeden dokument na pracownika+dzień+zmianę). */
export async function setShift(employeeId: string, date: Date, shiftNo: 1 | 2) {
  const def = SHIFT_DEFS.find((s) => s.no === shiftNo)!
  const day = new Date(date)
  day.setHours(0, 0, 0, 0)
  await setDoc(doc(db, "shifts", shiftKey(employeeId, day, shiftNo)), {
    employeeId,
    date: Timestamp.fromDate(day),
    startHour: def.start,
    endHour: def.end,
    shiftNo,
  })
}

export async function removeShift(employeeId: string, date: Date, shiftNo: 1 | 2) {
  await deleteDoc(doc(db, "shifts", shiftKey(employeeId, date, shiftNo)))
}

export function subscribeRangeShifts(
  start: Date,
  end: Date,
  callback: (shifts: Shift[]) => void
) {
  const q = query(
    collection(db, "shifts"),
    where("date", ">=", Timestamp.fromDate(start)),
    where("date", "<=", Timestamp.fromDate(end))
  )
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs
        .filter((d) => d.data().shiftNo) // pomiń stare dokumenty bez numeru zmiany
        .map((d) => {
          const data = d.data()
          return {
            id: d.id,
            employeeId: data.employeeId,
            date: (data.date as Timestamp).toDate(),
            startHour: data.startHour,
            endHour: data.endHour,
            shiftNo: data.shiftNo,
          }
        })
    )
  })
}

/** Polskie święta ustawowe (stałe + ruchome od Wielkanocy). */
export function isHoliday(date: Date): boolean {
  const m = date.getMonth() + 1
  const d = date.getDate()
  const fixed: [number, number][] = [
    [1, 1], [1, 6], [5, 1], [5, 3], [8, 15], [11, 1], [11, 11], [12, 25], [12, 26],
  ]
  if (fixed.some(([fm, fd]) => fm === m && fd === d)) return true

  // Wielkanoc — algorytm Gaussa (Meeus)
  const year = date.getFullYear()
  const a = year % 19, b = Math.floor(year / 100), c = year % 100
  const dd = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - dd - g + 15) % 30
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7
  const mm = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * mm + 114) / 31)
  const day = ((h + l - 7 * mm + 114) % 31) + 1
  const easter = new Date(year, month - 1, day)

  const easterMonday = new Date(easter)
  easterMonday.setDate(easter.getDate() + 1)
  const corpusChristi = new Date(easter)
  corpusChristi.setDate(easter.getDate() + 60)

  return (
    date.toDateString() === easterMonday.toDateString() ||
    date.toDateString() === corpusChristi.toDateString()
  )
}
