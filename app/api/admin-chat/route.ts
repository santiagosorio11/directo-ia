import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { message, restaurantId, sessionId } = await req.json();

    if (!message || !restaurantId) {
      return NextResponse.json(
        { error: "Los campos 'message' y 'restaurantId' son requeridos." },
        { status: 400 }
      );
    }

    const N8N_ADMIN_AGENT_URL = process.env.N8N_ADMIN_AGENT_URL;

    if (!N8N_ADMIN_AGENT_URL) {
      return NextResponse.json(
        { error: "N8N_ADMIN_AGENT_URL no está configurada." },
        { status: 501 }
      );
    }

    // Save user message to history
    await supabaseAdmin.from("admin_chat_history").insert({
      restaurant_id: restaurantId,
      role: "user",
      content: message,
    });

    // Fetch restaurant context to enrich the request
    const [restaurantRes, agentRes, menuRes, ordersRes] = await Promise.all([
      supabaseAdmin.from("restaurants").select("*").eq("id", restaurantId).single(),
      supabaseAdmin.from("agent_config").select("*").eq("restaurant_id", restaurantId).single(),
      supabaseAdmin.from("menu_items").select("name,price,category,is_available").eq("restaurant_id", restaurantId),
      supabaseAdmin
        .from("orders")
        .select("total,items,pipeline_stage,payment_status,created_at")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    // Build context payload for n8n
    const context = {
      restaurant: restaurantRes.data,
      agentConfig: agentRes.data
        ? {
            is_active: agentRes.data.is_active,
            agent_name: agentRes.data.agent_name,
            tone: agentRes.data.tone,
            dynamic_info: agentRes.data.dynamic_info,
          }
        : null,
      menuSummary: {
        total_items: menuRes.data?.length || 0,
        available: menuRes.data?.filter((i: any) => i.is_available).length || 0,
        categories: [...new Set(menuRes.data?.map((i: any) => i.category) || [])],
      },
      recentOrders: {
        count: ordersRes.data?.length || 0,
        totalRevenue: ordersRes.data?.reduce((s: number, o: any) => s + (Number(o.total) || 0), 0) || 0,
      },
    };

    // Call n8n Admin Agent
    const response = await fetch(N8N_ADMIN_AGENT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        sessionId: sessionId || `admin-${restaurantId}`,
        context,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`n8n Admin Agent error (${response.status}):`, errText);
      return NextResponse.json(
        { error: `Error del agente admin: ${response.statusText}` },
        { status: 502 }
      );
    }

    const result = await response.json();
    const replyText =
      result.output || result.message || result.text || result.reply || (typeof result === "string" ? result : JSON.stringify(result));

    // Save assistant response to history
    await supabaseAdmin.from("admin_chat_history").insert({
      restaurant_id: restaurantId,
      role: "assistant",
      content: replyText,
      metadata: { source: "n8n_admin_agent" },
    });

    return NextResponse.json({ message: replyText });
  } catch (error: any) {
    console.error("Admin Chat API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
