"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
import { useState, useRef, useEffect } from "react";
import {
  Megaphone, Plus, Tag, Gift, Percent, Send, X, Check, Search,
  Smartphone, QrCode, RefreshCcw, MessageCircle, Zap, Trash2,
  Pause, Play, ChevronDown, Store, Users, Coffee
} from "lucide-react";
import { useToast } from "./Toast";

const PRESET_PROMOS = [
  { id: 1, title: '2x1 Martes Loco', description: 'Compra 1 y llévate el 2do gratis los martes.', discount_type: '2x1', value: 0, audience: 'recurrente' },
  { id: 2, title: 'Bienvenida Especial', description: 'Atrae a clientes nuevos con un 15% desc. en primer pedido.', discount_type: 'percentage', value: 15, audience: 'nuevo' },
  { id: 3, title: 'Te Extrañamos (Postre)', description: 'Regalo a inactivos por más de 30 días.', discount_type: 'freebie', value: 0, audience: 'inactivo' },
  { id: 4, title: 'Recuperación 25%', description: 'Gran descuento para pedidos abandonados.', discount_type: 'percentage', value: 25, audience: 'perdido' },
  { id: 5, title: 'Combo Fidelidad', description: '10% de descuento automático a recurrentes.', discount_type: 'percentage', value: 10, audience: 'recurrente' },
  { id: 6, title: 'Finde 10% Fijo', description: 'Descuento general para potenciar el finde.', discount_type: 'percentage', value: 10, audience: 'todos' },
];

