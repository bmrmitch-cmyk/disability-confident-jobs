"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useFavourites } from "@/lib/favourites";
import { useSearchParams } from "next/navigation";
import {
  Award, Bell, Bookmark, Briefcase, Building2, CreditCard, ExternalLink,
  Heart, Mail, Megaphone, Search, Settings, Sparkles, Star, TrendingUp, User,
} from "lucide-react";
import type { Job } from "@/lib/jobs-types";
import { AuthModal } from "@/components/auth-modal";
import { Breadcrumbs } from "@/components/breadcrumbs";
import Link from "next/link";

type Tab = "jobseeker" | "employer";

function ProfileInner() {
  const { user } = useAuth();
  const { favs } = useFavourites();
  const params = useSearchParams();
  const initialTab = (params.get("tab") as Tab) ?? "jobseeker";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [showAuth, setShowAuth] = useState(!user);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [subscribed, setSubscribed] = useState(false);
  const [emailSub, setEmailSub] = useState("");

  useEffect(() => {
    if (favs.length) {
      fetch(`/api/jobs?pageSize=72`).then((r) => r.json()).then((data) => {
        setJobs(data.items.filter((j: Job) => favs.includes(j.id)));
      });
    } else {
      setJobs([]);
    }
  }, [favs]);

  useEffect(() => {
    const stored = localStorage.getItem("aw_subscribed");
    if (stored) setSubscribed(stored === "true");
  }, []);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!emailSub.trim()) return;
    localStorage.setItem("aw_subscribed", "true");
    localStorage.setItem("aw_sub_email", emailSub.trim());
    setSubscribed(true);
  }

  return (
    <main className="profile-page">
      <div className="profile-header-wrap">
        <Breadcrumbs items={[{ label: "My profile" }]} />
        <div className="profile-header">
          <div className="profile-avatar"><User size={32} /></div>
          <div>
            <h1>{user?.name || "My profile"}</h1>
            <p>{user ? `${user.type === "employer" ? "Employer" : "Jobseeker"} account` : "Sign in to manage your account"}</p>
          </div>
          {user && (
            <span className="profile-badge">
              <Star size={14} /> {user.type === "employer" ? "Employer account" : "Free member"}
            </span>
          )}
        </div>
      </div>

      <div className="profile-tabs">
        <button type="button" className={tab === "jobseeker" ? "active" : ""} onClick={() => setTab("jobseeker")}>
          <User size={15} /> Jobseeker
        </button>
        <button type="button" className={tab === "employer" ? "active" : ""} onClick={() => setTab("employer")}>
          <Building2 size={15} /> Employer
        </button>
      </div>

      {tab === "jobseeker" ? (
        <div className="profile-dashboard">
          <div className="profile-cards">
            <div className="profile-card">
              <h3><Heart size={18} /> Saved jobs</h3>
              {user ? (
                jobs.length > 0 ? (
                  <div className="fav-list">
                    {jobs.slice(0, 10).map((job) => (
                      <Link key={job.id} href={`/jobs/${job.id}`} className="fav-item">
                        <strong>{job.title}</strong>
                        <span>{job.employerName} &middot; {job.location}</span>
                      </Link>
                    ))}
                    {jobs.length > 10 && <p className="fav-more">+{jobs.length - 10} more saved jobs</p>}
                  </div>
                ) : (
                  <p className="card-empty">No saved jobs yet. Browse jobs and tap the heart icon to save them.</p>
                )
              ) : (
                <p className="card-empty">Sign in to save and track jobs.</p>
              )}
              {user && favs.length > 0 && <p className="card-count">{favs.length} job{favs.length !== 1 ? "s" : ""} saved</p>}
            </div>

            <div className="profile-card">
              <h3><Search size={18} /> Career explorer</h3>
              <p>Discover roles by sector, accessibility needs, and location.</p>
              <div className="card-links">
                <Link href="/?tab=jobs"><Briefcase size={14} /> Browse all jobs</Link>
                <Link href="/?tab=employers"><Building2 size={14} /> Employer directory</Link>
                <Link href="/insights"><Bookmark size={14} /> Career guides</Link>
              </div>
            </div>

            <div className="profile-card">
              <h3><Bell size={18} /> Notifications</h3>
              {user ? (
                <div className="notif-list">
                  <div className="notif-item read">
                    <span>Welcome to AccessWork &mdash; start saving jobs to get personalised alerts.</span>
                    <small>Just now</small>
                  </div>
                </div>
              ) : (
                <p className="card-empty">Sign in to receive job alerts and updates.</p>
              )}
            </div>

            <div className="profile-card">
              <h3><Mail size={18} /> Newsletter</h3>
              {subscribed ? (
                <p className="card-success">You are subscribed. We will send weekly roundups of new Disability Confident roles and insights.</p>
              ) : (
                <form onSubmit={handleSubscribe} className="newsletter-form">
                  <p>Get weekly job alerts, new employer additions, and inclusive hiring insights.</p>
                  <div className="newsletter-row">
                    <input type="email" value={emailSub} onChange={(e) => setEmailSub(e.target.value)} placeholder="your@email.com" required />
                    <button type="submit" className="scan-button small">Subscribe</button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <aside className="profile-sidebar">
            <div className="profile-card accent">
              <h3><Sparkles size={18} /> Quick stats</h3>
              <div className="stat-rows">
                <span><Heart size={14} /> {favs.length} saved</span>
                <span><Briefcase size={14} /> 42k+ live jobs</span>
                <span><Building2 size={14} /> 19k employers</span>
                <span><Bookmark size={14} /> {jobs.length > 0 ? "Active" : "Inactive"} searches</span>
              </div>
            </div>
            <div className="profile-card">
              <h3><Settings size={18} /> Account</h3>
              {user ? (
                <div className="card-links">
                  <span>{user.email}</span>
                  <span className="card-tag">{user.type}</span>
                </div>
              ) : (
                <button className="scan-button small" onClick={() => setShowAuth(true)}>Sign in</button>
              )}
            </div>
          </aside>
        </div>
      ) : (
        <div className="profile-dashboard">
          <div className="profile-cards">
            <div className="profile-card premium">
              <h3><Award size={18} /> Claim your employer listing</h3>
              <p>Take control of your organisation profile. Add accessibility information, photos, direct job feeds, and respond to jobseeker enquiries.</p>
              <div className="card-links">
                <span className="card-tag">Coming soon</span>
                <span className="card-tag">Free for Disability Confident employers</span>
              </div>
              {user?.type === "employer" && (
                <button className="scan-button small" disabled>Claim {user.employerName || "your organisation"}</button>
              )}
            </div>

            <div className="profile-card premium">
              <h3><Megaphone size={18} /> Featured jobs &mdash; Pinned listings</h3>
              <p>Get prime visibility. Featured jobs appear at the top of every search with a premium badge. Pay per listing or subscribe monthly.</p>
              <div className="pricing-grid">
                <div className="pricing-tier">
                  <strong>Single listing</strong>
                  <span className="price">&pound;49</span>
                  <small>One job, 30 days featured</small>
                </div>
                <div className="pricing-tier">
                  <strong>Starter</strong>
                  <span className="price">&pound;99</span>
                  <small>5 jobs, 30 days each</small>
                </div>
                <div className="pricing-tier">
                  <strong>Unlimited</strong>
                  <span className="price">&pound;249</span>
                  <small>All jobs, 30 days</small>
                </div>
              </div>
              <button className="scan-button small" disabled>Purchase &mdash; Coming soon</button>
            </div>

            <div className="profile-card premium">
              <h3><TrendingUp size={18} /> Analytics dashboard</h3>
              <p>See how many jobseekers view your listings, which roles get the most interest, and where your applicants come from.</p>
              <div className="card-links">
                <span className="card-tag">Coming soon</span>
                <span className="card-tag">Included in paid plans</span>
              </div>
            </div>

            <div className="profile-card premium">
              <h3><CreditCard size={18} /> Monetisation opportunities</h3>
              <p>AccessWork connects you with motivated, pre-qualified jobseekers. Multiple ways to feature your organisation:</p>
              <ul className="monet-list">
                <li>Featured job listings &mdash; from &pound;49</li>
                <li>Sponsored employer profile &mdash; &pound;199/month</li>
                <li>Company page with video &amp; accessibility tour &mdash; &pound;499/setup</li>
                <li>Banner advertising on insights pages &mdash; &pound;299/week</li>
              </ul>
              <button className="scan-button small" disabled>Contact sales &mdash; Coming soon</button>
            </div>
          </div>

          <aside className="profile-sidebar">
            <div className="profile-card accent">
              <h3><Building2 size={18} /> Your organisation</h3>
              {user?.type === "employer" ? (
                <div className="stat-rows">
                  <span><Award size={14} /> {user.employerName || "Not set"}</span>
                  <span><Star size={14} /> Not yet claimed</span>
                  <span><Megaphone size={14} /> 0 featured listings</span>
                </div>
              ) : (
                <p>Switch to the Employer tab and sign in to access employer tools.</p>
              )}
            </div>
            <div className="profile-card">
              <h3><Sparkles size={18} /> Why list with us?</h3>
              <div className="stat-rows">
                <span>42k+ live job listings</span>
                <span>19k Disability Confident employers</span>
                <span>Targeted disabled jobseeker audience</span>
                <span>SEO-optimised employer profiles</span>
              </div>
            </div>
          </aside>
        </div>
      )}

      <AuthModal open={showAuth && !user} onClose={() => setShowAuth(false)} />
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<main className="profile-page" style={{ padding: 100, textAlign: "center" }}>Loading profile...</main>}>
      <ProfileInner />
    </Suspense>
  );
}
