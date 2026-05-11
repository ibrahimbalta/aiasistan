"use client";

import React, { useState, useEffect } from "react";
import { FileText, Database, Search, Trash2, ExternalLink, Bot, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { getKnowledgeBase, deleteKnowledge } from "@/actions/knowledge-actions";

export default function KnowledgePage() {
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadKnowledge();
  }, []);

  async function loadKnowledge() {
    setLoading(true);
    const result = await getKnowledgeBase();
    if (result.success) {
      setKnowledge(result.knowledge);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string, assistantId: string) => {
    if (!confirm("Bu bilgi kaynağını silmek istediğinizden emin misiniz?")) return;
    
    setDeletingId(id);
    const result = await deleteKnowledge(id, assistantId);
    if (result.success) {
      toast.success("Kaynak başarıyla silindi.");
      setKnowledge(prev => prev.filter(item => item.id !== id));
    } else {
      toast.error("Silme işlemi başarısız oldu.");
    }
    setDeletingId(null);
  };

  const filteredKnowledge = knowledge.filter(item => 
    item.fileName?.toLowerCase().includes(search.toLowerCase()) || 
    item.assistant?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && knowledge.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#D63384] animate-spin" />
        <p className="text-sm font-black text-zinc-400 uppercase tracking-widest animate-pulse">Kaynaklar Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <Sparkles className="w-5 h-5 text-yellow-500" />
             <span className="text-[10px] font-black text-[#D63384] uppercase tracking-[0.3em]">Merkezi Yönetim</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 uppercase italic leading-none">Bilgi Havuzu</h1>
          <p className="text-zinc-500 font-medium mt-2">Tüm asistanlarınızın bilgi kaynaklarını tek bir yerden yönetin.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group max-w-2xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-[#D63384] transition-colors" />
        <input 
          type="text" 
          placeholder="Kaynaklarda veya asistan adlarında ara..." 
          className="w-full bg-white border border-zinc-100 rounded-[2rem] pl-16 pr-6 py-5 text-zinc-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#D63384] transition-all shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Knowledge Table */}
      <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-50">
              <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">KAYNAK ADI</th>
              <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">TÜR</th>
              <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">AİT OLDUĞU ASİSTAN</th>
              <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">İŞLEMLER</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {filteredKnowledge.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors group">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#D63384] flex items-center justify-center group-hover:scale-110 transition-transform"><FileText className="w-6 h-6" /></div>
                    <span className="font-black text-zinc-900 uppercase italic truncate max-w-[200px]">{item.fileName || "Metin Kaynağı"}</span>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <span className="px-3 py-1 rounded-full bg-zinc-100 text-[10px] font-black text-zinc-500 uppercase tracking-tighter">
                    {item.type}
                  </span>
                </td>
                <td className="px-10 py-6">
                  <Link href={`/dashboard/${item.assistantId}`} className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#6B2D5C] transition-colors font-bold text-sm">
                    {item.assistant?.name}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
                <td className="px-10 py-6 text-right">
                  <button 
                    onClick={() => handleDelete(item.id, item.assistantId)}
                    disabled={deletingId === item.id}
                    className="p-3 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all disabled:opacity-30"
                  >
                    {deletingId === item.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredKnowledge.length === 0 && !loading && (
          <div className="py-32 text-center flex flex-col items-center justify-center">
             <div className="w-24 h-24 bg-zinc-50 rounded-[2.5rem] flex items-center justify-center mb-6">
                <Database className="w-12 h-12 text-zinc-200" />
             </div>
             <h4 className="text-xl font-black text-zinc-900 uppercase italic mb-2">Henüz Kaynak Bulunamadı</h4>
             <p className="text-zinc-500 font-medium">Asistanlarınıza döküman veya web sitesi eklediğinizde burada listelenecektir.</p>
          </div>
        )}
      </div>
    </div>
  );
}
