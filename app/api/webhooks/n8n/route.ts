import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/webhooks/n8n
 * Endpoint de callback para n8n.
 * n8n envía aquí notificaciones o resultados de procesos asíncronos.
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { sessionId, message, action } = data;

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    console.log(`n8n Webhook: session=${sessionId}, action=${action || "message"}`);

    // n8n maneja el historial internamente.
    // Este endpoint se usa para callbacks asíncronos de n8n
    // (ej: notificaciones, actualizaciones de estado, etc.)

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("n8n Webhook Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
