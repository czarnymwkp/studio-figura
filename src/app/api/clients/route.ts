import { NextRequest, NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase/admin"
import { FieldValue } from "firebase-admin/firestore"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null
    if (!token) return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 })

    const decoded = await adminAuth.verifyIdToken(token)
    if (!["admin", "employee"].includes(decoded.role)) {
      return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 })
    }

    const body = await request.json()
    const { name, surname, email, password, phone, subscription, lastVisit, nextVisit, smsConsent, smsConsentDate } = body

    if (!name || !surname || !email || !password) {
      return NextResponse.json({ error: "Brakujące pola" }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Hasło musi mieć co najmniej 6 znaków" }, { status: 400 })
    }

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: `${name} ${surname}`,
    })

    await adminAuth.setCustomUserClaims(userRecord.uid, { role: "client" })

    await Promise.all([
      adminDb.collection("users").doc(userRecord.uid).set({
        uid: userRecord.uid,
        displayName: `${name} ${surname}`,
        email,
        role: "client",
        createdAt: FieldValue.serverTimestamp(),
        createdBy: decoded.uid,
      }),
      adminDb.collection("clients").doc(userRecord.uid).set({
        uid: userRecord.uid,
        name,
        surname,
        email,
        phone: phone ?? "",
        subscription: subscription ?? false,
        lastVisit: lastVisit ?? null,
        nextVisit: nextVisit ?? null,
        smsConsent: smsConsent ?? false,
        smsConsentDate: smsConsentDate ?? null,
        createdAt: FieldValue.serverTimestamp(),
        createdBy: decoded.uid,
      }),
    ])

    return NextResponse.json({ uid: userRecord.uid }, { status: 201 })
  } catch (err: unknown) {
    if (err instanceof Error && "code" in err && err.code === "auth/email-already-exists") {
      return NextResponse.json({ error: "Ten email jest już zajęty" }, { status: 409 })
    }
    console.error(err)
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 })
  }
}
