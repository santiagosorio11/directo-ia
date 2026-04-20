import { NextRequest, NextResponse } from "next/server";
import { callMasterAgent } from "@/lib/n8n";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/chat
 * Recibe un mensaje del sandbox de pruebas y lo envía al Agente Maestro de n8n.
 * n8n maneja el historial de conversación internamente por sessionId.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, systemPrompt, sessionId = "default" } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "El campo 'message' es requerido." }, { status: 400 });
    }

    console.log(`Chat API: Session ${sessionId} — "${message.substring(0, 50)}..."`);

    const agentResponse = await callMasterAgent({
      systemPrompt,
      message,
      sessionId,
    });

    const replyText = agentResponse.output || agentResponse.message || agentResponse;

    return NextResponse.json({ message: replyText });

  } catch (error: any) {
    console.error("Chat API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
