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

    // 3. Llamada al Agente Maestro de n8n
    const agentResponse = await callMasterAgent({
      systemPrompt: systemPrompt,
      message: lastUserMessage,
      history: history
    });

    const replyText = agentResponse.output || agentResponse.message || agentResponse;

    // 4. Actualizamos el historial en Redis
    const updatedHistory = [
      ...history,
      { role: 'user', content: lastUserMessage },
      { role: 'assistant', content: replyText }
    ];
    await saveChatHistory(sessionId, updatedHistory);

    // 5. Opcional: Trigger Pusher para Live Chat si fuera necesario fuera del stream
    // await pusherServer.trigger(`chat-${sessionId}`, 'new-message', { text: replyText });

    return NextResponse.json({ message: replyText });

  } catch (error: any) {
    console.error("Chat API n8n/Redis Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
