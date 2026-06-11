import { initializeApp, getApps, cert, type App } from "firebase-admin/app"
import { getAuth, type Auth } from "firebase-admin/auth"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

function parsePrivateKey(raw: string | undefined): string {
  if (!raw) throw new Error("FIREBASE_PRIVATE_KEY is not set")
  // Vercel may store it with literal \n, with JSON-escaped \\n, or with real newlines
  if (raw.startsWith('"') && raw.endsWith('"')) {
    // Pasted with surrounding quotes — strip them
    return JSON.parse(raw) as string
  }
  return raw.replace(/\\n/g, "\n")
}

let _app: App | null = null

function getAdminApp(): App {
  if (_app) return _app
  if (getApps().length > 0) {
    _app = getApps()[0]
    return _app
  }
  _app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
    }),
  })
  return _app
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp())
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp())
}

// Lazy proxies so callers can keep `adminAuth.xxx` and `adminDb.xxx` syntax
export const adminAuth: Auth = new Proxy({} as Auth, {
  get(_, prop: string) {
    const auth = getAdminAuth()
    const val = auth[prop as keyof Auth]
    return typeof val === "function" ? (val as Function).bind(auth) : val
  },
})

export const adminDb: Firestore = new Proxy({} as Firestore, {
  get(_, prop: string) {
    const db = getAdminDb()
    const val = db[prop as keyof Firestore]
    return typeof val === "function" ? (val as Function).bind(db) : val
  },
})
