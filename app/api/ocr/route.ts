import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy para el OCR de n8n.
 * Esto evita errores de CORS al permitir que la petición se haga desde el servidor.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se ha proporcionado ningún archivo" }, { status: 400 });
    }

    const ocrUrl = process.env.N8N_OCR_MENU_URL;

    if (!ocrUrl) {
      return NextResponse.json({ error: "N8N_OCR_MENU_URL no está configurada" }, { status: 500 });
    }

    console.log(`Proxificando OCR a n8n: ${ocrUrl}`);

    const n8nFormData = new FormData();
    n8nFormData.append("file", file);

    const response = await fetch(ocrUrl, {
      method: "POST",
      body: n8nFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ERROR n8n (${response.status}):`, errorText);
      return NextResponse.json({ 
        error: "Error en el flujo de n8n", 
        status: response.status,
        details: errorText 
      }, { status: response.status });
    }

    const data = await response.json();
    
    // n8n responde lo que el flujo devuelva.
    // Retornamos el JSON directamente al cliente.
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Proxy OCR Error:", error.message);
    return NextResponse.json(
      { error: "Error en el servidor al procesar el menú", details: error.message },
      { status: 500 }
    );
  }
}
