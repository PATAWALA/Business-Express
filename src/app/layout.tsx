// src/app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Business Express — Dubaï ↔ Bukavu | Sourcing, Logistique & VIP",
  description:
    "Votre pont stratégique entre Dubaï et l'Afrique. Sourcing, import/export sécurisé vers Bukavu & RDC, et tourisme VIP à Dubaï.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={jakarta.variable}>
      <body className="font-sans antialiased bg-white">{children}</body>
    </html>
  );
}