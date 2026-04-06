import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // 1. Crear el restaurante
    const { data: restaurant, error: restError } = await supabase
      .from("restaurants")
      .insert({
        business_name: data.businessName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        food_type: data.foodType,
        schedule: data.schedule,
        business_description: data.businessDescription,
      })
      .select()
      .single();

    if (restError) throw restError;

    // 2. Crear la config del agente
    const { error: agentError } = await supabase
      .from("agent_config")
      .insert({
        restaurant_id: restaurant.id,
        is_active: true,
        agent_name: data.agentName,
        system_prompt: data.generatedSystemPrompt,
        tone: data.tone,
        prep_time: data.prepTime,
        payment_methods: data.paymentMethods,
        objectives: data.objectives,
        star_product: data.starProduct,
        cross_selling: data.crossSelling,
        dish_policies: data.dishPolicies,
        dynamic_info: {},
      });

    if (agentError) throw agentError;

    // 3. Guardar el prompt inicial en el historial
    await supabase.from("prompt_history").insert({
      restaurant_id: restaurant.id,
      prompt_text: data.generatedSystemPrompt,
      source: "onboarding",
    });

    // 4. Insertar los productos del menú (del OCR)
    if (data.menuProducts && data.menuProducts.length > 0) {
      const menuRows = data.menuProducts.map((p: any, idx: number) => ({
        restaurant_id: restaurant.id,
        name: p.name || p.nombre || `Producto ${idx + 1}`,
        description: p.description || p.descripcion || "",
        price: parseFloat(p.price || p.precio || "0"),
        category: p.category || p.categoria || "General",
        is_available: true,
        sort_order: idx,
      }));

      const { error: menuError } = await supabase
        .from("menu_items")
        .insert(menuRows);

      if (menuError) console.error("Menu insert error:", menuError);
    }

    // 5. Crear config inicial de WhatsApp
    await supabase.from("whatsapp_config").insert({
      restaurant_id: restaurant.id,
      is_connected: false,
    });

    return NextResponse.json({
      success: true,
      restaurantId: restaurant.id,
    });
  } catch (error: any) {
    console.error("Activate error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
