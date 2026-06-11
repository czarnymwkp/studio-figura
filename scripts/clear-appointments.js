// Usuwa WSZYSTKIE wizyty z kolekcji appointments (czyszczenie danych testowych).
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const sa = require("../service-account.json");

const app = initializeApp({ credential: cert(sa) });
const db = getFirestore(app);

async function main() {
  const snap = await db.collection("appointments").get();
  console.log(`Znaleziono ${snap.size} wizyt — usuwam...`);
  const batchSize = 500;
  const docs = snap.docs;
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = db.batch();
    docs.slice(i, i + batchSize).forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
  console.log("Gotowe — kolekcja appointments pusta.");
}

main().then(() => process.exit(0));
