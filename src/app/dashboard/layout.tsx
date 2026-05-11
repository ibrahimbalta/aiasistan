import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Bot, 
  Database, 
  BarChart3, 
  Settings, 
  LogOut,
  Sparkles
} from "lucide-react";
import { syncUser } from "@/lib/auth-utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await syncUser();

  const menuItems = [
    { label: "Genel Bakış", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard" },
    { label: "Yeni Asistan", icon: <PlusCircle className="w-5 h-5" />, href: "/dashboard/new" },
    { label: "Asistanlarım", icon: <Bot className="w-5 h-5" />, href: "/dashboard" },
    { label: "Bilgi Havuzu", icon: <Database className="w-5 h-5" />, href: "/dashboard/knowledge" },
    { label: "Analizler", icon: <BarChart3 className="w-5 h-5" />, href: "/dashboard/analytics" },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-zinc-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#6B2D5C] text-white flex flex-col shadow-2xl relative z-20">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12">
              <Bot className="w-6 h-6 text-[#6B2D5C]" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">AI ASİSTAN</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all group"
            >
              <span className="transition-transform group-hover:scale-110">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10 space-y-4">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <Settings className="w-5 h-5" />
            Ayarlar
          </Link>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center font-bold text-xs">
                {user?.name?.[0] || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black truncate uppercase">{user?.name}</p>
                <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 transition-all text-white">
              <LogOut className="w-3 h-3" /> Çıkış Yap
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] relative">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-zinc-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2">
             <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
             <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Yönetim Paneli v2.0</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-wider border border-green-200">
                Sistem Aktif
             </div>
             <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                <User className="w-5 h-5 text-zinc-400" />
             </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function User(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
