"use client";

import { useDashboard, MenuItem } from "@/app/dashboard/_context/DashboardContext";
import { Plus, Image as ImageIcon, Edit2, Trash2, X, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function MenuSection() {
  const { menu, addMenuItem, updateMenuItem, deleteMenuItem } = useDashboard();
  
  // Modal states
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddNew = () => {
    setEditingItem({
      name: "",
      price: 0,
      description: "",
      category: "General",
      is_available: true,
      image_url: ""
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      await deleteMenuItem(itemToDelete);
      setItemToDelete(null);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    
    setIsSaving(true);
    try {
      if (editingItem.id) {
        // Update existing
        await updateMenuItem(editingItem.id, editingItem);
      } else {
        // Create new
        await addMenuItem(editingItem);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } finally {
      setIsSaving(false);
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
          className="flex items-center gap-2 bg-primary hover:opacity-90 transition-all px-5 sm:px-6 py-3 rounded-full text-sm font-bold text-white shadow-xl shadow-primary/20 w-full sm:w-auto justify-center flex-shrink-0"
        >
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
              <div className="h-32 sm:h-36 bg-slate-100 relative flex flex-col items-center justify-center group-hover:bg-slate-50 transition-colors">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-[9px] font-bold uppercase tracking-widest px-6 text-center leading-tight">Sin foto</span>
                  </div>
                )}
                
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-primary hover:text-white text-slate-600 transition-colors shadow-sm"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setItemToDelete(item.id)}
                    className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white text-slate-600 transition-colors shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-1">{item.name}</h3>
                  <div className="flex items-center gap-1 w-fit">
                    <span className="text-sm font-bold text-primary">$</span>
                    <span className="text-sm font-black text-primary">{item.price}</span>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground leading-snug h-10 line-clamp-2">
                  {item.description || "Sin descripción"}
                </p>

                <div className="pt-3 border-t border-slate-50 flex justify-between items-center mt-auto">
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest">
                    {item.category}
                  </span>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.is_available ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                    {item.is_available ? 'Disponible' : 'Agotado'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center text-slate-800 mb-2">¿Eliminar plato?</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              Esta acción no se puede deshacer. El plato ya no estará disponible para tu Agente IA.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md shadow-red-500/20"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg">
                {editingItem.id ? "Editar Plato" : "Nuevo Plato"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveItem} className="p-5 overflow-y-auto flex-1 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600">Nombre del plato</label>
                <input 
                  required
                  type="text" 
                  value={editingItem.name || ""} 
                  onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  placeholder="Ej. Hamburguesa Clásica"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-bold text-slate-600">Precio</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                      required
                      type="number" 
                      min="0"
                      step="0.01"
                      value={editingItem.price || ""} 
                      onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-bold text-slate-600">Categoría</label>
                  <input 
                    required
                    type="text" 
                    value={editingItem.category || ""} 
                    onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                    placeholder="Ej. Bebidas, Principales"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600">Descripción</label>
                <textarea 
                  required
                  value={editingItem.description || ""} 
                  onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-20" 
                  placeholder="Ingredientes o detalles del plato"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600">URL de Imagen (Opcional)</label>
                <input 
                  type="url" 
                  value={editingItem.image_url || ""} 
                  onChange={e => setEditingItem({...editingItem, image_url: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">Disponibilidad</span>
                  <span className="text-xs text-slate-500">¿El plato se puede pedir hoy?</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingItem({...editingItem, is_available: !editingItem.is_available})}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${editingItem.is_available ? 'bg-primary' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${editingItem.is_available ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity shadow-md shadow-primary/20 disabled:opacity-50"
                >
                  {isSaving ? "Guardando..." : "Guardar Plato"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
