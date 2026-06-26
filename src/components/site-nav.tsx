"use client";

import { useEffect, useState } from "react";
import { Briefcase, Building2, FileText, Moon, Sun, Type, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth-modal";
import Link from "next/link";

export function SiteNav() {
  const [dark, setDark] = useState(false);
  const [dyslexic, setDyslexic] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
    const savedDark = localStorage.getItem("aw_theme") === "dark";
    const savedFont = localStorage.getItem("aw_font") === "dyslexic";
    setDark(savedDark);
    setDyslexic(savedFont);
    document.documentElement.setAttribute("data-theme", savedDark ? "dark" : "light");
    document.documentElement.setAttribute("data-font", savedFont ? "dyslexic" : "normal");
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("aw_theme", next ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  }

  function toggleDyslexic() {
    const next = !dyslexic;
    setDyslexic(next);
    localStorage.setItem("aw_font", next ? "dyslexic" : "normal");
    document.documentElement.setAttribute("data-font", next ? "dyslexic" : "normal");
  }

  const navLinks = [
    { href: "/", label: "Jobs", icon: Briefcase },
    { href: "/employers", label: "Employers", icon: Building2 },
    { href: "/insights", label: "Insights", icon: FileText },
  ];

  return (
    <>
      <nav className="site-nav" role="navigation" aria-label="Main navigation">
        <Link href="/" className="site-nav-brand" style={{ fontWeight: 950, fontSize: "1.3rem", textDecoration: "none" }}>
          <span className="site-nav-logo">AccessWork</span>
        </Link>

        <div className="site-nav-links">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="site-nav-link">
              <link.icon size={16} />
              {link.label}
            </Link>
          ))}
        </div>

        <div className="site-nav-tools">
          <button type="button" className="site-nav-icon-btn" onClick={toggleDyslexic} aria-label={dyslexic ? "Standard font" : "Dyslexia-friendly font"}>
            <Type size={16} />
          </button>
          <button type="button" className="site-nav-icon-btn" onClick={toggleDark} aria-label={dark ? "Light mode" : "Dark mode"}>
            {mounted && dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {mounted && user ? (
            <Link href="/profile" className="site-nav-link user-link">
              <User size={16} />
              {user.name}
            </Link>
          ) : (
            <button type="button" className="site-nav-signin" onClick={() => setShowAuth(true)}>
              Sign in
            </button>
          )}
        </div>
      </nav>
      <AuthModal open={showAuth && !user} onClose={() => setShowAuth(false)} />
    </>
  );
}
