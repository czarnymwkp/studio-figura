import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")
  if (!url) return NextResponse.json({ error: "missing url" }, { status: 400 })

  const res = await fetch(url)
  if (!res.ok) return NextResponse.json({ error: "fetch failed" }, { status: 502 })

  const blob = await res.blob()
  const contentType = res.headers.get("content-type") ?? "application/octet-stream"
  const filename = url.split("/").pop()?.split("?")[0] ?? "plik.jpg"

  return new NextResponse(blob, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
