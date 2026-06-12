// Jednorazowo: przesuwa wizytę na wczoraj (test historii wizyt).
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const sa = require("../service-account.json");

const app = initializeApp({ credential: cert(sa) });
const db = getFirestore(app);

async function main() {
  const snap = await db.collection("appointments").get();
  if (snap.empty) { console.log("Brak wizyt"); return; }
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(10, 0, 0, 0);
  const doc = snap.docs[0];
  await doc.ref.update({ date: Timestamp.fromDate(d) });
  console.log(`Przesunięto: ${doc.data().clientName} | ${doc.data().treatment} → ${d.toLocaleString("pl-PL")}`);
}

main().then(() => process.exit(0));
