import { NextRequest, NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase/admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function getCallerAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null
  if (!token) return null
  const decoded = await adminAuth.verifyIdToken(token)
  if (decoded.role !== "admin") return null
  return decoded
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const caller = await getCallerAdmin(request)
    if (!caller) return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 })

    const { uid } = await params
    const body = await request.json()

    const { name, surname, email, phone, position, role } = body

    if (!name || !surname || !email || !position) {
      return NextResponse.json({ error: "Brakujące pola" }, { status: 400 })
    }

    const newRole: "admin" | "employee" = role === "admin" ? "admin" : "employee"
    const displayName = `${name} ${surname}`

    const authUpdate: Record<string, string> = { email, displayName }
    await adminAuth.updateUser(uid, authUpdate)

    if (uid !== caller.uid) {
      await adminAuth.setCustomUserClaims(uid, { role: newRole })
    }

    await Promise.all([
      adminDb.collection("employees").doc(uid).update({
        name, surname, email, phone: phone ?? "", position,
        ...(uid !== caller.uid ? { role: newRole } : {}),
      }),
      adminDb.collection("users").doc(uid).update({
        displayName, email,
        ...(uid !== caller.uid ? { role: newRole } : {}),
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    if (err instanceof Error && "code" in err && err.code === "auth/email-already-exists") {
      return NextResponse.json({ error: "Ten email jest już zajęty" }, { status: 409 })
    }
    console.error(err)
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const caller = await getCallerAdmin(request)
    if (!caller) return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 })

    const { uid } = await params
    if (uid === caller.uid) {
      return NextResponse.json({ error: "Nie możesz usunąć własnego konta" }, { status: 400 })
    }

    const url = new URL(request.url)
    const archive = url.searchParams.get("archive") === "1"

    if (archive) {
      await Promise.all([
        adminDb.collection("employees").doc(uid).update({ archived: true }),
        adminDb.collection("users").doc(uid).update({ archived: true }),
        adminAuth.updateUser(uid, { disabled: true }),
      ])
    } else {
      await Promise.all([
        adminDb.collection("employees").doc(uid).delete(),
        adminDb.collection("users").doc(uid).delete(),
        adminAuth.deleteUser(uid),
      ])
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 })
  }
}
