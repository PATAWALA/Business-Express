// src/components/public/layout/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import {
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import { Rocket, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#0F172A]/8 bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.jpeg"
                alt="Business Express"
                width={44}
                height={44}
                className="h-11 w-auto object-contain"
              />
              <span className="text-sm font-black tracking-tight">
                BUSINESS <span className="text-[#1E50FF]">EXPRESS</span>
              </span>
            </div>
            <p className="text-sm text-[#0F172A]/60 max-w-sm leading-relaxed">
              Votre pont stratégique entre Dubaï et l'Afrique. Sourcing,
              logistique sécurisée et accompagnement VIP.
            </p>

            {/* CTA projet */}
            <Link
              href="/projet"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1E50FF] hover:bg-[#4E75FF] text-white text-sm font-semibold px-4 py-2.5 transition-colors shadow-lg shadow-[#1E50FF]/25"
            >
              <Rocket className="h-4 w-4" />
              Déposer mon projet
            </Link>

            {/* Réseaux */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://wa.me/243970000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25 transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E50FF]/10 text-[#1E50FF] hover:bg-[#1E50FF]/20 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F172A]/5 text-[#0F172A] hover:bg-[#0F172A]/10 transition-colors"
                aria-label="TikTok"
              >
                <FaTiktok className="h-4 w-4" />
              </a>
              <a
                href="mailto:contact@business-express.cd"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFC700]/25 text-[#8a6d00] hover:bg-[#FFC700]/40 transition-colors"
                aria-label="Email"
              >
                <FaEnvelope className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0F172A]/40 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { l: "Services", h: "#services" },
                { l: "Catalogue", h: "#catalogue" },
                { l: "Contact", h: "#contact" },
              ].map((x) => (
                <li key={x.h}>
                  <Link
                    href={x.h}
                    className="text-[#0F172A]/70 hover:text-[#1E50FF] transition-colors"
                  >
                    {x.l}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/projet"
                  className="text-[#1E50FF] font-semibold hover:underline"
                >
                  Déposer mon projet →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0F172A]/40 mb-4">
              Bureaux
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <div className="font-semibold text-[#0F172A]">🇦🇪 Dubaï</div>
                <div className="text-[#0F172A]/60 text-xs">Deira, EAU</div>
              </li>
              <li>
                <div className="font-semibold text-[#0F172A]">🇨🇩 Bukavu</div>
                <div className="text-[#0F172A]/60 text-xs">Kivu, RDC</div>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne du bas avec lien discret vers login admin */}
        <div className="mt-12 border-t border-[#0F172A]/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#0F172A]/50">
            © {new Date().getFullYear()} Business Express.{" "}
            <Link
              href="/login"
              title="Accéder à l'espace administration"
              className="group inline-flex items-center gap-1 hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              <Lock className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span>Tous droits réservés.</span>
            </Link>
          </div>

          <div className="flex items-center gap-5 text-xs text-[#0F172A]/50">
            <Link href="#" className="hover:text-[#0F172A] transition-colors">
              Mentions légales
            </Link>
            <Link href="#" className="hover:text-[#0F172A] transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}