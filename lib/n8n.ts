/**
 * Genera el System Prompt maestro del agente enviando toda la data
 * del restaurante a un flujo de n8n especializado.
 */
export async function generateMasterPrompt(restaurantData: any) {
  const N8N_PROMPT_GEN_URL = process.env.N8N_PROMPT_GEN_URL;
  
  if (!N8N_PROMPT_GEN_URL) {
    console.warn("⚠️ N8N_PROMPT_GEN_URL no está definida en las variables de entorno.");
    throw new Error("N8N_PROMPT_GEN_URL no está configurada.");
  }

  console.log(`Enviando webhook a n8n: ${N8N_PROMPT_GEN_URL.substring(0, 30)}...`);

  try {
    const response = await fetch(N8N_PROMPT_GEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(restaurantData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error de n8n (${response.status}):`, errorText);
      throw new Error(`n8n Prompt Gen Error: ${response.statusText} (${response.status})`);
    }
    
    const data = await response.json();
    console.log("n8n respondió exitosamente");
    return data.generatedPrompt || data; 
  } catch (error: any) {
    console.error("Error fatal en fetch a n8n:", error.message);
    throw error;
  }
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
  const N8N_MASTER_AGENT_URL = process.env.N8N_MASTER_AGENT_URL;

  if (!N8N_MASTER_AGENT_URL) {
    console.warn("⚠️ N8N_MASTER_AGENT_URL no está definida en las variables de entorno.");
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
