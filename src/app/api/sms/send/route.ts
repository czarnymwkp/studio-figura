import { NextRequest, NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase/admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  // 1. Auth
  const token = request.headers.get("authorization")?.slice(7) ?? null
  if (!token) return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 })

  const decoded = await adminAuth.verifyIdToken(token)
  if (decoded.role !== "admin") return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 })

  // 2. Body
  const body = await request.json()
  const to: string = (body.to ?? "").replace(/\s+/g, "")
  const message: string = body.message ?? "Test połączenia z Studio Figura"

  if (!to) return NextResponse.json({ error: "Brak numeru telefonu" }, { status: 400 })

  // 3. Load SMSAPI credentials from Firestore
  const snap = await adminDb.collection("settings").doc("integrations").get()
  const smsapi = snap.data()?.smsapi as { apiToken?: string; sender?: string } | undefined

  if (!smsapi?.apiToken) {
    return NextResponse.json({ error: "SMSAPI nie jest skonfigurowane" }, { status: 422 })
  }

  // 4. Send via SMSAPI
  const params = new URLSearchParams({ to, message, format: "json", encoding: "utf-8" })

  const res = await fetch("https://api.smsapi.pl/sms.do", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${smsapi.apiToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  })

  const data = await res.json()

  if (!res.ok || data.error) {
    return NextResponse.json(
      { error: data.message ?? data.error ?? "Błąd SMSAPI", code: data.error },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true, count: data.count, list: data.list })
}
