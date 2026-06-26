import employersJson from "@/data/employers.json";

export type EmployerLevel = "Committed" | "Employer" | "Leader" | "Unknown";

export type Employer = {
  id: string;
  name: string;
  town: string;
  postcode: string;
  sector: string;
  level: EmployerLevel;
  region: string;
  isNew: boolean;
};

export type EmployerSearchResult = {
  items: Employer[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type PlatformStats = {
  total: number;
  newCount: number;
  levelCounts: Record<EmployerLevel, number>;
  regions: Array<{ name: string; count: number }>;
  sectors: Array<{ name: string; count: number }>;
  towns: Array<{ name: string; count: number }>;
};

const employers = employersJson as Employer[];

const searchIndex = employers.map((employer) => ({
  employer,
  text: [employer.name, employer.town, employer.postcode, employer.sector, employer.region, employer.level]
    .join(" ")
    .toLowerCase(),
}));

function countBy(key: keyof Employer) {
  const counts = new Map<string, number>();
  for (const employer of employers) {
    const value = String(employer[key] || "Unspecified");
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getStats(): PlatformStats {
  const levelCounts: PlatformStats["levelCounts"] = {
    Committed: 0,
    Employer: 0,
    Leader: 0,
    Unknown: 0,
  };

  for (const employer of employers) {
    levelCounts[employer.level] += 1;
  }

  return {
    total: employers.length,
    newCount: employers.filter((employer) => employer.isNew).length,
    levelCounts,
    regions: countBy("region"),
    sectors: countBy("sector"),
    towns: countBy("town").slice(0, 30),
  };
}

export function getEmployer(id: string) {
  return employers.find((employer) => employer.id === id);
}

export function searchEmployers({
  query = "",
  region = "",
  sector = "",
  level = "",
  page = 1,
  pageSize = 24,
}: {
  query?: string;
  region?: string;
  sector?: string;
  level?: string;
  page?: number;
  pageSize?: number;
}): EmployerSearchResult {
  const normalizedQuery = query.trim().toLowerCase();
  const safePageSize = Math.min(Math.max(pageSize, 12), 72);
  const safePage = Math.max(1, page);

  const filtered = searchIndex
    .filter(({ employer, text }) => {
      if (normalizedQuery && !text.includes(normalizedQuery)) return false;
      if (region && employer.region !== region) return false;
      if (sector && employer.sector !== sector) return false;
      if (level && employer.level !== level) return false;
      return true;
    })
    .map(({ employer }) => employer);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const currentPage = Math.min(safePage, totalPages);
  const start = (currentPage - 1) * safePageSize;

  return {
    items: filtered.slice(start, start + safePageSize),
    total,
    page: currentPage,
    pageSize: safePageSize,
    totalPages,
  };
}

export function jobSearchLinks(employer: Pick<Employer, "name" | "town">) {
  const location = employer.town || "United Kingdom";
  const query = `"${employer.name}" jobs ${location}`;

  return [
    { label: "Google Jobs", url: `https://www.google.com/search?q=${encodeURIComponent(query)}` },
    { label: "Indeed", url: `https://uk.indeed.com/jobs?q=${encodeURIComponent(employer.name)}&l=${encodeURIComponent(location)}` },
    { label: "LinkedIn", url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(employer.name)}&location=${encodeURIComponent(location)}` },
    { label: "Careers site", url: `https://www.google.com/search?q=${encodeURIComponent(`"${employer.name}" careers`)}` },
  ];
}
