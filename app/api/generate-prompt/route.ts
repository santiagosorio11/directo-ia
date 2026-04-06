import { NextRequest, NextResponse } from "next/server";
import { generateMasterPrompt } from "@/lib/n8n";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("Generate Prompt API (n8n): Creando cerebro del agente...");

    // Enviamos toda la data estructurada a n8n
    const masterPrompt = await generateMasterPrompt(data);

    if (!masterPrompt) {
      throw new Error("n8n no generó ningún prompt maestro.");
    }

    return NextResponse.json({ generatedPrompt: masterPrompt });

  } catch (error: any) {
    console.error("Generate Prompt n8n Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
