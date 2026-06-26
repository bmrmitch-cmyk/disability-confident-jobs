"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, Building2, CheckCircle2, ExternalLink, Filter,
  MapPin, Medal, Search, Sparkles, X,
} from "lucide-react";
import type { Employer, EmployerSearchResult, PlatformStats } from "@/lib/employers";
import { Breadcrumbs } from "@/components/breadcrumbs";
import Link from "next/link";

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

export function EmployersClient({
  stats,
  initialResults,
}: {
  stats: PlatformStats;
  initialResults: EmployerSearchResult;
}) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [sector, setSector] = useState("");
  const [level, setLevel] = useState("");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState(initialResults);
  const [loading, setLoading] = useState(false);

  const activeFilters = useMemo(() => [query, region, sector, level].filter(Boolean).length, [query, region, sector, level]);

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
        setResults((await response.json()) as EmployerSearchResult);
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

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  const breadcrumbs = [{ label: "Employers", href: "/employers" }];

  return (
    <main className="platform-shell">
      <div className="employers-page" style={{ padding: "24px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <Breadcrumbs items={breadcrumbs} />

        <div className="metric-grid" style={{ margin: "16px 0" }}>
          <div className="metric-box">
            <Building2 size={19} />
            <strong>{number(stats.total)}</strong>
            <span>Inclusive employers</span>
          </div>
          <div className="metric-box">
            <Medal size={19} />
            <strong>{share(stats.levelCounts.Leader, stats.total)}%</strong>
            <span>Leader level</span>
          </div>
          <div className="metric-box">
            <CheckCircle2 size={19} />
            <strong>{share(stats.levelCounts.Employer, stats.total)}%</strong>
            <span>Employer level</span>
          </div>
          <div className="metric-box">
            <Sparkles size={19} />
            <strong>{number(stats.newCount)}</strong>
            <span>Fresh additions</span>
          </div>
        </div>

        <div className="section-heading" style={{ marginTop: 8 }}>
          <h2>Disability Confident employer directory</h2>
          <strong>{loading ? "Searching..." : `${number(results.total)} matches`}</strong>
        </div>

        <div className="search-hero">
          <label className="search-box search-hero-box">
            <Search size={20} />
            <input value={query} onChange={(event) => resetPage(setQuery, event.target.value)} placeholder="Employer, town, postcode, sector..." />
            {query ? <button type="button" onClick={() => resetPage(setQuery, "")} aria-label="Clear search"><X size={18} /></button> : null}
          </label>
          <div className="filter-bar">
            <div className="level-chips">
              {(["Leader", "Employer", "Committed"] as const).map((item) => (
                <button key={item} type="button" className={`chip ${level === item ? "active" : ""}`} onClick={() => resetPage(setLevel, level === item ? "" : item)}>
                  {item}
                </button>
              ))}
            </div>
            <label className="select-row filter-select">
              <select value={region} onChange={(event) => resetPage(setRegion, event.target.value)}>
                <option value="">All regions</option>
                {stats.regions.map((item) => (
                  <option key={item.name} value={item.name}>{item.name} ({number(item.count)})</option>
                ))}
              </select>
            </label>
            <label className="select-row filter-select">
              <select value={sector} onChange={(event) => resetPage(setSector, event.target.value)}>
                <option value="">All sectors</option>
                {stats.sectors.map((item) => (
                  <option key={item.name} value={item.name}>{item.name} ({number(item.count)})</option>
                ))}
              </select>
            </label>
            <button className="reset-button compact" type="button" disabled={!activeFilters} onClick={clearFilters}>
              <Filter size={14} /> Reset
            </button>
          </div>
        </div>

        <div className="directory-grid" ref={resultsRef}>
          <div className="employer-list">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton-row">
                    <div className="skeleton skeleton-emp-pill" />
                    <div className="skeleton skeleton-emp-name" />
                    <div className="skeleton skeleton-emp-loc" />
                  </div>
                ))
              : results.items.map((employer) => (
                  <Link key={employer.id} href={`/employer/${employer.id}`} className="employer-row employer-row-link">
                    <span className={`level-pill ${levelClass[employer.level]}`}>{employer.level}</span>
                    <div>
                      <h3>{employer.name}</h3>
                      <p>{employer.sector}</p>
                    </div>
                    <aside>
                      <span>{employer.town || "UK"}</span>
                      <small>{employer.postcode || employer.region}</small>
                    </aside>
                  </Link>
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
        </div>
      </div>
    </main>
  );
}
