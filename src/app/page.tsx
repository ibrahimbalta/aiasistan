import React from "react";
import Link from "next/link";
import { ArrowRight, Bot, Zap, Shield, Globe, MessageSquare, CheckCircle2, ChevronRight, PlayCircle, Star, Sparkles, Layout } from "lucide-react";

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
            <a href="#ozellikler" className="hover:text-[#D63384] transition-colors">Özellikler</a>
            <a href="#nasil-calisir" className="hover:text-[#D63384] transition-colors">Nasıl Çalışır?</a>
            <a href="#fiyatlandirma" className="hover:text-[#D63384] transition-colors">Fiyatlandırma</a>
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
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-pink-100/40 rounded-full blur-[120px]" />
          <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] bg-yellow-100/40 rounded-full blur-[120px]" />
          <div className="absolute bottom-[0%] left-[20%] w-[40%] h-[40%] bg-green-100/30 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 text-xs font-black mb-8 border border-yellow-200">
            <Sparkles className="w-3 h-3" />
            <span>EN GELİŞMİŞ RAG TEKNOLOJİSİ</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 mb-8 leading-[1.1]">
            İşletmeni Yapay Zeka ile <br />
            <span className="bg-gradient-to-r from-[#6B2D5C] via-[#D63384] to-[#FFC107] bg-clip-text text-transparent italic">
              Yeniden İnşa Et
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-zinc-500 mb-12 font-medium leading-relaxed">
            Verilerini saniyeler içinde AI asistanına dönüştür. Pembe kadar canlı, 
            yeşil kadar taze bir müşteri deneyimi sunmaya hazır mısın?
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20">
            <Link 
              href="/dashboard" 
              className="w-full md:w-auto px-10 py-5 bg-[#D63384] text-white rounded-2xl font-black text-xl hover:bg-[#c22e77] transition-all shadow-2xl shadow-pink-500/30 flex items-center justify-center gap-2 group"
            >
              Hemen Dene 
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full md:w-auto px-10 py-5 bg-white text-zinc-900 border-2 border-zinc-100 rounded-2xl font-black text-xl hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
              <PlayCircle className="w-6 h-6 text-[#198754]" />
              Nasıl Çalışır?
            </button>
          </div>

          {/* App Preview Mockup */}
          <div className="relative max-w-5xl mx-auto">
             <div className="absolute -inset-1 bg-gradient-to-r from-[#6B2D5C] via-[#D63384] to-[#198754] rounded-[3rem] blur opacity-10" />
             <div className="relative p-2 bg-white rounded-[2.8rem] border border-zinc-100 shadow-2xl">
                <div className="bg-zinc-50 rounded-[2.2rem] border border-zinc-100 overflow-hidden aspect-[16/8] flex items-center justify-center relative">
                   <div className="absolute top-8 left-8 flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-pink-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                   </div>
                   <div className="flex flex-col items-center gap-6">
                      <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center">
                        <Bot className="w-12 h-12 text-[#6B2D5C]" />
                      </div>
                      <div className="space-y-3">
                        <div className="w-64 h-3 bg-white rounded-full shadow-sm" />
                        <div className="w-40 h-3 bg-white rounded-full shadow-sm mx-auto" />
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features with new colors */}
      <section id="ozellikler" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: "Akıllı Veri Analizi", 
                desc: "Dökümanlarını yükle, asistanın her kelimeyi saniyeler içinde öğrensin.",
                icon: <Zap className="w-6 h-6" />,
                color: "bg-pink-100 text-pink-600",
                borderColor: "border-pink-200"
              },
              { 
                title: "Küresel Erişim", 
                desc: "Dünyanın her yerinden, her dilde müşterilerine cevap ver.",
                icon: <Globe className="w-6 h-6" />,
                color: "bg-green-100 text-green-700",
                borderColor: "border-green-200"
              },
              { 
                title: "Esnek Tasarım", 
                desc: "8 farklı radikal şablon ile asistanının kimliğini sen belirle.",
                icon: <Layout className="w-6 h-6" />,
                color: "bg-yellow-100 text-yellow-700",
                borderColor: "border-yellow-200"
              }
            ].map((f, i) => (
              <div key={i} className={`p-10 rounded-[3rem] bg-white border ${f.borderColor} hover:shadow-2xl transition-all group relative overflow-hidden`}>
                <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h4 className="text-2xl font-black mb-4 text-[#6B2D5C]">{f.title}</h4>
                <p className="text-zinc-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bold CTA Section */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-[#6B2D5C] to-[#198754] rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-yellow-400 opacity-20 blur-[150px]" />
            <h2 className="text-5xl md:text-7xl font-black mb-12 leading-tight relative z-10">
              Yapay Zeka Devrimine <br /> Sen de Katıl
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
          <p className="text-zinc-400 font-bold text-sm">© 2026 GELECEĞİN ASİSTAN PLATFORMU</p>
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
