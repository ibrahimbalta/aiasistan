"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Send, Bot, User, Loader2, Sparkles, Zap, Shield, Globe, Terminal, Layout, Monitor, Ghost, Diamond, ShoppingBag, Landmark, Palette, Gavel, Headphones, FileText, Tag, RefreshCcw } from "lucide-react";
import { getChatAssistant } from "@/actions/assistant-actions";
import { toast } from "react-hot-toast";

export default function PublicChatPage({ params }: { params: Promise<{ assistantId: string }> }) {
  const [assistant, setAssistant] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [assistantId, setAssistantId] = useState("");

  useEffect(() => { params.then(p => setAssistantId(p.assistantId)); }, [params]);

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
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assistantId, question: userMsg, sessionId: "public-session" }),
      });
      const data = await response.json();
      if (data.answer) setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (text: string) => {
    if (loading) return;
    setInput(text);
    // Otomatik gönderim için form submit'i tetikleyebiliriz veya doğrudan handleSend'e benzer bir mantık kurabiliriz.
    // Şimdilik sadece input'a yazıp kullanıcıya kontrol şansı verelim veya doğrudan gönderelim.
    // Doğrudan gönderim daha iyi bir deneyim:
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    
    // State güncellenmesi asenkron olduğu için doğrudan text'i kullanan bir fonksiyon çağırmalıyız.
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
      case "glass":
        return {
          container: "bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-xl border border-white/30 shadow-[0_0_50px_rgba(0,0,0,0.1)]",
          header: "bg-white/20 border-b border-white/20 text-zinc-800",
          userBubble: "bg-blue-600 text-white rounded-2xl shadow-lg",
          botBubble: "bg-white/40 text-zinc-900 rounded-2xl backdrop-blur-md border border-white/50",
          input: "bg-white/30 border-white/40 text-zinc-900 placeholder-zinc-500",
          sendBtn: "bg-blue-600 text-white",
          text: "text-zinc-800",
          subtext: "text-zinc-500",
          icon: <Sparkles className="w-5 h-5 text-blue-600" />,
          chip: "bg-white/20 border-white/30 text-zinc-800 hover:bg-white/30"
        };
      case "vibrant":
        return {
          container: "bg-zinc-950 border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]",
          header: "bg-zinc-900 border-b border-cyan-500/30 text-cyan-400",
          userBubble: "bg-cyan-600 text-white rounded-none border-l-4 border-white",
          botBubble: "bg-zinc-800 text-cyan-50 rounded-none border-r-4 border-cyan-500",
          input: "bg-zinc-900 border-cyan-900 text-cyan-400 placeholder-cyan-900",
          sendBtn: "bg-cyan-500 text-black",
          text: "text-cyan-400",
          subtext: "text-cyan-800",
          icon: <Zap className="w-5 h-5 animate-pulse" />,
          chip: "bg-zinc-900 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
        };
      case "terminal":
        return {
          container: "bg-black border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] font-mono",
          header: "bg-green-950 border-b border-green-500 text-green-500 uppercase tracking-widest",
          userBubble: "bg-green-900 text-white border border-green-500",
          botBubble: "bg-black text-green-500 border border-green-800",
          input: "bg-black border-green-900 text-green-500 placeholder-green-900",
          sendBtn: "bg-green-500 text-black",
          text: "text-green-500",
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
          container: "bg-white border-none shadow-[0_20px_50px_rgba(255,107,0,0.15)] rounded-[2.5rem]",
          header: "bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-[2.5rem] py-6",
          userBubble: "bg-zinc-100 text-zinc-900 rounded-2xl rounded-br-none",
          botBubble: "bg-orange-50 text-orange-900 rounded-2xl rounded-bl-none border border-orange-100",
          input: "bg-zinc-50 border-zinc-100 rounded-full px-6 py-4 text-zinc-900",
          sendBtn: "bg-orange-500 text-white shadow-orange-500/20",
          text: "text-zinc-900 font-black",
          subtext: "text-orange-200",
          icon: <ShoppingBag className="w-5 h-5" />,
          chip: "bg-orange-50 border-orange-100 text-orange-600 hover:bg-orange-100"
        };
      case "corporate":
        return {
          container: "bg-white border border-zinc-100 shadow-2xl rounded-none",
          header: "bg-[#002D72] text-white py-6 px-8 flex items-center justify-between",
          userBubble: "bg-[#002D72] text-white rounded-sm",
          botBubble: "bg-[#F3F4F6] text-[#1F2937] border-l-4 border-[#002D72] rounded-sm",
          input: "bg-white border border-zinc-200 rounded-none text-zinc-900",
          sendBtn: "bg-[#002D72] text-white",
          text: "text-zinc-900 font-bold",
          subtext: "text-zinc-400",
          icon: <Landmark className="w-5 h-5" />,
          chip: "bg-white border border-[#002D72] text-[#002D72] hover:bg-blue-50"
        };
      case "creative":
        return {
          container: "bg-white border-[10px] border-zinc-900 shadow-[20px_20px_0px_#D63384]",
          header: "bg-zinc-900 text-white p-6 font-black uppercase italic tracking-tighter",
          userBubble: "bg-[#D63384] text-white skew-x-[-10deg]",
          botBubble: "bg-yellow-400 text-black skew-x-[10deg] font-black",
          input: "bg-zinc-100 border-b-4 border-black text-black font-black uppercase",
          sendBtn: "bg-black text-white hover:bg-zinc-800",
          text: "text-black font-black",
          subtext: "text-zinc-400",
          icon: <Palette className="w-5 h-5 text-yellow-400" />,
          chip: "bg-white border-2 border-black text-black hover:bg-[#D63384] hover:text-white"
        };
      case "legal":
        return {
          container: "bg-[#FDFBF7] border border-[#D4C4A8] shadow-inner rounded-lg font-serif",
          header: "bg-[#2C2420] text-[#D4C4A8] py-8 border-b-2 border-[#D4C4A8]",
          userBubble: "bg-[#4A3F35] text-white rounded-none italic",
          botBubble: "bg-white text-[#2C2420] border border-[#D4C4A8] rounded-none",
          input: "bg-white border border-[#D4C4A8] text-[#2C2420] italic",
          sendBtn: "bg-[#2C2420] text-[#D4C4A8]",
          text: "text-[#2C2420] font-bold",
          subtext: "text-[#4A3F35] opacity-60",
          icon: <Gavel className="w-5 h-5" />,
          chip: "bg-[#FDFBF7] border border-[#D4C4A8] text-[#2C2420] italic hover:bg-[#F3EFE7]"
        };
      default:
        return {
          container: "bg-zinc-950 border border-zinc-800 shadow-2xl shadow-black/50",
          header: "bg-zinc-900/50 border-b border-zinc-800 text-white",
          userBubble: "bg-blue-600 text-white rounded-2xl rounded-br-none",
          botBubble: "bg-zinc-800 text-zinc-100 rounded-2xl rounded-bl-none",
          input: "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-600",
          sendBtn: "bg-white text-black",
          text: "text-white",
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
      <div className={`w-full max-w-4xl h-full md:h-[90dvh] md:max-h-[850px] flex flex-col overflow-hidden transition-all duration-500 shadow-2xl md:rounded-[3rem] ${s.container}`}>
        
        {/* Header */}
        <div className={`p-5 md:p-6 flex items-center justify-between shrink-0 relative z-10 ${s.header}`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl flex items-center justify-center shadow-inner">
              {s.icon}
            </div>
            <div>
              <h1 className={`text-lg md:text-xl font-black uppercase tracking-tight leading-none mb-1 ${s.text}`}>{assistant?.name}</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${s.subtext}`}>● AKTİF</span>
              </div>
            </div>
          </div>
          <button className="p-2 opacity-50 hover:opacity-100 transition-opacity"><Globe className="w-5 h-5" /></button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 md:space-y-8 scrollbar-hide bg-transparent">
          <div className="text-center py-8 md:py-12 opacity-10 flex flex-col items-center gap-4">
            <Bot className={`w-12 h-12 md:w-16 md:h-16 ${s.text}`} />
            <span className={`text-[10px] md:text-sm font-black uppercase tracking-[0.5em] ${s.text}`}>GÜVENLİ BAĞLANTI</span>
          </div>

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
        <div className="p-4 md:p-8 shrink-0 relative z-10 bg-transparent border-t border-white/5">
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
              className={`flex-1 px-5 md:px-8 py-4 md:py-5 rounded-2xl text-sm md:text-base font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all ${s.input}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              disabled={loading} 
              type="submit"
              className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl shrink-0 ${s.sendBtn}`}
            >
              {loading ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <Send className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          </form>
          <p className={`mt-3 text-center text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-30 ${s.text}`}>
            SECURE AI PROTOCOL V2.0
          </p>
        </div>
      </div>
    </div>
  );
}
