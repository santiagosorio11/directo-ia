"use client";

import { useDashboard, RestaurantTable, Reservation } from "@/app/dashboard/_context/DashboardContext";
import { useState, useMemo } from "react";
import {
  CalendarCheck, Plus, X, Users, Check, Clock, Ban,
  Armchair, ChevronLeft, ChevronRight, UserCheck, AlertCircle,
  Trash2, Phone
} from "lucide-react";
import { useToast } from "./Toast";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pendiente:   { label: "Pendiente",   color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
  confirmada:  { label: "Confirmada",  color: "text-blue-600",   bg: "bg-blue-50 border-blue-200" },
  en_mesa:     { label: "En Mesa",     color: "text-green-600",  bg: "bg-green-50 border-green-200" },
  completada:  { label: "Completada",  color: "text-slate-500",  bg: "bg-slate-50 border-slate-200" },
  cancelada:   { label: "Cancelada",   color: "text-red-500",    bg: "bg-red-50 border-red-200" },
  no_show:     { label: "No Show",     color: "text-red-600",    bg: "bg-red-50 border-red-300" },
};

const TABLE_STATUS_CONFIG: Record<string, { label: string; color: string; ring: string }> = {
  disponible: { label: "Disponible", color: "bg-emerald-500", ring: "ring-emerald-200" },
  apartada:   { label: "Apartada",   color: "bg-yellow-500",  ring: "ring-yellow-200" },
  ocupada:    { label: "Ocupada",    color: "bg-red-500",     ring: "ring-red-200" },
  inactiva:   { label: "Inactiva",   color: "bg-slate-300",   ring: "ring-slate-200" },
};

