"use client";

import { useState, useEffect } from "react";
import { DashboardProvider } from "./_context/DashboardContext";
import { ToastProvider } from "./components/Toast";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

const TAB_TITLES: Record<string, { title: string; subtitle?: string }> = {
  overview:     { title: "Panel de Control" },
  orders:       { title: "Lista de Pedidos" },
  payments:     { title: "Confirmación de Pagos" },
  reservations: { title: "Reservas", subtitle: "Gestión de mesas y reservaciones" },
  kanban:       { title: "Operación (Kanban)" },
  menu:         { title: "Gestión de Menú" },
  marketing:    { title: "Marketing & WhatsApp", subtitle: "Campañas, promociones y conexión" },
  settings:     { title: "Configuración" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const handler = (e: any) => setActiveTab(e.detail);
    window.addEventListener("dashboardTabChange", handler);
    return () => window.removeEventListener("dashboardTabChange", handler);
  }, []);

  const current = TAB_TITLES[activeTab] || { title: "Dashboard" };

  return (
    <DashboardProvider>
      <ToastProvider>
        <div className="flex h-screen bg-[#F8F9FB] text-foreground overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <TopBar
              title={current.title}
              subtitle={current.subtitle}
            />
            <main className="flex-1 overflow-y-auto p-4 lg:p-6 relative min-w-0">
              {children}
            </main>
          </div>
        </div>
      </ToastProvider>
    </DashboardProvider>
  );
}
