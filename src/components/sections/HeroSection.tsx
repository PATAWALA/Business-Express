"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Factory,
  Plane,
  MapPin,
  Package,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { buildWhatsAppLink } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28 bg-white bg-grid">
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#1E50FF]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#FFC700]/20 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Colonne gauche */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge color="express" className="mb-6">
                <Plane className="h-3.5 w-3.5" />
                Dubaï → Bukavu · Afrique
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-balance text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-[#0F172A]"
            >
              Votre Pont Stratégique entre{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#1E50FF]">Dubaï</span>
                <span className="absolute bottom-1 left-0 z-0 h-3 w-full bg-[#FFC700]/60 -rotate-1" />
              </span>{" "}
              et l'Afrique.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-6 max-w-xl text-lg text-[#0F172A]/70 leading-relaxed"
            >
              Sourcing, achat de marchandises, logistique sécurisée vers{" "}
              <strong className="text-[#0F172A]">Bukavu & l'Afrique</strong>, et
              accompagnement touristique VIP à Dubaï.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-8 flex flex-wrap gap-2"
            >
              <Badge color="express">
                <ShieldCheck className="h-3.5 w-3.5" /> 100% Sécurisé
              </Badge>
              <Badge color="gold">
                <Factory className="h-3.5 w-3.5" /> Sourcing Direct Usine
              </Badge>
              <Badge color="energy">
                <Plane className="h-3.5 w-3.5" /> Expédition Express Air/Mer
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-10 flex flex-col sm:flex-row gap-3"
            >
              <a href="#calculateur">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Calculer mon Devis d'Importation
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a
                href={buildWhatsAppLink(
                  "Bonjour, je voudrais parler à un agent à Dubaï."
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Parler à un Agent à Dubaï
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Colonne droite — mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl border border-[#0F172A]/8 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs font-semibold text-[#0F172A]/70">
                    Suivi en direct
                  </span>
                </div>
                <Badge color="gold">
                  <TrendingUp className="h-3 w-3" /> Express
                </Badge>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: "BE-2048",
                    route: "Dubaï → Bukavu",
                    status: "En transit",
                    icon: Plane,
                    color: "text-[#1E50FF]",
                  },
                  {
                    id: "BE-2047",
                    route: "Dubaï → Goma",
                    status: "Livré",
                    icon: Package,
                    color: "text-green-600",
                  },
                  {
                    id: "BE-2046",
                    route: "Bukavu → Dubaï",
                    status: "Dédouané",
                    icon: MapPin,
                    color: "text-[#C00000]",
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border border-[#0F172A]/6 bg-[#F8FAFC] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0F172A]">
                          {item.id}
                        </div>
                        <div className="text-[11px] text-[#0F172A]/60">
                          {item.route}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#0F172A]/70">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 rounded-2xl gradient-gold px-5 py-4 shadow-xl shadow-[#FFC700]/40"
            >
              <div className="text-2xl font-black text-[#0F172A]">+500</div>
              <div className="text-xs font-semibold text-[#0F172A]/80">
                Colis & Conteneurs livrés
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -top-4 -right-4 rounded-2xl glass border border-white/60 px-4 py-3 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#1E50FF]" />
                <span className="text-xs font-bold text-[#0F172A]">
                  Douane OK
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}