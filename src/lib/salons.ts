// Centralne dane salonów dla publicznych stron (landing, wyszukiwarka, stopka, SEO).
// Docelowo sieć ma ~600 salonów — dodawanie kolejnych to dopisanie wpisu tutaj.

export interface Salon {
  slug: string
  city: string
  name: string
  address: string
  postalCode: string
  phone: string
  email?: string
  /** kolejne linie godzin otwarcia */
  hours: string[]
  /** godziny w formacie schema.org (JSON-LD), np. "Mo-We 09:00-20:00" */
  openingHoursSchema?: string[]
  lat: number
  lng: number
  mapsUrl: string
}

// posortowane alfabetycznie po mieście (polska kolejność znaków), potem po nazwie
export const SALONS: Salon[] = sortSalons([
  {
    slug: "krasnik-konopnickiej",
    city: "Kraśnik",
    name: "Studio Figura Kraśnik",
    address: "ul. Marii Konopnickiej 1",
    postalCode: "23-200 Kraśnik",
    phone: "729 925 533",
    hours: ["pn–śr 9:00 – 20:00", "czw–pt 9:00 – 21:00", "sob 9:00 – 15:00"],
    openingHoursSchema: ["Mo-We 09:00-20:00", "Th-Fr 09:00-21:00", "Sa 09:00-15:00"],
    lat: 50.9258,
    lng: 22.2255,
    mapsUrl: "https://maps.google.com/?q=Studio+Figura+Kra%C5%9Bnik+Marii+Konopnickiej+1",
  },
  {
    slug: "krasnik-lubelska",
    city: "Kraśnik",
    name: "Studio Figura Kraśnik Lubelska",
    address: "ul. Lubelska 58a",
    postalCode: "23-200 Kraśnik",
    phone: "661 601 150",
    email: "studiofiguralubelska58a@gmail.com",
    hours: ["pn–pt 9:00 – 20:00", "sob 9:00 – 15:00", "nd 9:00 – 19:00"],
    openingHoursSchema: ["Mo-Fr 09:00-20:00", "Sa 09:00-15:00", "Su 09:00-19:00"],
    lat: 50.955,
    lng: 22.255,
    mapsUrl: "https://maps.google.com/?q=Studio+Figura+Kra%C5%9Bnik+Lubelska+58a",
  },
  {
    slug: "stalowa-wola",
    city: "Stalowa Wola",
    name: "Studio Figura Stalowa Wola",
    address: "ul. Poniatowskiego 8",
    postalCode: "37-450 Stalowa Wola",
    phone: "791 024 664",
    email: "sf.stalowawola@gmail.com",
    hours: ["pn–pt 9:00 – 20:00"],
    openingHoursSchema: ["Mo-Fr 09:00-20:00"],
    lat: 50.575,
    lng: 22.055,
    mapsUrl: "https://maps.google.com/?q=Studio+Figura+Stalowa+Wola+Poniatowskiego+8",
  },
  {
    slug: "sandomierz",
    city: "Sandomierz",
    name: "Studio Figura Sandomierz",
    address: "ul. Słowackiego 35a/5a",
    postalCode: "27-600 Sandomierz",
    phone: "692 163 720",
    email: "kontakt@studiofigurasandomierz.pl",
    hours: ["pn–pt 8:30 – 20:00", "co druga sobota miesiąca 9:00 – 14:00"],
    openingHoursSchema: ["Mo-Fr 08:30-20:00"],
    lat: 50.678,
    lng: 21.733,
    mapsUrl: "https://maps.google.com/?q=Studio+Figura+Sandomierz+S%C5%82owackiego+35a",
  },
])

function sortSalons(salons: Salon[]) {
  return salons.sort(
    (a, b) => a.city.localeCompare(b.city, "pl") || a.name.localeCompare(b.name, "pl")
  )
}

export function getSalon(slug: string) {
  return SALONS.find((s) => s.slug === slug)
}

export function citySlug(city: string) {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l")
    .replace(/\s+/g, "-")
}

/** Miasta z więcej niż jednym salonem dostają zbiorczą podstronę miasta, np. /krasnik. */
export function getCitySalons(slug: string) {
  const salons = SALONS.filter((s) => citySlug(s.city) === slug)
  return salons.length > 1 ? salons : undefined
}

export const CITY_PAGES = [...new Set(SALONS.map((s) => citySlug(s.city)))].filter(
  (slug) => getCitySalons(slug)
)
