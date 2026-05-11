import React from "react";
import Link from "next/link";
import { ArrowRight, Bot, Zap, Shield, Globe, MessageSquare, CheckCircle2, ChevronRight, PlayCircle, Star, Sparkles, Layout, Smartphone, Building2, ShoppingBag, HeartPulse, GraduationCap, Gavel, User } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-pink-100 selection:text-pink-900">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#6B2D5C] to-[#D63384] rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-[#6B2D5C]">AI ASİSTAN</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-500">
            <a href="#sektorler" className="hover:text-[#D63384] transition-colors">Sektörler</a>
            <a href="#ozellikler" className="hover:text-[#D63384] transition-colors">Özellikler</a>
            <a href="#nasil-calisir" className="hover:text-[#D63384] transition-colors">Nasıl Çalışır?</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-bold text-zinc-600">Giriş</Link>
            <Link 
              href="/sign-up" 
              className="bg-[#6B2D5C] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#522246] transition-all shadow-xl shadow-purple-900/20"
            >
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-pink-100/40 rounded-full blur-[120px]" />
          <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] bg-yellow-100/40 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 text-xs font-black mb-8 border border-yellow-200">
                <Sparkles className="w-3 h-3" />
                <span>YAPAY ZEKA DEVRİMİ BAŞLADI</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 mb-8 leading-[1.1]">
                İşletmeni AI ile <br />
                <span className="bg-gradient-to-r from-[#6B2D5C] via-[#D63384] to-[#FFC107] bg-clip-text text-transparent italic">
                  Yeniden İnşa Et
                </span>
              </h1>
              
              <p className="max-w-2xl text-lg text-zinc-500 mb-12 font-medium leading-relaxed mx-auto lg:mx-0">
                Verilerini saniyeler içinde AI asistanına dönüştür. Müşterilerine 7/24, 
                uzman bir danışman gibi cevap veren bir asistan oluşturmak hiç bu kadar kolay olmamıştı.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link 
                  href="/dashboard" 
                  className="w-full sm:w-auto px-10 py-5 bg-[#D63384] text-white rounded-2xl font-black text-xl hover:bg-[#c22e77] transition-all shadow-2xl shadow-pink-500/30 flex items-center justify-center gap-2 group"
                >
                  Hemen Oluştur 
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="w-full sm:w-auto px-10 py-5 bg-white text-zinc-900 border-2 border-zinc-100 rounded-2xl font-black text-xl hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 group">
                  <PlayCircle className="w-6 h-6 text-[#198754] group-hover:scale-110 transition-transform" />
                  Demoyu İzle
                </button>
              </div>
            </div>

            {/* Right Side: Mobile Mockup */}
            <div className="flex-1 relative">
               <div className="absolute -inset-4 bg-gradient-to-r from-[#6B2D5C] to-[#198754] rounded-[4rem] blur-2xl opacity-20 animate-pulse" />
               <div className="relative w-[320px] h-[640px] mx-auto bg-black rounded-[3.5rem] border-[12px] border-zinc-900 shadow-2xl overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-zinc-900 rounded-b-3xl z-50" />
                  
                  {/* Chat Interface Inside Phone */}
                  <div className="h-full bg-zinc-50 flex flex-col pt-12">
                     <div className="p-6 border-b bg-white flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#D63384] rounded-full flex items-center justify-center"><Bot className="w-6 h-6 text-white" /></div>
                        <div><div className="font-bold text-sm">AI Asistan</div><div className="text-[10px] text-green-500 font-bold">● ÇEVRİMİÇİ</div></div>
                     </div>
                     <div className="flex-1 p-4 space-y-4">
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-xs border border-zinc-100">Merhaba! Bugün size nasıl yardımcı olabilirim?</div>
                        <div className="bg-[#D63384] p-3 rounded-2xl rounded-br-none shadow-sm text-xs text-white ml-auto max-w-[80%]">Emlak projeleriniz hakkında bilgi almak istiyorum.</div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-xs border border-zinc-100 animate-pulse">Analiz ediyorum...</div>
                     </div>
                     <div className="p-4 bg-white border-t flex gap-2">
                        <div className="flex-1 bg-zinc-100 rounded-full h-10 px-4" />
                        <div className="w-10 h-10 bg-[#D63384] rounded-full flex items-center justify-center text-white"><ArrowRight className="w-4 h-4" /></div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sektörler Bölümü */}
      <section id="sektorler" className="py-32 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-[#6B2D5C] tracking-tighter mb-16 uppercase">Her Sektör İçin Kusursuz Çözüm</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { label: "Gayrimenkul", icon: <Building2 className="w-8 h-8" />, color: "bg-blue-100 text-blue-600" },
              { label: "E-Ticaret", icon: <ShoppingBag className="w-8 h-8" />, color: "bg-pink-100 text-pink-600" },
              { label: "Sağlık", icon: <HeartPulse className="w-8 h-8" />, color: "bg-green-100 text-green-600" },
              { label: "Eğitim", icon: <GraduationCap className="w-8 h-8" />, color: "bg-yellow-100 text-yellow-600" },
              { label: "Hukuk", icon: <Gavel className="w-8 h-8" />, color: "bg-zinc-100 text-zinc-600" },
              { label: "Destek", icon: <MessageSquare className="w-8 h-8" />, color: "bg-purple-100 text-purple-600" },
            ].map((s, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-white border border-zinc-100 hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer">
                <div className={`w-16 h-16 ${s.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {s.icon}
                </div>
                <span className="font-bold text-sm text-[#6B2D5C]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Örnek Kullanıcılar / Senaryolar */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="text-left">
               <h2 className="text-4xl font-black text-[#6B2D5C] tracking-tighter uppercase mb-4 italic">Neler Yapabilirsin?</h2>
               <p className="text-zinc-500 font-medium">Asistanını farklı rollerde kullanabilirsin.</p>
            </div>
            <div className="flex gap-2">
               <div className="w-12 h-1 bg-[#D63384] rounded-full" />
               <div className="w-4 h-1 bg-zinc-200 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                name: "Gayrimenkul Uzmanı", 
                role: "Ahmet Yılmaz", 
                desc: "Projeleri ezberler, müşterilere daire seçeneklerini ve fiyatları 7/24 sunar.",
                tags: ["Katalog Uzmanı", "Randevu"]
              },
              { 
                name: "E-Ticaret Destek", 
                role: "ModaTrend Bot", 
                desc: "İade politikası, kargo takibi ve beden seçimi konularında uzmanlaşmıştır.",
                tags: ["Müşteri Memnuniyeti", "Satış"]
              },
              { 
                name: "Özel Ders Asistanı", 
                role: "Akademi AI", 
                desc: "Öğrencilerin sorularını yanıtlar, ders programlarını yönetir ve kaynak önerir.",
                tags: ["Eğitim", "Analiz"]
              }
            ].map((user, i) => (
              <div key={i} className="p-10 rounded-[3rem] bg-zinc-50 border border-zinc-100 hover:bg-[#6B2D5C] group transition-all duration-500">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:rotate-12 transition-transform">
                  <User className="w-8 h-8 text-[#D63384]" />
                </div>
                <h4 className="text-xl font-black mb-1 group-hover:text-white transition-colors">{user.name}</h4>
                <p className="text-xs font-bold text-[#D63384] mb-4 group-hover:text-pink-300 transition-colors uppercase tracking-widest">{user.role}</p>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8 group-hover:text-zinc-300 transition-colors">{user.desc}</p>
                <div className="flex flex-wrap gap-2">
                   {user.tags.map((t, idx) => (
                     <span key={idx} className="px-3 py-1 rounded-full bg-white text-[10px] font-black uppercase text-[#6B2D5C]">{t}</span>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-[#6B2D5C] to-[#198754] rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-yellow-400 opacity-20 blur-[150px]" />
            <h2 className="text-5xl md:text-7xl font-black mb-12 leading-tight relative z-10">
              Kendi AI Asistanını <br /> Bugün Yayına Al
            </h2>
            <Link 
              href="/sign-up" 
              className="inline-flex items-center gap-4 px-12 py-6 bg-white text-[#6B2D5C] rounded-full font-black text-2xl hover:scale-105 transition-all shadow-2xl relative z-10"
            >
              Hemen Başla
              <ChevronRight className="w-8 h-8" />
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="py-16 bg-white border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#6B2D5C] rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-[#6B2D5C] uppercase">AI ASİSTAN</span>
          </div>
          <p className="text-zinc-400 font-bold text-sm italic">Saniyeler içinde, kendi verilerinle...</p>
          <div className="flex items-center gap-8 text-sm font-black text-[#D63384]">
             <a href="#" className="hover:text-[#198754] transition-colors">YOUTUBE</a>
             <a href="#" className="hover:text-[#198754] transition-colors">LINKEDIN</a>
             <a href="#" className="hover:text-[#198754] transition-colors">TWITTER</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
