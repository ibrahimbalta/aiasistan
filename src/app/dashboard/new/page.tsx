"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bot, FileText, Globe, Upload, Info, Check, ChevronRight, Loader2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { createAssistant } from "@/actions/assistant-actions";
import { addKnowledge } from "@/actions/knowledge-actions";
import { scrapeUrl } from "@/actions/web-actions";

export default function NewAssistantPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [step, setStep] = useState(1);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [url, setUrl] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    personality: "",
    content: "", // Eğitim içeriği için
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/plain") {
      toast.error("Şimdilik sadece .txt dosyaları desteklenmektedir.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFormData(prev => ({
        ...prev,
        content: prev.content + (prev.content ? "\n\n" : "") + `--- DOSYA: ${file.name} ---\n${text}`
      }));
      toast.success(`${file.name} başarıyla okundu!`);
    };
    reader.readAsText(file);
  };

  const handleScrape = async () => {
    if (!url) return;
    setScraping(true);
    try {
      const result = await scrapeUrl(url);
      if (result.success && result.content) {
        setFormData(prev => ({
          ...prev,
          content: prev.content + (prev.content ? "\n\n" : "") + `--- LİNK: ${url} ---\n${result.content}`
        }));
        toast.success("Link içeriği başarıyla çekildi!");
        setShowUrlInput(false);
        setUrl("");
      } else {
        toast.error(result.error || "Link okunamadı.");
      }
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setScraping(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await createAssistant({
        name: formData.name,
        description: formData.description,
        personality: formData.personality
      });

      if (!result.success || !result.assistant) {
        throw new Error(result.error || "Asistan oluşturulamadı");
      }

      if (formData.content) {
        await addKnowledge(result.assistant.id, "TXT", formData.content, "egitim-verisi.txt");
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
    <div className="max-w-4xl mx-auto py-8 px-4">
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
          <form onSubmit={handleCreate} className="space-y-8 glass-morphism p-8 rounded-2xl border border-white/5 relative overflow-hidden">
            {loading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
                 <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                 <p className="font-bold text-lg">Asistanınız Hazırlanıyor...</p>
              </div>
            )}

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
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".txt"
                  onChange={handleFileUpload}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 rounded-xl border border-white/10 border-dashed hover:border-blue-500/50 transition-colors cursor-pointer text-center group"
                  >
                    <Upload className="w-8 h-8 text-zinc-500 group-hover:text-blue-500 mx-auto mb-4" />
                    <div className="text-sm font-bold mb-1">Dosya Yükle</div>
                    <div className="text-xs text-zinc-500">Sadece TXT</div>
                  </div>
                  <div 
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className={`p-6 rounded-xl border border-dashed transition-colors cursor-pointer text-center group ${showUrlInput ? "border-blue-500 bg-blue-500/5" : "border-white/10 hover:border-blue-500/50"}`}
                  >
                    <Globe className={`w-8 h-8 mx-auto mb-4 ${showUrlInput ? "text-blue-500" : "text-zinc-500 group-hover:text-blue-500"}`} />
                    <div className="text-sm font-bold mb-1">Web Linki</div>
                    <div className="text-xs text-zinc-500">İçeriği çekmek için</div>
                  </div>
                </div>

                {showUrlInput && (
                  <div className="flex gap-2 p-4 bg-white/5 rounded-xl border border-white/10 animate-in fade-in zoom-in duration-200">
                    <input 
                      type="url"
                      placeholder="https://example.com"
                      className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <button 
                      type="button"
                      disabled={scraping}
                      onClick={handleScrape}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 flex items-center gap-2"
                    >
                      {scraping ? <Loader2 className="w-4 h-4 animate-spin" /> : "Çek"}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowUrlInput(false)}
                      className="p-2 text-zinc-500 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Bilgi Havuzu İçeriği</label>
                  <textarea 
                    rows={8}
                    placeholder="Yüklediğiniz dosyalar veya çekilen linkler burada görünecek. İsterseniz kendiniz de manuel ekleme yapabilirsiniz..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-mono"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                  />
                </div>
                
                <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl flex gap-3">
                   <Info className="w-5 h-5 text-blue-500 shrink-0" />
                   <p className="text-xs text-blue-400/80 leading-relaxed">
                     Asistanınız yukarıdaki metni analiz edecek ve soruları bu bilgilere dayanarak cevaplayacaktır. Birden fazla dosya veya link ekleyebilirsiniz.
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
