import { NextRequest, NextResponse } from "next/server";
import { callMasterAgent } from "@/lib/n8n";
import { getChatHistory, saveChatHistory } from "@/lib/redis";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt, sessionId = "default" } = await req.json();
    
    console.log(`Chat API (n8n+Redis): Session ${sessionId}`);
    
    // 1. Recuperamos el historial de Redis
    const history = await getChatHistory(sessionId);
    
    // 2. Extraemos el último mensaje del usuario
    const lastUserMessage = messages[messages.length - 1]?.content;

    // 3. Actualizamos el historial en Redis SOLO con el mensaje del usuario
    const updatedHistory = [
      ...history,
      { role: 'user', content: lastUserMessage }
    ];
    await saveChatHistory(sessionId, updatedHistory);

    // 4. Llamada al Agente Maestro de n8n (Fire and Forget or immediate 200 via webhook config in n8n)
    // No esperamos la respuesta final `agentResponse.output` ya que n8n configurará "Respond immediately".
    callMasterAgent({
      systemPrompt: systemPrompt,
      message: lastUserMessage,
      history: history, // Mandatory context
      sessionId: sessionId // WE MUST SEND THIS SO N8N CAN PASS IT BACK
    }).catch(err => console.error("n8n dispatch error:", err));

    return NextResponse.json({ status: "processing" });

  } catch (error: any) {
    console.error("Chat API n8n/Redis Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
