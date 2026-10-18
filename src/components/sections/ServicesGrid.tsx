"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { services } from "@/data/services";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const accentClasses = {
  express: "bg-[#1E50FF]/10 text-[#1E50FF]",
  gold: "bg-[#FFC700]/25 text-[#8a6d00]",
  energy: "bg-[#C00000]/10 text-[#C00000]",
};

export function ServicesGrid() {
  return (
    <section id="services" className="py-20 lg:py-28 bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <div className="inline-flex items-center rounded-full border border-[#1E50FF]/20 bg-[#1E50FF]/5 px-4 py-1.5 text-xs font-bold text-[#1E50FF] mb-4">
            Nos Services
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0F172A]">
            Trois piliers, une seule{" "}
            <span className="text-[#1E50FF]">expertise</span>.
          </h2>
          <p className="mt-4 text-[#0F172A]/60">
            Du sourcing à la livraison finale, en passant par l'accompagnement
            VIP à Dubaï.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.10)]">
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl mb-5",
                    accentClasses[s.accent as keyof typeof accentClasses]
                  )}
                >
                  <s.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-[#0F172A]/65 leading-relaxed mb-5">
                  {s.description}
                </p>
                <ul className="space-y-2 mb-5">
                  {s.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm font-medium text-[#0F172A]/80"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#1E50FF]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#calculateur"
                  className="inline-flex items-center gap-1 text-sm font-bold text-[#1E50FF] hover:gap-2 transition-all"
                >
                  En savoir plus <ArrowRight className="h-4 w-4" />
                </a>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}