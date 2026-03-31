import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE = "https://www.tamilcharades.com";

const GAME_SLUGS = ["classic", "story", "song", "kids", "hollywood"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const weekly = "weekly" as const;

  return [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: weekly,
      priority: 1,
    },
    ...GAME_SLUGS.map((slug) => ({
      url: `${BASE}/game/${slug}`,
      lastModified: now,
      changeFrequency: weekly,
      priority: 0.85,
    })),
  ];
}
