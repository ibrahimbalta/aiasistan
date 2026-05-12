"use client";

import { MessageSquare, Send, Bot, User, Share2, Code, Settings, Trash2, FileText, PlusCircle, Loader2, X, Copy, ExternalLink, Save, Palette, Layout, Check, Terminal, Zap, Sparkles, Diamond, Ghost, Monitor, BarChart3, Globe, Database as DatabaseIcon, ShoppingBag, Landmark, Gavel, Headphones, Tag, RefreshCcw, Headset } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { getAssistant, updateAssistant } from "@/actions/assistant-actions";
import { deleteKnowledge, addKnowledge } from "@/actions/knowledge-actions";
import { scrapeUrl } from "@/actions/web-actions";
import { updateTelegramSettings } from "@/actions/telegram-actions";
import { toast } from "react-hot-toast";

const THEMES = [
  { id: "default", name: "Deep Abyss", desc: "Modern, katmanlı karanlık mod.", colors: "bg-zinc-950", icon: <Ghost className="w-4 h-4 text-white" /> },
  { id: "glass", name: "Floating Glass", desc: "Havada asılı premium cam tasarımı.", colors: "bg-blue-500/20 backdrop-blur", icon: <Sparkles className="w-4 h-4 text-blue-500" /> },
  { id: "ecommerce", name: "E-Commerce Pro", desc: "Canlı turuncu, e-ticaret odaklı.", colors: "bg-orange-500", icon: <ShoppingBag className="w-4 h-4 text-white" /> },
  { id: "corporate", name: "Banking Blue", desc: "Kurumsal ve güven veren lacivert.", colors: "bg-[#002D72]", icon: <Landmark className="w-4 h-4 text-white" /> },
  { id: "creative", name: "Studio Pink", desc: "Yüksek kontrastlı, yaratıcı ajans stili.", colors: "bg-[#D63384]", icon: <Palette className="w-4 h-4 text-white" /> },
  { id: "legal", name: "Classic Legal", desc: "Ciddi, döküman ve hukuk temalı.", colors: "bg-[#2C2420]", icon: <Gavel className="w-4 h-4 text-[#D4C4A8]" /> },
  { id: "vibrant", name: "Cyber Protocol", desc: "Gelecekçi neon ve geometrik hatlar.", colors: "bg-cyan-950 border-cyan-500", icon: <Zap className="w-4 h-4 text-cyan-400" /> },
  { id: "minimal", name: "Luxury Serif", desc: "Siyah ve altın uyumlu asil duruş.", colors: "bg-black border-amber-900", icon: <Diamond className="w-4 h-4 text-amber-500" /> },
  { id: "terminal", name: "Retro Terminal", desc: "80'ler bilgisayar terminali ruhu.", colors: "bg-black border-green-900", icon: <Terminal className="w-4 h-4 text-green-500" /> },
  { id: "brutal", name: "Neo-Brutalism", desc: "Sert gölgeler ve cesur kontrastlar.", colors: "bg-yellow-400 border-black border-2", icon: <Layout className="w-4 h-4 text-black" /> },
  { id: "neumorphic", name: "Soft Control", desc: "Fiziksel kabartma ve derinlik.", colors: "bg-zinc-100 shadow-inner", icon: <Monitor className="w-4 h-4 text-zinc-900" /> },
  { id: "holographic", name: "Iridescent", desc: "Yanardöner kristalize renk geçişleri.", colors: "bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500", icon: <Sparkles className="w-4 h-4 text-white" /> },
];

