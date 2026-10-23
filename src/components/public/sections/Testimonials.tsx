"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Patrick M.",
    role: "Commerçant — Bukavu",
    text: "Business Express a transformé mon approvisionnement. De la commande à Dubaï à la livraison à Bukavu, tout est fluide et sécurisé.",
  },
  {
    name: "Sarah K.",
    role: "Entrepreneuse — Kinshasa",
    text: "Le sourcing direct usine m'a permis d'augmenter mes marges. Une équipe réactive et professionnelle.",
  },
  {
    name: "David N.",
    role: "Investisseur — Goma",
    text: "Le service VIP à Dubaï est exceptionnel. Hôtel, visa, circuits d'affaires : tout était parfaitement organisé.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-[#0F172A] text-white relative overflow-hidden">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFC700]/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold text-[#FFC700] mb-4">
            Preuve Sociale
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Ils nous font confiance.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <Quote className="h-8 w-8 text-[#FFC700] mb-4" />
              <p className="text-sm text-white/80 leading-relaxed mb-6">
                "{t.text}"
              </p>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="h-3.5 w-3.5 fill-[#FFC700] text-[#FFC700]"
                  />
                ))}
              </div>
              <div className="text-sm font-bold">{t.name}</div>
              <div className="text-xs text-white/50">{t.role}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}