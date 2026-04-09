"use client";

import { motion } from "framer-motion";
import { LogIn, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError("Por favor ingresa correo y contraseña.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    if (data.user) {
      if (!data.session) {
         setError("Por favor verifica tu correo antes de continuar.");
         setIsLoading(false);
         return;
      }
      router.push("/dashboard");
    }
  };

  return (
    <div className="w-full max-w-[440px] px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center mb-10"
      >
        <Link href="/" className="mb-8 group relative">
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-500 opacity-0 group-hover:opacity-100" />
          <div className="relative w-20 h-20 bg-primary rounded-[28px] flex items-center justify-center text-white shadow-2xl shadow-primary/20 overflow-hidden transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
             <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
             <LogIn className="w-10 h-10 relative z-10" />
          </div>
        </Link>
        <div className="space-y-2">
           <h1 className="text-4xl font-heading font-black text-white text-center tracking-tight leading-tight uppercase transform scale-y-110 origin-bottom">
             Bienvenido de nuevo
           </h1>
           <p className="text-white/40 text-center font-medium text-lg leading-relaxed max-w-[320px] mx-auto">
             Accede a tu panel para gestionar tu operación IA.
           </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative group mt-4"
      >
        <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[40px] pointer-events-none" />
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/5 p-8 md:p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">Correo Inteligente</label>
              <div className="relative group/input">
                <div className="absolute inset-0 bg-white/[0.02] rounded-2xl group-hover/input:bg-white/[0.04] transition-colors" />
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-primary transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
                  placeholder="restaurante@directo.ia"
                  className="w-full bg-transparent border-none px-14 py-4.5 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-white/10 text-white font-bold relative z-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Llave de acceso</label>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-primary/80 transition-colors">Olvidé mi clave</button>
              </div>
              <div className="relative group/input">
                <div className="absolute inset-0 bg-white/[0.02] rounded-2xl group-hover/input:bg-white/[0.04] transition-colors" />
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-primary transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-none px-14 py-4.5 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-white/10 text-white font-bold relative z-10"
                />
              </div>
            </div>

            <button 
              onClick={handleEmailLogin}
              disabled={isLoading}
              className="w-full group/btn relative bg-white text-black py-4.5 rounded-2xl font-black text-lg transition-all active:scale-[0.98] disabled:opacity-50 mt-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              <span className="relative z-10 group-hover/btn:text-white transition-colors flex items-center justify-center gap-2">
                ENTRAR AL PANEL <ArrowRight className="w-5 h-5" />
              </span>
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em]">
                <span className="bg-[#09090B] px-4 text-white/20">Acceso Rápido</span>
              </div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all text-white font-bold disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </div>
        </div>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center text-white/30 font-bold text-sm mt-8"
      >
        ¿Aún no tienes cuenta? <Link href="/onboarding" className="text-white hover:text-primary transition-colors">Inicia tu piloto gratis</Link>
      </motion.p>
    </div>
  );
}
