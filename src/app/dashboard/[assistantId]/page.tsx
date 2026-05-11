"use client";

import { MessageSquare, Send, Bot, User, Share2, Code, Settings, Trash2, FileText, PlusCircle, Loader2, X, Copy, ExternalLink, Save, Palette, Layout, Check, Terminal, Zap, Sparkles, Diamond, Ghost, Monitor, BarChart3, Globe, Database as DatabaseIcon } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { getAssistant, updateAssistant } from "@/actions/assistant-actions";
import { deleteKnowledge, addKnowledge } from "@/actions/knowledge-actions";
import { scrapeUrl } from "@/actions/web-actions";
import { toast } from "react-hot-toast";

const THEMES = [
  { id: "default", name: "Deep Abyss", desc: "Modern, katmanlı karanlık mod.", colors: "bg-zinc-950", icon: <Ghost className="w-4 h-4 text-white" /> },
  { id: "glass", name: "Floating Glass", desc: "Havada asılı premium cam tasarımı.", colors: "bg-blue-500/20 backdrop-blur", icon: <Sparkles className="w-4 h-4 text-blue-500" /> },
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
    theme: "default"
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
          theme: result.assistant.theme || "default"
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
  const widgetCode = useMemo(() => `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0"></iframe>`, [shareUrl]);

  if (fetching) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 bg-white rounded-[3rem]">
        <Loader2 className="w-10 h-10 text-[#D63384] animate-spin" />
        <p className="text-sm font-black text-zinc-400 uppercase tracking-widest animate-pulse">Veriler Getiriliyor...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#6B2D5C] rounded-2xl flex items-center justify-center font-black text-3xl text-white shadow-xl shadow-purple-900/20">
            {assistant?.name?.[0] || "A"}
          </div>
          <div>
            <h1 className="text-3xl font-black text-zinc-900 uppercase italic leading-tight">{assistant?.name}</h1>
            <div className="flex items-center gap-3 mt-1">
               <span className="px-2 py-0.5 rounded-md bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-200">Aktif</span>
               <span className="text-zinc-400 text-[10px] font-bold font-mono tracking-tighter">ID: {assistantId}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowShareModal(true)} className="px-6 py-3 bg-white border border-zinc-100 rounded-2xl text-sm font-black text-[#6B2D5C] hover:bg-zinc-50 transition-all flex items-center gap-2 shadow-sm uppercase tracking-widest">
            <Share2 className="w-4 h-4" /> Link Paylaş
          </button>
          <button onClick={() => setShowWidgetModal(true)} className="px-6 py-3 bg-[#6B2D5C] text-white rounded-2xl text-sm font-black hover:bg-[#522246] transition-all flex items-center gap-2 shadow-lg shadow-purple-900/10 uppercase tracking-widest">
            <Code className="w-4 h-4" /> Widget Kodu
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-[2rem] border border-zinc-100 w-fit">
        {[
          { id: "chat", label: "Test Chat", icon: <MessageSquare className="w-4 h-4" /> },
          { id: "knowledge", label: "Bilgi Kaynakları", icon: <FileText className="w-4 h-4" /> },
          { id: "settings", label: "Yapılandırma & Temalar", icon: <Palette className="w-4 h-4" /> },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)} 
            className={`flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
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
          <div className="h-full flex flex-col bg-white rounded-[3rem] border border-zinc-100 shadow-sm animate-in slide-in-from-bottom-2">
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${m.role === "assistant" ? "bg-[#6B2D5C] text-white" : "bg-zinc-100 text-[#D63384]"}`}>
                    {m.role === "assistant" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className={`max-w-[75%] p-5 rounded-[2rem] text-sm font-medium leading-relaxed ${m.role === "assistant" ? "bg-zinc-50 text-zinc-800 rounded-tl-none border border-zinc-100" : "bg-[#D63384] text-white rounded-br-none shadow-xl shadow-pink-500/10"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-6 bg-zinc-50/50 border-t border-zinc-100 flex gap-4">
              <input type="text" placeholder="Asistanınızı test edin..." className="flex-1 bg-white border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D63384] transition-all" value={input} onChange={(e) => setInput(e.target.value)} />
              <button disabled={loading} className="bg-[#6B2D5C] text-white px-8 rounded-2xl font-black uppercase tracking-widest hover:bg-[#522246] transition-all flex items-center gap-2"><Send className="w-5 h-5" /> Gönder</button>
            </form>
          </div>
        )}

        {activeTab === "knowledge" && (
          <div className="space-y-8 pb-12 animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-blue-100 rounded-2xl text-blue-600"><DatabaseIcon className="w-6 h-6" /></div>
                 <h3 className="text-xl font-black text-zinc-900 uppercase">Bilgi Havuzu</h3>
              </div>
              <button onClick={() => setShowAddSourceModal(true)} className="bg-[#198754] text-white px-8 py-3.5 rounded-2xl text-sm font-black flex items-center gap-2 shadow-xl shadow-green-500/20 hover:bg-[#157347] transition-all uppercase tracking-widest">
                <PlusCircle className="w-5 h-5" /> Kaynak Ekle
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assistant?.knowledge && assistant.knowledge.length > 0 ? assistant.knowledge.map((item: any) => (
                <div key={item.id} className="p-8 rounded-[2.5rem] bg-white border border-zinc-100 flex flex-col justify-between hover:shadow-2xl transition-all group">
                  <div className="flex items-start justify-between mb-8">
                     <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-[#D63384] group-hover:bg-[#D63384] group-hover:text-white transition-all"><FileText className="w-7 h-7" /></div>
                     <button onClick={async () => { if(confirm("Bu kaynağı silmek istediğinizden emin misiniz?")) await deleteKnowledge(item.id, assistantId); loadAssistant(); }} className="p-2 text-zinc-300 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                  </div>
                  <div>
                    <div className="font-black text-zinc-900 mb-2 truncate uppercase italic">{item.fileName}</div>
                    <div className="flex items-center gap-2">
                       <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-500 text-[9px] font-black uppercase tracking-widest">{item.type}</span>
                       <span className="text-[10px] text-zinc-400 font-bold italic">Yüklendi</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="md:col-span-3 py-20 text-center border-2 border-dashed border-zinc-100 rounded-[3rem] bg-zinc-50/50">
                   <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm"><Globe className="w-10 h-10 text-zinc-200" /></div>
                   <h4 className="text-xl font-black text-zinc-900 uppercase">Henüz Veri Yok</h4>
                   <p className="text-zinc-500 font-medium">Asistanınızı eğitmek için metin veya web sitesi ekleyin.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 pb-20 animate-in slide-in-from-bottom-2">
             <div className="space-y-8 bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm">
                <h3 className="text-xl font-black text-zinc-900 flex items-center gap-3 uppercase italic"><Settings className="w-6 h-6 text-[#6B2D5C]" /> Karakter & Kişilik</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">Asistan İsmi</label>
                    <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 text-zinc-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#6B2D5C] transition-all" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">Karakter ve Kişilik (Prompt)</label>
                    <textarea rows={8} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#6B2D5C] transition-all" value={editData.personality} onChange={(e) => setEditData({...editData, personality: e.target.value})} />
                  </div>
                  <button onClick={handleUpdate} disabled={updating} className="w-full bg-[#6B2D5C] text-white py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-[#522246] transition-all shadow-xl shadow-purple-900/20 uppercase tracking-widest">
                    {updating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />} Ayarları Güncelle
                  </button>
                </div>
             </div>

             <div className="space-y-8 bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm">
                <h3 className="text-xl font-black text-zinc-900 flex items-center gap-3 uppercase italic"><Palette className="w-6 h-6 text-[#D63384]" /> Görünüm & Şablonlar</h3>
                <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                  {THEMES.map(t => (
                    <div key={t.id} onClick={() => setEditData({...editData, theme: t.id})} className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden group ${editData.theme === t.id ? "border-[#D63384] bg-pink-50" : "border-zinc-50 bg-zinc-50 hover:border-zinc-200"}`}>
                      <div className={`w-full h-16 rounded-2xl ${t.colors} flex items-center justify-center shadow-lg transition-transform group-hover:rotate-3`}>{t.icon}</div>
                      <div>
                        <div className="text-sm font-black text-zinc-900 uppercase italic leading-none mb-1">{t.name}</div>
                        <div className="text-[10px] font-bold text-zinc-400 leading-tight">{t.desc}</div>
                      </div>
                      {editData.theme === t.id && <div className="absolute top-4 right-4 bg-[#D63384] text-white p-1 rounded-full"><Check className="w-3 h-3" /></div>}
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Modals... */}
      {showShareModal && (
        <div className="fixed inset-0 bg-[#6B2D5C]/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-[4rem] w-full max-w-xl p-12 shadow-2xl border border-zinc-100 animate-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-[#D63384]"><Share2 className="w-6 h-6" /></div>
                    <h3 className="text-3xl font-black text-zinc-900 uppercase italic">Asistan Yayında!</h3>
                 </div>
                 <button onClick={() => setShowShareModal(false)} className="p-2 bg-zinc-50 rounded-full hover:bg-zinc-100 transition-colors"><X className="w-6 h-6 text-zinc-400" /></button>
              </div>
              <div className="space-y-6 mb-10">
                 <p className="text-zinc-500 font-medium">Asistanınızı müşterilerinizle paylaşmak için aşağıdaki bağlantıyı kullanabilirsiniz.</p>
                 <div className="flex gap-2">
                    <input readOnly value={shareUrl} className="flex-1 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-sm text-[#6B2D5C] font-mono font-bold" />
                    <button onClick={() => {navigator.clipboard.writeText(shareUrl); toast.success("Kopyalandı!");}} className="bg-[#6B2D5C] text-white px-6 rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-purple-900/10"><Copy className="w-5 h-5" /></button>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <a href={shareUrl} target="_blank" className="py-5 bg-[#D63384] rounded-[2rem] text-white font-black text-lg flex items-center justify-center gap-3 hover:bg-[#c22e77] transition-all shadow-xl shadow-pink-500/20 uppercase tracking-widest"><ExternalLink className="w-5 h-5" /> Test Et</a>
                 <button onClick={() => setShowShareModal(false)} className="py-5 bg-zinc-900 rounded-[2rem] text-white font-black text-lg flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all uppercase tracking-widest">Kapat</button>
              </div>
           </div>
        </div>
      )}

      {showAddSourceModal && (
        <div className="fixed inset-0 bg-[#6B2D5C]/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-[4rem] w-full max-w-2xl p-12 shadow-2xl border border-zinc-100 animate-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-3xl font-black text-zinc-900 uppercase italic flex items-center gap-4">
                   <PlusCircle className="w-8 h-8 text-[#198754]" /> Veri Ekle
                 </h3>
                 <button onClick={() => setShowAddSourceModal(false)}><X className="w-6 h-6 text-zinc-400" /></button>
              </div>
              <div className="flex gap-2 p-2 bg-zinc-50 rounded-full mb-10 border border-zinc-100">
                 <button onClick={() => setSourceType("TEXT")} className={`flex-1 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${sourceType === "TEXT" ? "bg-white text-[#6B2D5C] shadow-sm border border-zinc-100" : "text-zinc-400"}`}>Manuel Metin</button>
                 <button onClick={() => setSourceType("LINK")} className={`flex-1 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${sourceType === "LINK" ? "bg-white text-[#6B2D5C] shadow-sm border border-zinc-100" : "text-zinc-400"}`}>Web Sitesi (Scrape)</button>
              </div>
              {sourceType === "TEXT" ? (
                 <textarea rows={10} placeholder="Asistanınızın bilmesini istediğiniz metni buraya yapıştırın..." className="w-full bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-8 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#198754] transition-all mb-8" value={sourceContent} onChange={(e) => setSourceContent(e.target.value)} />
              ) : (
                 <div className="mb-8">
                    <input type="url" placeholder="https://example.com" className="w-full bg-zinc-50 border border-zinc-100 rounded-full px-8 py-5 text-zinc-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#198754] transition-all" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} />
                    <p className="mt-4 text-xs text-zinc-400 font-medium px-4">Web sitesindeki tüm metin içerikleri otomatik olarak temizlenip asistanınıza öğretilecektir.</p>
                 </div>
              )}
              <div className="flex gap-4">
                 <button onClick={handleAddSource} disabled={sourceLoading} className="flex-1 py-5 bg-[#198754] text-white rounded-[2rem] font-black text-xl hover:bg-[#157347] transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 uppercase tracking-widest">
                    {sourceLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />} Kaydet ve Eğit
                 </button>
                 <button onClick={() => setShowAddSourceModal(false)} className="px-10 py-5 bg-zinc-100 text-zinc-600 rounded-[2rem] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all">İptal</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
