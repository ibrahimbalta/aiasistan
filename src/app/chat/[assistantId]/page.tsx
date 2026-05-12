"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { Send, Bot, User, Loader2, Sparkles, Zap, Shield, Globe, Terminal, Layout, Monitor, Ghost, Diamond, ShoppingBag, Landmark, Palette, Gavel, Headphones, FileText, Tag, RefreshCcw, Headset } from "lucide-react";
import { getChatAssistant } from "@/actions/assistant-actions";
import { toast } from "react-hot-toast";

const QUICK_ACTIONS = [
  { label: "Sipariş Takibi", icon: <ShoppingBag className="w-4 h-4" /> },
  { label: "Destek Talebi", icon: <Headset className="w-4 h-4" /> },
  { label: "Teklif İste", icon: <FileText className="w-4 h-4" /> },
  { label: "Fiyat Bilgisi", icon: <Tag className="w-4 h-4" /> },
  { label: "İade İşlemleri", icon: <RefreshCcw className="w-4 h-4" /> },
  { label: "İnsan Temsilciye Bağlan", icon: <User className="w-4 h-4" /> },
];

function ChatContent({ params }: { params: Promise<{ assistantId: string }> }) {
  const [assistant, setAssistant] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [assistantId, setAssistantId] = useState("");

  useEffect(() => { 
    params.then(p => setAssistantId(p.assistantId)); 
  }, [params]);

  useEffect(() => {
    if (!assistantId) return;
    async function load() {
      const result = await getChatAssistant(assistantId);
      if (result.success) {
        setAssistant(result.assistant);
        setMessages([{ role: "assistant", content: result.assistant.welcomeMessage || `Merhaba! Ben ${result.assistant.name}. Size nasıl yardımcı olabilirim?` }]);
      } else {
        toast.error("Asistan yüklenemedi.");
      }
      setFetching(false);
    }
    load();
  }, [assistantId]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendQuickMessage(input.trim());
    setInput("");
  };

  const handleQuickAction = (text: string) => {
    if (loading) return;
    sendQuickMessage(text);
  };

  const sendQuickMessage = async (text: string) => {
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assistantId, question: text, sessionId: "public-session" }),
      });
      const data = await response.json();
      if (data.answer) setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const theme = assistant?.theme || "default";

  const getThemeStyles = () => {
    switch (theme) {
      case "soft-purple":
        return {
          container: "bg-white border border-zinc-100 shadow-[0_20px_50px_rgba(107,45,92,0.05)] md:rounded-[3rem]",
          header: "bg-white border-b border-zinc-50 text-zinc-800 py-6",
          userBubble: "bg-[#6B2D5C] text-white rounded-[1.5rem] rounded-br-none shadow-lg shadow-purple-900/10",
          botBubble: "bg-zinc-50 text-zinc-800 rounded-[1.5rem] rounded-bl-none border border-zinc-100",
          input: "bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-zinc-100 text-zinc-900 placeholder-zinc-400 rounded-full",
          sendBtn: "bg-[#6B2D5C] text-white rounded-full",
          text: "text-[#6B2D5C] font-extrabold",
          subtext: "text-zinc-400",
          icon: <Sparkles className="w-5 h-5 text-[#6B2D5C]" />,
          chip: "bg-white border border-zinc-100 text-zinc-600 hover:bg-purple-50 hover:border-purple-100 hover:text-[#6B2D5C]"
        };
      case "soft-blue":
        return {
          container: "bg-white border border-zinc-100 shadow-[0_20px_50px_rgba(59,130,246,0.05)] md:rounded-[3rem]",
          header: "bg-white border-b border-zinc-50 text-zinc-800 py-6",
          userBubble: "bg-blue-600 text-white rounded-[1.5rem] rounded-br-none shadow-lg shadow-blue-600/10",
          botBubble: "bg-zinc-50 text-zinc-800 rounded-[1.5rem] rounded-bl-none border border-zinc-100",
          input: "bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-zinc-100 text-zinc-900 placeholder-zinc-400 rounded-full",
          sendBtn: "bg-blue-600 text-white rounded-full",
          text: "text-blue-600 font-extrabold",
          subtext: "text-zinc-400",
          icon: <Monitor className="w-5 h-5 text-blue-600" />,
          chip: "bg-white border border-zinc-100 text-zinc-600 hover:bg-blue-50 hover:border-blue-100 hover:text-blue-600"
        };
      case "soft-emerald":
        return {
          container: "bg-white border border-zinc-100 shadow-[0_20px_50px_rgba(16,185,129,0.05)] md:rounded-[3rem]",
          header: "bg-white border-b border-zinc-50 text-zinc-800 py-6",
          userBubble: "bg-emerald-600 text-white rounded-[1.5rem] rounded-br-none shadow-lg shadow-emerald-600/10",
          botBubble: "bg-zinc-50 text-zinc-800 rounded-[1.5rem] rounded-bl-none border border-zinc-100",
          input: "bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-zinc-100 text-zinc-900 placeholder-zinc-400 rounded-full",
          sendBtn: "bg-emerald-600 text-white rounded-full",
          text: "text-emerald-600 font-extrabold",
          subtext: "text-zinc-400",
          icon: <Zap className="w-5 h-5 text-emerald-600" />,
          chip: "bg-white border border-zinc-100 text-zinc-600 hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-600"
        };
      case "glass":
        return {
          container: "bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-xl border border-white/30 shadow-[0_0_50px_rgba(0,0,0,0.1)]",
          header: "bg-white/20 border-b border-white/20 text-zinc-800",
          userBubble: "bg-blue-600 text-white rounded-2xl shadow-lg",
          botBubble: "bg-white/40 text-zinc-900 rounded-2xl backdrop-blur-md border border-white/50",
          input: "bg-white/30 border-white/40 text-zinc-900 placeholder-zinc-500",
          sendBtn: "bg-blue-600 text-white",
          text: "text-zinc-800 font-extrabold",
          subtext: "text-zinc-500",
          icon: <Sparkles className="w-5 h-5 text-blue-600" />,
          chip: "bg-white/20 border-white/30 text-zinc-800 hover:bg-white/30"
        };
      case "terminal":
        return {
          container: "bg-black border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] font-mono",
          header: "bg-green-950 border-b border-green-500 text-green-500 uppercase tracking-widest",
          userBubble: "bg-green-900 text-white border border-green-500",
          botBubble: "bg-black text-green-500 border border-green-800",
          input: "bg-black border-green-900 text-green-500 placeholder-green-900",
          sendBtn: "bg-green-500 text-black",
          text: "text-green-500 font-extrabold",
          subtext: "text-green-900",
          icon: <Terminal className="w-5 h-5" />,
          chip: "bg-black border-green-500 text-green-500 hover:bg-green-500/10"
        };
      case "brutal":
        return {
          container: "bg-yellow-400 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]",
          header: "bg-white border-b-4 border-black text-black font-black italic uppercase",
          userBubble: "bg-black text-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
          botBubble: "bg-white text-black border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
          input: "bg-white border-4 border-black text-black font-bold placeholder-zinc-400",
          sendBtn: "bg-black text-white",
          text: "text-black font-black",
          subtext: "text-black opacity-50",
          icon: <Layout className="w-5 h-5 fill-black" />,
          chip: "bg-white border-4 border-black text-black hover:bg-yellow-200"
        };
      case "neumorphic":
        return {
          container: "bg-zinc-100 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] border border-white/50",
          header: "bg-zinc-100 border-b border-zinc-200 text-zinc-800 font-bold",
          userBubble: "bg-zinc-100 shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] text-zinc-900 rounded-[2rem]",
          botBubble: "bg-zinc-100 shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] text-zinc-800 rounded-[2rem]",
          input: "bg-zinc-100 shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] border-none text-zinc-900 placeholder-zinc-400",
          sendBtn: "bg-[#D63384] text-white shadow-lg",
          text: "text-zinc-900 font-black",
          subtext: "text-zinc-500 font-bold",
          icon: <Monitor className="w-5 h-5 text-zinc-400" />,
          chip: "bg-zinc-100 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] text-zinc-600 hover:shadow-inner"
        };
      case "ecommerce":
        return {
          container: "bg-white border border-orange-100 shadow-xl shadow-orange-500/5 md:rounded-[3rem]",
          header: "bg-orange-600 py-6 text-white shadow-lg",
          userBubble: "bg-orange-600 text-white rounded-2xl shadow-md shadow-orange-600/20",
          botBubble: "bg-zinc-50 text-zinc-800 rounded-2xl border border-zinc-100",
          input: "bg-white border-zinc-200 text-zinc-900 rounded-2xl",
          sendBtn: "bg-orange-600 text-white",
          text: "text-orange-600 font-black",
          subtext: "text-orange-200",
          icon: <ShoppingBag className="w-5 h-5 text-white" />,
          chip: "bg-white border-orange-100 text-orange-600 hover:bg-orange-50"
        };
      case "corporate":
        return {
          container: "bg-white border border-blue-900/10 shadow-2xl md:rounded-[3rem]",
          header: "bg-[#002D72] py-6 text-white",
          userBubble: "bg-[#002D72] text-white rounded-xl shadow-lg",
          botBubble: "bg-zinc-50 text-[#002D72] border border-blue-900/10 rounded-xl",
          input: "bg-white border-zinc-300 text-zinc-900",
          sendBtn: "bg-[#002D72] text-white",
          text: "text-[#002D72] font-extrabold",
          subtext: "text-blue-200",
          icon: <Landmark className="w-5 h-5 text-white" />,
          chip: "bg-white border-blue-900/10 text-[#002D72] hover:bg-blue-50"
        };
      case "creative":
        return {
          container: "bg-white border-t-8 border-[#D63384] shadow-2xl md:rounded-[3rem]",
          header: "bg-white py-8 text-[#D63384] border-b",
          userBubble: "bg-[#D63384] text-white rounded-[2rem] shadow-xl shadow-pink-500/20",
          botBubble: "bg-zinc-900 text-white rounded-[2rem]",
          input: "bg-zinc-100 border-none text-zinc-900 placeholder-zinc-400 rounded-full",
          sendBtn: "bg-[#D63384] text-white",
          text: "text-[#D63384] font-black italic",
          subtext: "text-zinc-400",
          icon: <Palette className="w-6 h-6" />,
          chip: "bg-white border-2 border-[#D63384] text-[#D63384] hover:bg-[#D63384] hover:text-white"
        };
      case "legal":
        return {
          container: "bg-[#FDFBF7] border border-[#2C2420]/10 shadow-2xl md:rounded-3xl",
          header: "bg-[#2C2420] py-6 text-[#D4C4A8]",
          userBubble: "bg-[#2C2420] text-[#D4C4A8] rounded-md",
          botBubble: "bg-white text-[#2C2420] border border-[#2C2420]/20 rounded-md shadow-sm",
          input: "bg-white border-[#2C2420]/20 text-[#2C2420] font-serif",
          sendBtn: "bg-[#2C2420] text-[#D4C4A8]",
          text: "text-[#2C2420] font-serif font-bold uppercase",
          subtext: "text-[#D4C4A8]/60",
          icon: <Gavel className="w-5 h-5" />,
          chip: "bg-white border border-[#2C2420]/20 text-[#2C2420] hover:bg-[#FDFBF7]"
        };
      case "vibrant":
        return {
          container: "bg-cyan-950 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)] md:rounded-[3rem]",
          header: "bg-cyan-900/50 py-6 text-cyan-400 border-b border-cyan-500/30",
          userBubble: "bg-cyan-500 text-black font-bold rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)]",
          botBubble: "bg-zinc-900/80 text-cyan-100 border border-cyan-500/20 rounded-2xl",
          input: "bg-cyan-900/40 border-cyan-500/30 text-cyan-100",
          sendBtn: "bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.5)]",
          text: "text-cyan-400 font-black",
          subtext: "text-cyan-800",
          icon: <Zap className="w-5 h-5 text-cyan-400" />,
          chip: "bg-cyan-900/50 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black"
        };
      default:
        return {
          container: "bg-zinc-950 border border-zinc-800 shadow-2xl shadow-black/50 md:rounded-[3rem]",
          header: "bg-zinc-900/50 border-b border-zinc-800 text-white",
          userBubble: "bg-blue-600 text-white rounded-2xl rounded-br-none",
          botBubble: "bg-zinc-800 text-zinc-100 rounded-2xl rounded-bl-none",
          input: "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-600",
          sendBtn: "bg-white text-black",
          text: "text-white font-extrabold",
          subtext: "text-zinc-500",
          icon: <Bot className="w-5 h-5 text-blue-500" />,
          chip: "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
        };
    }
  };

  const s = getThemeStyles();

  if (fetching) return (
    <div className="h-[100dvh] bg-zinc-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-[#D63384] animate-spin" />
        <p className="text-sm font-black text-zinc-400 uppercase tracking-widest animate-pulse">Asistan Bağlanıyor...</p>
      </div>
    </div>
  );

  return (
    <div className={`h-[100dvh] flex items-center justify-center bg-zinc-100/50 transition-all overflow-hidden`}>
      <div className={`w-full max-w-4xl h-full md:h-[90dvh] md:max-h-[850px] flex flex-col overflow-hidden transition-all duration-500 shadow-2xl ${s.container}`}>
        
        {/* Header */}
        <div className={`p-5 md:p-6 flex items-center justify-between shrink-0 relative z-10 ${s.header}`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl flex items-center justify-center shadow-inner">
              {s.icon}
            </div>
            <div>
              <h1 className={`text-lg md:text-xl font-extrabold uppercase tracking-tight leading-none mb-1 ${s.text}`}>{assistant?.name}</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${s.subtext}`}>● AKTİF</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button className="p-2 opacity-30 hover:opacity-100 transition-opacity"><Globe className="w-5 h-5" /></button>
             <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300">
                <User className="w-5 h-5" />
             </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 md:space-y-8 scrollbar-hide bg-transparent relative">
          <div className="text-center py-8 md:py-12 opacity-5 flex flex-col items-center gap-4">
            <Bot className={`w-12 h-12 md:w-16 md:h-16 ${s.text}`} />
            <span className={`text-[10px] md:text-sm font-black uppercase tracking-[0.5em] ${s.text}`}>SECURE CONNECTION</span>
          </div>

          {/* Floating Robot Background Decor for Soft themes */}
          {theme.startsWith("soft-") && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-[0.03] pointer-events-none">
                <img src="/images/robot.png" alt="" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 md:gap-4 animate-in slide-in-from-bottom-4 duration-500 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${m.role === "assistant" ? s.botBubble : s.userBubble}`}>
                {m.role === "assistant" ? <Bot className="w-4 h-4 md:w-5 md:h-5" /> : <User className="w-4 h-4 md:w-5 md:h-5" />}
              </div>
              <div className={`max-w-[85%] md:max-w-[80%] p-4 md:p-5 text-sm leading-relaxed shadow-sm ${m.role === "assistant" ? s.botBubble : s.userBubble}`}>
                {m.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

         {/* Input Area */}
        <div className="p-4 md:p-8 shrink-0 relative z-10 bg-transparent">
          {/* Quick Actions Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide no-scrollbar">
            {QUICK_ACTIONS.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action.label)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[11px] md:text-xs font-bold whitespace-nowrap transition-all border shadow-sm ${s.chip || "bg-white border-zinc-100 text-zinc-600 hover:bg-zinc-50"}`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 md:gap-3 relative items-center">
            <input 
              type="text" 
              placeholder="Mesajınızı yazın..." 
              className={`flex-1 px-6 md:px-10 py-5 md:py-6 text-sm md:text-base font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/5 transition-all ${s.input}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              disabled={loading} 
              type="submit"
              className={`w-14 h-14 md:w-20 md:h-20 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl shrink-0 ${s.sendBtn}`}
            >
              {loading ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <Send className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          </form>
          <p className={`mt-4 text-center text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] opacity-20 ${s.text}`}>
            POWERED BY AI ASİSTAN V2.0
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PublicChatPage({ params }: { params: Promise<{ assistantId: string }> }) {
    return (
        <Suspense fallback={<div className="h-[100dvh] flex items-center justify-center bg-zinc-50"><Loader2 className="w-12 h-12 text-[#D63384] animate-spin" /></div>}>
            <ChatContent params={params} />
        </Suspense>
    );
}
