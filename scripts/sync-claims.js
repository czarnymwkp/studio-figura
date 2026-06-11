// Syncs custom claim `role` on Firebase Auth users from the `users` collection.
// Needed for accounts created manually in the console (no claims set).
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const sa = require("../service-account.json");

const app = initializeApp({ credential: cert(sa) });
const auth = getAuth(app);
const db = getFirestore(app);

async function main() {
  const snap = await db.collection("users").get();
  for (const doc of snap.docs) {
    const { role, email, displayName } = doc.data();
    if (!role) {
      console.log(`SKIP ${doc.id} (${email}) — no role in Firestore`);
      continue;
    }
    try {
      const user = await auth.getUser(doc.id);
      const current = user.customClaims?.role;
      if (current === role) {
        console.log(`OK   ${email} — claim already "${role}"`);
        continue;
      }
      await auth.setCustomUserClaims(doc.id, { role });
      console.log(`SET  ${email} (${displayName}) — role "${role}"`);
    } catch (e) {
      console.log(`FAIL ${doc.id} (${email}) — ${e.message}`);
    }
  }
}

main().then(() => process.exit(0));
