import React from "react";
import Link from "next/link";
import { ArrowRight, Bot, Zap, Globe, Shield, MessageSquare } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-morphism border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Bot className="text-black w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">AI Asistan</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">Özellikler</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">Nasıl Çalışır?</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Fiyatlandırma</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium hover:text-zinc-300 transition-colors">Giriş Yap</Link>
            <Link 
              href="/sign-up" 
              className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-all active:scale-95"
            >
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full hero-gradient pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Yeni: Llama 3.3 70B ile Güçlendirildi
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-gradient">
            Kendi Yapay Zeka <br /> Asistanını Dakikalar İçinde Kur
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed">
            Kod yazmadan, kendi verilerinle eğitilmiş özel bir AI asistanı oluştur. 
            Web sitene ekle, WhatsApp'a bağla veya özel linkinle paylaş.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/sign-up" 
              className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group"
            >
              Hemen Oluştur
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#demo" 
              className="w-full sm:w-auto glass-morphism px-8 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-all"
            >
              Demoyu Gör
            </Link>
          </div>

          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full" />
            <div className="relative glass-morphism rounded-2xl border border-white/10 p-2 shadow-2xl">
              <div className="bg-zinc-900 rounded-xl aspect-[16/9] flex items-center justify-center overflow-hidden">
                <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500/50" />
                     <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                     <div className="w-3 h-3 rounded-full bg-green-500/50" />
                   </div>
                   <div className="text-zinc-500 font-mono text-sm">Dashboard Önizlemesi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Her Şey Dahil AI Çözümü</h2>
            <p className="text-zinc-400">Teknik bilgiye gerek duymadan profesyonel asistanlar oluşturun.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6 text-yellow-500" />,
                title: "Işık Hızında Yanıtlar",
                desc: "Groq Llama 3.3 altyapısı ile asistanınız soruları milisaniyeler içinde cevaplar."
              },
              {
                icon: <Shield className="w-6 h-6 text-blue-500" />,
                title: "Güvenli Knowledge Base",
                desc: "PDF, TXT veya Web linklerinizi yükleyin. Verileriniz size özel kalsın."
              },
              {
                icon: <Globe className="w-6 h-6 text-green-500" />,
                title: "Kolay Entegrasyon",
                desc: "Tek bir script koduyla web sitenize ekleyin veya WhatsApp'a bağlayın."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl glass-morphism border border-white/5 hover:border-white/10 transition-colors">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="glass-morphism rounded-3xl p-12 text-center border border-white/10 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 -z-10" />
             <h2 className="text-4xl font-bold mb-6">Geleceğin Asistanını Bugün İnşa Et</h2>
             <p className="text-zinc-400 mb-10 max-w-xl mx-auto">
               Kendi verilerinle çalışan, 7/24 hizmet veren yapay zeka asistanın için ilk adımı at.
             </p>
             <Link 
              href="/sign-up" 
              className="inline-flex items-center gap-2 bg-white text-black px-10 py-5 rounded-full text-xl font-bold hover:bg-zinc-200 transition-all active:scale-95"
            >
              Ücretsiz Başla
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center text-zinc-500 text-sm">
        <p>© 2026 AI Asistan. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}
