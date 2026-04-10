"use client";

import { useOnboarding } from "@/app/onboarding/_context/OnboardingContext";
import { motion } from "framer-motion";
import { ChefHat, Clock, Mic, X, Sparkles, Bot } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { VoiceWaveform } from "../ui/VoiceWaveform";

const CATEGORIES = ["Hamburguesas", "Mexicana", "Pollo", "Parrilla", "Italiana", "Otro"];
const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export function IdentityStep() {
  const { data, updateData } = useOnboarding();
  const [isListening, setIsListening] = useState(false);
  const [otherValue, setOtherValue] = useState("");
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
  }, [data.businessDescription, isListening, updateData]);

  useEffect(() => {
      if (isListening) {
          try { recognitionRef.current?.start(); } catch(e) {}
      } else {
          try { recognitionRef.current?.stop(); } catch(e) {}
      }
  }, [isListening]);

  const toggleVoice = () => setIsListening(!isListening);

  const handleCategoryClick = (cat: string) => {
    if (cat === "Otro") {
      updateData({ foodType: "Otro" });
    } else {
      updateData({ foodType: cat });
    }
  };

  const updateDaySchedule = (day: string, field: string, value: any) => {
    const newSchedule = { ...data.weeklySchedule };
    newSchedule[day] = { ...newSchedule[day], [field]: value };
    updateData({ weeklySchedule: newSchedule });
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto font-sans text-foreground py-0">
      <motion.div 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center"
      >
        <img 
          src="/vendedoria1.png" 
          alt="Onboarding Icon" 
          className="h-40 w-auto mb-2 object-contain"
        />
        <h2 className="text-4xl font-black font-heading text-foreground tracking-tight leading-tight text-center">
          Ahora voy a aprender a vender tu restaurante
        </h2>
        <div className="w-full">
          <p className="text-base text-foreground/50 font-medium leading-relaxed mt-4 text-left">
            Cuéntame qué hace único a tu negocio para que pueda representarte mejor.
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-10 mt-6">
        {/* Tipo de Comida */}
        <div className="space-y-4">
            <label className="text-sm font-bold text-foreground opacity-70 px-1">
              ¿Qué tipo de comida vendes principalmente?
            </label>
            <div className="flex flex-wrap gap-2.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all border ${
                    data.foodType === cat || (cat === "Otro" && data.foodType === "Otro")
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                      : "bg-foreground/[0.03] text-foreground/40 border-transparent hover:bg-foreground/[0.06]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {data.foodType === "Otro" && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <input 
                  type="text" 
                  placeholder="Dinos el tipo de comida..."
                  value={otherValue}
                  onChange={(e) => setOtherValue(e.target.value)}
                  onBlur={() => updateData({ foodType: `Otro: ${otherValue}` })}
                  className="w-full bg-foreground/[0.03] border-none px-6 py-4 rounded-[16px] focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base font-bold mt-2"
                />
              </motion.div>
            )}
        </div>

        {/* Horarios por Día */}
        <div className="space-y-4">
            <label className="text-sm font-bold text-foreground opacity-70 px-1">
              ¿En qué horarios estás listo para recibir pedidos?
            </label>
            <div className="grid gap-2">
              {DAYS.map((day) => (
                <div key={day} className="flex flex-wrap items-center justify-between gap-4 bg-foreground/[0.02] p-4 rounded-[16px] border border-transparent hover:border-foreground/[0.05] transition-all">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={data.weeklySchedule[day].isOpen} 
                      onChange={(e) => updateDaySchedule(day, 'isOpen', e.target.checked)}
                      className="w-5 h-5 rounded-md accent-primary border-foreground/10"
                    />
                    <span className="font-bold text-sm min-w-[80px] text-foreground/80">{day}</span>
                  </div>
                  
                  {data.weeklySchedule[day].isOpen ? (
                    <div className="flex items-center gap-4">
                      <input 
                        type="time" 
                        value={data.weeklySchedule[day].openTime} 
                        onChange={(e) => updateDaySchedule(day, 'openTime', e.target.value)}
                        className="bg-transparent border-none p-0 text-sm font-bold outline-none focus:text-primary transition-colors text-foreground"
                      />
                      <span className="text-foreground/20 text-xs font-bold">-</span>
                      <input 
                        type="time" 
                        value={data.weeklySchedule[day].closeTime} 
                        onChange={(e) => updateDaySchedule(day, 'closeTime', e.target.value)}
                        className="bg-transparent border-none p-0 text-sm font-bold outline-none focus:text-primary transition-colors text-foreground"
                      />
                    </div>
                  ) : (
                    <span className="text-foreground/20 text-[10px] font-black tracking-widest">Cerrado</span>
                  )}
                </div>
              ))}
            </div>
        </div>

        {/* Atmosphere Card */}
        <div className="bg-foreground text-background rounded-[32px] p-8 mt-4 relative overflow-hidden flex flex-col items-center text-center gap-6">
          <div className="w-12 h-12 bg-background/10 rounded-2xl flex items-center justify-center text-primary relative">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-background tracking-tight font-heading opacity-80">Háblame de tu restaurante</h3>
            <p className="text-background/40 text-xs font-medium max-w-[280px]">
              Cuéntanos sobre el ambiente, la comida y lo que te hace especial.
            </p>
          </div>

          <VoiceWaveform isListening={isListening} />

          <button 
            onClick={toggleVoice}
            className={`flex items-center gap-3 px-8 py-3 rounded-full font-extrabold text-sm transition-all shadow-lg ${
              isListening 
                ? "bg-red-500 text-white animate-pulse" 
                : "bg-primary text-white hover:brightness-110 active:scale-95 shadow-primary/20"
            }`}
          >
            <Mic className="w-4 h-4" />
            {isListening ? "Detener Grabación" : "Grabar Descripción de voz"}
          </button>

          <span className="text-[9px] font-black tracking-widest text-background/30 cursor-pointer hover:text-background/50 transition-colors">
            O ingresa el texto manualmente
          </span>
        </div>

        {/* Manual Textarea */}
        <div className="bg-foreground/[0.03] rounded-3xl p-6">
          <textarea 
            value={data.businessDescription}
            onChange={(e) => updateData({ businessDescription: e.target.value })}
            placeholder="Escribe aquí los detalles de tu restaurante..."
            className="w-full h-32 bg-transparent border-none p-0 focus:ring-0 outline-none resize-none text-sm font-medium text-foreground/60 italic placeholder:text-foreground/30"
          />
        </div>
      </div>
    </div>
  );
}
