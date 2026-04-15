"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Mic, MicOff, RotateCcw } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

const SUGGESTED_ACTIONS = [
  "¿Cómo fueron las ventas hoy?",
  "Cambia el tono del bot a más amigable",
  "¿Qué producto se vende más?",
  "Genera el brief del día",
  "¿Cuántos pedidos hubo esta semana?",
  "Apaga el agente de ventas",
];

export default function AdminChatSection({ embedded = false }: { embedded?: boolean }) {
  const { restaurant } = useDashboard();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history on mount
  useEffect(() => {
    if (!restaurant?.id) return;
    loadHistory();
  }, [restaurant?.id]);

  const loadHistory = async () => {
    if (!restaurant?.id) return;
    setIsLoadingHistory(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data } = await supabase
        .from("admin_chat_history")
        .select("id, role, content, created_at")
        .eq("restaurant_id", restaurant.id)
        .order("created_at", { ascending: true })
        .limit(50);

      if (data) setMessages(data);
    } catch (e) {
      console.error("Error loading admin chat history:", e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const clearHistory = async () => {
    if (!restaurant?.id) return;
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.from("admin_chat_history").delete().eq("restaurant_id", restaurant.id);
      setMessages([]);
    } catch (e) {
      console.error("Error clearing chat:", e);
    }
  };

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || !restaurant?.id || isLoading) return;

    const userMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: msg,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Auto-resize textarea back
    if (inputRef.current) inputRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/admin-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          restaurantId: restaurant.id,
          sessionId: `admin-${restaurant.id}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `⚠️ ${data.error || "No se pudo conectar con el Admin IA."}`,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } else {
        const assistantMsg: ChatMessage = {
          id: `resp-${Date.now()}`,
          role: "assistant",
          content: data.message,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch {
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "⚠️ Error de conexión. Verifica tu internet.",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startVoiceRecording = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + (prev ? " " : "") + transcript);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto resize
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const containerClass = embedded
    ? "flex flex-col h-full w-full bg-white overflow-hidden"
    : "flex flex-col h-[calc(100vh-120px)] w-full bg-white border border-slate-200 rounded-2xl lg:rounded-3xl overflow-hidden shadow-sm";

  return (
    <div className={containerClass}>
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 lg:px-5 py-3 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-primary flex items-center justify-center shadow-lg shadow-violet-500/20 flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 leading-tight">Admin IA</h3>
            <p className="text-[10px] text-emerald-500 font-bold leading-tight">En línea</p>
          </div>
        </div>
        <button
          onClick={clearHistory}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-colors"
          title="Limpiar chat"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 lg:px-5 py-4 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {isLoadingHistory ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/10 to-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">¡Hola! Soy tu Admin IA</p>
              <p className="text-xs text-slate-400 max-w-[220px] mt-1 leading-relaxed">
                Pregúntame sobre ventas, ajusta tu agente, o pídeme un brief de tu operación.
              </p>
            </div>
            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 mt-2 justify-center max-w-sm">
              {SUGGESTED_ACTIONS.slice(0, 4).map((action, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(action)}
                  className="px-3 py-1.5 text-[11px] font-semibold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-full transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-slate-50 text-slate-700 border border-slate-100 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                  <p
                    className={`text-[9px] mt-1.5 ${
                      msg.role === "user" ? "text-white/50" : "text-slate-300"
                    }`}
                  >
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion chips when there are messages */}
      {messages.length > 0 && !isLoading && (
        <div className="px-4 lg:px-5 pb-2 flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden flex-shrink-0">
          {SUGGESTED_ACTIONS.slice(0, 3).map((action, i) => (
            <button
              key={i}
              onClick={() => sendMessage(action)}
              className="px-3 py-1 text-[10px] font-semibold text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-primary rounded-full transition-colors whitespace-nowrap border border-slate-100 flex-shrink-0"
            >
              {action}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 lg:px-5 py-3 border-t border-slate-100 flex-shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Escríbele al Admin IA..."
            rows={1}
            className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-shadow leading-relaxed overflow-hidden"
            style={{ minHeight: "40px", maxHeight: "120px" }}
          />
          <button
            onClick={startVoiceRecording}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all flex-shrink-0 ${
              isRecording
                ? "bg-red-500 text-white animate-pulse"
                : "bg-slate-100 text-slate-400 hover:text-primary hover:bg-primary/10"
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/25 hover:scale-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
