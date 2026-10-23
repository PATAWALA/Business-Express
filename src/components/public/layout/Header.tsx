// src/components/public/layout/Header.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Rocket } from "lucide-react";
import { Button } from "@/components/public/ui/Button";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Sourcing & Import", href: "#catalogue" },
  { label: "Tourisme & VIP", href: "#vip" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "glass border-b border-[#0F172A]/8 shadow-sm"
            : "bg-white/60 backdrop-blur-md"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between py-3">
            {/* Logo + statut */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Business Express"
                width={52}
                height={52}
                className="h-12 w-auto object-contain"
                priority
              />
              <div className="flex flex-col leading-none">
                <div className="text-sm font-black tracking-tight text-[#0F172A]">
                  BUSINESS <span className="text-[#1E50FF]">EXPRESS</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-medium text-[#0F172A]/60">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                  </span>
                  Bureau Dubaï & Bukavu ouverts
                </div>
              </div>
            </Link>

            {/* Navigation desktop */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm font-medium text-[#0F172A]/70 transition-colors hover:text-[#1E50FF]"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* CTA principal */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/projet">
                <Button
                  variant="gold"
                  size="sm"
                  className="animate-pulse-ring"
                >
                  <Rocket className="h-4 w-4" />
                  Déposer mon projet
                </Button>
              </Link>
            </div>

            {/* Toggle mobile */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-[#0F172A]/10 bg-white"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={open} onClose={() => setOpen(false)} links={navLinks} />
    </>
  );
}