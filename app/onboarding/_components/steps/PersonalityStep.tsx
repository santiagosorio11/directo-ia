"use client";

import { useOnboarding } from "@/app/onboarding/_context/OnboardingContext";
import { motion } from "framer-motion";
import { MessageSquare, Coffee, ChefHat, Zap, ArrowRight, Check, Bot, Sparkles } from "lucide-react";

const tones = [
  { id: "Relajado", icon: Coffee, desc: "Amistoso y cercano, como hablar con un amigo." },
  { id: "Gourmet", icon: ChefHat, desc: "Elegante y refinado, enfocado en el sabor." },
  { id: "Urbano", icon: MessageSquare, desc: "Moderno, rápido y con un toque fresco." },
  { id: "Directo", icon: Zap, desc: "Eficiente y enfocado en cerrar pedidos." },
];

export function PersonalityStep() {
  const { data, updateData, nextStep } = useOnboarding();

  return (
    <div className="flex flex-col gap-8 mx-auto font-sans py-4 max-w-2xl text-foreground">
      <motion.div 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.8 }}
        className="flex flex-col gap-2"
      >
        <h2 className="text-4xl font-black font-heading text-foreground tracking-tight leading-tight">Mi personalidad</h2>
        <p className="text-base text-foreground/50 font-medium leading-relaxed">Dime cómo quieres que me llame, cómo debo saludar y cuál será mi tono de voz al vender.</p>
      </motion.div>

      <div className="flex flex-col gap-10 mt-6 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground opacity-70 px-1">Mi nombre</label>
            <div className="relative group">
              <Bot className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={data.agentName}
                onChange={(e) => updateData({ agentName: e.target.value })}
                placeholder="Ej. Asesor Mao"
                className="w-full bg-[#EEF2F6] border-none px-14 py-4 rounded-[16px] text-base font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/40 text-foreground"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground opacity-70 px-1">¿Cómo saludo al cliente?</label>
            <input 
              type="text" 
              value={data.greeting}
              onChange={(e) => updateData({ greeting: e.target.value })}
              placeholder="Ej. ¡Hola! Soy Mao, ¿qué te sirvo hoy?"
              className="w-full bg-[#EEF2F6] border-none px-6 py-4 rounded-[16px] text-base font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/40 text-foreground"
            />
          </div>
        </div>

        <div className="pt-4">
          <label className="text-sm font-bold text-foreground opacity-70 px-1 mb-4 block">Mi tono de voz</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tones.map((t) => {
              const isSelected = data.tone === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => updateData({ tone: t.id })}
                  className={`flex flex-col gap-3 p-5 rounded-[20px] border transition-all text-left outline-none ${
                    isSelected 
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-black/5 bg-white hover:border-primary/20 hover:bg-[#EEF2F6]/50"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <div className={`p-2 transition-colors ${isSelected ? "text-primary" : "text-muted/30"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-primary" />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={`text-sm font-bold ${isSelected ? "text-primary" : "text-foreground/80"}`}>
                      {t.id}
                    </span>
                    <p className="text-[11px] text-foreground/40 font-bold leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>


    </div>
  );
}
