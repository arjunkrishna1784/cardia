import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CARDIA | Computational Cardiovascular Disease Informatics & AI",
  description:
    "CARDIA develops machine learning, natural language processing, and disease informatics approaches for cardiovascular research.",
  openGraph: {
    title: "CARDIA | Computational Cardiovascular Disease Informatics & AI",
    description:
      "CARDIA develops machine learning, natural language processing, and disease informatics approaches for cardiovascular research.",
    siteName: "CARDIA",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
