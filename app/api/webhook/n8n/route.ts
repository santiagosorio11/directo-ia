import { NextRequest, NextResponse } from "next/server";
import { getChatHistory, saveChatHistory } from "@/lib/redis";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, message } = await req.json();
    
    if (!sessionId || !message) {
      return NextResponse.json({ error: "Missing sessionId or message" }, { status: 400 });
    }

    console.log(`n8n Webhook received response for session ${sessionId} - Message: ${message.substring(0,20)}...`);

    // 1. Recuperamos el historial de Redis
    const history = await getChatHistory(sessionId);

    // 2. Insertamos la respuesta de la IA
    const updatedHistory = [
      ...history,
      { role: 'assistant', content: message }
    ];
    await saveChatHistory(sessionId, updatedHistory);

    // 3. Disparamos el evento a Pusher
    // El frontend ya está escuchando en successStep
    if (pusherServer) {
        await pusherServer.trigger(`chat-${sessionId}`, 'new-message', { 
            role: 'bot', 
            content: message 
        });
    } else {
        console.warn("Pusher is not configured. Webhook received but cannot broadcast.");
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("n8n Webhook Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
