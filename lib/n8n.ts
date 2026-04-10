const N8N_PROMPT_GEN_URL = process.env.N8N_PROMPT_GEN_URL;
const N8N_MASTER_AGENT_URL = process.env.N8N_MASTER_AGENT_URL;

if (!N8N_PROMPT_GEN_URL) {
  console.warn("⚠️ N8N_PROMPT_GEN_URL no está definida en las variables de entorno.");
}
if (!N8N_MASTER_AGENT_URL) {
  console.warn("⚠️ N8N_MASTER_AGENT_URL no está definida en las variables de entorno.");
}

/**
 * Genera el System Prompt maestro del agente enviando toda la data
 * del restaurante a un flujo de n8n especializado.
 */
export async function generateMasterPrompt(restaurantData: any) {
  if (!N8N_PROMPT_GEN_URL) {
    throw new Error("N8N_PROMPT_GEN_URL no está configurada.");
  }

  const response = await fetch(N8N_PROMPT_GEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(restaurantData)
  });
  
  if (!response.ok) throw new Error(`n8n Prompt Gen Error: ${response.statusText}`);
  
  const data = await response.json();
  return data.generatedPrompt || data; 
}

/**
 * Envía un mensaje al Agente Maestro de n8n.
 * n8n maneja internamente el historial de conversación por sessionId.
 */
export async function callMasterAgent(payload: {
  systemPrompt: string;
  message: string;
  sessionId: string;
}) {
  if (!N8N_MASTER_AGENT_URL) {
    throw new Error("N8N_MASTER_AGENT_URL no está configurada.");
  }

  const response = await fetch(N8N_MASTER_AGENT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) throw new Error(`n8n Master Agent Error: ${response.statusText}`);
  
  return await response.json();
}
