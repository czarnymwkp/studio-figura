import type { MetadataRoute } from "next"
import { SALONS, CITY_PAGES } from "@/lib/salons"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...CITY_PAGES.map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...SALONS.map((salon) => ({
      url: `${SITE_URL}/${salon.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ]
}
