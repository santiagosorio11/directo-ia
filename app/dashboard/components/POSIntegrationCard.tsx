"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
import { useState, useEffect } from "react";
import { Link2, Loader2, Save, Trash2, CheckCircle2 } from "lucide-react";
import { useToast } from "./Toast";

interface POSIntegration {
  id: string;
  provider: string;
  is_active: boolean;
  updated_at: string;
}

export default function POSIntegrationCard() {
  const { restaurant } = useDashboard();
  const { showToast } = useToast();
  const [integrations, setIntegrations] = useState<POSIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  const [provider, setProvider] = useState("loggro");
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);

  const providers = [
    { id: "loggro", name: "Loggro Restobar" },
    { id: "toteat", name: "Toteat" },
    { id: "vendty", name: "Vendty" },
    { id: "fudo", name: "Fudo" },
    { id: "siigo", name: "Siigo POS" },
    { id: "yummy", name: "Yummy (Delivery)" },
  ];

  useEffect(() => {
    if (restaurant?.id) {
      fetchIntegrations();
    }
  }, [restaurant?.id]);

  const fetchIntegrations = async () => {
    try {
      const res = await fetch(`/api/pos?restaurantId=${restaurant?.id}`);
      if (res.ok) {
        const data = await res.json();
        setIntegrations(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey) {
      showToast?.("Ingresa el API Key o Token", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/pos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: restaurant?.id,
          provider,
          apiKey
        })
      });

      if (res.ok) {
        showToast?.("Integración guardada de forma segura", "success");
        setApiKey("");
        fetchIntegrations();
      } else {
        const data = await res.json();
        showToast?.(data.error || "Error al guardar", "error");
      }
    } catch (e) {
      showToast?.("Error de red", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/pos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, restaurantId: restaurant?.id })
      });
      if (res.ok) {
        showToast?.("Integración eliminada", "success");
        fetchIntegrations();
      }
    } catch (e) {
      showToast?.("Error al eliminar", "error");
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-5 sm:p-8 rounded-2xl sm:rounded-[40px] flex flex-col gap-6 shadow-sm">
      <div className="flex flex-col border-b border-slate-100 pb-6 gap-2">
         <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
           <Link2 className="w-5 h-5 text-primary" /> Integraciones POS <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold ml-2">BETA</span>
         </h3>
         <p className="text-sm text-slate-500 font-medium">
           Conecta tu sistema para que el Agente IA pueda consultar inventario y ventas. Tus credenciales se guardan con cifrado AES-256.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Proveedor
            </label>
            <select
              value={provider}
              onChange={e => setProvider(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
            >
              {providers.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              API Key / Token
            </label>
            <input 
              type="password" 
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="Ingresa tu llave secreta..."
              className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
            />
          </div>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3 mt-2 bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 rounded-2xl text-sm font-bold transition-all w-full"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar y Encriptar
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-100 min-h-[220px]">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Conexiones Activas</h4>
          {loading ? (
             <div className="flex-1 flex items-center justify-center">
               <Loader2 className="w-5 h-5 text-slate-300 animate-spin" />
             </div>
          ) : integrations.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <Link2 className="w-8 h-8 text-slate-200 mb-2" />
              <p className="text-xs font-medium text-slate-400">No hay sistemas POS conectados aún.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {integrations.map(integ => {
                const name = providers.find(p => p.id === integ.provider)?.name || integ.provider;
                return (
                  <div key={integ.id} className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        {name} {integ.is_active && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">Actualizado: {new Date(integ.updated_at).toLocaleDateString()}</span>
                    </div>
                    <button 
                      onClick={() => handleDelete(integ.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar conexión"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
