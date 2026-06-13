import type { MetadataRoute } from "next"
import { SALONS, CITY_PAGES } from "@/lib/salons"
import { SITE_URL } from "@/lib/site"
import { LOCALES } from "@/lib/i18n"

const NON_DEFAULT_LOCALES = LOCALES.filter((l) => l !== "pl")

function allLocaleUrls(path: string) {
  const canonical = `${SITE_URL}${path}`
  const alternates = NON_DEFAULT_LOCALES.map((l) => `${SITE_URL}/${l}${path}`)
  return [canonical, ...alternates]
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Home
  for (const url of allLocaleUrls("/")) {
    entries.push({ url, changeFrequency: "weekly", priority: 1 })
  }

  // Static pages
  entries.push({ url: `${SITE_URL}/polityka-prywatnosci`, changeFrequency: "yearly", priority: 0.3 })

  // City aggregator pages
  for (const slug of CITY_PAGES) {
    for (const url of allLocaleUrls(`/${slug}`)) {
      entries.push({ url, changeFrequency: "weekly", priority: 0.9 })
    }
  }

  // Individual salon pages
  for (const salon of SALONS) {
    for (const url of allLocaleUrls(`/${salon.slug}`)) {
      entries.push({ url, changeFrequency: "weekly", priority: 0.8 })
    }
  }

  return entries
}
