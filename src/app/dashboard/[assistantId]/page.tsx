"use client";

import { MessageSquare, Send, Bot, User, Share2, Code, Settings, Trash2, FileText, PlusCircle, Loader2, X, Copy, ExternalLink, Save, Palette, Layout } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { getAssistant, updateAssistant } from "@/actions/assistant-actions";
import { deleteKnowledge, addKnowledge } from "@/actions/knowledge-actions";
import { scrapeUrl } from "@/actions/web-actions";
import { toast } from "react-hot-toast";

const THEMES = [
  { id: "default", name: "Sleek Dark", desc: "Modern ve profesyonel koyu tema.", colors: "bg-zinc-900" },
  { id: "glass", name: "Glassmorphism", desc: "Şeffaf ve premium buzlu cam efekti.", colors: "bg-blue-500/20 backdrop-blur" },
  { id: "vibrant", name: "Vibrant Blue", desc: "Enerjik ve canlı gradyan geçişleri.", colors: "bg-gradient-to-br from-blue-600 to-purple-600" },
  { id: "minimal", name: "Minimal Light", desc: "Sade, temiz ve ferah beyaz tema.", colors: "bg-white border shadow-sm" },
];

export default function AssistantDetailPage({ params }: { params: Promise<{ assistantId: string }> }) {
  const [activeTab, setActiveTab] = useState("chat");
  const [assistant, setAssistant] = useState<any>(null);
  const [assistantId, setAssistantId] = useState<string>("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Merhaba! Ben senin özel asistanınım. Sana nasıl yardımcı olabilirim?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [showAddSourceModal, setShowAddSourceModal] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Edit states
  const [editData, setEditData] = useState({
    name: "",
    personality: "",
    description: "",
    theme: "default"
  });

  // Source Add States
  const [sourceType, setSourceType] = useState<"TEXT" | "LINK">("TEXT");
  const [sourceContent, setSourceContent] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceLoading, setSourceLoading] = useState(false);

  useEffect(() => {
    params.then(p => setAssistantId(p.assistantId));
  }, [params]);

  useEffect(() => {
    if (!assistantId) return;
    loadAssistant();
  }, [assistantId]);

  async function loadAssistant() {
    const result = await getAssistant(assistantId);
    if (result.success) {
      setAssistant(result.assistant);
      setEditData({
        name: result.assistant.name,
        personality: result.assistant.personality || "",
        description: result.assistant.description || "",
        theme: result.assistant.theme || "default"
      });
    }
    setFetching(false);
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !assistantId) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assistantId, question: userMessage, sessionId: "test-session" }),
      });
      const data = await response.json();
      if (data.answer) setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
    } catch (error) {
      toast.error("Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    const result = await updateAssistant(assistantId, editData);
    if (result.success) {
      toast.success("Asistan güncellendi!");
      loadAssistant();
    }
    setUpdating(false);
  };

  const handleDeleteKnowledge = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    if ((await deleteKnowledge(id, assistantId)).success) {
      toast.success("Silindi.");
      loadAssistant();
    }
  };

  const handleAddSource = async () => {
    setSourceLoading(true);
    try {
      let content = sourceContent;
      let title = sourceType === "TEXT" ? "Manuel Metin" : sourceUrl;
      if (sourceType === "LINK") {
        const scrape = await scrapeUrl(sourceUrl);
        if (!scrape.success) throw new Error(scrape.error);
        content = scrape.content;
      }
      if ((await addKnowledge(assistantId, sourceType === "TEXT" ? "TXT" : "LINK", content, title)).success) {
        toast.success("Eklendi!");
        setShowAddSourceModal(false);
        setSourceContent(""); setSourceUrl("");
        loadAssistant();
      }
    } catch (e: any) { toast.error(e.message); }
    finally { setSourceLoading(false); }
  };

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/chat/${assistantId}`;
  const widgetCode = `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0"></iframe>`;

  if (fetching) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;

  return (
    <div className="h-full flex flex-col gap-6 p-4 md:p-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg">
            {assistant?.name?.[0] || "A"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{assistant?.name || "Asistan"}</h1>
            <p className="text-zinc-500 text-sm font-mono truncate max-w-[200px]">ID: {assistantId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowShareModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-white">
            <Share2 className="w-4 h-4" /> Paylaş
          </button>
          <button onClick={() => setShowWidgetModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-white">
            <Code className="w-4 h-4" /> Widget Kodu
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-white/5">
        {[
          { id: "chat", label: "Test Chat", icon: <MessageSquare className="w-4 h-4" /> },
          { id: "knowledge", label: "Bilgi Kaynakları", icon: <FileText className="w-4 h-4" /> },
          { id: "settings", label: "Yapılandırma & Temalar", icon: <Palette className="w-4 h-4" /> },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all relative ${activeTab === tab.id ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
            {tab.icon} {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0">
        {activeTab === "chat" && (
          <div className="h-full flex flex-col glass-morphism rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.role === "assistant" ? "bg-blue-600" : "bg-zinc-800"}`}>
                    {m.role === "assistant" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === "assistant" ? "bg-white/5 border border-white/10 text-white" : "bg-blue-600 text-white"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <div className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-white" /></div><div className="bg-white/5 border border-white/10 p-4 rounded-2xl"><Loader2 className="w-4 h-4 animate-spin text-zinc-500" /></div></div>}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 border-t border-white/5 flex gap-3">
              <input type="text" placeholder="Bir soru sor..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white" value={input} onChange={(e) => setInput(e.target.value)} />
              <button disabled={loading} className="bg-white text-black p-3 rounded-xl hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"><Send className="w-5 h-5" /></button>
            </form>
          </div>
        )}

        {activeTab === "knowledge" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-white">
              <h3 className="text-lg font-bold">Bilgi Kaynakları</h3>
              <button onClick={() => setShowAddSourceModal(true)} className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><PlusCircle className="w-4 h-4" /> Kaynak Ekle</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assistant?.knowledge?.map((item: any) => (
                <div key={item.id} className="p-4 rounded-xl glass-morphism border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5 text-blue-500" /></div>
                    <div><div className="font-medium text-white truncate max-w-[200px]">{item.fileName || "Metin İçeriği"}</div><div className="text-xs text-zinc-500">{item.type} • {item.content.length} Karakter</div></div>
                  </div>
                  <button onClick={() => handleDeleteKnowledge(item.id)} className="p-2 text-zinc-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
             {/* General Info */}
             <div className="space-y-6 glass-morphism p-8 rounded-2xl border border-white/5">
                <h3 className="text-lg font-bold text-white mb-4">Genel Bilgiler</h3>
                <div><label className="block text-sm font-medium text-zinc-400 mb-2">Asistan Adı</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} /></div>
                <div><label className="block text-sm font-medium text-zinc-400 mb-2">Karakter ve Kişilik (Prompt)</label><textarea rows={6} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={editData.personality} onChange={(e) => setEditData({...editData, personality: e.target.value})} /></div>
                <button onClick={handleUpdate} disabled={updating} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Ayarları Kaydet
                </button>
             </div>

             {/* Themes */}
             <div className="space-y-6 glass-morphism p-8 rounded-2xl border border-white/5">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Layout className="w-5 h-5" /> Şablon Seçimi</h3>
                <div className="grid grid-cols-1 gap-4">
                  {THEMES.map(t => (
                    <div 
                      key={t.id} 
                      onClick={() => setEditData({...editData, theme: t.id})}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-4 items-center ${editData.theme === t.id ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500" : "border-white/5 hover:border-white/10 bg-white/5"}`}
                    >
                      <div className={`w-12 h-12 rounded-lg shrink-0 ${t.colors} flex items-center justify-center text-white font-bold`}>A</div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white">{t.name}</div>
                        <div className="text-xs text-zinc-500">{t.desc}</div>
                      </div>
                      {editData.theme === t.id && <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Modals... */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md p-6 animate-in zoom-in duration-200">
              <div className="flex items-center justify-between mb-6 text-white"><h3 className="text-xl font-bold">Asistanı Paylaş</h3><button onClick={() => setShowShareModal(false)} className="p-2 text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button></div>
              <div className="flex gap-2 mb-6"><input readOnly value={shareUrl} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-zinc-300 font-mono" /><button onClick={() => {navigator.clipboard.writeText(shareUrl); toast.success("Kopyalandı!");}} className="bg-white text-black px-4 rounded-xl hover:bg-zinc-200"><Copy className="w-4 h-4" /></button></div>
              <a href={shareUrl} target="_blank" className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"><ExternalLink className="w-4 h-4" /> Sayfayı Aç</a>
           </div>
        </div>
      )}
      {/* Diğer modallar benzer şekilde... */}
    </div>
  );
}

function Check(props: any) { return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>; }
