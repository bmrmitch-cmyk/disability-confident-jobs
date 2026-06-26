"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BadgeAlert, BarChart3, Briefcase, Building2,
  CheckCircle2, ExternalLink, Filter, Globe2, GraduationCap, Layers3, Loader2,
  MapPin, Medal, Radar, Search, ShieldCheck, Sparkles, X,
} from "lucide-react";
import type { Employer, EmployerSearchResult, PlatformStats } from "@/lib/employers";
import type { Job, JobSearchResult, JobsStats } from "@/lib/jobs-types";

function safeDate(dateStr: string) {
  if (!dateStr) return null;
  const n = Date.parse(dateStr);
  if (isNaN(n)) return null;
  return new Date(n).toLocaleDateString("en-GB");
}

function safeTime(dateStr: string) {
  if (!dateStr) return null;
  const n = Date.parse(dateStr);
  if (isNaN(n)) return null;
  return new Date(n).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

type LiveJobs = {
  query: string;
  status: "live" | "fallback";
  checkedAt: string;
  results: Array<{ title: string; link: string; source: string; snippet: string }>;
  links: Array<{ label: string; url: string }>;
};

type ViewMode = "jobs" | "employers";

const levelClass: Record<string, string> = {
  Leader: "is-leader",
  Employer: "is-employer",
  Committed: "is-committed",
  Unknown: "is-unknown",
};

function number(value: number) {
  return new Intl.NumberFormat("en-GB").format(value);
}

function share(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0;
}

export function RadarWorkbench({ stats, initialResults }: { stats: PlatformStats; initialResults: EmployerSearchResult }) {
  const [view, setView] = useState<ViewMode>("jobs");

  return (
    <main className="platform-shell">
      <TopBar stats={stats} view={view} onViewChange={setView} />
      <Marquee />
      {view === "jobs" ? <JobsBoard /> : <EmployerDirectory stats={stats} initialResults={initialResults} />}
    </main>
  );
}

function TopBar({ stats, view, onViewChange }: { stats: PlatformStats; view: ViewMode; onViewChange: (v: ViewMode) => void }) {
  return (
    <section className="topbar">
      <div className="brand-lockup">
        <span className="brand-mark"><Radar size={24} /></span>
        <div>
          <p>AccessWork</p>
          <span>Vacancies without the access guesswork</span>
        </div>
      </div>
      <div className="topbar-tabs">
        <button type="button" className={view === "jobs" ? "active" : ""} onClick={() => onViewChange("jobs")}>
          <Briefcase size={16} /> Live Jobs
        </button>
        <button type="button" className={view === "employers" ? "active" : ""} onClick={() => onViewChange("employers")}>
          <Building2 size={16} /> Employers
        </button>
      </div>
      <div className="topbar-stats">
        <span>{number(stats.total)} employers</span>
        <strong>{number(stats.total)} indexed</strong>
      </div>
    </section>
  );
}

function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <span>Accessible • Inclusive • Supported • Disability Confident • Live vacancies • Reasonable adjustments •</span>
      <span>Accessible • Inclusive • Supported • Disability Confident • Live vacancies • Reasonable adjustments •</span>
    </div>
  );
}

