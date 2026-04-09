"use client";

import { useOnboarding } from "@/app/context/OnboardingContext";
import { motion } from "framer-motion";
import { ArrowRight, ToggleRight, ToggleLeft, Bot, Zap } from "lucide-react";
import { ProgressBar } from "../ui/ProgressBar";

export function OperationStep() {
  const { data, updateData, nextStep, prevStep, isProcessing, setIsProcessing } = useOnboarding();

  const handleNext = async () => {
    setIsProcessing(true);
    console.log("Onboarding Data being sent to n8n: ", data);
    try {
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.generatedPrompt) {
        updateData({ generatedSystemPrompt: result.generatedPrompt });
        nextStep();
      } else {
        throw new Error("No se pudo generar la infraestructura de ventas.");
      }
    } catch (err: any) {
      console.error("n8n Generation Error", err);
      alert("Error al conectar con Orbita: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePayment = (method: string) => {
    const current = [...data.paymentMethods];
    if (current.includes(method)) {
      updateData({ paymentMethods: current.filter(m => m !== method) });
    } else {
      updateData({ paymentMethods: [...current, method] });
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 max-w-2xl mx-auto py-12 pt-16 font-sans">
      <ProgressBar currentStep={6} totalSteps={7} />
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center gap-6 mt-8"
      >
        <div className="w-16 h-16 bg-primary rounded-[22px] flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Zap className="w-8 h-8 fill-current" />
        </div>
        <div className="flex flex-col gap-2">
           <h2 className="text-3xl md:text-3xl font-extrabold text-foreground tracking-tight font-heading uppercase">Mis Reglas de Operación</h2>
           <p className="text-lg text-foreground/50 max-w-md mx-auto font-medium">Enséñame cuáles son tus tiempos y medios de pago para poder cerrar los pedidos.</p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-10 mt-6 bg-card border border-white/5 p-8 rounded-[36px] shadow-sm relative overflow-hidden">
        {isProcessing && (
           <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-5">
             <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
             <div className="flex flex-col items-center">
               <span className="text-sm font-bold text-primary uppercase tracking-widest animate-pulse font-heading">Aprendiendo mis indicaciones...</span>
               <span className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Configurando tu canal de ventas directo</span>
             </div>
           </div>
        )}

        <div className="space-y-4">
          <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest px-1">¿Cuánto tiempo les digo que tardas en preparar?</label>
          <div className="flex flex-wrap gap-2">
            {[ "15 min", "20 min", "30-40 min", "Más de 45 min"].map((time) => {
              const isSelected = data.prepTime === time;
              return (
                <button
                  key={time}
                  onClick={() => updateData({ prepTime: time })}
                  className={`px-6 py-3 rounded-[20px] text-sm font-bold tracking-tight transition-all ${
                    isSelected 
                      ? "bg-primary text-white shadow-xl shadow-primary/10 scale-105" 
                      : "bg-white/5 text-foreground/40 hover:text-foreground/80 hover:bg-white/10"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-white/5">
          <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest px-1">¿Qué medios de pago les puedo aceptar?</label>
          <div className="flex flex-col gap-3">
            {["Efectivo", "Pago Online", "Transferencia"].map((method) => {
              const isEnabled = data.paymentMethods.includes(method);
              return (
                <div 
                  key={method} 
                  className="flex items-center justify-between p-6 bg-white/[0.02] rounded-[24px] hover:bg-white/[0.04] transition-all cursor-pointer group"
                  onClick={() => togglePayment(method)}
                >
                  <span className={`text-md font-bold ${isEnabled ? "text-foreground" : "text-foreground/40 group-hover:text-foreground/60"}`}>{method}</span>
                  {isEnabled ? (
                    <ToggleRight className="w-10 h-10 text-primary" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-white/10" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 pt-6 border-t border-white/5">
          <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest px-1 text-center block">¿Hay alguna otra regla estricta que deba seguir?</label>
          <textarea 
            value={data.dishPolicies}
            onChange={(e) => updateData({ dishPolicies: e.target.value })}
            placeholder="Ej. Dile a los clientes que no llevamos a la Zona Norte..."
            className="w-full h-24 bg-white/5 border-none px-6 py-5 rounded-[24px] focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none text-lg font-semibold placeholder:text-white/10"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mt-8 w-full max-w-sm mx-auto">
        <button 
          onClick={handleNext}
          disabled={data.paymentMethods.length === 0 || isProcessing}
          className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-primary text-white rounded-[24px] font-extrabold text-xl shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-20"
        >
          ¡Listo! Conocer mi Asesor
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
