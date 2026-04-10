"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
import { Plus, Image as ImageIcon, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

export default function MenuSection() {
  const { menu, addMenuItem, updateMenuItem, deleteMenuItem } = useDashboard();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNew = async () => {
    setIsAdding(true);
    try {
      await addMenuItem({
        name: "Nuevo Plato",
        price: 0,
        description: "",
        category: "General",
        is_available: true
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-black text-foreground">Gestión de Menú</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">Estos son los productos que tu Agente IA le ofrece a tus clientes.</p>
        </div>
        <button 
          onClick={handleAddNew}
          disabled={isAdding}
          className="flex items-center gap-2 bg-primary hover:opacity-90 transition-all px-5 sm:px-6 py-3 rounded-full text-sm font-bold text-white shadow-xl shadow-primary/20 w-full sm:w-auto justify-center flex-shrink-0 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> {isAdding ? "Añadiendo..." : "Nuevo Producto"}
        </button>
      </div>

      {menu.length === 0 && !isAdding ? (
        <div className="bg-white border border-slate-200 p-12 sm:p-16 rounded-2xl sm:rounded-[40px] flex flex-col items-center justify-center text-center gap-4 mt-4 sm:mt-8 shadow-sm">
           <div className="text-slate-400 text-sm sm:text-base font-medium">Aún no tienes productos en tu menú.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {menu.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl overflow-hidden group hover:border-primary/30 hover:shadow-lg transition-all flex flex-col shadow-sm">
              <div className="h-32 sm:h-36 bg-slate-100 relative flex flex-col items-center justify-center group-hover:bg-slate-50 transition-colors">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-[9px] font-bold uppercase tracking-widest px-6 text-center leading-tight">Sin foto</span>
                  </div>
                )}
                
                <div className="absolute top-3 right-3 flex gap-2">
                  <button 
                    onClick={() => deleteMenuItem(item.id)}
                    className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white text-slate-400 transition-colors shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <input 
                    type="text"
                    value={item.name}
                    onChange={(e) => updateMenuItem(item.id, { name: e.target.value })}
                    className="font-bold text-slate-800 text-sm sm:text-base bg-transparent border-none focus:ring-1 focus:ring-primary/20 rounded outline-none p-0"
                    placeholder="Nombre del plato"
                  />
                  <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg w-fit">
                    <span className="text-xs font-bold text-primary">$</span>
                    <input 
                      type="number"
                      value={item.price}
                      onChange={(e) => updateMenuItem(item.id, { price: Number(e.target.value) })}
                      className="text-xs font-black text-primary bg-transparent border-none focus:ring-0 outline-none w-20 p-0"
                      placeholder="0"
                    />
                  </div>
                </div>

                <textarea 
                  value={item.description}
                  onChange={(e) => updateMenuItem(item.id, { description: e.target.value })}
                  className="text-[11px] text-muted-foreground leading-snug resize-none h-16 bg-transparent border-none focus:ring-1 focus:ring-primary/20 rounded outline-none p-0"
                  placeholder="Descripción del plato..."
                />

                <div className="pt-3 border-t border-slate-50 flex justify-between items-center mt-auto">
                  <input 
                    type="text"
                    value={item.category}
                    onChange={(e) => updateMenuItem(item.id, { category: e.target.value })}
                    className="text-[9px] uppercase font-black text-slate-300 tracking-widest bg-transparent border-none focus:ring-0 outline-none p-0 w-24"
                    placeholder="Categoría"
                  />
                  <button 
                    onClick={() => updateMenuItem(item.id, { is_available: !item.is_available })}
                    className={`w-3 h-3 rounded-full transition-all ${item.is_available ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-slate-200'}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
