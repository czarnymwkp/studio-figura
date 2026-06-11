import { useEffect, useState } from "react"
import { subscribeClients, type Client } from "@/lib/firebase/clients"

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeClients((data) => {
      setClients(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return { clients, setClients, loading }
}