export default function AssistantDetailPage({ params }: { params: Promise<{ assistantId: string }> }) {
  const [activeTab, setActiveTab] = useState("chat");
  const [assistant, setAssistant] = useState<any>(null);
  const [assistantId, setAssistantId] = useState<string>("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Merhaba! Ben senin özel asistanınım. Hazırsan çalışmaya başlayabiliriz." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [showAddSourceModal, setShowAddSourceModal] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [editData, setEditData] = useState({
    name: "",
    personality: "",
    description: "",
    theme: "default",
    telegramToken: "",
    telegramEnabled: false
  });

  const [sourceType, setSourceType] = useState<"TEXT" | "LINK">("TEXT");
  const [sourceContent, setSourceContent] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceLoading, setSourceLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    params.then(p => {
      if (isMounted) setAssistantId(p.assistantId);
    });
    return () => { isMounted = false; };
  }, [params]);

  useEffect(() => {
    if (!assistantId) return;
    loadAssistant();
  }, [assistantId]);

  async function loadAssistant() {
    try {
      const result = await getAssistant(assistantId);
      if (result.success) {
        setAssistant(result.assistant);
        setEditData({
          name: result.assistant.name || "",
          personality: result.assistant.personality || "",
          description: result.assistant.description || "",
          theme: result.assistant.theme || "default",
          telegramToken: result.assistant.telegramToken || "",
          telegramEnabled: result.assistant.telegramEnabled || false
        });
      }
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !assistantId) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assistantId, question: userMsg, sessionId: "test-session" }),
      });
      const data = await response.json();
      if (data.answer) setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
    } finally { setLoading(false); }
  };

  const handleQuickAction = (text: string) => {
    if (loading) return;
    setInput(text);
    sendQuickMessage(text);
  };

  const sendQuickMessage = async (text: string) => {
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assistantId, question: text, sessionId: "test-session" }),
      });
      const data = await response.json();
      if (data.answer) setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
    } finally { setLoading(false); }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      if ((await updateAssistant(assistantId, editData)).success) {
        toast.success("Ayarlar başarıyla kaydedildi!");
        loadAssistant();
      }
    } finally { setUpdating(false); }
  };

  const handleAddSource = async () => {
    if (sourceType === "LINK" && !sourceUrl) return toast.error("URL girin.");
    if (sourceType === "TEXT" && !sourceContent) return toast.error("Metin girin.");
    
    setSourceLoading(true);
    try {
      let content = sourceContent;
      if (sourceType === "LINK") {
        const scrape = await scrapeUrl(sourceUrl);
        if (!scrape.success) throw new Error(scrape.error);
        content = scrape.content;
      }
      const result = await addKnowledge(assistantId, sourceType === "TEXT" ? "TXT" : "LINK", content, sourceType === "TEXT" ? "Metin" : sourceUrl);
      if (result.success) {
        toast.success("Bilgi kaynağı eklendi!");
        setShowAddSourceModal(false);
        setSourceContent(""); setSourceUrl("");
        loadAssistant();
      }
    } catch (e: any) { toast.error(e.message); }
    finally { setSourceLoading(false); }
  };

  const shareUrl = useMemo(() => `${typeof window !== 'undefined' ? window.location.origin : ''}/chat/${assistantId}`, [assistantId]);
  const widgetCode = useMemo(() => `<iframe src="${shareUrl}" width="100%" height="700" frameborder="0" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);"></iframe>`, [shareUrl]);

  if (fetching) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 bg-white rounded-[3rem]">
        <Loader2 className="w-10 h-10 text-[#D63384] animate-spin" />
        <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider animate-pulse">Veriler Getiriliyor...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#6B2D5C] rounded-2xl flex items-center justify-center font-extrabold text-xl sm:text-2xl text-white shadow-xl shadow-purple-900/20 shrink-0">
            {assistant?.name?.[0] || "A"}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight truncate leading-tight">{assistant?.name}</h1>
            <div className="flex items-center gap-3 mt-1">
               <span className="px-2 py-0.5 rounded-md bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider border border-green-200">Aktif</span>
               <span className="text-zinc-400 text-[10px] font-medium font-mono truncate">ID: {assistantId}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:flex items-center gap-3">
          <button onClick={() => setShowShareModal(true)} className="px-4 sm:px-6 py-3 bg-white border border-zinc-100 rounded-2xl text-[10px] sm:text-sm font-bold text-[#6B2D5C] hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider">
            <Share2 className="w-4 h-4" /> <span className="hidden xs:inline">Link Paylaş</span><span className="xs:hidden">Paylaş</span>
          </button>
          <button onClick={() => setShowWidgetModal(true)} className="px-4 sm:px-6 py-3 bg-[#6B2D5C] text-white rounded-2xl text-[10px] sm:text-sm font-bold hover:bg-[#522246] transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/10 uppercase tracking-wider">
            <Code className="w-4 h-4" /> <span className="hidden xs:inline">Widget Kodu</span><span className="xs:hidden">Widget</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-1.5 sm:p-2 rounded-2xl sm:rounded-[2rem] border border-zinc-100 w-full overflow-x-auto scrollbar-hide">
        {[
          { id: "chat", label: "Test Chat", icon: <MessageSquare className="w-4 h-4" /> },
          { id: "knowledge", label: "Bilgi Kaynakları", icon: <FileText className="w-4 h-4" /> },
          { id: "settings", label: "Yapılandırma & Temalar", icon: <Palette className="w-4 h-4" /> },
          { id: "telegram", label: "Telegram Entegrasyonu", icon: <Send className="w-4 h-4" /> },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)} 
            className={`flex items-center gap-2 px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
              activeTab === tab.id ? "bg-[#D63384] text-white shadow-lg shadow-pink-500/20" : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0">
        {activeTab === "chat" && (
          <div className="h-[600px] flex flex-col bg-white rounded-2xl sm:rounded-[3rem] border border-zinc-100 overflow-hidden shadow-sm animate-in slide-in-from-bottom-2">
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 sm:gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${m.role === "assistant" ? "bg-[#6B2D5C] text-white" : "bg-zinc-100 text-[#D63384]"}`}>
                    {m.role === "assistant" ? <Bot className="w-4 h-4 sm:w-5 sm:h-5" /> : <User className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <div className={`max-w-[85%] sm:max-w-[75%] p-4 sm:p-5 text-sm leading-relaxed ${m.role === "assistant" ? "bg-zinc-50 text-zinc-800 rounded-2xl rounded-tl-none border border-zinc-100" : "bg-[#D63384] text-white rounded-2xl rounded-br-none shadow-xl shadow-pink-500/10"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="px-4 sm:px-8 py-4 border-t border-zinc-50 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2">
                    {[
                        { label: "Sipariş Takibi", icon: <ShoppingBag className="w-4 h-4" /> },
                        { label: "Destek Talebi", icon: <Headset className="w-4 h-4" /> },
                        { label: "Teklif İste", icon: <FileText className="w-4 h-4" /> },
                        { label: "Fiyat Bilgisi", icon: <Tag className="w-4 h-4" /> },
                        { label: "İade İşlemleri", icon: <RefreshCcw className="w-4 h-4" /> },
                        { label: "İnsan Temsilciye Bağlan", icon: <User className="w-4 h-4" /> },
                    ].map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleQuickAction(action.label)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-100 text-[10px] sm:text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all whitespace-nowrap shadow-sm"
                        >
                            {action.icon}
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>
            <form onSubmit={handleSend} className="p-4 sm:p-6 bg-zinc-50/50 border-t border-zinc-100 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input type="text" placeholder="Asistanınızı test edin..." className="flex-1 bg-white border border-zinc-200 rounded-xl sm:rounded-2xl px-5 py-3 sm:px-6 sm:py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D63384] transition-all" value={input} onChange={(e) => setInput(e.target.value)} />
              <button disabled={loading} className="bg-[#6B2D5C] text-white py-3 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#522246] transition-all flex items-center justify-center gap-2 shrink-0"><Send className="w-4 h-4 sm:w-5 sm:h-5" /> Gönder</button>
            </form>
          </div>
        )}

        {activeTab === "knowledge" && (
          <div className="space-y-6 sm:space-y-8 pb-12 animate-in slide-in-from-bottom-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600"><DatabaseIcon className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                 <h3 className="text-lg sm:text-xl font-extrabold text-zinc-900 tracking-tight">BİLGİ HAVUZU</h3>
              </div>
              <button onClick={() => setShowAddSourceModal(true)} className="bg-[#198754] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-green-500/20 hover:bg-[#157347] transition-all uppercase tracking-wider">
                <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" /> Kaynak Ekle
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {assistant?.knowledge && assistant.knowledge.length > 0 ? assistant.knowledge.map((item: any) => (
                <div key={item.id} className="p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] bg-white border border-zinc-100 flex flex-col justify-between hover:shadow-2xl transition-all group">
                  <div className="flex items-start justify-between mb-6 sm:mb-8">
                     <div className="w-12 h-12 sm:w-14 sm:h-14 bg-zinc-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#D63384] group-hover:bg-[#D63384] group-hover:text-white transition-all"><FileText className="w-6 h-6 sm:w-7 sm:h-7" /></div>
                     <button onClick={async () => { if(confirm("Bu kaynağı silmek istediğinizden emin misiniz?")) await deleteKnowledge(item.id, assistantId); loadAssistant(); }} className="p-2 text-zinc-300 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                  </div>
                   <div>
                    <div className="font-bold text-zinc-900 mb-1 truncate text-sm sm:text-base">{item.fileName}</div>
                    <div className="flex items-center gap-2">
                       <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-500 text-[9px] font-bold uppercase tracking-wider">{item.type}</span>
                       <span className="text-[10px] text-zinc-400 font-medium italic">Yüklendi</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="sm:col-span-2 lg:col-span-3 py-16 sm:py-20 text-center border-2 border-dashed border-zinc-100 rounded-2xl sm:rounded-[3rem] bg-zinc-50/50">
                   <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm"><Globe className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-200" /></div>
                   <h4 className="text-lg sm:text-xl font-bold text-zinc-900">Henüz Veri Yok</h4>
                   <p className="text-zinc-500 text-sm font-medium px-4">Asistanınızı eğitmek için metin veya web sitesi ekleyin.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-10 pb-20 animate-in slide-in-from-bottom-2">
             <div className="space-y-6 sm:space-y-8 bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
                <h3 className="text-lg sm:text-xl font-extrabold text-zinc-900 flex items-center gap-3 tracking-tight uppercase"><Settings className="w-5 h-5 sm:w-6 sm:h-6 text-[#6B2D5C]" /> Karakter & Kişilik</h3>
                <div className="space-y-5 sm:space-y-6">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 sm:mb-3">Asistan İsmi</label>
                    <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl sm:rounded-2xl px-5 py-3 sm:px-6 sm:py-4 text-zinc-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#6B2D5C] transition-all text-sm sm:text-base" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 sm:mb-3">Karakter ve Kişilik (Prompt)</label>
                    <textarea rows={8} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl sm:rounded-2xl px-5 py-3 sm:px-6 sm:py-4 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#6B2D5C] transition-all text-sm sm:text-base" value={editData.personality} onChange={(e) => setEditData({...editData, personality: e.target.value})} />
                  </div>
                  <button onClick={handleUpdate} disabled={updating} className="w-full bg-[#6B2D5C] text-white py-4 sm:py-5 rounded-xl sm:rounded-[2rem] font-bold text-base sm:text-lg flex items-center justify-center gap-3 hover:bg-[#522246] transition-all shadow-xl shadow-purple-900/20 uppercase tracking-wider">
                    {updating ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : <Save className="w-5 h-5 sm:w-6 sm:h-6" />} Ayarları Güncelle
                  </button>
                </div>
             </div>

             <div className="space-y-6 sm:space-y-8 bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden flex flex-col h-[600px] xl:h-auto">
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 flex items-center gap-3 uppercase"><Palette className="w-5 h-5 sm:w-6 sm:h-6 text-[#D63384]" /> Görünüm & Şablonlar</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 overflow-y-auto pr-2 scrollbar-hide flex-1 pb-4">
                  {THEMES.map(t => (
                    <div key={t.id} onClick={() => setEditData({...editData, theme: t.id})} className={`p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] border-2 transition-all cursor-pointer flex flex-col gap-3 sm:gap-4 relative overflow-hidden group ${editData.theme === t.id ? "border-[#D63384] bg-pink-50" : "border-zinc-50 bg-zinc-50 hover:border-zinc-200"}`}>
                      <div className={`w-full h-12 sm:h-16 rounded-xl sm:rounded-2xl ${t.colors} flex items-center justify-center shadow-lg transition-transform group-hover:rotate-3 shrink-0`}>{t.icon}</div>
                      <div>
                        <div className="text-[10px] sm:text-sm font-bold text-zinc-900 uppercase leading-none mb-1 truncate">{t.name}</div>
                        <div className="text-[8px] sm:text-[10px] font-bold text-zinc-400 leading-tight line-clamp-2">{t.desc}</div>
                      </div>
                      {editData.theme === t.id && <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-[#D63384] text-white p-1 rounded-full"><Check className="w-2 h-2 sm:w-3 sm:h-3" /></div>}
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === "telegram" && (
          <div className="max-w-4xl space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-2">
             <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 sm:mb-10">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-600 shrink-0"><Send className="w-6 h-6 sm:w-7 sm:h-7" /></div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">TELEGRAM BOT</h3>
                        <p className="text-zinc-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1 truncate">Asistanınızı Telegram'a Taşıyın</p>
                      </div>
                   </div>
                   <div className="flex items-center justify-between sm:justify-start gap-3 bg-zinc-50 p-2 rounded-xl sm:rounded-2xl border border-zinc-100">
                      <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-3 ${editData.telegramEnabled ? "text-green-600" : "text-zinc-400"}`}>
                        {editData.telegramEnabled ? "Aktif" : "Devre Dışı"}
                      </span>
                      <button 
                        onClick={() => setEditData({...editData, telegramEnabled: !editData.telegramEnabled})}
                        className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full relative transition-all duration-300 ${editData.telegramEnabled ? "bg-green-500 shadow-lg shadow-green-500/30" : "bg-zinc-200"}`}
                      >
                        <div className={`absolute top-0.5 sm:top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${editData.telegramEnabled ? "left-6.5 sm:left-8" : "left-0.5 sm:left-1"}`} />
                      </button>
                   </div>
                </div>

                <div className="space-y-6 sm:space-y-8">
                   <div className="p-5 sm:p-8 bg-blue-50/50 rounded-2xl sm:rounded-[2.5rem] border border-blue-100 flex gap-4 sm:gap-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-sm"><Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" /></div>
                      <div className="space-y-2">
                        <p className="text-xs sm:text-sm text-blue-900 font-bold uppercase tracking-tight">Nasıl Kurulur?</p>
                        <p className="text-[11px] sm:text-xs text-blue-800 leading-relaxed font-medium">Telegram'da <a href="https://t.me/botfather" target="_blank" className="font-black underline">@BotFather</a> hesabına gidin, bir bot oluşturun ve size verilen <b>HTTP API Token</b>'ı aşağıya yapıştırın.</p>
                      </div>
                   </div>

                   <div className="space-y-3 sm:space-y-4">
                      <label className="block text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Telegram Bot Token (HTTP API)</label>
                      <input 
                        type="text" 
                        placeholder="Örn: 123456:ABC..."
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl sm:rounded-2xl px-6 py-4 sm:px-8 sm:py-5 text-zinc-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" 
                        value={editData.telegramToken} 
                        onChange={(e) => setEditData({...editData, telegramToken: e.target.value})} 
                      />
                   </div>

                   <button 
                    onClick={async () => {
                      setUpdating(true);
                      try {
                        const res = await updateTelegramSettings(assistantId, editData.telegramToken, editData.telegramEnabled);
                        if (res.success) {
                          toast.success("Telegram ayarları başarıyla güncellendi!");
                          loadAssistant();
                        } else {
                          toast.error(res.error || "Bir hata oluştu.");
                        }
                      } finally { setUpdating(false); }
                    }}
                    disabled={updating}
                    className="w-full bg-zinc-900 text-white py-4 sm:py-5 rounded-xl sm:rounded-[2rem] font-bold text-base sm:text-lg flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-zinc-900/20 uppercase tracking-wider"
                   >
                     {updating ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : <Check className="w-5 h-5 sm:w-6 sm:h-6" />} Ayarları Uygula
                   </button>
                </div>
             </div>

             <div className="p-6 border-2 border-dashed border-zinc-100 rounded-2xl sm:rounded-[3rem] text-center bg-zinc-50/30">
                <p className="text-[9px] sm:text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Güvenli & İzole Altyapı</p>
                <p className="text-[11px] sm:text-xs text-zinc-400 mt-2 font-medium">Tüm Telegram trafiği uçtan uca şifreli olarak yönetilir.</p>
             </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-[#6B2D5C]/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl sm:rounded-[4rem] w-full max-w-xl p-6 sm:p-12 shadow-2xl border border-zinc-100 animate-in zoom-in duration-300">
               <div className="flex items-center justify-between mb-8 sm:mb-10">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#D63384]"><Share2 className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">Link Paylaş</h3>
                 </div>
                 <button onClick={() => setShowShareModal(false)}><X className="w-6 h-6 text-zinc-400" /></button>
              </div>
              <div className="space-y-6 mb-8 sm:mb-10">
                 <div className="flex flex-col sm:flex-row gap-3">
                    <input readOnly value={shareUrl} className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl sm:rounded-2xl px-5 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-[#6B2D5C] font-mono font-bold" />
                    <button onClick={() => {navigator.clipboard.writeText(shareUrl); toast.success("Kopyalandı!");}} className="bg-[#6B2D5C] text-white p-3 sm:px-6 rounded-xl sm:rounded-2xl hover:scale-105 transition-transform flex items-center justify-center"><Copy className="w-5 h-5" /></button>
                 </div>
              </div>
               <a href={shareUrl} target="_blank" className="w-full py-4 sm:py-5 bg-[#D63384] rounded-xl sm:rounded-[2rem] text-white font-bold text-base sm:text-lg flex items-center justify-center gap-3 hover:bg-[#c22e77] transition-all shadow-xl shadow-pink-500/20 uppercase tracking-wider"><ExternalLink className="w-5 h-5" /> Test Et</a>
           </div>
        </div>
      )}

      {/* Widget Code Modal */}
      {showWidgetModal && (
        <div className="fixed inset-0 bg-[#6B2D5C]/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl sm:rounded-[4rem] w-full max-w-2xl p-6 sm:p-12 shadow-2xl border border-zinc-100 animate-in zoom-in duration-300">
               <div className="flex items-center justify-between mb-8 sm:mb-10">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#6B2D5C]"><Code className="w-5 h-5 sm:w-6 h-6" /></div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">Widget Kodu</h3>
                 </div>
                 <button onClick={() => setShowWidgetModal(false)}><X className="w-6 h-6 text-zinc-400" /></button>
              </div>
              <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
                 <p className="text-zinc-500 text-sm font-medium">Web sitenize eklemek için aşağıdaki iframe kodunu kopyalayın.</p>
                 <div className="relative group">
                    <textarea 
                      readOnly 
                      value={widgetCode} 
                      rows={5}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 text-[10px] sm:text-xs font-mono text-[#6B2D5C] font-bold focus:outline-none"
                    />
                     <button 
                       onClick={() => {navigator.clipboard.writeText(widgetCode); toast.success("Kod kopyalandı!");}}
                       className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-[#6B2D5C] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center gap-2 font-bold text-[10px] sm:text-xs uppercase"
                     >
                       <Copy className="w-4 h-4" /> Kopyala
                     </button>
                 </div>
              </div>
              <div className="p-4 sm:p-6 bg-yellow-50 rounded-2xl sm:rounded-3xl border border-yellow-100 flex gap-3 sm:gap-4">
                 <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 shrink-0" />
                 <p className="text-[10px] sm:text-xs text-yellow-800 font-medium leading-relaxed">İpucu: Widget boyutlarını web sitenizin tasarımına göre iframe kodu üzerinden özelleştirebilirsiniz.</p>
              </div>
           </div>
        </div>
      )}

      {/* Add Knowledge Modal */}
      {showAddSourceModal && (
        <div className="fixed inset-0 bg-[#6B2D5C]/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl sm:rounded-[4rem] w-full max-w-2xl p-6 sm:p-12 shadow-2xl border border-zinc-100 animate-in zoom-in duration-300">
               <div className="flex items-center justify-between mb-8 sm:mb-10">
                 <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-3 sm:gap-4 uppercase">
                   <PlusCircle className="w-6 h-6 sm:w-8 sm:h-8 text-[#198754]" /> Veri Ekle
                 </h3>
                 <button onClick={() => setShowAddSourceModal(false)}><X className="w-6 h-6 text-zinc-400" /></button>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 p-1.5 sm:p-2 bg-zinc-50 rounded-2xl sm:rounded-full mb-8 sm:mb-10 border border-zinc-100">
                 <button onClick={() => setSourceType("TEXT")} className={`flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${sourceType === "TEXT" ? "bg-white text-[#6B2D5C] shadow-sm border border-zinc-100" : "text-zinc-400"}`}>Manuel Metin</button>
                 <button onClick={() => setSourceType("LINK")} className={`flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${sourceType === "LINK" ? "bg-white text-[#6B2D5C] shadow-sm border border-zinc-100" : "text-zinc-400"}`}>Web Sitesi</button>
              </div>
              {sourceType === "TEXT" ? (
                 <textarea rows={8} placeholder="Metni buraya yapıştırın..." className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 text-sm sm:text-base text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#198754] transition-all mb-6 sm:mb-8" value={sourceContent} onChange={(e) => setSourceContent(e.target.value)} />
              ) : (
                 <div className="mb-6 sm:mb-8">
                    <input type="url" placeholder="https://example.com" className="w-full bg-zinc-50 border border-zinc-100 rounded-xl sm:rounded-full px-6 py-4 sm:px-8 sm:py-5 text-sm sm:text-base text-zinc-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#198754] transition-all" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} />
                 </div>
              )}
              <button onClick={handleAddSource} disabled={sourceLoading} className="w-full py-4 sm:py-5 bg-[#198754] text-white rounded-xl sm:rounded-[2rem] font-bold text-base sm:text-lg hover:bg-[#157347] transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 uppercase tracking-wider">
                 {sourceLoading ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : <Save className="w-5 h-5 sm:w-6 sm:h-6" />} Kaydet ve Eğit
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
