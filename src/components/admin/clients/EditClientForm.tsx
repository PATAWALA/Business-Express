// src/components/admin/clients/EditClientForm.tsx
"use client";

import { useState } from "react";
import { Loader2, Save, X } from "lucide-react";
import { type Client } from "@/lib/order-client";

interface Props {
  client: Client;
  onSaved: () => void;
  onCancel: () => void;
}

export function EditClientForm({ client, onSaved, onCancel }: Props) {
  const [name, setName] = useState(client.name);
  const [whatsapp, setWhatsapp] = useState(client.whatsapp ?? "");
  const [city, setCity] = useState(client.city ?? "Bukavu");
  const [type, setType] = useState<"client" | "prospect">(client.type);
  const [notes, setNotes] = useState(client.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!name.trim()) {
      setError("Le nom est obligatoire");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/clients/${client.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          whatsapp: whatsapp.trim() || null,
          phone: whatsapp.trim() || null,
          city: city.trim() || null,
          type,
          notes: notes.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      onSaved();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">
          Nom
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">
          WhatsApp
        </label>
        <input
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="+243..."
          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">
          Ville
        </label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Bukavu</option>
          <option>Goma</option>
          <option>Kinshasa</option>
          <option>Autre</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">
          Type
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("prospect")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
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
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
              type === "client"
                ? "bg-green-100 text-green-800 border-2 border-green-400"
                : "bg-slate-50 text-slate-600 border-2 border-transparent"
            }`}
          >
            Client
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">
          Notes internes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: préfère les iPhones, paie en 2 fois..."
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-2 text-xs text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <X className="h-4 w-4" />
          Annuler
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:bg-blue-400"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Enregistrer
        </button>
      </div>
    </div>
  );
}