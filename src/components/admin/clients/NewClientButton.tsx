// src/components/admin/clients/NewClientButton.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { NewClientInlineModal } from "@/components/admin/orders/NewClientInlineModal";

interface Props {
  onCreated: () => void;
}

export function NewClientButton({ onCreated }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm"
      >
        <Plus className="h-4 w-4" />
        Nouveau client
      </button>

      <NewClientInlineModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={() => {
          onCreated();
          setOpen(false);
        }}
      />
    </>
  );
}