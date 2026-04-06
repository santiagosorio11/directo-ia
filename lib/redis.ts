import { Redis } from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Fallback en memoria por si el usuario no tiene Redis corriendo en local
const memoryFallback = new Map<string, any>();
let redis: Redis | null = null;
let useFallback = false;

try {
  redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false, // ¡Critico! Si no conecto, NO encoles los comandos (sino se queda cargando infinito)
    retryStrategy: () => null
  });
  
  redis.on('error', (e) => {
    console.warn("💡 No se detectó Redis corriendo (o falló). Usando memoria temporal para tu entorno de pruebas local. Error: ", e.message);
    useFallback = true;
  });
} catch (e) {
  useFallback = true;
}

export async function getChatHistory(sessionId: string) {
  if (useFallback || !redis) {
    return memoryFallback.get(`chat:${sessionId}:history`) || [];
  }
  try {
    const history = await redis.get(`chat:${sessionId}:history`);
    return history ? JSON.parse(history) : [];
  } catch(e) {
    return memoryFallback.get(`chat:${sessionId}:history`) || [];
  }
}

export async function saveChatHistory(sessionId: string, history: any[]) {
  if (useFallback || !redis) {
    memoryFallback.set(`chat:${sessionId}:history`, history);
    return;
  }
  try {
    await redis.set(`chat:${sessionId}:history`, JSON.stringify(history), 'EX', 86400);
  } catch(e) {
    memoryFallback.set(`chat:${sessionId}:history`, history);
  }
}

export async function getMasterPrompt(sessionId: string) {
  if (useFallback || !redis) return memoryFallback.get(`chat:${sessionId}:masterPrompt`);
  try {
    return await redis.get(`chat:${sessionId}:masterPrompt`);
  } catch(e) { return null; }
}

export async function saveMasterPrompt(sessionId: string, prompt: string) {
  if (useFallback || !redis) {
    memoryFallback.set(`chat:${sessionId}:masterPrompt`, prompt);
    return;
  }
  try {
    await redis.set(`chat:${sessionId}:masterPrompt`, prompt, 'EX', 86400);
  } catch(e) {}
}

export default redis;
