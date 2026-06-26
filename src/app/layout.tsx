import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AccessWork | Disability Confident Vacancies",
  description:
    "Explore Disability Confident employers, live vacancy signals, accessibility information and inclusive hiring routes.",
  openGraph: {
    title: "AccessWork | Disability Confident Vacancies",
    description:
      "Explore Disability Confident employers, live vacancy signals, accessibility information and inclusive hiring routes.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#00559b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
