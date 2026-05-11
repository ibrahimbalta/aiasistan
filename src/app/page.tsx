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
  Rocket,
  Search,
  Users,
  Smartphone,
  Cpu,
  ShoppingBag,
  Building2,
  Scale,
  Stethoscope
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sectors = [
    { name: "Gayrimenkul", icon: <Building2 />, desc: "İlanları soran müşterilere 7/24 anlık randevu verir.", color: "bg-blue-50 text-blue-600" },
    { name: "E-Ticaret", icon: <ShoppingBag />, desc: "Sipariş takibi ve ürün önerilerini saniyeler içinde yapar.", color: "bg-orange-50 text-orange-600" },
    { name: "Hukuk", icon: <Scale />, desc: "Dosya durumu ve randevu süreçlerini profesyonelce yönetir.", color: "bg-amber-50 text-amber-600" },
    { name: "Sağlık", icon: <Stethoscope />, desc: "Hasta sorularını yanıtlar ve ön bilgilendirme yapar.", color: "bg-green-50 text-green-600" },
    { name: "Yazılım & SaaS", icon: <Cpu />, desc: "Teknik dökümantasyonu tarar ve anında destek sunar.", color: "bg-purple-50 text-purple-600" },
    { name: "Hizmet Sektörü", icon: <Users />, desc: "Fiyatlandırma ve hizmet detaylarını müşteriye aktarır.", color: "bg-pink-50 text-pink-600" },
  ];

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
            <Link href="/register" className="bg-[#6B2D5C] text-white px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 hover:bg-[#522246] transition-all hover:scale-105">Ücretsiz Başla</Link>
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
            Müşterilerinize 7/24 kesintisiz hizmet veren, verilerinizle eğitilmiş özel yapay zeka asistanınızı saniyeler içinde yayına alın.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto bg-[#D63384] text-white px-10 py-5 rounded-[2rem] text-lg font-black uppercase tracking-widest shadow-2xl shadow-pink-500/30 hover:bg-[#c22e77] transition-all hover:scale-105">Hemen Başlayın</Link>
            <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white border border-zinc-100 rounded-[2rem] text-lg font-black uppercase tracking-widest hover:bg-zinc-50 transition-all">
              <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center"><Play className="w-4 h-4 fill-zinc-900" /></div> Demo İzle
            </button>
          </motion.div>
        </div>
      </section>

      {/* Realistic Mobile Mockup Area */}
      <section className="py-20 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-8 uppercase italic">Müşterilerinizle <br /><span className="text-[#D63384]">Yeni Bir Dilde</span> Konuşun</h2>
              <div className="space-y-6">
                 {[
                   { title: "7/24 Kesintisiz Destek", desc: "Mesai saati kavramını ortadan kaldırın, her an cevap verin." },
                   { title: "Verilerinizle Eğitim", desc: "Web sitenizi veya belgelerinizi tarayarak size özel bilgi havuzu oluşturur." },
                   { title: "Saniyeler İçinde Kurulum", desc: "Kodlama bilmenize gerek yok, tek tıkla sitenize entegre edin." },
                 ].map((f, i) => (
                   <div key={i} className="flex gap-4 p-6 bg-white rounded-3xl border border-zinc-100 shadow-sm">
                      <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#D63384] shrink-0"><CheckCircle2 className="w-6 h-6" /></div>
                      <div>
                         <h4 className="font-black uppercase tracking-widest text-sm mb-1">{f.title}</h4>
                         <p className="text-zinc-500 text-sm font-medium">{f.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="order-1 lg:order-2 flex justify-center relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#6B2D5C]/5 rounded-full blur-[100px] -z-10" />
              <div className="w-[320px] h-[640px] bg-zinc-900 rounded-[3rem] p-4 shadow-2xl relative border-[8px] border-zinc-800">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl z-20" />
                 <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden flex flex-col">
                    <div className="p-6 bg-[#6B2D5C] text-white">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"><Bot className="w-5 h-5" /></div>
                          <div className="font-black uppercase text-xs italic">Emlak Asistanı</div>
                       </div>
                    </div>
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-zinc-50/50">
                       <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-[10px] font-medium border border-zinc-100">Merhaba! Bugün size hangi bölgemizdeki ilanları gösterebilirim?</div>
                       <div className="bg-[#D63384] p-3 rounded-2xl rounded-br-none shadow-md text-[10px] font-medium text-white ml-auto w-fit">Deniz manzaralı daireler var mı?</div>
                       <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-[10px] font-medium border border-zinc-100">Evet, şu an 4 adet deniz manzaralı portföyümüz mevcut. İncelemek ister misiniz?</div>
                    </div>
                    <div className="p-4 border-t border-zinc-100 flex gap-2">
                       <div className="flex-1 h-8 bg-zinc-100 rounded-full" />
                       <div className="w-8 h-8 bg-[#6B2D5C] rounded-full" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Sector Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
             <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-6">Her Sektöre <span className="text-[#D63384]">Tek Çözüm</span></h2>
             <p className="max-w-2xl mx-auto text-zinc-500 font-medium">Asistanlarımız sektörünüzdeki tüm dinamiklere uyum sağlar ve uzmanlık kazanır.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {sectors.map((s, i) => (
               <div key={i} className="p-10 bg-white rounded-[3rem] border border-zinc-100 hover:shadow-2xl transition-all group">
                  <div className={`w-16 h-16 ${s.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                     {React.cloneElement(s.icon as React.ReactElement, { className: "w-8 h-8" })}
                  </div>
                  <h3 className="text-xl font-black uppercase italic mb-4 tracking-tight">{s.name}</h3>
                  <p className="text-zinc-500 font-medium leading-relaxed">{s.desc}</p>
                  <Link href="#" className="inline-flex items-center gap-2 mt-8 text-sm font-black uppercase text-[#D63384] group-hover:gap-4 transition-all">Detayları Gör <ChevronRight className="w-4 h-4" /></Link>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Modern & Professional CTA (The New Redesigned Version) */}
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
                      <Link href="/contact" className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-[2rem] text-lg font-black uppercase tracking-widest hover:bg-white/20 transition-all">Bizi Arayın</Link>
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
                            <div className="font-black text-white text-sm uppercase">Güvenlik</div>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 transform hover:-translate-y-2 transition-transform">
                            <Layers className="w-8 h-8 text-pink-400 mb-4" />
                            <div className="font-black text-white text-sm uppercase">Entegrasyon</div>
                         </div>
                         <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 transform hover:-translate-y-2 transition-transform">
                            <Globe className="w-8 h-8 text-green-400 mb-4" />
                            <div className="font-black text-white text-sm uppercase">Global</div>
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
