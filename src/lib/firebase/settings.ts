import {
  doc, getDoc, setDoc, onSnapshot, Timestamp,
} from "firebase/firestore"
import { db } from "./config"

// ─── Studio ──────────────────────────────────────────────────────────────────

export type DayHours = { open: string; close: string; closed: boolean }
export type WeekHours = Record<"mon"|"tue"|"wed"|"thu"|"fri"|"sat"|"sun", DayHours>

export interface StudioSettings {
  name: string
  address: string
  city: string
  postalCode: string
  phone: string
  email: string
  nip: string
  welcomeMessage: string
  hours: WeekHours
}

export const DEFAULT_HOURS: WeekHours = {
  mon: { open: "09:00", close: "18:00", closed: false },
  tue: { open: "09:00", close: "18:00", closed: false },
  wed: { open: "09:00", close: "18:00", closed: false },
  thu: { open: "09:00", close: "18:00", closed: false },
  fri: { open: "09:00", close: "18:00", closed: false },
  sat: { open: "09:00", close: "14:00", closed: false },
  sun: { open: "09:00", close: "14:00", closed: true },
}

export const DEFAULT_STUDIO: StudioSettings = {
  name: "Studio Figura",
  address: "",
  city: "",
  postalCode: "",
  phone: "",
  email: "",
  nip: "",
  welcomeMessage: "",
  hours: DEFAULT_HOURS,
}

// ─── Integrations ─────────────────────────────────────────────────────────────

export interface Integration {
  connected: boolean
  [key: string]: string | boolean
}

export interface IntegrationsSettings {
  wfirma:     { connected: boolean; apiKey: string; apiSecret: string }
  smsapi:     { connected: boolean; apiToken: string; sender: string }
  sendgrid:   { connected: boolean; apiKey: string; fromEmail: string; fromName: string }
  facebook:   { connected: boolean; pixelId: string; accessToken: string }
  google:     { connected: boolean; calendarId: string }
  przelewy24: { connected: boolean; merchantId: string; apiKey: string; crc: string }
  stripe:     { connected: boolean; publishableKey: string; secretKey: string }
}

export const DEFAULT_INTEGRATIONS: IntegrationsSettings = {
  wfirma:     { connected: false, apiKey: "", apiSecret: "" },
  smsapi:     { connected: false, apiToken: "", sender: "StudioFigura" },
  sendgrid:   { connected: false, apiKey: "", fromEmail: "", fromName: "Studio Figura" },
  facebook:   { connected: false, pixelId: "", accessToken: "" },
  google:     { connected: false, calendarId: "" },
  przelewy24: { connected: false, merchantId: "", apiKey: "", crc: "" },
  stripe:     { connected: false, publishableKey: "", secretKey: "" },
}

// ─── Portal ───────────────────────────────────────────────────────────────────

export interface PortalSettings {
  active: boolean
  allowBookings: boolean
  showPricing: boolean
  welcomeTitle: string
  welcomeText: string
  termsText: string
  privacyUrl: string
}

export const DEFAULT_PORTAL: PortalSettings = {
  active: true,
  allowBookings: true,
  showPricing: true,
  welcomeTitle: "Witaj w Studio Figura",
  welcomeText: "Zarezerwuj wizytę i zadbaj o siebie.",
  termsText: "",
  privacyUrl: "",
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export interface PaymentsSettings {
  cash: boolean
  card: boolean
  transfer: boolean
  online: boolean
  invoiceName: string
  invoiceAddress: string
  invoiceCity: string
  invoiceNip: string
  invoiceRegon: string
  vatRate: number
  currency: string
}

export const DEFAULT_PAYMENTS: PaymentsSettings = {
  cash: true,
  card: true,
  transfer: false,
  online: false,
  invoiceName: "",
  invoiceAddress: "",
  invoiceCity: "",
  invoiceNip: "",
  invoiceRegon: "",
  vatRate: 23,
  currency: "PLN",
}

// ─── Firestore helpers ────────────────────────────────────────────────────────

async function loadSetting<T>(id: string, defaults: T): Promise<T> {
  const snap = await getDoc(doc(db, "settings", id))
  if (!snap.exists()) return defaults
  return { ...defaults, ...snap.data() } as T
}

async function saveSetting<T extends object>(id: string, data: T): Promise<void> {
  await setDoc(doc(db, "settings", id), data, { merge: true })
}

export const loadStudio = () => loadSetting("studio", DEFAULT_STUDIO)
export const saveStudio = (data: StudioSettings) => saveSetting("studio", data)
export function subscribeStudio(callback: (s: StudioSettings) => void) {
  return onSnapshot(doc(db, "settings", "studio"), (snap) => {
    callback(snap.exists() ? { ...DEFAULT_STUDIO, ...snap.data() } as StudioSettings : DEFAULT_STUDIO)
  })
}

export const loadIntegrations = () => loadSetting("integrations", DEFAULT_INTEGRATIONS)
export const saveIntegration = <K extends keyof IntegrationsSettings>(
  key: K, data: IntegrationsSettings[K]
) => setDoc(doc(db, "settings", "integrations"), { [key]: data }, { merge: true })

export const loadPortal = () => loadSetting("portal", DEFAULT_PORTAL)
export const savePortal = (data: PortalSettings) => saveSetting("portal", data)
export function subscribePortal(callback: (s: PortalSettings) => void) {
  return onSnapshot(doc(db, "settings", "portal"), (snap) => {
    callback(snap.exists() ? { ...DEFAULT_PORTAL, ...snap.data() } as PortalSettings : DEFAULT_PORTAL)
  })
}

export const loadPayments = () => loadSetting("payments", DEFAULT_PAYMENTS)
export const savePayments = (data: PaymentsSettings) => saveSetting("payments", data)
