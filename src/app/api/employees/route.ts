// app/api/employees/route.ts
import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

// firebase-admin wymaga środowiska Node (nie Edge)
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // 1. Weryfikacja tokenu zalogowanego użytkownika
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);

    // 2. Sprawdzenie roli admina — z custom claims (token), bez odczytu z Firestore
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
    }

    // 3. Walidacja danych
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const firstName =
      typeof body.firstName === "string" ? body.firstName.trim() : "";
    const lastName =
      typeof body.lastName === "string" ? body.lastName.trim() : "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Nieprawidłowy adres email" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Hasło musi mieć co najmniej 6 znaków" },
        { status: 400 }
      );
    }
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "Podaj imię i nazwisko" },
        { status: 400 }
      );
    }

    // 4. Utworzenie konta
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // 5. Custom claim — bez tego middleware nie wpuści pracownika do panelu!
    await adminAuth.setCustomUserClaims(userRecord.uid, { role: "employee" });

    // 6. Dokument w Firestore
    await adminDb.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      firstName,
      lastName,
      role: "employee",
      createdAt: FieldValue.serverTimestamp(),
      createdBy: decoded.uid,
    });

    return NextResponse.json({ uid: userRecord.uid }, { status: 201 });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "auth/email-already-exists"
    ) {
      return NextResponse.json(
        { error: "Ten email jest już zajęty" },
        { status: 409 }
      );
    }
    console.error("createEmployee error:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}