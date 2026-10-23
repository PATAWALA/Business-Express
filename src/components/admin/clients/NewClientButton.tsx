// src/components/admin/clients/NewClientButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/admin/ui/Button";
import { NewClientInlineModal } from "@/components/admin/orders/NewClientInlineModal";
import { useToast } from "@/components/admin/ui/ToastProvider";

export function NewClientButton() {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Nouveau client
      </Button>

      <NewClientInlineModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={() => {
          toast.success("Client créé avec succès ✅");
          setOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}