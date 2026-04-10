"use client";

import { useDashboard } from "./_context/DashboardContext";
import { useEffect, useState } from "react";
import AgentSection from "./components/AgentSection";
import WhatsAppSection from "./components/WhatsAppSection";
import OrdersSection from "./components/OrdersSection";
import PaymentsSection from "./components/PaymentsSection";
import KanbanSection from "./components/KanbanSection";
import MenuSection from "./components/MenuSection";
import SettingsSection from "./components/SettingsSection";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { isLoading, restaurant } = useDashboard();
  const [activeTab, setActiveTab] = useState("agent");

  useEffect(() => {
    const handleTabChange = (e: any) => setActiveTab(e.detail);
    window.addEventListener("dashboardTabChange", handleTabChange);
    return () => window.removeEventListener("dashboardTabChange", handleTabChange);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground/60 font-bold tracking-widest text-sm uppercase">Cargando Operación...</p>
      </div>
    );
  }

  if (!restaurant) return null;

  return (
    <div className="h-full w-full flex flex-col min-w-0">
      <header className="mb-6 lg:mb-8 flex-shrink-0">
        <h1 className="text-2xl lg:text-3xl font-heading font-extrabold text-foreground">
          {activeTab === "agent" && "Mi Agente"}
          {activeTab === "whatsapp" && "WhatsApp"}
          {activeTab === "orders" && "Lista de Pedidos"}
          {activeTab === "payments" && "Confirmación de Pagos"}
          {activeTab === "kanban" && "Operación (Kanban)"}
          {activeTab === "menu" && "Gestión de Menú"}
          {activeTab === "settings" && "Configuración"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1 truncate">Control de operaciones para {restaurant.business_name}</p>
      </header>

      <div className="flex-1 overflow-y-auto pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-w-0">
        {activeTab === "agent" && <AgentSection />}
        {activeTab === "whatsapp" && <WhatsAppSection />}
        {activeTab === "orders" && <OrdersSection />}
        {activeTab === "payments" && <PaymentsSection />}
        {activeTab === "kanban" && <KanbanSection />}
        {activeTab === "menu" && <MenuSection />}
        {activeTab === "settings" && <SettingsSection />}
      </div>
    </div>
  );
}
