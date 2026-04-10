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
  improvePrompt: (notes: string) => Promise<void>;
  addMenuItem: (item: Partial<MenuItem>) => Promise<void>;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
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

      const [agentRes, menuRes, ordersRes, waRes] = await Promise.all([
        supabaseBrowser.from("agent_config").select("*").eq("restaurant_id", restaurantId).single(),
        supabaseBrowser.from("menu_items").select("*").eq("restaurant_id", restaurantId).order("sort_order"),
        supabaseBrowser.from("orders").select("*").eq("restaurant_id", restaurantId).order("created_at", { ascending: false }),
        supabaseBrowser.from("whatsapp_config").select("*").eq("restaurant_id", restaurantId).maybeSingle()
      ]);

      setRestaurant(restRes.data);
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
      refreshData: fetchDashboardData,
      updateAgentStatus,
      updateDynamicInfo,
      updatePrompt,
      improvePrompt,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
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
