"use client";

import { useEffect, useState } from "react";
import type { JobsStats } from "@/lib/jobs-types";
import type { PlatformStats } from "@/lib/employers";

const ADMIN_KEY = "accesswork_admin_auth";
const ADMIN_PASS = "AccessWork2024!";

function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_KEY) === "true";
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(isAuthed);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [jobStats, setJobStats] = useState<JobsStats | null>(null);
  const [empStats, setEmpStats] = useState<PlatformStats | null>(null);
  const [message, setMessage] = useState("");

  function login() {
    if (password === ADMIN_PASS) {
      sessionStorage.setItem(ADMIN_KEY, "true");
      setAuthed(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  }

  useEffect(() => {
    if (!authed) return;
    fetch("/api/jobs?stats=true").then((r) => r.json()).then(setJobStats);
    fetch("/api/employers?pageSize=1").then((r) => r.json()).then((d) => {
      fetch("/api/employers?pageSize=1&statsOnly=true").then(async (r2) => {
        try {
          setEmpStats((await r2.json()) as PlatformStats);
        } catch {
          setEmpStats(null);
        }
      });
    });
  }, [authed]);

  async function revalidate() {
    setMessage("Revalidating...");
    try {
      const res = await fetch("/api/jobs?revalidate=true");
      const data = await res.json();
      setMessage(data.message ?? "Cache cleared");
    } catch {
      setMessage("Failed to revalidate");
    }
    setTimeout(() => setMessage(""), 3000);
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 400, margin: "80px auto", padding: 24, color: "#00447c" }}>
        <h1 style={{ fontSize: "2rem", textTransform: "uppercase", margin: "0 0 20px" }}>Admin</h1>
        <form onSubmit={(e) => { e.preventDefault(); login(); }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            aria-label="Admin password"
            style={{ border: "3px solid #00447c", borderRadius: 8, padding: 12, fontWeight: 950, outline: 0 }}
            autoFocus
          />
          {error ? <p style={{ color: "#a00037", fontWeight: 950 }}>{error}</p> : null}
          <button type="submit" style={{ border: "3px solid #00447c", borderRadius: 8, background: "#e8b800", padding: 12, fontWeight: 950, cursor: "pointer" }}>
            Sign in
          </button>
        </form>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px", color: "#00447c" }}>
      <h1 style={{ fontSize: "2.5rem", textTransform: "uppercase", margin: "0 0 8px" }}>Admin Dashboard</h1>
      <p style={{ fontWeight: 950, color: "#9a0070" }}>Hidden admin panel — extra platform controls.</p>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, margin: "24px 0" }}>
        <StatBox label="Total jobs" value={jobStats?.total ?? "—"} />
        <StatBox label="Cyber priority" value={jobStats?.cyberPriority ?? "—"} />
        <StatBox label="Apprenticeships" value={jobStats?.apprenticeships ?? "—"} />
        <StatBox label="Employers" value={empStats?.total ?? "—"} />
        <StatBox label="Leader employers" value={empStats?.levelCounts?.Leader ?? "—"} />
        <StatBox label="New additions" value={empStats?.newCount ?? "—"} />
      </section>

      <section style={{ border: "3px solid #00447c", borderRadius: 8, padding: 20, marginBottom: 16, background: "#fdf6ef" }}>
        <h2 style={{ margin: "0 0 12px", textTransform: "uppercase" }}>Cache & Data</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={revalidate} style={{ border: "3px solid #00447c", borderRadius: 8, background: "#e8b800", padding: "10px 18px", fontWeight: 950, cursor: "pointer" }}>
            Revalidate API cache
          </button>
        </div>
        {message ? <p style={{ marginTop: 10, fontWeight: 950 }}>{message}</p> : null}
      </section>

      <section style={{ border: "3px solid #00447c", borderRadius: 8, padding: 20, marginBottom: 16, background: "#fdf6ef" }}>
        <h2 style={{ margin: "0 0 12px", textTransform: "uppercase" }}>Employer level breakdown</h2>
        {empStats ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {(["Leader", "Employer", "Committed"] as const).map((l) => (
              <div key={l} style={{ border: "3px solid #00447c", borderRadius: 8, padding: 12, textAlign: "center" }}>
                <strong style={{ fontSize: "1.8rem" }}>{empStats.levelCounts[l]}</strong>
                <p style={{ margin: "4px 0 0", fontWeight: 950 }}>{l}</p>
              </div>
            ))}
          </div>
        ) : <p style={{ fontWeight: 950 }}>Loading...</p>}
      </section>

      <section style={{ border: "3px solid #00447c", borderRadius: 8, padding: 20, background: "#fdf6ef" }}>
        <h2 style={{ margin: "0 0 12px", textTransform: "uppercase" }}>Top locations</h2>
        {jobStats ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
            {jobStats.locations.slice(0, 20).map((loc) => (
              <div key={loc.name} style={{ border: "3px solid #00447c", borderRadius: 8, padding: 10, fontWeight: 950 }}>
                <span>{loc.name}</span>
                <strong style={{ display: "block", fontSize: "1.3rem" }}>{loc.count}</strong>
              </div>
            ))}
          </div>
        ) : <p style={{ fontWeight: 950 }}>Loading...</p>}
      </section>
    </main>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ border: "3px solid #00447c", borderRadius: 8, padding: 16, background: "#fffaf5" }}>
      <strong style={{ fontSize: "2rem", display: "block" }}>{value}</strong>
      <p style={{ margin: "4px 0 0", fontWeight: 950, fontSize: "0.85rem" }}>{label}</p>
    </div>
  );
}
