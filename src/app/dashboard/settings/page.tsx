"use client";

import React, { useState, useEffect } from "react";
import { User, Shield, Bell, Palette, Save, Loader2, Mail, BadgeCheck, Settings as SettingsIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setFullName(user?.user_metadata?.full_name || "");
    }
    getUser();
  }, [supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      if (error) throw error;
      toast.success("Profil başarıyla güncellendi.");
    } catch (error: any) {
      toast.error(error.message || "Güncelleme başarısız.");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: "profile", label: "Profil Bilgileri", icon: <User className="w-5 h-5" /> },
    { id: "security", label: "Güvenlik", icon: <Shield className="w-5 h-5" /> },
    { id: "notifications", label: "Bildirimler", icon: <Bell className="w-5 h-5" /> },
    { id: "appearance", label: "Görünüm", icon: <Palette className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
           <SettingsIcon className="w-5 h-5 text-[#D63384]" />
           <span className="text-[10px] font-black text-[#D63384] uppercase tracking-[0.3em]">Platform Yapılandırması</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-zinc-900 uppercase italic leading-none">Ayarlar</h1>
        <p className="text-zinc-500 font-medium mt-2">Hesap bilgilerinizi ve platform tercihlerini buradan yönetin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
           {menuItems.map((item) => (
             <button
               key={item.id}
               className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${item.id === "profile" ? "bg-[#6B2D5C] text-white shadow-xl shadow-purple-900/20" : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"}`}
             >
               {item.icon}
               {item.label}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {/* Profile Section */}
          <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
             <div className="p-8 md:p-10 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-[#6B2D5C] rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <User className="w-6 h-6" />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-zinc-900 uppercase italic">Profil Bilgileri</h3>
                      <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Kişisel detaylarınızı güncelleyin</p>
                   </div>
                </div>
                {user?.email_confirmed_at && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg border border-green-100 text-green-600">
                     <BadgeCheck className="w-4 h-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Onaylı Hesap</span>
                  </div>
                )}
             </div>

             <div className="p-8 md:p-10">
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Tam İsim</label>
                         <div className="relative group">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 group-focus-within:text-[#D63384] transition-colors" />
                            <input 
                              type="text" 
                              placeholder="Adınız Soyadınız"
                              className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl pl-16 pr-6 py-4 text-zinc-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#D63384] transition-all"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">E-posta Adresi</label>
                         <div className="relative opacity-60">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
                            <input 
                              type="email" 
                              disabled
                              className="w-full bg-zinc-100 border border-zinc-200 rounded-2xl pl-16 pr-6 py-4 text-zinc-500 font-bold cursor-not-allowed"
                              value={user?.email || ""}
                            />
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-2 ml-4">E-posta adresi güvenliğiniz için değiştirilemez.</p>
                         </div>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-zinc-50 flex justify-end">
                      <button 
                        disabled={loading}
                        className="bg-[#6B2D5C] text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-purple-900/20 hover:bg-[#522246] transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3 uppercase tracking-widest"
                      >
                         {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Bilgileri Güncelle</>}
                      </button>
                   </div>
                </form>
             </div>
          </div>

          {/* Security Alert Card */}
          <div className="bg-gradient-to-r from-[#D63384]/10 to-transparent p-8 rounded-[2.5rem] border border-[#D63384]/20 flex items-center gap-6">
             <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#D63384] shadow-sm shrink-0">
                <Shield className="w-7 h-7" />
             </div>
             <div>
                <h4 className="text-zinc-900 font-black uppercase italic tracking-tight">Güvenlik Önerisi</h4>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">Hesabınızı daha güvenli tutmak için 2 adımlı doğrulamayı aktif etmenizi öneririz.</p>
             </div>
             <button className="ml-auto px-6 py-3 bg-white border border-zinc-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:bg-zinc-50 transition-all shadow-sm">Aktif Et</button>
          </div>
        </div>
      </div>
    </div>
  );
}
