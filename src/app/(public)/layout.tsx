// src/app/(public)/layout.tsx
import { Header } from "@/components/public/layout/Header";
import { Footer } from "@/components/public/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}