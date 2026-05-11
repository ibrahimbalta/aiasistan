"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import Link from "next/link";
import { Bot, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message === "Invalid login credentials" 
        ? "E-posta veya şifre hatalı." 
        : error.message);
    } else {
      router.push("/dashboard");
      router.refresh();
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
        <h1 className="text-2xl font-bold mb-2">Tekrar hoş geldin</h1>
        <p className="text-zinc-400 mb-8 text-sm">Giriş yapmak için e-posta ve şifreni gir.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

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

          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                required
                type="password"
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Giriş Yap"}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      </div>

      <p className="mt-8 text-zinc-500 text-sm">
        Hesabın yok mu? <Link href="/sign-up" className="text-white font-medium hover:underline">Ücretsiz Kayıt Ol</Link>
      </p>
    </div>
  );
}
