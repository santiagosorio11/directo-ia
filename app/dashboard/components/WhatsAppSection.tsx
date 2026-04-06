"use client";

import { useDashboard } from "@/app/context/DashboardContext";
import { QrCode, Smartphone, Link as LinkIcon, RefreshCcw } from "lucide-react";

export default function WhatsAppSection() {
  const { whatsappConfig } = useDashboard();

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="bg-[#18181B] border border-white/5 p-8 rounded-[32px] flex flex-col items-center justify-center text-center gap-6 py-16">
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl ${whatsappConfig?.is_connected ? 'bg-green-500 shadow-green-500/20' : 'bg-[#FF5200] shadow-[#FF5200]/20'}`}>
          <Smartphone className="w-10 h-10 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-heading font-black text-white">Conexión de WhatsApp</h2>
          <p className="text-white/50 text-base max-w-md mx-auto mt-2">
            Vincula el número de tu restaurante para que el Agente IA pueda responder los mensajes en tiempo real.
          </p>
        </div>

        {whatsappConfig?.is_connected ? (
          <div className="mt-4 flex flex-col items-center gap-4">
            <div className="px-6 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Conectado Activo (+{whatsappConfig.phone_number})
            </div>
            <button className="text-white/30 text-sm font-bold hover:text-red-500 transition-colors mt-4">
              Desvincular número
            </button>
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center gap-6 w-full max-w-sm">
            <div className="w-64 h-64 bg-white rounded-3xl flex items-center justify-center p-4">
              {whatsappConfig?.qr_code_url ? (
                <img src={whatsappConfig.qr_code_url} alt="QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gray-100 rounded-2xl text-gray-400">
                  <QrCode className="w-12 h-12" />
                  <span className="text-sm font-bold text-center px-4">Generando código QR...</span>
                </div>
              )}
            </div>
            
            <button className="flex items-center gap-2 text-[#FF5200] text-sm font-bold hover:text-white transition-colors">
              <RefreshCcw className="w-4 h-4" /> Recargar QR
            </button>

            <ul className="text-left text-sm text-white/50 space-y-3 mt-4 w-full px-4">
              <li className="flex items-start gap-2">
                <span className="text-[#FF5200] font-bold">1.</span> Abre WhatsApp en tu celular.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF5200] font-bold">2.</span> Ve a Configuración &gt; Dispositivos vinculados.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF5200] font-bold">3.</span> Apunta tu cámara a esta pantalla para capturar el código.
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-[#18181B] border border-white/5 p-8 rounded-[32px] flex flex-col gap-4">
          <h3 className="text-xl font-heading font-bold text-white">Campañas (Marketing)</h3>
          <p className="text-white/40 text-sm">Próximamente podrás enviar mensajes masivos a tus clientes recurrentes con promociones.</p>
          <button disabled className="mt-auto py-3 bg-white/5 text-white/20 rounded-full font-bold text-sm cursor-not-allowed">
            Próximamente
          </button>
        </div>
        <div className="bg-[#18181B] border border-white/5 p-8 rounded-[32px] flex flex-col gap-4">
          <h3 className="text-xl font-heading font-bold text-white">Ver Chats en Vivo</h3>
          <p className="text-white/40 text-sm">Monitorea y toma control de cualquier conversación si el cliente prefiere un humano.</p>
          <button disabled className="mt-auto py-3 bg-white/5 text-white/20 rounded-full font-bold text-sm cursor-not-allowed">
            Próximamente
          </button>
        </div>
      </div>
    </div>
  );
}
