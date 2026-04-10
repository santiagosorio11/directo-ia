"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
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

    setColumns(prev => {
      const newCols = { ...prev };
      const order = newCols[sourceCol].find(o => o.id === orderId);
      if (order) {
        newCols[sourceCol] = newCols[sourceCol].filter(o => o.id !== orderId);
        newCols[targetCol] = [{ ...order, pipeline_stage: targetCol }, ...newCols[targetCol]];
      }
      return newCols;
    });
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-180px)] lg:h-[calc(100vh-140px)] w-full gap-4 overflow-x-auto overflow-y-hidden pb-4 [&::-webkit-scrollbar]:hidden">
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
                <div className="text-[10px] sm:text-xs text-slate-400 font-medium mb-3">{order.customer_phone}</div>
                
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                   <div className="text-[10px] uppercase font-black text-slate-300 tracking-wider transition-colors group-hover:text-slate-400">{order.items?.length || 0} items</div>
                   <button className="text-slate-300 hover:text-primary transition-colors">
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
