"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth-modal";
import { X, UserPlus } from "lucide-react";

const STORAGE_KEY = "aw_scroll_prompt_dismissed";

export function ScrollSignupPrompt() {
  const { user } = useAuth();
  const [showBanner, setShowBanner] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const shownRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (shownRef.current || user) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const scrollable = docHeight - winHeight;
    if (scrollable < 300) return;
    const percent = scrollTop / scrollable;
    if (percent >= 0.45) {
      shownRef.current = true;
      setShowBanner(true);
    }
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    if (user) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, user]);

  function dismiss() {
    setShowBanner(false);
    sessionStorage.setItem(STORAGE_KEY, "true");
  }

  if (!showBanner) return null;

  return (
    <>
      <div className="scroll-prompt-overlay" onClick={dismiss} />
      <div className="scroll-prompt" role="dialog" aria-modal="true" aria-label="Sign up prompt">
        <button className="scroll-prompt-close" onClick={dismiss} aria-label="Close"><X size={18} /></button>
        <div className="scroll-prompt-icon"><UserPlus size={28} /></div>
        <h3>Find your next role</h3>
        <p>Create a free account to save jobs, get tailored alerts, and track applications.</p>
        <button className="scan-button" onClick={() => { setShowAuth(true); dismiss(); }}>
          Sign up or sign in
        </button>
        <button className="scroll-prompt-skip" onClick={dismiss}>
          Continue browsing
        </button>
      </div>
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
