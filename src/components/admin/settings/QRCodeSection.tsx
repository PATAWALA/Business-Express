// src/components/admin/settings/QRCodeSection.tsx
"use client";

import { useRef } from "react";
import QRCode from "react-qr-code";
import { Download, ScanLine, ShieldCheck } from "lucide-react";
import { Button } from "@/components/admin/ui/Button";

interface Props {
  userEmail: string;
}

export function QRCodeSection({ userEmail }: Props) {
  const qrRef = useRef<HTMLDivElement>(null);

  // L'URL de connexion avec l'email pré-rempli
  const loginUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/login?email=${encodeURIComponent(userEmail)}`
    : `https://business-express-one.vercel.app/login?email=${encodeURIComponent(userEmail)}`;

  // Fonction pour télécharger le QR Code en image haute résolution
  const downloadQRCode = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000; // Haute résolution pour l'impression
      canvas.height = 1000;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `QR-Code-Business-Express.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 shrink-0">
            <ScanLine className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Accès rapide par QR Code</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Scannez ce code avec votre téléphone pour vous connecter instantanément.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col md:flex-row items-center gap-8">
        {/* Le QR Code */}
        <div 
          ref={qrRef} 
          className="bg-white p-4 rounded-2xl border-4 border-slate-900 shadow-xl shrink-0"
        >
          <QRCode
            value={loginUrl}
            size={200}
            bgColor="#ffffff"
            fgColor="#0f172a"
            level="Q"
          />
        </div>

        {/* Les explications */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-sm text-blue-900">
            <p className="font-bold mb-1">💡 Comment l'utiliser ?</p>
            <p>Imprimez ce code et collez-le sur votre bureau. Quand vous voulez vous connecter, ouvrez l'appareil photo de votre téléphone, scannez le code, et votre page de connexion s'ouvre toute seule.</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 justify-center md:justify-start">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Votre mot de passe reste secret et protégé.</span>
          </div>

          <Button onClick={downloadQRCode} className="w-full md:w-auto gap-2 bg-slate-900 hover:bg-slate-800 text-white">
            <Download className="h-4 w-4" />
            Télécharger pour impression
          </Button>
        </div>
      </div>
    </div>
  );
}