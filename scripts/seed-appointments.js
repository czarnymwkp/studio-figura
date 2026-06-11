const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const sa = require("../service-account.json");

const app = initializeApp({ credential: cert(sa) });
const db = getFirestore(app);

// Dzisiaj = 2026-06-11 (czwartek)
function d(year, month, day, hour = 9) {
  return Timestamp.fromDate(new Date(year, month - 1, day, hour, 0, 0));
}

const APPOINTMENTS = [
  // --- Dzisiejsze (2026-06-11) ---
  { clientName: "Anna Kowalska",         treatment: "Depilacja — pachy",        category: "Depilacja laserowa",    date: d(2026,6,11,9),  duration: 0.25, price: 129, status: "scheduled" },
  { clientName: "Marta Wiśniewska",      treatment: "HIFU 4D twarz",            category: "Zabiegi na twarz",      date: d(2026,6,11,10), duration: 1,    price: 499, status: "scheduled" },
  { clientName: "Karolina Nowak",        treatment: "Kavitacja brzuch",          category: "Modelowanie sylwetki",  date: d(2026,6,11,12), duration: 0.75, price: 199, status: "scheduled" },
  { clientName: "Joanna Zielińska",      treatment: "Roll Shaper",              category: "Masaże i relaks",       date: d(2026,6,11,14), duration: 0.5,  price: 149, status: "scheduled" },

  // --- Ten tydzień (06-09 pn – 06-13 pt) ---
  { clientName: "Ewa Kaczmarek",         treatment: "Laser frakcyjny",          category: "Zabiegi na twarz",      date: d(2026,6,9,10),  duration: 0.75, price: 399, status: "completed" },
  { clientName: "Paulina Wójcik",        treatment: "RF Multipolar",            category: "Modelowanie sylwetki",  date: d(2026,6,9,12),  duration: 0.75, price: 199, status: "completed" },
  { clientName: "Agnieszka Lewandowska", treatment: "Limfodrenaż (nogi)",       category: "Masaże i relaks",       date: d(2026,6,9,14),  duration: 0.75, price: 149, status: "completed" },
  { clientName: "Anna Kowalska",         treatment: "Depilacja — bikini",       category: "Depilacja laserowa",    date: d(2026,6,10,9),  duration: 0.5,  price: 149, status: "completed" },
  { clientName: "Marta Wiśniewska",      treatment: "Kriolipoliza",             category: "Modelowanie sylwetki",  date: d(2026,6,10,11), duration: 1,    price: 299, status: "completed" },
  { clientName: "Karolina Nowak",        treatment: "Carbon Master",            category: "Zabiegi na twarz",      date: d(2026,6,10,14), duration: 0.75, price: 349, status: "completed" },
  { clientName: "Joanna Zielińska",      treatment: "HIFU 4D twarz",            category: "Zabiegi na twarz",      date: d(2026,6,12,9),  duration: 1,    price: 499, status: "scheduled" },
  { clientName: "Ewa Kaczmarek",         treatment: "RF Multipolar",            category: "Modelowanie sylwetki",  date: d(2026,6,12,11), duration: 0.75, price: 199, status: "scheduled" },
  { clientName: "Paulina Wójcik",        treatment: "Depilacja — nogi całe",    category: "Depilacja laserowa",    date: d(2026,6,13,10), duration: 1,    price: 349, status: "scheduled" },

  // --- Ten miesiąc (cały czerwiec) ---
  { clientName: "Agnieszka Lewandowska", treatment: "Roll Shaper",              category: "Masaże i relaks",       date: d(2026,6,2,10),  duration: 0.5,  price: 149, status: "completed" },
  { clientName: "Anna Kowalska",         treatment: "Depilacja — pachy",        category: "Depilacja laserowa",    date: d(2026,6,2,12),  duration: 0.25, price: 129, status: "completed" },
  { clientName: "Marta Wiśniewska",      treatment: "Kavitacja brzuch",         category: "Modelowanie sylwetki",  date: d(2026,6,3,9),   duration: 0.75, price: 199, status: "completed" },
  { clientName: "Karolina Nowak",        treatment: "Lipolaser",                category: "Modelowanie sylwetki",  date: d(2026,6,3,11),  duration: 0.67, price: 179, status: "completed" },
  { clientName: "Joanna Zielińska",      treatment: "Elektrostymulacja twarzy", category: "Zabiegi na twarz",      date: d(2026,6,4,10),  duration: 0.67, price: 179, status: "completed" },
  { clientName: "Ewa Kaczmarek",         treatment: "Sauna",                    category: "Masaże i relaks",       date: d(2026,6,4,13),  duration: 0.5,  price: 49,  status: "completed" },
  { clientName: "Paulina Wójcik",        treatment: "HIFU 4D twarz",            category: "Zabiegi na twarz",      date: d(2026,6,5,9),   duration: 1,    price: 499, status: "completed" },
  { clientName: "Agnieszka Lewandowska", treatment: "Depilacja — nogi całe",    category: "Depilacja laserowa",    date: d(2026,6,5,11),  duration: 1,    price: 349, status: "completed" },
  { clientName: "Anna Kowalska",         treatment: "Kriolipoliza",             category: "Modelowanie sylwetki",  date: d(2026,6,6,10),  duration: 1,    price: 299, status: "completed" },
  { clientName: "Marta Wiśniewska",      treatment: "Carbon Master",            category: "Zabiegi na twarz",      date: d(2026,6,6,12),  duration: 0.75, price: 349, status: "completed" },
  { clientName: "Karolina Nowak",        treatment: "RF Multipolar",            category: "Modelowanie sylwetki",  date: d(2026,6,7,9),   duration: 0.75, price: 199, status: "completed" },
  { clientName: "Joanna Zielińska",      treatment: "Limfodrenaż (całe ciało)", category: "Masaże i relaks",       date: d(2026,6,7,11),  duration: 1,    price: 199, status: "completed" },
  { clientName: "Ewa Kaczmarek",         treatment: "Laser frakcyjny",          category: "Zabiegi na twarz",      date: d(2026,6,8,10),  duration: 0.75, price: 399, status: "completed" },
  { clientName: "Paulina Wójcik",        treatment: "Kavitacja brzuch",         category: "Modelowanie sylwetki",  date: d(2026,6,8,14),  duration: 0.75, price: 199, status: "completed" },
  { clientName: "Agnieszka Lewandowska", treatment: "Depilacja — bikini",       category: "Depilacja laserowa",    date: d(2026,6,14,10), duration: 0.5,  price: 149, status: "scheduled" },
  { clientName: "Anna Kowalska",         treatment: "Roll Shaper",              category: "Masaże i relaks",       date: d(2026,6,15,9),  duration: 0.5,  price: 149, status: "scheduled" },
  { clientName: "Marta Wiśniewska",      treatment: "HIFU 4D twarz",            category: "Zabiegi na twarz",      date: d(2026,6,16,11), duration: 1,    price: 499, status: "scheduled" },
  { clientName: "Karolina Nowak",        treatment: "Depilacja — nogi całe",    category: "Depilacja laserowa",    date: d(2026,6,17,10), duration: 1,    price: 349, status: "scheduled" },
  { clientName: "Joanna Zielińska",      treatment: "RF Multipolar",            category: "Modelowanie sylwetki",  date: d(2026,6,18,9),  duration: 0.75, price: 199, status: "scheduled" },
  { clientName: "Ewa Kaczmarek",         treatment: "Carbon Master",            category: "Zabiegi na twarz",      date: d(2026,6,19,12), duration: 0.75, price: 349, status: "scheduled" },
  { clientName: "Paulina Wójcik",        treatment: "Lipolaser",                category: "Modelowanie sylwetki",  date: d(2026,6,20,10), duration: 0.67, price: 179, status: "scheduled" },

  // --- Poprzedni miesiąc (maj) dla porównania ---
  { clientName: "Anna Kowalska",         treatment: "Depilacja — pachy",        category: "Depilacja laserowa",    date: d(2026,5,5,9),   duration: 0.25, price: 129, status: "completed" },
  { clientName: "Marta Wiśniewska",      treatment: "HIFU 4D twarz",            category: "Zabiegi na twarz",      date: d(2026,5,6,10),  duration: 1,    price: 499, status: "completed" },
  { clientName: "Karolina Nowak",        treatment: "Kavitacja brzuch",         category: "Modelowanie sylwetki",  date: d(2026,5,7,11),  duration: 0.75, price: 199, status: "completed" },
  { clientName: "Joanna Zielińska",      treatment: "Roll Shaper",              category: "Masaże i relaks",       date: d(2026,5,8,14),  duration: 0.5,  price: 149, status: "completed" },
  { clientName: "Ewa Kaczmarek",         treatment: "Laser frakcyjny",          category: "Zabiegi na twarz",      date: d(2026,5,12,10), duration: 0.75, price: 399, status: "completed" },
  { clientName: "Paulina Wójcik",        treatment: "RF Multipolar",            category: "Modelowanie sylwetki",  date: d(2026,5,13,12), duration: 0.75, price: 199, status: "completed" },
  { clientName: "Agnieszka Lewandowska", treatment: "Depilacja — nogi całe",    category: "Depilacja laserowa",    date: d(2026,5,14,9),  duration: 1,    price: 349, status: "completed" },
  { clientName: "Anna Kowalska",         treatment: "Carbon Master",            category: "Zabiegi na twarz",      date: d(2026,5,19,11), duration: 0.75, price: 349, status: "completed" },
  { clientName: "Marta Wiśniewska",      treatment: "Kriolipoliza",             category: "Modelowanie sylwetki",  date: d(2026,5,20,10), duration: 1,    price: 299, status: "completed" },
  { clientName: "Karolina Nowak",        treatment: "HIFU 4D twarz",            category: "Zabiegi na twarz",      date: d(2026,5,21,9),  duration: 1,    price: 499, status: "completed" },
  { clientName: "Joanna Zielińska",      treatment: "Lipolaser",                category: "Modelowanie sylwetki",  date: d(2026,5,22,11), duration: 0.67, price: 179, status: "completed" },
  { clientName: "Ewa Kaczmarek",         treatment: "Limfodrenaż (nogi)",       category: "Masaże i relaks",       date: d(2026,5,26,10), duration: 0.75, price: 149, status: "completed" },
  { clientName: "Paulina Wójcik",        treatment: "Depilacja — bikini",       category: "Depilacja laserowa",    date: d(2026,5,27,12), duration: 0.5,  price: 149, status: "completed" },
  { clientName: "Agnieszka Lewandowska", treatment: "Elektrostymulacja twarzy", category: "Zabiegi na twarz",      date: d(2026,5,28,9),  duration: 0.67, price: 179, status: "completed" },
];

async function seed() {
  console.log(`Seeding ${APPOINTMENTS.length} appointments...`);
  const col = db.collection("appointments");
  for (const appt of APPOINTMENTS) {
    const ref = await col.add({ ...appt, createdAt: Timestamp.now() });
    console.log(" ", appt.clientName, "-", appt.treatment, "->", ref.id);
  }
  console.log("\nGotowe!");
  process.exit(0);
}

seed().catch((e) => { console.error(e.message); process.exit(1); });
