import { searchJobs, getJobStats } from "@/lib/jobs";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  if (params.get("stats") === "true") {
    return Response.json(getJobStats(), {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
    });
  }

  if (params.get("revalidate") === "true") {
    revalidatePath("/", "layout");
    return Response.json({ message: "Cache revalidated. New data will be served on next request." });
  }

  const results = searchJobs({
    query: params.get("q") ?? undefined,
    employerId: params.get("employerId") ?? undefined,
    location: params.get("location") ?? undefined,
    employmentType: params.get("employmentType") ?? undefined,
    cyberPriority: params.get("cyberPriority") === "true",
    page: params.get("page") ? Number(params.get("page")) : undefined,
    pageSize: params.get("pageSize") ? Number(params.get("pageSize")) : undefined,
  });

  return Response.json(results, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
  });
}
