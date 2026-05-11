"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, RotateCcw, Loader2, Sparkles, Shield, Zap, Diamond } from "lucide-react";
import { getPublicAssistant } from "@/actions/assistant-actions";
import { toast } from "react-hot-toast";

export default function PublicChatPage({ params }: { params: Promise<{ assistantId: string }> }) {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [assistantId, setAssistantId] = useState<string>("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [assistant, setAssistant] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`session_${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    params.then(p => setAssistantId(p.assistantId));
  }, [params]);

  useEffect(() => {
    if (!assistantId) return;
    async function loadInfo() {
      const result = await getPublicAssistant(assistantId);
      if (result.success) setAssistant(result.assistant);
    }
    loadInfo();
  }, [assistantId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !assistantId) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assistantId, question: userMsg, sessionId: sessionId.current }),
      });
      const data = await response.json();
      if (data.answer) setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Üzgünüm, şu an bağlantı kurulamadı." }]);
    } finally {
      setLoading(false);
    }
  };

  const theme = assistant?.theme || "default";
  
  const getThemeStyles = () => {
    switch (theme) {
      case "vibrant": // CYBERPUNK STYLE
        return {
          container: "bg-black font-mono",
          overlay: "bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20",
          card: "bg-zinc-950 border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]",
          header: "border-b-2 border-cyan-500/50 bg-black text-cyan-400",
          bubbleAi: "bg-black border border-cyan-500/30 text-cyan-100 rounded-none clip-path-polygon-[0_0,100%_0,100%_80%,90%_100%,0_100%]",
          bubbleUser: "bg-cyan-600 text-black font-bold rounded-none clip-path-polygon-[10%_0,100%_0,100%_100%,0_100%,0_20%]",
          input: "bg-black border-2 border-cyan-500/20 text-cyan-400 placeholder:text-cyan-900 rounded-none",
          button: "bg-cyan-500 hover:bg-cyan-400 text-black rounded-none shadow-[0_0_15px_rgba(6,182,212,0.5)]",
          icon: <Zap className="w-5 h-5" />,
          footer: "border-t-2 border-cyan-500/50",
          bgEffect: <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-cyan-500/5 to-transparent animate-pulse" />
        };
      case "glass": // FLOATING LUXURY
        return {
          container: "bg-gradient-to-tr from-zinc-900 via-slate-900 to-black p-4 md:p-8",
          overlay: "backdrop-blur-3xl",
          card: "max-w-xl mx-auto h-[90vh] rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden bg-white/5",
          header: "bg-white/10 border-b border-white/10 backdrop-blur-md",
          bubbleAi: "bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] rounded-tl-none text-white",
          bubbleUser: "bg-white text-black rounded-[2rem] rounded-br-none shadow-xl",
          input: "bg-white/5 border border-white/10 rounded-full text-white px-6",
          button: "bg-white text-black rounded-full p-4 hover:scale-110",
          icon: <Sparkles className="w-5 h-5 text-yellow-400" />,
          footer: "bg-transparent border-t border-white/5 px-8 pb-8",
          bgEffect: <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px]" />
        };
      case "minimal": // ELEGANT GOLD
        return {
          container: "bg-[#0a0a0a] font-serif",
          overlay: "",
          card: "bg-[#0a0a0a] border-x border-amber-900/30 shadow-2xl",
          header: "border-b border-amber-900/30 py-8",
          bubbleAi: "bg-transparent border-l-2 border-amber-600 pl-4 text-zinc-300 rounded-none",
          bubbleUser: "bg-amber-900/20 border border-amber-600/30 text-amber-100 rounded-none italic",
          input: "bg-transparent border-b border-amber-900/50 rounded-none text-amber-200 placeholder:text-zinc-800 focus:border-amber-500",
          button: "bg-amber-600 hover:bg-amber-500 text-black rounded-none transition-all duration-500",
          icon: <Diamond className="w-5 h-5" />,
          footer: "border-t border-amber-900/30",
          bgEffect: null
        };
      default: // DEEP ABYSS (Modern Dark)
        return {
          container: "bg-[#050505]",
          overlay: "bg-[radial-gradient(circle_at_50%_50%,#1a1a1a,0%,#050505_100%)]",
          card: "bg-zinc-900/50 backdrop-blur-xl border border-white/5 shadow-2xl md:rounded-[2rem] md:my-4",
          header: "border-b border-white/5 bg-black/20",
          bubbleAi: "bg-zinc-800/50 border border-white/5 text-zinc-200 rounded-2xl rounded-tl-none",
          bubbleUser: "bg-blue-600 text-white rounded-2xl rounded-br-none shadow-[0_10px_30px_-10px_rgba(37,99,235,0.5)]",
          input: "bg-zinc-800/50 border border-white/10 rounded-2xl text-white",
          button: "bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-lg",
          icon: <Shield className="w-5 h-5" />,
          footer: "border-t border-white/5 bg-black/20",
          bgEffect: null
        };
    }
  };

  const s = getThemeStyles();

  return (
    <div className={`flex flex-col h-screen ${s.container} relative overflow-hidden transition-all duration-1000`}>
      {s.bgEffect}
      <div className={`flex flex-col h-full w-full transition-all duration-1000 relative z-10 ${s.overlay} ${s.card}`}>
        {/* Header */}
        <header className={`p-6 flex items-center justify-between transition-colors duration-500 ${s.header}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 flex items-center justify-center transition-transform hover:rotate-12 ${theme === 'vibrant' ? 'bg-cyan-500 text-black' : 'bg-white/5 text-blue-500 rounded-xl'}`}>
              {s.icon}
            </div>
            <div>
              <h1 className={`font-bold text-xl tracking-tight`}>{assistant?.name || "AI Asistan"}</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-black opacity-50">Sistem Aktif</span>
              </div>
            </div>
          </div>
          <button onClick={() => setMessages([])} className="p-2 opacity-50 hover:opacity-100 transition-opacity">
            <RotateCcw className="w-5 h-5" />
          </button>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {messages.length === 0 && (
            <div className="text-center py-24 animate-in fade-in zoom-in duration-1000">
               <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-all hover:scale-110 ${theme === 'vibrant' ? 'border-2 border-cyan-500 text-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'bg-white/5 text-blue-500'}`}>
                  <Bot className="w-12 h-12" />
               </div>
               <h2 className="text-3xl font-black mb-4 tracking-tighter uppercase italic">Sistem Başlatıldı</h2>
               <p className="text-sm opacity-60 px-12 leading-loose max-w-md mx-auto">
                 Protokol: <b>RAG-ALPHA-01</b> aktif. Sorgu bekliyorum...
               </p>
            </div>
          )}
          
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 animate-in slide-in-from-bottom-8 duration-500 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-10 h-10 flex items-center justify-center shrink-0 shadow-2xl ${m.role === "assistant" ? s.bubbleAi : s.bubbleUser} ${theme === 'vibrant' ? 'rounded-none border border-cyan-500' : 'rounded-2xl'}`}>
                {m.role === "assistant" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={`max-w-[80%] p-5 text-sm leading-relaxed shadow-2xl transition-all hover:translate-y-[-2px] ${m.role === "assistant" ? s.bubbleAi : s.bubbleUser}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4 animate-pulse">
              <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${s.bubbleAi}`}><Bot className="w-5 h-5" /></div>
              <div className={`${s.bubbleAi} p-5 flex gap-2 items-center`}>
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Footer */}
        <footer className={`p-6 transition-all duration-500 ${s.footer}`}>
          <form onSubmit={handleSend} className="relative group">
            <input 
              type="text"
              placeholder="Sisteme veri girin..."
              className={`w-full py-5 pl-6 pr-16 text-sm transition-all focus:outline-none focus:ring-0 ${s.input}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-3.5 transition-all active:scale-90 disabled:opacity-30 ${s.button}`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="flex items-center justify-center gap-4 mt-6 opacity-30 text-[8px] font-black uppercase tracking-[0.5em]">
             <div className="h-px flex-1 bg-white/20" />
             AI ASİSTAN PROTOKOLÜ
             <div className="h-px flex-1 bg-white/20" />
          </div>
        </footer>
      </div>
    </div>
  );
}
