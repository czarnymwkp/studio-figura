const { initializeApp, cert } = require("firebase-admin/app")
const { getAuth } = require("firebase-admin/auth")
const { getFirestore, FieldValue } = require("firebase-admin/firestore")
const sa = require("../service-account.json")

const app = initializeApp({ credential: cert(sa) })
const auth = getAuth(app)
const db = getFirestore(app)

async function main() {
  const email = "testowa.klientka@studiofigura.test"
  const password = "Test1234!"
  const name = "Anna"
  const surname = "Testowa"

  // Usuń istniejącego użytkownika jeśli już jest
  try {
    const existing = await auth.getUserByEmail(email)
    await auth.deleteUser(existing.uid)
    await db.collection("clients").doc(existing.uid).delete()
    await db.collection("users").doc(existing.uid).delete()
    console.log("Usunięto poprzednią wersję testowego konta.")
  } catch {}

  // Utwórz nowego
  const user = await auth.createUser({ email, password, displayName: `${name} ${surname}` })
  await auth.setCustomUserClaims(user.uid, { role: "client" })

  await Promise.all([
    db.collection("users").doc(user.uid).set({
      uid: user.uid,
      displayName: `${name} ${surname}`,
      email,
      role: "client",
      createdAt: FieldValue.serverTimestamp(),
    }),
    db.collection("clients").doc(user.uid).set({
      uid: user.uid,
      name,
      surname,
      email,
      phone: "600 123 456",
      subscription: true,
      subscriptionTotal: 10,
      subscriptionUsed: 8,
      points: 45,
      lastVisit: null,
      nextVisit: null,
      createdAt: FieldValue.serverTimestamp(),
    }),
  ])

  console.log(`\nKonto testowe utworzone!`)
  console.log(`  Email:   ${email}`)
  console.log(`  Hasło:   ${password}`)
  console.log(`  Karnet:  8/10 (pozostały 2 zabiegi — czerwone ostrzeżenie)`)
  console.log(`  UID:     ${user.uid}\n`)
}

main().catch(console.error).finally(() => process.exit())
