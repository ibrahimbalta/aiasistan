"use client";

import React from "react";
import { BarChart3, TrendingUp, Users, Zap, MessageSquare, Activity, ArrowUpRight, Clock, ShieldCheck, Sparkles } from "lucide-react";

export default function AnalyticsPage() {
  const stats = [
    { label: "Toplam Konuşma", value: "1,284", change: "+12.5%", icon: <MessageSquare className="w-6 h-6" />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Kullanılan Token", value: "42.8K", change: "+5.2%", icon: <Zap className="w-6 h-6" />, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Başarı Oranı", value: "%98.2", change: "Sabit", icon: <ShieldCheck className="w-6 h-6" />, color: "text-green-600", bg: "bg-green-50" },
    { label: "Ort. Yanıt Süresi", value: "1.2s", change: "-0.4s", icon: <Clock className="w-6 h-6" />, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <Activity className="w-5 h-5 text-[#D63384]" />
             <span className="text-[10px] font-black text-[#D63384] uppercase tracking-[0.3em]">Performans Takibi</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 uppercase italic leading-none">Analizler</h1>
          <p className="text-zinc-500 font-medium mt-2">Asistanlarınızın performansını ve kullanım verilerini anlık takip edin.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-zinc-100 shadow-sm">
           {["7 Gün", "30 Gün", "90 Gün"].map((t, i) => (
             <button key={t} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${i === 1 ? "bg-[#6B2D5C] text-white shadow-lg" : "text-zinc-400 hover:text-zinc-600"}`}>{t}</button>
           ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} opacity-20 rounded-bl-[4rem] transition-transform group-hover:scale-110`} />
            <div className="flex items-start justify-between mb-6 relative">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-sm`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${stat.change.startsWith("+") ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>
                {stat.change.startsWith("+") && <ArrowUpRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="relative">
              <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</h3>
              <div className="text-3xl font-black text-zinc-900 italic tracking-tighter">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Usage Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-zinc-900 uppercase italic flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-[#D63384]" /> Haftalık Kullanım Yoğunluğu
              </h3>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#D63384]" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Konuşma</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#6B2D5C]" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Token</span>
                 </div>
              </div>
           </div>
           
           <div className="h-[300px] flex items-end justify-between gap-4 px-4">
              {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                   <div className="w-full relative flex flex-col justify-end gap-1 h-full">
                      <div style={{ height: `${h}%` }} className="w-full bg-[#D63384]/10 group-hover:bg-[#D63384]/20 transition-all rounded-t-xl" />
                      <div style={{ height: `${h/1.5}%` }} className="w-full bg-[#6B2D5C] group-hover:scale-y-105 transition-transform rounded-t-xl shadow-lg shadow-purple-900/20" />
                   </div>
                   <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Gün {i+1}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Distribution Chart Placeholder */}
        <div className="bg-[#6B2D5C] p-10 rounded-[3rem] shadow-2xl shadow-purple-900/30 text-white relative overflow-hidden group">
           <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
           <h3 className="text-xl font-black uppercase italic mb-10 flex items-center gap-3 relative">
             <BarChart3 className="w-6 h-6 text-pink-400" /> Sektörel Dağılım
           </h3>
           
           <div className="space-y-8 relative">
              {[
                { name: "E-Ticaret", percent: 45, color: "bg-pink-500" },
                { name: "Gayrimenkul", percent: 30, color: "bg-yellow-400" },
                { name: "Müşteri Hizmetleri", percent: 15, color: "bg-cyan-400" },
                { name: "Diğer", percent: 10, color: "bg-white/20" },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span>{item.name}</span>
                      <span>%{item.percent}</span>
                   </div>
                   <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                      <div style={{ width: `${item.percent}%` }} className={`h-full ${item.color} rounded-full`} />
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-12 p-6 bg-white/5 rounded-[2rem] border border-white/10 flex items-center gap-4">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <p className="text-[10px] font-bold leading-relaxed opacity-80 uppercase tracking-widest">Yapay zeka analizlerine göre e-ticaret sektörü bu hafta %15 büyüme gösterdi.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
