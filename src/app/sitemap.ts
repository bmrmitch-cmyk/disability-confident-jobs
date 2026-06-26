import { getJobs } from "@/lib/jobs";
import type { MetadataRoute } from "next";

const BASE = "https://disability-confident-platform.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const jobs = getJobs();

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...jobs.slice(0, 500).map((job) => ({
      url: `${BASE}/jobs/${job.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
