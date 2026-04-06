"use client";

import { useDashboard } from "@/app/context/DashboardContext";
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
    <div className="flex flex-col gap-8 max-w-3xl">
      <div>
        <h2 className="text-2xl font-heading font-black text-white">Configuración</h2>
        <p className="text-white/50 text-sm mt-1">Gestiona los datos principales de tu restaurante.</p>
      </div>

      <div className="bg-[#18181B] border border-white/5 p-8 rounded-[32px] flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
           <h3 className="text-lg font-bold text-white">Perfil del Negocio</h3>
           <button className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-bold transition-all">
             <Save className="w-4 h-4" /> Guardar
           </button>
        </div>

        <div className="grid gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Store className="w-4 h-4" /> Nombre del Restaurante
            </label>
            <input 
              type="text" 
              value={formData.business_name}
              onChange={e => setFormData({...formData, business_name: e.target.value})}
              className="bg-[#09090B] border border-white/10 px-4 py-3 rounded-xl text-white outline-none focus:border-[#FF5200] transition-colors"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Phone className="w-4 h-4" /> Teléfono
              </label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="bg-[#09090B] border border-white/10 px-4 py-3 rounded-xl text-white outline-none focus:border-[#FF5200] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email de Contacto
              </label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="bg-[#09090B] border border-white/10 px-4 py-3 rounded-xl text-white outline-none focus:border-[#FF5200] transition-colors"
                disabled
              />
              <span className="text-[10px] text-white/30">El email no se puede cambiar.</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Dirección de Despacho
            </label>
            <input 
              type="text" 
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              className="bg-[#09090B] border border-white/10 px-4 py-3 rounded-xl text-white outline-none focus:border-[#FF5200] transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#18181B] border border-red-500/20 p-8 rounded-[32px] flex flex-col gap-4">
        <h3 className="text-lg font-bold text-red-500">Zona de Peligro</h3>
        <p className="text-sm text-white/50 mb-2">Acciones que afectan tu sesión actual.</p>
        <button 
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-all"
        >
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
