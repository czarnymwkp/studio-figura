const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const sa = require("../service-account.json");

const app = initializeApp({ credential: cert(sa) });
const db = getFirestore(app);

const BASE = "https://studiofigura.rzeszow.pl/wp-content/uploads";

const CENNIK = [
  {
    category: "Depilacja laserowa", order: 0,
    items: [
      { name: "Wąsik",            duration: "15 min", price: "99 zł"  },
      { name: "Pachy",            duration: "15 min", price: "129 zł" },
      { name: "Bikini klasyczne", duration: "20 min", price: "149 zł" },
      { name: "Bikini głębokie",  duration: "30 min", price: "199 zł" },
      { name: "Łydki",            duration: "30 min", price: "199 zł" },
      { name: "Uda",              duration: "30 min", price: "229 zł" },
      { name: "Nogi całe",        duration: "60 min", price: "349 zł" },
    ],
  },
  {
    category: "Modelowanie sylwetki", order: 1,
    items: [
      { name: "Kriolipoliza (1 aplikator)", duration: "60 min", price: "299 zł" },
      { name: "Kavitacja",                  duration: "45 min", price: "199 zł" },
      { name: "RF Multipolar",              duration: "45 min", price: "199 zł" },
      { name: "Lipolaser",                  duration: "40 min", price: "179 zł" },
      { name: "Roll Shaper",                duration: "30 min", price: "149 zł" },
      { name: "Vacu Shaper",                duration: "30 min", price: "149 zł" },
    ],
  },
  {
    category: "Zabiegi na twarz", order: 2,
    items: [
      { name: "HIFU 4D twarz",           duration: "60 min", price: "499 zł" },
      { name: "Laser frakcyjny",          duration: "45 min", price: "399 zł" },
      { name: "Carbon Master",            duration: "45 min", price: "349 zł" },
      { name: "Elektrostymulacja twarzy", duration: "40 min", price: "179 zł" },
    ],
  },
  {
    category: "Masaże i relaks", order: 3,
    items: [
      { name: "Limfodrenaż (nogi)",       duration: "45 min", price: "149 zł" },
      { name: "Limfodrenaż (całe ciało)", duration: "60 min", price: "199 zł" },
      { name: "Sauna",                    duration: "30 min", price: "49 zł"  },
    ],
  },
];

const DEVICES = [
  { name: "Laser Diamond Remover 1600W", description: "Urządzenie do depilacji laserowej.",                                        image: BASE + "/2024/05/diamond-model-300x200.jpg",         active: true  },
  { name: "Hifu 4D",                     description: "HIFU 4D wytwarza bezpieczną falę ultradźwiękową.",                          image: BASE + "/2024/05/hifu-4d-300x200.jpg",                active: true  },
  { name: "Ice Tech",                    description: "Kriolipoliza Ice Tech polega na uzyskaniu niskiej temperatury.",             image: BASE + "/2024/05/ice-tech-300x200.jpg",               active: true  },
  { name: "Laser frakcyjny",             description: "Laser frakcyjny działa na zmiany skórne punktowo.",                         image: BASE + "/2024/05/laser_frakcyjny_model-300x200.jpg",  active: true  },
  { name: "Multipolar RF",               description: "Multipolarne fale radiowe modelujące sylwetkę.",                            image: BASE + "/2024/05/multipolar-rf-300x200.jpg",          active: true  },
  { name: "Cavi Smart",                  description: "Odchudzający zabieg liposukcji kawitacyjnej.",                              image: BASE + "/2024/05/cavismart-300x200.jpg",              active: true  },
  { name: "Carbon Master",               description: "Laser emitujący wiązkę światła o dużej energii.",                          image: BASE + "/2024/05/carbon-master-300x200.jpg",          active: true  },
  { name: "Analizator Body Weight",      description: "Dokładne i bezpieczne pomiary składu ciała.",                              image: BASE + "/2024/05/analizator-body-weight-300x200.jpg", active: true  },
  { name: "Roll Shaper",                 description: "Gwarancja intensywnego i relaksacyjnego masażu.",                          image: BASE + "/2024/05/ROLLSHAPER-300x200.jpg",             active: true  },
  { name: "Swan Shaper",                 description: "Urządzenie do kompleksowego modelowania sylwetki.",                        image: BASE + "/2015/05/SWAN-400x267.jpg",                   active: true  },
  { name: "Vacu Shaper",                 description: "Urządzenie łączące zalety wysiłku fizycznego i działania podciśnienia.",   image: BASE + "/2015/05/1-7-400x262.jpg",                    active: false },
  { name: "Limfodrenaż",                 description: "Specjalistyczny masaż skóry i naskórka, który pobudza wytwarzanie płynów.",image: BASE + "/2015/05/LIMFO-400x267.jpg",                  active: true  },
  { name: "Elektrostymulacja",           description: "Prąd o niskiej częstotliwości wywołujący skurcz odpowiednich mięśni.",     image: BASE + "/2015/05/elektro-400x267.jpg",                active: true  },
  { name: "Sauna",                       description: "Do ogrzewania ciała wykorzystywane są bezpośrednio promienie podczerwone.", image: BASE + "/2015/05/sauna1-400x267.jpg",                 active: true  },
  { name: "Rower Poziomy",               description: "Przeznaczony dla osób, które chcą odciążyć odcinek lędźwiowy.",           image: BASE + "/2024/05/rower-600x400-1-300x200.jpg",        active: true  },
  { name: "Platforma Wibracyjna",        description: "10-15 minut ćwiczeń zastępuje kilka godzin na siłowni.",                  image: BASE + "/2015/05/PLATFORMA-400x267.jpg",              active: true  },
  { name: "Beauty Shaper",               description: "Rewolucja w modelowaniu problematycznych części ciała.",                   image: BASE + "/2015/05/BEAUTY-600x400.jpg",                 active: true  },
  { name: "Lipolaser",                   description: "Efekt odsysania tłuszczu bez zabiegu chirurgicznego.",                     image: BASE + "/2015/05/IMG_5254-600x400.jpg",               active: true  },
];

