"use client";

import { motion } from "framer-motion";
import { TrendingUp, Award, Clock } from "lucide-react";

const stats = [
  { icon: TrendingUp, value: "+500", label: "Colis & Conteneurs expédiés", color: "text-[#1E50FF]", bg: "bg-[#1E50FF]/10" },
  { icon: Award, value: "Top 1", label: "Sourcing Dubaï-Kivu", color: "text-[#8a6d00]", bg: "bg-[#FFC700]/20" },
  { icon: Clock, value: "48h", label: "Délai Express Garanti", color: "text-[#C00000]", bg: "bg-[#C00000]/10" },
];

export function StatsBar() {
  return (
    <section className="relative z-10 -mt-10 mb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-3xl border border-[#0F172A]/8 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center gap-4 px-2 sm:border-r last:border-0 border-[#0F172A]/6 sm:last:border-0"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.bg}`}>
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <div>
                <div className="text-2xl font-black text-[#0F172A]">
                  {s.value}
                </div>
                <div className="text-xs font-medium text-[#0F172A]/60">
                  {s.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}