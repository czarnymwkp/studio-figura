import { doc, onSnapshot, setDoc, Timestamp } from "firebase/firestore"
import { db } from "./config"

export const SMS_ADDON_PRICE = 39 // zł/mies.
export const SMS_ADDON_LIMIT = 300 // SMS w pakiecie
export const BASE_PLAN_PRICE = 100 // zł/mies.

export interface StudioPlan {
  smsPackage: boolean
  smsUsed: number
  smsLimit: number
}

const DEFAULT_PLAN: StudioPlan = {
  smsPackage: false,
  smsUsed: 0,
  smsLimit: SMS_ADDON_LIMIT,
}

export function subscribePlan(callback: (plan: StudioPlan) => void) {
  return onSnapshot(doc(db, "settings", "plan"), (snap) => {
    const data = snap.data()
    callback({
      smsPackage: data?.smsPackage ?? DEFAULT_PLAN.smsPackage,
      smsUsed: data?.smsUsed ?? DEFAULT_PLAN.smsUsed,
      smsLimit: data?.smsLimit ?? DEFAULT_PLAN.smsLimit,
    })
  })
}

export async function setSmsPackage(active: boolean) {
  await setDoc(
    doc(db, "settings", "plan"),
    {
      smsPackage: active,
      smsLimit: SMS_ADDON_LIMIT,
      ...(active && { smsActivatedAt: Timestamp.now() }),
    },
    { merge: true }
  )
}
