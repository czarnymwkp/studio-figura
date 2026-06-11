// Wypisuje wszystkie wizyty z kolekcji appointments (debug).
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const sa = require("../service-account.json");

const app = initializeApp({ credential: cert(sa) });
const db = getFirestore(app);

async function main() {
  const snap = await db.collection("appointments").get();
  console.log(`Wizyt w bazie: ${snap.size}`);
  snap.docs.forEach((d) => {
    const a = d.data();
    console.log(
      `- [${d.id}] ${a.clientName} | ${a.treatment} | ${a.category} | ` +
      `${a.date.toDate().toLocaleString("pl-PL")} | ${a.duration}h | ${a.price} zł | ${a.status} | clientId: ${a.clientId ?? "BRAK"}`
    );
  });
}

main().then(() => process.exit(0));
