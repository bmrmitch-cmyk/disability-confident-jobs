import { getJobs } from "@/lib/jobs";
import { employers, getStats } from "@/lib/employers";
import { articles } from "@/data/articles";
import type { MetadataRoute } from "next";

const BASE = "https://disability-confident-platform.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const jobs = getJobs();
  const empStats = getStats();

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE}/employers`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE}/insights`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/profile`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...articles.map((a) => ({
      url: `${BASE}/insights/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...employers.slice(0, 500).map((e) => ({
      url: `${BASE}/employer/${e.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...jobs.slice(0, 500).map((job) => ({
      url: `${BASE}/jobs/${job.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
