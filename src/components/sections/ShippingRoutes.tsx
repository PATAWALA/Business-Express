"use client";

import { motion } from "framer-motion";
import { Plane, Package, MapPin, ArrowRight } from "lucide-react";
import { shippingSteps } from "@/data/routes";

const icons = [Package, Plane, MapPin];

export function ShippingRoutes() {
  return (
    <section id="vip" className="py-20 lg:py-28 bg-[#0F172A] text-white relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-[#1E50FF]/30 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[#FFC700]/20 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold text-[#FFC700] mb-4">
            Axe Stratégique
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Dubaï <span className="text-[#FFC700]">➔</span> Bukavu
          </h2>
          <p className="mt-4 text-white/60">
            Un flux logistique maîtrisé de bout en bout, du sourcing à la
            livraison finale.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 relative">
          {shippingSteps.map((step, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={step.city}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-gold text-[#0F172A]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-white/40">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">{step.city}</h3>
                <div className="text-sm font-semibold text-[#FFC700] mt-1">
                  {step.role}
                </div>
                <div className="text-xs text-white/50 mt-1">{step.country}</div>
                <p className="mt-4 text-sm text-white/70 leading-relaxed">
                  {step.description}
                </p>
                {i < shippingSteps.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-6 w-6 items-center justify-center rounded-full bg-[#FFC700] text-[#0F172A]">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}