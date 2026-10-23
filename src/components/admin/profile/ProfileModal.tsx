// src/components/admin/profile/ProfileModal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  X,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  User,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AccountsManager } from "./AccountsManager";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  userEmail: string;
}

export function ProfileModal({ open, onClose, userEmail }: ProfileModalProps) {
  const [tab, setTab] = useState<"profile" | "accounts">("profile");
  const [newEmail, setNewEmail] = useState(userEmail);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTab("profile");
      setNewEmail(userEmail);
      setNewPassword("");
      setMessage(null);
      setError(null);
    }
  }, [open, userEmail]);

  if (!open) return null;

  async function handleEmailUpdate() {
    if (newEmail === userEmail) return;
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) setError(error.message);
    else setMessage("Un email de confirmation a été envoyé à la nouvelle adresse.");
    setLoading(false);
  }

  async function handlePasswordUpdate() {
    if (newPassword.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) setError(error.message);
    else {
      setMessage("Mot de passe mis à jour avec succès.");
      setNewPassword("");
    }
    setLoading(false);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Mon compte</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-2">
          <button
            onClick={() => setTab("profile")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
              tab === "profile"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <User className="h-4 w-4" />
            Mon profil
          </button>
          <button
            onClick={() => setTab("accounts")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
              tab === "accounts"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Users className="h-4 w-4" />
            Gestion des comptes
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {tab === "profile" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleEmailUpdate}
                  disabled={loading || newEmail === userEmail}
                  className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  Mettre à jour l'email
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handlePasswordUpdate}
                  disabled={loading || newPassword.length === 0}
                  className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" /> Mise à jour...
                    </span>
                  ) : (
                    "Changer le mot de passe"
                  )}
                </button>
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
            </div>
          )}

          {tab === "accounts" && <AccountsManager />}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}