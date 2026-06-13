import { Skeleton } from "@/components/ui/skeleton"

export default function PromocjeLoading() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-9 w-36 rounded-lg" />
      <Skeleton className="h-56 rounded-2xl" />
      <Skeleton className="h-56 rounded-2xl" />
    </div>
  )
}
