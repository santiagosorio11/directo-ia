import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { saveChatHistory, getChatHistory } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { sessionId, role, content, action } = data;

    if (!sessionId || !content) {
      return NextResponse.json({ error: "Missing sessionId or content" }, { status: 400 });
    }

    console.log(`Webhook received for session ${sessionId}: ${content.substring(0, 50)}...`);

    // 1. Notificar al frontend vía Pusher
    await pusherServer.trigger(`chat-${sessionId}`, 'new-message', {
      role: role || 'bot',
      content: content
    });

    // 2. Opcional: Actualizar Redis si n8n no lo hizo directamente
    const history = await getChatHistory(sessionId);
    const updatedHistory = [...history, { role: role || 'bot', content }];
    await saveChatHistory(sessionId, updatedHistory);

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
