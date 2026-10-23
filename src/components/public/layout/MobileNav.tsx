// src/components/public/layout/MobileNav.tsx
"use client";

import { X, Rocket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/public/ui/Button";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
}

export function MobileNav({ open, onClose, links }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-[#0F172A]/60 backdrop-blur-sm lg:hidden"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-[70] h-full w-[85%] max-w-sm bg-white p-6 lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Business Express"
                  width={36}
                  height={36}
                  className="h-9 w-auto object-contain"
                />
                <span className="text-sm font-black tracking-tight">
                  BUSINESS <span className="text-[#1E50FF]">EXPRESS</span>
                </span>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0F172A]/10"
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={onClose}
                  className="rounded-xl px-4 py-3 text-base font-medium text-[#0F172A]/80 hover:bg-[#0F172A]/5 hover:text-[#1E50FF]"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="mt-auto pt-6 space-y-2">
              <Link href="/projet" onClick={onClose} className="block">
                <Button variant="gold" size="lg" className="w-full">
                  <Rocket className="h-4 w-4" />
                  Déposer mon projet
                </Button>
              </Link>
              <p className="text-xs text-center text-[#0F172A]/60">
                Étude gratuite · Réponse sous 48h
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}