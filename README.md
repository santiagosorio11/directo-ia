# DIRECTO IA — Documentación del Proyecto

> **Infraestructura de Ventas por WhatsApp para Restaurantes**
> Plataforma SaaS que permite a restaurantes crear un agente de IA personalizado que atiende pedidos vía WhatsApp, elimina comisiones de marketplaces y devuelve el control del canal de ventas al negocio.

---

## Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| **Next.js** | 16.2.2 | Framework (App Router) |
| **React** | 19.2.4 | UI |
| **TypeScript** | ^5 | Tipado |
| **Tailwind CSS** | ^4 | Estilos |
| **Supabase** | SSR 0.10.2 / JS 2.101.1 | Auth + DB (PostgreSQL) |
| **Framer Motion** | ^12.38.0 | Animaciones |
| **Lucide React** | ^1.7.0 | Iconos |
| **n8n** (externo) | — | AI Agent, OCR, generación de prompts, historial de chat |

---

## Estructura de Carpetas

```
directo-ia/
├── .env                              # Variables de entorno
├── middleware.ts                      # Auth middleware (Supabase session)
├── next.config.ts                    # Config Next.js
├── package.json                      # Dependencias
│
├── public/
│   └── LOGODIRECTO.jpg               # Logo de la marca
│
├── lib/                              # Utilidades y clientes backend
│   ├── n8n.ts                        # Wrappers HTTP para webhooks n8n
│   └── supabase/                     # Clientes Supabase (patrón SSR)
│       ├── client.ts                 # Browser client (componentes "use client")
│       ├── server.ts                 # Server client (Server Components / API)
│       └── middleware.ts             # Refresh de sesión + redirects de auth
│
├── app/
│   ├── layout.tsx                    # Layout raíz (HTML, metadata, fuentes)
│   ├── page.tsx                      # Landing Page principal
│   ├── globals.css                   # Design system: colores, fuentes, scrollbar
│   │
│   ├── components/                   # Componentes COMPARTIDOS (cross-page)
│   │   ├── Navbar.tsx                # Navbar flotante (landing page)
│   │   └── ui/
│   │       └── ChatSimulation.tsx    # Chat demo animado (landing)
│   │
│   ├── login/                        # ─── Página de Login ───
│   │   ├── page.tsx                  # Server Component: redirect si autenticado
│   │   └── LoginForm.tsx             # Client: formulario + Google OAuth
│   │
│   ├── onboarding/                   # ─── Wizard de Configuración ───
│   │   ├── page.tsx                  # Inicializa Provider + Flow
│   │   ├── _context/
│   │   │   └── OnboardingContext.tsx # Estado del wizard (datos, pasos)
│   │   └── _components/
│   │       ├── OnboardingFlow.tsx    # Orquestador de pasos con animaciones
│   │       ├── steps/               # Pasos del onboarding (0-7)
│   │       │   ├── AuthStep.tsx         # 0: Autenticación
│   │       │   ├── RegistrationStep.tsx # 1: Datos de contacto
│   │       │   ├── IdentityStep.tsx     # 2: Identidad del restaurante
│   │       │   ├── MenuOCRStep.tsx      # 3: Subir menú → OCR → productos
│   │       │   ├── StrategyStep.tsx     # 4: Estrategia de ventas
│   │       │   ├── PersonalityStep.tsx  # 5: Personalidad del agente
│   │       │   ├── OperationStep.tsx    # 6: Políticas operativas
│   │       │   └── SuccessStep.tsx      # 7: Chat sandbox + Activar
│   │       └── ui/
│   │           └── ProgressBar.tsx  # Barra de progreso del wizard
│   │
│   ├── dashboard/                    # ─── Panel de Gestión ───
│   │   ├── layout.tsx                # DashboardProvider + Sidebar
│   │   ├── page.tsx                  # Renderiza secciones según tab activo
│   │   ├── _context/
│   │   │   └── DashboardContext.tsx  # Estado: restaurante, agente, menú, pedidos
│   │   └── components/
│   │       ├── Sidebar.tsx           # Navegación lateral
│   │       ├── AgentSection.tsx      # Gestión del agente IA
│   │       ├── WhatsAppSection.tsx   # Conexión WhatsApp
│   │       ├── OrdersSection.tsx     # Lista de pedidos
│   │       ├── PaymentsSection.tsx   # Confirmación de pagos
│   │       ├── KanbanSection.tsx     # Vista kanban
│   │       ├── MenuSection.tsx       # Gestión de menú
│   │       └── SettingsSection.tsx   # Configuración general
│   │
│   └── api/                          # ─── API Routes ───
│       ├── activate/route.ts         # POST: Crear restaurante + agente en Supabase
│       ├── chat/route.ts             # POST: Mensaje → n8n Master Agent
│       ├── generate-prompt/route.ts  # POST: Generar system prompt vía n8n
│       ├── ocr/route.ts              # POST: Proxy OCR → n8n
│       ├── auth/
│       │   └── callback/route.ts     # GET: OAuth callback
│       └── webhooks/                 # Webhooks externos (único directorio)
│           ├── n8n/route.ts          # POST: Callback de n8n
│           └── ghl/
│               └── sync-prompt/route.ts  # POST: Sync prompt → GoHighLevel
```

