"use client";

import { useDashboard } from "@/app/context/DashboardContext";
import { useState } from "react";
import { Bot, ClipboardList, Wallet, Columns, Utensils, MessageCircle, Settings, LogOut, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  const { restaurant, agentConfig, logout } = useDashboard();
  const [activeTab, setActiveTab] = useState("agent");

  const tabs = [
    { id: "agent", name: "Mi Agente", icon: Bot },
    { id: "whatsapp", name: "WhatsApp", icon: MessageCircle },
    { id: "orders", name: "Pedidos", icon: ClipboardList },
    { id: "payments", name: "Confirmación Pagos", icon: Wallet },
    { id: "kanban", name: "Operación (Kanban)", icon: Columns },
    { id: "menu", name: "Menú", icon: Utensils },
    { id: "settings", name: "Configuración", icon: Settings },
  ];

  return (
    <div className="w-72 bg-[#101014] border-r border-white/5 flex flex-col justify-between p-6">
      <div>
        <div className="flex items-center gap-3 mb-10 pl-2">
          <Link href="/" className="relative w-10 h-10 rounded-xl overflow-hidden bg-primary shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            <Image src="/LOGODIRECTO.jpg" alt="DIRECTO" fill className="object-cover" />
          </Link>
          <div>
            <h2 className="font-bold text-sm leading-tight text-white/90">
              {restaurant?.business_name || "Cargando..."}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-1.5 h-1.5 rounded-full ${agentConfig?.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
              <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold">
                {agentConfig?.is_active ? "En línea" : "Apagado"}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  // Disparar evento personalizado para cambiar la vista en la página principal
                  window.dispatchEvent(new CustomEvent("dashboardTabChange", { detail: tab.id }));
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-semibold text-sm ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/10" 
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-white/40"}`} />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      <button 
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/30 hover:bg-red-500/10 hover:text-red-500 transition-all font-semibold text-sm w-full"
      >
        <LogOut className="w-5 h-5" />
        Cerrar Sesión
      </button>
    </div>
  );
}
