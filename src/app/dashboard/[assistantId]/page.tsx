"use client";

import { MessageSquare, Send, Bot, User, Share2, Code, Settings, Trash2, FileText, PlusCircle, Loader2, X, Copy, ExternalLink, Save } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { getAssistant, updateAssistant } from "@/actions/assistant-actions";
import { deleteKnowledge, addKnowledge } from "@/actions/knowledge-actions";
import { scrapeUrl } from "@/actions/web-actions";
import { toast } from "react-hot-toast";

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

  // Edit states for Configuration
  const [editData, setEditData] = useState({
    name: "",
    personality: "",
    description: ""
  });

  // Source Add States
  const [sourceType, setSourceType] = useState<"TEXT" | "LINK">("TEXT");
  const [sourceContent, setSourceContent] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceLoading, setSourceLoading] = useState(false);

  // Unwrapping params promise
  useEffect(() => {
    params.then(p => setAssistantId(p.assistantId));
  }, [params]);

  // Load assistant details
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
        description: result.assistant.description || ""
      });
    } else {
      toast.error("Asistan bilgileri yüklenemedi.");
    }
    setFetching(false);
  }

  // Scroll to bottom
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
        body: JSON.stringify({
          assistantId: assistantId,
          question: userMessage,
          sessionId: "test-session"
        }),
      });

      const data = await response.json();
      
      if (data.answer) {
        setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
      } else {
        toast.error(data.error || "Bir hata oluştu.");
      }
    } catch (error) {
      toast.error("Mesaj gönderilemedi.");
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
    } else {
      toast.error("Güncelleme başarısız.");
    }
    setUpdating(false);
  };

  const handleDeleteKnowledge = async (id: string) => {
    if (!confirm("Bu kaynağı silmek istediğinize emin misiniz?")) return;
    const result = await deleteKnowledge(id, assistantId);
    if (result.success) {
      toast.success("Kaynak silindi.");
      loadAssistant();
    } else {
      toast.error("Silme başarısız.");
    }
  };

  const handleAddSource = async () => {
    setSourceLoading(true);
    try {
      let contentToAdd = sourceContent;
      let title = "Manuel Metin";

      if (sourceType === "LINK") {
        const scrapeResult = await scrapeUrl(sourceUrl);
        if (!scrapeResult.success) throw new Error(scrapeResult.error);
        contentToAdd = scrapeResult.content;
        title = sourceUrl;
      }

      const result = await addKnowledge(assistantId, sourceType === "TEXT" ? "TXT" : "LINK", contentToAdd, title);
      if (result.success) {
        toast.success("Kaynak eklendi!");
        setShowAddSourceModal(false);
        setSourceContent("");
        setSourceUrl("");
        loadAssistant();
      } else {
        toast.error("Kaynak eklenemedi.");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSourceLoading(false);
    }
  };

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/chat/${assistantId}`;
  const widgetCode = `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0"></iframe>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Kopyalandı!");
  };

  if (fetching) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 p-4 md:p-0 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl text-white">
            {assistant?.name?.[0] || "A"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{assistant?.name || "Asistan"}</h1>
            <p className="text-zinc-500 text-sm font-mono truncate max-w-[200px]">ID: {assistantId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowShareModal(true)}
            className="flex-1 md:flex-none flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-white"
          >
            <Share2 className="w-4 h-4" />
            Paylaş
          </button>
          <button 
            onClick={() => setShowWidgetModal(true)}
            className="flex-1 md:flex-none flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-white"
          >
            <Code className="w-4 h-4" />
            Widget Kodu
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/5">
        {[
          { id: "chat", label: "Test Chat", icon: <MessageSquare className="w-4 h-4" /> },
          { id: "knowledge", label: "Bilgi Kaynakları", icon: <FileText className="w-4 h-4" /> },
          { id: "settings", label: "Yapılandırma", icon: <Settings className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all relative ${
              activeTab === tab.id ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0">
        {activeTab === "chat" && (
          <div className="h-full flex flex-col glass-morphism rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    m.role === "assistant" ? "bg-blue-600" : "bg-zinc-800"
                  }`}>
                    {m.role === "assistant" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                    m.role === "assistant" ? "bg-white/5 border border-white/10 text-white" : "bg-blue-600 text-white"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            <form onSubmit={handleSend} className="p-4 border-t border-white/5 flex gap-3">
              <input 
                type="text"
                placeholder="Bir soru sor..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                disabled={loading}
                className="bg-white text-black p-3 rounded-xl hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {activeTab === "knowledge" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Bilgi Kaynakları</h3>
              <button 
                onClick={() => setShowAddSourceModal(true)}
                className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Kaynak Ekle
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assistant?.knowledge?.map((item: any) => (
                <div key={item.id} className="p-4 rounded-xl glass-morphism border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium text-white truncate max-w-[200px]">{item.fileName || "Metin İçeriği"}</div>
                      <div className="text-xs text-zinc-500">{item.type} • {item.content.length} Karakter</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteKnowledge(item.id)}
                    className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(!assistant?.knowledge || assistant.knowledge.length === 0) && (
                <div className="col-span-full py-12 text-center text-zinc-500 border border-dashed border-white/10 rounded-2xl">
                  Henüz bilgi kaynağı eklenmemiş.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-8 animate-in fade-in duration-300">
             <div className="space-y-6 glass-morphism p-8 rounded-2xl border border-white/5">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Asistan Adı</label>
                  <input 
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Açıklama</label>
                  <textarea 
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={editData.description}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Karakter ve Kişilik</label>
                  <textarea 
                    rows={6}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={editData.personality}
                    onChange={(e) => setEditData({...editData, personality: e.target.value})}
                  />
                </div>
                <button 
                  onClick={handleUpdate}
                  disabled={updating}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Ayarları Kaydet
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md p-6 animate-in zoom-in duration-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Asistanı Paylaş</h3>
                <button onClick={() => setShowShareModal(false)} className="p-2 text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <p className="text-zinc-400 text-sm mb-4">Bu linki kullanarak asistanınıza doğrudan erişim sağlayabilirsiniz.</p>
              <div className="flex gap-2 mb-6">
                <input readOnly value={shareUrl} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-zinc-300 font-mono" />
                <button onClick={() => copyToClipboard(shareUrl)} className="bg-white text-black px-4 rounded-xl hover:bg-zinc-200"><Copy className="w-4 h-4" /></button>
              </div>
              <a href={shareUrl} target="_blank" className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                <ExternalLink className="w-4 h-4" />
                Test Sayfasını Aç
              </a>
           </div>
        </div>
      )}

      {/* Widget Modal */}
      {showWidgetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 animate-in zoom-in duration-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Sitenize Ekleyin</h3>
                <button onClick={() => setShowWidgetModal(false)} className="p-2 text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <p className="text-zinc-400 text-sm mb-4">Aşağıdaki kodu kopyalayarak asistanınızı kendi web sitenize bir pencere olarak ekleyebilirsiniz.</p>
              <div className="relative mb-6">
                <pre className="bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-blue-400 font-mono overflow-x-auto">
                  {widgetCode}
                </pre>
                <button onClick={() => copyToClipboard(widgetCode)} className="absolute top-2 right-2 p-2 bg-zinc-800 rounded-lg text-white hover:bg-zinc-700">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => setShowWidgetModal(false)} className="w-full py-3 bg-white text-black rounded-xl font-bold">Anladım</button>
           </div>
        </div>
      )}

      {/* Add Source Modal */}
      {showAddSourceModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md p-6 animate-in zoom-in duration-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Yeni Kaynak Ekle</h3>
                <button onClick={() => setShowAddSourceModal(false)} className="p-2 text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 mb-6">
                <button 
                  onClick={() => setSourceType("TEXT")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${sourceType === "TEXT" ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  Metin
                </button>
                <button 
                  onClick={() => setSourceType("LINK")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${sourceType === "LINK" ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  Web Linki
                </button>
              </div>

              {sourceType === "TEXT" ? (
                <textarea 
                  rows={8}
                  placeholder="Asistanın öğrenmesini istediğiniz metni buraya yazın..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 mb-6"
                  value={sourceContent}
                  onChange={(e) => setSourceContent(e.target.value)}
                />
              ) : (
                <div className="space-y-4 mb-6">
                  <input 
                    type="url"
                    placeholder="https://example.com"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                  />
                  <p className="text-xs text-zinc-500 leading-relaxed italic">
                    * Girdiğiniz web sayfasındaki tüm metin içerikleri taranarak asistanın bilgi havuzuna eklenecektir.
                  </p>
                </div>
              )}

              <button 
                onClick={handleAddSource}
                disabled={sourceLoading || (sourceType === "TEXT" ? !sourceContent : !sourceUrl)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {sourceLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
                Kaynağı Ekle
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
