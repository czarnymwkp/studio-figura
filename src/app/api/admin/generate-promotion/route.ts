import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase/admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const FAL_HEADERS = () => ({
  Authorization: `Key ${process.env.FAL_KEY ?? ""}`,
  "Content-Type": "application/json",
})

async function falQueue(model: string, input: object): Promise<unknown> {
  const submitRes = await fetch(`https://queue.fal.run/${model}`, {
    method: "POST",
    headers: FAL_HEADERS(),
    body: JSON.stringify(input),
  })
  if (!submitRes.ok) {
    const text = await submitRes.text()
    throw new Error(`fal submit ${submitRes.status}: ${text}`)
  }
  const { request_id } = (await submitRes.json()) as { request_id: string }

  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000))
    const statusRes = await fetch(
      `https://queue.fal.run/${model}/requests/${request_id}/status`,
      { headers: FAL_HEADERS() }
    )
    const status = (await statusRes.json()) as { status: string }
    if (status.status === "COMPLETED") break
    if (status.status === "FAILED") throw new Error("fal job failed")
  }

  const resultRes = await fetch(
    `https://queue.fal.run/${model}/requests/${request_id}`,
    { headers: FAL_HEADERS() }
  )
  if (!resultRes.ok) throw new Error(`fal result ${resultRes.status}`)
  return resultRes.json()
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.slice(7) ?? null
    if (!token) return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 })

    const decoded = await adminAuth.verifyIdToken(token)
    if (decoded.role !== "admin") return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 })

    const { prompt } = await request.json()
    if (!prompt?.trim()) return NextResponse.json({ error: "Brak opisu" }, { status: 400 })

    const [textResult, imageResult] = await Promise.all([
      falQueue("fal-ai/any-llm", {
        model: "google/gemini-2.0-flash",
        system_prompt: `Jesteś copywriterem dla studia urody i fitness "Studio Figura" w Polsce. Piszesz krótkie, zachęcające teksty promocyjne. Odpowiadasz TYLKO samym JSON bez żadnych dodatkowych słów.`,
        prompt: `Na podstawie opisu wygeneruj promocję w formacie JSON:
{"name": "krótka nazwa (max 6 słów)", "description": "zachęcający opis dla klientek (2-3 zdania)"}

Opis: ${prompt}`,
      }),
      falQueue("fal-ai/flux-pro/v1.1", {
        prompt: `Professional beauty and body care studio promotional photo, ${prompt}, elegant modern interior, soft warm lighting, luxurious atmosphere, no text, no watermarks, photorealistic, ultra high quality`,
        image_size: "landscape_4_3",
        num_images: 1,
      }),
    ])

    let name = ""
    let description = ""
    try {
      const raw = ((textResult as { output: string }).output ?? "").trim()
      const json = raw.startsWith("```") ? raw.replace(/```(?:json)?/g, "").trim() : raw
      const parsed = JSON.parse(json)
      name = parsed.name ?? ""
      description = parsed.description ?? ""
    } catch (err) {
      console.error("[generate-promotion] text parse error:", err)
    }

    const imageUrl =
      ((imageResult as { images: { url: string }[] }).images?.[0]?.url) ?? ""

    return NextResponse.json({ name, description, imageUrl })
  } catch (err) {
    console.error("[generate-promotion] ERROR:", err)
    return NextResponse.json({ error: "Błąd serwera", detail: String(err) }, { status: 500 })
  }
}
