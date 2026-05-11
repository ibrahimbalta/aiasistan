import React from "react";
import { Users, Bot, MessageSquare, ShieldCheck, TrendingUp, AlertCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  // Not: Gerçek verileri çekmek için:
  // const usersCount = await prisma.user.count();
  // const assistantsCount = await prisma.assistant.count();
  
  const stats = [
    { label: "Toplam Kullanıcı", value: "1", icon: <Users className="w-5 h-5 text-blue-500" /> },
    { label: "Aktif Asistanlar", value: "0", icon: <Bot className="w-5 h-5 text-green-500" /> },
    { label: "Toplam Mesaj", value: "0", icon: <MessageSquare className="w-5 h-5 text-purple-500" /> },
    { label: "Sistem Sağlığı", value: "99.9%", icon: <ShieldCheck className="w-5 h-5 text-emerald-500" /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ShieldCheck className="text-blue-500" />
              Sistem Yönetimi
            </h1>
            <p className="text-zinc-500 mt-1">Platform genelindeki tüm aktiviteleri buradan izleyebilirsiniz.</p>
          </div>
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Canlı Sistem Durumu
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl glass-morphism border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  {stat.icon}
                </div>
                <TrendingUp className="w-4 h-4 text-zinc-600" />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Users */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Son Kayıt Olanlar</h3>
              <button className="text-sm text-blue-500 hover:underline">Tümünü Gör</button>
            </div>
            <div className="glass-morphism rounded-2xl border border-white/5 overflow-hidden">
               <table className="w-full text-left text-sm">
                 <thead className="bg-white/5 text-zinc-400 uppercase text-[10px] tracking-wider">
                   <tr>
                     <th className="px-6 py-4">Kullanıcı</th>
                     <th className="px-6 py-4">E-posta</th>
                     <th className="px-6 py-4">Kayıt Tarihi</th>
                     <th className="px-6 py-4">Durum</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   <tr className="hover:bg-white/5 transition-colors">
                     <td className="px-6 py-4 font-medium">Demo Kullanıcı</td>
                     <td className="px-6 py-4 text-zinc-400">demo@example.com</td>
                     <td className="px-6 py-4 text-zinc-400">11.05.2026</td>
                     <td className="px-6 py-4">
                       <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold">AKTİF</span>
                     </td>
                   </tr>
                 </tbody>
               </table>
            </div>
          </div>

          {/* System Alerts */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Sistem Uyarıları</h3>
            <div className="space-y-3">
              {[
                { title: "API Limit Uyarısı", desc: "Groq API kullanımı %80'e ulaştı.", type: "warning" },
                { title: "Veritabanı Bakımı", desc: "Bu gece 02:00'de planlı bakım var.", type: "info" }
              ].map((alert, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex gap-3">
                  <AlertCircle className={`w-5 h-5 shrink-0 ${alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`} />
                  <div>
                    <div className="font-bold text-sm">{alert.title}</div>
                    <div className="text-xs text-zinc-500 mt-1">{alert.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
