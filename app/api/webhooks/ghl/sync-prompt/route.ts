import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const supabase = await createClient();

    // Optionally Verify auth to prevent unauthorized syncs
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { restaurant_id, ghl_location_id, system_prompt, dynamic_info } = data;

    // Call N8N Webhook for GHL AI Prompt update
    if (process.env.N8N_GHL_PROMPT_UPDATE_WEBHOOK) {
      try {
        await fetch(process.env.N8N_GHL_PROMPT_UPDATE_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
             restaurant_id,
             ghl_location_id,
             system_prompt,
             dynamic_info
          })
        });
        console.log("N8N Sync Webhook executed successfully");
      } catch (err: any) {
        console.error("N8N Sync Error:", err);
      }
    } else {
      console.warn("N8N_GHL_PROMPT_UPDATE_WEBHOOK no definido en variables de entorno.");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Sync Prompt Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
