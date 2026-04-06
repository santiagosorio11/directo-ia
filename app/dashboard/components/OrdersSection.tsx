"use client";

import { useDashboard } from "@/app/context/DashboardContext";
import { Search, Filter, Eye } from "lucide-react";

export default function OrdersSection() {
  const { orders } = useDashboard();

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-heading font-black text-white">Historial de Pedidos</h2>
           <p className="text-white/50 text-sm">Todos los pedidos procesados por tu restaurante.</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
             <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
             <input type="text" placeholder="Buscar cliente..." className="bg-[#18181B] border border-white/10 rounded-full py-2.5 pl-12 pr-6 text-sm outline-none focus:border-[#FF5200] transition-colors text-white" />
           </div>
           <button className="flex items-center gap-2 bg-[#18181B] border border-white/10 rounded-full px-6 py-2.5 text-sm font-bold text-white/80 hover:text-white transition-colors">
             <Filter className="w-4 h-4" /> Filtros
           </button>
        </div>
      </div>

      <div className="bg-[#18181B] border border-white/5 rounded-[32px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-[11px] uppercase tracking-widest font-bold">
                <th className="p-6 font-medium">Cliente</th>
                <th className="p-6 font-medium">Fecha</th>
                <th className="p-6 font-medium">Productos</th>
                <th className="p-6 font-medium">Total</th>
                <th className="p-6 font-medium">Estado</th>
                <th className="p-6 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-white/30 text-sm font-medium">
                    Aún no hay pedidos registrados.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-6">
                      <div className="font-bold text-sm text-white">{o.customer_name}</div>
                      <div className="text-xs text-white/40">{o.customer_phone}</div>
                    </td>
                    <td className="p-6 text-sm text-white/60">
                      {new Date(o.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="p-6 text-sm text-white/60">
                      {o.items?.length || 0} items
                    </td>
                    <td className="p-6 text-sm font-bold text-white">
                      ${o.total.toLocaleString()}
                    </td>
                    <td className="p-6">
                      <div className="px-3 py-1 rounded-full bg-white/5 text-white/80 text-[10px] uppercase tracking-widest font-bold w-fit border border-white/10">
                        {o.pipeline_stage.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <button className="text-[#FF5200] hover:text-white transition-colors p-2 bg-[#FF5200]/10 rounded-xl">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
