"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
import { Search, Filter, Eye } from "lucide-react";
import { formatItems } from "@/lib/utils";

export default function OrdersSection() {
  const { orders } = useDashboard();

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-xl sm:text-2xl font-heading font-black text-foreground">Historial de Pedidos</h2>
           <p className="text-muted-foreground text-xs sm:text-sm">Todos los pedidos procesados por tu restaurante.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
           <div className="relative flex-1 sm:flex-none">
             <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             <input type="text" placeholder="Buscar cliente..." className="w-full sm:w-auto bg-white border border-slate-200 rounded-full py-2.5 pl-12 pr-6 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 shadow-sm" />
           </div>
           <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 sm:px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors flex-shrink-0 shadow-sm">
             <Filter className="w-4 h-4" /> <span className="hidden sm:inline">Filtros</span>
           </button>
        </div>
      </div>

      {/* Mobile card layout */}
      <div className="block lg:hidden space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center text-slate-300 text-sm font-medium shadow-sm">
            Aún no hay pedidos registrados.
          </div>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-800">{o.customer_name}</div>
                   <div className="text-xs text-slate-400">{o.customer_phone}</div>
                   {o.customer_address && <div className="text-[10px] text-slate-400 italic">{o.customer_address}</div>}
                 </div>
                <div className="text-sm font-bold text-slate-900">${o.total.toLocaleString()}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  {new Date(o.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </div>
                 <div className="text-xs text-slate-500 font-medium line-clamp-1">{formatItems(o.items)}</div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[10px] uppercase tracking-widest font-bold border border-slate-200">
                  {o.pipeline_stage === 'en_progreso' ? 'nuevo pedido' : o.pipeline_stage.replace('_', ' ')}
                </div>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent("dashboardTabChange", { detail: "kanban" }))}
                  className="text-primary hover:scale-110 transition-transform p-2 bg-primary/10 rounded-xl"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table layout */}
      <div className="hidden lg:block bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
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
                  <td colSpan={6} className="p-12 text-center text-slate-300 text-sm font-medium">
                    Aún no hay pedidos registrados.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                    <td className="p-6">
                      <div className="font-bold text-sm text-slate-800">{o.customer_name}</div>
                       <div className="text-xs text-slate-400">{o.customer_phone}</div>
                       {o.customer_address && <div className="text-[10px] text-slate-400 italic">{o.customer_address}</div>}
                     </td>
                    <td className="p-6 text-sm text-slate-500">
                      {new Date(o.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                     <td className="p-6 text-sm text-slate-500 max-w-[200px]">
                       <div className="truncate" title={formatItems(o.items)}>{formatItems(o.items)}</div>
                     </td>
                    <td className="p-6 text-sm font-bold text-slate-900">
                      ${o.total.toLocaleString()}
                    </td>
                    <td className="p-6">
                      <div className="px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[10px] uppercase tracking-widest font-bold w-fit border border-slate-200">
                        {o.pipeline_stage === 'en_progreso' ? 'nuevo pedido' : o.pipeline_stage.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => window.dispatchEvent(new CustomEvent("dashboardTabChange", { detail: "kanban" }))}
                        className="text-primary hover:scale-110 transition-transform p-2 bg-primary/10 rounded-xl"
                      >
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
