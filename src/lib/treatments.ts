// Zabiegi pokazywane na publicznych stronach (landing + podstrony salonów).

export interface Treatment {
  name: string
  image: string
  description: string
}

export const TREATMENTS: Treatment[] = [
  {
    name: "Endo Fusion",
    image: "/img/urzadzenia/endo_fusion.webp",
    description: "Najnowszej generacji nieinwazyjne modelowanie ciała oraz lifting twarzy.",
  },
  {
    name: "HIFU 4D",
    image: "/img/urzadzenia/hifu_4d.webp",
    description: "Odmładzający zabieg ultradźwiękowy — wygładza zmarszczki i modeluje sylwetkę bez skalpela.",
  },
  {
    name: "Kriolipoliza Ice Tech",
    image: "/img/urzadzenia/ice_tech.webp",
    description: "Selektywne wymrażanie komórek tłuszczowych — redukcja tkanki tłuszczowej bez zabiegu chirurgicznego.",
  },
  {
    name: "Depilacja laserowa Diamond",
    image: "/img/urzadzenia/diamond.webp",
    description: "Precyzyjny laser diodowy — gładka skóra na długo, także przy ciemniejszej karnacji.",
  },
  {
    name: "Roll Shaper",
    image: "/img/urzadzenia/roll_shaper.webp",
    description: "Masaż mechaniczny — najskuteczniejsza metoda redukcji cellulitu i modelowania pośladków.",
  },
  {
    name: "Limfodrenaż",
    image: "/img/urzadzenia/limfodrenaz.webp",
    description: "Masaż uciskowy pobudzający układ limfatyczny — wysmukla nogi i oczyszcza organizm z toksyn.",
  },
  {
    name: "Carbon Master",
    image: "/img/urzadzenia/carbon_master.webp",
    description: "Peeling węglowy laserem — gładsza, jędrniejsza i rozświetlona skóra twarzy.",
  },
  {
    name: "Sauna Infrared",
    image: "/img/urzadzenia/sauna_infrared.webp",
    description: "Promieniowanie podczerwone rozgrzewa ciało, spala tkankę tłuszczową i rozluźnia mięśnie.",
  },
]
