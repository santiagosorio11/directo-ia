"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
import { useState, useRef, useEffect } from "react";
import {
  Bell, ChevronDown, LogOut, User, Menu as MenuIcon,
} from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const { restaurant, logout } = useDashboard();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = restaurant?.business_name
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "D";

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white border-b border-slate-100 flex-shrink-0 z-30">
      {/* Empty Left Placeholder since Sidebar relies on hover/touch */}
      <div className="flex items-center gap-3 min-w-0">
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-primary transition-colors"
          >
            <Bell className="w-[18px] h-[18px]" />
            {/* Notification dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden z-50 animate-in">
              <div className="p-4 border-b border-slate-50">
                <h3 className="text-sm font-bold text-slate-800">Notificaciones</h3>
              </div>
              <div className="p-6 text-center text-slate-300 text-sm">
                Sin notificaciones nuevas
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-100 mx-1 hidden sm:block" />

        {/* User Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-2 sm:px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-sm font-black shadow-sm flex-shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left min-w-0">
              <p className="text-sm font-bold text-slate-700 truncate max-w-[220px] leading-tight">
                {restaurant?.business_name || "Mi Restaurante"}
              </p>
              <p className="text-xs text-slate-400 truncate max-w-[220px] leading-tight">
                {restaurant?.email || ""}
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden z-50 animate-in">
              <div className="p-3 border-b border-slate-50">
                <p className="text-xs font-bold text-slate-700 truncate">{restaurant?.business_name}</p>
                <p className="text-[10px] text-slate-400 truncate">{restaurant?.email}</p>
              </div>
              <div className="p-1.5">
                <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl transition-colors font-medium">
                  <User className="w-4 h-4" />
                  Mi Perfil
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
