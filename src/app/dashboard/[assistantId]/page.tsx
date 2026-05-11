"use client";

import { MessageSquare, Send, Bot, User, Share2, Code, Settings, Trash2, FileText, PlusCircle } from "lucide-react";
import React, { useState } from "react";

export default function AssistantDetailPage({ params }: { params: { assistantId: string } }) {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Merhaba! Ben senin özel asistanınım. Sana nasıl yardımcı olabilirim?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: "Bu bir simülasyon cevabıdır. RAG sistemi bağlandığında gerçek verilerinle cevap vereceğim." }]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">
            A
          </div>
          <div>
            <h1 className="text-2xl font-bold">Asistan Adı</h1>
            <p className="text-zinc-500 text-sm">ID: {params.assistantId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium">
            <Share2 className="w-4 h-4" />
            Paylaş
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium">
            <Code className="w-4 h-4" />
            Widget Kodu
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/5">
        {[
          { id: "chat", label: "Test Chat", icon: <MessageSquare className="w-4 h-4" /> },
          { id: "knowledge", label: "Bilgi Kaynakları", icon: <Settings className="w-4 h-4" /> },
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
                    {m.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                    m.role === "assistant" ? "bg-white/5 border border-white/10" : "bg-blue-600 text-white"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSend} className="p-4 border-t border-white/5 flex gap-3">
              <input 
                type="text"
                placeholder="Bir soru sor..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button className="bg-white text-black p-3 rounded-xl hover:bg-zinc-200 transition-all active:scale-95">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {activeTab === "knowledge" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Bilgi Kaynakları</h3>
              <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Kaynak Ekle
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1].map((_, i) => (
                <div key={i} className="p-4 rounded-xl glass-morphism border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium">bilgi-bankasi.pdf</div>
                      <div className="text-xs text-zinc-500">2.4 MB • 12 Sayfa</div>
                    </div>
                  </div>
                  <button className="p-2 text-zinc-500 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { PlusCircle } from "lucide-react";
