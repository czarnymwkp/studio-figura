"use client"

import { useEffect, useState } from "react"
import { DeviceCard } from "@/components/admin/DeviceCard"
import { Skeleton } from "@/components/ui/skeleton"
import {
  subscribeDevices, setDeviceActive, setDeviceCount, type Device,
} from "@/lib/firebase/devices"

export default function UrzadzeniaPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return subscribeDevices((data) => {
      setDevices(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Urządzenia</h1>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              name={device.name}
              description={device.description}
              image={device.image}
              active={device.active}
              count={device.count}
              onToggleActive={() => setDeviceActive(device.id, !device.active)}
              onChangeCount={(count) => setDeviceCount(device.id, count)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
