"use client";

import { useOnboarding } from "@/app/context/OnboardingContext";
import { motion } from "framer-motion";
import { ArrowRight, LogIn, Mail } from "lucide-react";
import { ProgressBar } from "../ui/ProgressBar";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function AuthStep() {
  const { data, nextStep, updateData } = useOnboarding();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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

  const handleEmailAuth = async (type: "login" | "signup") => {
    if (!email || !password) {
      setError("Por favor ingresa correo y contraseña.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    let authError = null;

    if (type === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        }
      });
      authError = error;
      if (!error && data.user) {
        if (!data.session) {
           setError("Cuenta creada. Por favor verifica tu correo de confirmación antes de continuar.");
           setIsLoading(false);
           return;
        }
        updateData({ email: data.user.email });
        nextStep(); 
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      authError = error;
      if (!error && data.user) {
        if (!data.session) {
           setError("Por favor verifica tu correo de confirmación antes de continuar.");
           setIsLoading(false);
           return;
        }
        updateData({ email: data.user.email });
        nextStep();
      }
    }

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 max-w-2xl mx-auto py-12 pt-16 font-sans text-foreground">
      <ProgressBar currentStep={0} totalSteps={7} />
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center gap-6 mt-8"
      >
        <div className="w-16 h-16 bg-primary rounded-[22px] flex items-center justify-center text-white shadow-lg shadow-primary/20">
           <LogIn className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-2">
           <h2 className="text-3xl md:text-3xl font-extrabold text-foreground tracking-tight font-heading uppercase">Crea tu Cuenta</h2>
           <p className="text-lg text-foreground/50 max-w-md mx-auto font-medium">Inicia sesión o regístrate para comenzar la configuración de tu Agente IA.</p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-6 mt-6 bg-white dark:bg-black border border-black/5 dark:border-white/5 p-8 rounded-[36px] shadow-sm relative overflow-hidden">
        
        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-xl text-sm font-semibold text-center border border-red-500/20">
            {error}
          </div>
        )}

        {data.email ? (
          <div className="flex flex-col items-center gap-4 bg-white/5 p-6 rounded-[24px] border border-white/10">
            <p className="text-foreground/70 font-medium">Tienes una sesión activa como:</p>
            <p className="font-bold text-lg">{data.email}</p>
            <div className="flex gap-4 w-full mt-2">
               <button 
                 onClick={nextStep}
                 className="flex-1 px-6 py-4 bg-primary text-white rounded-[20px] font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
               >
                 Continuar
               </button>
               <button 
                 onClick={async () => {
                   await supabase.auth.signOut();
                   updateData({ email: "" });
                 }}
                 className="flex-1 px-6 py-4 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-[20px] font-bold text-lg transition-all"
               >
                 Cerrar Sesión
               </button>
            </div>
          </div>
        ) : (
          <>
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 border-2 border-foreground/10 hover:border-foreground/20 hover:bg-foreground/[0.02] text-foreground rounded-[24px] font-bold text-lg transition-all disabled:opacity-50"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Continuar con Google
            </button>

            <div className="flex items-center gap-4 w-full">
              <div className="h-px bg-foreground/10 flex-1"></div>
              <span className="text-foreground/40 font-bold text-sm uppercase tracking-wider">o usa tu correo</span>
              <div className="h-px bg-foreground/10 flex-1"></div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3 relative">
                <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest px-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full bg-foreground/[0.03] border-none px-14 py-4 rounded-[20px] focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-foreground/20 text-lg font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-3 relative">
                <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest px-1">Contraseña</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-foreground/[0.03] border-none px-6 py-4 rounded-[20px] focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-foreground/20 text-lg font-semibold"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <button 
                onClick={() => handleEmailAuth("login")}
                disabled={isLoading}
                className="flex-1 px-8 py-4 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-[20px] font-bold text-lg transition-all disabled:opacity-50"
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => handleEmailAuth("signup")}
                disabled={isLoading}
                className="flex-1 px-8 py-4 bg-primary text-white rounded-[20px] font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                Crear Cuenta
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
