import { useEffect, useState } from "react"
import {
  collection, doc, onSnapshot, query, where, Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useAuth } from "./useAuth"

export interface ClientAppointment {
  id: string
  treatment: string
  category: string
  date: Date
  duration: number
  price: number
  status: string
}

export interface ClientPromotion {
  id: string
  name: string
  description: string
  discount: string
  validUntil: string
  image: string
}

interface ClientPortalData {
  points: number
  subscription: boolean
  upcoming: ClientAppointment[]
  history: ClientAppointment[]
  promotions: ClientPromotion[]
  loading: boolean
}

export function useClientPortal(): ClientPortalData {
  const { user } = useAuth()
  const [points, setPoints] = useState(0)
  const [subscription, setSubscription] = useState(false)
  const [upcoming, setUpcoming] = useState<ClientAppointment[]>([])
  const [history, setHistory] = useState<ClientAppointment[]>([])
  const [promotions, setPromotions] = useState<ClientPromotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const unsubClient = onSnapshot(doc(db, "clients", user.uid), (snap) => {
      const data = snap.data()
      setPoints(data?.points ?? 0)
      setSubscription(data?.subscription ?? false)
    })

    // Single-field filter only — sorting/splitting client-side avoids a composite index
    const apptQ = query(collection(db, "appointments"), where("clientId", "==", user.uid))
    const unsubAppts = onSnapshot(apptQ, (snap) => {
      const now = new Date()
      const all = snap.docs
        .map((d) => {
          const data = d.data()
          return {
            id: d.id,
            treatment: data.treatment,
            category: data.category,
            date: (data.date as Timestamp).toDate(),
            duration: data.duration,
            price: data.price,
            status: data.status,
          } as ClientAppointment
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime())

      setUpcoming(all.filter((a) => a.date >= now && a.status !== "cancelled"))
      setHistory(all.filter((a) => a.date < now && a.status !== "cancelled").reverse())
      setLoading(false)
    })

    const promoQ = query(collection(db, "promotions"), where("active", "==", true))
    const unsubPromos = onSnapshot(promoQ, (snap) => {
      setPromotions(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ClientPromotion)))
    })

    return () => {
      unsubClient()
      unsubAppts()
      unsubPromos()
    }
  }, [user])

  return { points, subscription, upcoming, history, promotions, loading }
}
