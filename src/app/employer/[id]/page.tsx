import { getEmployer, jobSearchLinks } from "@/lib/employers";
import { getJobsForEmployer } from "@/lib/jobs";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EmployerDetailClient } from "./employer-detail-client";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const employer = getEmployer(id);
  if (!employer) return { title: "Employer not found" };
  return {
    title: `${employer.name} - Disability Confident employer`,
    description: `${employer.name} is a Disability Confident ${employer.level.toLowerCase()} in ${employer.town || "the UK"}, operating in the ${employer.sector} sector. Browse their latest jobs.`,
  };
}

export default async function EmployerDetail({ params }: Props) {
  const { id } = await params;
  const employer = getEmployer(id);
  if (!employer) notFound();

  const jobs = getJobsForEmployer(employer.id);
  const searchLinks = jobSearchLinks(employer);

  return <EmployerDetailClient employer={employer} jobs={jobs} searchLinks={searchLinks} />;
}
