"use client";

import { useOnboarding } from "@/app/context/OnboardingContext";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Upload, ArrowRight, ChefHat, Clock, Check, Bot, X, Store } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ProgressBar } from "../ui/ProgressBar";

export function IdentityStep() {
  const { data, updateData, nextStep, prevStep, setIsProcessing, isProcessing } = useOnboarding();
  const [isListening, setIsListening] = useState(false);
  const [showOtherCategory, setShowOtherCategory] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition && !recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = "es-ES";
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            updateData({ businessDescription: (data.businessDescription + " " + transcript).trim() });
        };

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => {
            if (isListening) recognitionRef.current.start();
        };
    }

    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }
  }, []);

  useEffect(() => {
      if (isListening) {
          try { recognitionRef.current?.start(); } catch(e) {}
      } else {
          recognitionRef.current?.stop();
      }
  }, [isListening]);

  const toggleVoice = () => setIsListening(!isListening);

  const categories = ["Italiana", "Mexicana", "Sushi", "Hamburguesas", "Otro"];

  return (
    <div className="flex flex-col h-full gap-8 max-w-2xl mx-auto py-12 pt-16 font-sans text-foreground">
      <ProgressBar currentStep={0} totalSteps={5} />
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center gap-6 mt-8"
      >
        <div className="w-16 h-16 bg-primary rounded-[22px] flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Store className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-2">
           <h2 className="text-3xl md:text-3xl font-extrabold text-foreground tracking-tight font-heading uppercase">Tu Identidad Digital</h2>
           <p className="text-lg text-foreground/50 max-w-md mx-auto font-medium">Empezaremos por lo básico para crear tu perfil de venta en DIRECTO.</p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-10 mt-6 bg-white dark:bg-black border border-black/5 dark:border-white/5 p-8 rounded-[36px] shadow-sm relative overflow-hidden">
        <div className="flex flex-col gap-8">
          <div className="space-y-3 relative group">
            <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest px-1">¿Cómo se llama tu negocio?</label>
            <div className="relative">
              <input 
                type="text" 
                value={data.businessName}
                onChange={(e) => updateData({ businessName: e.target.value })}
                placeholder="Ej. DIRECTO Pasta & Grill"
                className="w-full bg-foreground/[0.03] border-none px-6 py-5 rounded-[24px] focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-foreground/20 text-lg font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest px-1">Giro o Tipo de Comida</label>
              <div className="relative">
                <ChefHat className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                <input 
                  type="text" 
                  value={data.foodType}
                  onChange={(e) => updateData({ foodType: e.target.value })}
                  placeholder="Ej. Italiana, Gourmet..."
                  className="w-full bg-foreground/[0.03] border-none px-14 py-5 rounded-[24px] focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg font-semibold"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest px-1">Horario de Atención</label>
              <div className="relative">
                <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                <input 
                  type="text" 
                  value={data.schedule}
                  onChange={(e) => updateData({ schedule: e.target.value })}
                  placeholder="Ej. 12 PM - 10 PM"
                  className="w-full bg-foreground/[0.03] border-none px-14 py-5 rounded-[24px] focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-foreground/20 text-lg font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 relative">
            <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest px-1">Describe tu restaurante</label>
            <div className="relative">
              <textarea 
                value={data.businessDescription}
                onChange={(e) => updateData({ businessDescription: e.target.value })}
                placeholder="Cuéntanos un poco sobre tu historia, especialidades o ambiente..."
                className="w-full h-40 bg-foreground/[0.03] border-none px-6 py-5 rounded-[24px] focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none pr-16 text-lg font-semibold"
              />
              <button 
                type="button"
                onClick={toggleVoice}
                className={`absolute bottom-5 right-5 w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-xl ${
                  isListening ? "bg-red-500 scale-110 animate-pulse text-white shadow-red-500/20" : "bg-primary hover:bg-[#E64A00] hover:scale-105 text-white shadow-primary/20"
                }`}
              >
                {isListening ? <X className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mt-8 w-full max-w-sm mx-auto">
        <button 
          onClick={() => {
            if (isListening) setIsListening(false);
            nextStep();
          }}
          disabled={!data.businessName || isProcessing}
          className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-primary text-white rounded-[24px] font-extrabold text-xl shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-20"
        >
          Continuar
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