export default function MarketingSection() {
  const { restaurant, menu, whatsappConfig, promotions, addPromotion, updatePromotion, deletePromotion } = useDashboard();
  const { showToast } = useToast();
  
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [promoTitle, setPromoTitle] = useState("");
  const [promoDescription, setPromoDescription] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(""); // New: Sede selector
  const [promoDiscountType, setPromoDiscountType] = useState("percentage");
  const [promoDiscountValue, setPromoDiscountValue] = useState<number>(0);
  const [targetAudience, setTargetAudience] = useState("todos");
  
  const [activeSubTab, setActiveSubTab] = useState<"whatsapp" | "promos" | "campaigns">("promos");

  // Custom Dropdown state
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const productsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (productsDropdownRef.current && !productsDropdownRef.current.contains(event.target as Node)) {
        setIsProductsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenPromoModal = (preset?: typeof PRESET_PROMOS[0]) => {
    if (preset) {
      setPromoTitle(preset.title);
      setPromoDescription(preset.description);
      setPromoDiscountType(preset.discount_type);
      setPromoDiscountValue(preset.value);
      setTargetAudience(preset.audience);
    } else {
      setPromoTitle("");
      setPromoDescription("");
      setPromoDiscountType("percentage");
      setPromoDiscountValue(0);
      setTargetAudience("todos");
    }
    setSelectedBranch(restaurant?.business_name || ""); // Default to current
    setSelectedItems([]);
    setShowPromoModal(true);
  };

  const handleCreatePromo = async () => {
    if (!promoTitle) {
      showToast("Escribe un título para la promoción", "error");
      return;
    }
    
    // Empaquetar aplicando estructura JSON para los applies_to
    const promoData = {
      branch: selectedBranch,
      audience: targetAudience,
      products: selectedItems
    };

    await addPromotion({
      title: promoTitle,
      description: promoDescription,
      discount_type: promoDiscountType,
      discount_value: promoDiscountValue,
      applies_to: promoData as any, // Guardamos JSON en lugar de string[]
      status: "borrador",
    });
    
    showToast("Promoción creada correctamente", "success");
    setShowPromoModal(false);
  };

  const toggleProductItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getPromoIcon = (type?: string) => {
    switch (type) {
      case "percentage": return Percent;
      case "2x1": return Gift;
      case "freebie": return Gift;
      default: return Tag;
    }
  };

  const getPromoIconColor = (type?: string) => {
    switch (type) {
      case "percentage": return "bg-green-50 text-green-500";
      case "2x1": return "bg-blue-50 text-blue-500";
      case "freebie": return "bg-purple-50 text-purple-500";
      default: return "bg-yellow-50 text-yellow-600";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "activa": return "bg-green-100 text-green-700 border-green-200";
      case "pausada": return "bg-slate-100 text-slate-500 border-slate-200";
      case "borrador": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "expirada": return "bg-red-100 text-red-500 border-red-200";
      default: return "bg-slate-100 text-slate-500";
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-black text-foreground">Marketing & Promociones</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">Atrae y retén clientes con campañas inteligentes.</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveSubTab("promos")}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === "promos" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Tag className="w-4 h-4" /> Promociones
        </button>
        <button
          onClick={() => setActiveSubTab("whatsapp")}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === "whatsapp" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Smartphone className="w-4 h-4" /> WhatsApp
        </button>
        <button
          onClick={() => setActiveSubTab("campaigns")}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === "campaigns" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Send className="w-4 h-4" /> Campañas
        </button>
      </div>

      {/* ═══ Promociones Sub-Tab ═══ */}
      {activeSubTab === "promos" && (
        <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Promociones Prediseñadas */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">Plantillas Prediseñadas</h3>
              <button
                onClick={() => handleOpenPromoModal()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white hover:opacity-90 rounded-full text-xs font-bold transition-all shadow-lg"
              >
                <Plus className="w-3.5 h-3.5" /> Promoción Personalizada
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {PRESET_PROMOS.map((preset) => {
                const Icon = getPromoIcon(preset.discount_type);
                return (
                  <div 
                    key={preset.id} 
                    onClick={() => handleOpenPromoModal(preset)}
                    className="bg-white border border-slate-200 hover:border-primary/40 hover:shadow-lg transition-all p-5 rounded-[24px] cursor-pointer group flex flex-col gap-2 relative"
                  >
                    <div className="absolute top-4 right-4 text-slate-300 group-hover:text-primary transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-black text-slate-800 mb-1 pr-6">{preset.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 md:h-8 mb-2">{preset.description}</p>
                    <div className="mt-auto px-3 py-1.5 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest w-fit border border-slate-100 flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-primary" /> {preset.audience}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6"></div>

          {/* Promociones Activas/Borradores */}
          <h3 className="text-lg font-black text-slate-800">Tus Promociones</h3>
          
          {promotions.length === 0 ? (
            <div className="bg-white border border-slate-200 p-12 rounded-[32px] flex flex-col items-center justify-center gap-3 text-center shadow-sm">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
                 <Tag className="w-8 h-8" />
               </div>
               <h4 className="text-lg font-black text-slate-700">Sin promociones</h4>
               <p className="text-sm text-slate-500 max-w-md">
                 Haz clic en una de las plantillas de arriba para lanzar tu primera estrategia de ventas guiada por IA.
               </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {promotions.map(promo => {
                const PromoIcon = getPromoIcon(promo.discount_type);
                const iconColor = getPromoIconColor(promo.discount_type);
                const statusBadge = getStatusBadge(promo.status);
                
                // Parse the target audience from JSON if it exists
                const targetAudience = typeof promo.applies_to === 'object' && promo.applies_to?.audience 
                                        ? promo.applies_to.audience 
                                        : 'todos';

                return (
                  <div key={promo.id} className="bg-white border border-slate-200 p-6 rounded-[32px] flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${iconColor}`}>
                        <PromoIcon className="w-6 h-6" />
                      </div>
                      <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg border ${statusBadge}`}>
                        {promo.status}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800 leading-tight">{promo.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                         <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md flex items-center gap-1">
                           <Users className="w-3 h-3" /> Público: <span className="capitalize">{targetAudience}</span>
                         </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-50">
                      {promo.status === 'activa' ? (
                        <button
                          onClick={() => updatePromotion(promo.id, { status: 'pausada' })}
                          className="flex items-center justify-center flex-1 gap-1.5 py-2 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                          <Pause className="w-3.5 h-3.5" /> Pausar
                        </button>
                      ) : (
                        <button
                          onClick={() => updatePromotion(promo.id, { status: 'activa' })}
                          className="flex items-center justify-center flex-1 gap-1.5 py-2 text-[11px] font-bold text-white bg-green-500 hover:bg-green-600 rounded-xl transition-colors shadow-md shadow-green-500/20"
                        >
                          <Play className="w-3.5 h-3.5" /> Activar
                        </button>
                      )}
                      <button
                        onClick={() => deletePromotion(promo.id)}
                        className="w-10 h-10 flex items-center justify-center text-slate-400 bg-slate-50 hover:bg-red-500 hover:text-white rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══ WhatsApp Sub-Tab ═══ */}
      {activeSubTab === "whatsapp" && (
        <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl sm:rounded-[32px] flex flex-col items-center justify-center text-center gap-6 py-10 sm:py-16 shadow-sm">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl ${whatsappConfig?.is_connected ? 'bg-green-500 shadow-green-500/20' : 'bg-primary shadow-primary/20'}`}>
              <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-foreground">Conexión de WhatsApp</h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto mt-2">
                Vincula el número de tu restaurante para que el Agente IA pueda responder los mensajes en tiempo real.
              </p>
            </div>
            
            {whatsappConfig?.is_connected ? (
              <div className="mt-4 flex flex-col items-center gap-4">
                <div className="px-4 sm:px-6 py-2 rounded-full bg-green-50 border border-green-100 text-green-600 font-bold uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Conectado Activo (+{whatsappConfig.phone_number})
                </div>
                <button className="text-slate-400 text-sm font-bold hover:text-red-500 transition-colors mt-4">
                  Desvincular número
                </button>
              </div>
            ) : (
              <div className="mt-4 sm:mt-8 flex flex-col items-center gap-6 w-full max-w-sm">
                <div className="w-48 h-48 sm:w-64 sm:h-64 bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-3xl flex items-center justify-center p-3 sm:p-4 shadow-inner">
                  {whatsappConfig?.qr_code_url ? (
                    <img src={whatsappConfig.qr_code_url} alt="QR Code" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-white rounded-xl sm:rounded-2xl text-slate-300">
                      <QrCode className="w-10 h-10 sm:w-12 sm:h-12" />
                      <span className="text-xs sm:text-sm font-bold text-center px-4">Generando código QR...</span>
                    </div>
                  )}
                </div>
                
                <button className="flex items-center gap-2 text-primary text-sm font-bold hover:opacity-80 transition-colors">
                  <RefreshCcw className="w-4 h-4" /> Recargar QR
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ Campañas Masivas Sub-Tab ═══ */}
      {activeSubTab === "campaigns" && (
         <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
             <div className="bg-white border border-slate-200 p-12 rounded-[32px] flex flex-col items-center justify-center gap-3 text-center py-16 shadow-sm">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
                 <Megaphone className="w-8 h-8" />
               </div>
               <h4 className="text-lg font-black text-slate-700">Comunícate con tus clientes</h4>
               <p className="text-sm text-muted-foreground max-w-md">
                 Esta función de envío masivo de mensajería (Campaigns) estará habilitada muy pronto para maximizar el retorno de las promociones creadas.
               </p>
               <div className="mt-6 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
                 Próximamente: Integración con CRM
               </div>
             </div>
         </div>
      )}

      {/* ═══ Pop-up Flujo Nueva Promoción (Dropdowns Update) ═══ */}
      {showPromoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white sticky top-0 z-10 w-full">
              <h3 className="text-lg font-black text-slate-800">Detalles de la Promoción</h3>
              <button
                onClick={() => setShowPromoModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Dropdown 1: Sede / Restaurante */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Store className="w-3 h-3" /> Restaurante / Sede
                </label>
                <div className="relative">
                  <select
                    value={selectedBranch}
                    onChange={e => setSelectedBranch(e.target.value)}
                    className="w-full bg-white border border-slate-200 px-4 py-3 rounded-2xl text-sm font-bold outline-none appearance-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
                  >
                    <option value={restaurant?.business_name}>{restaurant?.business_name} (Principal)</option>
                    <option value="all">Todas las Sedes</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Título y Desc (Compactos) */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Título de la Promoción</label>
                    <input
                      type="text"
                      value={promoTitle}
                      onChange={(e) => setPromoTitle(e.target.value)}
                      placeholder="Título (Ej: 2x1 Martes)"
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-sm font-bold outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Descripción</label>
                    <textarea
                      value={promoDescription}
                      onChange={(e) => setPromoDescription(e.target.value)}
                      placeholder="Descripción (visible para clientes)..."
                      rows={1}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                    />
                  </div>
                 <div className="grid grid-cols-2 gap-2 mt-1">
                    <select
                      value={promoDiscountType}
                      onChange={e => setPromoDiscountType(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:border-primary transition-all"
                    >
                      <option value="percentage">% Descuento</option>
                      <option value="fixed">$ Fijo</option>
                      <option value="2x1">2x1</option>
                      <option value="freebie">Regalo Extra</option>
                    </select>
                    <input
                      type="number"
                      value={promoDiscountValue}
                      onChange={e => setPromoDiscountValue(Number(e.target.value))}
                      placeholder="Valor ej. 15"
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:border-primary transition-all"
                    />
                 </div>
              </div>

              {/* Dropdown 2: Público Objetivo */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Users className="w-3 h-3" /> Público Objetivo
                </label>
                <div className="relative">
                  <select
                    value={targetAudience}
                    onChange={e => setTargetAudience(e.target.value)}
                    className="w-full bg-white border border-slate-200 px-4 py-3 rounded-2xl text-sm font-bold outline-none appearance-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
                  >
                    <option value="todos">Todos los Clientes</option>
                    <option value="nuevo">Nuevos Clientes (Sin compras previas)</option>
                    <option value="recurrente">Clientes Frecuentes (&gt;3 compras)</option>
                    <option value="inactivo">Clientes Inactivos (&gt;30 días sin compra)</option>
                    <option value="perdido">Cartera Perdida (&gt;90 días sin compra)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Dropdown 3: Platos a Aplicar (Custom Multiple Select) */}
              <div className="space-y-2 relative" ref={productsDropdownRef}>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Coffee className="w-3 h-3" /> Platos a Aplicar</span>
                  <span className="text-primary">{selectedItems.length} sel.</span>
                </label>
                
                <div 
                  onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                  className={`w-full bg-white border px-4 py-3 rounded-2xl text-sm font-semibold outline-none flex items-center justify-between cursor-pointer transition-all ${isProductsDropdownOpen ? 'border-primary ring-1 ring-primary/20' : 'border-slate-200'}`}
                >
                  <span className="text-slate-600 truncate">
                    {selectedItems.length === 0 
                      ? "Aplicar a todos los platos" 
                      : `${selectedItems.length} platos seleccionados`}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProductsDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {isProductsDropdownOpen && (
                  <div className="absolute top-[72px] left-0 w-full bg-white border border-slate-200 shadow-xl rounded-2xl z-20 max-h-56 overflow-y-auto p-2 animate-in slide-in-from-top-2 duration-200">
                    {menu.length === 0 ? (
                       <div className="p-4 text-center text-xs text-slate-400">Tu menú está vacío.</div>
                    ) : (
                      Object.entries(
                        menu.reduce((acc, item) => {
                          if (!acc[item.category]) acc[item.category] = [];
                          acc[item.category].push(item);
                          return acc;
                        }, {} as Record<string, typeof menu>)
                      ).map(([categoryName, items]) => (
                        <div key={categoryName} className="mb-2 last:mb-0">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest px-2 mb-1">{categoryName}</p>
                          <div className="space-y-0.5">
                            {items.map(item => {
                              const isSelected = selectedItems.includes(item.id);
                              return (
                                <div
                                  key={item.id}
                                  onClick={(e) => toggleProductItem(item.id, e)}
                                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                                    isSelected ? "bg-primary/5 text-primary font-bold" : "hover:bg-slate-50 text-slate-600 text-sm font-medium"
                                  }`}
                                >
                                  <span className="truncate pr-4">{item.name}</span>
                                  <div className={`w-4 h-4 flex-shrink-0 rounded flex items-center justify-center transition-all ${
                                    isSelected ? "bg-primary text-white" : "border border-slate-300"
                                  }`}>
                                    {isSelected && <Check className="w-3 h-3" />}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 sticky bottom-0 z-10 w-full rounded-b-[32px]">
              <button
                onClick={handleCreatePromo}
                className="w-full py-4 bg-primary text-white rounded-2xl text-sm font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
              >
                Lanzar Promoción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
