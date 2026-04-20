"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
import { useState } from "react";
import {
  Megaphone, Plus, Tag, Gift, Percent, Send, X, Check, Search,
  Smartphone, QrCode, RefreshCcw, MessageCircle, Zap, Trash2,
  Pause, Play
} from "lucide-react";
import { useToast } from "./Toast";

export default function MarketingSection() {
  const { menu, whatsappConfig, promotions, addPromotion, updatePromotion, deletePromotion } = useDashboard();
  const { showToast } = useToast();
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [promoTitle, setPromoTitle] = useState("");
  const [promoDescription, setPromoDescription] = useState("");
  const [promoDiscountType, setPromoDiscountType] = useState("percentage");
  const [promoDiscountValue, setPromoDiscountValue] = useState<number>(0);
  const [activeSubTab, setActiveSubTab] = useState<"whatsapp" | "promos" | "campaigns">("whatsapp");

  const handleCreatePromo = async () => {
    if (!promoTitle) {
      showToast("Escribe un título para la promoción", "error");
      return;
    }
    await addPromotion({
      title: promoTitle,
      description: promoDescription,
      discount_type: promoDiscountType,
      discount_value: promoDiscountValue,
      applies_to: selectedItems,
      status: "borrador",
    });
    showToast("Promoción creada correctamente", "success");
    setShowPromoModal(false);
    setSelectedItems([]);
    setPromoTitle("");
    setPromoDescription("");
    setPromoDiscountValue(0);
  };

  const toggleItem = (id: string) => {
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
      case "activa": return "bg-green-100 text-green-700";
      case "pausada": return "bg-slate-100 text-slate-500";
      case "borrador": return "bg-yellow-100 text-yellow-700";
      case "expirada": return "bg-red-100 text-red-500";
      default: return "bg-slate-100 text-slate-500";
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-black text-foreground">Marketing & WhatsApp</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">Promociones, campañas y conexión de WhatsApp.</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveSubTab("whatsapp")}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === "whatsapp"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Smartphone className="w-4 h-4" /> WhatsApp
        </button>
        <button
          onClick={() => setActiveSubTab("promos")}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === "promos"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Tag className="w-4 h-4" /> Promociones
        </button>
        <button
          onClick={() => setActiveSubTab("campaigns")}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === "campaigns"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Send className="w-4 h-4" /> Campañas
        </button>
      </div>

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

                <ul className="text-left text-sm text-muted-foreground space-y-3 mt-4 w-full px-2 sm:px-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span> Abre WhatsApp en tu celular.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span> Ve a Configuración &gt; Dispositivos vinculados.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span> Apunta tu cámara a esta pantalla para capturar el código.
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ Promociones Sub-Tab ═══ */}
      {activeSubTab === "promos" && (
        <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800">Promociones</h3>
            <button
              onClick={() => setShowPromoModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:opacity-90 rounded-full text-xs font-bold transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="w-3.5 h-3.5" /> Nueva Promoción
            </button>
          </div>

          {promotions.length === 0 ? (
            <div className="bg-white border border-slate-200 p-12 rounded-3xl flex flex-col items-center justify-center gap-3 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
                <Tag className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-slate-700">Sin promociones</h4>
              <p className="text-sm text-slate-500 max-w-md">
                Crea tu primera promoción y el Agente IA la ofrecerá automáticamente a tus clientes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {promotions.map(promo => {
                const PromoIcon = getPromoIcon(promo.discount_type);
                const iconColor = getPromoIconColor(promo.discount_type);
                const statusBadge = getStatusBadge(promo.status);
                return (
                  <div key={promo.id} className="bg-white border border-slate-200 p-6 rounded-2xl sm:rounded-[32px] flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${iconColor}`}>
                        <PromoIcon className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${statusBadge}`}>
                          {promo.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800 leading-tight">{promo.title}</h3>
                      {promo.description && (
                        <p className="text-xs text-slate-500 mt-1">{promo.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-auto pt-3 border-t border-slate-50">
                      {promo.status === 'activa' ? (
                        <button
                          onClick={() => updatePromotion(promo.id, { status: 'pausada' })}
                          className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Pause className="w-3 h-3" /> Pausar
                        </button>
                      ) : (
                        <button
                          onClick={() => updatePromotion(promo.id, { status: 'activa' })}
                          className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                        >
                          <Play className="w-3 h-3" /> Activar
                        </button>
                      )}
                      <button
                        onClick={() => deletePromotion(promo.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold text-red-400 bg-red-50 hover:bg-red-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" /> Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══ Campañas Masivas Sub-Tab ═══ */}
      {activeSubTab === "campaigns" && (
        <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800">Campañas Masivas (WhatsApp)</h3>
            <button
              onClick={() => showToast("Esta función estará disponible muy pronto", "info")}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white hover:opacity-90 rounded-full text-xs font-bold transition-all shadow-lg"
            >
              <Send className="w-3.5 h-3.5" /> Enviar Mensaje Masivo
            </button>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 text-center py-10 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
              <Megaphone className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-slate-700">Comunícate con tus clientes</h4>
            <p className="text-sm text-slate-500 max-w-md">
              Envía mensajes masivos por WhatsApp a clientes recurrentes o intenta recuperar a aquellos que no compran hace más de 30 días con una oferta especial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] flex flex-col gap-4 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-heading font-bold text-foreground">Automatizaciones</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Configura respuestas automáticas, seguimientos post-compra y recordatorios de recompra.</p>
              <button disabled className="mt-auto py-3 bg-slate-50 text-slate-300 rounded-full font-bold text-sm cursor-not-allowed">
                Próximamente
              </button>
            </div>
            <div className="bg-white border border-slate-200 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] flex flex-col gap-4 shadow-sm">
              <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-violet-500" />
              </div>
              <h3 className="text-lg font-heading font-bold text-foreground">Ver Chats en Vivo</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Monitorea y toma control de cualquier conversación si el cliente prefiere un humano.</p>
              <button disabled className="mt-auto py-3 bg-slate-50 text-slate-300 rounded-full font-bold text-sm cursor-not-allowed">
                Próximamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Pop-up Nueva Promoción ═══ */}
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

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción</label>
                <textarea
                  value={promoDescription}
                  onChange={(e) => setPromoDescription(e.target.value)}
                  placeholder="Describe la promoción..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo de descuento</label>
                  <select
                    value={promoDiscountType}
                    onChange={e => setPromoDiscountType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm font-medium outline-none focus:border-primary transition-all"
                  >
                    <option value="percentage">% Descuento</option>
                    <option value="fixed">$ Fijo</option>
                    <option value="2x1">2x1</option>
                    <option value="freebie">Regalo / Cortesía</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</label>
                  <input
                    type="number"
                    value={promoDiscountValue}
                    onChange={e => setPromoDiscountValue(Number(e.target.value))}
                    placeholder="20"
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm font-bold outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aplicar a productos</label>
                  <span className="text-xs font-bold text-primary">{selectedItems.length} seleccionados</span>
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
                          );
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
