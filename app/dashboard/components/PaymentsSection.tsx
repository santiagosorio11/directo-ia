"use client";

import { useDashboard } from "@/app/context/DashboardContext";
import { CheckCircle2, XCircle, AlertCircle, MessageCircle } from "lucide-react";

export default function PaymentsSection() {
  const { orders } = useDashboard();
  const pendingPayments = orders.filter(o => o.pipeline_stage === 'confirmacion_pago');

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
       <div>
         <h2 className="text-2xl font-heading font-black text-white">Confirmación de Pagos</h2>
         <p className="text-white/50 text-sm mt-1">El agente IA necesita que un humano valide estos recibos antes de enviar a cocina.</p>
       </div>

       {pendingPayments.length === 0 ? (
         <div className="bg-[#18181B] border border-white/5 p-16 rounded-[40px] flex flex-col items-center justify-center text-center gap-4">
           <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
             <AlertCircle className="w-8 h-8 text-white/20" />
           </div>
           <div className="text-white/50 text-base font-medium">No hay pagos pendientes de revisión</div>
         </div>
       ) : (
         <div className="grid gap-6">
           {pendingPayments.map((p) => (
             <div key={p.id} className="bg-[#18181B] border border-white/5 rounded-[32px] p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
               <div className="flex-1 flex flex-col gap-4">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-[#FF5200]/10 flex items-center justify-center text-[#FF5200] font-bold">
                     {p.customer_name[0]}
                   </div>
                   <div>
                     <div className="text-lg font-bold text-white">{p.customer_name}</div>
                     <div className="text-sm text-white/50">{p.customer_phone}</div>
                   </div>
                   <div className="ml-auto text-right">
                     <div className="text-sm text-white/40 mb-1">Monto a confirmar</div>
                     <div className="text-xl font-black text-[#FF5200] font-heading">${p.total.toLocaleString()}</div>
                   </div>
                 </div>

                 <div className="mt-2 bg-black border border-white/5 p-4 rounded-2xl">
                   <div className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">Resumen de orden</div>
                   <ul className="text-sm text-white/70 space-y-1">
                     {p.items?.map((item: any, idx) => (
                       <li key={idx} className="flex justify-between">
                         <span>{item.quantity}x {item.name}</span>
                         <span>${(item.price * item.quantity).toLocaleString()}</span>
                       </li>
                     )) || <li>Sin productos detallados</li>}
                   </ul>
                 </div>
               </div>

               <div className="w-full lg:w-72 bg-black rounded-2xl flex items-center justify-center overflow-hidden relative">
                 {/* Placeholder para comprobante */}
                 <div className="absolute inset-0 bg-white/5 flex items-center justify-center text-white/30 text-sm font-bold">
                   Sin comprobante adjunto
                 </div>
               </div>

               <div className="flex flex-row lg:flex-col justify-center gap-3 w-full lg:w-48">
                 <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-sm transition-colors shadow-lg shadow-green-500/10">
                   <CheckCircle2 className="w-5 h-5" /> Aprobar
                 </button>
                 <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl font-bold text-sm transition-colors">
                   <XCircle className="w-5 h-5" /> Rechazar
                 </button>
                 <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold text-sm transition-colors">
                   <MessageCircle className="w-5 h-5" /> Contactar
                 </button>
               </div>
             </div>
           ))}
         </div>
       )}
    </div>
  );
}
