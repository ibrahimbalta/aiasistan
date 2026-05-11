"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createAssistant } from "@/actions/assistant-actions";
import { toast } from "react-hot-toast";
import { Bot, ChevronRight, ChevronLeft, Sparkles, MessageSquare, Database, Settings, Loader2 } from "lucide-react";

export default function NewAssistantPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    personality: "",
  });

  const handleCreate = async () => {
    if (!formData.name) return toast.error("Lütfen asistanınıza bir isim verin.");
    setLoading(true);
    const result = await createAssistant(formData);
    if (result.success) {
      toast.success("Asistan başarıyla oluşturuldu!");
      router.push(`/dashboard/${result.assistant.id}`);
    } else {
      toast.error("Bir hata oluştu.");
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, label: "Temel Bilgiler", icon: <MessageSquare className="w-5 h-5" /> },
    { id: 2, label: "Karakter & Tavır", icon: <Bot className="w-5 h-5" /> },
    { id: 3, label: "Onay ve Kurulum", icon: <Sparkles className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase italic mb-4">Yeni Asistan Oluştur</h1>
        <p className="text-zinc-500 font-medium">Asistanınızın kimliğini belirleyin ve onu hayata döndürün.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-20">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                step >= s.id ? "bg-[#D63384] text-white shadow-xl shadow-pink-500/20" : "bg-white text-zinc-300 border border-zinc-100"
              }`}>
                {s.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s.id ? "text-[#D63384]" : "text-zinc-300"}`}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-20 h-0.5 rounded-full transition-all duration-500 ${step > s.id ? "bg-[#D63384]" : "bg-zinc-100"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-2xl p-10 md:p-16 transition-all min-h-[400px] flex flex-col justify-between">
        
        {step === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right-4">
             <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-pink-50 rounded-2xl text-[#D63384]"><MessageSquare className="w-6 h-6" /></div>
                <h3 className="text-2xl font-black text-zinc-900 uppercase italic">Asistanın Kim Olacak?</h3>
             </div>
             <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Asistan Adı</label>
                <input 
                  type="text" 
                  placeholder="Örn: Müşteri Destek Botu"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-8 py-5 text-zinc-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#D63384] transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Kısa Açıklama (İsteğe Bağlı)</label>
                <input 
                  type="text" 
                  placeholder="Bu asistan ne iş yapacak?"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-8 py-5 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#D63384] transition-all"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
             </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-4">
             <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-purple-50 rounded-2xl text-[#6B2D5C]"><Bot className="w-6 h-6" /></div>
                <h3 className="text-2xl font-black text-zinc-900 uppercase italic">Nasıl Davranmalı?</h3>
             </div>
             <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Konuşma Tarzı / Kişilik</label>
                <textarea 
                  rows={8}
                  placeholder="Örn: Kibar, profesyonel ve kısa cevaplar veren bir satış temsilcisi gibi davran. Müşterilere daima çözüm odaklı yaklaş."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[2rem] px-8 py-6 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#6B2D5C] transition-all"
                  value={formData.personality}
                  onChange={(e) => setFormData({...formData, personality: e.target.value})}
                />
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-8 animate-in zoom-in duration-500">
             <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto text-green-500 mb-8">
                <Sparkles className="w-12 h-12" />
             </div>
             <h3 className="text-3xl font-black text-zinc-900 uppercase italic">Her Şey Hazır!</h3>
             <p className="text-zinc-500 font-medium max-w-sm mx-auto">
                <b>{formData.name}</b> isimli asistanınızı oluşturmak için aşağıdaki butona tıklayın. Sonrasında verilerinizi yüklemeye başlayabilirsiniz.
             </p>
             <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 text-left space-y-2">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Özet Bilgi</p>
                <p className="text-sm font-black text-zinc-800">İsim: {formData.name}</p>
                <p className="text-xs text-zinc-500 line-clamp-1">Karakter: {formData.personality || "Belirtilmedi"}</p>
             </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-zinc-50">
          {step > 1 ? (
            <button 
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-8 py-4 text-zinc-400 font-bold hover:text-zinc-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> Geri
            </button>
          ) : <div />}

          {step < 3 ? (
            <button 
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !formData.name}
              className="px-10 py-4 bg-zinc-900 text-white rounded-2xl font-black text-lg hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 flex items-center gap-2 disabled:opacity-30 uppercase tracking-widest"
            >
              Devam Et <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={handleCreate}
              disabled={loading}
              className="px-12 py-5 bg-[#D63384] text-white rounded-2xl font-black text-xl hover:bg-[#c22e77] transition-all shadow-2xl shadow-pink-500/20 flex items-center gap-3 uppercase tracking-widest"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <PlusCircle className="w-6 h-6" />}
              Asistanı Oluştur
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PlusCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="12 8v8"/></svg>
  );
}
