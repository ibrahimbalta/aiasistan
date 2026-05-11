"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, FileText, Globe, Upload, Info, Check, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { createAssistant } from "@/actions/assistant-actions";
import { addKnowledge } from "@/actions/knowledge-actions";

export default function NewAssistantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    personality: "",
    content: "", // Eğitim içeriği için
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Asistanı oluştur
      const result = await createAssistant({
        name: formData.name,
        description: formData.description,
        personality: formData.personality
      });

      if (!result.success || !result.assistant) {
        throw new Error(result.error || "Asistan oluşturulamadı");
      }

      // 2. Eğer içerik varsa bilgi havuzuna ekle
      if (formData.content) {
        await addKnowledge(result.assistant.id, "TXT", formData.content, "ilk-bilgi.txt");
      }
      
      toast.success("Asistan başarıyla oluşturuldu!");
      router.push(`/dashboard/${result.assistant.id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Yeni Asistan Oluştur</h1>
        <p className="text-zinc-400">Asistanınızın kimliğini belirleyin ve onu eğitin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Progress Sidebar */}
        <div className="md:col-span-1 space-y-4">
          {[
            { id: 1, label: "Temel Bilgiler", icon: <Bot className="w-4 h-4" /> },
            { id: 2, label: "Karakter & Tavır", icon: <Info className="w-4 h-4" /> },
            { id: 3, label: "Bilgi Havuzu", icon: <Upload className="w-4 h-4" /> },
          ].map((s) => (
            <div 
              key={s.id}
              className={`flex items-center gap-3 p-3 rounded-lg text-sm transition-colors ${
                step === s.id ? "bg-white/10 text-white font-medium" : "text-zinc-500"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                step >= s.id ? "bg-blue-500 border-blue-500 text-white" : "border-zinc-800"
              }`}>
                {step > s.id ? <Check className="w-3 h-3" /> : s.id}
              </div>
              {s.label}
            </div>
          ))}
        </div>

        {/* Form Area */}
        <div className="md:col-span-3">
          <form onSubmit={handleCreate} className="space-y-8 glass-morphism p-8 rounded-2xl border border-white/5">
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Asistan Adı</label>
                  <input 
                    required
                    type="text"
                    placeholder="Örn: Müşteri Destek Botu"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Açıklama (İsteğe bağlı)</label>
                  <textarea 
                    rows={3}
                    placeholder="Bu asistan ne iş yapacak?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                >
                  Devam Et
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Konuşma Tarzı / Kişilik</label>
                  <textarea 
                    required
                    rows={6}
                    placeholder="Örn: Kibar, profesyonel ve kısa cevaplar veren bir satış temsilcisi gibi davran."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.personality}
                    onChange={(e) => setFormData({...formData, personality: e.target.value})}
                  />
                </div>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-white/10 text-white py-3 rounded-xl font-bold hover:bg-white/5 transition-all"
                  >
                    Geri
                  </button>
                  <button 
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 bg-white text-black py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all"
                  >
                    Devam Et
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-xl border border-white/10 border-dashed hover:border-blue-500/50 transition-colors cursor-pointer text-center group">
                    <Upload className="w-8 h-8 text-zinc-500 group-hover:text-blue-500 mx-auto mb-4" />
                    <div className="text-sm font-bold mb-1">Dosya Yükle</div>
                    <div className="text-xs text-zinc-500">PDF veya TXT</div>
                  </div>
                  <div className="p-6 rounded-xl border border-white/10 border-dashed hover:border-blue-500/50 transition-colors cursor-pointer text-center group">
                    <Globe className="w-8 h-8 text-zinc-500 group-hover:text-blue-500 mx-auto mb-4" />
                    <div className="text-sm font-bold mb-1">Web Linki</div>
                    <div className="text-xs text-zinc-500">İçeriği çekmek için</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Metin Olarak Bilgi Ekle</label>
                  <textarea 
                    rows={5}
                    placeholder="Asistanın bilmesini istediğiniz bilgileri buraya yapıştırın..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                  />
                </div>
                
                <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl flex gap-3">
                   <Info className="w-5 h-5 text-blue-500 shrink-0" />
                   <p className="text-xs text-blue-400/80 leading-relaxed">
                     Asistanınız verdiğiniz dökümanları analiz edecek ve soruları bu bilgilere dayanarak cevaplayacaktır.
                   </p>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 border border-white/10 text-white py-3 rounded-xl font-bold hover:bg-white/5 transition-all"
                  >
                    Geri
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-500 transition-all disabled:opacity-50"
                  >
                    {loading ? "Oluşturuluyor..." : "Asistanı Oluştur"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
