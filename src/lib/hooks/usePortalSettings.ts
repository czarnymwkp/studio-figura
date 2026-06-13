import { useEffect, useState } from "react"
import { subscribePortal, DEFAULT_PORTAL, type PortalSettings } from "@/lib/firebase/settings"

export function usePortalSettings(): PortalSettings & { loading: boolean } {
  const [settings, setSettings] = useState<PortalSettings>(DEFAULT_PORTAL)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return subscribePortal((s) => {
      setSettings(s)
      setLoading(false)
    })
  }, [])

  return { ...settings, loading }
}