---

## Variables de Entorno

En tu `.env` necesitas tener definidas estas variables:

```env
# ─── Supabase ───
NEXT_PUBLIC_SUPABASE_URL="tu-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-key"

# ─── n8n Webhooks ───
N8N_PROMPT_GEN_URL="url-del-webhook"
N8N_MASTER_AGENT_URL="url-del-webhook"
N8N_OCR_MENU_URL="url-del-webhook"

# ─── n8n Webhooks GHL (cuando estén listos) ───
# N8N_GHL_SUBCUENTA_WEBHOOK=""
# N8N_GHL_PROMPT_UPDATE_WEBHOOK=""
```

---

## Flujo de la Aplicación

```
Landing Page ──→ Onboarding (8 pasos) ──→ Dashboard
     │                   │                     │
     │                   ▼                     ▼
     │            Supabase Auth         Supabase DB
     │                                        │
     └──────────────────────────── n8n (IA + OCR + Chat)
```

### Onboarding:
| Paso | Componente | Descripción |
|------|-----------|-------------|
| 0 | AuthStep | Login/Registro (email+pass ó Google) |
| 1 | RegistrationStep | Teléfono, dirección |
| 2 | IdentityStep | Nombre, tipo de comida, horario |
| 3 | MenuOCRStep | Subir imagen del menú → OCR → productos |
| 4 | StrategyStep | Objetivos, producto estrella, cross-selling |
| 5 | PersonalityStep | Tono y saludo del agente |
| 6 | OperationStep | Tiempos, pagos, políticas |
| 7 | SuccessStep | Chat de prueba + Activar agente |

---

## API Routes

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/activate` | POST | Crea restaurante + agente + menú en Supabase |
| `/api/chat` | POST | Envía mensaje al Master Agent de n8n (maneja historial internamente) |
| `/api/generate-prompt` | POST | Genera system prompt vía n8n |
| `/api/ocr` | POST | Proxy OCR → n8n (evita CORS) |
| `/api/auth/callback` | GET | OAuth callback (exchange code → session) |
| `/api/webhooks/n8n` | POST | Callback de n8n para procesos async |
| `/api/webhooks/ghl/sync-prompt` | POST | Sincroniza prompt con GoHighLevel |

---

## Base de Datos (Supabase)

| Tabla | Relación | Descripción |
|-------|----------|-------------|
| `restaurants` | PK | Datos del negocio |
| `agent_config` | FK → restaurants | Configuración del agente IA |
| `menu_items` | FK → restaurants | Productos del menú |
| `orders` | FK → restaurants | Pedidos |
| `whatsapp_config` | FK → restaurants | Config de WhatsApp |
| `prompt_history` | FK → restaurants | Historial de cambios al prompt |

---

## Comandos

```bash
npm run dev       # Desarrollo
npm run build     # Build de producción
npm start         # Servidor de producción
npm run lint      # Lint
```

---

**Powered by:** Orbita IA · **Versión:** 0.1.0 · **2026**
