import React from "react";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/auth-utils";
import { FileText, Database, Plus, Search, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function KnowledgePage() {
  const user = await syncUser();
  const knowledge = await prisma.knowledgeBase.findMany({
    where: {
      assistant: { userId: user?.id }
    },
    include: { assistant: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bilgi Havuzu</h1>
          <p className="text-zinc-400">Tüm asistanlarınızın bilgi kaynaklarını tek bir yerden yönetin.</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input 
          type="text" 
          placeholder="Kaynaklarda ara..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Knowledge Table/Grid */}
      <div className="glass-morphism rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-zinc-400">KAYNAK ADI</th>
              <th className="px-6 py-4 text-sm font-bold text-zinc-400">TÜR</th>
              <th className="px-6 py-4 text-sm font-bold text-zinc-400">AİT OLDUĞU ASİSTAN</th>
              <th className="px-6 py-4 text-sm font-bold text-zinc-400 text-right">İŞLEMLER</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {knowledge.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><FileText className="w-4 h-4" /></div>
                    <span className="font-medium text-white">{item.fileName || "Metin Kaynağı"}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-md bg-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/dashboard/${item.assistantId}`} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
                    {item.assistant.name}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-zinc-500 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {knowledge.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center justify-center">
             <Database className="w-12 h-12 text-zinc-700 mb-4" />
             <h4 className="text-white font-bold mb-1">Henüz bilgi kaynağı yok</h4>
             <p className="text-zinc-500 text-sm">Asistanlarınıza döküman ekledikçe burada listelenecektir.</p>
          </div>
        )}
      </div>
    </div>
  );
}
