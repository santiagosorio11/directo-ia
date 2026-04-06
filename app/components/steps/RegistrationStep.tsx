"use client";

import { useOnboarding } from "@/app/context/OnboardingContext";
import { motion } from "framer-motion";
import { ArrowRight, UserCircle, Briefcase, Phone, MapPin, Mail } from "lucide-react";
import { ProgressBar } from "../ui/ProgressBar";

export function RegistrationStep() {
  const { data, updateData, nextStep, isProcessing } = useOnboarding();

  const isValid = data.businessName && data.email && data.phone && data.address;

  return (
    <div className="flex flex-col h-full gap-8 max-w-2xl mx-auto py-12 pt-16 font-sans text-foreground">
      <ProgressBar currentStep={0} totalSteps={6} />
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center gap-6 mt-8"
      >
        <div className="w-16 h-16 bg-primary rounded-[22px] flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <UserCircle className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-2">
           <h2 className="text-3xl md:text-3xl font-extrabold text-foreground tracking-tight font-heading uppercase">Tus Datos</h2>
           <p className="text-lg text-foreground/50 max-w-md mx-auto font-medium">Requerimos esta información para preparar tu subcuenta.</p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-8 mt-6 bg-white dark:bg-black border border-black/5 dark:border-white/5 p-8 rounded-[36px] shadow-sm relative overflow-hidden">
        <div className="flex flex-col gap-8">
          <div className="space-y-3 relative">
            <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest px-1">¿Cómo se llama tu negocio?</label>
            <div className="relative">
              <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
              <input 
                type="text" 
                value={data.businessName}
                onChange={(e) => updateData({ businessName: e.target.value })}
                placeholder="Ej. Mi Restaurante"
                className="w-full bg-foreground/[0.03] border-none px-14 py-5 rounded-[24px] focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-foreground/20 text-lg font-semibold"
              />
            </div>
          </div>

          <div className="space-y-3 relative">
            <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest px-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
              <input 
                type="email" 
                value={data.email}
                onChange={(e) => updateData({ email: e.target.value })}
                placeholder="correo@ejemplo.com"
                className="w-full bg-foreground/[0.03] border-none px-14 py-5 rounded-[24px] focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-foreground/20 text-lg font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 relative">
              <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest px-1">Teléfono</label>
              <div className="relative">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                <input 
                  type="tel" 
                  value={data.phone}
                  onChange={(e) => updateData({ phone: e.target.value })}
                  placeholder="Ej. +57 300..."
                  className="w-full bg-foreground/[0.03] border-none px-14 py-5 rounded-[24px] focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg font-semibold"
                />
              </div>
            </div>
            <div className="space-y-3 relative">
              <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest px-1">Dirección Exacta</label>
              <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                <input 
                  type="text" 
                  value={data.address}
                  onChange={(e) => updateData({ address: e.target.value })}
                  placeholder="Calle 123..."
                  className="w-full bg-foreground/[0.03] border-none px-14 py-5 rounded-[24px] focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-foreground/20 text-lg font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mt-8 w-full max-w-sm mx-auto">
        <button 
          onClick={nextStep}
          disabled={!isValid || isProcessing}
          className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-primary text-white rounded-[24px] font-extrabold text-xl shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-20"
        >
          Continuar
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
