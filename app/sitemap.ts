import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://gitball.vercel.app";
  const now = new Date();

  const routes = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    // Pre-indexed famous developer Easter Eggs
    ...["torvalds", "yyx990803", "abhimanyutiwaribot", "abhimanyutwts", "gaearon"].map((username) => ({
      url: `${baseUrl}/scout/${username}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  return routes;
}
