import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Server-side (para enviar desde la API si es necesario, o Webhooks)
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2",
  useTLS: true
});

// Client-side (para suscribirse en Real-time Chat)
export const getPusherClient = () => {
  return new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY || "", {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2",
  });
};

export async function triggerEvent(channel: string, event: string, data: any) {
  try {
    await pusherServer.trigger(channel, event, data);
  } catch (e) {
    console.error("Pusher trigger error:", e);
  }
}
