"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, ClipboardList, Wallet, Columns, Utensils,
  Megaphone, Settings, CalendarCheck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  const { restaurant, agentConfig } = useDashboard();
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileExpanded, setMobileExpanded] = useState(false);

  useEffect(() => {
    const handleTabChange = (e: any) => setActiveTab(e.detail);
    window.addEventListener("dashboardTabChange", handleTabChange);
    return () => window.removeEventListener("dashboardTabChange", handleTabChange);
  }, []);

  const mainTabs = [
    { id: "overview",      name: "Inicio",               icon: LayoutDashboard },
    { id: "orders",        name: "Pedidos",              icon: ClipboardList },
    { id: "payments",      name: "Pagos",                icon: Wallet },
    { id: "reservations",  name: "Reservas",             icon: CalendarCheck },
    { id: "kanban",        name: "Operación",            icon: Columns },
    { id: "menu",          name: "Menú",                 icon: Utensils },
    { id: "marketing",     name: "Marketing",            icon: Megaphone },
  ];

  const bottomTabs = [
    { id: "settings",   name: "Ajustes",    icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    window.dispatchEvent(new CustomEvent("dashboardTabChange", { detail: tabId }));
    setMobileExpanded(false);
  };

  /* ── Nav items ── */
  const renderNav = (tabList: typeof mainTabs, showLabels: boolean) => (
    <nav className="flex flex-col gap-2 mt-4">
      {tabList.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              group relative w-full flex items-center rounded-lg
              transition-all duration-150 font-semibold text-sm
              ${showLabels ? "gap-3 px-3 py-3" : "justify-center px-0 py-3"}
              ${isActive
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "text-slate-500 hover:bg-slate-50 hover:text-primary"
              }
            `}
          >
            <Icon
              className={`w-[20px] h-[20px] flex-shrink-0 transition-colors ${
                isActive ? "text-white" : "text-slate-400 group-hover:text-primary"
              }`}
            />
            {showLabels && (
              <span className="whitespace-nowrap">{tab.name}</span>
            )}
          </button>
        );
      })}
    </nav>
  );

  /* ── Logo + status ── */
  const renderLogo = (showLabels: boolean) => (
    <div className={`flex items-center gap-3 pl-1 mb-2 mt-2 ${showLabels ? "" : "justify-center"}`}>
      <Link
        href="/"
        className="relative flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-primary shadow-md shadow-primary/20 hover:scale-105 transition-transform"
      >
        <Image src="/LOGODIRECTO.jpg" alt="DIRECTO" fill sizes="40px" className="object-cover" />
      </Link>
      {showLabels && (
        <h2 className="font-heading font-black text-lg text-slate-800 tracking-tight">
          DIRECTO
        </h2>
      )}
    </div>
  );

  return (
    <>
      {/* ════════════════════════════════════════════════════════ */}
      {/*  DESKTOP (lg+): Always expanded, in-flow                */}
      {/* ════════════════════════════════════════════════════════ */}
      <aside className="hidden lg:flex flex-shrink-0 w-52 h-full bg-white border-r border-slate-100">
        <div className="h-full w-full flex flex-col justify-between py-4 px-2 overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-4">
            {renderLogo(true)}
            <div className="h-px bg-slate-100 mx-1" />
            {renderNav(mainTabs, true)}
          </div>
          <div className="flex flex-col gap-4 mt-8 pb-2">
            {renderNav(bottomTabs, true)}
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════ */}
      {/*  MOBILE (<lg): Mini icon bar (60px), expands on hover  */}
      {/* ════════════════════════════════════════════════════════ */}

      {/* Backdrop when mobile-expanded */}
      {mobileExpanded && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setMobileExpanded(false)}
        />
      )}

      <aside
        className={`
          lg:hidden fixed top-0 left-0 h-full z-50
          bg-white border-r border-slate-100
          transition-all duration-300 ease-in-out
          ${mobileExpanded ? "w-52 shadow-xl" : "w-[60px]"}
        `}
        onMouseEnter={() => setMobileExpanded(true)}
        onMouseLeave={() => setMobileExpanded(false)}
        onTouchStart={() => setMobileExpanded(true)}
      >
        <div className="h-full w-full flex flex-col justify-between py-4 px-2 overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-4">
            {renderLogo(mobileExpanded)}
            <div className="h-px bg-slate-100 mx-1" />
            {renderNav(mainTabs, mobileExpanded)}
          </div>
          <div className="flex flex-col gap-4 mt-8 pb-2">
            {renderNav(bottomTabs, mobileExpanded)}
          </div>
        </div>
      </aside>

      {/* Spacer for mobile — pushes content to the right of the mini bar */}
      <div className="lg:hidden w-[60px] flex-shrink-0" />
    </>
  );
}
