import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const supabase = await createClient();
    
    // Check Authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Crear o Actualizar el restaurante
    // Buscamos primero por user_id, y si no existe, por email (para vincular cuentas viejas)
    let { data: restaurantRecord } = await supabase
      .from("restaurants")
      .select("id, user_id, email")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!restaurantRecord && data.email) {
      const { data: byEmail } = await supabase
        .from("restaurants")
        .select("id, user_id, email")
        .eq("email", data.email)
        .maybeSingle();
      
      if (byEmail) {
        restaurantRecord = byEmail;
      }
    }

    let restaurant;
    
    if (restaurantRecord) {
      const { data: updated, error } = await supabase
        .from("restaurants")
        .update({
          user_id: user.id, // Aseguramos el vínculo
          business_name: data.businessName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          food_type: data.foodType,
          schedule: data.schedule,
          business_description: data.businessDescription,
          updated_at: new Date().toISOString()
        })
        .eq("id", restaurantRecord.id)
        .select()
        .single();
      if (error) throw error;
      restaurant = updated;

      // Limpiamos params viejos para evitar duplicados en tablas dependientes
      await supabase.from("agent_config").delete().eq("restaurant_id", restaurant.id);
      await supabase.from("menu_items").delete().eq("restaurant_id", restaurant.id);
      await supabase.from("whatsapp_config").delete().eq("restaurant_id", restaurant.id);
    } else {
      const { data: inserted, error: restError } = await supabase
        .from("restaurants")
        .insert({
          user_id: user.id,
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
      restaurant = inserted;
    }

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
      dynamic_info: {},
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

    // 6. Integración N8N (Crear Subcuenta GHL)
    // Send background task or fetch but don't wait aggressively if it takes too long.
    if (process.env.N8N_GHL_SUBCUENTA_WEBHOOK) {
      try {
        // Enviar la informacion necesaria para que n8n cree la subcuenta de GHL
        await fetch(process.env.N8N_GHL_SUBCUENTA_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
             restaurant_id: restaurant.id,
             business_name: data.businessName,
             email: data.email,
             phone: data.phone,
             address: data.address
          })
        });
        console.log("Webhook N8N enviado para crear subcuenta GHL");
      } catch (err) {
         console.error("Error triggerizando subcuenta n8n", err);
      }
    }

    return NextResponse.json({
      success: true,
      restaurantId: restaurant.id,
    });
  } catch (error: any) {
    console.error("Activate error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
