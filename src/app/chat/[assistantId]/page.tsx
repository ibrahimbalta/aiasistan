"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, RotateCcw, Loader2 } from "lucide-react";
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

  // Unwrapping params promise
  useEffect(() => {
    params.then(p => setAssistantId(p.assistantId));
  }, [params]);

  // Load assistant info
  useEffect(() => {
    if (!assistantId) return;
    async function loadInfo() {
      const result = await getPublicAssistant(assistantId);
      if (result.success) {
        setAssistant(result.assistant);
      }
    }
    loadInfo();
  }, [assistantId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !assistantId) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assistantId, question: userMessage, sessionId: sessionId.current }),
      });
      const data = await response.json();
      if (data.answer) setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Üzgünüm, şu an cevap veremiyorum." }]);
    } finally {
      setLoading(false);
    }
  };

  // Theme Logic
  const theme = assistant?.theme || "default";
  
  const getThemeStyles = () => {
    switch (theme) {
      case "glass":
        return {
          container: "bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80')] bg-cover bg-center",
          overlay: "backdrop-blur-xl bg-black/40",
          card: "bg-white/10 backdrop-blur-md border-white/20 text-white shadow-2xl",
          bubbleAi: "bg-white/10 backdrop-blur-sm border-white/10 text-white",
          bubbleUser: "bg-blue-600/80 backdrop-blur-sm text-white",
          input: "bg-white/10 border-white/20 text-white placeholder:text-zinc-300",
          button: "bg-blue-600 hover:bg-blue-500",
          text: "text-white",
          subText: "text-zinc-300"
        };
      case "vibrant":
        return {
          container: "bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900",
          overlay: "",
          card: "bg-zinc-900/50 border-white/10 text-white shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]",
          bubbleAi: "bg-zinc-800/80 border-blue-500/30 text-white",
          bubbleUser: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white",
          input: "bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500",
          button: "bg-gradient-to-r from-blue-500 to-indigo-500",
          text: "text-white",
          subText: "text-blue-300"
        };
      case "minimal":
        return {
          container: "bg-zinc-50",
          overlay: "",
          card: "bg-white border-zinc-200 text-zinc-900 shadow-sm",
          bubbleAi: "bg-zinc-100 border-zinc-200 text-zinc-800",
          bubbleUser: "bg-zinc-900 text-white",
          input: "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400",
          button: "bg-zinc-900 hover:bg-zinc-800",
          text: "text-zinc-900",
          subText: "text-zinc-500"
        };
      default: // Sleek Dark
        return {
          container: "bg-zinc-950",
          overlay: "",
          card: "bg-zinc-900 border-white/5 text-white shadow-2xl",
          bubbleAi: "bg-zinc-800 border-white/5 text-white",
          bubbleUser: "bg-blue-600 text-white shadow-lg shadow-blue-600/20",
          input: "bg-zinc-800 border-white/5 text-white placeholder:text-zinc-500",
          button: "bg-blue-600 hover:bg-blue-500",
          text: "text-white",
          subText: "text-zinc-400"
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`flex flex-col h-screen ${styles.container} transition-all duration-700`}>
      <div className={`flex flex-col h-full w-full max-w-2xl mx-auto md:border-x transition-all duration-700 ${styles.overlay} ${styles.card}`}>
        {/* Header */}
        <header className={`p-4 border-b flex items-center justify-between sticky top-0 z-10 transition-colors duration-500 ${theme === 'minimal' ? 'border-zinc-200 bg-white' : 'border-white/10 bg-transparent'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 ${styles.button}`}>
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`font-bold text-lg leading-tight ${styles.text}`}>{assistant?.name || "AI Asistan"}</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className={`text-[10px] uppercase tracking-wider font-bold ${styles.subText}`}>Çevrimiçi</span>
              </div>
            </div>
          </div>
          <button onClick={() => setMessages([])} className={`p-2 transition-colors rounded-lg hover:bg-white/5 ${styles.subText}`} title="Temizle">
            <RotateCcw className="w-5 h-5" />
          </button>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
          {messages.length === 0 && (
            <div className="text-center py-20 animate-in fade-in zoom-in duration-700">
               <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transition-all hover:rotate-6 ${styles.bubbleAi}`}>
                  <Bot className="w-10 h-10 text-blue-500" />
               </div>
               <h2 className={`text-2xl font-bold mb-3 ${styles.text}`}>Merhaba!</h2>
               <p className={`text-sm px-10 leading-relaxed ${styles.subText}`}>
                 Ben <b>{assistant?.name}</b>. Size nasıl yardımcı olabilirim? Aşağıdan bir soru sorarak başlayabilirsiniz.
               </p>
            </div>
          )}
          
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 animate-in slide-in-from-bottom-4 duration-500 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${m.role === "assistant" ? styles.bubbleAi : styles.bubbleUser}`}>
                {m.role === "assistant" ? <Bot className="w-5 h-5 text-blue-500" /> : <User className="w-5 h-5" />}
              </div>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-xl transition-all hover:scale-[1.01] ${m.role === "assistant" ? styles.bubbleAi : styles.bubbleUser}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 animate-pulse">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${styles.bubbleAi}`}><Bot className="w-5 h-5 text-blue-500" /></div>
              <div className={`${styles.bubbleAi} p-4 rounded-2xl flex gap-1.5 items-center`}>
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Footer */}
        <footer className={`p-4 border-t transition-colors duration-500 ${theme === 'minimal' ? 'border-zinc-200 bg-white' : 'border-white/10 bg-transparent'}`}>
          <form onSubmit={handleSend} className="relative group">
            <input 
              type="text"
              placeholder="Mesajınızı yazın..."
              className={`w-full border rounded-2xl pl-5 pr-14 py-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${styles.input}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className={`absolute right-2 top-1/2 -translate-y-1/2 text-white p-3 rounded-xl transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-90 ${styles.button}`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className={`text-[10px] text-center mt-4 font-bold uppercase tracking-[0.25em] transition-colors ${styles.subText}`}>
            AI ASİSTAN TARAFINDAN GÜÇLENDİRİLDİ
          </p>
        </footer>
      </div>
    </div>
  );
}
