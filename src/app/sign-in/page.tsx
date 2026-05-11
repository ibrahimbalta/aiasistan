"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bot, Mail, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      setIsSent(true);
      toast.success("Giriş bağlantısı e-posta adresinize gönderildi!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-12 group">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <Bot className="text-black w-6 h-6" />
        </div>
        <span className="font-bold text-2xl tracking-tight">AI Asistan</span>
      </Link>

      <div className="w-full max-w-md p-8 rounded-3xl glass-morphism border border-white/10 shadow-2xl">
        {!isSent ? (
          <>
            <h1 className="text-2xl font-bold mb-2">Tekrar hoş geldin</h1>
            <p className="text-zinc-400 mb-8 text-sm">Giriş yapmak için e-posta adresini gir. Şifreye ihtiyacın yok!</p>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">E-posta Adresi</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    required
                    type="email"
                    placeholder="ornek@eposta.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Giriş Bağlantısı Gönder"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">E-postanı kontrol et</h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              <strong>{email}</strong> adresine bir giriş bağlantısı gönderdik. Lütfen gelen kutunu kontrol et.
            </p>
            <button 
              onClick={() => setIsSent(false)}
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              Farklı bir e-posta dene
            </button>
          </div>
        )}
      </div>

      <p className="mt-8 text-zinc-500 text-sm">
        Hesabın yok mu? <Link href="/sign-up" className="text-white font-medium hover:underline">Ücretsiz Kayıt Ol</Link>
      </p>
    </div>
  );
}
