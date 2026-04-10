"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
import { Plus, Image as ImageIcon, Edit2, Trash2 } from "lucide-react";

export default function MenuSection() {
  const { menu } = useDashboard();

  return (
    <div className="flex flex-col gap-6 lg:gap-8 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-black text-foreground">Gestión de Menú</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">Estos son los productos que tu Agente IA le ofrece a tus clientes.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:opacity-90 transition-all px-5 sm:px-6 py-3 rounded-full text-sm font-bold text-white shadow-xl shadow-primary/20 w-full sm:w-auto justify-center flex-shrink-0">
          <Plus className="w-4 h-4" /> Nuevo Producto
        </button>
      </div>

      {menu.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 sm:p-16 rounded-2xl sm:rounded-[40px] flex flex-col items-center justify-center text-center gap-4 mt-4 sm:mt-8 shadow-sm">
           <div className="text-slate-400 text-sm sm:text-base font-medium">Aún no tienes productos en tu menú.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {menu.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl overflow-hidden group hover:border-primary/30 hover:shadow-lg transition-all flex flex-col shadow-sm">
              <div className="h-36 sm:h-40 bg-slate-100 relative flex flex-col items-center justify-center group-hover:bg-slate-50 transition-colors">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-[10px] font-bold uppercase tracking-widest px-6 sm:px-8 text-center leading-tight">Subir foto de {item.name}</span>
                  </div>
                )}
                
                {/* Actions overlay */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-primary hover:text-white text-slate-600 transition-colors shadow-sm">
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white text-slate-600 transition-colors shadow-sm">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">{item.name}</h3>
                  <div className="text-primary font-black flex-shrink-0">${item.price.toLocaleString()}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
                  {item.description || "Sin descripción detallada."}
                </p>
                <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-slate-300 tracking-widest">{item.category}</span>
                  <div className={`w-2 h-2 rounded-full ${item.is_available ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-400'}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
