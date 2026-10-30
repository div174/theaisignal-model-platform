"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "./brand-logo";
import { ThemeToggle } from "./theme-toggle";
import {
  Layers,
  Scale,
  Sparkles,
  History,
  Menu,
  X,
  Search,
  ExternalLink,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/models", label: "Models", icon: Layers },
    { href: "/compare", label: "Compare", icon: Scale },
    { href: "/playground", label: "Playground", icon: Sparkles },
    { href: "/history", label: "History", icon: History },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 dark:border-zinc-800/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 group transition-transform active:scale-95"
            >
              <BrandLogo lab="oneatlas" size="md" />
              <div className="flex flex-col">
                <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors">
                  OneAtlas
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-zinc-500 -mt-1">
                  AI Model Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "bg-slate-100 text-slate-900 dark:bg-zinc-800/90 dark:text-emerald-400 shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-emerald-500 dark:text-emerald-400" : ""}`} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Pill */}
            <Link
              href="/models"
              className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search models, labs, providers...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-slate-200 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 font-mono">
                ⌘K
              </kbd>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* OpenRouter link */}
            <a
              href="https://openrouter.ai"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 dark:text-zinc-400 dark:hover:text-zinc-200 dark:border-zinc-800 dark:hover:border-zinc-700 transition-colors"
            >
              <span>OpenRouter</span>
              <ExternalLink className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
            </a>

            {/* Mobile menu hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/60 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 dark:border-zinc-800 dark:bg-slate-950/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-emerald-400 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-emerald-500 dark:text-emerald-400" : ""}`} />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
