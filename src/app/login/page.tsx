"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, Mail, Lock, Loader2, ArrowRight, Sparkles, Github, Globe } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Başarıyla giriş yapıldı!");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Giriş başarısız.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFCFD] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#6B2D5C]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#D63384]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Logo Area */}
        <Link href="/" className="flex flex-col items-center gap-4 mb-10 group">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-tr from-[#6B2D5C] to-[#D63384] rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-900/40 group-hover:rotate-6 transition-transform duration-500 relative z-10">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
          </div>
          <div className="text-center">
            <span className="text-2xl font-black uppercase tracking-tighter italic text-[#6B2D5C]">AI ASİSTAN</span>
            <div className="flex items-center gap-2 justify-center mt-1">
               <div className="h-px w-4 bg-zinc-200" />
               <Sparkles className="w-3 h-3 text-yellow-500" />
               <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Yönetim Paneli</span>
               <div className="h-px w-4 bg-zinc-200" />
            </div>
          </div>
        </Link>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 shadow-[0_50px_100px_-20px_rgba(107,45,92,0.15)] border border-white relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50/50 rounded-full blur-3xl -z-10" />
          
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 mb-3 uppercase italic tracking-tight leading-tight">Hoşgeldiniz</h2>
          <p className="text-zinc-500 font-medium mb-10 text-sm sm:text-base">Panelinize erişmek için lütfen giriş yapın.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-5">E-Posta</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 group-focus-within:text-[#D63384] transition-colors" />
                <input 
                  type="email" 
                  required
                  placeholder="adiniz@sirket.com" 
                  className="w-full bg-white border border-zinc-100 rounded-2xl pl-16 pr-6 py-4.5 text-zinc-900 font-bold focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-[#D63384] transition-all placeholder:text-zinc-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-5 mr-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Şifre</label>
                <Link href="#" className="text-[10px] font-black text-[#D63384] uppercase tracking-widest hover:underline">Unuttum?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 group-focus-within:text-[#D63384] transition-colors" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="w-full bg-white border border-zinc-100 rounded-2xl pl-16 pr-6 py-4.5 text-zinc-900 font-bold focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-[#D63384] transition-all placeholder:text-zinc-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#6B2D5C] to-[#853974] text-white py-5 rounded-2xl sm:rounded-[2rem] font-black text-base sm:text-lg shadow-xl shadow-purple-900/20 hover:shadow-purple-900/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Giriş Yap <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-10">
            <div className="relative mb-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100"></div></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-white px-4 text-zinc-400">Veya Bunlarla Devam Et</span></div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              className="w-full py-4 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest text-zinc-600 hover:bg-zinc-50 transition-all shadow-sm"
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale group-hover:grayscale-0" alt="Google" />
              Google ile Devam Et
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center mt-10 text-sm font-bold text-zinc-400 uppercase tracking-widest">
          Henüz hesabın yok mu? <Link href="/register" className="text-[#D63384] hover:underline">Ücretsiz Hesap Aç</Link>
        </p>
      </div>
    </div>
  );
}
