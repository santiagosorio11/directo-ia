const N8N_PROMPT_GEN_URL = process.env.N8N_PROMPT_GEN_URL || "https://n8n.iaorbita.com/webhook/d4be5f19-c642-44cc-89d8-e07bc1a819a4";
const N8N_MASTER_AGENT_URL = process.env.N8N_MASTER_AGENT_URL || "https://n8n.iaorbita.com/webhook/750a29fd-1eb8-42ea-9a17-338b58a561cc";

export async function generateMasterPrompt(restaurantData: any) {
  const response = await fetch(N8N_PROMPT_GEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(restaurantData)
  });
  
  if (!response.ok) throw new Error(`n8n Prompt Gen Error: ${response.statusText}`);
  
  const data = await response.json();
  // Se espera que n8n retorne { "generatedPrompt": "..." }
  return data.generatedPrompt || data; 
}

export async function callMasterAgent(payload: { systemPrompt: string; message: string; history: any[] }) {
  const response = await fetch(N8N_MASTER_AGENT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) throw new Error(`n8n Master Agent Error: ${response.statusText}`);
  
  const data = await response.json();
  // Se espera que n8n retorne la respuesta del agente
  return data;
}
