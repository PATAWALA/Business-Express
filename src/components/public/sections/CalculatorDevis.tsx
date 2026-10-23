"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Package,
  Plane,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/public/ui/Button";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink, WHATSAPP_AGENT } from "@/lib/public-utils";

type ServiceType = "sourcing" | "colis" | "voyage";

const serviceOptions: {
  id: ServiceType;
  label: string;
  icon: typeof ShoppingBag;
  description: string;
}[] = [
  {
    id: "sourcing",
    label: "Sourcing / Import",
    icon: ShoppingBag,
    description: "Acheter des marchandises à Dubaï",
  },
  {
    id: "colis",
    label: "Envoi de Colis",
    icon: Package,
    description: "Expédier un colis vers l'Afrique",
  },
  {
    id: "voyage",
    label: "Voyage Business",
    icon: Plane,
    description: "Accompagnement VIP à Dubaï",
  },
];

const merchandiseOptions = [
  "Électronique",
  "Vêtements & Textile",
  "Pièces Auto",
  "Cosmétiques",
  "Mobilier",
  "Conteneur complet",
];

const destinations = ["Bukavu", "Goma", "Kinshasa", "Autre ville"];

export function CalculatorDevis() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState<ServiceType | null>(null);
  const [merch, setMerch] = useState("");
  const [destination, setDestination] = useState("");

  const summary = useMemo(() => {
    if (!service) return "";
    const svc =
      service === "sourcing"
        ? "Sourcing / Import"
        : service === "colis"
        ? "Envoi de Colis"
        : "Voyage Business VIP";
    return [
      `Bonjour ${WHATSAPP_AGENT},`,
      `Je souhaite une demande de devis :`,
      `• Service : ${svc}`,
      merch ? `• Marchandise : ${merch}` : null,
      destination ? `• Destination : ${destination}` : null,
      `Merci de me faire parvenir une estimation.`,
    ]
      .filter(Boolean)
      .join("\n");
  }, [service, merch, destination]);

  const canNext =
    (step === 1 && service) ||
    (step === 2 && merch) ||
    (step === 3 && destination);

  return (
    <section id="calculateur" className="py-20 lg:py-28 bg-[#F8FAFC]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-full border border-[#1E50FF]/20 bg-[#1E50FF]/5 px-4 py-1.5 text-xs font-bold text-[#1E50FF] mb-4">
            Estimateur Interactif
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0F172A]">
            Calculer mon Devis
          </h2>
          <p className="mt-4 text-[#0F172A]/60 max-w-xl mx-auto">
            3 étapes, 30 secondes. Envoyez votre demande directement à{" "}
            <strong className="text-[#0F172A]">{WHATSAPP_AGENT}</strong>.
          </p>
        </div>

        <div className="rounded-3xl border border-[#0F172A]/8 bg-white p-6 sm:p-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all",
                    step >= s
                      ? "bg-[#1E50FF] text-white shadow-md shadow-[#1E50FF]/30"
                      : "bg-[#0F172A]/5 text-[#0F172A]/40"
                  )}
                >
                  {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={cn(
                      "h-1 flex-1 rounded-full mx-2 transition-all",
                      step > s ? "bg-[#1E50FF]" : "bg-[#0F172A]/8"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="text-xl font-bold text-[#0F172A] mb-1">
                  Quel service vous intéresse ?
                </h3>
                <p className="text-sm text-[#0F172A]/60 mb-6">Étape 1 sur 3</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {serviceOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setService(opt.id)}
                      className={cn(
                        "rounded-2xl border-2 p-5 text-left transition-all",
                        service === opt.id
                          ? "border-[#1E50FF] bg-[#1E50FF]/5"
                          : "border-[#0F172A]/8 hover:border-[#1E50FF]/40"
                      )}
                    >
                      <opt.icon
                        className={cn(
                          "h-7 w-7 mb-3",
                          service === opt.id
                            ? "text-[#1E50FF]"
                            : "text-[#0F172A]/50"
                        )}
                      />
                      <div className="font-bold text-sm text-[#0F172A]">
                        {opt.label}
                      </div>
                      <div className="text-xs text-[#0F172A]/60 mt-1">
                        {opt.description}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="text-xl font-bold text-[#0F172A] mb-1">
                  Type de marchandise
                </h3>
                <p className="text-sm text-[#0F172A]/60 mb-6">Étape 2 sur 3</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {merchandiseOptions.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMerch(m)}
                      className={cn(
                        "rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition-all",
                        merch === m
                          ? "border-[#1E50FF] bg-[#1E50FF]/5 text-[#1E50FF]"
                          : "border-[#0F172A]/8 text-[#0F172A]/70 hover:border-[#1E50FF]/40"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="text-xl font-bold text-[#0F172A] mb-1">
                  Destination
                </h3>
                <p className="text-sm text-[#0F172A]/60 mb-6">Étape 3 sur 3</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {destinations.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDestination(d)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition-all",
                        destination === d
                          ? "border-[#1E50FF] bg-[#1E50FF]/5 text-[#1E50FF]"
                          : "border-[#0F172A]/8 text-[#0F172A]/70 hover:border-[#1E50FF]/40"
                      )}
                    >
                      <MapPin className="h-4 w-4" />
                      {d}
                    </button>
                  ))}
                </div>

                {destination && (
                  <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4">
                    <div className="text-sm font-bold text-green-800 mb-1">
                      ✅ Demande prête
                    </div>
                    <div className="text-xs text-green-700 whitespace-pre-line">
                      {summary}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>

            {step < 3 ? (
              <Button
                variant="primary"
                onClick={() => canNext && setStep((s) => s + 1)}
                disabled={!canNext}
              >
                Suivant
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <a
                href={buildWhatsAppLink(summary)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="gold" disabled={!destination}>
                  <MessageSquare className="h-4 w-4" />
                  Envoyer à {WHATSAPP_AGENT}
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
