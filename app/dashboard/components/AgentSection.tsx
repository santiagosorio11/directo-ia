"use client";

import { useDashboard } from "@/app/context/DashboardContext";
import { useState } from "react";
import { Bot, Save, Mic, Info, Power, AlertTriangle } from "lucide-react";

export default function AgentSection() {
  const { agentConfig, updateAgentStatus, updateDynamicInfo, updatePrompt } = useDashboard();
  const [dynamicNotes, setDynamicNotes] = useState(agentConfig?.dynamic_info?.notes || "");
  const [promptText, setPromptText] = useState(agentConfig?.system_prompt || "");
  const [trainingNotes, setTrainingNotes] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSaveDynamicInfo = async () => {
    await updateDynamicInfo({ ...agentConfig?.dynamic_info, notes: dynamicNotes });
    alert("Información dinámica enviada al agente.");
  };

  const handleSavePrompt = async () => {
    await updatePrompt(promptText, "edit");
    alert("Prompt guardado y actualizado con éxito.");
  };

  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Tu navegador no soporta grabación de voz. Intenta escribirlo.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    
    recognition.onstart = () => setIsRecording(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTrainingNotes((prev) => prev + (prev ? " " : "") + transcript);
    };

    recognition.onend = () => setIsRecording(false);
    
    recognition.start();
  };

  if (!agentConfig) return null;

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Estado del Agente */}
      <div className="bg-[#18181B] border border-white/5 p-8 rounded-[32px] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all ${agentConfig.is_active ? 'bg-green-500 shadow-green-500/20' : 'bg-red-500 shadow-red-500/20'}`}>
            <Power className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-black text-white">Estado del Agente</h2>
            <p className="text-white/50 text-sm mt-1">Activa o desactiva la recepción de pedidos en automático.</p>
          </div>
        </div>
        
        <button
          onClick={() => updateAgentStatus(!agentConfig.is_active)}
          className={`px-8 py-4 rounded-full font-bold text-lg transition-all ${agentConfig.is_active ? 'bg-white/5 text-white/50 hover:bg-red-500 hover:text-white' : 'bg-green-500 text-white shadow-xl shadow-green-500/20 hover:scale-105'}`}
        >
          {agentConfig.is_active ? "Apagar Agente" : "Encender Agente"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Info Dinámica (Contexto situacional temporal) */}
        <div className="bg-[#18181B] border border-white/5 p-8 rounded-[32px] flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Info className="w-6 h-6 text-[#C92A5E]" />
            <h3 className="text-xl font-heading font-bold text-white">Información Dinámica</h3>
          </div>
          <p className="text-white/40 text-sm">Avisa al agente sobre demoras, lluvia, o si cerraron temprano. Se enviará junto al prompt siempre.</p>
          <textarea
            value={dynamicNotes}
            onChange={(e) => setDynamicNotes(e.target.value)}
            placeholder="Ej: Lluvia fuerte, tiempo de entrega aumentó 20 min. Ya no queda postre de chocolate."
            className="w-full bg-[#09090B] border border-white/10 rounded-2xl p-4 text-sm resize-none h-32 focus:ring-2 focus:ring-[#C92A5E]/50 outline-none placeholder:text-white/20 text-white/80"
          ></textarea>
          <button 
            onClick={handleSaveDynamicInfo}
            className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-full font-bold text-sm transition-all focus:ring-2"
          >
            Actualizar Alerta
          </button>
        </div>

        {/* Entrenamiento / Mejoras */}
        <div className="bg-[#18181B] border border-white/5 p-8 rounded-[32px] flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-[#C92A5E]" />
            <h3 className="text-xl font-heading font-bold text-white">Entrenar Agente</h3>
          </div>
          <p className="text-white/40 text-sm">¿Notas algo que responde mal? Dímelo en audio o texto y ajustaré su prompt.</p>
          <div className="relative">
            <textarea
              value={trainingNotes}
              onChange={(e) => setTrainingNotes(e.target.value)}
              placeholder="Ej: Cuando pregunten por cubiertos diles que cobramos extra..."
              className="w-full bg-[#09090B] border border-white/10 rounded-2xl p-4 pr-16 text-sm resize-none h-32 focus:ring-2 focus:ring-[#C92A5E]/50 outline-none placeholder:text-white/20 text-white/80"
            ></textarea>
            <button
              onClick={startVoiceRecording}
              className={`absolute right-3 top-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 animate-pulse text-white' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={() => {
              // Lógica temporal, luego debe pasar a AI -> prompt modification en n8n
              alert("Instrucción enviada a Orbita IA para mejorar el prompt.");
              setTrainingNotes("");
            }}
            className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-full font-bold text-sm transition-all "
          >
            Enviar Instrucción
          </button>
        </div>
      </div>

      {/* Editor del Prompt Estático */}
      <div className="bg-[#18181B] border border-white/5 p-8 rounded-[32px] flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <div>
              <h3 className="text-xl font-heading font-bold text-white">System Prompt (Avanzado)</h3>
              <p className="text-white/40 text-sm mt-1">Este es el corazón de tu Agente. Solo edita si sabes lo que haces.</p>
            </div>
          </div>
          <button 
            onClick={handleSavePrompt}
            className="flex items-center gap-2 px-6 py-3 bg-[#C92A5E] hover:bg-[#A01F48] transition-all rounded-full font-bold text-sm"
          >
            <Save className="w-4 h-4" /> Guardar
          </button>
        </div>
        
        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          className="w-full bg-[#09090B] border border-white/10 rounded-2xl p-6 text-sm resize-none h-96 focus:ring-1 focus:ring-[#C92A5E] outline-none text-green-400 font-mono leading-relaxed"
        ></textarea>
      </div>
    </div>
  );
}
