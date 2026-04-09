"use client";

import { useDashboard } from "@/app/context/DashboardContext";
import { Plus, Image as ImageIcon, Edit2, Trash2 } from "lucide-react";

export default function MenuSection() {
  const { menu } = useDashboard();

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-black text-white">Gestión de Menú</h2>
          <p className="text-white/50 text-sm mt-1">Estos son los productos que tu Agente IA le ofrece a tus clientes.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#C92A5E] hover:bg-[#A01F48] transition-all px-6 py-3 rounded-full text-sm font-bold text-white shadow-xl shadow-[#C92A5E]/20">
          <Plus className="w-4 h-4" /> Nuevo Producto
        </button>
      </div>

      {menu.length === 0 ? (
        <div className="bg-[#18181B] border border-white/5 p-16 rounded-[40px] flex flex-col items-center justify-center text-center gap-4 mt-8">
           <div className="text-white/50 text-base font-medium">Aún no tienes productos en tu menú.</div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menu.map((item) => (
            <div key={item.id} className="bg-[#18181B] border border-white/5 rounded-3xl overflow-hidden group hover:border-[#C92A5E]/30 transition-all flex flex-col">
              <div className="h-40 bg-black relative flex flex-col items-center justify-center group-hover:bg-white/5 transition-colors">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-white/20">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-[10px] font-bold uppercase tracking-widest px-8 text-center">Subir foto de {item.name}</span>
                  </div>
                )}
                
                {/* Actions overlay */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-8 h-8 bg-black/60 backdrop-blur rounded-full flex items-center justify-center hover:bg-[#C92A5E] transition-colors">
                    <Edit2 className="w-3 h-3 text-white" />
                  </button>
                  <button className="w-8 h-8 bg-black/60 backdrop-blur rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-bold text-white text-base leading-tight">{item.name}</h3>
                  <div className="text-[#C92A5E] font-black">${item.price.toLocaleString()}</div>
                </div>
                <p className="text-xs text-white/50 leading-relaxed mb-4 flex-1 line-clamp-3">
                  {item.description || "Sin descripción detallada."}
                </p>
                <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">{item.category}</span>
                  <div className={`w-2 h-2 rounded-full ${item.is_available ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
