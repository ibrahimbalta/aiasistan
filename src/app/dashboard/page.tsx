import React from "react";
import Link from "next/link";
import { Plus, MessageSquare, Users, Zap, ArrowRight, Bot } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/auth-utils";

export default async function DashboardPage() {
  const user = await syncUser();
  
  // Asistanları ve sayısal verileri çekelim
  const assistants = await prisma.assistant.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { chats: true, knowledge: true }
      }
    }
  });

  const totalChats = assistants.reduce((acc, curr) => acc + curr._count.chats, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Hoş Geldiniz, {user?.name}</h1>
          <p className="text-zinc-400">Yapay zeka asistanlarınızın performansını takip edin.</p>
        </div>
        <Link 
          href="/dashboard/new" 
          className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-zinc-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Asistan
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Aktif Asistanlar", value: assistants.length.toString(), icon: <MessageSquare className="w-4 h-4 text-blue-500" /> },
          { label: "Toplam Konuşma", value: totalChats.toString(), icon: <Users className="w-4 h-4 text-green-500" /> },
          { label: "Bilgi Kaynakları", value: assistants.reduce((acc, curr) => acc + curr._count.knowledge, 0).toString(), icon: <Zap className="w-4 h-4 text-yellow-500" /> },
          { label: "Durum", value: "Aktif", icon: <Bot className="w-4 h-4 text-zinc-500" /> },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-xl glass-morphism border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">{stat.icon}</div>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Assistants List */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-6">Asistanlarım</h3>
        
        {assistants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assistants.map((assistant) => (
              <Link 
                key={assistant.id}
                href={`/dashboard/${assistant.id}`}
                className="group p-6 rounded-2xl glass-morphism border border-white/5 hover:border-white/10 transition-all hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg">
                    {assistant.name[0]}
                  </div>
                  <div className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-lg font-bold mb-1 text-white">{assistant.name}</h4>
                <p className="text-zinc-500 text-sm mb-4 line-clamp-1">{assistant.description || "Açıklama yok"}</p>
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                  <span>{assistant._count.chats} Konuşma</span>
                  <span>•</span>
                  <span>{assistant._count.knowledge} Kaynak</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
               <Plus className="w-8 h-8 text-zinc-500" />
            </div>
            <h4 className="text-lg font-semibold mb-2 text-white">Henüz bir asistanınız yok</h4>
            <p className="text-zinc-500 text-sm mb-6 max-w-xs">
              İlk yapay zeka asistanınızı oluşturarak müşterilerinizle otomatik konuşmaya başlayın.
            </p>
            <Link 
              href="/dashboard/new" 
              className="bg-white text-black px-6 py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors"
            >
              İlk Asistanımı Oluştur
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
