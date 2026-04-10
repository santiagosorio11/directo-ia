"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
import { useState } from "react";
import {
  Bot, ClipboardList, Wallet, Columns, Utensils,
  MessageCircle, Settings, LogOut, ChevronLeft, ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  const { restaurant, agentConfig, logout } = useDashboard();
  const [activeTab, setActiveTab] = useState("agent");
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);

  // expanded applies to the visual width, but not the layout width
  const expanded = pinned || hovered;

  const tabs = [
    { id: "agent",    name: "Mi Agente",  icon: Bot },
    { id: "whatsapp", name: "WhatsApp",   icon: MessageCircle },
    { id: "orders",   name: "Pedidos",    icon: ClipboardList },
    { id: "payments", name: "Pagos",      icon: Wallet },
    { id: "kanban",   name: "Operación",  icon: Columns },
    { id: "menu",     name: "Menú",       icon: Utensils },
    { id: "settings", name: "Ajustes",    icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    window.dispatchEvent(new CustomEvent("dashboardTabChange", { detail: tabId }));
  };

  return (
    <aside
      className="relative z-50 flex-shrink-0 w-[68px] h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 
        This internal div is the one that actually expands. 
        It's absolute so it stays on top of the content without pushing it.
      */}
      <div
        className={`
          absolute top-0 left-0 h-full flex flex-col justify-between
          bg-white border-r border-slate-200 shadow-xl transition-all duration-300 ease-in-out
          ${expanded ? "w-64" : "w-[68px]"}
          py-5 px-3 overflow-hidden
        `}
      >
        {/* ── Top section ── */}
        <div className="flex flex-col gap-6 min-w-0">

          {/* Logo + business name */}
          <div className={`flex items-center gap-3 pl-1 ${expanded ? "" : "justify-center"}`}>
            <Link
              href="/"
              className="relative flex-shrink-0 w-9 h-9 rounded-xl overflow-hidden bg-primary shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              <Image src="/LOGODIRECTO.jpg" alt="DIRECTO" fill className="object-cover" />
            </Link>

            <div
              className={`flex flex-col min-w-0 transition-opacity duration-200 ${
                expanded ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <h2 className="font-bold text-sm leading-tight text-slate-800 truncate whitespace-nowrap">
                {restaurant?.business_name || "Cargando..."}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    agentConfig?.is_active
                      ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]"
                      : "bg-red-400"
                  }`}
                />
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold whitespace-nowrap">
                  {agentConfig?.is_active ? "En línea" : "Apagado"}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    group relative w-full flex items-center rounded-xl
                    transition-all duration-200 font-semibold text-sm
                    ${expanded ? "gap-3 px-3 py-2.5" : "justify-center px-0 py-2.5"}
                    ${isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-colors ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-primary"
                    }`}
                  />
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${
                      expanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
                    }`}
                  >
                    {tab.name}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Bottom section ── */}
        <div className="flex flex-col gap-1">
          {/* Pin toggle — only on desktop (lg+) */}
          <button
            onClick={() => setPinned(!pinned)}
            className={`
              hidden lg:flex items-center rounded-xl py-2
              text-slate-300 hover:text-slate-500 hover:bg-slate-50
              transition-all duration-200
              ${expanded ? "gap-3 px-3" : "justify-center px-0"}
            `}
            title={pinned ? "Desanclar" : "Fijar panel"}
          >
            {pinned
              ? <ChevronLeft className="w-4 h-4 flex-shrink-0" />
              : <ChevronRight className="w-4 h-4 flex-shrink-0" />
            }
            <span
              className={`whitespace-nowrap overflow-hidden text-xs font-bold transition-all duration-200 ${
                expanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
              }`}
            >
              {pinned ? "Desanclar" : "Fijar panel"}
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className={`
              group flex items-center rounded-xl py-2.5
              text-slate-400 hover:bg-red-50 hover:text-red-500
              transition-all duration-200 font-semibold text-sm
              ${expanded ? "gap-3 px-3" : "justify-center px-0"}
            `}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${
                expanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
              }`}
            >
              Cerrar Sesión
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