function JobsBoard() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [cyberPriority, setCyberPriority] = useState(false);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<JobSearchResult>({ items: [], total: 0, page: 1, pageSize: 24, totalPages: 1 });
  const [stats, setStats] = useState<JobsStats | null>(null);
  const [selected, setSelected] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);

  const activeFilters = useMemo(() => [query, location, employmentType].filter(Boolean).length + (cyberPriority ? 1 : 0), [query, location, employmentType, cyberPriority]);

  useEffect(() => {
    fetch("/api/jobs?stats=true").then((r) => r.json()).then(setStats);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: "24" });
      if (query.trim()) params.set("q", query.trim());
      if (location) params.set("location", location);
      if (employmentType) params.set("employmentType", employmentType);
      if (cyberPriority) params.set("cyberPriority", "true");

      setLoading(true);
      try {
        const response = await fetch(`/api/jobs?${params}`, { signal: controller.signal });
        const nextResults = (await response.json()) as JobSearchResult;
        setResults(nextResults);
        setSelected((current) => {
          if (current && nextResults.items.some((item) => item.id === current.id)) return current;
          return nextResults.items[0] ?? null;
        });
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setResults({ items: [], total: 0, page: 1, pageSize: 24, totalPages: 1 });
        }
      } finally {
        setLoading(false);
      }
    }, 160);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, location, employmentType, cyberPriority, page]);

  function resetPage<T>(setter: (value: T) => void, value: T) {
    setPage(1);
    setter(value);
  }

  function clearFilters() {
    setQuery("");
    setLocation("");
    setEmploymentType("");
    setCyberPriority(false);
    setPage(1);
  }

  return (
    <section className="workspace">
      <aside className="control-rail">
        <div className="panel intro-panel">
          <ShieldCheck size={28} />
          <h1>Live jobs from inclusive employers.</h1>
          <p>Every job listed here is sourced from Disability Confident employers. Filter by role, location, or priority area.</p>
        </div>

        <div className="panel filter-panel">
          <label className="search-box">
            <Search size={18} />
            <input value={query} onChange={(event) => resetPage(setQuery, event.target.value)} placeholder="Job title, skill, employer" />
            {query ? <button type="button" onClick={() => resetPage(setQuery, "")} aria-label="Clear search"><X size={16} /></button> : null}
          </label>

          <div className="filter-chips">
                            <button type="button" className={cyberPriority ? "chip active" : "chip"} onClick={() => resetPage(setCyberPriority, !cyberPriority)} title="Roles in cyber-security, data protection and digital infrastructure with high relevance scores">
                              <BadgeAlert size={14} /> Cyber priority
                            </button>
          </div>

          <label className="select-row">
            <span><MapPin size={15} /> Location</span>
            <select value={location} onChange={(event) => resetPage(setLocation, event.target.value)}>
              <option value="">All locations</option>
              {stats?.locations.map((item) => (
                <option key={item.name} value={item.name}>{item.name} ({number(item.count)})</option>
              ))}
            </select>
          </label>

          <label className="select-row">
            <span><Briefcase size={15} /> Type</span>
            <select value={employmentType} onChange={(event) => resetPage(setEmploymentType, event.target.value)}>
              <option value="">All types</option>
              {stats?.employmentTypes.map((item) => (
                <option key={item.name} value={item.name}>{item.name} ({number(item.count)})</option>
              ))}
            </select>
          </label>

          <button className="reset-button" type="button" disabled={!activeFilters} onClick={clearFilters}>
            <Filter size={16} /> Reset filters
          </button>
        </div>
      </aside>

      <section className="result-stage">
        <div className="metric-grid">
          <Metric icon={<Briefcase size={19} />} value={number(results.total)} label="Live jobs" />
          <Metric icon={<BadgeAlert size={19} />} value={number(stats?.cyberPriority ?? 0)} label="Cyber priority" />
          <Metric icon={<GraduationCap size={19} />} value={number(stats?.apprenticeships ?? 0)} label="Apprentice / trainee" />
          <Metric icon={<Building2 size={19} />} value={number(stats?.total ?? 0)} label="Total vacancies" />
        </div>

        <div className="panel directory-panel">
          <div className="section-heading">
            <div>
              <span><Briefcase size={14} /> Job vacancies</span>
              <h2>Find your next role.</h2>
            </div>
            <strong>{loading ? "Searching..." : `${number(results.total)} matches`}</strong>
          </div>

          <div className="directory-grid">
            <div className="employer-list">
              {results.items.map((job) => (
                <article key={job.id} className={`job-row ${selected?.id === job.id ? "active" : ""}`} role="button" tabIndex={0} aria-label={`${job.title} at ${job.employerName}`} onClick={() => setSelected(job)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(job); }}}>
                  <div className="job-row-top">
                    <h3>{job.title}</h3>
                    {job.relevanceScore >= 30 ? <span className="cyber-tag">Cyber</span> : null}
                  </div>
                  <p className="job-employer">{job.employerName}</p>
                  <div className="job-meta">
                    <span><MapPin size={12} /> {job.location}</span>
                    <span><Briefcase size={12} /> {job.employmentType}</span>
                    {job.salary ? <span className="job-salary">{job.salary}</span> : null}
                  </div>
                  <div className="job-footer">
                    <small>{job.ats ? `${job.ats} · ` : ""}Posted {safeDate(job.datePosted) ?? "Unknown date"}</small>
                    {safeDate(job.closingDate) ? <small className="closing">Closes {safeDate(job.closingDate)}</small> : null}
                  </div>
                </article>
              ))}

              {!results.items.length ? (
                <div className="empty-state">
                  <Search size={30} />
                  <h3>No matching jobs</h3>
                  <p>Try different keywords or clear the filters.</p>
                </div>
              ) : null}

              <div className="pagination">
                <span>Page {results.page} of {results.totalPages}</span>
                <div>
                  <button type="button" disabled={results.page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                    <ArrowLeft size={16} /> Previous
                  </button>
                  <button type="button" disabled={results.page >= results.totalPages} onClick={() => setPage((value) => Math.min(results.totalPages, value + 1))}>
                    Next <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <aside className="insight-stack">
              {stats ? (
                <>
                  <MiniChart title="By type" icon={<Briefcase size={15} />}>
                    {stats.employmentTypes.map((item) => (
                      <div className="bar-row" key={item.name}>
                        <span>{item.name}</span>
                        <div><i style={{ width: `${share(item.count, stats.total)}%` }} /></div>
                        <b>{number(item.count)}</b>
                      </div>
                    ))}
                  </MiniChart>

                  <MiniChart title="Top locations" icon={<MapPin size={15} />}>
                    {stats.locations.slice(0, 6).map((item) => (
                      <button key={item.name} type="button" onClick={() => resetPage(setLocation, item.name)}>
                        <span>{item.name}</span><b>{number(item.count)}</b>
                      </button>
                    ))}
                  </MiniChart>
                </>
              ) : null}
            </aside>
          </div>
        </div>
      </section>

      <aside className="profile-rail">
        <div className="profile-panel">
          {selected ? (
            <>
              <span className="profile-kicker"><Briefcase size={14} /> Job details</span>
              <h2>{selected.title}</h2>
              <p className="job-employer-line">{selected.employerName}</p>

              <div className="profile-facts">
                <span><b>Location</b>{selected.location}</span>
                <span><b>Type</b>{selected.employmentType}</span>
                <span><b>Salary</b>{selected.salary || "Unspecified"}</span>
                <span><b>Posted</b>{safeDate(selected.datePosted) ?? "Unknown"}</span>
                {safeDate(selected.closingDate) ? <span><b>Closes</b>{safeDate(selected.closingDate)}</span> : null}
                <span><b>ATS</b>{selected.ats || "Unknown"}</span>
              </div>

              {selected.relevanceScore >= 30 ? (
                <div className="access-card cyber-card">
                  <h3>Cyber priority role</h3>
                  <p>Matched keywords: {selected.matchedKeywords}</p>
                </div>
              ) : null}

              <div className="access-card">
                <h3>Description</h3>
                <p>{selected.description}</p>
              </div>

              <div className="job-actions">
                <a className="scan-button" href={selected.sourceUrl} target="_blank" rel="noreferrer">
                  <ExternalLink size={18} /> Apply on {selected.ats || "employer site"}
                </a>
                <a className="scan-button secondary" href={selected.careersUrl} target="_blank" rel="noreferrer">
                  <Building2 size={18} /> All careers at {selected.employerName}
                </a>
              </div>
            </>
          ) : (
            <div className="scan-placeholder">
              <Briefcase size={30} />
              <p>Select a job to view full details, description and application link.</p>
            </div>
          )}
        </div>
      </aside>
    </section>
  );
}