const PROMOTIONS = [
  {
    name: "Wakacyjny pakiet depilacji",
    description: "Skorzystaj z letniej promocji na depilację laserową. W cenie zabiegu na nogi całe otrzymujesz gratis depilację pach lub bikini. Oferta ograniczona czasowo — tylko przez lipiec i sierpień.",
    discount: "-20%", validUntil: "31.08.2026", image: "/img/studio-figura-login.jpg", active: true,
  },
  {
    name: "HIFU 4D — bezpłatna konsultacja",
    description: "Przy pierwszym zabiegu HIFU 4D twarz otrzymujesz bezpłatną konsultację z naszą specjalistką. Dowiedz się, jakie efekty możesz osiągnąć i zaplanuj optymalną serię zabiegów.",
    discount: "Gratis", validUntil: "30.06.2026", image: "/img/studio-figura-login.jpg", active: true,
  },
  {
    name: "Karnety kavitacja 5+1",
    description: "Kup karnet na 5 zabiegów kavitacji i szósty zabieg otrzymujesz całkowicie gratis. Idealny sposób na trwałe efekty modelowania sylwetki przy regularnej terapii.",
    discount: "-17%", validUntil: "31.07.2026", image: "/img/studio-figura-login.jpg", active: false,
  },
  {
    name: "Zimowa pielęgnacja twarzy",
    description: "Pakiet trzech zabiegów Carbon Master w cenie dwóch. Dogłębne oczyszczenie skóry, redukcja porów i rozjaśnienie przebarwień — idealne przygotowanie skóry na jesień i zimę.",
    discount: "-33%", validUntil: "28.02.2027", image: "/img/studio-figura-login.jpg", active: false,
  },
];

async function seed() {
  console.log("Seeding pricing...");
  for (const cat of CENNIK) {
    const ref = await db.collection("pricing").add({ ...cat, createdAt: Timestamp.now() });
    console.log("  pricing:", cat.category, "->", ref.id);
  }

  console.log("Seeding devices...");
  for (const device of DEVICES) {
    const ref = await db.collection("devices").add({ ...device, createdAt: Timestamp.now() });
    console.log("  device:", device.name, "->", ref.id);
  }

  console.log("Seeding promotions...");
  for (const promo of PROMOTIONS) {
    const ref = await db.collection("promotions").add({ ...promo, createdAt: Timestamp.now() });
    console.log("  promotion:", promo.name, "->", ref.id);
  }

  console.log("\nGotowe!");
  process.exit(0);
}

seed().catch((e) => { console.error(e.message); process.exit(1); });
