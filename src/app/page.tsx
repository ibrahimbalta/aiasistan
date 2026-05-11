import React from "react";
import Link from "next/link";
import { ArrowRight, Bot, Zap, Shield, Globe, MessageSquare, CheckCircle2, ChevronRight, PlayCircle, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] bg-white/70 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-zinc-900">AI ASİSTAN</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <a href="#ozellikler" className="hover:text-blue-600 transition-colors">Özellikler</a>
            <a href="#nasil-calisir" className="hover:text-blue-600 transition-colors">Nasıl Çalışır?</a>
            <a href="#fiyatlandirma" className="hover:text-blue-600 transition-colors">Fiyatlandırma</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-bold text-zinc-600 hover:text-zinc-900 transition-colors">Giriş Yap</Link>
            <Link 
              href="/sign-up" 
              className="bg-zinc-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
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
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-8 animate-bounce">
            <Zap className="w-3 h-3" />
            <span>YENİ: LLama 3.3 70B ile Güçlendirildi</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 mb-8 leading-[1.1]">
            Kendi Yapay Zeka <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Asistanını Saniyeler İçinde Kur
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-zinc-500 mb-12 leading-relaxed">
            Kod yazmadan, kendi verilerinle eğitilmiş özel bir AI asistanı oluştur. 
            Web sitene ekle, müşterilerine 7/24 kesintisiz destek sun.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20">
            <Link 
              href="/dashboard" 
              className="w-full md:w-auto px-8 py-4 bg-zinc-900 text-white rounded-full font-bold text-lg hover:bg-zinc-800 transition-all shadow-2xl shadow-zinc-200 flex items-center justify-center gap-2 group"
            >
              Hemen Oluştur 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full md:w-auto px-8 py-4 bg-white text-zinc-900 border border-zinc-200 rounded-full font-bold text-lg hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
              <PlayCircle className="w-5 h-5" />
              Demoyu İzle
            </button>
          </div>

          {/* App Preview */}
          <div className="relative max-w-5xl mx-auto">
             <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
             <div className="p-4 bg-zinc-100/50 rounded-[2.5rem] border border-zinc-200 shadow-2xl">
                <div className="bg-white rounded-[1.8rem] border border-zinc-200 overflow-hidden shadow-inner aspect-[16/9] flex items-center justify-center">
                   <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center">
                        <Bot className="w-10 h-10 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="w-48 h-3 bg-zinc-100 rounded-full" />
                        <div className="w-32 h-3 bg-zinc-100 rounded-full mx-auto" />
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 border-y border-zinc-100 bg-zinc-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-zinc-400 mb-8">GÜVENEN MARKALAR</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale">
            <span className="text-2xl font-black">SaaSFlow</span>
            <span className="text-2xl font-black">AI-Tech</span>
            <span className="text-2xl font-black">FutureSoft</span>
            <span className="text-2xl font-black">CloudNexus</span>
            <span className="text-2xl font-black">GlobalAI</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="ozellikler" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4">ÖZELLİKLER</h2>
            <p className="text-4xl font-bold text-zinc-900 tracking-tight">
              Müşteri deneyimini yapay zeka ile <br /> yeniden tanımlayın.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Kendi Verilerinle Eğit", 
                desc: "PDF, TXT veya Web sitesi linki vererek asistanını dilediğin bilgiyle donat.",
                icon: <Zap className="w-6 h-6 text-orange-500" /> 
              },
              { 
                title: "7/24 Kesintisiz Destek", 
                desc: "Asistanın hiç uyumaz, müşterilerine saniyeler içinde doğru yanıtlar verir.",
                icon: <Globe className="w-6 h-6 text-blue-500" /> 
              },
              { 
                title: "Kolay Entegrasyon", 
                desc: "Tek satır kodla web sitene ekle veya WhatsApp hattına bağla.",
                icon: <Shield className="w-6 h-6 text-green-500" /> 
              }
            ].map((f, i) => (
              <div key={i} className="p-10 rounded-[2rem] bg-zinc-50 border border-zinc-100 hover:bg-white hover:shadow-2xl hover:shadow-zinc-200 transition-all group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h4 className="text-xl font-bold mb-4 text-zinc-900">{f.title}</h4>
                <p className="text-zinc-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight relative z-10">
              Geleceği Bugün <br /> İnşa Etmeye Başla
            </h2>
            <p className="text-blue-100 text-lg mb-12 max-w-xl mx-auto relative z-10">
              Ücretsiz hesabını oluştur ve ilk yapay zeka asistanını 5 dakika içinde yayına al.
            </p>
            <Link 
              href="/sign-up" 
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-600 rounded-full font-black text-xl hover:bg-blue-50 transition-all shadow-xl relative z-10"
            >
              Hemen Başla
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-100 bg-zinc-50/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-zinc-900 uppercase">AI ASİSTAN</span>
          </div>
          <p className="text-zinc-400 text-sm">© 2026 AI Asistan Platformu. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6 text-sm font-medium text-zinc-500">
             <a href="#" className="hover:text-zinc-900 transition-colors">Twitter</a>
             <a href="#" className="hover:text-zinc-900 transition-colors">LinkedIn</a>
             <a href="#" className="hover:text-zinc-900 transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
