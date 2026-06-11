// lib/firebase/employees.ts
import { auth } from "./config";

type CreateEmployeeInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export async function createEmployee(data: CreateEmployeeInput) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Nie jesteś zalogowany");

  const res = await fetch("/api/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Nie udało się dodać pracownika");
  }

  return res.json() as Promise<{ uid: string }>;
}