"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
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

interface DashboardContextProps {
  restaurant: Restaurant | null;
  agentConfig: AgentConfig | null;
  menu: MenuItem[];
  orders: Order[];
  whatsappConfig: WhatsAppConfig | null;
  refreshData: () => Promise<void>;
  updateAgentStatus: (isActive: boolean) => Promise<void>;
  updateDynamicInfo: (info: any) => Promise<void>;
  updatePrompt: (newPrompt: string, reason?: string) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const restaurantId = localStorage.getItem("directo_restaurant_id");
      if (!restaurantId) {
        router.push("/");
        return;
      }

      const [restRes, agentRes, menuRes, ordersRes, waRes] = await Promise.all([
        supabase.from("restaurants").select("*").eq("id", restaurantId).single(),
        supabase.from("agent_config").select("*").eq("restaurant_id", restaurantId).single(),
        supabase.from("menu_items").select("*").eq("restaurant_id", restaurantId).order("sort_order"),
        supabase.from("orders").select("*").eq("restaurant_id", restaurantId).order("created_at", { ascending: false }),
        supabase.from("whatsapp_config").select("*").eq("restaurant_id", restaurantId).maybeSingle()
      ]);

      if (restRes.data) setRestaurant(restRes.data);
      if (agentRes.data) setAgentConfig(agentRes.data);
      if (menuRes.data) setMenu(menuRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
      if (waRes.data) setWhatsappConfig(waRes.data);
    } catch (e) {
      console.error("Error loading dashboard data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const updateAgentStatus = async (isActive: boolean) => {
    if (!agentConfig) return;
    const { error } = await supabase.from("agent_config").update({ is_active: isActive }).eq("id", agentConfig.id);
    if (!error) setAgentConfig({ ...agentConfig, is_active: isActive });
  };

  const updateDynamicInfo = async (info: any) => {
    if (!agentConfig) return;
    const { error } = await supabase.from("agent_config").update({ dynamic_info: info }).eq("id", agentConfig.id);
    if (!error) setAgentConfig({ ...agentConfig, dynamic_info: info });
  };

  const updatePrompt = async (newPrompt: string, reason = "edit") => {
    if (!agentConfig || !restaurant) return;
    
    // Update config
    await supabase.from("agent_config").update({ system_prompt: newPrompt }).eq("id", agentConfig.id);
    setAgentConfig({ ...agentConfig, system_prompt: newPrompt });
    
    // Create history
    await supabase.from("prompt_history").insert({
      restaurant_id: restaurant.id,
      prompt_text: newPrompt,
      source: reason
    });
  };

  const logout = () => {
    localStorage.removeItem("directo_restaurant_id");
    router.push("/");
  };

  return (
    <DashboardContext.Provider value={{
      restaurant,
      agentConfig,
      menu,
      orders,
      whatsappConfig,
      refreshData: fetchDashboardData,
      updateAgentStatus,
      updateDynamicInfo,
      updatePrompt,
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
