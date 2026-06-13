import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, orderBy, Timestamp, serverTimestamp,
} from "firebase/firestore"
import { db } from "./config"

export type AutomationChannel = "sms" | "email"
export type AutomationTrigger =
  | "manual"
  | "subscription_expiring"
  | "no_visit"
  | "birthday"
  | "pre_visit"
export type AutomationAudience = "all" | "subscribers" | "non_subscribers"

export interface Automation {
  id: string
  name: string
  channel: AutomationChannel
  trigger: AutomationTrigger
  daysOffset: number | null
  audience: AutomationAudience
  message: string
  subject: string
  active: boolean
  createdAt: string
  lastRunAt: string | null
}

interface AutomationDoc {
  name: string
  channel: AutomationChannel
  trigger: AutomationTrigger
  daysOffset: number | null
  audience: AutomationAudience
  message: string
  subject: string
  active: boolean
  createdAt: Timestamp
  lastRunAt: Timestamp | null
}

function fromFirestore(id: string, data: AutomationDoc): Automation {
  return {
    id,
    name: data.name,
    channel: data.channel,
    trigger: data.trigger,
    daysOffset: data.daysOffset ?? null,
    audience: data.audience,
    message: data.message ?? "",
    subject: data.subject ?? "",
    active: data.active ?? false,
    createdAt: data.createdAt?.toDate().toISOString() ?? new Date().toISOString(),
    lastRunAt: data.lastRunAt ? data.lastRunAt.toDate().toISOString() : null,
  }
}

export function subscribeAutomations(callback: (list: Automation[]) => void) {
  const q = query(collection(db, "automations"), orderBy("createdAt", "desc"))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => fromFirestore(d.id, d.data() as AutomationDoc)))
  })
}

export async function createAutomation(data: Omit<Automation, "id" | "createdAt" | "lastRunAt">) {
  await addDoc(collection(db, "automations"), {
    ...data,
    createdAt: serverTimestamp(),
    lastRunAt: null,
  })
}

export async function updateAutomation(id: string, data: Omit<Automation, "id" | "createdAt" | "lastRunAt">) {
  await updateDoc(doc(db, "automations", id), data)
}

export async function toggleAutomation(id: string, active: boolean) {
  await updateDoc(doc(db, "automations", id), { active })
}

export async function deleteAutomation(id: string) {
  await deleteDoc(doc(db, "automations", id))
}

export async function markAutomationRun(id: string) {
  await updateDoc(doc(db, "automations", id), { lastRunAt: serverTimestamp() })
}

export const TRIGGER_LABELS: Record<AutomationTrigger, string> = {
  manual: "Kampania jednorazowa",
  subscription_expiring: "Koniec karnetu",
  no_visit: "Brak wizyty",
  birthday: "Urodziny klienta",
  pre_visit: "Przed wizytą",
}

export const TRIGGER_DESCRIPTIONS: Record<AutomationTrigger, string> = {
  manual: "Wysyłasz ręcznie w dowolnym momencie",
  subscription_expiring: "Automatycznie X dni przed końcem karnetu",
  no_visit: "Automatycznie X dni po ostatniej wizycie klienta",
  birthday: "Automatycznie w dniu urodzin klienta",
  pre_visit: "Automatycznie X dni przed zaplanowaną wizytą",
}

export const AUDIENCE_LABELS: Record<AutomationAudience, string> = {
  all: "Wszyscy klienci",
  subscribers: "Tylko z aktywnym karnetem",
  non_subscribers: "Tylko bez karnetu",
}

export const TEMPLATE_VARS: Record<AutomationTrigger, { var: string; label: string }[]> = {
  manual: [
    { var: "{{imię}}", label: "Imię" },
    { var: "{{nazwisko}}", label: "Nazwisko" },
  ],
  subscription_expiring: [
    { var: "{{imię}}", label: "Imię" },
    { var: "{{data_karnetu}}", label: "Data końca karnetu" },
    { var: "{{dni_do_końca}}", label: "Dni do końca" },
  ],
  no_visit: [
    { var: "{{imię}}", label: "Imię" },
    { var: "{{dni_od_wizyty}}", label: "Dni od ostatniej wizyty" },
  ],
  birthday: [
    { var: "{{imię}}", label: "Imię" },
  ],
  pre_visit: [
    { var: "{{imię}}", label: "Imię" },
    { var: "{{data_wizyty}}", label: "Data wizyty" },
    { var: "{{godzina_wizyty}}", label: "Godzina wizyty" },
  ],
}
