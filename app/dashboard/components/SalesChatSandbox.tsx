"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, ShoppingCart, Info, Sparkles, RefreshCcw } from "lucide-react";

export default function SalesChatSandbox() {
  const { restaurant, agentConfig, menu, createTestOrder, updateOrderStage, orders } = useDashboard();
  
  // Detectar la orden activa del sandbox (simulada por teléfono)
  const sandboxOrder = orders.find(o => 
    o.customer_phone === "3006262199" && 
    !["entregado", "cancelado"].includes(o.pipeline_stage)
  );

  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string; order?: any }[]>([
    { 
      role: "bot", 
      content: `¡Hola! Soy ${agentConfig?.agent_name || "tu Asistente"}, el agente de ventas de ${restaurant?.business_name}. ¿En qué puedo ayudarte hoy?` 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(() => `sandbox-${Math.random().toString(36).substring(7)}`);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: msg,
          systemPrompt: agentConfig?.system_prompt,
          restaurantId: restaurant?.id
        }),
      });

      const data = await res.json();
      
      if (data.message) {
        const content = typeof data.message === "string" ? data.message : JSON.stringify(data.message);
        setMessages(prev => [...prev, { role: "bot", content }]);

        // Simulación de transición de estados basada en la respuesta del bot para el sandbox
        if (sandboxOrder) {
          const lower = content.toLowerCase();
          if (lower.includes("transferencia") || lower.includes("pago") || lower.includes("cuenta") || lower.includes("banco")) {
            await updateOrderStage(sandboxOrder.id, "confirmacion_pago");
          } else if (lower.includes("confirmado") || lower.includes("visto bueno") || lower.includes("perfecto") || lower.includes("pedido realizado")) {
            await updateOrderStage(sandboxOrder.id, "pedido_confirmado");
          }
        }
      } else if (data.error) {
        setMessages(prev => [...prev, { role: "bot", content: "⚠️ " + (data.error || "Error en el agente") }]);
      }

    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", content: "Lo siento, hubo un problema de conexión." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { 
        role: "bot", 
        content: `Hola de nuevo. Soy ${agentConfig?.agent_name}. ¿Hacemos una prueba de pedido?` 
      }
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 leading-tight">Canal de Ventas (Pruebas)</h3>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Sandbox del Agente</p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-primary transition-colors"
          title="Reiniciar chat"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Info Card */}
      <div className="px-4 py-3">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-3 flex gap-3 items-start">
          <Info className="w-4 h-4 text-primary mt-0.5" />
          <div className="flex-1">
            <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
              Este chat simula la experiencia de un cliente en <span className="font-bold">WhatsApp</span>.
              Prueba pidiendo platos del menú o consultando horarios.
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-4 [&::-webkit-scrollbar]:hidden"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium ${
              m.role === 'user' 
                ? 'bg-primary text-white rounded-tr-none shadow-sm shadow-primary/10' 
                : 'bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200/50'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 border border-slate-200/50">
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* Shortcuts */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        <button 
          onClick={() => handleSendMessage("¿Qué me recomiendas?")}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 whitespace-nowrap hover:border-primary/50 transition-colors"
        >
          🍴 Recomendaciones
        </button>
        <button 
          onClick={() => handleSendMessage("¿Cuáles son sus horarios?")}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 whitespace-nowrap hover:border-primary/50 transition-colors"
        >
          ⏰ Horarios
        </button>
        <button 
          onClick={() => createTestOrder()}
          className="px-3 py-1.5 bg-green-500 text-white rounded-full text-[10px] font-black whitespace-nowrap flex items-center gap-1.5 shadow-md shadow-green-500/20 hover:scale-105 transition-all"
        >
          <ShoppingCart className="w-3 h-3" /> Crear Pedido Manual
        </button>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100 flex gap-2 bg-white">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Escribe como un cliente..."
          className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-semibold focus:border-primary outline-none text-slate-700 placeholder:text-slate-400"
        />
        <button 
          onClick={() => handleSendMessage()}
          disabled={!input.trim() || isLoading}
          className="w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
        >
          <Send className="w-5 h-5 fill-current" />
        </button>
      </div>
    </div>
  );
}
