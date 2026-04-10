"use client";

import { useOnboarding } from "@/app/onboarding/_context/OnboardingContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ToggleRight, ToggleLeft, Bot, Zap, Check } from "lucide-react";
import { useState, useEffect } from "react";

const finalSteps = [
  { text: "Aprendiendo tus horarios", emoji: "⏰" },
  { text: "Guardando datos de contacto", emoji: "📝" },
  { text: "Añadiendo el menú a mi memoria", emoji: "🍽️" },
  { text: "Entrenando mi cerebro de ventas", emoji: "🧠" },
  { text: "Configurando el canal de WhatsApp", emoji: "📱" },
  { text: "Casi listo para vender", emoji: "🚀" },
];

export function OperationStep() {
  const { data, updateData, nextStep, isProcessing, setIsProcessing, setCanNext, setCustomNextHandler } = useOnboarding();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      setCurrentStepIdx(0);
      interval = setInterval(() => {
        setCurrentStepIdx(prev => (prev + 1) % finalSteps.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleNext = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      
      if (result.generatedPrompt) {
        updateData({ generatedSystemPrompt: result.generatedPrompt });
        setTimeout(() => {
          nextStep();
          setIsProcessing(false);
        }, 2000);
      } else {
        throw new Error(result.error || "No se pudo generar la infraestructura de ventas.");
      }
    } catch (err: any) {
      console.error("n8n Generation Error", err);
      alert("Error al conectar con Orbita: " + err.message);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    setCanNext(data.paymentMethods.length > 0);
    setCustomNextHandler(() => handleNext);
    return () => {
      setCanNext(true);
      setCustomNextHandler(null);
    };
  }, [data.paymentMethods, setCanNext, setCustomNextHandler]);

  const togglePayment = (method: string) => {
    const current = [...data.paymentMethods];
    if (current.includes(method)) {
      updateData({ paymentMethods: current.filter(m => m !== method) });
    } else {
      updateData({ paymentMethods: [...current, method] });
    }
  };

  return (
    <div className="flex flex-col gap-6 mx-auto font-sans py-0 max-w-2xl">
      <AnimatePresence mode="wait">
        {!isProcessing ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col gap-6"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-4xl font-black font-heading text-foreground tracking-tight leading-tight text-center">
                Mis reglas de operación
              </h2>
              <div className="w-full">
                <p className="text-base text-foreground/50 font-medium leading-relaxed mt-4 text-left">
                  Enséñame cuáles son tus tiempos y medios de pago para poder cerrar los pedidos.
                </p>
              </div>
            </motion.div>

            <div className="flex flex-col gap-10 mt-6 font-sans">
              <div className="space-y-4">
                <label className="text-sm font-bold text-foreground opacity-70 px-1">¿Cuánto tiempo les digo que tardas en preparar?</label>
                <div className="flex flex-wrap gap-2.5">
                  {[ "15 min", "20 min", "30-40 min", "Más de 45 min"].map((time) => {
                    const isSelected = data.prepTime === time;
                    return (
                      <button
                        key={time}
                        onClick={() => updateData({ prepTime: time })}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                          isSelected 
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/10" 
                            : "bg-[#EEF2F6] text-foreground/40 border-transparent hover:bg-[#E5EAEF] hover:text-foreground/60"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <label className="text-sm font-bold text-foreground opacity-70 px-1">¿Qué medios de pago les puedo aceptar?</label>
                <div className="flex flex-col gap-2">
                  {["Efecivo", "Pago online", "Transferencia"].map((method) => {
                    const isEnabled = data.paymentMethods.includes(method === "Efecivo" ? "Efectivo" : method);
                    const cleanMethod = method === "Efecivo" ? "Efectivo" : method;
                    return (
                      <div 
                        key={cleanMethod} 
                        className={`flex items-center justify-between p-5 rounded-[20px] border transition-all cursor-pointer group ${
                          isEnabled ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-white border-black/5 hover:border-primary/10 hover:bg-[#EEF2F6]/50"
                        }`}
                        onClick={() => togglePayment(cleanMethod)}
                      >
                        <span className={`text-sm font-bold tracking-tight ${isEnabled ? "text-primary" : "text-foreground/60"}`}>{cleanMethod}</span>
                        {isEnabled ? (
                          <ToggleRight className="w-9 h-9 text-primary" />
                        ) : (
                          <ToggleLeft className="w-9 h-9 text-muted/20" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-sm font-bold text-foreground opacity-70 px-1 block">¿Hay alguna otra regla estricta que deba seguir?</label>
                <textarea 
                  value={data.dishPolicies}
                  onChange={(e) => updateData({ dishPolicies: e.target.value })}
                  placeholder="Ej. Dile a los clientes que no llevamos a la Zona Norte..."
                  className="w-full h-24 bg-[#EEF2F6] border-none px-6 py-4 rounded-[16px] focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-base font-bold placeholder:text-muted/40 text-foreground"
                />
              </div>
            </div>


          </motion.div>
        ) : (
          <motion.div 
            key="wow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md gap-10"
          >
            <div className="relative">
              <div className="w-48 h-48 border-4 border-primary/10 rounded-full animate-ping absolute inset-0" />
              <div className="w-48 h-48 border-4 border-primary border-t-transparent rounded-full animate-spin relative flex items-center justify-center">
                 <div className="w-36 h-36 bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner shadow-white/10">
                   <Bot className="w-20 h-20 text-primary animate-pulse" />
                 </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-6 w-full max-w-lg">
              <div className="relative h-12 flex items-center justify-center w-full overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentStepIdx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6, ease: "anticipate" }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-2xl">{finalSteps[currentStepIdx].emoji}</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xs md:text-sm font-bold text-primary tracking-wider">
                        {finalSteps[currentStepIdx].text}
                      </span>
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity, 
                            delay: i * 0.3 
                          }}
                          className="text-primary font-black"
                        >
                          .
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