export default function ReservationsSection() {
  const {
    tables, reservations, addTable, updateTable, deleteTable,
    bulkCreateTables, addReservation, updateReservation, deleteReservation
  } = useDashboard();
  const { showToast } = useToast();

  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [setupCount, setSetupCount] = useState(10);
  const [setupCapacity, setSetupCapacity] = useState(4);
  const [setupZone, setSetupZone] = useState("General");

  // Reservation form
  const [resForm, setResForm] = useState({
    customer_name: "",
    customer_phone: "",
    party_size: 2,
    reservation_date: new Date().toISOString().split("T")[0],
    reservation_time: "19:00",
    duration_minutes: 90,
    table_id: "",
    notes: "",
  });

  // Date navigation
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const todayStr = new Date().toISOString().split("T")[0];

  // Filtered reservations for selected date
  const filteredReservations = useMemo(
    () => reservations.filter(r => r.reservation_date === selectedDate),
    [reservations, selectedDate]
  );

  // Active reservations (not completed/cancelled)
  const activeReservations = useMemo(
    () => reservations.filter(r =>
      r.reservation_date === todayStr &&
      !['completada', 'cancelada', 'no_show'].includes(r.status)
    ),
    [reservations, todayStr]
  );

  // KPIs
  const mesasDisponibles = tables.filter(t => t.status === 'disponible').length;
  const mesasApartadas = tables.filter(t => t.status === 'apartada').length;
  const mesasOcupadas = tables.filter(t => t.status === 'ocupada').length;
  const reservasHoy = filteredReservations.length;

  // Available tables for new reservation
  const availableTables = tables.filter(t =>
    t.status === 'disponible' && t.capacity >= resForm.party_size
  );

  const handleBulkCreate = async () => {
    if (setupCount < 1 || setupCount > 100) {
      showToast("Cantidad de mesas inválida", "error");
      return;
    }
    await bulkCreateTables(setupCount, setupCapacity, setupZone);
    showToast(`${setupCount} mesas creadas correctamente`, "success");
    setShowSetupModal(false);
  };

  const handleCreateReservation = async () => {
    if (!resForm.customer_name || !resForm.customer_phone) {
      showToast("Nombre y teléfono son obligatorios", "error");
      return;
    }
    await addReservation({
      ...resForm,
      table_id: resForm.table_id || null,
      status: "pendiente",
      source: "manual",
    });
    showToast("Reserva creada correctamente", "success");
    setShowReservationModal(false);
    setResForm({
      customer_name: "",
      customer_phone: "",
      party_size: 2,
      reservation_date: selectedDate,
      reservation_time: "19:00",
      duration_minutes: 90,
      table_id: "",
      notes: "",
    });
  };

  const navigateDate = (dir: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + dir);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const formatDateLabel = (dateStr: string) => {
    if (dateStr === todayStr) return "Hoy";
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "short" });
  };

  // ─── If no tables: show setup screen ───
  if (tables.length === 0) {
    return (
      <div className="flex flex-col gap-6 lg:gap-8 w-full max-w-2xl mx-auto">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-black text-foreground">Reservas</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">Configura tus mesas para empezar a gestionar reservaciones.</p>
        </div>

        <div className="bg-white border border-slate-200 p-8 sm:p-12 rounded-2xl sm:rounded-[40px] flex flex-col items-center justify-center text-center gap-6 shadow-sm">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
            <Armchair className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-black text-slate-800">Configura tus Mesas</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md">
              Para gestionar reservaciones necesitas registrar la cantidad de mesas que tiene tu restaurante.
              Podrás asignar capacidad y zona a cada una.
            </p>
          </div>

          <div className="w-full max-w-xs space-y-4 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cantidad de Mesas</label>
              <input
                type="number"
                min={1}
                max={100}
                value={setupCount}
                onChange={e => setSetupCount(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-slate-700 text-center text-lg font-black outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacidad por Mesa (personas)</label>
              <input
                type="number"
                min={1}
                max={20}
                value={setupCapacity}
                onChange={e => setSetupCapacity(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-slate-700 text-center font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zona</label>
              <select
                value={setupZone}
                onChange={e => setSetupZone(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-slate-700 font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="General">General</option>
                <option value="Terraza">Terraza</option>
                <option value="Interior">Interior</option>
                <option value="Bar">Bar</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <button
              onClick={handleBulkCreate}
              className="w-full py-3.5 bg-primary text-white rounded-2xl text-sm font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity mt-2"
            >
              Crear {setupCount} Mesas
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main view with tables ───
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-black text-foreground">Reservas</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">Gestiona mesas y reservaciones de tu restaurante.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowSetupModal(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Armchair className="w-4 h-4" /> Mesas
          </button>
          <button
            onClick={() => {
              setResForm(prev => ({ ...prev, reservation_date: selectedDate }));
              setShowReservationModal(true);
            }}
            className="flex items-center gap-2 bg-primary hover:opacity-90 transition-all px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-xl shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> Nueva Reserva
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 lg:p-5 flex flex-col gap-2 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Armchair className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Disponibles</p>
          <p className="text-2xl font-heading font-black text-emerald-500">{mesasDisponibles}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 lg:p-5 flex flex-col gap-2 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center">
            <Clock className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Apartadas</p>
          <p className="text-2xl font-heading font-black text-yellow-500">{mesasApartadas}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 lg:p-5 flex flex-col gap-2 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
            <Users className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ocupadas</p>
          <p className="text-2xl font-heading font-black text-red-400">{mesasOcupadas}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 lg:p-5 flex flex-col gap-2 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <CalendarCheck className="w-4 h-4 text-primary" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reservas hoy</p>
          <p className="text-2xl font-heading font-black text-primary">{reservasHoy}</p>
        </div>
      </div>

      {/* Table Grid (Visual) */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800">Mapa de Mesas</h3>
          <div className="flex items-center gap-4">
            {Object.entries(TABLE_STATUS_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${cfg.color}`} />
                <span className="text-[10px] font-bold text-slate-400">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
          {tables.map(table => {
            const cfg = TABLE_STATUS_CONFIG[table.status] || TABLE_STATUS_CONFIG.disponible;
            return (
              <button
                key={table.id}
                className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                  table.status === 'disponible'
                    ? "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300"
                    : table.status === 'apartada'
                    ? "border-yellow-200 bg-yellow-50/50 hover:border-yellow-300"
                    : table.status === 'ocupada'
                    ? "border-red-200 bg-red-50/50 hover:border-red-300"
                    : "border-slate-200 bg-slate-50/50 opacity-50"
                }`}
                onClick={() => {
                  if (table.status === 'disponible') {
                    updateTable(table.id, { status: 'ocupada' });
                  } else if (table.status === 'ocupada') {
                    updateTable(table.id, { status: 'disponible' });
                  }
                }}
                title={`${table.table_number} · ${cfg.label} · ${table.capacity} pers.`}
              >
                <div className={`w-3 h-3 rounded-full ${cfg.color} ring-2 ${cfg.ring} mb-1`} />
                <span className="text-[10px] font-black text-slate-600 truncate w-full text-center">
                  {table.table_number.replace("Mesa ", "M")}
                </span>
                <span className="text-[8px] font-bold text-slate-400">{table.capacity}p</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reservations List */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigateDate(-1)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <ChevronLeft className="w-4 h-4 text-slate-500" />
            </button>
            <h3 className="text-sm font-bold text-slate-800 min-w-[120px] text-center">
              {formatDateLabel(selectedDate)}
              {selectedDate !== todayStr && (
                <span className="text-[10px] text-slate-400 block font-medium">{selectedDate}</span>
              )}
            </h3>
            <button onClick={() => navigateDate(1)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          <span className="text-xs font-bold text-slate-400">{filteredReservations.length} reservas</span>
        </div>

        {filteredReservations.length === 0 ? (
          <div className="py-12 text-center text-slate-300 text-sm font-medium flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8" />
            No hay reservas para esta fecha
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReservations.map(res => {
              const statusCfg = STATUS_CONFIG[res.status] || STATUS_CONFIG.pendiente;
              return (
                <div key={res.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-primary/20 transition-colors group">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                      {res.customer_name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 truncate">{res.customer_name}</p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium mt-0.5">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {res.reservation_time?.slice(0, 5)}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {res.party_size} pers.</span>
                        {res.table && <span>· {res.table.table_number}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${statusCfg.bg} ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                    {/* Actions */}
                    {res.status === 'pendiente' && (
                      <button
                        onClick={() => updateReservation(res.id, { status: 'confirmada' })}
                        className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                        title="Confirmar"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {res.status === 'confirmada' && (
                      <button
                        onClick={() => updateReservation(res.id, { status: 'en_mesa' })}
                        className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 transition-colors"
                        title="Sentados"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
                    {res.status === 'en_mesa' && (
                      <button
                        onClick={() => updateReservation(res.id, { status: 'completada' })}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
                        title="Completar"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {!['completada', 'cancelada', 'no_show'].includes(res.status) && (
                      <button
                        onClick={() => updateReservation(res.id, { status: 'cancelada' })}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        title="Cancelar"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══ Manage Tables Modal ═══ */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-800">Gestionar Mesas</h3>
              <button onClick={() => setShowSetupModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Add more tables */}
              <div className="flex items-end gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Agregar mesas</label>
                  <input
                    type="number" min={1} max={50} value={setupCount}
                    onChange={e => setSetupCount(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-sm font-bold outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacidad</label>
                  <input
                    type="number" min={1} max={20} value={setupCapacity}
                    onChange={e => setSetupCapacity(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-sm font-bold outline-none focus:border-primary transition-all"
                  />
                </div>
                <button onClick={handleBulkCreate} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex-shrink-0">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* List */}
              <div className="space-y-2">
                {tables.map(table => (
                  <div key={table.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${TABLE_STATUS_CONFIG[table.status]?.color || 'bg-slate-300'}`} />
                      <span className="text-sm font-bold text-slate-700">{table.table_number}</span>
                      <span className="text-xs text-slate-400">{table.capacity} pers. · {table.zone}</span>
                    </div>
                    <button
                      onClick={() => deleteTable(table.id)}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ New Reservation Modal ═══ */}
      {showReservationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-800">Nueva Reserva</h3>
              <button onClick={() => setShowReservationModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre del Cliente</label>
                  <input
                    type="text"
                    value={resForm.customer_name}
                    onChange={e => setResForm({ ...resForm, customer_name: e.target.value })}
                    placeholder="Juan Pérez"
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono</label>
                  <input
                    type="tel"
                    value={resForm.customer_phone}
                    onChange={e => setResForm({ ...resForm, customer_phone: e.target.value })}
                    placeholder="+57 300 123 4567"
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</label>
                  <input
                    type="date"
                    value={resForm.reservation_date}
                    onChange={e => setResForm({ ...resForm, reservation_date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hora</label>
                  <input
                    type="time"
                    value={resForm.reservation_time}
                    onChange={e => setResForm({ ...resForm, reservation_time: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Personas</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={resForm.party_size}
                    onChange={e => setResForm({ ...resForm, party_size: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm font-bold text-center outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mesa</label>
                  <select
                    value={resForm.table_id}
                    onChange={e => setResForm({ ...resForm, table_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  >
                    <option value="">Sin asignar</option>
                    {availableTables.map(t => (
                      <option key={t.id} value={t.id}>{t.table_number} ({t.capacity}p · {t.zone})</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notas</label>
                  <textarea
                    value={resForm.notes}
                    onChange={e => setResForm({ ...resForm, notes: e.target.value })}
                    placeholder="Cumpleaños, alergias, preferencias..."
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={handleCreateReservation}
                className="w-full py-3.5 bg-primary text-white rounded-2xl text-sm font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
              >
                Crear Reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
