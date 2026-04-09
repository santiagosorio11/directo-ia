"use client";

import { useOnboarding } from "@/app/context/OnboardingContext";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, Loader2, ClipboardList, Trash2, Plus, DollarSign, Tag } from "lucide-react";
import { ProgressBar } from "../ui/ProgressBar";
import { useState, useEffect } from "react";

interface Product {
  name: string;
  price: string | number;
  description: string;
  categoria?: string;
}

export function MenuOCRStep() {
  const { data, updateData, nextStep, prevStep, isProcessing, setIsProcessing } = useOnboarding();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);

  // Sincronizar con el contexto global cuando el OCR termine
  useEffect(() => {
    if (data.menuProducts?.length > 0) {
      setLocalProducts(data.menuProducts);
    }
  }, [data.menuProducts]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setError("Por favor sube una imagen o un PDF del menú.");
      return;
    }

    setError(null);
    setIsProcessing(true);
    updateData({ menuFileName: file.name, menuText: "" }); // Reset previous

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || "Error al procesar el menú en n8n");
      }

      const result = await response.json();
      
      // Manejar la estructura específica de n8n: [{ output: [...] }] o { products: [...] }
      let rawProducts = [];
      if (Array.isArray(result)) {
        // Caso: n8n devuelve un array con un objeto que tiene "output"
        rawProducts = result[0]?.output || result;
      } else if (result.output) {
        rawProducts = result.output;
      } else {
        rawProducts = result.products || [];
      }

      // Normalizar campos de Español (n8n) a Inglés (Frontend)
      const products = Array.isArray(rawProducts) ? rawProducts.map((p: any) => ({
        name: p.nombre || p.name || "",
        price: p.precio || p.price || 0,
        description: p.descripcion || p.description || "",
        categoria: p.categoria || p.category || "General"
      })) : [];
      
      updateData({ 
        menuText: "Menú procesado exitosamente",
        menuProducts: products
      });
      setLocalProducts(products);

    } catch (err: any) {
      console.error("OCR Error:", err);
      setError(err.message || "No pudimos leer el menú. Inténtalo de nuevo.");
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
      { name: "", price: "", description: "", categoria: "General" }
    ]);
  };

  const onConfirm = () => {
    updateData({ menuProducts: localProducts });
    nextStep();
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 max-w-4xl mx-auto py-12 pt-16 font-sans">
      <ProgressBar currentStep={3} totalSteps={7} />
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col items-center text-center gap-6 mt-8"
      >
        <div className="w-16 h-16 bg-primary rounded-[22px] flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <ClipboardList className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-2">
           <h2 className="text-3xl font-extrabold text-foreground tracking-tight font-heading">Muéstrame Tu Menú</h2>
           <p className="text-lg text-foreground/50 max-w-md mx-auto font-medium">Necesito saber qué venderemos. Sube una foto o documento del menú actual.</p>
        </div>
      </motion.div>

      {/* Zona de Carga */}
      <div 
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        className={`relative group flex flex-col items-center justify-center gap-6 border-2 border-dashed rounded-[40px] p-8 transition-all ${
          dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
        } ${data.menuText ? "border-green-500/30 bg-green-500/5 mb-4" : "min-h-[250px]"}`}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="font-bold text-primary animate-pulse">Digitalizando tu menú...</p>
          </div>
        ) : data.menuText ? (
          <div className="flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-foreground">{data.menuFileName}</p>
                <p className="text-green-500/80 font-medium text-sm">Menú procesado correctamente</p>
              </div>
            </div>
            <button 
              onClick={() => { updateData({ menuText: "", menuProducts: [] }); setLocalProducts([]); }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all"
            >
              Cambiar archivo
            </button>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/20 group-hover:text-primary transition-colors">
              <Upload className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">Arrastra aquí tu menú</p>
              <p className="text-foreground/40 font-medium">PNG, JPG o PDF</p>
            </div>
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
              accept="image/*,.pdf"
            />
          </>
        )}

        {error && (
          <div className="absolute -bottom-14 flex items-center gap-2 text-red-500 font-bold bg-red-500/10 px-4 py-2 rounded-full">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Tabla Editable */}
      <AnimatePresence>
        {localProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Validar Productos
              </h3>
              <button 
                onClick={handleAddProduct}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-sm font-bold transition-all"
              >
                <Plus className="w-4 h-4" />
                Nuevo Plato
              </button>
            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-sm">
              <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-neutral-900 z-10">
                    <tr className="border-b border-white/5">
                      <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Plato</th>
                      <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest w-32">Precio</th>
                      <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Descripción / Categoria</th>
                      <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {localProducts.map((product, idx) => (
                      <motion.tr 
                        key={idx}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <input 
                            type="text" 
                            value={product.name}
                            placeholder="Nombre del plato"
                            onChange={(e) => handleUpdateProduct(idx, { name: e.target.value })}
                            className="bg-transparent border-none p-0 w-full focus:ring-0 text-foreground font-bold placeholder:text-white/10"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <span className="text-primary font-bold">$</span>
                            <input 
                              type="text" 
                              value={product.price}
                              placeholder="0"
                              onChange={(e) => handleUpdateProduct(idx, { price: e.target.value })}
                              className="bg-transparent border-none p-0 w-full focus:ring-0 text-foreground font-medium placeholder:text-white/10"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <input 
                            type="text" 
                            value={product.description || product.categoria || ""}
                            placeholder="Ej: Entradas, Plato Principal..."
                            onChange={(e) => handleUpdateProduct(idx, { description: e.target.value })}
                            className="bg-transparent border-none p-0 w-full focus:ring-0 text-white/50 text-sm placeholder:text-white/5"
                          />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleRemoveProduct(idx)}
                            className="text-white/10 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-center text-white/20 text-xs italic">
              * Puedes editar directamente sobre cualquier celda.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-4 mt-8 w-full max-w-sm mx-auto">
        <button 
          onClick={onConfirm}
          disabled={(!data.menuText && localProducts.length === 0) || isProcessing}
          className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-primary text-white rounded-[24px] font-extrabold text-xl shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-20"
        >
          Confirmar Menú
          <ArrowRight className="w-6 h-6" />
        </button>
        <button 
          onClick={prevStep}
          className="text-white/20 font-bold text-sm hover:text-primary transition-colors"
        >
          Paso anterior
        </button>
      </div>
    </div>
  );
}
