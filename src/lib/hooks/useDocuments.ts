import { useEffect, useState } from "react"
import { subscribeDocuments, type StudioDocument } from "@/lib/firebase/documents"

export function useDocuments() {
  const [documents, setDocuments] = useState<StudioDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeDocuments((data) => {
      setDocuments(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return { documents, loading }
}
