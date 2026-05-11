import React from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, PlusCircle, Settings, MessageSquare, Database, BarChart3, Bot } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Bot className="text-black w-5 h-5" />
          </div>
          <span className="font-bold text-lg">AI Asistan</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            Genel Bakış
          </Link>
          <Link 
            href="/dashboard/new" 
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 text-white transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Yeni Asistan
          </Link>
          <Link 
            href="/dashboard/assistants" 
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            Asistanlarım
          </Link>
          <Link 
            href="/dashboard/knowledge" 
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
          >
            <Database className="w-5 h-5" />
            Bilgi Havuzu
          </Link>
          <Link 
            href="/dashboard/analytics" 
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            Analizler
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link 
            href="/dashboard/settings" 
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
            Ayarlar
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-400 text-sm">Dashboard / Genel Bakış</h2>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
