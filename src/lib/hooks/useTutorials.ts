import { useEffect, useState } from "react"
import { subscribesTutorials, type Tutorial } from "@/lib/firebase/tutorials"

export function useTutorials() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribesTutorials((data) => {
      setTutorials(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return { tutorials, loading }
}
