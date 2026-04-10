"use client";

import { useOnboarding } from "@/app/onboarding/_context/OnboardingContext";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle2, AlertCircle, ArrowRight, Loader2, ClipboardList, Trash2, Plus, Tag, Sparkles, Check, Bot, ChevronDown, ChevronUp, FileText, Edit2, X, ChefHat } from "lucide-react";
import { useState, useEffect } from "react";

interface Variant {
  name: string;
  price: string | number;
}

interface Product {
  name: string;
  price: string | number;
  description: string;
  categoria?: string;
  variants?: Variant[];
}

const processingSteps = [
  { text: "Analizando archivo", emoji: "🔍" },
  { text: "Detectando platos", emoji: "🍽️" },
  { text: "Identificando precios", emoji: "💰" },
  { text: "Extrayendo descripciones", emoji: "📝" },
  { text: "Finalizando", emoji: "✅" },
];

export function MenuOCRStep() {
  const { data, updateData, nextStep, isProcessing, setIsProcessing, setCanNext, setCustomNextHandler } = useOnboarding();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [currentProcessingStep, setCurrentProcessingStep] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      interval = setInterval(() => {
        setCurrentProcessingStep(prev => (prev + 1) % processingSteps.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  useEffect(() => {
    if (data.menuProducts?.length > 0) {
      setLocalProducts(data.menuProducts);
    }
  }, [data.menuProducts]);

  useEffect(() => {
    setCanNext(localProducts.length > 0);
    setCustomNextHandler(() => onConfirm);
    return () => {
      setCanNext(true);
      setCustomNextHandler(null);
    };
  }, [localProducts, setCanNext, setCustomNextHandler]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setError("Por favor sube una imagen o un PDF del menú.");
      return;
    }

    setError(null);
    setIsProcessing(true);
    updateData({ menuFileName: file.name, menuText: "" });

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al procesar el menú");
      }

      const result = await response.json();
      console.log("OCR Result:", result);
      
      let rawProducts = [];
      
      // Case 1: Result is an array
      if (Array.isArray(result)) {
        if (result.length > 0) {
          // Case 1a: Array of products directly
          if (result[0].name || result[0].nombre) {
            rawProducts = result;
          } 
          // Case 1b: Array with one object that contains products
          else if (result[0].output || result[0].products || result[0].platos) {
            rawProducts = result[0].output || result[0].products || result[0].platos;
          }
        }
      } 
      // Case 2: Result is an object
      else if (result && typeof result === 'object') {
        rawProducts = result.output || result.products || result.platos || [];
      }

      const products = Array.isArray(rawProducts) ? rawProducts.map((p: any) => ({
        name: p.nombre || p.name || "",
        price: p.precio || p.price || 0,
        description: p.descripcion || p.description || "",
        categoria: p.categoria || p.category || "General",
        variants: p.variants || p.variantes || []
      })) : [];
      
      updateData({ 
        menuText: "Menú procesado exitosamente",
        menuProducts: products
      });
      setLocalProducts(products);

    } catch (err: any) {
      setError(err.message || "No pudimos leer el menú.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateProduct = (index: number, fields: Partial<Product>) => {
    const updated = [...localProducts];
    updated[index] = { ...updated[index], ...fields };
    setLocalProducts(updated);
  };

  const handleRemoveProduct = (index: number) => {
    setLocalProducts(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddProduct = () => {
    setLocalProducts(prev => [
      ...prev, 
      { name: "", price: "", description: "", categoria: "General", variants: [] }
    ]);
    setExpandedIndex(localProducts.length);
  };

  const handleAddVariant = (pIndex: number) => {
    const updated = [...localProducts];
    const product = { ...updated[pIndex] };
    product.variants = [...(product.variants || []), { name: "", price: "" }];
    updated[pIndex] = product;
    setLocalProducts(updated);
  };

  const handleUpdateVariant = (pIndex: number, vIndex: number, fields: Partial<Variant>) => {
    const updated = [...localProducts];
    const product = { ...updated[pIndex] };
    const variants = [...(product.variants || [])];
    variants[vIndex] = { ...variants[vIndex], ...fields };
    product.variants = variants;
    updated[pIndex] = product;
    setLocalProducts(updated);
  };

  const handleRemoveVariant = (pIndex: number, vIndex: number) => {
    const updated = [...localProducts];
    const product = { ...updated[pIndex] };
    product.variants = (product.variants || []).filter((_, i) => i !== vIndex);
    updated[pIndex] = product;
    setLocalProducts(updated);
  };

  const onConfirm = () => {
    updateData({ menuProducts: localProducts });
    nextStep();
  };

  return (
    <div className="flex flex-col gap-8 mx-auto font-sans px-4 md:px-0 max-w-2xl text-foreground py-4">
      <AnimatePresence mode="wait">
        {!isProcessing ? (
          <motion.div 
            key="initial"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-black font-heading text-foreground tracking-tight leading-tight">
                Voy a crear tu menú automáticamente
              </h2>
              <p className="text-base text-foreground/50 font-medium leading-relaxed">
                Solo súbelo y yo me encargo de organizarlo, optimizarlo y dejarlo listo para vender.
              </p>
            </div>

            {/* Drop Zone */}
            <div 
              onDragOver={(e) => {e.preventDefault(); setDragActive(true);}}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {e.preventDefault(); setDragActive(false); if(e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);}}
              className={`relative bg-card rounded-[32px] p-10 border-2 border-dashed transition-all flex flex-col items-center text-center gap-4 ${
                dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-foreground/10 hover:border-primary/20 shadow-sm"
              }`}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <FileText className="w-8 h-8" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xl font-bold text-foreground">Sube tu menú aquí</p>
                <p className="text-xs text-foreground/40 font-medium">PDF, JPG o PNG hasta 10MB</p>
              </div>
              <div className="relative mt-2">
                <button className="px-8 py-3 bg-primary text-white rounded-full font-extrabold text-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                  Seleccionar archivos
                </button>
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                  accept="image/*,.pdf"
                />
              </div>
            </div>

            {/* Pro Tips */}
            <div className="bg-foreground text-background rounded-3xl p-6 relative overflow-hidden">
              <h3 className="text-background font-bold text-sm mb-4 opacity-70">Consejos profesionales</h3>
              <div className="flex flex-col gap-4">
                {[
                  "Asegúrate de que la foto esté bien iluminada y enfocada.",
                  "Si tienes varias páginas, puedes subirlas una por una."
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-5 h-5 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white">
                      <Check className="w-3 h-3 stroke-[4px]" />
                    </div>
                    <p className="text-background/70 text-sm font-medium leading-snug">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Extracted Items Section */}
            <div className="flex flex-col gap-6 mt-4 pb-12">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-foreground tracking-tight font-heading">
                  {localProducts.length > 0 ? "Platos Extraídos" : "Tu Menú"}
                </h3>
                {localProducts.length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="text-[10px] font-bold text-green-500 tracking-wider">Extraído exitosamente</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {localProducts.map((p, idx) => (
                  <motion.div 
                    key={idx} 
                    layout
                    className={`bg-card rounded-3xl border transition-all ${
                      expandedIndex === idx ? "border-primary ring-1 ring-primary/20 shadow-xl" : "border-foreground/5 shadow-sm hover:border-foreground/10"
                    }`}
                  >
                    {/* Header */}
                    <div 
                      className="p-5 flex items-center gap-4 cursor-pointer"
                      onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                    >
                      <div className="w-12 h-12 bg-foreground/[0.03] rounded-2xl flex items-center justify-center text-foreground/20 group-hover:text-primary transition-colors">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <h4 className="font-bold text-foreground text-base truncate">{p.name || "Sin nombre"}</h4>
                        <span className="text-[10px] text-foreground/30 font-bold tracking-widest">{p.categoria || "Menú"}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-primary font-black text-lg">
                          ${p.price || 0}
                        </div>
                        {expandedIndex === idx ? <ChevronUp className="w-5 h-5 text-foreground/20" /> : <ChevronDown className="w-5 h-5 text-foreground/20" />}
                      </div>
                    </div>

                    {/* Expandable Content */}
                    <AnimatePresence>
                      {expandedIndex === idx && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 pt-0 border-t border-foreground/5 mt-2 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-foreground/40">Nombre</label>
                                <input 
                                  type="text" 
                                  value={p.name}
                                  onChange={(e) => handleUpdateProduct(idx, { name: e.target.value })}
                                  className="w-full bg-foreground/[0.03] border-none px-4 py-2.5 rounded-xl text-sm font-bold outline-none ring-primary/20 focus:ring-2"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-foreground/40">Precio</label>
                                <input 
                                  type="text" 
                                  value={p.price}
                                  onChange={(e) => handleUpdateProduct(idx, { price: e.target.value })}
                                  className="w-full bg-foreground/[0.03] border-none px-4 py-2.5 rounded-xl text-sm font-bold outline-none ring-primary/20 focus:ring-2"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Descripción</label>
                              <textarea 
                                value={p.description}
                                onChange={(e) => handleUpdateProduct(idx, { description: e.target.value })}
                                className="w-full bg-foreground/[0.03] border-none px-4 py-3 rounded-2xl text-sm font-medium outline-none ring-primary/20 focus:ring-2 h-24 resize-none"
                              />
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-foreground/40">Variantes / Opciones</label>
                                <button onClick={() => handleAddVariant(idx)} className="text-[10px] font-bold text-primary tracking-widest flex items-center gap-1">
                                  <Plus className="w-3 h-3" /> Añadir
                                </button>
                              </div>
                              <div className="space-y-2">
                                {p.variants?.map((v, vIdx) => (
                                  <div key={vIdx} className="flex items-center gap-2">
                                    <input 
                                      type="text" 
                                      placeholder="Nombre variante"
                                      value={v.name}
                                      onChange={(e) => handleUpdateVariant(idx, vIdx, { name: e.target.value })}
                                      className="flex-1 bg-foreground/[0.02] border-none px-4 py-2 rounded-lg text-xs font-bold outline-none"
                                    />
                                    <input 
                                      type="text" 
                                      placeholder="+$0"
                                      value={v.price}
                                      onChange={(e) => handleUpdateVariant(idx, vIdx, { price: e.target.value })}
                                      className="w-20 bg-foreground/[0.02] border-none px-4 py-2 rounded-lg text-xs font-bold outline-none"
                                    />
                                    <button onClick={() => handleRemoveVariant(idx, vIdx)} className="p-2 text-foreground/20 hover:text-red-500 transition-colors">
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                              <button 
                                onClick={() => handleRemoveProduct(idx)}
                                className="flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-widest"
                              >
                                <Trash2 className="w-3 h-3" /> Eliminar
                              </button>
                              <button 
                                onClick={() => setExpandedIndex(null)}
                                className="px-6 py-2 bg-foreground text-background rounded-full text-[10px] font-black uppercase tracking-widest"
                              >
                                Cerrar
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
                
                <button 
                  onClick={handleAddProduct}
                  className="w-full flex items-center justify-center gap-3 py-5 border-2 border-dashed border-foreground/5 rounded-[32px] text-[11px] font-bold text-foreground/40 tracking-widest hover:bg-foreground/[0.02] hover:border-primary/20 hover:text-primary transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-foreground/[0.03] group-hover:bg-primary/10 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  Añadir manualmente
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-8"
          >
            <div className="relative">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-primary/40" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-2xl font-black text-foreground font-heading">{processingSteps[currentProcessingStep].text}</p>
              <p className="text-sm text-foreground/40 font-medium">Estamos procesando tu menú...</p>
            </div>
            <div className="w-full max-w-xs bg-foreground/[0.03] h-2 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-primary h-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((currentProcessingStep + 1) / processingSteps.length) * 100}%` }}
                />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
