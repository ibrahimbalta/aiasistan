"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Bot, 
  Zap, 
  Globe, 
  MessageSquare, 
  Shield, 
  BarChart, 
  ChevronRight, 
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Play,
  Layers,
  Rocket
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFD] text-zinc-900 selection:bg-pink-100 selection:text-[#D63384]">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-zinc-100 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-[#6B2D5C] rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/20 group-hover:rotate-6 transition-transform">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black uppercase tracking-tighter italic text-[#6B2D5C]">AI ASİSTAN</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {["Sektörler", "Özellikler", "Nasıl Çalışır?", "Fiyatlandırma"].map((item) => (
              <Link key={item} href="#" className="text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-[#D63384] transition-colors">{item}</Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-black uppercase tracking-widest text-[#6B2D5C] px-6 py-3 hover:bg-zinc-50 rounded-2xl transition-all">Giriş</Link>
            <Link href="/register" className="bg-[#6B2D5C] text-white px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 hover:bg-[#522246] transition-all hover:scale-105 active:scale-95">Ücretsiz Başla</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[1000px] bg-gradient-to-b from-purple-50/50 to-transparent rounded-[100%] blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-6 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-yellow-600" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-yellow-700">Yapay Zeka Devrimi Başladı</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
            İşletmeni AI ile<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B2D5C] via-[#D63384] to-orange-400 italic pr-4">Yeniden İnşa Et</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-2xl mx-auto text-xl text-zinc-500 font-medium leading-relaxed mb-12">
            Müşterilerinize 7/24 kesintisiz hizmet veren, verilerinizle eğitilmiş özel yapay zeka asistanınızı 2 dakikada yayına alın.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto bg-[#D63384] text-white px-10 py-5 rounded-[2rem] text-lg font-black uppercase tracking-widest shadow-2xl shadow-pink-500/30 hover:bg-[#c22e77] transition-all hover:scale-105">Hemen Başlayın</Link>
            <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white border border-zinc-100 rounded-[2rem] text-lg font-black uppercase tracking-widest hover:bg-zinc-50 transition-all">
              <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center"><Play className="w-4 h-4 fill-zinc-900" /></div> Demo İzle
            </button>
          </motion.div>
        </div>

        {/* Realistic Mockup Area */}
        <div className="max-w-6xl mx-auto mt-24 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCFD] via-transparent to-transparent z-10 h-32 bottom-0" />
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }} className="relative bg-white rounded-t-[4rem] border-x border-t border-zinc-100 shadow-[0_-20px_80px_rgba(0,0,0,0.05)] overflow-hidden">
             <div className="h-16 bg-zinc-50/50 border-b border-zinc-100 flex items-center px-8 gap-2">
                <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-zinc-200" />
                   <div className="w-3 h-3 rounded-full bg-zinc-200" />
                   <div className="w-3 h-3 rounded-full bg-zinc-200" />
                </div>
             </div>
             <div className="aspect-video bg-zinc-50 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                   <div className="w-[500px] h-[500px] bg-[#D63384] rounded-full blur-[120px]" />
                </div>
                {/* Simulated Chat Widget */}
                <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-8 border border-zinc-100 animate-in zoom-in duration-1000">
                   <div className="flex items-center gap-4 mb-8 pb-6 border-b border-zinc-50">
                      <div className="w-12 h-12 bg-[#6B2D5C] rounded-2xl flex items-center justify-center"><Bot className="w-6 h-6 text-white" /></div>
                      <div>
                         <div className="font-black uppercase italic tracking-tighter">AI ASİSTAN</div>
                         <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /><span className="text-[10px] font-black uppercase text-zinc-400">Çevrimiçi</span></div>
                      </div>
                   </div>
                   <div className="space-y-4 mb-8">
                      <div className="bg-zinc-50 p-4 rounded-[1.5rem] rounded-tl-none text-sm font-medium text-zinc-600">Merhaba! Size nasıl yardımcı olabilirim?</div>
                      <div className="bg-[#D63384] p-4 rounded-[1.5rem] rounded-br-none text-sm font-medium text-white ml-auto w-fit">Emlak projeleriniz hakkında bilgi alabilir miyim?</div>
                      <div className="bg-zinc-50 p-4 rounded-[1.5rem] rounded-tl-none text-sm font-medium text-zinc-600 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Yazıyor...</div>
                   </div>
                   <div className="h-12 bg-zinc-50 rounded-2xl border border-zinc-100" />
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-10 italic">2500+ İşletme Tarafından Tercih Ediliyor</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale group hover:grayscale-0 transition-all">
             <span className="text-3xl font-black italic tracking-tighter">TECHSTAR</span>
             <span className="text-3xl font-black italic tracking-tighter">GLOBEX</span>
             <span className="text-3xl font-black italic tracking-tighter">QUANTUM</span>
             <span className="text-3xl font-black italic tracking-tighter">NEXUS</span>
             <span className="text-3xl font-black italic tracking-tighter">VANTAGE</span>
          </div>
        </div>
      </section>

      {/* Better CTA Section (Redesigned) */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative bg-gradient-to-br from-[#6B2D5C] via-[#853974] to-[#D63384] rounded-[4rem] p-12 md:p-24 overflow-hidden shadow-[0_50px_100px_-20px_rgba(107,45,92,0.4)]">
             <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
             <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px]" />
             <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-pink-400/20 rounded-full blur-[80px]" />
             
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 text-center md:text-left">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20">
                      <Rocket className="w-4 h-4 text-pink-300" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Hızla Başlayın</span>
                   </div>
                   <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-8">
                      Kendi AI Asistanını <br className="hidden md:block" />
                      <span className="italic text-pink-300">Bugün Yayına Al</span>
                   </h2>
                   <p className="text-white/70 text-lg font-medium mb-10 max-w-xl">
                      Kod yazmanıza gerek yok. Verilerinizi yükleyin, asistanınızı özelleştirin ve hemen müşterilerinizle buluşturun.
                   </p>
                   <div className="flex flex-col sm:flex-row items-center gap-4">
                      <Link href="/register" className="w-full sm:w-auto bg-white text-[#6B2D5C] px-10 py-5 rounded-[2rem] text-lg font-black uppercase tracking-widest hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95 shadow-2xl">Ücretsiz Başla</Link>
                      <Link href="/contact" className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-[2rem] text-lg font-black uppercase tracking-widest hover:bg-white/20 transition-all">Satış Ekibiyle Görüş</Link>
                   </div>
                </div>
                
                <div className="flex-1 relative hidden lg:block">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4 translate-y-8">
                         <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 transform hover:-translate-y-2 transition-transform">
                            <Zap className="w-8 h-8 text-yellow-400 mb-4" />
                            <div className="font-black text-white text-sm uppercase">Işık Hızı</div>
                         </div>
                         <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 transform hover:-translate-y-2 transition-transform">
                            <Shield className="w-8 h-8 text-cyan-400 mb-4" />
                            <div className="font-black text-white text-sm uppercase">Tam Güvenlik</div>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 transform hover:-translate-y-2 transition-transform">
                            <Layers className="w-8 h-8 text-pink-400 mb-4" />
                            <div className="font-black text-white text-sm uppercase">Kolay Entegrasyon</div>
                         </div>
                         <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 transform hover:-translate-y-2 transition-transform">
                            <Globe className="w-8 h-8 text-green-400 mb-4" />
                            <div className="font-black text-white text-sm uppercase">Global Erişim</div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-20 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#6B2D5C] rounded-xl flex items-center justify-center shadow-lg"><Bot className="w-6 h-6 text-white" /></div>
                <span className="text-xl font-black uppercase tracking-tighter italic text-[#6B2D5C]">AI ASİSTAN</span>
              </div>
              <p className="max-w-sm text-zinc-500 font-medium leading-relaxed mb-8">
                İşletmenizi yapay zeka ile dönüştürün. Müşteri deneyimini yeniden tanımlayın ve verimliliği artırın.
              </p>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-sm mb-8 italic">Platform</h4>
              <ul className="space-y-4 text-sm font-bold text-zinc-400">
                <li><Link href="#" className="hover:text-[#D63384] transition-colors">Özellikler</Link></li>
                <li><Link href="#" className="hover:text-[#D63384] transition-colors">Sektörler</Link></li>
                <li><Link href="#" className="hover:text-[#D63384] transition-colors">Fiyatlandırma</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-sm mb-8 italic">Şirket</h4>
              <ul className="space-y-4 text-sm font-bold text-zinc-400">
                <li><Link href="#" className="hover:text-[#D63384] transition-colors">Hakkımızda</Link></li>
                <li><Link href="#" className="hover:text-[#D63384] transition-colors">İletişim</Link></li>
                <li><Link href="#" className="hover:text-[#D63384] transition-colors">Destek</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">© 2026 AI ASİSTAN. Tüm Hakları Saklıdır.</p>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">
              <Link href="#" className="hover:text-zinc-600">Gizlilik Politikası</Link>
              <Link href="#" className="hover:text-zinc-600">Kullanım Şartları</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Loader2(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
  );
}
