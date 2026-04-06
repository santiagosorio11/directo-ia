"use client";

import { useOnboarding } from "@/app/context/OnboardingContext";
import { ChatSimulation } from "../ui/ChatSimulation";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export function LandingStep() {
  const { nextStep } = useOnboarding();

  return (
    <div className="flex flex-col min-h-screen pt-20 pb-12 w-full max-w-7xl mx-auto px-6 font-sans">
      
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-primary/[0.08] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-primary/[0.03] blur-[120px] rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-1">
        
        {/* Left Content: Hero Text */}
        <div className="flex flex-col gap-10 text-left max-w-xl">
          <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="w-20 h-20 relative"
          >
             <Image 
                src="/LOGODIRECTO.jpeg" 
                alt="DIRECTO Logo" 
                fill 
                className="object-contain rounded-2xl grayscale brightness-125 hover:grayscale-0 transition-all duration-500"
             />
          </motion.div>

          <div className="flex flex-col gap-6">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground leading-[0.95] font-heading"
            >
              Vende <span className="text-primary italic">directo.</span> <br />
              Sin el 30%.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl text-foreground/60 font-medium leading-relaxed max-w-lg"
            >
              Usa IA de Orbita para automatizar tus ventas por WhatsApp. 
              <span className="block mt-2 text-foreground/40 italic">"La app descubre. WhatsApp convierte. El restaurante retiene."</span>
            </motion.p>
          </div>

          <div className="flex flex-col gap-4">
            {["Sin comisiones por pedido", "IA entrenada en tu menú", "Validación de pagos inmediata"].map((feature, i) => (
              <motion.div 
                key={feature}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="flex items-center gap-3 text-sm font-bold text-foreground/70"
              >
                <CheckCircle2 className="w-5 h-5 text-primary" />
                {feature}
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <motion.button
              onClick={nextStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white rounded-[24px] font-extrabold text-xl shadow-2xl shadow-primary/20 transition-all hover:brightness-110 active:shadow-none"
            >
              Activar mi Canal Propio
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Right Content: Chat Simulation */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: "circOut" }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="absolute -z-10 w-full h-full bg-primary/5 blur-[100px] scale-125 opacity-50" />
          <ChatSimulation />
        </motion.div>

      </div>

      {/* Footer */}
      <footer className="mt-20 pt-12 pb-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex gap-8 text-[11px] text-foreground/30 font-bold uppercase tracking-widest justify-center md:justify-start">
          <span className="cursor-pointer hover:text-primary transition-colors">Privacidad</span>
          <span className="cursor-pointer hover:text-primary transition-colors">Legal</span>
          <span className="cursor-pointer hover:text-primary transition-colors">Soporte</span>
        </div>
        <p className="text-[11px] text-foreground/20 font-bold uppercase tracking-widest text-center md:text-right">
          DIRECTO BY ORBITA IA - INFRAESTRUCTURA GASTRONÓMICA 2026
        </p>
      </footer>
    </div>
  );
}
