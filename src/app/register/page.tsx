"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, Mail, Lock, User, Loader2, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) throw error;
      toast.success("Hesabınız oluşturuldu! E-postanızı kontrol edin.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Kayıt başarısız.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFD] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#6B2D5C]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#D63384]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side: Info */}
        <div className="hidden lg:block space-y-12 pr-12">
           <Link href="/" className="flex items-center gap-4 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-tr from-[#6B2D5C] to-[#D63384] rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform relative z-10">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition-opacity" />
              </div>
              <span className="text-xl font-black uppercase tracking-tighter italic text-[#6B2D5C]">AI ASİSTAN</span>
           </Link>
           <h1 className="text-5xl font-black text-zinc-900 leading-tight uppercase italic">İşletmenizi <br /><span className="text-[#D63384]">Yapay Zeka</span> İle Güçlendirin</h1>
           <div className="space-y-6">
              {[
                "7/24 Müşteri Desteği",
                "Özel Veri Eğitimi",
                "Tek Tıkla Entegrasyon",
                "Detaylı Analizler"
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-4">
                   <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-[#D63384]"><CheckCircle2 className="w-4 h-4" /></div>
                   <span className="text-sm font-black uppercase tracking-widest text-zinc-500">{t}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Right Side: Register Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 shadow-[0_50px_100px_-20px_rgba(107,45,92,0.15)] border border-white relative overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50/50 rounded-full blur-3xl -z-10" />
          
          <div className="mb-10 lg:hidden text-center">
             <Link href="/" className="inline-flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-tr from-[#6B2D5C] to-[#D63384] rounded-xl flex items-center justify-center"><Bot className="w-6 h-6 text-white" /></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl blur opacity-20" />
                </div>
                <span className="text-lg font-black uppercase italic text-[#6B2D5C]">AI ASİSTAN</span>
             </Link>
          </div>
          
          <h2 className="text-3xl font-black text-zinc-900 mb-3 uppercase italic tracking-tight leading-tight">Kaydolun</h2>
          <p className="text-zinc-500 font-medium mb-10 text-sm">Hızlıca hesabınızı oluşturup asistanınızı kurun.</p>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-5">Ad Soyad</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 group-focus-within:text-[#D63384] transition-colors" />
                <input 
                  type="text" 
                  required
                  placeholder="Ahmet Yılmaz" 
                  className="w-full bg-white border border-zinc-100 rounded-2xl pl-16 pr-6 py-4.5 text-zinc-900 font-bold focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-[#D63384] transition-all placeholder:text-zinc-300"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-5">E-Posta</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 group-focus-within:text-[#D63384] transition-colors" />
                <input 
                  type="email" 
                  required
                  placeholder="ahmet@sirket.com" 
                  className="w-full bg-white border border-zinc-100 rounded-2xl pl-16 pr-6 py-4.5 text-zinc-900 font-bold focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-[#D63384] transition-all placeholder:text-zinc-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-5">Şifre</label>
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
              className="w-full bg-gradient-to-r from-[#D63384] to-pink-500 text-white py-5 rounded-2xl sm:rounded-[2rem] font-black text-base sm:text-lg shadow-xl shadow-pink-500/20 hover:shadow-pink-500/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Hesabımı Oluştur <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>

          <p className="text-center mt-10 text-sm font-bold text-zinc-400 uppercase tracking-widest">
            Zaten hesabın var mı? <Link href="/login" className="text-[#6B2D5C] hover:underline">Giriş Yap</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
