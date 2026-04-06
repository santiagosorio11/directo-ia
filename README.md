# DIRECTO · Infraestructura Gastronómica con IA 🚀

**"La app descubre. WhatsApp convierte. El restaurante retiene."**

DIRECTO es una plataforma premium diseñada para que los restaurantes en LATAM operen su propio canal de ventas por WhatsApp, integrando Inteligencia Artificial para automatizar pedidos, validar pagos y fidelizar clientes sin las altas comisiones de los marketplaces tradicionales.

## 🛠 Arquitectura Técnica

- **Frontend:** Next.js 16 (App Router) + Tailwind 4.
- **Identidad Visual:** Tipografía Syne (Titulares) y Manrope (Cuerpo). Paleta Dark Premium (#09090B / #FF5200).
- **IA y Automatización:** Integración directa con flujos de **n8n** (Generación de Prompts y Agente Maestro).
- **Persistencia:** Redis VPS para gestión de historiales de chat y estados de sesión.
- **Tiempo Real:** Sistema de mensajería asíncrona mediante **Pusher**.

## 🚀 Empezando

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Configurar Variables de Entorno (.env):**
    ```env
    # n8n Webhooks
    N8N_PROMPT_GEN_URL=https://n8n.iaorbita.com/webhook/d4be5f19-c642-44cc-89d8-e07bc1a819a4
    N8N_MASTER_AGENT_URL=https://n8n.iaorbita.com/webhook/750a29fd-1eb8-42ea-9a17-338b58a561cc

    # Redis VPS
    REDIS_URL=redis://user:pass@host:port

    # Pusher (Real-time)
    PUSHER_APP_ID=your_id
    NEXT_PUBLIC_PUSHER_KEY=your_key
    PUSHER_SECRET=your_secret
    NEXT_PUBLIC_PUSHER_CLUSTER=us2
    ```

3.  **Correr servidor de desarrollo:**
    ```bash
    npm run dev
    ```

## 📅 Hoja de Ruta (Roadmap)

- **Fase 1 (Medellín/Bogotá):** Validación de modelo y ahorro de comisiones.
- **Fase 2 (México):** Expansión al mercado prioritario de LATAM.
- **Fase 3 (Región):** Infraestructura estándar para todo Chile, Perú y Argentina.

---
*Desarrollado y operado por Orbita IA.*
