"use client";

import { useOnboarding } from "@/app/onboarding/_context/OnboardingContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Mail, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import Link from "next/link";

export function AuthStep() {
  const { data, nextStep, updateData, isProcessing, setIsProcessing, setCustomNextHandler } = useOnboarding();
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const supabase = createClient();

  // Register the auth handler to the fixed bottom navigation
  useEffect(() => {
    setCustomNextHandler(() => handleAuth);
    return () => setCustomNextHandler(null);
  }, [setCustomNextHandler, isLogin, email, password, fullName]);

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

  const handleAppleLogin = async () => {
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !fullName)) {
      setError("Por favor completa todos los campos.");
      return;
    }
    
    setIsProcessing(true);
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (isLogin) {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        setIsProcessing(false);
        return;
      }

      if (authData.user) {
        updateData({ 
          email: authData.user.email || "", 
          fullName: authData.user.user_metadata?.full_name || "" 
        });
        nextStep();
        setIsProcessing(false);
      }
    } else {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        setIsProcessing(false);
        return;
      }

      if (authData.user) {
        if (!authData.session) {
          setSuccessMsg(" ¡Cuenta creada! Revisa tu correo para verificar tu cuenta.");
          setIsLoading(false);
          setIsProcessing(false);
        } else {
          updateData({ email: authData.user.email || "", fullName });
          nextStep();
          setIsProcessing(false);
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto py-0">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }} 
        className="flex flex-col items-center"
      >
        <h2 className="text-4xl font-black font-heading text-foreground tracking-tight text-center">
          {isLogin ? "Bienvenido" : "Crea tu cuenta"}
        </h2>
        <div className="w-full">
          <p className="text-foreground/50 text-base font-medium leading-relaxed mt-4 text-left">
            {isLogin 
              ? "Nos alegra verte de nuevo. Entra a tu cocina digital."
              : "Inicia sesión o regístrate para comenzar la configuración de tu agente IA."}
          </p>
        </div>
      </motion.div>

      {/* Form Section */}
      <div className="space-y-6">
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-700 font-bold text-sm"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            {successMsg}
          </motion.div>
        )}

        {/* Inputs */}
        <div className="space-y-5">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-foreground opacity-70 px-1">Nombre completo</label>
              <div className="group relative transition-all">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-primary" />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Santiago Osorio"
                  className="w-full bg-[#EEF2F6] border-none px-11 py-4 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/50 text-base font-bold text-[#111827]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground opacity-70 px-1">Correo electrónico</label>
            <div className="group relative transition-all">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-primary" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hola@tu-restaurante.com"
                className="w-full bg-[#EEF2F6] border-none px-11 py-4 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/50 text-base font-bold text-[#111827]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground opacity-70 px-1">Contraseña</label>
            <div className="group relative transition-all">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-primary" />
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#EEF2F6] border-none px-11 py-4 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/50 text-base font-bold text-[#111827]"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center space-y-2">
           <p className="text-[13px] font-medium text-muted">
             {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes una cuenta?"}{" "}
             <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-black hover:underline underline-offset-4"
             >
               {isLogin ? "Regístrate aquí" : "Inicia sesión aquí"}
             </button>
           </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 py-2">
          <div className="h-px bg-border flex-1 opacity-50"></div>
          <span className="text-[10px] font-black text-muted/40 tracking-[0.2em]">O continúa con</span>
          <div className="h-px bg-border flex-1 opacity-50"></div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 h-14 bg-white border border-border rounded-2xl font-bold text-[#111827] hover:bg-gray-50 transition-all shadow-sm"
          >
             <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              </svg>
            Google
          </button>
          <button 
            onClick={handleAppleLogin}
            className="flex items-center justify-center gap-3 h-14 bg-white border border-border rounded-2xl font-bold text-[#111827] hover:bg-gray-50 transition-all shadow-sm"
          >
            <svg className="w-5 h-5 flex-shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.96.95-2.14 1.72-3.32 1.72-1.14 0-1.6-.69-3.03-.69-1.4 0-1.99.66-3.03.66-1.22 0-2.43-.88-3.41-1.93-2.01-2.13-3.08-6.16-3.08-8.99 0-4.32 2.72-6.59 5.32-6.59 1.35 0 2.4.89 3.22.89.8 0 2.05-.96 3.52-.96 1.15 0 2.22.42 2.94 1.13-2.45 1.77-2.06 5.37.52 6.55-1.15 2.11-2.47 4.14-3.66 5.51zM12.03 4.72c-.15-1.96 1.48-3.73 3.32-3.72.19 2.02-1.55 3.86-3.32 3.72z" />
            </svg>
            Apple
          </button>
        </div>

        {/* Legal Footer */}
        <p className="text-[12px] font-medium text-muted/60 text-center leading-relaxed mt-6">
          Al continuar, aceptas nuestras{" "}
          <Link href="/privacy" className="text-primary hover:underline">Políticas de Privacidad</Link>{" "}
          y los{" "}
          <Link href="/terms" className="text-primary hover:underline">Términos de Servicio</Link>.
        </p>
      </div>
    </div>
  );
}
