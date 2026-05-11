import React from "react";
import Link from "next/link";
import { Plus, MessageSquare, Users, Zap, ArrowRight, Bot, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/auth-utils";
import DeleteAssistantButton from "@/components/DeleteAssistantButton";

export default async function DashboardPage() {
  const user = await syncUser();
  
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
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-2 uppercase italic">Merhaba, {user?.name?.split(' ')[0]}</h1>
          <p className="text-zinc-500 font-medium">Platformunuzdaki genel performans ve asistan durumları.</p>
        </div>
        <Link 
          href="/dashboard/new" 
          className="bg-[#D63384] text-white px-6 py-3.5 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-[#c22e77] transition-all shadow-xl shadow-pink-500/20 uppercase tracking-widest"
        >
          <Plus className="w-5 h-5" />
          Yeni Asistan Oluştur
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Aktif Asistanlar", value: assistants.length.toString(), icon: <MessageSquare className="w-5 h-5" />, color: "bg-pink-100 text-[#D63384]" },
          { label: "Toplam Konuşma", value: totalChats.toString(), icon: <Users className="w-5 h-5" />, color: "bg-blue-100 text-blue-600" },
          { label: "Bilgi Kaynakları", value: assistants.reduce((acc, curr) => acc + curr._count.knowledge, 0).toString(), icon: <Zap className="w-5 h-5" />, color: "bg-yellow-100 text-yellow-700" },
          { label: "AI Performans", value: "%99", icon: <TrendingUp className="w-5 h-5" />, color: "bg-green-100 text-green-700" },
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-zinc-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>{stat.icon}</div>
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-50 px-2 py-1 rounded-md">Canlı</span>
            </div>
            <div className="text-3xl font-black text-zinc-900 mb-1">{stat.value}</div>
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Assistants List */}
      <div className="mt-12">
        <div className="flex items-center gap-4 mb-8">
           <div className="h-px flex-1 bg-zinc-200" />
           <h3 className="text-sm font-black text-zinc-400 uppercase tracking-[0.4em]">ASİSTANLARINIZ</h3>
           <div className="h-px flex-1 bg-zinc-200" />
        </div>
        
        {assistants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assistants.map((assistant) => (
              <div key={assistant.id} className="relative group">
                <DeleteAssistantButton id={assistant.id} name={assistant.name} />
                <Link 
                  href={`/dashboard/${assistant.id}`}
                  className="group p-8 rounded-[3rem] bg-white border border-zinc-100 hover:border-pink-200 transition-all hover:shadow-2xl hover:shadow-pink-500/5 relative overflow-hidden block h-full"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="w-14 h-14 bg-[#6B2D5C] rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-purple-900/20 group-hover:rotate-6 transition-transform">
                      {assistant.name[0]}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-[#198754]/10 text-[#198754] text-[10px] font-black uppercase tracking-wider">
                      Aktif
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-black mb-2 text-zinc-900 group-hover:text-[#D63384] transition-colors uppercase italic">{assistant.name}</h4>
                  <p className="text-zinc-500 text-sm mb-8 line-clamp-2 font-medium">{assistant.description || "Bu asistan için henüz bir açıklama eklenmedi."}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                     <div className="flex gap-4">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Mesaj</span>
                           <span className="font-black text-zinc-900">{assistant._count.chats}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Kaynak</span>
                           <span className="font-black text-zinc-900">{assistant._count.knowledge}</span>
                        </div>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-[#D63384] group-hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5" />
                     </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 rounded-[4rem] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center bg-white">
            <div className="w-20 h-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center mb-8">
               <Bot className="w-10 h-10 text-zinc-300" />
            </div>
            <h4 className="text-2xl font-black mb-4 text-zinc-900 uppercase italic">Henüz Bir Asistanınız Yok</h4>
            <p className="text-zinc-500 font-medium mb-10 max-w-sm">
              İlk yapay zeka asistanınızı oluşturarak müşterilerinize 7/24 hizmet vermeye başlayın.
            </p>
            <Link 
              href="/dashboard/new" 
              className="bg-[#D63384] text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-[#c22e77] transition-all shadow-2xl shadow-pink-500/20 uppercase tracking-widest"
            >
              Hemen Başla
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
