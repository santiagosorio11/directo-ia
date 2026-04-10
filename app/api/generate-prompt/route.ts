import { NextRequest, NextResponse } from "next/server";
import { generateMasterPrompt } from "@/lib/n8n";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("Generate Prompt API received keys:", Object.keys(data));
    
    const N8N_PROMPT_GEN_URL = process.env.N8N_PROMPT_GEN_URL;
    if (!N8N_PROMPT_GEN_URL) {
      console.error("CRITICAL: N8N_PROMPT_GEN_URL is not defined in environment variables!");
      return NextResponse.json({ error: "Servidor mal configurado: Falta URL de n8n." }, { status: 500 });
    }

    console.log("Generate Prompt API (n8n): Creando cerebro del agente...");

    const response = await generateMasterPrompt(data);
    
    // Normalizamos la respuesta de n8n para ser más robustos en producción
    let masterPrompt = null;
    if (Array.isArray(response)) {
      masterPrompt = response[0]?.generatedPrompt || response[0]?.prompt || response[0]?.system_prompt || response[0];
    } else {
      masterPrompt = response?.generatedPrompt || response?.prompt || response?.system_prompt || response;
    }

    if (!masterPrompt || typeof masterPrompt !== "string") {
      console.error("n8n response is invalid or empty:", response);
      return NextResponse.json({ 
        error: "n8n no generó un prompt válido.", 
        details: typeof response === 'object' ? JSON.stringify(response) : String(response) 
      }, { status: 500 });
    }

    return NextResponse.json({ generatedPrompt: masterPrompt });

  } catch (error: any) {
    console.error("Generate Prompt Route Error:", error.message, error.stack);
    return NextResponse.json({ error: `Error en servidor: ${error.message}` }, { status: 500 });
  }
}
