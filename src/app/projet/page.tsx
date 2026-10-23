// src/app/projet/page.tsx
import { ProjectForm } from "@/components/public/project/ProjectForm";
import { Sparkles, Clock, Shield, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Déposer mon projet — Business Express",
  description:
    "Décrivez votre projet d'import/export avec Dubaï. Réponse sous 48h. Sourcing, logistique, tourisme VIP.",
};

export default function ProjetPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-32 pb-12">
        <div className="pointer-events-none absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-amber-400/15 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 mb-5">
            <Sparkles className="h-3.5 w-3.5" />
            Étude gratuite · Sans engagement
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 text-balance">
            Votre projet Dubaï → Afrique,{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-blue-600">
                entre de bonnes mains
              </span>
              <span className="absolute bottom-1 left-0 z-0 h-3 w-full bg-amber-300/60 -rotate-1" />
            </span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
            Sourcing, achat, logistique sécurisée vers Bukavu et l'Afrique,
            accompagnement VIP à Dubaï. Décrivez votre projet, nous étudions et
            revenons vers vous <strong className="text-slate-900">sous 48h</strong>.
          </p>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
              <Clock className="h-3.5 w-3.5 text-blue-600" />
              Réponse sous 48h
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              100% confidentiel
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
              Sans engagement
            </div>
          </div>
        </div>
      </section>

      {/* Form section */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <ProjectForm />
        </div>
      </section>

      {/* Reassurance footer */}
      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                emoji: "🔍",
                title: "Sourcing direct usine",
                desc: "Nous négocions pour vous à Dubaï",
              },
              {
                emoji: "📦",
                title: "Logistique sécurisée",
                desc: "Fret aérien & maritime vers Bukavu",
              },
              {
                emoji: "👑",
                title: "Accompagnement VIP",
                desc: "Hôtels, visa, circuits d'affaires",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"
              >
                <div className="text-3xl mb-2">{item.emoji}</div>
                <div className="font-bold text-slate-900 text-sm">
                  {item.title}
                </div>
                <div className="text-xs text-slate-500 mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}