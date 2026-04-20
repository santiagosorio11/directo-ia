"use client";

import { useDashboard } from "./_context/DashboardContext";
import { useEffect, useState } from "react";
import OverviewSection from "./components/OverviewSection";
import OrdersSection from "./components/OrdersSection";
import PaymentsSection from "./components/PaymentsSection";
import ReservationsSection from "./components/ReservationsSection";
import KanbanSection from "./components/KanbanSection";
import MenuSection from "./components/MenuSection";
import MarketingSection from "./components/MarketingSection";
import SettingsSection from "./components/SettingsSection";
import AdminChatSection from "./components/AdminChatSection";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { isLoading, restaurant } = useDashboard();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const handleTabChange = (e: any) => setActiveTab(e.detail);
    window.addEventListener("dashboardTabChange", handleTabChange);
    return () => window.removeEventListener("dashboardTabChange", handleTabChange);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">Cargando Operación...</p>
      </div>
    );
  }

  if (!restaurant) return null;

  return (
    <div className="flex gap-4 lg:gap-6 h-[calc(100vh-120px)] w-full">
      {/* Módulo Principal */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-w-0 pr-1 pb-6 w-full">
        {activeTab === "overview" && <OverviewSection />}
        {activeTab === "orders" && <OrdersSection />}
        {activeTab === "payments" && <PaymentsSection />}
        {activeTab === "reservations" && <ReservationsSection />}
        {activeTab === "kanban" && <KanbanSection />}
        {activeTab === "menu" && <MenuSection />}
        {activeTab === "marketing" && <MarketingSection />}
        {activeTab === "settings" && <SettingsSection />}
      </div>

      {/* Agente Administrador Global (Oculto en Kanban u Operaciones) */}
      {activeTab !== "kanban" && (
        <div className="hidden lg:flex w-[30%] min-w-[320px] max-w-[400px] flex-shrink-0 border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
          <AdminChatSection embedded />
        </div>
      )}
    </div>
  );
}
