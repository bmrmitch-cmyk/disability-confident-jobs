import type { Employer } from "@/lib/employers";
import type { Job, JobSearchResult, JobsStats } from "@/lib/jobs-types";
import employersJson from "@/data/employers.json";

const employers = employersJson as Employer[];
const employerMap = new Map(employers.map((e) => [e.id, e]));

let jobsCache: Job[] | null = null;

function loadJobs(): Job[] {
  if (jobsCache) return jobsCache;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const raw = require("@/data/jobs.json") as Job[];
    jobsCache = raw.map((j) => ({
      ...j,
      employerName: employerMap.get(j.employerId)?.name ?? "Unknown",
    }));
  } catch {
    jobsCache = [];
  }
  return jobsCache;
}

export function getJobs(): Job[] {
  return loadJobs();
}

export function getJobsForEmployer(employerId: string): Job[] {
  return loadJobs().filter((job) => job.employerId === employerId);
}

export function getJobStats(): JobsStats {
  const jobs = loadJobs();
  const locationCounts = new Map<string, number>();
  const typeCounts = new Map<string, number>();
  let cyberPriority = 0;
  let apprenticeships = 0;

  for (const job of jobs) {
    if (job.relevanceScore >= 30) cyberPriority++;
    const type = job.employmentType?.toLowerCase() ?? "";
    if (type.includes("apprentice") || type.includes("trainee") || type.includes("graduate")) {
      apprenticeships++;
    }
    if (job.location) {
      locationCounts.set(job.location, (locationCounts.get(job.location) ?? 0) + 1);
    }
    if (job.employmentType) {
      typeCounts.set(job.employmentType, (typeCounts.get(job.employmentType) ?? 0) + 1);
    }
  }

  return {
    total: jobs.length,
    cyberPriority,
    apprenticeships,
    locations: [...locationCounts]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    employmentTypes: [...typeCounts]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
  };
}

export function searchJobs(params: {
  query?: string;
  employerId?: string;
  location?: string;
  employmentType?: string;
  cyberPriority?: boolean;
  page?: number;
  pageSize?: number;
}): JobSearchResult {
  let results = loadJobs();
  const safePage = Math.max(1, params.page ?? 1);
  const safePageSize = Math.min(Math.max(params.pageSize ?? 24, 12), 72);

  if (params.employerId) {
    results = results.filter((j) => j.employerId === params.employerId);
  }

  if (params.query) {
    const q = params.query.toLowerCase();
    results = results.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.employerName.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        (j.matchedKeywords && j.matchedKeywords.toLowerCase().includes(q)),
    );
  }

  if (params.location) {
    results = results.filter((j) => j.location === params.location);
  }

  if (params.employmentType) {
    results = results.filter((j) => j.employmentType === params.employmentType);
  }

  if (params.cyberPriority) {
    results = results.filter((j) => j.relevanceScore >= 30);
  }

  results.sort((a, b) => b.relevanceScore - a.relevanceScore || new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());

  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const currentPage = Math.min(safePage, totalPages);
  const start = (currentPage - 1) * safePageSize;

  return {
    items: results.slice(start, start + safePageSize),
    total,
    page: currentPage,
    pageSize: safePageSize,
    totalPages,
  };
}
