import { getJobs, getJobsForEmployer } from "@/lib/jobs";

function jobPostingSchema(job: {
  title: string; employerName: string; location: string;
  description: string; datePosted: string; employmentType: string;
  salary: string; sourceUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    hiringOrganization: { "@type": "Organization", name: job.employerName },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location } },
    description: job.description,
    datePosted: job.datePosted || undefined,
    employmentType: job.employmentType || undefined,
    ...(job.salary ? { baseSalary: { "@type": "MonetaryAmount", value: job.salary } } : {}),
    url: job.sourceUrl,
    suitableFor: "DisabilityConfident",
  };
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const allJobs = getJobs();
  const job = allJobs.find((j) => j.id === id);
  if (!job) {
    return Response.json({ error: "Job not found" }, { status: 404 });
  }
  const related = getJobsForEmployer(job.employerId).filter((j) => j.id !== job.id);
  return Response.json({ job, related, schema: jobPostingSchema(job) });
}
