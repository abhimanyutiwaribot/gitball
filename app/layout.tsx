import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Handjet } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const handjet = Handjet({
  variable: "--font-handjet",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitBall 2026 - Scout Your GitHub Card",
  description: "Scout your collectible 2026 World Cup style player card based on public repository stats and language skills.",
  metadataBase: new URL("https://gitball.com"), // Placeholder URL to satisfy Next.js metadata base rules
  openGraph: {
    title: "GitBall 2026 - Scout Your GitHub Card",
    description: "Inspect stats, roles, and scouting facts to render your customized card.",
    url: "https://gitball.com",
    siteName: "GitBall",
    images: [
      {
        url: "/gitball-opengraph-image.png",
        width: 800,
        height: 600,
        alt: "GitBall 2026 Mascot Badge Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitBall 2026 - Scout Your GitHub Card",
    description: "Inspect stats, roles, and scouting facts to render your customized card.",
    images: ["/gitball-opengraph-image.png"],
    creator: "@abhimanyutwts",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${handjet.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-white bg-slate-950">{children}</body>
    </html>
  );
}
