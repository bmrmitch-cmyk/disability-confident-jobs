"use client";

import { useEffect, useState } from "react";

const COOKIE_NAME = "accesswork_cookies_accepted";

function getCookie(name: string): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((row) => row.startsWith(`${name}=true`));
}

function setCookie(name: string, days: number) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=true; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookie(COOKIE_NAME)) setVisible(true);
  }, []);

  function accept() {
    setCookie(COOKIE_NAME, 365);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div role="alert" aria-live="polite" className="cookie-banner">
      <p>
        This site uses cookies to remember your preferences. No personal data is tracked or sold.
      </p>
      <button type="button" onClick={accept} className="cookie-accept">
        Accept
      </button>
    </div>
  );
}
