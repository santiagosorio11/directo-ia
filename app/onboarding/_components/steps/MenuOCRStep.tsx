"use client";

import { useOnboarding } from "@/app/onboarding/_context/OnboardingContext";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle2, AlertCircle, ArrowRight, Loader2, ClipboardList, Trash2, Plus, Tag, Sparkles, Check, Bot, ChevronDown, ChevronUp, FileText, Edit2, X, ChefHat } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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

const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 2500; // Aumentado de 1600 para mejor resolución en menús grandes

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.7 // 70% quality for better compression
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

const processingSteps = [
  { text: "Analizando archivo", emoji: "🧐" },
  { text: "Detectando platos", emoji: "🍽️" },
  { text: "Identificando precios", emoji: "💰" },
  { text: "Aprendiendo cómo venderlos", emoji: "📈" },
  { text: "Memorizando los platos", emoji: "🧠" },
];

function AnimatedDots() {
  return (
    <span className="inline-flex w-5">
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}
      >.</motion.span>
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1], delay: 0.2 }}
      >.</motion.span>
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1], delay: 0.4 }}
      >.</motion.span>
    </span>
  );
}

export function MenuOCRStep() {
  const { data, updateData, nextStep, isProcessing, setIsProcessing, setCanNext, setCustomNextHandler } = useOnboarding();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [currentProcessingStep, setCurrentProcessingStep] = useState(0);
  interface SelectedFile {
    file: File;
    processed: boolean;
  }
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

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

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files)
      .filter(file => file.type.startsWith('image/') || file.type === 'application/pdf')
      .map(file => ({ file, processed: false }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcessMenu = async () => {
    const unprocessed = selectedFiles.filter(f => !f.processed);
    if (unprocessed.length === 0) return;
    
    setError(null);
    setIsProcessing(true);
    
    try {
      let allNewProducts: Product[] = [];
      const updatedFiles = [...selectedFiles];

      for (let i = 0; i < updatedFiles.length; i++) {
        if (updatedFiles[i].processed) continue;

        let fileToUpload = updatedFiles[i].file;

        // Compress if it's an image
        if (fileToUpload.type.startsWith('image/')) {
          fileToUpload = await compressImage(fileToUpload);
        }

        // Check if file is still too large (Aumentado a 10MB)
        if (fileToUpload.size > 10 * 1024 * 1024) {
          throw new Error(`El archivo ${fileToUpload.name} es demasiado grande. Por favor sube uno menor a 10MB.`);
        }

        const formData = new FormData();
        formData.append('file', fileToUpload);
        
        const response = await fetch("/api/ocr", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          let rawProducts = [];
          if (Array.isArray(result)) {
            rawProducts = result[0]?.output || result[0]?.products || result[0]?.platos || result;
          } else if (result && typeof result === 'object') {
            rawProducts = result.output || result.products || result.platos || [];
          }

          const products = Array.isArray(rawProducts) ? rawProducts.map((p: any) => ({
            name: p.nombre || p.name || "",
            price: p.precio || p.price || 0,
            description: p.descripcion || p.description || "",
            categoria: p.categoria || p.category || "General",
            variants: p.variants || p.variantes || []
          })) : [];

          allNewProducts = [...allNewProducts, ...products];
          updatedFiles[i] = { ...updatedFiles[i], processed: true };
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Error al procesar el menú");
        }
      }

      updateData({ 
        menuText: "Menú procesado exitosamente",
        menuProducts: [...localProducts, ...allNewProducts]
      });
      setLocalProducts(prev => [...prev, ...allNewProducts]);
      setSelectedFiles(updatedFiles);

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
  };

  const onConfirm = () => {
    updateData({ menuProducts: localProducts });
    nextStep();
  };

  return (
    <div className="flex flex-col gap-6 mx-auto font-sans px-4 md:px-0 max-w-2xl text-foreground py-0">
      <AnimatePresence mode="wait">
          <motion.div 
            key="initial"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col items-center">
              <img 
                src="/vendedoria2.png" 
                alt="Menu Icon" 
                className="h-40 w-auto mb-2 object-contain"
              />
              <h2 className="text-4xl font-black font-heading text-foreground tracking-tight leading-tight text-center">
                Voy a crear tu menú automáticamente
              </h2>
              <div className="w-full">
                <p className="text-base text-foreground/50 font-medium leading-relaxed mt-4 text-left">
                  Sube los archivos y yo me encargo de organizarlo, optimizarlo y dejarlo listo para vender.
                </p>
              </div>
            </div>

            <div 
              onDragOver={(e) => {e.preventDefault(); setDragActive(true);}}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {e.preventDefault(); setDragActive(false); addFiles(e.dataTransfer.files);}}
              onClick={() => !isProcessing && fileInputRef.current?.click()}
              className={`relative bg-card rounded-[32px] p-8 border-2 border-dashed transition-all flex flex-col items-center justify-center min-h-[300px] text-center gap-4 cursor-pointer group/dropbox overflow-hidden ${
                dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-foreground/10 hover:border-primary/30 hover:bg-foreground/[0.01] shadow-sm"
              } ${isProcessing ? "cursor-wait" : ""}`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                multiple
                className="hidden" 
                onChange={(e) => addFiles(e.target.files)}
                accept="image/*,.pdf"
              />

              <AnimatePresence mode="wait">
                {isProcessing ? (
                  <motion.div 
                    key="processing-inner"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center gap-6 w-full"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping scale-150 opacity-20" />
                      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary relative">
                        <Bot className="w-10 h-10 animate-bounce" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{processingSteps[currentProcessingStep].emoji}</span>
                        <p className="text-xl font-black text-foreground font-heading">
                          {processingSteps[currentProcessingStep].text}<AnimatedDots />
                        </p>
                      </div>
                      <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest animate-pulse">
                        Estoy preparando la mejor versión de tu menú
                      </p>
                    </div>

                    <div className="w-full max-w-[240px] bg-foreground/[0.03] h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        className="bg-primary h-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentProcessingStep + 1) / processingSteps.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="upload-inner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4 w-full"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover/dropbox:scale-110 group-hover/dropbox:rotate-3 transition-all duration-300">
                      <FileText className="w-8 h-8" />
                    </div>
                    
                    {selectedFiles.length === 0 ? (
                      <div className="flex flex-col gap-1">
                        <p className="text-xl font-bold text-foreground transition-colors group-hover/dropbox:text-primary">Sube tu menú aquí</p>
                        <p className="text-xs text-foreground/40 font-medium tracking-tight">PDF, JPG o PNG hasta 10MB</p>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-2 opacity-0 group-hover/dropbox:opacity-100 transition-all transform translate-y-1 group-hover/dropbox:translate-y-0">Haz clic para seleccionar</p>
                      </div>
                    ) : (
                      <div className="w-full flex flex-col gap-2 px-4" onClick={(e) => e.stopPropagation()}>
                        {selectedFiles.map((f, i) => (
                          <div key={i} className="flex items-center justify-between bg-foreground/[0.03] p-3 rounded-2xl border border-foreground/5 relative group/file">
                            <div className="flex items-center gap-3 overflow-hidden">
                              {f.processed ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 animate-in zoom-in duration-300" />
                              ) : (
                                <FileText className="w-4 h-4 text-primary shrink-0" />
                              )}
                              <span className={`text-xs font-bold truncate ${f.processed ? 'text-green-600/70' : 'text-foreground'}`}>
                                {f.file.name}
                              </span>
                            </div>
                            <button onClick={() => removeFile(i)} className="p-1 hover:text-red-500 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <div className="flex flex-col items-center gap-2 mt-2">
                          <button 
                            onClick={() => setSelectedFiles([])}
                            className="text-[10px] font-black text-foreground/20 uppercase tracking-widest hover:text-foreground/40 transition-colors"
                          >
                            Limpiar archivos
                          </button>
                          <p className="text-[9px] font-bold text-primary italic">Haz clic afuera de los archivos para añadir más</p>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col items-center gap-4 mt-2">
                      {selectedFiles.length > 0 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleProcessMenu(); }}
                          className="px-10 py-4 bg-primary text-white rounded-full font-black text-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-xl shadow-primary/20 animate-in zoom-in-95 duration-200"
                        >
                          <Sparkles className="w-4 h-4" /> Procesar con IA
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}

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

              <div className="w-full">
                <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-foreground/10 scrollbar-track-transparent">
                  {localProducts.map((p, idx) => (
                    <motion.div 
                      key={idx} 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full bg-card rounded-2xl border border-foreground/5 p-3 flex flex-col gap-3 shadow-sm hover:border-primary/20 transition-all group"
                    >
                      {/* Fila 1: Nombre y eliminar */}
                      <div className="flex justify-between items-start gap-2">
                        <input
                          type="text"
                          value={p.name}
                          placeholder="Nombre del plato"
                          onChange={(e) => handleUpdateProduct(idx, { name: e.target.value })}
                          className="text-[11px] font-black text-foreground leading-tight uppercase tracking-wide flex-1 bg-transparent border-none focus:ring-1 focus:ring-primary/20 rounded px-1 outline-none placeholder:text-foreground/20"
                        />
                        <button 
                          onClick={() => handleRemoveProduct(idx)} 
                          className="text-foreground/20 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Fila 2: Categoria y Precio */}
                      <div className="flex justify-between items-center pt-0.5 gap-4">
                        <input
                          type="text"
                          value={p.categoria}
                          placeholder="Categoría"
                          onChange={(e) => handleUpdateProduct(idx, { categoria: e.target.value })}
                          className="text-[9px] font-black text-foreground/30 uppercase tracking-widest bg-transparent border-none focus:ring-1 focus:ring-primary/20 rounded px-1 outline-none placeholder:text-foreground/10 flex-1"
                        />
                        <div className="flex items-center bg-foreground/[0.03] px-2 py-1 rounded-lg border border-foreground/5">
                          <span className="text-[11px] font-black text-primary mr-1">$</span>
                          <input
                            type="text"
                            value={p.price}
                            placeholder="0"
                            onChange={(e) => handleUpdateProduct(idx, { price: e.target.value })}
                            className="text-[11px] font-black text-primary bg-transparent border-none focus:ring-0 w-16 outline-none text-right"
                          />
                        </div>
                      </div>

                      {/* Fila 3: Descripción */}
                      <div>
                        <textarea
                          value={p.description}
                          placeholder="Descripción del plato..."
                          onChange={(e) => handleUpdateProduct(idx, { description: e.target.value })}
                          className="w-full text-[10px] text-foreground/50 font-medium leading-tight bg-transparent border-none focus:ring-1 focus:ring-primary/20 rounded px-1 outline-none placeholder:text-foreground/20 resize-none h-10"
                        />
                      </div>

                      {/* Fila 4: Variaciones */}
                      <div className="flex flex-wrap gap-1 min-h-[16px]">
                        {p.variants && p.variants.length > 0 ? (
                          p.variants.map((v, vIdx) => (
                            <div key={vIdx} className="bg-foreground/[0.04] px-1.5 py-0.5 rounded-md flex items-center gap-1">
                              <span className="text-[8px] font-bold text-foreground/40 leading-none">
                                {v.name}
                              </span>
                              <span className="text-[8px] font-black text-primary leading-none">
                                +${v.price}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center gap-1 opacity-20">
                            <Tag className="w-2.5 h-2.5" />
                            <span className="text-[9px] font-bold italic">Sin variantes</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Botón Añadir Manualmente */}
                  <button 
                    onClick={handleAddProduct}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-foreground/[0.02] border border-dashed border-foreground/10 rounded-2xl hover:bg-foreground/[0.04] transition-all group"
                  >
                    <Plus className="w-4 h-4 text-foreground/20 group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Añadir plato manualmente</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
      </AnimatePresence>
    </div>
  );
}
