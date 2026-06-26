"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Award, BadgeAlert, BarChart3, Briefcase, Building2, ExternalLink,
  Globe2, Loader2, MapPin, Medal, Search, ShieldCheck, Star, TrendingUp, User,
} from "lucide-react";
import type { Employer } from "@/lib/employers";
import type { Job } from "@/lib/jobs-types";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FavouriteButton } from "@/components/favourite-button";
import Link from "next/link";

const levelClass: Record<string, string> = {
  Leader: "is-leader",
  Employer: "is-employer",
  Committed: "is-committed",
  Unknown: "is-unknown",
};

function safeDate(dateStr: string) {
  if (!dateStr) return null;
  const n = Date.parse(dateStr);
  if (isNaN(n)) return null;
  return new Date(n).toLocaleDateString("en-GB");
}

type LiveJob = {
  title: string;
  link: string;
  source: string;
  snippet: string;
};

export function EmployerDetailClient({
  employer,
  jobs,
  searchLinks,
}: {
  employer: Employer;
  jobs: Job[];
  searchLinks: Array<{ label: string; url: string }>;
}) {
  const [liveJobs, setLiveJobs] = useState<LiveJob[] | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  const [showClaim, setShowClaim] = useState(false);
  const [claimForm, setClaimForm] = useState({ name: "", email: "", role: "" });
  const [claimSent, setClaimSent] = useState(false);

  const fetchLiveJobs = useCallback(async () => {
    setLiveLoading(true);
    setLiveJobs(null);
    setLiveStatus(null);
    try {
      const res = await fetch(`/api/live-jobs?id=${encodeURIComponent(employer.id)}`);
      const data = await res.json();
      if (data.results?.length) {
        setLiveJobs(data.results);
        setLiveStatus("Found live results from the web");
      } else {
        setLiveStatus(data.error || "No live results found");
      }
    } catch {
      setLiveStatus("Failed to fetch live jobs");
    } finally {
      setLiveLoading(false);
    }
  }, [employer.id]);

  function submitClaim(e: React.FormEvent) {
    e.preventDefault();
    const claims = JSON.parse(localStorage.getItem("aw_claims") ?? "[]");
    claims.push({ employerId: employer.id, ...claimForm, submittedAt: new Date().toISOString() });
    localStorage.setItem("aw_claims", JSON.stringify(claims));
    setClaimSent(true);
  }

  const breadcrumbs = [
    { label: "Employers", href: "/employers" },
    { label: employer.name, href: `/employer/${employer.id}` },
  ];

  const featuredJobs = jobs.filter((j) => j.featured);
  const standardJobs = jobs.filter((j) => !j.featured);

  return (
    <main className="platform-shell">
      <div style={{ padding: "24px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <Breadcrumbs items={breadcrumbs} />

        <div className="employer-hero" style={{ display: "flex", gap: 24, alignItems: "flex-start", margin: "16px 0 24px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span className={`level-pill ${levelClass[employer.level]}`} style={{ fontSize: "0.85rem", padding: "4px 12px" }}>{employer.level}</span>
              {employer.isNew ? <span className="chip active" style={{ fontSize: "0.75rem" }}>New addition</span> : null}
            </div>
            <h1 style={{ fontSize: "2.2rem", margin: "0 0 4px", color: "var(--blue)" }}>{employer.name}</h1>
            <p style={{ margin: 0, color: "var(--magenta)", fontWeight: 950 }}>
              {employer.sector}
            </p>
          </div>
          <div style={{ textAlign: "right", minWidth: 200 }}>
            <p style={{ margin: 0, fontWeight: 950 }}><MapPin size={16} style={{ verticalAlign: "middle" }} /> {employer.town || "UK"}</p>
            <small style={{ color: "var(--muted)" }}>{employer.region}{employer.postcode ? ` · ${employer.postcode}` : ""}</small>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
          <div>
            <section style={{ marginBottom: 24 }}>
              <div className="section-heading">
                <h2><Briefcase size={18} /> Jobs at {employer.name}</h2>
                <strong>{jobs.length} listing{jobs.length !== 1 ? "s" : ""}</strong>
              </div>

              {featuredJobs.length > 0 ? (
                <>
                  <h3 style={{ margin: "12px 0 8px", fontSize: "0.9rem", textTransform: "uppercase", color: "var(--magenta)" }}>Featured</h3>
                  {featuredJobs.map((job) => (
                    <Link key={job.id} href={`/jobs/${job.id}`} className="employer-job-row featured">
                      <div className="job-row-badges">
                        {job.featured ? <span className="badge-featured">Featured</span> : null}
                        {job.relevanceScore >= 30 ? <span className="badge-cyber"><ShieldCheck size={12} /> Cyber priority</span> : null}
                        <FavouriteButton jobId={job.id} />
                      </div>
                      <h4>{job.title}</h4>
                      <div className="job-meta">
                        <span>{job.location || "UK"}</span>
                        {job.salary ? <span>{job.salary}</span> : null}
                        <span>{job.employmentType}</span>
                        {safeDate(job.datePosted) ? <span>Posted {safeDate(job.datePosted)}</span> : null}
                      </div>
                    </Link>
                  ))}
                </>
              ) : null}

              <h3 style={{ margin: "16px 0 8px", fontSize: "0.9rem", textTransform: "uppercase", color: "var(--blue)" }}>
                {featuredJobs.length > 0 ? "All listings" : "Latest listings"}
              </h3>
              {standardJobs.length === 0 && featuredJobs.length === 0 ? (
                <div className="empty-state" style={{ margin: "20px 0" }}>
                  <Search size={24} />
                  <h3>No jobs listed yet</h3>
                  <p>Check the live feed or search for this employer on external sites.</p>
                </div>
              ) : (
                standardJobs.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`} className="employer-job-row">
                    <div className="job-row-badges">
                      {job.relevanceScore >= 30 ? <span className="badge-cyber"><ShieldCheck size={12} /> Cyber priority</span> : null}
                      <FavouriteButton jobId={job.id} />
                    </div>
                    <h4>{job.title}</h4>
                    <div className="job-meta">
                      <span>{job.location || "UK"}</span>
                      {job.salary ? <span>{job.salary}</span> : null}
                      <span>{job.employmentType}</span>
                      {safeDate(job.datePosted) ? <span>Posted {safeDate(job.datePosted)}</span> : null}
                    </div>
                  </Link>
                ))
              )}
            </section>

            <section className="panel" style={{ padding: 20 }}>
              <div className="section-heading">
                <h2><BarChart3 size={18} /> Live job feed</h2>
                <button type="button" className="chip" onClick={fetchLiveJobs} disabled={liveLoading} style={{ cursor: "pointer" }}>
                  {liveLoading ? <Loader2 size={14} className="spin" /> : null}
                  {liveLoading ? "Scanning..." : "Scan now"}
                </button>
              </div>
              {liveLoading ? (
                <p style={{ fontWeight: 950, margin: "16px 0" }}>Searching live job boards...</p>
              ) : liveJobs ? (
                <div style={{ marginTop: 12 }}>
                  <p style={{ fontWeight: 950, margin: "0 0 12px", fontSize: "0.85rem" }}>{liveStatus}</p>
                  {liveJobs.map((job, i) => (
                    <a key={i} href={job.link} target="_blank" rel="noopener noreferrer" className="employer-job-row live-row">
                      <h4>{job.title}</h4>
                      <div className="job-meta">
                        <span>{job.source}</span>
                        <span><ExternalLink size={12} /> View on source site</span>
                      </div>
                      {job.snippet ? <p style={{ fontSize: "0.8rem", margin: "4px 0 0", color: "var(--muted)" }}>{job.snippet.slice(0, 200)}</p> : null}
                    </a>
                  ))}
                </div>
              ) : liveStatus ? (
                <p style={{ marginTop: 12, fontWeight: 950 }}>{liveStatus}</p>
              ) : null}
            </section>

            <section className="panel" style={{ padding: 20, marginTop: 16 }}>
              <h2 style={{ margin: "0 0 12px", fontSize: "1rem", textTransform: "uppercase" }}>Search on other sites</h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {searchLinks.map((link) => (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="chip" style={{ textDecoration: "none", cursor: "pointer" }}>
                    <ExternalLink size={12} /> {link.label}
                  </a>
                ))}
              </div>
            </section>
          </div>

          <aside>
            <div className="profile-card" style={{ marginBottom: 16 }}>
              <h3><Building2 size={16} /> {employer.name}</h3>
              <div className="stat-rows">
                <span><Medal size={14} /> {employer.level}</span>
                <span><TrendingUp size={14} /> {employer.sector}</span>
                <span><MapPin size={14} /> {employer.town || "UK"}</span>
                <span><Globe2 size={14} /> {employer.region}</span>
              </div>
            </div>

            <div className="profile-card" style={{ marginBottom: 16 }}>
              <h3><Award size={16} /> Claim this listing</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "4px 0 8px" }}>
                Are you {employer.name}? Claim your profile to manage jobs, add your logo, and get featured placement.
              </p>
              {claimSent ? (
                <p style={{ fontWeight: 950, color: "var(--magenta)" }}>Claim submitted! We&apos;ll review and be in touch.</p>
              ) : showClaim ? (
                <form onSubmit={submitClaim} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <input value={claimForm.name} onChange={(e) => setClaimForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" required style={inputStyle} />
                  <input value={claimForm.email} onChange={(e) => setClaimForm((f) => ({ ...f, email: e.target.value }))} type="email" placeholder="Work email" required style={inputStyle} />
                  <input value={claimForm.role} onChange={(e) => setClaimForm((f) => ({ ...f, role: e.target.value }))} placeholder="Job title" required style={inputStyle} />
                  <button type="submit" className="chip active" style={{ cursor: "pointer", textAlign: "center" }}>Submit claim</button>
                </form>
              ) : (
                <button type="button" className="chip active" onClick={() => setShowClaim(true)} style={{ cursor: "pointer" }}>
                  Claim this employer
                </button>
              )}
            </div>

            <div className="profile-card">
              <h3><BadgeAlert size={16} /> Quick stats</h3>
              <div className="stat-rows">
                <span>{jobs.length} listing{jobs.length !== 1 ? "s" : ""}</span>
                <span>{featuredJobs.length} featured</span>
                <span>{jobs.filter((j) => j.relevanceScore >= 30).length} cyber priority</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  border: "3px solid var(--blue)",
  borderRadius: 8,
  padding: "8px 10px",
  fontWeight: 950,
  fontSize: "0.85rem",
  outline: 0,
  background: "var(--bg)",
  color: "var(--fg)",
};
