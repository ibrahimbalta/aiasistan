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
  const [assistantName, setAssistantName] = useState("AI Asistan");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`session_${Math.random().toString(36).slice(2)}`);

  // Unwrapping params promise
  useEffect(() => {
    params.then(p => setAssistantId(p.assistantId));
  }, [params]);

  // Load assistant name
  useEffect(() => {
    if (!assistantId) return;
    async function loadInfo() {
      const result = await getPublicAssistant(assistantId);
      if (result.success) {
        setAssistantName(result.assistant.name);
      }
    }
    loadInfo();
  }, [assistantId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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
        body: JSON.stringify({
          assistantId: assistantId,
          question: userMessage,
          sessionId: sessionId.current
        }),
      });

      const data = await response.json();
      
      if (data.answer) {
        setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
      } else {
        throw new Error("Cevap alınamadı.");
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Üzgünüm, şu an cevap veremiyorum. Lütfen biraz sonra tekrar deneyin." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-zinc-950 text-black dark:text-white max-w-2xl mx-auto md:border-x border-zinc-200 dark:border-zinc-800 shadow-2xl">
      {/* Header */}
      <header className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-zinc-900 dark:text-white">{assistantName}</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Çevrimiçi</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([])}
          className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
          title="Sohbeti Temizle"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
        {messages.length === 0 && (
          <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
             <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-blue-500" />
             </div>
             <h2 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white">Merhaba!</h2>
             <p className="text-zinc-500 text-sm px-8">Ben {assistantName}. Sana nasıl yardımcı olabilirim? Aşağıdan bir soru sorarak başlayabilirsin.</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 animate-in slide-in-from-bottom-2 duration-300 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
              m.role === "assistant" ? "bg-blue-600 text-white" : "bg-zinc-100 dark:bg-zinc-800"
            }`}>
              {m.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />}
            </div>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
              m.role === "assistant" 
                ? "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200" 
                : "bg-blue-600 text-white"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-2xl flex gap-1.5 items-center">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Footer / Input */}
      <footer className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 sticky bottom-0">
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text"
            placeholder="Mesajınızı yazın..."
            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-4 pr-12 py-4 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-zinc-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50 disabled:scale-90 active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-[9px] text-center text-zinc-400 mt-3 font-medium uppercase tracking-[0.2em]">
          AI ASİSTAN TARAFINDAN GÜÇLENDİRİLDİ
        </p>
      </footer>
    </div>
  );
}
