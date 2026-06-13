import { Skeleton } from "@/components/ui/skeleton"

export default function RezerwacjeLoading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-9 w-56 rounded-lg" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </div>
  )
}
