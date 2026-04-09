"use client";

import { useOnboarding } from "@/app/context/OnboardingContext";
import { motion } from "framer-motion";
import { MessageSquare, Coffee, ChefHat, Zap, ArrowRight, Check, Bot, Sparkles } from "lucide-react";
import { ProgressBar } from "../ui/ProgressBar";

const tones = [
  { id: "Relajado", icon: Coffee, desc: "Amistoso y cercano, como hablar con un amigo." },
  { id: "Gourmet", icon: ChefHat, desc: "Elegante y refinado, enfocado en el sabor." },
  { id: "Urbano", icon: MessageSquare, desc: "Moderno, rápido y con un toque fresco." },
  { id: "Directo", icon: Zap, desc: "Eficiente y enfocado en cerrar pedidos." },
];

export function PersonalityStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();

  return (
    <div className="flex flex-col h-full gap-8 max-w-2xl mx-auto py-12 pt-16 font-sans">
      <ProgressBar currentStep={5} totalSteps={7} />
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center gap-6 mt-8"
      >
        <div className="w-16 h-16 bg-primary rounded-[22px] flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Sparkles className="w-8 h-8 fill-current" />
        </div>
        <div className="flex flex-col gap-2">
           <h2 className="text-3xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight font-heading uppercase">Mi Personalidad</h2>
           <p className="text-lg text-foreground/50 max-w-md mx-auto font-medium">Dime cómo quieres que me llame, cómo debo saludar y cuál será mi tono de voz al vender.</p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-8 mt-6 bg-card border border-white/5 p-8 rounded-[36px] shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest px-1">Mi Nombre</label>
            <div className="relative">
              <Bot className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
              <input 
                type="text" 
                value={data.agentName}
                onChange={(e) => updateData({ agentName: e.target.value })}
                placeholder="Ej. Asesor Mao"
                className="w-full bg-white/5 border-none px-14 py-4 rounded-[20px] text-lg font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-white/20"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest px-1">¿Cómo saludo al cliente?</label>
            <input 
              type="text" 
              value={data.greeting}
              onChange={(e) => updateData({ greeting: e.target.value })}
              placeholder="Ej. ¡Hola! Soy Mao, ¿qué te sirvo hoy?"
              className="w-full bg-white/5 border-none px-6 py-4 rounded-[20px] text-lg font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-white/20"
            />
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 mt-2">
          <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest px-1 mb-4 block">Mi Tono de Voz</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tones.map((t) => {
              const isSelected = data.tone === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => updateData({ tone: t.id })}
                  className={`flex flex-col gap-3 p-6 rounded-[28px] border transition-all text-left group ${
                    isSelected 
                      ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20" 
                      : "border-white/5 hover:border-primary/20 hover:bg-white/[0.01]"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <div className={`p-2 rounded-xl transition-colors ${isSelected ? "text-primary" : "text-foreground/20 group-hover:text-foreground/40"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-primary" />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={`text-md font-bold ${isSelected ? "text-primary" : "text-foreground/60 group-hover:text-foreground/80"}`}>
                      {t.id}
                    </span>
                    <p className="text-xs text-foreground/40 font-medium leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mt-8 w-full max-w-sm mx-auto">
        <button 
          onClick={nextStep}
          className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-primary text-white rounded-[24px] font-extrabold text-xl shadow-xl shadow-primary/20 active:scale-95 transition-all text-center"
        >
          Ya casi terminamos
          <ArrowRight className="w-6 h-6" />
        </button>
        <button 
          onClick={prevStep}
          className="text-white/20 font-bold text-sm hover:text-primary transition-colors"
        >
          Paso anterior
        </button>
      </div>
    </div>
  );
}
