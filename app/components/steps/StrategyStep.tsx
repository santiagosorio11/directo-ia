"use client";

import { useOnboarding } from "@/app/context/OnboardingContext";
import { motion } from "framer-motion";
import { Check, ArrowLeft, ArrowRight, Target, TrendingUp, UserMinus, ShieldCheck, Mic, Bot, X, Zap } from "lucide-react";
import { ProgressBar } from "../ui/ProgressBar";
import { useState, useRef, useEffect } from "react";

const objectivesList = [
  { id: "Aumentar valor del pedido", icon: TrendingUp },
  { id: "Evitar pérdida de pedidos", icon: UserMinus },
  { id: "Fidelización de clientes", icon: ShieldCheck },
  { id: "Agilidad en soporte", icon: Target },
];

export function StrategyStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "es-ES";
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        if (transcript) {
           updateData({ crossSelling: (data.crossSelling + " " + transcript).trim() });
        }
      };

      recognitionRef.current.onend = () => {
        if (isListening) recognitionRef.current.start();
      };
    }
  }, [isListening, data.crossSelling]);

  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const toggleObjective = (id: string) => {
    const currentList = [...data.objectives];
    if (currentList.includes(id)) {
      updateData({ objectives: currentList.filter(o => o !== id) });
    } else if (currentList.length < 3) {
      updateData({ objectives: [...currentList, id] });
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 max-w-2xl mx-auto py-12 pt-16 font-sans">
      <ProgressBar currentStep={4} totalSteps={7} />
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center gap-6"
      >
        <div className="w-16 h-16 bg-primary rounded-[22px] flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Target className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-2">
           <h2 className="text-3xl md:text-3xl font-extrabold text-foreground tracking-tight font-heading">¿Qué objetivos tienes para mí?</h2>
           <p className="text-lg text-foreground/50 max-w-md mx-auto font-medium">Dime cuál es tu estrategia y qué metas de venta debo perseguir.</p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-10 mt-6 bg-card border border-white/5 p-8 rounded-[36px] shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {objectivesList.map((obj) => {
            const isSelected = data.objectives.includes(obj.id);
            const Icon = obj.icon;
            return (
              <button
                key={obj.id}
                onClick={() => toggleObjective(obj.id)}
                className={`flex items-center gap-4 p-6 rounded-[28px] border-2 transition-all text-left group ${
                  isSelected 
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/5 ring-1 ring-primary/20" 
                    : "border-white/5 hover:border-primary/20 hover:bg-white/[0.01]"
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${isSelected ? "text-primary" : "text-foreground/20 group-hover:text-foreground/40"}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-md font-bold tracking-tight ${isSelected ? "text-primary" : "text-foreground/50 group-hover:text-foreground/80"}`}>
                  {obj.id}
                </span>
                {isSelected && <Check className="w-6 h-6 ml-auto text-primary" />}
              </button>
            );
          })}
        </div>

        <div className="space-y-6 pt-6 border-t border-white/5">
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest px-1">¿Cuál es el producto que más debo impulsar?</label>
            <input 
              type="text" 
              value={data.starProduct}
              onChange={(e) => updateData({ starProduct: e.target.value })}
              placeholder="Ej. La especialidad de la casa, bebidas grandes..."
              className="w-full bg-white/5 border-none px-6 py-5 rounded-[24px] focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-white/10 text-lg font-semibold"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest px-1">Estrategia de Venta Cruzada</label>
            <div className="relative">
              <textarea 
                value={data.crossSelling}
                onChange={(e) => updateData({ crossSelling: e.target.value })}
                placeholder="Dime qué extras u opciones ofrecer para subir el ticket..."
                className="w-full h-32 bg-white/5 border-none px-6 py-5 rounded-[24px] focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none text-lg font-semibold pr-16 placeholder:text-white/10"
              />
              <button 
                onClick={toggleVoice}
                className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isListening ? "bg-red-500 animate-pulse text-white shadow-red-500/20" : "bg-primary hover:brightness-110 text-white shadow-primary/20"
                }`}
              >
                {isListening ? <X className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mt-8 w-full max-w-sm mx-auto">
        <button 
          onClick={() => {
            if (isListening) toggleVoice();
            nextStep();
          }}
          disabled={data.objectives.length === 0}
          className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-primary text-white rounded-[24px] font-extrabold text-xl shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-20 text-center"
        >
          Siguiente paso
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
