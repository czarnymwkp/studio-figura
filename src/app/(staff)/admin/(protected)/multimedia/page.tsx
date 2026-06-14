"use client"

import { IconPhoto } from "@tabler/icons-react"

export default function MultimediaPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Multimedia</h1>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-16 text-center">
        <IconPhoto size={40} className="text-muted-foreground/40" />
        <p className="font-semibold text-muted-foreground">Biblioteka multimediów</p>
        <p className="text-sm text-muted-foreground">Tu pojawią się zdjęcia i filmy studia.</p>
      </div>
    </div>
  )
}
