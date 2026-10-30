import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OneAtlas — AI Model Discovery, Comparison & Playground Platform",
  description:
    "Unified developer platform to discover, benchmark, compare specifications and costs, and test frontier AI models in real time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('oneatlas-theme') || 'dark';
                if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-zinc-100 transition-colors">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-slate-950/80 transition-colors py-8 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <BrandLogo lab="oneatlas" size="sm" />
                <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                  OneAtlas AI Model Platform
                </span>
                <span className="text-xs text-slate-400 dark:text-zinc-500">
                  • TheAISignal Internship Assessment
                </span>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-zinc-400">
                <Link href="/models" className="hover:text-emerald-500 transition-colors">
                  Models
                </Link>
                <Link href="/compare" className="hover:text-emerald-500 transition-colors">
                  Compare
                </Link>
                <Link href="/playground" className="hover:text-emerald-500 transition-colors">
                  Playground
                </Link>
                <Link href="/history" className="hover:text-emerald-500 transition-colors">
                  History
                </Link>
                <a
                  href="https://openrouter.ai"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-500 transition-colors"
                >
                  OpenRouter
                </a>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
