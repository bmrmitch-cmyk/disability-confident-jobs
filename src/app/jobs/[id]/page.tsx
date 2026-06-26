import { getJobs, getJobsForEmployer } from "@/lib/jobs";
import type { Metadata } from "next";
import Link from "next/link";

const BASE = "https://disability-confident-platform.vercel.app";

export async function generateStaticParams() {
  const jobs = getJobs();
  return jobs.slice(0, 500).map((job) => ({ id: job.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = getJobs().find((j) => j.id === id);
  if (!job) return { title: "Job not found" };
  return {
    title: `${job.title} at ${job.employerName} | AccessWork`,
    description: job.description?.slice(0, 160) || `Apply for ${job.title} at ${job.employerName}. Disability Confident employer.`,
    openGraph: {
      title: `${job.title} — ${job.employerName}`,
      description: job.description?.slice(0, 160),
    },
    alternates: { canonical: `${BASE}/jobs/${id}` },
  };
}

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const allJobs = getJobs();
  const job = allJobs.find((j) => j.id === id);
  if (!job) return <div style={{ padding: 40, color: "#00447c" }}>Job not found. <Link href="/">Back to jobs board.</Link></div>;

  const related = getJobsForEmployer(job.employerId).filter((j) => j.id !== job.id);

  const schema = {
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
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px", color: "#00447c" }}>
        <Link href="/" style={{ display: "inline-block", marginBottom: 20, fontWeight: 950, color: "#00447c" }}>&larr; Back to jobs board</Link>
        <h1 style={{ fontSize: "2.5rem", lineHeight: 1, textTransform: "uppercase", margin: "0 0 10px" }}>{job.title}</h1>
        <p style={{ fontSize: "1.2rem", fontWeight: 950, color: "#9a0070", margin: "0 0 20px" }}>{job.employerName}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          <span style={{ border: "3px solid #00447c", borderRadius: 8, padding: "8px 12px", fontWeight: 950 }}>{job.location}</span>
          <span style={{ border: "3px solid #00447c", borderRadius: 8, padding: "8px 12px", fontWeight: 950 }}>{job.employmentType}</span>
          {job.salary ? <span style={{ border: "3px solid #00447c", borderRadius: 8, padding: "8px 12px", fontWeight: 950 }}>{job.salary}</span> : null}
        </div>
        <div style={{ border: "3px solid #00447c", borderRadius: 8, padding: 20, background: "#fdf6ef", marginBottom: 20 }}>{job.description}</div>
        <a href={job.sourceUrl} target="_blank" rel="noreferrer" style={{
          display: "inline-flex", alignItems: "center", gap: 8, border: "3px solid #00447c",
          borderRadius: 8, background: "#e8b800", padding: "12px 20px", fontWeight: 950, color: "#00447c", textDecoration: "none",
        }}>Apply on {job.ats || "employer site"}</a>
        {related.length > 0 ? (
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: "1.8rem", textTransform: "uppercase" }}>More from {job.employerName}</h2>
            {related.slice(0, 5).map((r) => (
              <Link key={r.id} href={`/jobs/${r.id}`} style={{
                display: "block", border: "3px solid #00447c", borderRadius: 8, padding: 14, marginBottom: 10,
                color: "#00447c", textDecoration: "none", fontWeight: 950,
              }}>{r.title} — {r.location}</Link>
            ))}
          </div>
        ) : null}
      </main>
    </>
  );
}
