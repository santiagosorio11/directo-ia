"use client";

import { useOnboarding } from "@/app/onboarding/_context/OnboardingContext";
import { motion } from "framer-motion";
import { 
  ArrowRight as LucideArrowRight, 
  Briefcase as LucideBriefcase, 
  Phone as LucidePhone, 
  MapPin as LucideMapPin, 
  Mail as LucideMail 
} from "lucide-react";
import { ProgressBar } from "../ui/ProgressBar";

export function RegistrationStep() {
  const { data, updateData, nextStep, isProcessing } = useOnboarding();

  const isValid = data.businessName && data.phone && data.address;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto font-sans text-foreground py-0">
      <motion.div 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center"
      >
        <img 
          src="/vendedoria.png" 
          alt="Vendor Icon" 
          className="h-40 w-auto mb-2 object-contain"
        />
        <h2 className="text-4xl font-black font-heading text-foreground tracking-tight leading-tight text-center">
          Hola! Soy tu vendedor virtual de Directo
        </h2>
        <div className="w-full">
          <p className="text-base text-foreground/50 font-medium leading-relaxed mt-4 text-left">
            Necesito conocer tu restaurante para empezar a vender sin apps ni comisiones.
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-8 mt-6">
        <div className="flex flex-col gap-8">
          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-foreground opacity-70 px-1">
              ¿Cómo se llama tu restaurante? <span className="text-primary/60 font-medium">Así lo verán tus clientes</span>
            </label>
            <div className="relative group">
              <LucideBriefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={data.businessName}
                onChange={(e) => updateData({ businessName: e.target.value })}
                placeholder="Ej. Mi Restaurante"
                className="w-full bg-[#EEF2F6] border-none px-14 py-5 rounded-[20px] focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/50 text-base font-bold text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-foreground opacity-70 px-1">
              ¿A qué correo te enviamos los pedidos y reportes?
            </label>
            <div className="relative group">
              <LucideMail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />
              <input 
                type="email" 
                value={data.email}
                onChange={(e) => updateData({ email: e.target.value })}
                className="w-full bg-[#EEF2F6] border-none px-14 py-5 rounded-[20px] focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base font-bold text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 relative">
              <label className="text-sm font-bold text-foreground opacity-70 px-1">
                ¿A qué número te van a escribir? <span className="text-primary/60 font-medium">(WhatsApp)</span>
              </label>
              <div className="relative group">
                <LucidePhone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="tel" 
                  value={data.phone}
                  onChange={(e) => updateData({ phone: e.target.value })}
                  placeholder="Ej. +57 300..."
                  className="w-full bg-[#EEF2F6] border-none px-14 py-5 rounded-[20px] focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base font-bold text-foreground"
                />
              </div>
            </div>
            <div className="space-y-2 relative">
              <label className="text-sm font-bold text-foreground opacity-70 px-1">
                ¿Desde dónde despachas los pedidos?
              </label>
              <div className="relative group">
                <LucideMapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={data.address}
                  onChange={(e) => updateData({ address: e.target.value })}
                  placeholder="Calle 123..."
                  className="w-full bg-[#EEF2F6] border-none px-14 py-5 rounded-[20px] focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/50 text-base font-bold text-foreground"
                />
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
