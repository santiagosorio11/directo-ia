"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
import { CheckCircle2, XCircle, AlertCircle, MessageCircle } from "lucide-react";
import { useToast } from "./Toast";

export default function PaymentsSection() {
  const { orders, updateOrderStage } = useDashboard();
  const { showToast } = useToast();
  const pendingPayments = orders.filter(o => o.pipeline_stage === 'confirmacion_pago');

  const handleApprove = async (orderId: string, customerName: string) => {
    await updateOrderStage(orderId, 'pedido_confirmado');
    showToast(`Pago de ${customerName} aprobado ✅`, "success");
  };

  const handleReject = async (orderId: string, customerName: string) => {
    await updateOrderStage(orderId, 'cancelado');
    showToast(`Pago de ${customerName} rechazado`, "error");
  };

  const handleContact = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanPhone}`, "_blank");
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8 w-full">
       <div>
         <h2 className="text-xl sm:text-2xl font-heading font-black text-foreground">Confirmación de Pagos</h2>
         <p className="text-muted-foreground text-xs sm:text-sm mt-1">El agente IA necesita que un humano valide estos recibos antes de enviar a cocina.</p>
       </div>

       {pendingPayments.length === 0 ? (
         <div className="bg-white border border-slate-200 p-12 sm:p-16 rounded-2xl sm:rounded-[40px] flex flex-col items-center justify-center text-center gap-4 shadow-sm">
           <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
             <AlertCircle className="w-8 h-8 text-slate-200" />
           </div>
           <div className="text-slate-400 text-sm sm:text-base font-medium">No hay pagos pendientes de revisión</div>
         </div>
       ) : (
         <div className="grid gap-6">
           {pendingPayments.map((p) => (
             <div key={p.id} className="bg-white border border-slate-200 rounded-2xl sm:rounded-[32px] p-5 sm:p-6 lg:p-8 flex flex-col gap-6 shadow-sm">
               {/* Order info */}
               <div className="flex flex-col sm:flex-row gap-4">
                 <div className="flex-1 flex flex-col gap-4">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                       {p.customer_name[0]}
                     </div>
                     <div className="min-w-0 flex-1">
                       <div className="text-base sm:text-lg font-bold text-slate-800 truncate">{p.customer_name}</div>
                       <div className="text-sm text-slate-500">{p.customer_phone}</div>
                     </div>
                     <div className="text-right flex-shrink-0">
                       <div className="text-xs sm:text-sm text-slate-400 mb-1 font-bold uppercase tracking-wider">Monto</div>
                       <div className="text-lg sm:text-xl font-black text-primary font-heading">${p.total.toLocaleString()}</div>
                     </div>
                   </div>

                   <div className="bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
                     <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Resumen de orden</div>
                     <ul className="text-sm text-slate-600 space-y-1">
                       {p.items?.map((item: any, idx: number) => (
                         <li key={idx} className="flex justify-between">
                           <span>{item.quantity}x {item.name}</span>
                           <span className="font-medium">${(item.price * item.quantity).toLocaleString()}</span>
                         </li>
                       )) || <li>Sin productos detallados</li>}
                     </ul>
                   </div>
                 </div>

                 <div className="w-full sm:w-48 lg:w-72 h-40 sm:h-auto bg-slate-100 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden relative flex-shrink-0 border border-slate-200 border-dashed">
                   <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-bold px-8 text-center">
                     Sin comprobante adjunto
                   </div>
                 </div>
               </div>

               {/* Action buttons */}
                <div className="flex flex-row gap-3 w-full">
                  <button onClick={() => handleApprove(p.id, p.customer_name)} className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-green-500/10">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> Aprobar
                  </button>
                  <button onClick={() => handleReject(p.id, p.customer_name)} className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all">
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5" /> Rechazar
                  </button>
                  <button onClick={() => handleContact(p.customer_phone)} className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" /> Contactar
                  </button>
                </div>
             </div>
           ))}
         </div>
       )}
    </div>
  );
}
