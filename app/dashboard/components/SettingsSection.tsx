"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
import { Store, Mail, Phone, MapPin, Save, LogOut, Clock, Building2, Plus, RefreshCcw, Loader2 } from "lucide-react";
import { useState } from "react";
import POSIntegrationCard from "./POSIntegrationCard";
import { useToast } from "./Toast";

export default function SettingsSection() {
  const { restaurant, updateRestaurant, logout } = useDashboard();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    business_name: restaurant?.business_name || "",
    email: restaurant?.email || "",
    phone: restaurant?.phone || "",
    address: restaurant?.address || "",
  });

  if (!restaurant) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateRestaurant(formData);
      showToast("Cambios guardados correctamente", "success");
    } catch (e) {
      showToast("Error al guardar los cambios", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8 w-full max-w-3xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-heading font-black text-foreground">Configuración</h2>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1">Gestiona los datos principales de tu restaurante.</p>
      </div>

      <div className="bg-white border border-slate-200 p-5 sm:p-8 rounded-2xl sm:rounded-[40px] flex flex-col gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-6 gap-4">
           <h3 className="text-lg font-black text-slate-800">Perfil del Negocio</h3>
           <button
             onClick={handleSave}
             disabled={saving}
             className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white hover:opacity-90 rounded-full text-sm font-bold transition-all w-full sm:w-auto justify-center shadow-lg shadow-primary/20 disabled:opacity-50"
           >
             {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             {saving ? "Guardando..." : "Guardar Cambios"}
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
                className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              />
              <span className="text-[10px] text-slate-400 font-medium px-1">Aquí recibirás pedidos y reportes semanales.</span>
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

      <div className="bg-white border border-slate-200 p-5 sm:p-8 rounded-2xl sm:rounded-[40px] flex flex-col gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-6 gap-4">
           <div>
             <h3 className="text-lg font-black text-slate-800">Horarios y Sedes</h3>
             <p className="text-sm text-slate-500 font-medium">Gestiona tu operación logística.</p>
           </div>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full text-sm font-bold transition-all w-full sm:w-auto justify-center">
             <Plus className="w-4 h-4 hidden" /> Configurar Detalles
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Horario de Atención
            </label>
            <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl flex items-center justify-between text-slate-700 font-medium cursor-pointer hover:border-primary/50 transition-colors">
              <span>Lunes a Domingo • 11:00 - 22:00</span>
              <span className="text-primary text-xs font-bold">Cambiar</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" /> Sedes / Sucursales
            </label>
            <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl flex items-center justify-between text-slate-700 font-medium cursor-pointer hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[10px] font-black">1</span>
                <span>Sede Principal</span>
              </div>
              <span className="text-primary text-xs font-bold">+ Añadir Sede</span>
            </div>
          </div>
        </div>
      </div>

      <POSIntegrationCard />

      <div className="bg-white border border-primary/10 p-5 sm:p-8 rounded-2xl sm:rounded-[40px] flex flex-col gap-4 shadow-sm shadow-primary/5 group">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-black text-slate-800">Reconfigurar Asistente</h3>
          <p className="text-sm text-slate-500 font-medium">¿Quieres cambiar el tono, la estrategia o el menú de tu agente? Repite el proceso guiado.</p>
        </div>
        <button
          onClick={() => window.location.href = "/onboarding"}
          className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3.5 bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-2xl font-black text-sm transition-all border border-primary/20"
        >
          <RefreshCcw className="w-4 h-4" /> Iniciar Onboarding de Nuevo
        </button>
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
