import type { MetadataRoute } from "next";
import { GAME_SLUGS } from "@/constant/gameModes";
import { SITE_URL } from "@/constant/site";

export const dynamic = "force-static";

/** No lastModified: it would be the build time, which changes on every deploy. */
export default function sitemap(): MetadataRoute.Sitemap {
  const weekly = "weekly" as const;

  return [
    {
      url: SITE_URL,
      changeFrequency: weekly,
      priority: 1,
    },
    ...GAME_SLUGS.map((slug) => ({
      url: `${SITE_URL}/game/${slug}/`,
      changeFrequency: weekly,
      priority: 0.85,
    })),
  ];
}
