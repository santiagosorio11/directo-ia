import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ENCRYPTION_KEY = process.env.POS_ENCRYPTION_KEY; 
const ALGORITHM = "aes-256-cbc";

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

/**
 * Este endpoint es de uso EXCLUSIVO para el Agente N8N.
 * Recibe un API Key maestro en los Headers (para seguridad) y devuelve las 
 * llaves POS desencriptadas listas para usarse.
 */
export async function GET(req: NextRequest) {
  try {
    const restaurantId = req.nextUrl.searchParams.get("restaurantId");
    
    // Check internal auth (Ej. Bearer Token)
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!restaurantId) {
      return NextResponse.json({ error: "restaurantId is required" }, { status: 400 });
    }

    const { data: posData, error } = await supabaseAdmin
      .from("pos_integrations")
      .select("id, provider, encrypted_api_key, is_active")
      .eq("restaurant_id", restaurantId)
      .eq("is_active", true);

    if (error) {
      throw error;
    }

    if (!posData || posData.length === 0) {
      return NextResponse.json([]);
    }

    // Map and decrypt
    const plainKeys = posData.map(pos => ({
       id: pos.id,
       provider: pos.provider,
       api_key: decrypt(pos.encrypted_api_key)
    }));

    return NextResponse.json(plainKeys);
  } catch (error: any) {
    console.error("GET /api/pos/decrypt Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
