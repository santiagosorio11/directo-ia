import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ENCRYPTION_KEY = process.env.POS_ENCRYPTION_KEY; // Must be 32 chars length
const ALGORITHM = "aes-256-cbc";

function encrypt(text: string) {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error("Invalid POS_ENCRYPTION_KEY");
  }
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

/* 
function decrypt(text: string) {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error("Invalid POS_ENCRYPTION_KEY");
  }
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift()!, "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
*/

export async function GET(req: NextRequest) {
  try {
    const restaurantId = req.nextUrl.searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json({ error: "restaurantId is required" }, { status: 400 });
    }

    const { data: posData, error } = await supabaseAdmin
      .from("pos_integrations")
      .select("id, provider, is_active, updated_at")
      .eq("restaurant_id", restaurantId);

    if (error) {
      throw error;
    }

    return NextResponse.json(posData || []);
  } catch (error: any) {
    console.error("GET /api/pos Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { restaurantId, provider, apiKey } = await req.json();

    if (!restaurantId || !provider || !apiKey) {
      return NextResponse.json({ error: "Faltan parámetros requeridos" }, { status: 400 });
    }

    const encryptedKey = encrypt(apiKey);

    // Check if configuration already exists for this provider
    const { data: existing } = await supabaseAdmin
      .from("pos_integrations")
      .select("id")
      .eq("restaurant_id", restaurantId)
      .eq("provider", provider)
      .single();

    let result;

    if (existing) {
      // Update
      const { data, error } = await supabaseAdmin
        .from("pos_integrations")
        .update({
          encrypted_api_key: encryptedKey,
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq("id", existing.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Insert
      const { data, error } = await supabaseAdmin
        .from("pos_integrations")
        .insert({
          restaurant_id: restaurantId,
          provider: provider,
          encrypted_api_key: encryptedKey,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ success: true, integration: {
      id: result.id,
      provider: result.provider,
      is_active: result.is_active,
      updated_at: result.updated_at
    }});
  } catch (error: any) {
    console.error("POST /api/pos Error:", error);
    return NextResponse.json({ error: error.message || "Error configurando POS" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, restaurantId } = await req.json();

    if (!id || !restaurantId) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("pos_integrations")
      .delete()
      .eq("id", id)
      .eq("restaurant_id", restaurantId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
