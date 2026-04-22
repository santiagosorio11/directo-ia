"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
import { MessageCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { formatItems } from "@/lib/utils";

const STAGES = [
  { id: 'en_progreso', name: 'Nuevo pedido', color: 'bg-blue-500' },
  { id: 'confirmacion_pago', name: 'Validando Pago', color: 'bg-yellow-500' },
  { id: 'pedido_confirmado', name: 'Confirmado', color: 'bg-green-500' },
  { id: 'en_preparacion', name: 'Cocina', color: 'bg-[#FF5200]' },
  { id: 'listo', name: 'Listo', color: 'bg-purple-500' },
  { id: 'en_camino', name: 'En Camino', color: 'bg-pink-500' },
  { id: 'entregado', name: 'Entregado', color: 'bg-slate-400' }
];

export default function KanbanSection() {
  const { orders, updateOrderStage } = useDashboard();
  const [columns, setColumns] = useState<Record<string, any[]>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cols: Record<string, any[]> = {};
    STAGES.forEach(s => cols[s.id] = []);
    
    const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000);
    
    orders.forEach(o => {
      // Exclude delivered orders older than 8 hours from view
      if (o.pipeline_stage === 'entregado') {
        const orderDate = new Date(o.created_at);
        if (orderDate < eightHoursAgo) return;
      }

      if (cols[o.pipeline_stage]) {
        cols[o.pipeline_stage].push(o);
      } else if (o.pipeline_stage !== 'cancelado') {
        cols['en_progreso'].push(o);
      }
    });
    setColumns(cols);
  }, [orders]);

  const handleDragStart = (e: React.DragEvent, orderId: string, sourceCol: string) => {
    e.dataTransfer.setData("orderId", orderId);
    e.dataTransfer.setData("sourceCol", sourceCol);
  };

  const handleDrop = async (e: React.DragEvent, targetCol: string) => {
    const orderId = e.dataTransfer.getData("orderId");
    const sourceCol = e.dataTransfer.getData("sourceCol");
    
    if (sourceCol === targetCol) return;

    // Optimistically update UI
    setColumns(prev => {
      const newCols = { ...prev };
      
      // Defensive check: ensure both columns exist in our state
      if (!newCols[sourceCol] || !newCols[targetCol]) return prev;

      const order = newCols[sourceCol].find(o => o.id === orderId);
      if (order) {
        newCols[sourceCol] = newCols[sourceCol].filter(o => o.id !== orderId);
        newCols[targetCol] = [{ ...order, pipeline_stage: targetCol }, ...newCols[targetCol]];
      }
      return newCols;
    });

    // Persist to Supabase
    await updateOrderStage(orderId, targetCol);
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    // Autoscroll logic
    if (containerRef.current) {
      const container = containerRef.current;
      const { clientX } = e;
      const { left, width } = container.getBoundingClientRect();
      const edgeSize = 120;
      
      if (clientX < left + edgeSize) {
        container.scrollLeft -= 12;
      } else if (clientX > left + width - edgeSize) {
        container.scrollLeft += 12;
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      onDragOver={allowDrop}
      className="flex flex-col lg:flex-row h-[calc(100vh-180px)] lg:h-[calc(100vh-140px)] w-full gap-4 overflow-x-auto pb-4 scroll-smooth"
    >
      {STAGES.map(stage => (
        <div 
          key={stage.id} 
          className="flex-shrink-0 w-full sm:w-[280px] lg:w-[260px] xl:w-[300px] flex flex-col bg-slate-100/50 border border-slate-200/60 rounded-2xl sm:rounded-3xl min-h-[200px] lg:min-h-0"
          onDragOver={allowDrop}
          onDrop={(e) => handleDrop(e, stage.id)}
        >
          <div className="p-3 sm:p-4 border-b border-slate-200/60 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${stage.color} shadow-sm`} />
              <h3 className="text-[11px] sm:text-xs font-black text-slate-500 uppercase tracking-widest">{stage.name}</h3>
            </div>
            <div className="bg-white/80 px-2 py-0.5 rounded-full text-[10px] font-black text-slate-400 border border-slate-200/50 shadow-sm">
              {columns[stage.id]?.length || 0}
            </div>
          </div>
          
          <div className="p-3 sm:p-4 flex-1 overflow-y-auto space-y-3">
            {columns[stage.id]?.map((order) => (
              <div 
                key={order.id}
                draggable
                onDragStart={(e) => handleDragStart(e, order.id, stage.id)}
                className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 cursor-grab active:cursor-grabbing hover:border-primary/30 hover:shadow-md transition-all shadow-sm group"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-slate-800 text-sm truncate mr-2">{order.customer_name}</div>
                  <div className="text-xs text-primary font-black flex-shrink-0">${order.total}</div>
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 font-medium">{order.customer_phone}</div>
                {order.customer_address && (
                  <div className="text-[10px] text-slate-400 italic mt-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">{order.customer_address}</div>
                )}
                
                <div className="mt-3 bg-primary/5 p-2 rounded-xl border border-primary/10">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Pedido:</p>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{formatItems(order.items)}</p>
                </div>
                
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                    <button className="text-slate-300 hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-lg">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
