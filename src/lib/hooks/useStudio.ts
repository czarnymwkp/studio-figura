import { useEffect, useState } from "react"
import { subscribeStudio, DEFAULT_STUDIO, type StudioSettings } from "@/lib/firebase/settings"

export function useStudio(): StudioSettings & { loading: boolean } {
  const [settings, setSettings] = useState<StudioSettings>(DEFAULT_STUDIO)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return subscribeStudio((s) => {
      setSettings(s)
      setLoading(false)
    })
  }, [])

  return { ...settings, loading }
}
