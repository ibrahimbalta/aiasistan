import React from "react";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/auth-utils";
import { BarChart3, TrendingUp, Users, MessageSquare, Zap, Activity } from "lucide-react";

export default async function AnalyticsPage() {
  const user = await syncUser();
  const assistants = await prisma.assistant.findMany({
    where: { userId: user?.id },
    include: { _count: { select: { chats: true } } }
  });

  const totalChats = assistants.reduce((acc, curr) => acc + curr._count.chats, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analizler</h1>
        <p className="text-zinc-400">Asistanlarınızın performans verilerini detaylıca inceleyin.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-morphism border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><MessageSquare className="w-5 h-5" /></div>
            <span className="text-xs font-medium text-green-500">+12%</span>
          </div>
          <div className="text-3xl font-bold mb-1 text-white">{totalChats}</div>
          <div className="text-sm text-zinc-500">Toplam Konuşma</div>
        </div>
        <div className="p-6 rounded-2xl glass-morphism border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><Zap className="w-5 h-5" /></div>
            <span className="text-xs font-medium text-green-500">+5%</span>
          </div>
          <div className="text-3xl font-bold mb-1 text-white">{(totalChats * 14).toLocaleString()}</div>
          <div className="text-sm text-zinc-500">Kullanılan Token</div>
        </div>
        <div className="p-6 rounded-2xl glass-morphism border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-500"><Activity className="w-5 h-5" /></div>
            <span className="text-xs font-medium text-zinc-500">Sabit</span>
          </div>
          <div className="text-3xl font-bold mb-1 text-white">%98</div>
          <div className="text-sm text-zinc-500">Başarı Oranı</div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="p-8 rounded-2xl glass-morphism border border-white/5 min-h-[300px] flex flex-col items-center justify-center text-center">
            <BarChart3 className="w-12 h-12 text-zinc-700 mb-4" />
            <h4 className="text-white font-bold mb-1">Haftalık Kullanım</h4>
            <p className="text-zinc-500 text-sm">Veriler toplanmaya devam ediyor...</p>
         </div>
         <div className="p-8 rounded-2xl glass-morphism border border-white/5 min-h-[300px] flex flex-col items-center justify-center text-center">
            <TrendingUp className="w-12 h-12 text-zinc-700 mb-4" />
            <h4 className="text-white font-bold mb-1">Müşteri Memnuniyeti</h4>
            <p className="text-zinc-500 text-sm">Yapay zeka analizleri yakında burada olacak.</p>
         </div>
      </div>
    </div>
  );
}
