"use client";

import { MessageSquare, Send, Bot, User, Share2, Code, Settings, Trash2, FileText, PlusCircle, Loader2, X, Copy, ExternalLink, Save, Palette, Layout, Check, Terminal, Zap, Sparkles, Diamond, Ghost, Monitor, BarChart3, Globe, Database as DatabaseIcon, ShoppingBag, Landmark, Gavel, Headphones, Tag, RefreshCcw, Headset, Instagram, Phone, ShieldCheck, PieChart, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { getAssistant, updateAssistant } from "@/actions/assistant-actions";
import { deleteKnowledge, addKnowledge } from "@/actions/knowledge-actions";
import { scrapeUrl } from "@/actions/web-actions";
import { updateTelegramSettings } from "@/actions/telegram-actions";
import { updateOmnichannelSettings, updateWhiteLabelSettings, getAdvancedAnalytics } from "@/actions/enterprise-actions";
import { toast } from "react-hot-toast";

const THEMES = [
  { id: "soft-purple", name: "Soft Lavender", desc: "Temiz ve modern mor tonları.", colors: "bg-purple-100 border-purple-200", icon: <Sparkles className="w-4 h-4 text-purple-600" /> },
  { id: "soft-blue", name: "Ocean Breeze", desc: "Ferahlatıcı açık mavi tasarımı.", colors: "bg-blue-100 border-blue-200", icon: <Monitor className="w-4 h-4 text-blue-600" /> },
  { id: "soft-emerald", name: "Emerald Clean", desc: "Enerjik yeşil ve beyaz uyumu.", colors: "bg-emerald-100 border-emerald-200", icon: <Zap className="w-4 h-4 text-emerald-600" /> },
  { id: "default", name: "Deep Abyss", desc: "Modern, katmanlı karanlık mod.", colors: "bg-zinc-950", icon: <Ghost className="w-4 h-4 text-white" /> },
  { id: "glass", name: "Floating Glass", desc: "Havada asılı premium cam tasarımı.", colors: "bg-blue-500/20 backdrop-blur", icon: <Sparkles className="w-4 h-4 text-blue-500" /> },
  { id: "ecommerce", name: "E-Commerce Pro", desc: "Canlı turuncu, e-ticaret odaklı.", colors: "bg-orange-500", icon: <ShoppingBag className="w-4 h-4 text-white" /> },
  { id: "corporate", name: "Banking Blue", desc: "Kurumsal ve güven veren lacivert.", colors: "bg-[#002D72]", icon: <Landmark className="w-4 h-4 text-white" /> },
  { id: "creative", name: "Studio Pink", desc: "Yüksek kontrastlı, yaratıcı ajans stili.", colors: "bg-[#D63384]", icon: <Palette className="w-4 h-4 text-white" /> },
  { id: "legal", name: "Classic Legal", desc: "Ciddi, döküman ve hukuk temalı.", colors: "bg-[#2C2420]", icon: <Gavel className="w-4 h-4 text-[#D4C4A8]" /> },
  { id: "vibrant", name: "Cyber Protocol", desc: "Gelecekçi neon ve geometrik hatlar.", colors: "bg-cyan-950 border-cyan-500", icon: <Zap className="w-4 h-4 text-cyan-400" /> },
  { id: "terminal", name: "Retro Terminal", desc: "80'ler bilgisayar terminali ruhu.", colors: "bg-black border-green-900", icon: <Terminal className="w-4 h-4 text-green-500" /> },
  { id: "brutal", name: "Neo-Brutalism", desc: "Sert gölgeler ve cesur kontrastlar.", colors: "bg-yellow-400 border-black border-2", icon: <Layout className="w-4 h-4 text-black" /> },
  { id: "neumorphic", name: "Soft Control", desc: "Fiziksel kabartma ve derinlik.", colors: "bg-zinc-100 shadow-inner", icon: <Monitor className="w-4 h-4 text-zinc-900" /> },
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
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [editData, setEditData] = useState({
    name: "",
    personality: "",
    description: "",
    theme: "default",
    telegramToken: "",
    telegramEnabled: false,
    whatsappToken: "",
    whatsappPhoneId: "",
    whatsappEnabled: false,
    instagramToken: "",
    instagramEnabled: false,
    isWhiteLabel: false,
    customLogo: "",
    removeBranding: false,
    customDomain: ""
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
    loadAnalytics();
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
          telegramEnabled: result.assistant.telegramEnabled || false,
          whatsappToken: result.assistant.whatsappToken || "",
          whatsappPhoneId: result.assistant.whatsappPhoneId || "",
          whatsappEnabled: result.assistant.whatsappEnabled || false,
          instagramToken: result.assistant.instagramToken || "",
          instagramEnabled: result.assistant.instagramEnabled || false,
          isWhiteLabel: result.assistant.isWhiteLabel || false,
          customLogo: result.assistant.customLogo || "",
          removeBranding: result.assistant.removeBranding || false,
          customDomain: result.assistant.customDomain || ""
        });
      }
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setFetching(false);
    }
  }

  async function loadAnalytics() {
    const res = await getAdvancedAnalytics(assistantId);
    if (res.success) setAnalyticsData(res.data);
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
      const res1 = await updateAssistant(assistantId, editData);
      const res2 = await updateOmnichannelSettings(assistantId, editData);
      const res3 = await updateWhiteLabelSettings(assistantId, editData);
      
      if (res1.success && res2.success && res3.success) {
        toast.success("Ayarlar başarıyla kaydedildi!");
        loadAssistant();
      } else {
        toast.error("Bazı ayarlar kaydedilemedi.");
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

  // Unified Theme Styles Helper (Dashboard Preview - High Contrast)
  const getPreviewThemeStyles = () => {
    const theme = editData.theme;
    switch (theme) {
      case "soft-purple":
        return {
          container: "bg-white",
          header: "bg-white text-zinc-800 border-b",
          user: "bg-[#6B2D5C] text-white",
          bot: "bg-zinc-50 text-zinc-900 border border-zinc-100",
          input: "bg-white border-zinc-200 text-zinc-900",
          sendBtn: "bg-[#6B2D5C] text-white",
          icon: <Sparkles className="w-5 h-5 text-[#6B2D5C]" />
        };
      case "soft-blue":
        return {
          container: "bg-white",
          header: "bg-white text-zinc-800 border-b",
          user: "bg-blue-600 text-white",
          bot: "bg-zinc-50 text-zinc-900 border border-zinc-100",
          input: "bg-white border-zinc-200 text-zinc-900",
          sendBtn: "bg-blue-600 text-white",
          icon: <Monitor className="w-5 h-5 text-blue-600" />
        };
      case "soft-emerald":
        return {
          container: "bg-white",
          header: "bg-white text-zinc-800 border-b",
          user: "bg-emerald-600 text-white",
          bot: "bg-zinc-50 text-zinc-900 border border-zinc-100",
          input: "bg-white border-zinc-200 text-zinc-900",
          sendBtn: "bg-emerald-600 text-white",
          icon: <Zap className="w-5 h-5 text-emerald-600" />
        };
      case "glass":
        return {
          container: "bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-xl",
          header: "bg-white/30 text-zinc-900 border-b border-white/40",
          user: "bg-blue-600 text-white shadow-lg",
          bot: "bg-white/60 text-zinc-900 border border-white/80 shadow-sm",
          input: "bg-white/40 border-white/60 text-zinc-900 placeholder-zinc-500",
          sendBtn: "bg-blue-600 text-white",
          icon: <Sparkles className="w-5 h-5 text-blue-600" />
        };
      case "terminal":
        return {
          container: "bg-black font-mono",
          header: "bg-green-950/50 text-green-500 border-b border-green-500",
          user: "bg-green-900 text-white border border-green-500",
          bot: "bg-black text-green-400 border border-green-800",
          input: "bg-black border-green-900 text-green-500 placeholder-green-900",
          sendBtn: "bg-green-500 text-black",
          icon: <Terminal className="w-5 h-5 text-green-500" />
        };
      case "brutal":
        return {
          container: "bg-yellow-400",
          header: "bg-white text-black border-b-4 border-black font-black italic",
          user: "bg-black text-white border-2 border-black",
          bot: "bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
          input: "bg-white border-4 border-black text-black font-bold",
          sendBtn: "bg-black text-white",
          icon: <Layout className="w-5 h-5 text-black" />
        };
      case "neumorphic":
        return {
          container: "bg-zinc-100",
          header: "bg-zinc-100 text-zinc-800 border-b border-zinc-200",
          user: "bg-zinc-100 shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] text-zinc-900",
          bot: "bg-zinc-100 shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] text-zinc-800",
          input: "bg-zinc-100 shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] text-zinc-900 border-none",
          sendBtn: "bg-[#D63384] text-white",
          icon: <Monitor className="w-5 h-5 text-zinc-400" />
        };
      case "ecommerce":
        return {
            container: "bg-white",
            header: "bg-orange-600 text-white",
            user: "bg-orange-600 text-white shadow-orange-200",
            bot: "bg-zinc-50 text-zinc-900 border border-zinc-100",
            input: "bg-white border-zinc-200 text-zinc-900",
            sendBtn: "bg-orange-600 text-white",
            icon: <ShoppingBag className="w-5 h-5" />
        };
      case "corporate":
        return {
            container: "bg-[#002D72]/5",
            header: "bg-[#002D72] text-white",
            user: "bg-[#002D72] text-white",
            bot: "bg-white text-[#002D72] border border-[#002D72]/20 shadow-sm",
            input: "bg-white border-zinc-200 text-zinc-900",
            sendBtn: "bg-[#002D72] text-white",
            icon: <Landmark className="w-5 h-5" />
        };
      case "vibrant":
        return {
            container: "bg-cyan-950",
            header: "bg-cyan-900/50 text-cyan-400 border-b border-cyan-500/30",
            user: "bg-cyan-500 text-black font-bold",
            bot: "bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]",
            input: "bg-cyan-900/40 border-cyan-500/30 text-cyan-100 placeholder-cyan-700",
            sendBtn: "bg-cyan-400 text-black",
            icon: <Zap className="w-5 h-5" />
        };
      default:
        return {
          container: "bg-zinc-950",
          header: "bg-zinc-900/80 text-white border-b border-zinc-800",
          user: "bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-900/20",
          bot: "bg-zinc-800 text-zinc-100 border border-zinc-700/50 shadow-sm",
          input: "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-600",
          sendBtn: "bg-white text-black",
          icon: <Bot className="w-5 h-5 text-blue-500" />
        };
    }
  };
  const ps = getPreviewThemeStyles();

  if (fetching) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 bg-white rounded-[3rem]">
        <Loader2 className="w-10 h-10 text-[#D63384] animate-spin" />
        <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider animate-pulse">Veriler Getiriliyor...</p>
      </div>
    );
  }

  const tabs = [
    { id: "chat", label: "Test Chat", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "knowledge", label: "Bilgi Havuzu", icon: <FileText className="w-4 h-4" /> },
    { id: "settings", label: "Yapılandırma", icon: <Palette className="w-4 h-4" /> },
    { id: "analytics", label: "AI Analizler", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "omnichannel", label: "WhatsApp & IG", icon: <Zap className="w-4 h-4" /> },
    { id: "whitelabel", label: "Marka & Domain", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
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
            <Share2 className="w-4 h-4" /> Link Paylaş
          </button>
          <button onClick={() => setShowWidgetModal(true)} className="px-4 sm:px-6 py-3 bg-[#6B2D5C] text-white rounded-2xl text-[10px] sm:text-sm font-bold hover:bg-[#522246] transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/10 uppercase tracking-wider">
            <Code className="w-4 h-4" /> Widget Kodu
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-1.5 sm:p-2 rounded-2xl sm:rounded-[2rem] border border-zinc-100 w-full overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
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
          <div className={`h-[600px] flex flex-col rounded-2xl sm:rounded-[3rem] border border-zinc-100 overflow-hidden shadow-sm animate-in slide-in-from-bottom-2 ${ps.container}`}>
            {/* Preview Header */}
            <div className={`px-6 py-4 flex items-center justify-between ${ps.header}`}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">{ps.icon}</div>
                    <span className="text-sm font-black uppercase tracking-tight">{assistant?.name}</span>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 sm:gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${m.role === "assistant" ? ps.bot : ps.user}`}>
                    {m.role === "assistant" ? <Bot className="w-4 h-4 sm:w-5 sm:h-5" /> : <User className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <div className={`max-w-[85%] sm:max-w-[75%] p-4 sm:p-5 text-sm leading-relaxed ${m.role === "assistant" ? `${ps.bot} rounded-2xl rounded-tl-none` : `${ps.user} rounded-2xl rounded-br-none shadow-xl`}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 sm:p-6 bg-white/5 backdrop-blur-md border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input type="text" placeholder="Asistanınızı test edin..." className={`flex-1 rounded-xl sm:rounded-2xl px-5 py-3 sm:px-6 sm:py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D63384] transition-all ${ps.input}`} value={input} onChange={(e) => setInput(e.target.value)} />
              <button disabled={loading} className={`py-3 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-wider hover:scale-105 transition-all flex items-center justify-center gap-2 shrink-0 ${ps.sendBtn}`}><Send className="w-4 h-4 sm:w-5 sm:h-5" /> Gönder</button>
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
              {assistant?.knowledge?.map((item: any) => (
                <div key={item.id} className="p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] bg-white border border-zinc-100 flex flex-col justify-between hover:shadow-2xl transition-all group">
                  <div className="flex items-start justify-between mb-6 sm:mb-8">
                     <div className="w-12 h-12 sm:w-14 sm:h-14 bg-zinc-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#D63384] group-hover:bg-[#D63384] group-hover:text-white transition-all"><FileText className="w-6 h-6 sm:w-7 sm:h-7" /></div>
                     <button onClick={async () => { if(confirm("Emin misiniz?")) await deleteKnowledge(item.id, assistantId); loadAssistant(); }} className="p-2 text-zinc-300 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                  </div>
                   <div>
                    <div className="font-bold text-zinc-900 mb-1 truncate text-sm sm:text-base">{item.fileName}</div>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-500 text-[9px] font-bold uppercase tracking-wider">{item.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 pb-20 animate-in slide-in-from-bottom-2">
             <div className="space-y-8 bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-zinc-100 shadow-sm">
                <h3 className="text-lg sm:text-xl font-extrabold text-zinc-900 flex items-center gap-3 tracking-tight uppercase"><Settings className="w-5 h-5 text-[#6B2D5C]" /> Karakter & Kişilik</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Asistan İsmi</label>
                    <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-6 py-4 text-zinc-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#6B2D5C]" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Karakter (Prompt)</label>
                    <textarea rows={6} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-6 py-4 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#6B2D5C]" value={editData.personality} onChange={(e) => setEditData({...editData, personality: e.target.value})} />
                  </div>
                  <button onClick={handleUpdate} disabled={updating} className="w-full bg-[#6B2D5C] text-white py-5 rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#522246] transition-all shadow-xl shadow-purple-900/20 uppercase">
                    {updating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />} Ayarları Kaydet
                  </button>
                </div>
             </div>

             <div className="space-y-8 bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-zinc-100 shadow-sm flex flex-col h-[600px] xl:h-auto">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold text-zinc-900 flex items-center gap-3 uppercase"><Palette className="w-5 h-5 text-[#D63384]" /> Görünüm Şablonları</h3>
                    <button onClick={handleUpdate} disabled={updating} className="px-6 py-2 bg-[#D63384] text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-pink-500/10">
                        {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : "Şablonu Uygula"}
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2 scrollbar-hide flex-1 pb-4">
                  {THEMES.map(t => (
                    <div key={t.id} onClick={() => setEditData({...editData, theme: t.id})} className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden group ${editData.theme === t.id ? "border-[#D63384] bg-pink-50 scale-[1.02]" : "border-zinc-50 bg-zinc-50 hover:border-zinc-200"}`}>
                      <div className={`w-full h-16 rounded-2xl ${t.colors} flex items-center justify-center shadow-lg transition-transform group-hover:rotate-3 shrink-0`}>{t.icon}</div>
                      <div>
                        <div className="text-sm font-bold text-zinc-900 uppercase leading-none mb-1 truncate">{t.name}</div>
                        <div className="text-[10px] font-bold text-zinc-400 leading-tight line-clamp-2">{t.desc}</div>
                      </div>
                      {editData.theme === t.id && <div className="absolute top-4 right-4 bg-[#D63384] text-white p-1 rounded-full"><Check className="w-3 h-3" /></div>}
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-zinc-50 rounded-3xl border border-zinc-100 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <p className="text-[10px] font-bold text-zinc-500">Seçtiğiniz şablonun önizlemesini "Test Chat" sekmesinden görebilirsiniz.</p>
                </div>
             </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-8 animate-in slide-in-from-bottom-2 pb-20">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                   <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><MessageSquare className="w-6 h-6" /></div>
                      <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">+12% Artış</span>
                   </div>
                   <div className="text-3xl font-extrabold text-zinc-900">{analyticsData?.totalChats || 0}</div>
                   <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Toplam Sohbet</div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                   <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Bot className="w-6 h-6" /></div>
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">99.8% Başarı</span>
                   </div>
                   <div className="text-3xl font-extrabold text-zinc-900">{analyticsData?.totalMessages || 0}</div>
                   <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">AI Yanıt Sayısı</div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                   <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl"><PieChart className="w-6 h-6" /></div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Haftalık Rapor</span>
                   </div>
                   <div className="text-3xl font-extrabold text-zinc-900">7.4 dk</div>
                   <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Ort. Konuşma Süresi</div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[3rem] border border-zinc-100 shadow-sm">
                   <h4 className="text-sm font-extrabold text-zinc-900 uppercase flex items-center gap-2 mb-8">
                      <TrendingUp className="w-4 h-4 text-[#D63384]" /> En Çok Merak Edilen Konular
                   </h4>
                   <div className="space-y-6">
                      {analyticsData?.topics?.map((topic: any, idx: number) => (
                         <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                  <span className="w-6 h-6 rounded-lg bg-zinc-50 flex items-center justify-center text-[10px] font-bold text-zinc-400">0{idx+1}</span>
                                  <span className="text-xs font-bold text-zinc-700">{topic.name}</span>
                               </div>
                               <div className="flex items-center gap-2">
                                  <span className="text-xs font-extrabold text-zinc-900">%{topic.percentage}</span>
                                  {topic.trend === "up" ? <ArrowUpRight className="w-3 h-3 text-green-500" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />}
                               </div>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden">
                               <div className="h-full bg-[#6B2D5C] rounded-full transition-all duration-1000" style={{ width: `${topic.percentage}%` }} />
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="bg-gradient-to-br from-[#6B2D5C] to-[#4D2042] p-8 rounded-[3rem] text-white shadow-xl shadow-purple-900/20 relative overflow-hidden">
                   <div className="relative z-10">
                      <div className="p-4 bg-white/10 rounded-[2rem] w-fit mb-6 backdrop-blur-md">
                         <Sparkles className="w-8 h-8 text-yellow-400" />
                      </div>
                      <h4 className="text-xl font-extrabold mb-4 uppercase tracking-tight">AI Stratejik Raporu</h4>
                      <p className="text-white/70 text-sm leading-relaxed mb-8 font-medium">
                         "Bu hafta müşterileriniz en çok **Sipariş Takibi** konusuna odaklandı. Botunuz bu soruların %95'ini başarıyla yanıtladı. Müşteri memnuniyeti %12 arttı."
                      </p>
                      <button className="w-full py-4 bg-white text-[#6B2D5C] rounded-2xl font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all">Detaylı PDF Raporu İndir</button>
                   </div>
                   <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                </div>
             </div>
          </div>
        )}

        {activeTab === "omnichannel" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in slide-in-from-bottom-2 pb-20">
             <div className="bg-white p-8 sm:p-10 rounded-[3rem] border border-zinc-100 shadow-sm space-y-8">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center"><Phone className="w-7 h-7" /></div>
                   <div>
                      <h3 className="text-xl font-extrabold text-zinc-900 uppercase tracking-tight">WhatsApp Business</h3>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Müşterilerinize WhatsApp'tan Cevap Verin</p>
                   </div>
                </div>
                <div className="space-y-6">
                   <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Phone Number ID</label>
                      <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-6 py-4 text-zinc-900 font-mono font-bold" placeholder="10239485..." value={editData.whatsappPhoneId} onChange={(e) => setEditData({...editData, whatsappPhoneId: e.target.value})} />
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Access Token</label>
                      <input type="password" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-6 py-4 text-zinc-900 font-mono" placeholder="EAAB..." value={editData.whatsappToken} onChange={(e) => setEditData({...editData, whatsappToken: e.target.value})} />
                   </div>
                   <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <span className="text-[10px] font-extrabold text-zinc-600 uppercase tracking-widest">Durum: {editData.whatsappEnabled ? "Aktif" : "Kapalı"}</span>
                      <button onClick={() => setEditData({...editData, whatsappEnabled: !editData.whatsappEnabled})} className={`w-14 h-7 rounded-full relative transition-all ${editData.whatsappEnabled ? "bg-green-500" : "bg-zinc-200"}`}>
                         <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${editData.whatsappEnabled ? "left-8" : "left-1"}`} />
                      </button>
                   </div>
                </div>
                <button onClick={handleUpdate} disabled={updating} className="w-full py-5 bg-zinc-900 text-white rounded-[2rem] font-bold text-base uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-zinc-900/10">Ayarları Uygula</button>
             </div>

             <div className="bg-white p-8 sm:p-10 rounded-[3rem] border border-zinc-100 shadow-sm space-y-8">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center"><Instagram className="w-7 h-7" /></div>
                   <div>
                      <h3 className="text-xl font-extrabold text-zinc-900 uppercase tracking-tight">Instagram DM</h3>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">DM Üzerinden Otomatik Satış & Destek</p>
                   </div>
                </div>
                <div className="space-y-6">
                   <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Instagram Page Token</label>
                      <input type="password" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-6 py-4 text-zinc-900 font-mono" placeholder="IGAB..." value={editData.instagramToken} onChange={(e) => setEditData({...editData, instagramToken: e.target.value})} />
                   </div>
                   <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <span className="text-[10px] font-extrabold text-zinc-600 uppercase tracking-widest">Durum: {editData.instagramEnabled ? "Aktif" : "Kapalı"}</span>
                      <button onClick={() => setEditData({...editData, instagramEnabled: !editData.instagramEnabled})} className={`w-14 h-7 rounded-full relative transition-all ${editData.instagramEnabled ? "bg-pink-500" : "bg-zinc-200"}`}>
                         <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${editData.instagramEnabled ? "left-8" : "left-1"}`} />
                      </button>
                   </div>
                </div>
                <button onClick={handleUpdate} disabled={updating} className="w-full py-5 bg-zinc-900 text-white rounded-[2rem] font-bold text-base uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-zinc-900/10">Ayarları Uygula</button>
             </div>
          </div>
        )}

        {activeTab === "whitelabel" && (
          <div className="max-w-5xl space-y-10 animate-in slide-in-from-bottom-2 pb-20">
             <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm space-y-10">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-purple-50 text-[#6B2D5C] rounded-2xl flex items-center justify-center"><ShieldCheck className="w-7 h-7" /></div>
                   <div>
                      <h3 className="text-2xl font-extrabold text-zinc-900 uppercase tracking-tight">White-Label & Kurumsal Markalama</h3>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Platformu Kendi Markanız Gibi Kullanın</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <div>
                         <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Kurumsal Logo URL</label>
                         <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-6 py-4 text-zinc-900 font-medium" placeholder="https://firma.com/logo.png" value={editData.customLogo} onChange={(e) => setEditData({...editData, customLogo: e.target.value})} />
                      </div>
                      <div>
                         <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Özel Domain (CNAME)</label>
                         <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-6 py-4 text-zinc-900 font-bold" placeholder="destek.firmaadi.com" value={editData.customDomain} onChange={(e) => setEditData({...editData, customDomain: e.target.value})} />
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-3xl border border-zinc-100 group">
                         <div>
                            <p className="text-sm font-bold text-zinc-800">Kurumsal Markalama Aktif</p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase">White-Label Modu</p>
                         </div>
                         <button onClick={() => setEditData({...editData, isWhiteLabel: !editData.isWhiteLabel})} className={`w-14 h-7 rounded-full relative transition-all ${editData.isWhiteLabel ? "bg-[#D63384]" : "bg-zinc-200"}`}>
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${editData.isWhiteLabel ? "left-8" : "left-1"}`} />
                         </button>
                      </div>
                      <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-3xl border border-zinc-100 group">
                         <div>
                            <p className="text-sm font-bold text-zinc-800">"AI ASİSTAN" Logosunu Kaldır</p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase">Branding Temizliği</p>
                         </div>
                         <button onClick={() => setEditData({...editData, removeBranding: !editData.removeBranding})} className={`w-14 h-7 rounded-full relative transition-all ${editData.removeBranding ? "bg-[#D63384]" : "bg-zinc-200"}`}>
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${editData.removeBranding ? "left-8" : "left-1"}`} />
                         </button>
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-zinc-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-yellow-400"><Sparkles className="w-6 h-6" /></div>
                      <div>
                         <p className="text-sm font-bold">Domain Ayarlarınızı Yapın</p>
                         <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">DNS ayarlarınızda CNAME kaydını bize yönlendirin.</p>
                      </div>
                   </div>
                   <button onClick={handleUpdate} disabled={updating} className="px-10 py-4 bg-white text-black rounded-2xl font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all w-full md:w-auto">Değişiklikleri Uygula</button>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showShareModal && (
        <div className="fixed inset-0 bg-[#6B2D5C]/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] w-full max-w-xl p-10 shadow-2xl border border-zinc-100 animate-in zoom-in duration-300">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-extrabold text-zinc-900 tracking-tight">LİNK PAYLAŞ</h3>
                  <button onClick={() => setShowShareModal(false)}><X className="w-6 h-6 text-zinc-400" /></button>
               </div>
               <div className="flex gap-2 mb-8">
                  <input readOnly value={shareUrl} className="flex-1 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-xs font-mono font-bold text-[#6B2D5C]" />
                  <button onClick={() => {navigator.clipboard.writeText(shareUrl); toast.success("Kopyalandı!");}} className="bg-[#6B2D5C] text-white px-6 rounded-2xl hover:scale-105 transition-transform"><Copy className="w-5 h-5" /></button>
               </div>
               <a href={shareUrl} target="_blank" className="w-full py-5 bg-[#D63384] rounded-[2rem] text-white font-bold text-center flex items-center justify-center gap-3 hover:bg-[#c22e77] transition-all"><ExternalLink className="w-5 h-5" /> Test Et</a>
           </div>
        </div>
      )}

      {showWidgetModal && (
        <div className="fixed inset-0 bg-[#6B2D5C]/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl border border-zinc-100 animate-in zoom-in duration-300">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-extrabold text-zinc-900 tracking-tight">WIDGET KODU</h3>
                  <button onClick={() => setShowWidgetModal(false)}><X className="w-6 h-6 text-zinc-400" /></button>
               </div>
               <textarea readOnly value={widgetCode} rows={5} className="w-full bg-zinc-50 border border-zinc-100 rounded-[2rem] p-8 text-xs font-mono text-[#6B2D5C] font-bold focus:outline-none mb-8" />
               <button onClick={() => {navigator.clipboard.writeText(widgetCode); toast.success("Kod kopyalandı!");}} className="w-full py-5 bg-[#6B2D5C] text-white rounded-[2rem] font-bold flex items-center justify-center gap-3 hover:bg-[#522246] transition-all"><Copy className="w-5 h-5" /> Kodu Kopyala</button>
           </div>
        </div>
      )}

      {showAddSourceModal && (
        <div className="fixed inset-0 bg-[#6B2D5C]/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl border border-zinc-100 animate-in zoom-in duration-300">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-4 uppercase"><PlusCircle className="w-8 h-8 text-[#198754]" /> Veri Ekle</h3>
                  <button onClick={() => setShowAddSourceModal(false)}><X className="w-6 h-6 text-zinc-400" /></button>
               </div>
               <div className="flex gap-2 p-2 bg-zinc-50 rounded-full mb-8 border border-zinc-100">
                  <button onClick={() => setSourceType("TEXT")} className={`flex-1 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${sourceType === "TEXT" ? "bg-white text-[#6B2D5C] shadow-sm" : "text-zinc-400"}`}>Metin</button>
                  <button onClick={() => setSourceType("LINK")} className={`flex-1 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${sourceType === "LINK" ? "bg-white text-[#6B2D5C] shadow-sm" : "text-zinc-400"}`}>Link</button>
               </div>
               {sourceType === "TEXT" ? (
                  <textarea rows={8} placeholder="Metni buraya yapıştırın..." className="w-full bg-zinc-50 border border-zinc-100 rounded-[2rem] p-8 text-sm text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#198754] transition-all mb-8" value={sourceContent} onChange={(e) => setSourceContent(e.target.value)} />
               ) : (
                  <input type="url" placeholder="https://example.com" className="w-full bg-zinc-50 border border-zinc-100 rounded-full px-8 py-5 text-sm text-zinc-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#198754] transition-all mb-8" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} />
               )}
               <button onClick={handleAddSource} disabled={sourceLoading} className="w-full py-5 bg-[#198754] text-white rounded-[2rem] font-bold text-lg hover:bg-[#157347] transition-all flex items-center justify-center gap-3 uppercase shadow-xl shadow-green-500/20">
                  {sourceLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />} Kaydet ve Eğit
               </button>
           </div>
        </div>
      )}
    </div>
  );
}
