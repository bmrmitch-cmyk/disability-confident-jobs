import type { Metadata, Viewport } from "next";
import { CookieConsent } from "@/components/cookie-consent";
import { AuthProvider } from "@/lib/auth-context";
import { FavouritesProvider } from "@/lib/favourites";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jobs for Disabled People UK | AccessWork — Disability Confident Vacancies",
  description:
    "Find jobs for disabled people across the UK. Remote, work from home, part-time and full-time roles from Disability Confident employers. No experience? Entry-level and graduate roles available.",
  keywords: [
    "jobs for disabled people", "disability confident employers", "remote jobs for disabled people",
    "work from home jobs for disabled people", "part time jobs for disabled people",
    "jobs for disabled people uk", "jobs for disabled people near me",
    "disability employment", "inclusive hiring", "reasonable adjustments jobs",
  ],
  openGraph: {
    title: "Jobs for Disabled People UK | AccessWork",
    description:
      "35,000+ live vacancies from Disability Confident employers. Remote, WFH, part-time and entry-level roles. Search by location, sector or accessibility needs.",
    type: "website",
    siteName: "AccessWork",
  },
};

export const viewport: Viewport = {
  themeColor: "#00447c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <FavouritesProvider>
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <div id="main-content">{children}</div>
            <Footer />
            <CookieConsent />
          </FavouritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
