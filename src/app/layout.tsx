import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/public/layout/Header";
import { Footer } from "@/components/public/layout/Footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Business Express — Dubaï ↔ Bukavu | Sourcing, Logistique & VIP",
  description:
    "Votre pont stratégique entre Dubaï et l'Afrique. Sourcing, import/export sécurisé vers Bukavu & RDC, et tourisme VIP à Dubaï.",
  keywords: [
    "sourcing Dubaï",
    "import Bukavu",
    "logistique RDC",
    "Business Express",
    "tourisme VIP Dubaï",
  ],
  openGraph: {
    title: "Business Express — Dubaï ↔ Bukavu",
    description:
      "Sourcing, logistique sécurisée et accompagnement VIP entre Dubaï et l'Afrique.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={jakarta.variable}>
      <body className="font-sans antialiased bg-white">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}