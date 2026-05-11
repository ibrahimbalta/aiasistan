import React from "react";
import Link from "next/link";
import { Plus, MessageSquare, Users, Zap, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Hoş Geldiniz</h1>
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
          { label: "Aktif Asistanlar", value: "0", icon: <MessageSquare className="w-4 h-4 text-blue-500" />, trend: "+0%" },
          { label: "Toplam Konuşma", value: "0", icon: <Users className="w-4 h-4 text-green-500" />, trend: "+0%" },
          { label: "AI Yanıtları", value: "0", icon: <Zap className="w-4 h-4 text-yellow-500" />, trend: "+0%" },
          { label: "Kullanılan Token", value: "0", icon: <ArrowUpRight className="w-4 h-4 text-zinc-500" />, trend: "+0%" },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-xl glass-morphism border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">{stat.icon}</div>
              <span className="text-xs font-medium text-green-500">{stat.trend}</span>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Assistants Section */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-6">Son Oluşturulanlar</h3>
        <div className="p-12 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
             <Plus className="w-8 h-8 text-zinc-500" />
          </div>
          <h4 className="text-lg font-semibold mb-2">Henüz bir asistanınız yok</h4>
          <p className="text-zinc-500 text-sm mb-6 max-w-xs">
            İlk yapay zeka asistanınızı oluşturarak müşterilerinizle otomatik konuşmaya başlayın.
          </p>
          <Link 
            href="/dashboard/new" 
            className="text-white border border-white/10 px-6 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
          >
            İlk Asistanımı Oluştur
          </Link>
        </div>
      </div>
    </div>
  );
}
