import React from "react";
import { syncUser } from "@/lib/auth-utils";
import { User, Mail, Shield, Bell, Palette, Globe, Save, Loader2 } from "lucide-react";

export default async function SettingsPage() {
  const user = await syncUser();

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Ayarlar</h1>
        <p className="text-zinc-400">Hesap ayarlarınızı ve platform tercihlerini buradan yönetin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          {[
            { id: "profile", label: "Profil Bilgileri", icon: <User className="w-4 h-4" /> },
            { id: "security", label: "Güvenlik", icon: <Shield className="w-4 h-4" /> },
            { id: "notifications", label: "Bildirimler", icon: <Bell className="w-4 h-4" /> },
            { id: "appearance", label: "Görünüm", icon: <Palette className="w-4 h-4" /> },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.id === "profile" ? "bg-white/10 text-white" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="p-8 rounded-2xl glass-morphism border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" /> Profil Bilgileri
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Tam İsim</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input 
                    type="text" 
                    defaultValue={user?.name || ""}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">E-posta Adresi</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input 
                    type="email" 
                    disabled
                    defaultValue={user?.email || ""}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-zinc-500 cursor-not-allowed"
                  />
                </div>
                <p className="mt-2 text-[10px] text-zinc-600">E-posta adresi güvenliğiniz için değiştirilemez.</p>
              </div>

              <div className="pt-4">
                 <button className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all">
                    <Save className="w-4 h-4" />
                    Bilgileri Güncelle
                 </button>
              </div>
            </div>
          </div>

          {/* Security Card Placeholder */}
          <div className="p-8 rounded-2xl glass-morphism border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" /> Güvenlik
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Hesabınız Supabase Auth ile korunmaktadır. Şifre yenileme talebi göndererek hesabınızı güvence altına alabilirsiniz.
            </p>
            <button className="text-white border border-white/10 px-6 py-3 rounded-xl text-sm font-bold hover:bg-white/5 transition-all">
              Şifre Yenileme Bağlantısı Gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
