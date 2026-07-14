import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Degrees of Marvel | Find Your MCU Connection",
  description:
    "Discover how any actor connects to the Marvel Cinematic Universe through shared movie credits. An interactive Six Degrees of Kevin Bacon experience for the MCU.",
  keywords: ["Marvel", "MCU", "Six Degrees", "Kevin Bacon", "actor connections", "TMDB"],
  openGraph: {
    title: "Degrees of Marvel",
    description: "Find any actor's connection to the MCU",
    type: "website",
  },
  other: {
    "google-adsense-account": "ca-pub-7228775489301843"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${anton.variable}`}>
      <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7228775489301843"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-dark-charcoal text-white antialiased">
        {/* Ambient background orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="ambient-orb ambient-orb-cyan" style={{ top: "10%", left: "-10%" }} />
          <div className="ambient-orb ambient-orb-purple" style={{ top: "60%", right: "-5%" }} />
          <div className="ambient-orb ambient-orb-cyan" style={{ bottom: "-10%", left: "40%", opacity: 0.08 }} />
        </div>

        {/* Grid overlay */}
        <div className="fixed inset-0 bg-grid pointer-events-none z-0" />

        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
