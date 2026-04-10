"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
import { QrCode, Smartphone, Link as LinkIcon, RefreshCcw } from "lucide-react";

export default function WhatsAppSection() {
  const { whatsappConfig } = useDashboard();

  return (
    <div className="flex flex-col gap-6 lg:gap-8 w-full">
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl sm:rounded-[32px] flex flex-col items-center justify-center text-center gap-6 py-10 sm:py-16 shadow-sm">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl ${whatsappConfig?.is_connected ? 'bg-green-500 shadow-green-500/20' : 'bg-primary shadow-primary/20'}`}>
          <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-foreground">Conexión de WhatsApp</h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto mt-2">
            Vincula el número de tu restaurante para que el Agente IA pueda responder los mensajes en tiempo real.
          </p>
        </div>

        {whatsappConfig?.is_connected ? (
          <div className="mt-4 flex flex-col items-center gap-4">
            <div className="px-4 sm:px-6 py-2 rounded-full bg-green-50 border border-green-100 text-green-600 font-bold uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Conectado Activo (+{whatsappConfig.phone_number})
            </div>
            <button className="text-slate-400 text-sm font-bold hover:text-red-500 transition-colors mt-4">
              Desvincular número
            </button>
          </div>
        ) : (
          <div className="mt-4 sm:mt-8 flex flex-col items-center gap-6 w-full max-w-sm">
            <div className="w-48 h-48 sm:w-64 sm:h-64 bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-3xl flex items-center justify-center p-3 sm:p-4 shadow-inner">
              {whatsappConfig?.qr_code_url ? (
                <img src={whatsappConfig.qr_code_url} alt="QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-white rounded-xl sm:rounded-2xl text-slate-300">
                  <QrCode className="w-10 h-10 sm:w-12 sm:h-12" />
                  <span className="text-xs sm:text-sm font-bold text-center px-4">Generando código QR...</span>
                </div>
              )}
            </div>
            
            <button className="flex items-center gap-2 text-primary text-sm font-bold hover:opacity-80 transition-colors">
              <RefreshCcw className="w-4 h-4" /> Recargar QR
            </button>

            <ul className="text-left text-sm text-muted-foreground space-y-3 mt-4 w-full px-2 sm:px-4">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span> Abre WhatsApp en tu celular.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span> Ve a Configuración &gt; Dispositivos vinculados.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span> Apunta tu cámara a esta pantalla para capturar el código.
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-white border border-slate-200 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] flex flex-col gap-4 shadow-sm">
          <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">Campañas (Marketing)</h3>
          <p className="text-muted-foreground text-xs sm:text-sm">Próximamente podrás enviar mensajes masivos a tus clientes recurrentes con promociones.</p>
          <button disabled className="mt-auto py-3 bg-slate-50 text-slate-300 rounded-full font-bold text-sm cursor-not-allowed">
            Próximamente
          </button>
        </div>
        <div className="bg-white border border-slate-200 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] flex flex-col gap-4 shadow-sm">
          <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">Ver Chats en Vivo</h3>
          <p className="text-muted-foreground text-xs sm:text-sm">Monitorea y toma control de cualquier conversación si el cliente prefiere un humano.</p>
          <button disabled className="mt-auto py-3 bg-slate-50 text-slate-300 rounded-full font-bold text-sm cursor-not-allowed">
            Próximamente
          </button>
        </div>
      </div>
    </div>
  );
}
