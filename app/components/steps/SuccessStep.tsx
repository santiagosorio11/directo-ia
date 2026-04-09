"use client";

import { useOnboarding } from "@/app/context/OnboardingContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  BarChart3, 
  MessageSquare, 
  Smartphone, 
  TrendingUp, 
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  UserMinus,
  Phone, 
  Play, 
  RefreshCcw, 
  Sparkles, 
  Send,
  Bot
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ProgressBar } from "../ui/ProgressBar";

export function SuccessStep() {
  const { data, updateData, setStep } = useOnboarding();
  const router = useRouter();
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "bot"; content: string }[]>([
    { role: "bot", content: `¡Hola! Soy ${data.agentName}, tu asesor de ventas. ¿Cómo puedo ayudarte hoy?` }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const scrollRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [chatMessages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setInputValue("");
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          messages: chatMessages.concat([{ role: "user", content: userMsg }]),
          systemPrompt: data.generatedSystemPrompt
        }),
      });

      const result = await res.json();
      
      if (result.message && !chatMessages.some(m => m.content === result.message)) {
        setChatMessages(prev => [...prev, { role: "bot", content: result.message }]);
      } else if (result.error) {
        setChatMessages(prev => [...prev, { role: "bot", content: "Hubo un error con la IA: " + result.error }]);
      }
      setIsTyping(false);
    } catch (err) {
      console.error("Chat sandbox error", err);
      setChatMessages(prev => [...prev, { role: "bot", content: "No pude conectar con el asistente. Verifica tu conexión." }]);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 max-w-4xl mx-auto py-12 pt-16 font-sans text-center">
      <ProgressBar currentStep={7} totalSteps={7} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="flex flex-col items-center gap-6 mt-12"
      >
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/20 mb-4">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <div className="flex flex-col gap-2">
           <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight font-heading uppercase">¡Tu Asesor está listo!</h2>
           <p className="text-xl text-foreground/50 max-w-md mx-auto font-medium">Interactúa con tu nuevo <span className="text-primary text-2xl font-black italic">asesor de ventas</span> antes de activarlo oficialmente.</p>
        </div>
      </motion.div>

      <div className="mt-10 bg-card border border-white/5 p-8 md:p-12 rounded-[40px] shadow-sm flex flex-col lg:flex-row items-center justify-center gap-12">
        <div className="flex flex-col gap-6 w-full max-w-sm lg:w-1/3 text-left">
           <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
             <MessageSquare className="w-8 h-8" />
           </div>
           <h3 className="text-3xl font-extrabold font-heading tracking-tight leading-tight">Pruébame.</h3>
           <p className="text-foreground/60 font-medium leading-relaxed">
             He leído todo sobre tu restaurante y tus reglas de operación. Escríbeme y probemos cómo atiendo a los clientes.
           </p>
        </div>

        <div className="flex flex-col gap-0 w-full max-w-md border border-white/5 rounded-[32px] overflow-hidden bg-foreground/[0.01]">
          <div className="bg-foreground/[0.03] p-4 text-left border-b border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              {data.agentName[0]}
            </div>
            <div>
              <div className="text-sm font-bold">{data.agentName}</div>
              <div className="text-[10px] text-green-500 font-bold uppercase tracking-widest animate-pulse">Asesor de ventas en línea</div>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="h-96 overflow-y-auto p-4 flex flex-col gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-[22px] text-sm font-medium text-left whitespace-pre-wrap ${
                  m.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none shadow-md shadow-primary/10' 
                    : 'bg-white/5 text-foreground rounded-tl-none border border-white/5'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-[22px] rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-75" />
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-150" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-black border-t border-white/5 flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe un mensaje al asesor..."
              className="flex-1 bg-white/5 border-none px-6 py-4 rounded-full text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-white/20"
            />
            <button 
              onClick={handleSendMessage}
              className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              <Send className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 pt-12 pb-20">
        <div className="max-w-md w-full p-10 bg-primary/10 rounded-[40px] border border-primary/20 flex flex-col gap-8 shadow-2xl shadow-primary/5 relative overflow-hidden">
           {isActivating && (
             <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-5">
               <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
               <span className="text-sm font-bold text-primary uppercase tracking-widest animate-pulse font-heading">Activando tu agente...</span>
             </div>
           )}
           <div className="flex flex-col gap-3">
             <h3 className="text-3xl font-black font-heading uppercase tracking-tighter">Activa tu Agente IA</h3>
             <p className="text-md text-foreground/60 font-medium">Conecta este asesor con tu WhatsApp y empieza a vender en automático.</p>
           </div>
           
           <button 
              onClick={async () => {
                setIsActivating(true);
                try {
                  const res = await fetch("/api/activate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                  });
                  const result = await res.json();
                  if (result.success && result.restaurantId) {
                    localStorage.setItem("directo_restaurant_id", result.restaurantId);
                    router.push("/dashboard");
                  } else {
                    throw new Error(result.error || "Error desconocido");
                  }
                } catch (e: any) {
                  alert("Error al activar: " + e.message);
                  setIsActivating(false);
                }
              }}
              disabled={isActivating}
              className="w-full flex items-center justify-center gap-4 px-8 py-6 bg-primary text-white rounded-[28px] font-black text-2xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
           >
             Activar mi Agente IA
             <Zap className="w-8 h-8 fill-current" />
           </button>
           
           <p className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">Sin contratos · Cancela cuando quieras</p>
        </div>

        <button 
          onClick={() => setStep(0)}
          className="text-foreground/20 font-bold uppercase tracking-widest text-[11px] hover:text-primary transition-all flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" /> REINICIAR EXPERIENCIA
        </button>
      </div>
    </div>
  );
}
