import { useEffect, useState } from "react"
import { subscribePromotions, type Promotion } from "@/lib/firebase/promotions"

export function usePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribePromotions((data) => {
      setPromotions(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return { promotions, loading }
}
