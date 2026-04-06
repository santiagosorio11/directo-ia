import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'; // El usuario configurará su VPS

let redis: Redis;

try {
  redis = new Redis(REDIS_URL);
} catch (e) {
  console.error("Redis connection error:", e);
  // Fallback for dev if needed
}

export async function getChatHistory(sessionId: string) {
  if (!redis) return [];
  const history = await redis.get(`chat:${sessionId}:history`);
  return history ? JSON.parse(history) : [];
}

export async function saveChatHistory(sessionId: string, history: any[]) {
  if (!redis) return;
  // Expira en 24 horas por defecto para chats temporales
  await redis.set(`chat:${sessionId}:history`, JSON.stringify(history), 'EX', 86400);
}

export async function getMasterPrompt(sessionId: string) {
  if (!redis) return null;
  return await redis.get(`chat:${sessionId}:masterPrompt`);
}

export async function saveMasterPrompt(sessionId: string, prompt: string) {
  if (!redis) return;
  await redis.set(`chat:${sessionId}:masterPrompt`, prompt, 'EX', 86400);
}

export default redis!;
