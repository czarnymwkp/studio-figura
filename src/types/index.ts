import { Timestamp } from "firebase/firestore"

export type UserRole = "admin" | "employee" | "client"

export interface UserProfile {
  uid: string
  email: string
  role: UserRole
  phone: number
  displayName: string
  createdAt: Timestamp
  createdBy?: string
}

export interface EmployeeProfile extends UserProfile {
  role: "employee"
  name: string
  surname: string
}

export interface ClientProfile extends UserProfile {
  role: "client"
  name: string
  surname: string
  notes: string
}
