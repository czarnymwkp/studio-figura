// Podmienia obrazki (hotlinki z rzeszow.pl -> lokalne webp z public/img/urzadzenia)
// i opisy urządzeń na pełne teksty ze studiofigura.com.pl. Dopasowanie po polu name.
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const sa = require("../service-account.json");

const app = initializeApp({ credential: cert(sa) });
const db = getFirestore(app);

const IMG = "/img/urzadzenia";

const UPDATES = {
  "Laser Diamond Remover 1600W": {
    image: `${IMG}/diamond.webp`,
    description: "Nowoczesne rozwiązanie przeznaczone do usuwania niechcianego owłosienia. Laser diodowy wyróżnia się niezwykłą precyzją, dzięki czemu usuwa włosy nawet u osób o ciemniejszej karnacji. Pozwala cieszyć się gładką skórą na długo.",
  },
  "Hifu 4D": {
    image: `${IMG}/hifu_4d.webp`,
    description: "Odmładzający ciało zabieg, wykorzystujący działanie ultradźwięków, które doprowadzają do mikropoparzeń zwiększających produkcję kolagenu. W efekcie zmarszczki zostają wygładzone, kondycja skóry ulega poprawie, a rysy twarzy są podkreślone. Lifting ciała za pomocą HIFU 4D nie uszkadza zewnętrznej warstwy skóry.",
  },
  "Ice Tech": {
    image: `${IMG}/ice_tech.webp`,
    description: "Zabieg kriolipolizy polega na selektywnym wymrażaniu nadmiaru komórek tłuszczowych, które następnie obumierają i są wydalane z organizmu w procesie metabolicznym. W efekcie tkanka tłuszczowa zostaje zredukowana, a masa ciała ulega zmniejszeniu.",
  },
  "Laser frakcyjny": {
    image: `${IMG}/estetic_fraction.webp`,
    description: "Metoda odmładzania skóry, niwelująca zmarszczki, rozstępy i różnego rodzaju blizny. Estetic Fraction działa na zmiany skórne punktowo, dzięki czemu skóra wokół zostaje nienaruszona. Przyspiesza to proces gojenia i znacznie minimalizuje ryzyko powstania powikłań.",
  },
  "Multipolar RF": {
    image: `${IMG}/multipolar_pro.webp`,
    description: "Zabieg wykorzystujący działanie multipolarnych fal radiowych, które wspomagają redukcję tkanki tłuszczowej, modelują sylwetkę, wygładzają zmarszczki oraz poprawiają owal twarzy. Multipolar PRO może być stosowany na całym ciele, w tym na twarzy, i nie wymaga rekonwalescencji.",
  },
  "Cavi Smart": {
    image: `${IMG}/cavi_smart.webp`,
    description: "Odchudzający zabieg liposukcji kawitacyjnej, który za pomocą fal ultradźwiękowych bezboleśnie rozbija błony komórek tłuszczowych, których zawartość (lipidy) jest następnie wydalana z organizmu. Daje to efekt wysmuklenia nawet najbardziej problematycznych partii ciała.",
  },
  "Carbon Master": {
    image: `${IMG}/carbon_master.webp`,
    description: "Zaawansowane urządzenie laserowe, które skutecznie poprawia wygląd skóry, redukuje przebarwienia i umożliwia usuwanie tatuaży oraz makijażu permanentnego. Dzięki technologii peelingu węglowego skóra staje się gładsza, jędrniejsza i bardziej rozświetlona.",
  },
  "Analizator Body Weight": {
    image: `${IMG}/analizator_body_weight.webp`,
    description: "To analizator składu ciała, dostarczający takich informacji jak wiek metaboliczny, indeks masy ciała czy procentowa zawartość tkanki tłuszczowej lub białka w organizmie.",
  },
  "Roll Shaper": {
    image: `${IMG}/roll_shaper.webp`,
    description: "Roll Shaper służy do wykonywania masażu mechanicznego ciała i jest najskuteczniejszą metodą usuwania cellulitu, spłycania rozstępów, redukcji kilogramów, przebudowy kształtu pośladków oraz redukcji tkanki tłuszczowej problematycznych partii ciała.",
  },
  "Swan Shaper": {
    image: `${IMG}/swan_infra_shaper_classic.webp`,
    description: "Swan Infra Shaper to kompleksowa odpowiedź na potrzeby współczesnych kobiet. Urządzenie dzięki połączeniu działania lamp podczerwonych, światła kolagenowego i jonizacji: ujędrnia skórę, redukuje cellulit oraz tkankę tłuszczową, a także modeluje sylwetkę.",
  },
  "Vacu Shaper": {
    image: `${IMG}/vacu_shaper_classic.webp`,
    description: "Bieżnia z podciśnieniem, która umożliwia selektywne spalanie tkanki tłuszczowej z dolnych partii ciała bez utraty objętości biustu.",
  },
  "Limfodrenaż": {
    image: `${IMG}/limfodrenaz.webp`,
    description: "Limfodrenaż to urządzenie, które wykonuje masaż uciskowy, pobudzający układ limfatyczny. Stymuluje to organizm do szybszego oczyszczania się z toksyn oraz skutecznego odprężenia ciała i umysłu. Limfodrenaż stanowi jedną z najskuteczniejszych metod modelowania łydek i ud, odchudzania oraz usuwania cellulitu.",
  },
  "Elektrostymulacja": {
    image: `${IMG}/elektrostymulacja.webp`,
    description: "Zabieg polegający na wysyłaniu impulsów elektrycznych do organizmu człowieka, które doprowadzają do skurczu określonego mięśnia lub grupy mięśni. Każdy taki skurcz wiąże się z pracą, w związku z czym przyczynia się do spalania będącej nośnikiem energii tkanki tłuszczowej, a także modelowania mięśni. Urządzenie posiada też specjalistyczne pady do ujędrniania.",
  },
  "Sauna": {
    image: `${IMG}/sauna_infrared.webp`,
    description: "Świetna alternatywa dla tradycyjnej sauny. Optymalna temperatura i wilgotność powietrza w kabinie nie powodują problemów z oddychaniem, a promieniowanie podczerwone rozgrzewa ciało, umożliwiając spalanie tkanki tłuszczowej. Dodatkowo sauna na podczerwień rozluźnia mięśnie, poprawia przepływ krwi i łagodzi bóle stawów.",
  },
  "Rower Poziomy": {
    image: `${IMG}/rower_poziomy.webp`,
    description: "Rower poziomy – Body Speed pozwala zredukować nadmiar tkanki tłuszczowej, wzmacnia mięśnie oraz poprawia wydolność i ogólną sprawność organizmu.",
  },
  "Beauty Shaper": {
    image: `${IMG}/beauty_shaper.webp`,
    description: "Urządzenie do bezbolesnego modelowania sylwetki, wykorzystujące technologie endomasażu i liposukcji ultradźwiękowej. Ta innowacyjna metoda daje możliwość redukcji cellulitu i tkanki tłuszczowej. Jednocześnie, dzięki zastosowanym technologiom, Beauty Shaper jest w stanie wygładzić zmarszczki, poprawić owal twarzy i ujędrnić skórę.",
  },
  "Lipolaser": {
    image: `${IMG}/lipo.webp`,
    description: "Metoda bezinwazyjnego modelowania sylwetki. Zastosowanie zimnego lasera diodowego wspomaga redukcję tkanki tłuszczowej i cellulitu, a także poprawia kondycję skóry. Dzięki zabiegowi możliwe jest również dotarcie do głębszych warstw skóry, a w efekcie poprawienie procesów metabolicznych.",
  },
};

async function run() {
  const snap = await db.collection("devices").get();
  let updated = 0;
  const skipped = [];

  for (const doc of snap.docs) {
    const name = doc.data().name;
    const update = UPDATES[name];
    if (!update) {
      skipped.push(name);
      continue;
    }
    await doc.ref.update(update);
    console.log("updated:", name, "->", update.image);
    updated++;
  }

  console.log(`\n${updated} zaktualizowanych, pominięte:`, skipped.length ? skipped.join(", ") : "(brak)");
  process.exit(0);
}

run().catch((e) => { console.error(e.message); process.exit(1); });
