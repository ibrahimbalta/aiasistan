"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, RotateCcw, Loader2, Sparkles, Terminal, Zap, Diamond, Ghost, Monitor, Layout } from "lucide-react";
import { getPublicAssistant } from "@/actions/assistant-actions";

export default function PublicChatPage({ params }: { params: Promise<{ assistantId: string }> }) {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [assistantId, setAssistantId] = useState<string>("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [assistant, setAssistant] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`session_${Math.random().toString(36).slice(2)}`);

  useEffect(() => { params.then(p => setAssistantId(p.assistantId)); }, [params]);

  useEffect(() => {
    if (!assistantId) return;
    async function loadInfo() {
      const result = await getPublicAssistant(assistantId);
      if (result.success) setAssistant(result.assistant);
    }
    loadInfo();
  }, [assistantId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

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
      setMessages(prev => [...prev, { role: "assistant", content: "Bağlantı hatası." }]);
    } finally { setLoading(false); }
  };

  const theme = assistant?.theme || "default";
  
  const getThemeStyles = () => {
    switch (theme) {
      case "terminal":
        return {
          container: "bg-black font-mono text-green-500 p-2 md:p-8",
          card: "bg-black border border-green-900/50 relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] before:bg-[length:100%_2px,3px_100%] before:pointer-events-none",
          header: "border-b border-green-900/30 py-4 uppercase tracking-[0.3em] text-xs",
          bubbleAi: "bg-green-950/20 text-green-400 border-l-4 border-green-500 pl-4 py-2",
          bubbleUser: "bg-green-500 text-black px-4 py-2 font-black",
          input: "bg-black border border-green-900 text-green-500 placeholder:text-green-900 focus:border-green-400",
          button: "bg-green-500 text-black hover:bg-green-400",
          icon: <Terminal className="w-5 h-5" />,
          status: "SİSTEM_ÇEVRİMİÇİ",
          welcome: "ANA_BELLEK_YÜKLENDİ. SORGU_BEKLENİYOR..."
        };
      case "brutal":
        return {
          container: "bg-yellow-400 p-4 md:p-12 font-black",
          card: "bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
          header: "border-b-[4px] border-black bg-white p-6",
          bubbleAi: "bg-blue-400 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black",
          bubbleUser: "bg-pink-400 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black ml-auto",
          input: "bg-white border-[3px] border-black text-black placeholder:text-zinc-400 rounded-none",
          button: "bg-black text-white hover:bg-zinc-800 rounded-none",
          icon: <Layout className="w-6 h-6" />,
          status: "AKTİF",
          welcome: "SELAM! NE İSTİYORSUN?"
        };
      case "neumorphic":
        return {
          container: "bg-zinc-100 p-4 md:p-8",
          card: "bg-zinc-100 rounded-[3rem] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] border-none",
          header: "p-8 border-b border-zinc-200/50",
          bubbleAi: "bg-zinc-100 rounded-3xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] text-zinc-700 p-6",
          bubbleUser: "bg-blue-500 rounded-3xl text-white shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff]",
          input: "bg-zinc-100 rounded-2xl shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] border-none text-zinc-800",
          button: "bg-zinc-100 rounded-2xl shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] text-blue-600 hover:text-blue-500",
          icon: <Monitor className="w-5 h-5" />,
          status: "Aktif",
          welcome: "Sana nasıl yardımcı olabilirim?"
        };
      case "holographic":
        return {
          container: "bg-[url('https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80')] bg-cover bg-center",
          card: "bg-white/10 backdrop-blur-2xl border border-white/30 rounded-[2.5rem] shadow-[0_0_40px_rgba(255,255,255,0.1)]",
          header: "bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border-b border-white/20",
          bubbleAi: "bg-gradient-to-br from-white/20 to-white/5 border border-white/30 rounded-3xl rounded-tl-none text-white",
          bubbleUser: "bg-gradient-to-r from-pink-500/80 to-purple-600/80 border border-white/30 rounded-3xl rounded-br-none text-white",
          input: "bg-white/10 border border-white/30 rounded-full text-white px-6",
          button: "bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full",
          icon: <Sparkles className="w-5 h-5 animate-pulse" />,
          status: "EVRENDE",
          welcome: "Kristal berraklığında yardım için buradayım..."
        };
      case "vibrant": // CYBER PROTOCOL
        return {
          container: "bg-black font-mono p-4",
          card: "bg-zinc-950 border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]",
          header: "bg-black border-b-2 border-cyan-500/50 text-cyan-400 p-6",
          bubbleAi: "bg-black border border-cyan-900 text-cyan-200 p-4 clip-path-polygon-[0_0,100%_0,100%_80%,90%_100%,0_100%]",
          bubbleUser: "bg-cyan-600 text-black font-black p-4 clip-path-polygon-[10%_0,100%_0,100%_100%,0_100%,0_20%]",
          input: "bg-black border border-cyan-900 text-cyan-400 placeholder:text-cyan-950",
          button: "bg-cyan-500 text-black font-bold",
          icon: <Zap className="w-5 h-5" />,
          status: "PROTOKOL_ÇALIŞIYOR",
          welcome: "VERİ_GİRİŞİ_BEKLENİYOR..."
        };
      case "minimal": // LUXURY GOLD
        return {
          container: "bg-[#0a0a0a] font-serif p-4 md:p-12",
          card: "bg-[#0a0a0a] border border-amber-900/30 shadow-2xl",
          header: "border-b border-amber-900/30 text-amber-500 tracking-[0.5em] text-center",
          bubbleAi: "bg-transparent border-l border-amber-600 pl-6 py-4 text-zinc-300 italic",
          bubbleUser: "bg-amber-900/10 border border-amber-600/20 text-amber-200 px-6 py-4",
          input: "bg-transparent border-b border-amber-900/50 text-amber-100 placeholder:text-zinc-900 rounded-none",
          button: "bg-amber-600 text-black font-bold",
          icon: <Diamond className="w-5 h-5" />,
          status: "ÇEVRİMİÇİ",
          welcome: "Nasıl hizmet edebilirim?"
        };
      case "glass": // FLOATING GLASS
        return {
          container: "bg-zinc-900 p-4 md:p-12",
          card: "bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden",
          header: "bg-white/5 border-b border-white/5 p-8",
          bubbleAi: "bg-white/5 border border-white/5 rounded-3xl rounded-tl-none text-white p-6",
          bubbleUser: "bg-blue-600 border border-white/10 rounded-3xl rounded-br-none text-white",
          input: "bg-white/5 border border-white/10 rounded-full text-white px-6",
          button: "bg-white text-black rounded-full",
          icon: <Sparkles className="w-5 h-5" />,
          status: "Yayında",
          welcome: "Sizin için buradayım..."
        };
      default: // DEEP ABYSS
        return {
          container: "bg-black p-4 md:p-8",
          card: "bg-zinc-900/80 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl",
          header: "bg-black/20 border-b border-white/5 p-6",
          bubbleAi: "bg-zinc-800/50 border border-white/5 rounded-2xl rounded-tl-none text-zinc-200",
          bubbleUser: "bg-blue-600 text-white rounded-2xl rounded-br-none",
          input: "bg-zinc-800/50 border border-white/10 rounded-2xl text-white",
          button: "bg-blue-600 text-white",
          icon: <Ghost className="w-5 h-5" />,
          status: "Aktif",
          welcome: "Merhaba, size nasıl yardımcı olabilirim?"
        };
    }
  };

  const s = getThemeStyles();

  return (
    <div className={`flex flex-col h-screen ${s.container} transition-all duration-1000 overflow-hidden relative`}>
      <div className={`flex flex-col h-full w-full max-w-2xl mx-auto transition-all duration-1000 relative z-10 ${s.card}`}>
        {/* Header */}
        <header className={`flex items-center justify-between transition-colors duration-500 ${s.header}`}>
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 flex items-center justify-center transition-transform hover:rotate-12 ${theme === 'brutal' ? 'bg-black text-white' : 'bg-white/5 text-blue-400'}`}>
              {s.icon}
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">{assistant?.name || "Asistan"}</h1>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${theme === 'terminal' ? 'bg-green-500' : 'bg-green-400 animate-pulse'}`} />
                <span className="text-[10px] uppercase tracking-widest font-black opacity-50">{s.status}</span>
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
            <div className="text-center py-20 animate-in fade-in zoom-in duration-1000 px-8">
               <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 transition-all hover:scale-110 ${theme === 'terminal' ? 'border border-green-500' : theme === 'brutal' ? 'border-4 border-black bg-white' : 'bg-white/5'}`}>
                  <Bot className="w-10 h-10" />
               </div>
               <h2 className={`text-2xl font-black mb-4 ${theme === 'terminal' ? 'uppercase' : ''}`}>BAĞLANTI KURULDU</h2>
               <p className="text-sm opacity-60 leading-loose italic">{s.welcome}</p>
            </div>
          )}
          
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 animate-in slide-in-from-bottom-8 duration-500 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-9 h-9 flex items-center justify-center shrink-0 shadow-xl ${m.role === "assistant" ? s.bubbleAi : s.bubbleUser} ${theme === 'terminal' || theme === 'brutal' || theme === 'minimal' ? 'rounded-none' : 'rounded-xl'}`}>
                {m.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`max-w-[85%] p-4 text-sm leading-relaxed shadow-xl transition-all ${m.role === "assistant" ? s.bubbleAi : s.bubbleUser}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4 animate-pulse">
              <div className={`w-9 h-9 flex items-center justify-center shrink-0 ${s.bubbleAi} ${theme === 'terminal' || theme === 'brutal' ? 'rounded-none' : 'rounded-xl'}`}><Bot className="w-4 h-4" /></div>
              <div className={`${s.bubbleAi} p-4 flex gap-2 items-center`}>
                 <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" />
                 <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                 <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Footer */}
        <footer className={`p-6 bg-transparent transition-all duration-500 ${theme === 'terminal' || theme === 'minimal' ? 'border-t border-current/20' : ''}`}>
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text"
              placeholder={theme === 'terminal' ? "> SORGULAMA_BEKLENİYOR..." : "Mesajınızı yazın..."}
              className={`w-full py-4 pl-6 pr-14 text-sm transition-all focus:outline-none focus:ring-0 ${s.input}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 transition-all active:scale-90 disabled:opacity-30 ${s.button}`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-[8px] text-center mt-6 opacity-30 font-black uppercase tracking-[0.4em]">
             SİSTEM GÜVENLİĞİ AKTİF • AI PLATFORM
          </div>
        </footer>
      </div>
    </div>
  );
}
