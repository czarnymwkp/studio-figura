import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
  increment,
  query,
  orderBy,
} from "firebase/firestore"
import { db } from "./config"

export interface Client {
  id: string
  name: string
  surname: string
  email: string
  phone: string
  subscription: boolean
  subscriptionTotal: number | null
  subscriptionUsed: number | null
  lastVisit: string | null
  nextVisit: string | null
  smsConsent: boolean
  smsConsentDate: string | null
}

interface ClientData {
  name: string
  surname: string
  email: string
  phone: string
  subscription: boolean
  subscriptionTotal?: number | null
  subscriptionUsed?: number | null
  lastVisit: Timestamp | null
  nextVisit: Timestamp | null
  createdAt: Timestamp
  smsConsent?: boolean
  smsConsentDate?: string | null
}

function fromFirestore(id: string, data: ClientData): Client {
  return {
    id,
    name: data.name,
    surname: data.surname,
    email: data.email,
    phone: data.phone,
    subscription: data.subscription,
    subscriptionTotal: data.subscriptionTotal ?? null,
    subscriptionUsed: data.subscriptionUsed ?? null,
    lastVisit: data.lastVisit ? data.lastVisit.toDate().toISOString().split("T")[0] : null,
    nextVisit: data.nextVisit ? data.nextVisit.toDate().toISOString().split("T")[0] : null,
    smsConsent: data.smsConsent ?? false,
    smsConsentDate: data.smsConsentDate ?? null,
  }
}

export function subscribeClients(callback: (clients: Client[]) => void) {
  const q = query(collection(db, "clients"), orderBy("createdAt", "asc"))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => fromFirestore(d.id, d.data() as ClientData)))
  })
}

export async function addClient(data: Omit<Client, "id">) {
  await addDoc(collection(db, "clients"), {
    ...data,
    lastVisit: data.lastVisit ? Timestamp.fromDate(new Date(data.lastVisit)) : null,
    nextVisit: data.nextVisit ? Timestamp.fromDate(new Date(data.nextVisit)) : null,
    createdAt: Timestamp.now(),
  })
}

export async function updateClient(id: string, data: Omit<Client, "id">) {
  await updateDoc(doc(db, "clients", id), {
    ...data,
    lastVisit: data.lastVisit ? Timestamp.fromDate(new Date(data.lastVisit)) : null,
    nextVisit: data.nextVisit ? Timestamp.fromDate(new Date(data.nextVisit)) : null,
  })
}

export async function deleteClient(id: string) {
  await deleteDoc(doc(db, "clients", id))
}

export async function subtractVisit(id: string) {
  await updateDoc(doc(db, "clients", id), { subscriptionUsed: increment(1) })
}
