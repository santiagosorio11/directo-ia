"use client";

import { useDashboard } from "@/app/dashboard/_context/DashboardContext";
import { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingBag,
  Receipt,
  Bot,
  TrendingUp,
  TrendingDown,
  Minus,
  Power,
  ArrowRight,
} from "lucide-react";


interface Metrics {
  today: { sales: number; orders: number; avgTicket: number };
  yesterday: { sales: number; orders: number; avgTicket: number };
  week: { sales: number; orders: number };
  dailySales: { date: string; label: string; total: number; count: number }[];
  topProducts: { name: string; count: number; revenue: number }[];
  totalOrders30d: number;
}

export default function OverviewSection() {
  const { restaurant, agentConfig, orders, updateAgentStatus } = useDashboard();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<"sales" | "customers">("sales");

  useEffect(() => {
    if (!restaurant?.id) return;
    fetchMetrics();
  }, [restaurant?.id]);

  const fetchMetrics = async () => {
    if (!restaurant?.id) return;
    setMetricsLoading(true);
    try {
      const res = await fetch(`/api/metrics?restaurantId=${restaurant.id}`);
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (e) {
      console.error("Error fetching metrics:", e);
    } finally {
      setMetricsLoading(false);
    }
  };

  const formatCurrency = (val: number) =>
    "$" + val.toLocaleString("es-CO", { minimumFractionDigits: 0 });

  const getTrend = (current: number, previous: number) => {
    if (previous === 0 && current === 0) return { icon: Minus, text: "Sin datos", color: "text-slate-400" };
    if (previous === 0) return { icon: TrendingUp, text: "+100%", color: "text-emerald-500" };
    const pct = Math.round(((current - previous) / previous) * 100);
    if (pct > 0) return { icon: TrendingUp, text: `+${pct}%`, color: "text-emerald-500" };
    if (pct < 0) return { icon: TrendingDown, text: `${pct}%`, color: "text-red-400" };
    return { icon: Minus, text: "Igual", color: "text-slate-400" };
  };

  const salesTrend = metrics ? getTrend(metrics.today.sales, metrics.yesterday.sales) : null;
  const ordersTrend = metrics ? getTrend(metrics.today.orders, metrics.yesterday.orders) : null;
  const ticketTrend = metrics ? getTrend(metrics.today.avgTicket, metrics.yesterday.avgTicket) : null;

  // Chart bar max for scaling
  const maxDailySale = metrics?.dailySales ? Math.max(...metrics.dailySales.map((d) => d.total), 1) : 1;

  const handleTabChange = (tab: string) => {
    window.dispatchEvent(new CustomEvent("dashboardTabChange", { detail: tab }));
  };

  return (
    <div className="flex gap-6 w-full pb-6">
      <div className="flex-1 min-w-0">
        
        <div className="flex flex-col mb-6">
          <h2 className="text-2xl font-heading font-black text-slate-800">Panel de Control</h2>
          <p className="text-slate-500 text-sm mt-1">Visión general de tu operación en tiempo real.</p>
        </div>

        {/* Sub-tabs toggle */}
        <div className="flex items-center gap-2 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveSubTab("sales")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeSubTab === "sales"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Ventas
          </button>
          <button
            onClick={() => setActiveSubTab("customers")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeSubTab === "customers"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Clientes
          </button>
        </div>

        {activeSubTab === "sales" ? (
          <div className="flex flex-col gap-6 pb-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
              {/* Sales Today */}
              <div className="bg-white border border-slate-100 rounded-2xl p-4 lg:p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                  </div>
                {salesTrend && (
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${salesTrend.color}`}>
                    <salesTrend.icon className="w-3 h-3" />
                    {salesTrend.text}
                  </div>
                )}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ventas hoy</p>
                <p className="text-xl lg:text-2xl font-heading font-black text-slate-800 leading-tight mt-0.5">
                  {metricsLoading ? "—" : formatCurrency(metrics?.today.sales || 0)}
                </p>
              </div>
            </div>

            {/* Orders Today */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 lg:p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-blue-500" />
                </div>
                {ordersTrend && (
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${ordersTrend.color}`}>
                    <ordersTrend.icon className="w-3 h-3" />
                    {ordersTrend.text}
                  </div>
                )}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pedidos hoy</p>
                <p className="text-xl lg:text-2xl font-heading font-black text-slate-800 leading-tight mt-0.5">
                  {metricsLoading ? "—" : (metrics?.today.orders || 0)}
                </p>
              </div>
            </div>

            {/* Avg Ticket */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 lg:p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-violet-500" />
                </div>
                {ticketTrend && (
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${ticketTrend.color}`}>
                    <ticketTrend.icon className="w-3 h-3" />
                    {ticketTrend.text}
                  </div>
                )}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ticket promedio</p>
                <p className="text-xl lg:text-2xl font-heading font-black text-slate-800 leading-tight mt-0.5">
                  {metricsLoading ? "—" : formatCurrency(metrics?.today.avgTicket || 0)}
                </p>
              </div>
            </div>

            {/* Agent Status */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 lg:p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${agentConfig?.is_active ? "bg-emerald-50" : "bg-red-50"}`}>
                  <Bot className={`w-4 h-4 ${agentConfig?.is_active ? "text-emerald-500" : "text-red-400"}`} />
                </div>
                <button
                  onClick={() => agentConfig && updateAgentStatus(!agentConfig.is_active)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    agentConfig?.is_active
                      ? "bg-emerald-50 text-emerald-500 hover:bg-red-50 hover:text-red-500"
                      : "bg-red-50 text-red-400 hover:bg-emerald-50 hover:text-emerald-500"
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Agente IA</p>
                <p className={`text-sm font-bold mt-0.5 ${agentConfig?.is_active ? "text-emerald-500" : "text-red-400"}`}>
                  {agentConfig?.is_active ? "Activo — vendiendo" : "Apagado"}
                </p>
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Ventas — Últimos 7 días</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Total semana: {metricsLoading ? "—" : formatCurrency(metrics?.week.sales || 0)}
                </p>
              </div>
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                {metrics?.week.orders || 0} pedidos
              </div>
            </div>

            {metricsLoading ? (
              <div className="h-40 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex items-end gap-2 lg:gap-3 h-40">
                {metrics?.dailySales.map((day, i) => {
                  const heightPct = maxDailySale > 0 ? (day.total / maxDailySale) * 100 : 0;
                  const isToday = i === (metrics?.dailySales.length || 0) - 1;
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="text-[9px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {formatCurrency(day.total)}
                      </div>
                      <div className="w-full relative" style={{ height: "120px" }}>
                        <div
                          className={`absolute bottom-0 inset-x-0 rounded-lg transition-all duration-500 ease-out ${
                            isToday
                              ? "bg-gradient-to-t from-primary to-primary/70"
                              : "bg-slate-100 group-hover:bg-primary/20"
                          }`}
                          style={{
                            height: `${Math.max(heightPct, 4)}%`,
                          }}
                        />
                      </div>
                      <span className={`text-[10px] font-bold ${isToday ? "text-primary" : "text-slate-400"}`}>
                        {day.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Row: Top Products + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Products */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Productos más vendidos</h3>
              {metricsLoading ? (
                <div className="h-24 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              ) : !metrics?.topProducts || metrics.topProducts.length === 0 ? (
                <p className="text-sm text-slate-300 py-4 text-center">Sin datos aún</p>
              ) : (
                <div className="space-y-3">
                  {metrics.topProducts.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-300 w-5 text-right">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate">{p.name}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-400">{p.count}x</span>
                      <span className="text-xs font-bold text-primary">{formatCurrency(p.revenue)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Acciones rápidas</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleTabChange("marketing")}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-primary/5 hover:border-primary/20 border border-slate-100 rounded-xl transition-colors group"
                >
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-primary">Conectar WhatsApp</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                </button>
                <button
                  onClick={() => handleTabChange("orders")}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-primary/5 hover:border-primary/20 border border-slate-100 rounded-xl transition-colors group"
                >
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-primary">Ver pedidos</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                </button>
                <button
                  onClick={() => handleTabChange("kanban")}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-primary/5 hover:border-primary/20 border border-slate-100 rounded-xl transition-colors group"
                >
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-primary">Operación en vivo</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                </button>
                <button
                  onClick={() => handleTabChange("menu")}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-primary/5 hover:border-primary/20 border border-slate-100 rounded-xl transition-colors group"
                >
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-primary">Gestionar menú</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Actividad reciente</h3>
              <button
                onClick={() => handleTabChange("orders")}
                className="text-xs font-bold text-primary hover:underline"
              >
                Ver todo
              </button>
            </div>
            {orders.length === 0 ? (
              <div className="py-8 text-center text-slate-300 text-sm">
                Aún no hay pedidos. Cuando tu agente cierre la primera venta, aparecerá aquí.
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between py-2 border-b border-slate-50 last:border-none"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-700 truncate">{o.customer_name}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(o.created_at).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" })} · {o.items?.length || 0} items
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-sm font-bold text-slate-800">${o.total.toLocaleString()}</p>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        {o.pipeline_stage.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 pb-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Customers KPIs — computed from orders */}
            {(() => {
              // Group orders by unique phone to identify customers
              const customerMap = new Map<string, number>();
              orders.forEach(o => {
                const phone = o.customer_phone?.trim();
                if (phone) customerMap.set(phone, (customerMap.get(phone) || 0) + 1);
              });
              const totalCustomers = customerMap.size;
              const newCustomers = Array.from(customerMap.values()).filter(count => count === 1).length;
              const recurringCustomers = Array.from(customerMap.values()).filter(count => count >= 2).length;
              const newPct = totalCustomers > 0 ? Math.round((newCustomers / totalCustomers) * 100) : 0;
              const recurPct = totalCustomers > 0 ? Math.round((recurringCustomers / totalCustomers) * 100) : 0;

              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clientes Nuevos</p>
                    <div className="mt-2 flex items-end gap-3">
                      <p className="text-3xl font-heading font-black text-emerald-500">{newCustomers}</p>
                      <p className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg mb-1">{newPct}% del total</p>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Usuarios que compraron por primera vez.</p>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clientes Recurrentes</p>
                    <div className="mt-2 flex items-end gap-3">
                      <p className="text-3xl font-heading font-black text-primary">{recurringCustomers}</p>
                      <p className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg mb-1">{recurPct}% del total</p>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Usuarios con más de 2 compras.</p>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Clientes</p>
                    <div className="mt-2 flex items-end gap-3">
                      <p className="text-3xl font-heading font-black text-slate-700">{totalCustomers}</p>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Clientes únicos basado en pedidos.</p>
                  </div>
                </div>
              );
            })()}

            {/* Customer composition chart */}
            {(() => {
              const customerMap = new Map<string, number>();
              orders.forEach(o => {
                const phone = o.customer_phone?.trim();
                if (phone) customerMap.set(phone, (customerMap.get(phone) || 0) + 1);
              });
              const totalCustomers = customerMap.size || 1;
              const newCustomers = Array.from(customerMap.values()).filter(count => count === 1).length;
              const recurringCustomers = Array.from(customerMap.values()).filter(count => count >= 2).length;
              const newPct = Math.round((newCustomers / totalCustomers) * 100);
              const recurPct = Math.round((recurringCustomers / totalCustomers) * 100);

              return (
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Composición de Clientes</h3>
                  <div className="h-40 flex items-end gap-4">
                    <div className="w-8 bg-emerald-500 rounded-t-lg transition-all" style={{ height: `${Math.max(newPct, 5)}%` }} />
                    <div className="w-8 bg-primary rounded-t-lg transition-all" style={{ height: `${Math.max(recurPct, 5)}%` }} />
                    <div className="ml-4 flex flex-col gap-3 self-center">
                      <div className="flex items-center gap-2 tracking-tight text-sm"><span className="w-3 h-3 bg-emerald-500 rounded-full"></span> Nuevos ({newPct}%)</div>
                      <div className="flex items-center gap-2 tracking-tight text-sm"><span className="w-3 h-3 bg-primary rounded-full"></span> Recurrentes ({recurPct}%)</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
