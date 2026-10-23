// src/components/admin/navigation/MobileMoreSheet.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  X,
  CheckSquare,
  Settings,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
}

const secondaryItems = [
  { href: "/admin/taches", label: "Tâches", icon: CheckSquare },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export function MobileMoreSheet({ open, onClose, onOpenProfile }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-sm lg:hidden"
      onClick={onClose}
    >
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1.5 w-12 rounded-full bg-slate-300" />
        </div>

        <div className="flex items-center justify-between px-5 pb-3">
          <h2 className="text-base font-bold text-slate-900">Plus d'options</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-3 pb-3">
          {secondaryItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            );
          })}
        </div>

        <div className="h-px bg-slate-200 mx-5" />

        <div className="px-3 py-3">
          <button
            onClick={() => {
              onClose();
              onOpenProfile();
            }}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <User className="h-4 w-4" />
              </div>
              <span>Mon compte</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <LogOut className="h-4 w-4" />
            </div>
            <span>Se déconnecter</span>
          </button>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}