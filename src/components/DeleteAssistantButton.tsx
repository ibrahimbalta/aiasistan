"use client";

import React, { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteAssistant } from "@/actions/delete-assistant";
import { toast } from "react-hot-toast";

interface DeleteAssistantButtonProps {
  id: string;
  name: string;
}

export default function DeleteAssistantButton({ id, name }: DeleteAssistantButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link tıklamasını engelle
    e.stopPropagation(); // Link'e gitmeyi engelle

    if (!confirm(`${name} isimli asistanı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await deleteAssistant(id);
      if (res.success) {
        toast.success("Asistan başarıyla silindi.");
      } else {
        throw new Error(res.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Silme işlemi başarısız.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="absolute top-6 right-12 z-20 p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
      title="Asistanı Sil"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
