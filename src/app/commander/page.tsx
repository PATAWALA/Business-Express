// src/app/commander/page.tsx
import { OrderForm } from "@/components/public/order/OrderForm";
import { ShoppingBag, Shield, Clock } from "lucide-react";

export const metadata = {
  title: "Enregistrer ma commande — Business Express",
  description:
    "Finalisez l'enregistrement de votre commande validée avec Business Express.",
};

export default function CommanderPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-32 pb-12">
        <div className="pointer-events-none absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 mb-5">
            <ShoppingBag className="h-3.5 w-3.5" />
            Accès privé · Enregistrement de commande
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 text-balance">
            Enregistrez votre commande en 1 minute
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
            Vous avez validé les détails avec Business Express sur WhatsApp ?
            Remplissez ce formulaire pour officialiser votre commande.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              Vos données sont sécurisées
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
              <Clock className="h-3.5 w-3.5 text-blue-600" />
              Confirmation immédiate
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <OrderForm />
        </div>
      </section>
    </div>
  );
}