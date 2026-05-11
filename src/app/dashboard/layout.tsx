"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Bot, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  Sparkles,
  ChevronRight,
  User
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, [supabase]);

  const menuItems = [
    { label: "Genel Bakış", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard" },
    { label: "Yeni Asistan", icon: <PlusCircle className="w-5 h-5" />, href: "/dashboard/new" },
    { label: "Asistanlarım", icon: <Bot className="w-5 h-5" />, href: "/dashboard/assistants" },
    { label: "Bilgi Havuzu", icon: <FileText className="w-5 h-5" />, href: "/dashboard/knowledge" },
    { label: "Analizler", icon: <BarChart3 className="w-5 h-5" />, href: "/dashboard/analytics" },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex h-screen bg-[#FDFCFD]">
      {/* Sidebar */}
      <aside className="w-80 bg-[#6B2D5C] text-white flex flex-col p-8 shrink-0 relative overflow-hidden shadow-[10px_0_50px_rgba(107,45,92,0.1)]">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-4 mb-12 relative z-10 group">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
            <Bot className="w-7 h-7 text-[#6B2D5C]" />
          </div>
          <span className="text-2xl font-black uppercase tracking-tighter italic">AI ASİSTAN</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 relative z-10">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? "bg-white text-[#6B2D5C] shadow-xl shadow-black/10 font-black italic scale-[1.02]" 
                    : "text-white/60 hover:text-white hover:bg-white/5 font-bold"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`${isActive ? "text-[#D63384]" : "text-inherit"} transition-colors`}>
                    {item.icon}
                  </div>
                  <span className="uppercase tracking-widest text-[11px]">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 animate-in slide-in-from-left-2" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Settings & User */}
        <div className="mt-auto space-y-6 relative z-10">
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
              pathname === "/dashboard/settings" 
                ? "bg-white text-[#6B2D5C] font-black italic" 
                : "text-white/60 hover:text-white hover:bg-white/5 font-bold"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="uppercase tracking-widest text-[11px]">Ayarlar</span>
          </Link>

          <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-sm">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-pink-500 flex items-center justify-center font-black text-white shadow-lg">
                   {user?.email?.[0].toUpperCase() || "A"}
                </div>
                <div className="flex flex-col min-w-0">
                   <span className="text-sm font-black uppercase tracking-tighter truncate">{user?.email?.split('@')[0] || "Kullanıcı"}</span>
                   <span className="text-[10px] text-white/40 font-bold truncate opacity-60 italic">{user?.email}</span>
                </div>
             </div>
             <button 
               onClick={handleSignOut}
               className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group"
             >
                <LogOut className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> ÇIKIŞ YAP
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <header className="h-24 border-b border-zinc-100 flex items-center justify-between px-10 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-50">
           <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">YÖNETİM PANELİ V2.0</span>
           </div>
           <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">SİSTEM AKTİF</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400">
                 <User className="w-5 h-5" />
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-[#FDFCFD]">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
