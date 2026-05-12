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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 mb-2 uppercase italic leading-tight">Merhaba, {user?.name?.split(' ')[0]}</h1>
          <p className="text-sm sm:text-base text-zinc-500 font-medium">Platformunuzdaki genel performans ve asistan durumları.</p>
        </div>
        <Link 
          href="/dashboard/new" 
          className="bg-[#D63384] text-white px-6 py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 hover:bg-[#c22e77] transition-all shadow-xl shadow-pink-500/20 uppercase tracking-widest shrink-0"
        >
          <Plus className="w-5 h-5" />
          Yeni Asistan Oluştur
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[
          { label: "Aktif Asistanlar", value: assistants.length.toString(), icon: <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />, color: "bg-pink-100 text-[#D63384]" },
          { label: "Toplam Konuşma", value: totalChats.toString(), icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />, color: "bg-blue-100 text-blue-600" },
          { label: "Bilgi Kaynakları", value: assistants.reduce((acc, curr) => acc + curr._count.knowledge, 0).toString(), icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />, color: "bg-yellow-100 text-yellow-700" },
          { label: "AI Performans", value: "%99", icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />, color: "bg-green-100 text-green-700" },
        ].map((stat, i) => (
          <div key={i} className="p-4 sm:p-8 rounded-2xl sm:rounded-[2.5rem] bg-white border border-zinc-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl ${stat.color} group-hover:scale-110 transition-transform shrink-0`}>{stat.icon}</div>
              <span className="text-[8px] sm:text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">Canlı</span>
            </div>
            <div className="text-xl sm:text-3xl font-black text-zinc-900 mb-1 truncate">{stat.value}</div>
            <div className="text-[8px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest truncate">{stat.label}</div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {assistants.map((assistant) => (
              <div key={assistant.id} className="relative group">
                <DeleteAssistantButton id={assistant.id} name={assistant.name} />
                <Link 
                  href={`/dashboard/${assistant.id}`}
                  className="group p-6 sm:p-8 rounded-2xl sm:rounded-[3rem] bg-white border border-zinc-100 hover:border-pink-200 transition-all hover:shadow-2xl hover:shadow-pink-500/5 relative overflow-hidden block h-full"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center justify-between mb-6 sm:mb-8 relative z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#6B2D5C] rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl text-white shadow-xl shadow-purple-900/20 group-hover:rotate-6 transition-transform shrink-0">
                      {assistant.name[0]}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-[#198754]/10 text-[#198754] text-[10px] font-black uppercase tracking-wider">
                      Aktif
                    </div>
                  </div>
                  
                  <h4 className="text-lg sm:text-xl font-black mb-2 text-zinc-900 group-hover:text-[#D63384] transition-colors uppercase italic truncate">{assistant.name}</h4>
                  <p className="text-zinc-500 text-xs sm:text-sm mb-6 sm:mb-8 line-clamp-2 font-medium">{assistant.description || "Bu asistan için henüz bir açıklama eklenmedi."}</p>
                  
                  <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-zinc-50">
                     <div className="flex gap-4">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Mesaj</span>
                           <span className="font-black text-zinc-900 text-sm sm:text-base">{assistant._count.chats}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Kaynak</span>
                           <span className="font-black text-zinc-900 text-sm sm:text-base">{assistant._count.knowledge}</span>
                        </div>
                     </div>
                     <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-[#D63384] group-hover:text-white transition-all">
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                     </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 sm:p-20 rounded-2xl sm:rounded-[4rem] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center bg-white">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-50 rounded-xl sm:rounded-[2rem] flex items-center justify-center mb-6 sm:mb-8">
               <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-300" />
            </div>
            <h4 className="text-xl sm:text-2xl font-black mb-4 text-zinc-900 uppercase italic">Henüz Bir Asistanınız Yok</h4>
            <p className="text-zinc-500 text-sm sm:text-base font-medium mb-8 sm:mb-10 max-w-sm px-4">
              İlk yapay zeka asistanınızı oluşturarak müşterilerinize 7/24 hizmet vermeye başlayın.
            </p>
            <Link 
              href="/dashboard/new" 
              className="bg-[#D63384] text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:bg-[#c22e77] transition-all shadow-2xl shadow-pink-500/20 uppercase tracking-widest"
            >
              Hemen Başla
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
