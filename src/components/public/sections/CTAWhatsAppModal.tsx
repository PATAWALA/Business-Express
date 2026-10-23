"use client";

import { MessageSquare, MapPin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/public/ui/Button";
import { buildWhatsAppLink } from "@/lib/public-utils";

export function CTAWhatsAppModal() {
  return (
    <section id="contact" className="py-20 lg:py-28 bg-white bg-grid">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl gradient-express p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl shadow-[#1E50FF]/30">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#FFC700]/40 blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-balance">
                Prêt à sourcer à Dubaï ?
              </h2>
              <p className="mt-4 text-white/85 max-w-md">
                Discutez directement avec un agent à Dubaï ou à Bukavu. Devis
                immédiat, réponse sous 2h ouvrées.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href={buildWhatsAppLink(
                    "Bonjour Business Express, je voudrais discuter de mon projet d'import/export."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="gold" size="lg" className="w-full sm:w-auto">
                    <MessageSquare className="h-4 w-4" />
                    Discuter sur WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  icon: MapPin,
                  title: "Bureau Dubaï (EAU)",
                  detail: "Deira, Business District",
                },
                {
                  icon: MapPin,
                  title: "Bureau Bukavu (RDC)",
                  detail: "Boulevard Kivu, Centre-ville",
                },
                {
                  icon: Phone,
                  title: "Téléphone / WhatsApp",
                  detail: "+243 970 000 000",
                },
                {
                  icon: Mail,
                  title: "Email",
                  detail: "contact@business-express.cd",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-sm p-4 border border-white/15"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                    <c.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">{c.title}</div>
                    <div className="text-xs text-white/70">{c.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}