"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export interface Restaurant {
  id: string;
  business_name: string;
  email: string;
  phone: string;
  address: string;
}

export interface AgentConfig {
  id: string;
  is_active: boolean;
  agent_name: string;
  system_prompt: string;
  dynamic_info: any;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_available: boolean;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  items: any[];
  total: number;
  pipeline_stage: string;
  payment_status: string;
  created_at: string;
}

export interface WhatsAppConfig {
  id: string;
  is_connected: boolean;
  phone_number: string;
  qr_code_url?: string;
}

export interface RestaurantTable {
  id: string;
  table_number: string;
  capacity: number;
  status: 'disponible' | 'apartada' | 'ocupada' | 'inactiva';
  zone: string;
  created_at: string;
}

export interface Reservation {
  id: string;
  table_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  duration_minutes: number;
  status: 'pendiente' | 'confirmada' | 'en_mesa' | 'completada' | 'cancelada' | 'no_show';
  notes?: string;
  source: string;
  created_at: string;
  updated_at: string;
  // Joined data
  table?: RestaurantTable;
}

export interface Promotion {
  id: string;
  title: string;
  description?: string;
  discount_type?: string;
  discount_value?: number;
  applies_to: string[];
  status: 'activa' | 'pausada' | 'borrador' | 'expirada';
  start_date?: string;
  end_date?: string;
  created_at: string;
}

interface DashboardContextProps {
  restaurant: Restaurant | null;
  agentConfig: AgentConfig | null;
  menu: MenuItem[];
  orders: Order[];
  whatsappConfig: WhatsAppConfig | null;
  tables: RestaurantTable[];
  reservations: Reservation[];
  promotions: Promotion[];
  refreshData: () => Promise<void>;
  updateAgentStatus: (isActive: boolean) => Promise<void>;
  updateDynamicInfo: (info: any) => Promise<void>;
  updatePrompt: (newPrompt: string, reason?: string) => Promise<void>;
  improvePrompt: (notes: string) => Promise<void>;
  addMenuItem: (item: Partial<MenuItem>) => Promise<void>;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  // Tables
  addTable: (table: Partial<RestaurantTable>) => Promise<void>;
  updateTable: (id: string, updates: Partial<RestaurantTable>) => Promise<void>;
  deleteTable: (id: string) => Promise<void>;
  bulkCreateTables: (count: number, capacity: number, zone: string) => Promise<void>;
  // Reservations
  addReservation: (reservation: Partial<Reservation>) => Promise<void>;
  updateReservation: (id: string, updates: Partial<Reservation>) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
  // Promotions
  addPromotion: (promo: Partial<Promotion>) => Promise<void>;
  updatePromotion: (id: string, updates: Partial<Promotion>) => Promise<void>;
  deletePromotion: (id: string) => Promise<void>;
  // Orders
  updateOrderStage: (id: string, stage: string) => Promise<void>;
  // Restaurant
  updateRestaurant: (updates: Partial<Restaurant>) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [agentConfig, setAgentConfig] = useState<AgentConfig | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig | null>(null);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabaseBrowser = createClient();

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      let restRes = await supabaseBrowser.from("restaurants").select("*").eq("user_id", user.id).maybeSingle();
      
      if (!restRes.data && user.email) {
        // Fallback: try by email if user_id is not set yet
        restRes = await supabaseBrowser.from("restaurants").select("*").eq("email", user.email).maybeSingle();
        
        // If found by email, update it with the user_id for future faster lookups
        if (restRes.data) {
          await supabaseBrowser.from("restaurants").update({ user_id: user.id }).eq("id", restRes.data.id);
        }
      }

      if (!restRes.data) {
         // User truly has no restaurant or different email, redirect to onboarding 
         router.push("/onboarding");
         return;
      }

      const restaurantId = restRes.data.id;

      const [agentRes, menuRes, ordersRes, waRes, tablesRes, reservationsRes, promotionsRes] = await Promise.all([
        supabaseBrowser.from("agent_config").select("*").eq("restaurant_id", restaurantId).single(),
        supabaseBrowser.from("menu_items").select("*").eq("restaurant_id", restaurantId).order("sort_order"),
        supabaseBrowser.from("orders").select("*").eq("restaurant_id", restaurantId).order("created_at", { ascending: false }),
        supabaseBrowser.from("whatsapp_config").select("*").eq("restaurant_id", restaurantId).maybeSingle(),
        supabaseBrowser.from("restaurant_tables").select("*").eq("restaurant_id", restaurantId).order("table_number"),
        supabaseBrowser.from("reservations").select("*, table:restaurant_tables(*)").eq("restaurant_id", restaurantId).order("reservation_date", { ascending: true }),
        supabaseBrowser.from("promotions").select("*").eq("restaurant_id", restaurantId).order("created_at", { ascending: false }),
      ]);

