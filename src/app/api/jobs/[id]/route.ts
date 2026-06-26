import { getJobs, getJobsForEmployer } from "@/lib/jobs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const allJobs = getJobs();
  const job = allJobs.find((j) => j.id === id);
  if (!job) {
    return Response.json({ error: "Job not found" }, { status: 404 });
  }
  const related = getJobsForEmployer(job.employerId).filter((j) => j.id !== job.id);
  return Response.json({ job, related });
}
