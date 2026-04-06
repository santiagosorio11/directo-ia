"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Bot } from "lucide-react";

const messages = [
  { id: 1, text: "Hola, ¿tienen el menú disponible?", sender: "user" },
  { id: 2, text: "¡Hola! Claro que sí. Aquí tienes nuestra carta actualizada. 🍕🍔\n\n¿Qué se te antoja hoy?", sender: "bot" },
  { id: 3, text: "La burger 'Directo' y unas papas.", sender: "user" },
  { id: 4, text: "¡Excelente elección! ⚡ Una Burger Directo y Papas grandes. Total: $12.50. ¿Deseas confirmar tu pedido?", sender: "bot" },
];

export function ChatSimulation() {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [visibleMessages]);

  useEffect(() => {
    let timeoutIds: NodeJS.Timeout[] = [];
    const startSequence = () => {
      setVisibleMessages([]);
      messages.forEach((_, index) => {
        const id = setTimeout(() => {
          setVisibleMessages(prev => [...prev, index]);
        }, 2000 * (index + 1));
        timeoutIds.push(id);
      });
      const resetId = setTimeout(() => startSequence(), 10000); // Reset after all messages
      timeoutIds.push(resetId);
    };
    startSequence();
    return () => timeoutIds.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-[340px] md:max-w-md bg-white dark:bg-[#1C1C1E] rounded-[40px] p-6 shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden flex flex-col h-[400px]">
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-black/5 dark:border-white/5">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Bot className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-black dark:text-white text-sm font-bold tracking-tight">IA Directo</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-500 text-[10px] uppercase font-bold tracking-widest">Activo</span>
          </div>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <AnimatePresence>
          {visibleMessages.map((index) => {
            const msg = messages[index];
            const isBot = msg.sender === "bot";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.8, y: 20, originX: isBot ? 0 : 1 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className={`flex gap-2 ${isBot ? "flex-row" : "flex-row-reverse"} items-end`}
              >
                <div className={`flex flex-col max-w-[80%] ${isBot ? "items-start" : "items-end"}`}>
                  <div 
                    className={`px-4 py-3 rounded-[24px] text-sm leading-relaxed shadow-sm ${
                      isBot 
                        ? "bg-[#F2F2F7] dark:bg-[#2C2C2E] text-black dark:text-white rounded-bl-none border border-black/5 dark:border-white/5 whitespace-pre-wrap" 
                        : "bg-primary text-white rounded-br-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <div className="pt-4 border-t border-black/5 dark:border-white/5 mt-auto">
        <div className="w-full h-10 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-full border border-black/5 dark:border-white/5 flex items-center px-4">
          <span className="text-black/20 dark:text-white/20 text-xs font-bold uppercase tracking-wider">Simulación en curso...</span>
        </div>
      </div>
    </div>
  );
}
