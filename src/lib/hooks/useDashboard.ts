import { useEffect, useState } from "react"
import {
  collection, query, where, orderBy,
  onSnapshot, Timestamp, getDocs,
} from "firebase/firestore"
import { db } from "@/lib/firebase/config"

interface Appointment {
  id: string
  clientName: string
  treatment: string
  category: string
  date: Timestamp
  duration: number
  price: number
  status: string
}

interface Promotion {
  id: string
  name: string
  discount: string
  validUntil: string
  active: boolean
}

interface TreatmentStat {
  name: string
  count: number
  revenue: number
}

interface DashboardData {
  todayCount: number
  weekCount: number
  monthCount: number
  monthRevenue: number
  prevMonthRevenue: number
  prevWeekCount: number
  prevMonthCount: number
  todayAppointments: Appointment[]
  topTreatments: TreatmentStat[]
  activePromotions: Promotion[]
  loading: boolean
}

function startOf(unit: "day" | "week" | "month", date = new Date()): Date {
  const d = new Date(date)
  if (unit === "day") { d.setHours(0, 0, 0, 0); return d }
  if (unit === "week") {
    const day = d.getDay()
    d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
    d.setHours(0, 0, 0, 0)
    return d
  }
  d.setDate(1); d.setHours(0, 0, 0, 0); return d
}

function endOf(unit: "day" | "week" | "month", date = new Date()): Date {
  const d = new Date(date)
  if (unit === "day") { d.setHours(23, 59, 59, 999); return d }
  if (unit === "week") {
    const day = d.getDay()
    d.setDate(d.getDate() + (day === 0 ? 0 : 7 - day))
    d.setHours(23, 59, 59, 999)
    return d
  }
  d.setMonth(d.getMonth() + 1, 0); d.setHours(23, 59, 59, 999); return d
}

export function useDashboard(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    todayCount: 0, weekCount: 0, monthCount: 0,
    monthRevenue: 0, prevMonthRevenue: 0,
    prevWeekCount: 0, prevMonthCount: 0,
    todayAppointments: [], topTreatments: [],
    activePromotions: [], loading: true,
  })

  useEffect(() => {
    const now = new Date()

    const todayStart  = Timestamp.fromDate(startOf("day", now))
    const todayEnd    = Timestamp.fromDate(endOf("day", now))
    const weekStart   = Timestamp.fromDate(startOf("week", now))
    const weekEnd     = Timestamp.fromDate(endOf("week", now))
    const monthStart  = Timestamp.fromDate(startOf("month", now))
    const monthEnd    = Timestamp.fromDate(endOf("month", now))

    const prevWeekEnd   = Timestamp.fromDate(new Date(startOf("week", now).getTime() - 1))
    const prevWeekStart = Timestamp.fromDate(new Date(startOf("week", now).getTime() - 7 * 86400000))
    const prevMonthEnd   = Timestamp.fromDate(new Date(startOf("month", now).getTime() - 1))
    const prevMonthStart = Timestamp.fromDate(startOf("month", new Date(now.getFullYear(), now.getMonth() - 1, 1)))

    // Today's appointments (real-time)
    const todayQ = query(
      collection(db, "appointments"),
      where("date", ">=", todayStart),
      where("date", "<=", todayEnd),
      orderBy("date", "asc")
    )

    const unsubToday = onSnapshot(todayQ, (snap) => {
      const todayAppointments = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Appointment))

      // Fetch the rest statically (stats don't need real-time)
      Promise.all([
        getDocs(query(collection(db, "appointments"), where("date", ">=", weekStart),  where("date", "<=", weekEnd))),
        getDocs(query(collection(db, "appointments"), where("date", ">=", monthStart), where("date", "<=", monthEnd))),
        getDocs(query(collection(db, "appointments"), where("date", ">=", prevWeekStart),  where("date", "<=", prevWeekEnd))),
        getDocs(query(collection(db, "appointments"), where("date", ">=", prevMonthStart), where("date", "<=", prevMonthEnd))),
        getDocs(query(collection(db, "promotions"), where("active", "==", true))),
        getDocs(query(collection(db, "appointments"), orderBy("date", "asc"))),
      ]).then(([weekSnap, monthSnap, prevWeekSnap, prevMonthSnap, promoSnap, allSnap]) => {
        const monthRevenue = monthSnap.docs
          .filter(d => d.data().status === "completed")
          .reduce((sum, d) => sum + (d.data().price ?? 0), 0)

        const prevMonthRevenue = prevMonthSnap.docs
          .filter(d => d.data().status === "completed")
          .reduce((sum, d) => sum + (d.data().price ?? 0), 0)

        // Top treatments from all appointments
        const treatmentMap = new Map<string, TreatmentStat>()
        allSnap.docs.forEach((d) => {
          const { treatment, price } = d.data()
          if (!treatmentMap.has(treatment)) {
            treatmentMap.set(treatment, { name: treatment, count: 0, revenue: 0 })
          }
          const t = treatmentMap.get(treatment)!
          t.count++
          t.revenue += price ?? 0
        })
        const topTreatments = [...treatmentMap.values()]
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)

        const activePromotions = promoSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Promotion))

        setData({
          todayCount:      todayAppointments.length,
          weekCount:       weekSnap.size,
          monthCount:      monthSnap.size,
          monthRevenue,
          prevMonthRevenue,
          prevWeekCount:   prevWeekSnap.size,
          prevMonthCount:  prevMonthSnap.size,
          todayAppointments,
          topTreatments,
          activePromotions,
          loading: false,
        })
      })
    })

    return () => unsubToday()
  }, [])

  return data
}
