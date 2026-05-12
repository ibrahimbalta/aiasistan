import React from "react";
import Link from "next/link";
import { Plus, MessageSquare, Users, Zap, ArrowRight, Bot, TrendingUp, Bell, Settings, BarChart3, Clock, CheckCircle2, Info, AlertTriangle, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/auth-utils";
import DeleteAssistantButton from "@/components/DeleteAssistantButton";
import { MiniStatChart, PerformanceChart } from "@/components/DashboardCharts";

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
  const totalKnowledge = assistants.reduce((acc, curr) => acc + curr._count.knowledge, 0);

  const stats = [
    { label: "Aktif Asistanlar", value: assistants.length.toString(), icon: <MessageSquare className="w-5 h-5" />, color: "#D63384", bgColor: "bg-pink-50", chartData: [{value: 10}, {value: 15}, {value: 12}, {value: 20}, {value: 18}, {value: 25}] },
    { label: "Toplam Konuşma", value: totalChats.toString(), icon: <Users className="w-5 h-5" />, color: "#3B82F6", bgColor: "bg-blue-50", chartData: [{value: 5}, {value: 25}, {value: 15}, {value: 40}, {value: 30}, {value: 50}] },
    { label: "Bilgi Kaynakları", value: totalKnowledge.toString(), icon: <Zap className="w-5 h-5" />, color: "#EAB308", bgColor: "bg-yellow-50", chartData: [{value: 20}, {value: 10}, {value: 30}, {value: 15}, {value: 45}, {value: 35}] },
    { label: "AI Performans", value: "%99", icon: <TrendingUp className="w-5 h-5" />, color: "#22C55E", bgColor: "bg-green-50", chartData: [{value: 90}, {value: 95}, {value: 92}, {value: 98}, {value: 97}, {value: 99}] },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 mb-2 leading-tight flex items-center gap-2">
            Merhaba, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 font-medium">Platformunuzdaki genel performans ve asistan durumları.</p>
        </div>
        <Link 
          href="/dashboard/new" 
          className="bg-[#6B2D5C] text-white px-6 py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#522246] transition-all shadow-xl shadow-purple-900/20 uppercase tracking-wider shrink-0"
        >
          <Plus className="w-5 h-5" />
          Yeni Asistan Oluştur
        </Link>
      </div>

      {/* Top Section: Stats + Promo Card */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Stats Grid */}
        <div className="xl:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="p-5 sm:p-6 rounded-[2rem] bg-white border border-zinc-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform shrink-0`} style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                  <span className="text-[9px] font-bold text-green-500 uppercase tracking-wider bg-green-50 px-2 py-1 rounded-md">Aktif</span>
                </div>
                <div className="text-2xl font-extrabold text-zinc-900 mb-0.5">{stat.value}</div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{stat.label}</div>
              </div>
              <MiniStatChart data={stat.chartData} color={stat.color} />
            </div>
          ))}
        </div>

        {/* Promo Card */}
        <div className="xl:col-span-1 bg-gradient-to-br from-purple-50 to-pink-50 rounded-[2.5rem] border border-white p-6 relative overflow-hidden group">
            <div className="relative z-10">
                <h3 className="text-sm font-bold text-[#6B2D5C] mb-2 uppercase">AI Asistanınız Yanınızda</h3>
                <p className="text-[10px] text-zinc-500 leading-relaxed mb-4">Asistanlarınızı yönetin, konuşmaları takip edin ve performansı artırın.</p>
                <div className="w-24 h-24 mx-auto relative group-hover:scale-110 transition-transform">
                   <div className="absolute inset-0 bg-white/50 rounded-full blur-2xl" />
                   <img src="/images/robot.png" alt="Robot" className="w-full h-full object-contain relative z-10 mix-blend-multiply" />
                </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#D63384]/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Assistants Header */}
      <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-zinc-100" />
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <Bot className="w-3 h-3" /> ASİSTANLARINIZ
          </h3>
          <div className="h-px flex-1 bg-zinc-100" />
      </div>

      {/* Assistants List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assistants.map((assistant) => (
            <div key={assistant.id} className="relative group">
              <DeleteAssistantButton id={assistant.id} name={assistant.name} />
              <Link 
                href={`/dashboard/${assistant.id}`}
                className="group p-6 sm:p-8 rounded-[2.5rem] bg-white border border-zinc-100 hover:border-purple-200 transition-all hover:shadow-2xl hover:shadow-purple-500/5 relative overflow-hidden block h-full"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="w-12 h-12 bg-[#6B2D5C] rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-xl shadow-purple-900/20 group-hover:rotate-6 transition-transform shrink-0">
                    {assistant.name[0]}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#198754]/10 text-[#198754] text-[9px] font-bold uppercase tracking-wider">
                    Aktif
                  </div>
                </div>
                
                <h4 className="text-base font-bold mb-1 text-zinc-900 group-hover:text-[#6B2D5C] transition-colors truncate">{assistant.name}</h4>
                <p className="text-zinc-500 text-xs mb-6 line-clamp-2 font-medium">{assistant.description || "Bu asistan için henüz bir açıklama eklenmedi."}</p>
                
                <div className="flex items-center justify-between pt-5 border-t border-zinc-50">
                   <div className="flex gap-4">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">Mesaj</span>
                         <span className="font-bold text-zinc-900 text-xs">{assistant._count.chats}</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">Kaynak</span>
                         <span className="font-bold text-zinc-900 text-xs">{assistant._count.knowledge}</span>
                      </div>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-[#6B2D5C] group-hover:text-white transition-all shadow-sm">
                      <ArrowRight className="w-4 h-4" />
                   </div>
                </div>
              </Link>
            </div>
          ))}
          {assistants.length < 1 && (
             <Link href="/dashboard/new" className="border-2 border-dashed border-zinc-100 rounded-[2.5rem] flex flex-col items-center justify-center p-8 hover:bg-zinc-50 transition-all text-zinc-400 hover:text-zinc-600 gap-4 min-h-[300px] group">
                <div className="w-20 h-20 relative group-hover:scale-110 transition-transform duration-500">
                    <div className="absolute inset-0 bg-purple-200/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img src="/images/robot.png" alt="Robot" className="w-full h-full object-contain relative z-10 grayscale group-hover:grayscale-0 transition-all mix-blend-multiply" />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-sm uppercase tracking-wider text-zinc-900">Henüz Bir Asistanınız Yok</span>
                    <span className="text-[10px] font-medium text-zinc-400">İlk asistanınızı oluşturmak için tıklayın</span>
                </div>
                <div className="p-2 bg-[#6B2D5C] text-white rounded-full shadow-lg shadow-purple-900/20 group-hover:scale-110 transition-transform">
                    <Plus className="w-5 h-5" />
                </div>
             </Link>
          )}
      </div>

      {/* Bottom Sections: Activities, Performance, Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Son Aktiviteler */}
          <div className="bg-white rounded-[2.5rem] border border-zinc-100 p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-extrabold text-zinc-900 uppercase flex items-center gap-2">
                   <Clock className="w-4 h-4 text-blue-500" /> Yakın Zamandaki Aktiviteler
                </h3>
             </div>
             <div className="space-y-6">
                {[
                    { title: "AHMET asistanı güncellendi", time: "13:45 - Kaynak eklendi", type: "success", icon: <CheckCircle2 className="w-4 h-4" />, color: "text-green-500", bgColor: "bg-green-50" },
                    { title: "Yeni konuşma başlatıldı", time: "12:32 - İPEK asistanı", type: "info", icon: <Info className="w-4 h-4" />, color: "text-blue-500", bgColor: "bg-blue-50" },
                    { title: "Kaynak senkronizasyonu", time: "11:20 - 5 kaynak güncellendi", type: "warning", icon: <AlertTriangle className="w-4 h-4" />, color: "text-yellow-500", bgColor: "bg-yellow-50" },
                ].map((act, i) => (
                    <div key={i} className="flex gap-4">
                        <div className={`w-10 h-10 rounded-xl ${act.bgColor} ${act.color} flex items-center justify-center shrink-0`}>
                            {act.icon}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-zinc-900 truncate">{act.title}</p>
                            <p className="text-[10px] text-zinc-400 font-medium">{act.time}</p>
                        </div>
                        <div className="ml-auto">
                            <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${act.bgColor} ${act.color}`}>
                                {act.type === 'success' ? 'Başarılı' : act.type === 'info' ? 'Bilgi' : 'Uyarı'}
                            </span>
                        </div>
                    </div>
                ))}
             </div>
          </div>

          {/* Performans Grafiği */}
          <div className="bg-white rounded-[2.5rem] border border-zinc-100 p-8 shadow-sm lg:col-span-1">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-extrabold text-zinc-900 uppercase flex items-center gap-2">
                   <BarChart3 className="w-4 h-4 text-purple-500" /> Performans Grafiği
                </h3>
                <select className="bg-zinc-50 border border-zinc-100 rounded-lg text-[10px] font-bold px-2 py-1 outline-none">
                    <option>7 Gün</option>
                    <option>30 Gün</option>
                </select>
             </div>
             <PerformanceChart />
          </div>

          {/* Hızlı İşlemler */}
          <div className="bg-white rounded-[2.5rem] border border-zinc-100 p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-extrabold text-zinc-900 uppercase flex items-center gap-2">
                   <Zap className="w-4 h-4 text-yellow-500" /> Hızlı İşlemler
                </h3>
             </div>
             <div className="grid grid-cols-1 gap-3">
                {[
                    { label: "Yeni Asistan Oluştur", icon: <Plus className="w-4 h-4" />, href: "/dashboard/new" },
                    { label: "Analiz Raporları", icon: <BarChart3 className="w-4 h-4" />, href: "#" },
                    { label: "Bildirim Merkezi", icon: <Bell className="w-4 h-4" />, href: "#" },
                    { label: "Ayarlar", icon: <Settings className="w-4 h-4" />, href: "/dashboard/settings" },
                ].map((action, i) => (
                    <Link key={i} href={action.href} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:text-[#6B2D5C] group-hover:border-purple-200 transition-all">
                                {action.icon}
                            </div>
                            <span className="text-xs font-bold text-zinc-600 group-hover:text-zinc-900">{action.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500" />
                    </Link>
                ))}
             </div>
          </div>
      </div>
    </div>
  );
}
