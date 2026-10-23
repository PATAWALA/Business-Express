// src/components/admin/orders/NewClientInlineModal.tsx
"use client";

import { useState } from "react";
import { X, UserPlus, Loader2 } from "lucide-react";
import { createClient as createClientApi, type Client } from "@/lib/order-client";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (client: Client) => void;
}

export function NewClientInlineModal({ open, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("Bukavu");
  const [type, setType] = useState<"client" | "prospect">("prospect");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Le nom est obligatoire");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const client = await createClientApi({
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        city,
        type,
      });
      onCreated(client);
      setName("");
      setWhatsapp("");
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Nouveau client</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nom complet *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Marie Kabongo"
              autoFocus
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              WhatsApp
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+243 970 000 000"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Ville
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Bukavu</option>
              <option>Goma</option>
              <option>Kinshasa</option>
              <option>Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("prospect")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
                  type === "prospect"
                    ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-400"
                    : "bg-slate-50 text-slate-600 border-2 border-transparent"
                }`}
              >
                Prospect
              </button>
              <button
                type="button"
                onClick={() => setType("client")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
                  type === "client"
                    ? "bg-green-100 text-green-800 border-2 border-green-400"
                    : "bg-slate-50 text-slate-600 border-2 border-transparent"
                }`}
              >
                Client
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer le client"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}