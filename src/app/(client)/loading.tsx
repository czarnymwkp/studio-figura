import { Spinner } from "@/components/ui/spinner"

export default function ClientLoading() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <Spinner className="h-8 w-8 text-primary" />
    </div>
  )
}
