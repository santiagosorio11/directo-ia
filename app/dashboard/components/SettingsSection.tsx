"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
import { Store, Mail, Phone, MapPin, Save, LogOut } from "lucide-react";
import { useState } from "react";

export default function SettingsSection() {
  const { restaurant, logout } = useDashboard();
  const [formData, setFormData] = useState({
    business_name: restaurant?.business_name || "",
    email: restaurant?.email || "",
    phone: restaurant?.phone || "",
    address: restaurant?.address || "",
  });

  if (!restaurant) return null;

  return (
    <div className="flex flex-col gap-6 lg:gap-8 w-full max-w-3xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-heading font-black text-foreground">Configuración</h2>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1">Gestiona los datos principales de tu restaurante.</p>
      </div>

      <div className="bg-white border border-slate-200 p-5 sm:p-8 rounded-2xl sm:rounded-[40px] flex flex-col gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-6 gap-4">
           <h3 className="text-lg font-black text-slate-800">Perfil del Negocio</h3>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white hover:opacity-90 rounded-full text-sm font-bold transition-all w-full sm:w-auto justify-center shadow-lg shadow-primary/20">
             <Save className="w-4 h-4" /> Guardar Cambios
           </button>
        </div>

        <div className="grid gap-5 sm:gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" /> Nombre del Restaurante
            </label>
            <input 
              type="text" 
              value={formData.business_name}
              onChange={e => setFormData({...formData, business_name: e.target.value})}
              className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" /> Teléfono
              </label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> Email de Contacto
              </label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="bg-slate-100/50 border border-slate-200 px-4 py-3 rounded-2xl text-slate-400 outline-none font-medium cursor-not-allowed opacity-70"
                disabled
              />
              <span className="text-[10px] text-slate-400 font-medium px-1">El email no se puede cambiar.</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Dirección de Despacho
            </label>
            <input 
              type="text" 
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-red-100 p-5 sm:p-8 rounded-2xl sm:rounded-[40px] flex flex-col gap-4 shadow-sm shadow-red-500/5">
        <h3 className="text-lg font-black text-red-500">Zona de Peligro</h3>
        <p className="text-sm text-slate-500 font-medium mb-2">Acciones que afectan tu sesión actual.</p>
        <button 
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl font-black text-sm transition-all border border-red-100"
        >
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
