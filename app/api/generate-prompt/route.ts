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
    const item = Array.isArray(response) ? response[0] : response;
    
    // Lista de posibles llaves donde n8n entrega el prompt
    masterPrompt = item?.generatedPrompt || 
                   item?.prompt || 
                   item?.system_prompt || 
                   item?.text || 
                   (typeof item === 'string' ? item : null);

    // Limpieza de bloques de código markdown si existen
    if (masterPrompt && typeof masterPrompt === "string") {
      masterPrompt = masterPrompt.trim();
      // Si empieza con ``` y termina con ``` lo limpiamos
      if (masterPrompt.startsWith("```")) {
        masterPrompt = masterPrompt
          .replace(/^```[\w]*\n?/, "")
          .replace(/\n?```$/, "")
          .trim();
      }
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
