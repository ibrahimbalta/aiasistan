"use client";

import { MessageSquare, Send, Bot, User, Share2, Code, Settings, Trash2, FileText, PlusCircle, Loader2, X, Copy, ExternalLink, Save, Palette, Layout, Check, Terminal, Zap, Sparkles, Diamond, Ghost, Monitor } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { getAssistant, updateAssistant } from "@/actions/assistant-actions";
import { deleteKnowledge, addKnowledge } from "@/actions/knowledge-actions";
import { scrapeUrl } from "@/actions/web-actions";
import { toast } from "react-hot-toast";

const THEMES = [
  { id: "default", name: "Deep Abyss", desc: "Modern, katmanlı karanlık mod.", colors: "bg-zinc-950", icon: <Ghost className="w-4 h-4" /> },
  { id: "glass", name: "Floating Glass", desc: "Havada asılı premium cam tasarımı.", colors: "bg-blue-500/20 backdrop-blur", icon: <Sparkles className="w-4 h-4" /> },
  { id: "vibrant", name: "Cyber Protocol", desc: "Gelecekçi neon ve geometrik hatlar.", colors: "bg-cyan-950 border-cyan-500", icon: <Zap className="w-4 h-4" /> },
  { id: "minimal", name: "Luxury Serif", desc: "Siyah ve altın uyumlu asil duruş.", colors: "bg-black border-amber-900", icon: <Diamond className="w-4 h-4" /> },
  { id: "terminal", name: "Retro Terminal", desc: "80'ler bilgisayar terminali ruhu.", colors: "bg-black border-green-900", icon: <Terminal className="w-4 h-4" /> },
  { id: "brutal", name: "Neo-Brutalism", desc: "Sert gölgeler ve cesur kontrastlar.", colors: "bg-yellow-400 border-black border-2", icon: <Layout className="w-4 h-4 text-black" /> },
  { id: "neumorphic", name: "Soft Control", desc: "Fiziksel kabartma ve derinlik.", colors: "bg-zinc-100 shadow-inner", icon: <Monitor className="w-4 h-4 text-zinc-900" /> },
  { id: "holographic", name: "Iridescent", desc: "Yanardöner kristalize renk geçişleri.", colors: "bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500", icon: <Sparkles className="w-4 h-4" /> },
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

  useEffect(() => { params.then(p => setAssistantId(p.assistantId)); }, [params]);

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
    if ((await updateAssistant(assistantId, editData)).success) {
      toast.success("Ayarlar güncellendi!");
      loadAssistant();
    }
    setUpdating(false);
  };

  const handleAddSource = async () => {
    setSourceLoading(true);
    try {
      let content = sourceContent;
      if (sourceType === "LINK") {
        const scrape = await scrapeUrl(sourceUrl);
        if (!scrape.success) throw new Error(scrape.error);
        content = scrape.content;
      }
      if ((await addKnowledge(assistantId, sourceType === "TEXT" ? "TXT" : "LINK", content, sourceType === "TEXT" ? "Metin" : sourceUrl)).success) {
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg">
            {assistant?.name?.[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{assistant?.name}</h1>
            <p className="text-zinc-500 text-sm font-mono truncate max-w-[200px]">ID: {assistantId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowShareModal(true)} className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-white flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Paylaş
          </button>
          <button onClick={() => setShowWidgetModal(true)} className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-white flex items-center gap-2">
            <Code className="w-4 h-4" /> Widget
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-white/5">
        {[
          { id: "chat", label: "Test Chat", icon: <MessageSquare className="w-4 h-4" /> },
          { id: "knowledge", label: "Bilgi Kaynakları", icon: <FileText className="w-4 h-4" /> },
          { id: "settings", label: "Tasarım & Şablonlar", icon: <Palette className="w-4 h-4" /> },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all relative ${activeTab === tab.id ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
            {tab.icon} {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-2">
        {activeTab === "chat" && (
          <div className="h-full flex flex-col glass-morphism rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.role === "assistant" ? "bg-blue-600" : "bg-zinc-800"}`}>
                    {m.role === "assistant" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.role === "assistant" ? "bg-white/5 border border-white/10 text-white" : "bg-blue-600 text-white"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 border-t border-white/5 flex gap-3">
              <input type="text" placeholder="Bir soru sor..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" value={input} onChange={(e) => setInput(e.target.value)} />
              <button disabled={loading} className="bg-white text-black p-3 rounded-xl"><Send className="w-5 h-5" /></button>
            </form>
          </div>
        )}

        {activeTab === "knowledge" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-white">
              <h3 className="text-lg font-bold">Bilgi Kaynakları</h3>
              <button onClick={() => setShowAddSourceModal(true)} className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><PlusCircle className="w-4 h-4" /> Ekle</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
              {assistant?.knowledge?.map((item: any) => (
                <div key={item.id} className="p-4 rounded-xl glass-morphism border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-blue-500" /><div><div className="font-medium truncate max-w-[200px]">{item.fileName}</div><div className="text-xs text-zinc-500">{item.type}</div></div></div>
                  <button onClick={async () => { if(confirm("Silinsin mi?")) await deleteKnowledge(item.id, assistantId); loadAssistant(); }} className="text-zinc-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-12 text-white">
             <div className="space-y-6 glass-morphism p-8 rounded-2xl border border-white/5 h-fit">
                <h3 className="text-lg font-bold flex items-center gap-2"><Settings className="w-5 h-5" /> Temel Ayarlar</h3>
                <div><label className="block text-sm font-medium text-zinc-400 mb-2">Asistan Adı</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} /></div>
                <div><label className="block text-sm font-medium text-zinc-400 mb-2">Kişilik (Prompt)</label><textarea rows={6} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none" value={editData.personality} onChange={(e) => setEditData({...editData, personality: e.target.value})} /></div>
                <button onClick={handleUpdate} disabled={updating} className="w-full bg-blue-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2">{updating && <Loader2 className="w-4 h-4 animate-spin" />} Değişiklikleri Kaydet</button>
             </div>

             <div className="space-y-6 glass-morphism p-8 rounded-2xl border border-white/5 h-fit">
                <h3 className="text-lg font-bold flex items-center gap-2"><Palette className="w-5 h-5" /> Radikal Tasarımlar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {THEMES.map(t => (
                    <div key={t.id} onClick={() => setEditData({...editData, theme: t.id})} className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 ${editData.theme === t.id ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500" : "border-white/5 bg-white/5"}`}>
                      <div className={`w-full h-12 rounded-xl ${t.colors} flex items-center justify-center`}>{t.icon}</div>
                      <div><div className="text-xs font-bold">{t.name}</div><div className="text-[10px] text-zinc-500 leading-tight">{t.desc}</div></div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Modals... */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-md p-8">
              <div className="flex items-center justify-between mb-8"><h3 className="text-2xl font-bold text-white">Sanal Asistan Yayında</h3><button onClick={() => setShowShareModal(false)}><X className="w-6 h-6 text-zinc-500" /></button></div>
              <div className="flex gap-2 mb-8"><input readOnly value={shareUrl} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-300 font-mono" /><button onClick={() => {navigator.clipboard.writeText(shareUrl); toast.success("Kopyalandı!");}} className="bg-white text-black px-4 rounded-xl hover:scale-105 transition-transform"><Copy className="w-4 h-4" /></button></div>
              <a href={shareUrl} target="_blank" className="w-full py-4 bg-blue-600 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-all"><ExternalLink className="w-5 h-5" /> Sayfayı Görüntüle</a>
           </div>
        </div>
      )}
    </div>
  );
}
