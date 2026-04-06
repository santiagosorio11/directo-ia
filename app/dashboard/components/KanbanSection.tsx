"use client";

import { useDashboard } from "@/app/context/DashboardContext";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

const STAGES = [
  { id: 'en_progreso', name: 'Chat en curso', color: 'bg-blue-500' },
  { id: 'confirmacion_pago', name: 'Validando Pago', color: 'bg-yellow-500' },
  { id: 'pedido_confirmado', name: 'Confirmado', color: 'bg-green-500' },
  { id: 'en_preparacion', name: 'Cocina', color: 'bg-[#FF5200]' },
  { id: 'listo', name: 'Listo', color: 'bg-purple-500' },
  { id: 'en_camino', name: 'En Camino', color: 'bg-pink-500' }
];

export default function KanbanSection() {
  const { orders } = useDashboard();
  const [columns, setColumns] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const cols: Record<string, any[]> = {};
    STAGES.forEach(s => cols[s.id] = []);
    
    orders.forEach(o => {
      if (cols[o.pipeline_stage]) {
        cols[o.pipeline_stage].push(o);
      } else if (o.pipeline_stage !== 'entregado' && o.pipeline_stage !== 'cancelado') {
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

    // Optimistic UI update
    setColumns(prev => {
      const newCols = { ...prev };
      const order = newCols[sourceCol].find(o => o.id === orderId);
      if (order) {
        newCols[sourceCol] = newCols[sourceCol].filter(o => o.id !== orderId);
        newCols[targetCol] = [{ ...order, pipeline_stage: targetCol }, ...newCols[targetCol]];
      }
      return newCols;
    });

    // En backend real: supabase update pipeline_stage
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex h-[calc(100vh-140px)] w-full gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
      {STAGES.map(stage => (
        <div 
          key={stage.id} 
          className="flex-shrink-0 w-[300px] flex flex-col bg-[#101014] border border-white/5 rounded-3xl"
          onDragOver={allowDrop}
          onDrop={(e) => handleDrop(e, stage.id)}
        >
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">{stage.name}</h3>
            </div>
            <div className="bg-white/10 px-2 py-0.5 rounded-full text-xs font-bold text-white/50">
              {columns[stage.id]?.length || 0}
            </div>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {columns[stage.id]?.map((order) => (
              <div 
                key={order.id}
                draggable
                onDragStart={(e) => handleDragStart(e, order.id, stage.id)}
                className="bg-[#18181B] p-4 rounded-2xl border border-white/10 cursor-grab active:cursor-grabbing hover:border-white/20 transition-all shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-white text-sm">{order.customer_name}</div>
                  <div className="text-xs text-[#FF5200] font-black">${order.total}</div>
                </div>
                <div className="text-xs text-white/40 mb-3">{order.customer_phone}</div>
                
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                   <div className="text-[10px] uppercase font-bold text-white/30">{order.items?.length || 0} items</div>
                   <button className="text-white/20 hover:text-white transition-colors">
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