function EmployerDirectory({ stats, initialResults }: { stats: PlatformStats; initialResults: EmployerSearchResult }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [sector, setSector] = useState("");
  const [level, setLevel] = useState("");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState(initialResults);
  const [selected, setSelected] = useState<Employer | null>(initialResults.items[0] ?? null);
  const [loading, setLoading] = useState(false);
  const [liveJobs, setLiveJobs] = useState<LiveJobs | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);

  const activeFilters = useMemo(() => [query, region, sector, level].filter(Boolean).length, [query, region, sector, level]);
  const topRegions = stats.regions.slice(0, 8);
  const topSectors = stats.sectors.slice(0, 8);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: "24" });
      if (query.trim()) params.set("q", query.trim());
      if (region) params.set("region", region);
      if (sector) params.set("sector", sector);
      if (level) params.set("level", level);

      setLoading(true);
      try {
        const response = await fetch(`/api/employers?${params}`, { signal: controller.signal });
        const nextResults = (await response.json()) as EmployerSearchResult;
        setResults(nextResults);
        setSelected((current) => {
          if (current && nextResults.items.some((item) => item.id === current.id)) return current;
          return nextResults.items[0] ?? null;
        });
        setLiveJobs(null);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setResults({ items: [], total: 0, page: 1, pageSize: 24, totalPages: 1 });
        }
      } finally {
        setLoading(false);
      }
    }, 160);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, region, sector, level, page]);

  function resetPage<T>(setter: (value: T) => void, value: T) {
    setPage(1);
    setter(value);
  }

  function clearFilters() {
    setQuery("");
    setRegion("");
    setSector("");
    setLevel("");
    setPage(1);
  }

  async function scanJobs(employer: Employer) {
    setSelected(employer);
    setLiveLoading(true);
    setLiveJobs(null);
    try {
      const response = await fetch(`/api/live-jobs?id=${encodeURIComponent(employer.id)}`);
      setLiveJobs((await response.json()) as LiveJobs);
    } finally {
      setLiveLoading(false);
    }
  }

  return (
    <section className="workspace">
      <aside className="control-rail">
        <div className="panel intro-panel">
          <ShieldCheck size={28} />
          <h1>All the roles, none of the access FOMO.</h1>
          <p>Search Disability Confident employers, compare inclusive hiring commitments and check where live vacancy pages are hiding.</p>
        </div>

        <div className="panel filter-panel">
          <label className="search-box">
            <Search size={18} />
            <input value={query} onChange={(event) => resetPage(setQuery, event.target.value)} placeholder="Employer, town, postcode, sector" />
            {query ? <button type="button" onClick={() => resetPage(setQuery, "")} aria-label="Clear search"><X size={16} /></button> : null}
          </label>

          <div className="level-grid">
            {(["Leader", "Employer", "Committed"] as const).map((item) => (
              <button key={item} type="button" className={level === item ? "selected" : ""} onClick={() => resetPage(setLevel, level === item ? "" : item)}>
                <span>{item}</span>
                <strong>{number(stats.levelCounts[item])}</strong>
              </button>
            ))}
          </div>

          <label className="select-row">
            <span><MapPin size={15} /> Region</span>
            <select value={region} onChange={(event) => resetPage(setRegion, event.target.value)}>
              <option value="">All regions</option>
              {stats.regions.map((item) => (
                <option key={item.name} value={item.name}>{item.name} ({number(item.count)})</option>
              ))}
            </select>
          </label>

          <label className="select-row">
            <span><Layers3 size={15} /> Sector</span>
            <select value={sector} onChange={(event) => resetPage(setSector, event.target.value)}>
              <option value="">All sectors</option>
              {stats.sectors.map((item) => (
                <option key={item.name} value={item.name}>{item.name} ({number(item.count)})</option>
              ))}
            </select>
          </label>

          <button className="reset-button" type="button" disabled={!activeFilters} onClick={clearFilters}>
            <Filter size={16} /> Reset filters
          </button>
        </div>
      </aside>

      <section className="result-stage">
        <div className="metric-grid">
          <Metric icon={<Building2 size={19} />} value={number(stats.total)} label="Inclusive employers" />
          <Metric icon={<Medal size={19} />} value={`${share(stats.levelCounts.Leader, stats.total)}%`} label="Leader level" />
          <Metric icon={<CheckCircle2 size={19} />} value={`${share(stats.levelCounts.Employer, stats.total)}%`} label="Employer level" />
          <Metric icon={<Sparkles size={19} />} value={number(stats.newCount)} label="Fresh additions" />
        </div>

        <div className="hero-panel">
          <div>
            <span className="hero-kicker">Disability Confident vacancy finder</span>
            <h2>Grab work by the access routes.</h2>
            <p>Pick an employer, scan their official careers trail, and keep every vacancy tied to a source URL so nothing is made up.</p>
          </div>
          <div className="hero-badges">
            <span>Step-free info</span>
            <span>Adjustments</span>
            <span>Entry-level cyber</span>
            <span>NHS, councils, schools</span>
          </div>
        </div>

        <div className="panel directory-panel">
          <div className="section-heading">
            <div>
              <span><Radar size={14} /> Employer directory</span>
              <h2>Find the good-fit places.</h2>
            </div>
            <strong>{loading ? "Searching..." : `${number(results.total)} matches`}</strong>
          </div>

          <div className="directory-grid">
            <div className="employer-list">
              {results.items.map((employer) => (
                <button key={employer.id} type="button" className={`employer-row ${selected?.id === employer.id ? "active" : ""}`} onClick={() => { setSelected(employer); setLiveJobs(null); }}>
                  <span className={`level-pill ${levelClass[employer.level]}`}>{employer.level}</span>
                  <div>
                    <h3>{employer.name}</h3>
                    <p>{employer.sector}</p>
                  </div>
                  <aside>
                    <span>{employer.town || "UK"}</span>
                    <small>{employer.postcode || employer.region}</small>
                  </aside>
                </button>
              ))}

              {!results.items.length ? (
                <div className="empty-state">
                  <Search size={30} />
                  <h3>No matching employers</h3>
                  <p>Widen the sector, level, or location filters.</p>
                </div>
              ) : null}

              <div className="pagination">
                <span>Page {results.page} of {results.totalPages}</span>
                <div>
                  <button type="button" disabled={results.page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                    <ArrowLeft size={16} /> Previous
                  </button>
                  <button type="button" disabled={results.page >= results.totalPages} onClick={() => setPage((value) => Math.min(results.totalPages, value + 1))}>
                    Next <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <aside className="insight-stack">
              <MiniChart title="Level mix" icon={<BarChart3 size={15} />}>
                {(["Committed", "Employer", "Leader"] as const).map((item) => (
                  <div className="bar-row" key={item}>
                    <span>{item}</span>
                    <div><i style={{ width: `${share(stats.levelCounts[item], stats.total)}%` }} /></div>
                    <b>{share(stats.levelCounts[item], stats.total)}%</b>
                  </div>
                ))}
              </MiniChart>

              <MiniChart title="Top regions" icon={<MapPin size={15} />}>
                {topRegions.map((item) => (
                  <button key={item.name} type="button" onClick={() => resetPage(setRegion, item.name)}>
                    <span>{item.name}</span><b>{number(item.count)}</b>
                  </button>
                ))}
              </MiniChart>

              <MiniChart title="Top sectors" icon={<Layers3 size={15} />}>
                {topSectors.map((item) => (
                  <button key={item.name} type="button" onClick={() => resetPage(setSector, item.name)}>
                    <span>{item.name}</span><b>{number(item.count)}</b>
                  </button>
                ))}
              </MiniChart>
            </aside>
          </div>
        </div>
      </section>

      <aside className="profile-rail">
        <div className="profile-panel">
          {selected ? (
            <>
              <span className="profile-kicker"><Globe2 size={14} /> Hiring signal scan</span>
              <h2>{selected.name}</h2>
              <p>{selected.sector} in {selected.town || selected.region}. Disability Confident {selected.level.toLowerCase()}.</p>

              <div className="profile-facts">
                <span><b>Level</b>{selected.level}</span>
                <span><b>Region</b>{selected.region}</span>
                <span><b>Town</b>{selected.town || "Unknown"}</span>
                <span><b>Postcode</b>{selected.postcode || "Unknown"}</span>
              </div>

              <div className="access-card">
                <h3>Accessibility information</h3>
                <p>Use the employer level, sector and source links as a starting point. Confirm adjustments, accessible interviews and remote options on the official vacancy page before applying.</p>
                <div>
                  <span>Reasonable adjustments</span>
                  <span>Inclusive interviews</span>
                  <span>Source-first vacancies</span>
                </div>
              </div>

              <button className="scan-button" type="button" onClick={() => scanJobs(selected)}>
                {liveLoading ? <Loader2 className="spin" size={18} /> : <Globe2 size={18} />}
                Find live vacancies
              </button>

              {liveJobs ? (
                <div className="live-panel">
                  <div className="live-header">
                    <span>{liveJobs.status === "live" ? "Live web results" : "Search links"}</span>
                    <b>{safeTime(liveJobs.checkedAt) ?? ""}</b>
                  </div>
                  <p className="query-line">{liveJobs.query}</p>

                  {liveJobs.results.map((job) => (
                    <a className="job-signal" href={job.link} target="_blank" rel="noreferrer" key={`${job.link}-${job.title}`}>
                      <strong>{job.title}</strong>
                      <span>{job.source} <ExternalLink size={13} /></span>
                      <p>{job.snippet}</p>
                    </a>
                  ))}

                  <div className="job-links">
                    {liveJobs.links.map((link) => (
                      <a key={link.label} href={link.url} target="_blank" rel="noreferrer">
                        {link.label} <ExternalLink size={13} />
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="scan-placeholder">
                  <Globe2 size={30} />
                  <p>Run a scan to collect live hiring signals, official careers links and job-board shortcuts.</p>
                </div>
              )}
            </>
          ) : null}
        </div>
      </aside>
    </section>
  );
}

function Metric({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="metric-card">
      <span>{icon}</span>
      <strong>{value}</strong>
      <p>{label}</p>
    </div>
  );
}

function MiniChart({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mini-chart">
      <h3>{icon}{title}</h3>
      {children}
    </div>
  );
}
