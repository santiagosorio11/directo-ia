"use client";

import { useOnboarding } from "@/app/onboarding/_context/OnboardingContext";
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
    <div className="flex flex-col gap-8 mx-auto font-sans py-4 max-w-2xl">
      <motion.div 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.8 }}
        className="flex flex-col gap-2"
      >
        <h2 className="text-4xl font-black font-heading text-foreground tracking-tight leading-tight">¿Qué objetivos tienes para mí?</h2>
        <p className="text-base text-foreground/50 font-medium leading-relaxed">Dime cuál es tu estrategia y qué metas de venta debo perseguir.</p>
      </motion.div>

      <div className="flex flex-col gap-10 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {objectivesList.map((obj) => {
            const isSelected = data.objectives.includes(obj.id);
            const Icon = obj.icon;
            return (
              <button
                key={obj.id}
                onClick={() => toggleObjective(obj.id)}
                className={`flex items-center gap-4 p-5 rounded-[20px] transition-all text-left border ${
                  isSelected 
                    ? "border-primary bg-primary/5 shadow-sm shadow-primary/5" 
                    : "border-black/5 bg-white hover:border-primary/20 hover:bg-[#EEF2F6]/50"
                }`}
              >
                <div className={`p-2 transition-colors ${isSelected ? "text-primary" : "text-muted/30"}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-sm font-bold tracking-tight ${isSelected ? "text-primary" : "text-foreground/60"}`}>
                  {obj.id}
                </span>
                {isSelected && <Check className="w-5 h-5 ml-auto text-primary" />}
              </button>
            );
          })}
        </div>

        <div className="space-y-8 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground opacity-70 px-1">¿Cuál es el producto que más debo impulsar?</label>
            <input 
              type="text" 
              value={data.starProduct}
              onChange={(e) => updateData({ starProduct: e.target.value })}
              placeholder="Ej. La especialidad de la casa, bebidas grandes..."
              className="w-full bg-[#EEF2F6] border-none px-6 py-4 rounded-[16px] focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/40 text-base font-bold text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground opacity-70 px-1">Estrategia de venta cruzada</label>
            <div className="relative">
              <textarea 
                value={data.crossSelling}
                onChange={(e) => updateData({ crossSelling: e.target.value })}
                placeholder="Dime qué extras u opciones ofrecer para subir el ticket..."
                className="w-full h-32 bg-[#EEF2F6] border-none px-6 py-5 rounded-[20px] focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-base font-bold pr-16 placeholder:text-muted/40 text-foreground"
              />
              <button 
                onClick={toggleVoice}
                className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isListening ? "bg-red-500 animate-pulse text-white" : "bg-primary hover:scale-105 text-white active:scale-95"
                }`}
              >
                {isListening ? <X className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
