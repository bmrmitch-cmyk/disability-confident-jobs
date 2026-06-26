import { getEmployer, jobSearchLinks } from "@/lib/employers";
import type { Employer } from "@/lib/employers";

type LiveJob = {
  title: string;
  link: string;
  source: string;
  snippet: string;
};

type LiveJobsResponse = {
  employer: Employer;
  query: string;
  status: "live" | "fallback" | "error";
  checkedAt: string;
  results: LiveJob[];
  links: Array<{ label: string; url: string }>;
  error?: string;
};

function decode(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCharCode(Number(code)))
    .replace(/&([a-z]+);/gi, (_match, entity) => {
      const map: Record<string, string> = { amp: "&", apos: "'", gt: ">", lt: "<", quot: '"' };
      return map[entity] ?? `&${entity};`;
    })
    .replace(/\s+/g, " ")
    .trim();
}

function tag(item: string, name: string): string {
  const match = item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"));
  return match ? decode(match[1]) : "";
}

function parseRss(xml: string): LiveJob[] {
  return [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)]
    .map((match) => {
      const item = match[0];
      const link = tag(item, "link");
      let source = "Web";
      try {
        source = link ? new URL(link).hostname.replace(/^www\./, "") : "Web";
      } catch {}

      return {
        title: tag(item, "title"),
        link,
        source,
        snippet: tag(item, "description"),
      };
    })
    .filter((job): job is LiveJob => Boolean(job.title && job.link))
    .slice(0, 8);
}

export async function GET(request: Request): Promise<Response> {
  const id = new URL(request.url).searchParams.get("id") ?? "";
  const employer = getEmployer(id);

  if (!employer) {
    return Response.json({ error: "Employer not found" }, { status: 404 });
  }

  const query = `"${employer.name}" jobs ${employer.town || "UK"}`;
  let results: LiveJob[] = [];
  let error: string | undefined;

  try {
    const response = await fetch(
      `https://www.bing.com/search?format=rss&q=${encodeURIComponent(query)}`,
      {
        next: { revalidate: 3600 },
        headers: { "User-Agent": "Mozilla/5.0 (compatible; AccessWorkRadar/1.0)" },
      },
    );

    if (response.ok) {
      results = parseRss(await response.text());
    } else {
      error = `Bing returned status ${response.status}`;
    }
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Unknown fetch error";
  }

  const responseBody: LiveJobsResponse = {
    employer,
    query,
    status: results.length ? "live" : error ? "error" : "fallback",
    checkedAt: new Date().toISOString(),
    results,
    links: jobSearchLinks(employer),
    ...(error ? { error } : {}),
  };

  return Response.json(responseBody, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}
