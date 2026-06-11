import { useEffect, useState } from "react"
import { subscribePricing, type PriceCategory } from "@/lib/firebase/pricing"

export function usePricing() {
  const [pricing, setPricing] = useState<PriceCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribePricing((data) => {
      setPricing(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return { pricing, loading }
}
