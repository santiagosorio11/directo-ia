"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
import { useState } from "react";
import { Megaphone, Plus, Tag, Gift, Percent, Send, X, Check, Search } from "lucide-react";
import { useToast } from "./Toast";

export default function MarketingSection() {
  const { menu } = useDashboard();
  const { showToast } = useToast();
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [promoTitle, setPromoTitle] = useState("");

  const handleCreatePromo = () => {
    if (!promoTitle) {
      showToast("Escribe un título para la promoción", "error");
      return;
    }
    if (selectedItems.length === 0) {
      showToast("Selecciona al menos un producto", "error");
      return;
    }
    showToast("Promoción creada correctamente", "success");
    setShowPromoModal(false);
    setSelectedItems([]);
    setPromoTitle("");
  };

  const toggleItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-black text-foreground">Marketing</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">Repertorio de promociones y estrategias para tus clientes.</p>
        </div>
      </div>

      {/* Promociones de Menú */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-lg font-black text-slate-800">Promociones Activas</h3>
          <button 
            onClick={() => setShowPromoModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:opacity-90 rounded-full text-xs font-bold transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-3.5 h-3.5" /> Nueva Promoción
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Promo Card 1 */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl sm:rounded-[32px] flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={() => setShowPromoModal(true)}>
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Percent className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-wider rounded-lg">Activa</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 leading-tight">20% de Descuento</h3>
              <p className="text-xs text-slate-500 mt-1">En toda la carta de martes a jueves.</p>
            </div>
          </div>

          {/* Promo Card 2 */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl sm:rounded-[32px] flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={() => setShowPromoModal(true)}>
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Gift className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider rounded-lg">Pausada</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 leading-tight">Postre Gratis</h3>
              <p className="text-xs text-slate-500 mt-1">En pedidos superiores a $50.000.</p>
            </div>
          </div>

          {/* Promo Card 3 */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl sm:rounded-[32px] flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={() => setShowPromoModal(true)}>
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Tag className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider rounded-lg">Borrador</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 leading-tight">2x1 en Hamburguesas</h3>
              <p className="text-xs text-slate-500 mt-1">Válido solo para clientes nuevos.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Campañas de WhatsApp */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-lg font-black text-slate-800">Campañas Masivas (WhatsApp)</h3>
          <button 
            onClick={() => showToast("Esta función estará disponible muy pronto", "info")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white hover:opacity-90 rounded-full text-xs font-bold transition-all shadow-lg"
          >
            <Send className="w-3.5 h-3.5" /> Enviar Mensaje Masivo
          </button>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 text-center py-10">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
             <Megaphone className="w-8 h-8" />
           </div>
           <h4 className="text-lg font-black text-slate-700">Comunícate con tus clientes</h4>
           <p className="text-sm text-slate-500 max-w-md">
             Envía mensajes masivos por WhatsApp a clientes recurrentes o intenta recuperar a aquellos que no compran hace más de 30 días con una oferta especial.
           </p>
        </div>
      </div>

      {/* Pop-up Nueva Promoción */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-800">Crear Promoción</h3>
              <button 
                onClick={() => setShowPromoModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                 <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre de la promo</label>
                <input 
                  type="text" 
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  placeholder="Ej: 2x1 Martes, 15% Descuento..."
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aplicar a productos</label>
                  <span className="text-xs font-bold text-primary">{selectedItems.length} seleccionados</span>
                </div>
                
                <div className="relative mb-3">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar producto..."
                    className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-sm outline-none focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {Object.entries(
                    menu.reduce((acc, item) => {
                      if (!acc[item.category]) acc[item.category] = [];
                      acc[item.category].push(item);
                      return acc;
                    }, {} as Record<string, typeof menu>)
                  ).map(([categoryName, items]) => (
                     <div key={categoryName} className="mb-4">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{categoryName}</p>
                       <div className="space-y-1">
                         {items.map(item => {
                           const isSelected = selectedItems.includes(item.id);
                           return (
                             <div 
                               key={item.id} 
                               onClick={() => toggleItem(item.id)}
                               className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                                 isSelected ? "border-primary bg-primary/5" : "border-slate-100 hover:border-slate-200 bg-white"
                               }`}
                             >
                               <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                               <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                                 isSelected ? "bg-primary text-white" : "border-2 border-slate-200"
                               }`}>
                                 {isSelected && <Check className="w-3 h-3" />}
                               </div>
                             </div>
                           )
                         })}
                       </div>
                     </div>
                  ))}
                  {(!menu || menu.length === 0) && (
                    <p className="text-sm text-slate-400 text-center py-4">No hay productos en el menú</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button 
                onClick={handleCreatePromo}
                className="w-full py-3.5 bg-primary text-white rounded-2xl text-sm font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
              >
                Guardar Promoción
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
