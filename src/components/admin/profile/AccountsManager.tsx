// src/components/admin/profile/AccountsManager.tsx
"use client";

import { useState } from "react";
import { Mail, Lock, Loader2, CheckCircle2, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AccountsManager() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!email || password.length < 6) {
      setError("Email valide + mot de passe de 6 caractères minimum requis.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    // Créer le compte (signUp)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      setMessage(`Compte créé pour ${email}. Le collaborateur peut se connecter immédiatement.`);
      setEmail("");
      setPassword("");
    }

    setLoading(false);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800">
        💡 Créez un compte pour un collaborateur. Il pourra se connecter avec
        l'email et le mot de passe que vous définissez ici.
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Email du collaborateur
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="collaborateur@business-express.cd"
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="•••••••• (6 caractères min.)"
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {message && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-xs text-green-700 flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
          {error}
        </div>
      )}

      <button
        onClick={handleCreate}
        disabled={loading || !email || password.length < 6}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Création...
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" />
            Créer le compte
          </>
        )}
      </button>
    </div>
  );
}