      setRestaurant(restRes.data);
      if (agentRes.data) setAgentConfig(agentRes.data);
      if (menuRes.data) setMenu(menuRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
      if (waRes.data) setWhatsappConfig(waRes.data);
      if (tablesRes.data) setTables(tablesRes.data);
      if (reservationsRes.data) setReservations(reservationsRes.data);
      if (promotionsRes.data) setPromotions(promotionsRes.data);
    } catch (e) {
      console.error("Error loading dashboard data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const syncWithGHL = async (prompt: string, info: any) => {
    if (!restaurant) return;
    try {
      await fetch('/api/webhooks/ghl/sync-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_id: restaurant.id,
          ghl_location_id: (restaurant as any).ghl_location_id,
          system_prompt: prompt,
          dynamic_info: info
        })
      });
    } catch (error) {
      console.error("Failed to sync prompt to GHL", error);
    }
  };

  const updateAgentStatus = async (isActive: boolean) => {
    if (!agentConfig) return;
    const { error } = await supabaseBrowser.from("agent_config").update({ is_active: isActive }).eq("id", agentConfig.id);
    if (!error) setAgentConfig({ ...agentConfig, is_active: isActive });
  };

  const updateDynamicInfo = async (info: any) => {
    if (!agentConfig) return;
    const { error } = await supabaseBrowser.from("agent_config").update({ dynamic_info: info }).eq("id", agentConfig.id);
    if (!error) {
      setAgentConfig({ ...agentConfig, dynamic_info: info });
      await syncWithGHL(agentConfig.system_prompt, info);
    }
  };

  const updatePrompt = async (newPrompt: string, reason = "edit") => {
    if (!agentConfig || !restaurant) return;
    
    // Update config
    await supabaseBrowser.from("agent_config").update({ system_prompt: newPrompt }).eq("id", agentConfig.id);
    setAgentConfig({ ...agentConfig, system_prompt: newPrompt });
    
    // Create history
    await supabaseBrowser.from("prompt_history").insert({
      restaurant_id: restaurant.id,
      prompt_text: newPrompt,
      dynamic_info: agentConfig.dynamic_info,
      source: reason
    });

    await syncWithGHL(newPrompt, agentConfig.dynamic_info);
  };

  const improvePrompt = async (notes: string) => {
    if (!agentConfig || !restaurant) return;
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...restaurant,
          currentPrompt: agentConfig.system_prompt,
          trainingNotes: notes,
          menu: menu, // Include menu for context
        }),
      });
      
      const result = await res.json();
      
      if (result.generatedPrompt) {
        await updatePrompt(result.generatedPrompt, "training_improvement");
      } else {
        throw new Error(result.error || "No se pudo mejorar el prompt.");
      }
    } catch (error) {
      console.error("Improve Prompt Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Menu CRUD ───
  const addMenuItem = async (item: Partial<MenuItem>) => {
    if (!restaurant) return;
    const { data: newItem, error } = await supabaseBrowser.from("menu_items").insert({
      ...item,
      restaurant_id: restaurant.id
    }).select().single();
    
    if (!error && newItem) {
      setMenu(prev => [...prev, newItem]);
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    const { error } = await supabaseBrowser.from("menu_items").update(updates).eq("id", id);
    if (!error) {
      setMenu(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    }
  };

  const deleteMenuItem = async (id: string) => {
    const { error } = await supabaseBrowser.from("menu_items").delete().eq("id", id);
    if (!error) {
      setMenu(prev => prev.filter(item => item.id !== id));
    }
  };

  // ─── Tables CRUD ───
  const addTable = async (table: Partial<RestaurantTable>) => {
    if (!restaurant) return;
    const { data, error } = await supabaseBrowser.from("restaurant_tables").insert({
      ...table,
      restaurant_id: restaurant.id,
    }).select().single();
    if (!error && data) {
      setTables(prev => [...prev, data]);
    }
  };

  const updateTable = async (id: string, updates: Partial<RestaurantTable>) => {
    const { error } = await supabaseBrowser.from("restaurant_tables").update(updates).eq("id", id);
    if (!error) {
      setTables(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    }
  };

  const deleteTable = async (id: string) => {
    const { error } = await supabaseBrowser.from("restaurant_tables").delete().eq("id", id);
    if (!error) {
      setTables(prev => prev.filter(t => t.id !== id));
    }
  };

  const bulkCreateTables = async (count: number, capacity: number, zone: string) => {
    if (!restaurant) return;
    const existingCount = tables.length;
    const newTables = Array.from({ length: count }, (_, i) => ({
      restaurant_id: restaurant.id,
      table_number: `Mesa ${existingCount + i + 1}`,
      capacity,
      status: 'disponible' as const,
      zone,
    }));
    const { data, error } = await supabaseBrowser.from("restaurant_tables").insert(newTables).select();
    if (!error && data) {
      setTables(prev => [...prev, ...data]);
    }
  };

  // ─── Reservations CRUD ───
  const addReservation = async (reservation: Partial<Reservation>) => {
    if (!restaurant) return;
    const { data, error } = await supabaseBrowser.from("reservations").insert({
      ...reservation,
      restaurant_id: restaurant.id,
    }).select("*, table:restaurant_tables(*)").single();
    if (!error && data) {
      setReservations(prev => [...prev, data]);
      // If table assigned, mark as "apartada"
      if (reservation.table_id) {
        await updateTable(reservation.table_id, { status: 'apartada' });
      }
    }
  };

  const updateReservation = async (id: string, updates: Partial<Reservation>) => {
    const { error } = await supabaseBrowser.from("reservations").update({
      ...updates,
      updated_at: new Date().toISOString(),
    }).eq("id", id);
    if (!error) {
      setReservations(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
      // Handle table status changes
      const reservation = reservations.find(r => r.id === id);
      if (reservation?.table_id) {
        if (updates.status === 'completada' || updates.status === 'cancelada' || updates.status === 'no_show') {
          await updateTable(reservation.table_id, { status: 'disponible' });
        } else if (updates.status === 'en_mesa') {
          await updateTable(reservation.table_id, { status: 'ocupada' });
        } else if (updates.status === 'confirmada') {
          await updateTable(reservation.table_id, { status: 'apartada' });
        }
      }
    }
  };

  const deleteReservation = async (id: string) => {
    const reservation = reservations.find(r => r.id === id);
    const { error } = await supabaseBrowser.from("reservations").delete().eq("id", id);
    if (!error) {
      setReservations(prev => prev.filter(r => r.id !== id));
      if (reservation?.table_id) {
        await updateTable(reservation.table_id, { status: 'disponible' });
      }
    }
  };

  // ─── Promotions CRUD ───
  const addPromotion = async (promo: Partial<Promotion>) => {
    if (!restaurant) return;
    const { data, error } = await supabaseBrowser.from("promotions").insert({
      ...promo,
      restaurant_id: restaurant.id,
    }).select().single();
    if (!error && data) {
      setPromotions(prev => [data, ...prev]);
    }
  };

  const updatePromotion = async (id: string, updates: Partial<Promotion>) => {
    const { error } = await supabaseBrowser.from("promotions").update(updates).eq("id", id);
    if (!error) {
      setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }
  };

  const deletePromotion = async (id: string) => {
    const { error } = await supabaseBrowser.from("promotions").delete().eq("id", id);
    if (!error) {
      setPromotions(prev => prev.filter(p => p.id !== id));
    }
  };

  // ─── Orders ───
  const updateOrderStage = async (id: string, stage: string) => {
    const { error } = await supabaseBrowser.from("orders").update({ pipeline_stage: stage }).eq("id", id);
    if (!error) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, pipeline_stage: stage } : o));
    }
  };

  // ─── Restaurant ───
  const updateRestaurant = async (updates: Partial<Restaurant>) => {
    if (!restaurant) return;
    const { error } = await supabaseBrowser.from("restaurants").update(updates).eq("id", restaurant.id);
    if (!error) {
      setRestaurant({ ...restaurant, ...updates });
    }
  };

  const logout = async () => {
    await supabaseBrowser.auth.signOut();
    router.push("/login"); // or root
  };

  return (
    <DashboardContext.Provider value={{
      restaurant,
      agentConfig,
      menu,
      orders,
      whatsappConfig,
      tables,
      reservations,
      promotions,
      refreshData: fetchDashboardData,
      updateAgentStatus,
      updateDynamicInfo,
      updatePrompt,
      improvePrompt,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      addTable,
      updateTable,
      deleteTable,
      bulkCreateTables,
      addReservation,
      updateReservation,
      deleteReservation,
      addPromotion,
      updatePromotion,
      deletePromotion,
      updateOrderStage,
      updateRestaurant,
      logout,
      isLoading
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
