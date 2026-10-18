"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { products, categories } from "@/data/products";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function DubaiCatalog() {
  const [active, setActive] = useState("Tous");
  const filtered =
    active === "Tous" ? products : products.filter((p) => p.category === active);

  return (
    <section id="catalogue" className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center rounded-full border border-[#FFC700]/50 bg-[#FFC700]/15 px-4 py-1.5 text-xs font-bold text-[#8a6d00] mb-4">
              Tendances Sourcing Dubaï
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0F172A]">
              Ce qui part de Dubaï.
            </h2>
            <p className="mt-3 text-[#0F172A]/60 max-w-xl">
              Produits en tendance, disponibles à l'achat et à l'expédition vers
              Bukavu & l'Afrique.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                active === c
                  ? "bg-[#0F172A] text-white shadow-md"
                  : "bg-[#F8FAFC] text-[#0F172A]/70 hover:bg-[#0F172A]/5"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group overflow-hidden rounded-3xl border border-[#0F172A]/8 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_50px_rgba(15,23,42,0.10)] transition-all"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <Badge color={p.badgeColor}>{p.badge}</Badge>
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs font-semibold text-[#0F172A]/50 mb-1">
                  {p.category}
                </div>
                <h3 className="font-bold text-[#0F172A]">{p.name}</h3>
                <div className="mt-2 text-sm font-semibold text-[#1E50FF]">
                  {p.price}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}