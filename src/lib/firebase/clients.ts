import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
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
  lastVisit: string | null
  nextVisit: string | null
}

interface ClientData {
  name: string
  surname: string
  email: string
  phone: string
  subscription: boolean
  lastVisit: Timestamp | null
  nextVisit: Timestamp | null
  createdAt: Timestamp
}

function fromFirestore(id: string, data: ClientData): Client {
  return {
    id,
    name: data.name,
    surname: data.surname,
    email: data.email,
    phone: data.phone,
    subscription: data.subscription,
    lastVisit: data.lastVisit ? data.lastVisit.toDate().toISOString().split("T")[0] : null,
    nextVisit: data.nextVisit ? data.nextVisit.toDate().toISOString().split("T")[0] : null,
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
