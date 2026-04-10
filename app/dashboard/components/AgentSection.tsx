"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
import { useState, useEffect } from "react";
import { Bot, Save, Mic, Info, Power, AlertTriangle } from "lucide-react";

export default function AgentSection() {
  const { agentConfig, updateAgentStatus, updateDynamicInfo, updatePrompt, improvePrompt } = useDashboard();
  const [dynamicNotes, setDynamicNotes] = useState(agentConfig?.dynamic_info?.notes || "");
  const [promptText, setPromptText] = useState(agentConfig?.system_prompt || "");
  const [trainingNotes, setTrainingNotes] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    if (agentConfig) {
      setPromptText(agentConfig.system_prompt);
      setDynamicNotes(agentConfig.dynamic_info?.notes || "");
    }
  }, [agentConfig]);

  const handleSaveDynamicInfo = async () => {
    await updateDynamicInfo({ ...agentConfig?.dynamic_info, notes: dynamicNotes });
    alert("Información dinámica enviada al agente.");
  };

  const handleSavePrompt = async () => {
    await updatePrompt(promptText, "edit");
    alert("Prompt guardado y actualizado con éxito.");
  };

  const handleTrainAgent = async () => {
    if (!trainingNotes.trim()) return;
    setIsTraining(true);
    try {
      await improvePrompt(trainingNotes);
      setTrainingNotes("");
      alert("¡Instrucción procesada! Orbita IA ha ajustado el cerebro de tu agente.");
    } catch (error) {
      alert("No se pudo completar el entrenamiento. Intenta de nuevo.");
    } finally {
      setIsTraining(false);
    }
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
    <div className="flex flex-col gap-6 lg:gap-8 w-full">
      {/* Estado del Agente */}
      <div className="bg-white border border-slate-200 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transition-all flex-shrink-0 ${agentConfig.is_active ? 'bg-green-500 shadow-green-500/20' : 'bg-red-500 shadow-red-500/20'}`}>
            <Power className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-black text-foreground">Estado del Agente</h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">Activa o desactiva la recepción de pedidos en automático.</p>
          </div>
        </div>
        
        <button
          onClick={() => updateAgentStatus(!agentConfig.is_active)}
          className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-lg transition-all flex-shrink-0 ${agentConfig.is_active ? 'bg-slate-100 text-slate-500 hover:bg-red-500 hover:text-white' : 'bg-green-500 text-white shadow-xl shadow-green-500/20 hover:scale-105'}`}
        >
          {agentConfig.is_active ? "Apagar Agente" : "Encender Agente"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Info Dinámica */}
        <div className="bg-white border border-slate-200 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] flex flex-col gap-4 sm:gap-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
            <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">Información Dinámica</h3>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">Avisa al agente sobre demoras, lluvia, o si cerraron temprano. Se enviará junto al prompt siempre.</p>
          <textarea
            value={dynamicNotes}
            onChange={(e) => setDynamicNotes(e.target.value)}
            placeholder="Ej: Lluvia fuerte, tiempo de entrega aumentó 20 min. Ya no queda postre de chocolate."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-sm resize-none h-28 sm:h-32 focus:ring-2 focus:ring-primary/50 outline-none placeholder:text-slate-400 text-slate-700"
          ></textarea>
          <button 
            onClick={handleSaveDynamicInfo}
            className="w-full py-3 sm:py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold text-sm transition-all focus:ring-2"
          >
            Actualizar Alerta
          </button>
        </div>

        {/* Entrenamiento */}
        <div className="bg-white border border-slate-200 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] flex flex-col gap-4 sm:gap-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
            <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">Entrenar Agente</h3>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">¿Notas algo que responde mal? Dímelo en audio o texto y ajustaré su prompt.</p>
          <div className="relative">
            <textarea
              value={trainingNotes}
              onChange={(e) => setTrainingNotes(e.target.value)}
              placeholder="Ej: Cuando pregunten por cubiertos diles que cobramos extra..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 pr-14 text-sm resize-none h-28 sm:h-32 focus:ring-2 focus:ring-primary/50 outline-none placeholder:text-slate-400 text-slate-700"
            ></textarea>
            <button
              onClick={startVoiceRecording}
              className={`absolute right-3 top-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 animate-pulse text-white' : 'bg-slate-100 text-slate-500 hover:bg-primary hover:text-white shadow-sm'}`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={handleTrainAgent}
            disabled={isTraining || !trainingNotes.trim()}
            className="w-full py-3 sm:py-4 bg-primary text-white rounded-full font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTraining ? "Procesando..." : "Enviar Instrucción"}
          </button>
        </div>
      </div>

      {/* Editor del Prompt Estático */}
      <div className="bg-white border border-slate-200 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] flex flex-col gap-4 sm:gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">System Prompt (Avanzado)</h3>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">Este es el corazón de tu Agente. Solo edita si sabes lo que haces.</p>
            </div>
          </div>
          <button 
            onClick={handleSavePrompt}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white hover:scale-[1.02] transition-all rounded-full font-bold text-sm w-full sm:w-auto justify-center flex-shrink-0 shadow-lg shadow-primary/20"
          >
            <Save className="w-4 h-4" /> Guardar
          </button>
        </div>
        
        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-sm resize-none h-64 sm:h-96 focus:ring-2 focus:ring-primary/40 outline-none text-slate-700 font-mono leading-relaxed"
        ></textarea>
      </div>
    </div>
  );
}
