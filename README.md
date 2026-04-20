# DIRECTO IA 🤖🍽️

**Plataforma SaaS de Inteligencia Artificial para Restaurantes**

Directo IA automatiza la operación de restaurantes mediante agentes IA conectados a WhatsApp, sistemas POS, y herramientas de marketing. Permite a los restaurantes vender por WhatsApp con un agente inteligente que toma pedidos, gestiona reservas, y maneja la operación completa del negocio.

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        DIRECTO IA                                │
│                                                                   │
│  ┌──────────────┐  ┌──────────────────┐  ┌────────────────────┐  │
│  │   Dashboard   │  │  Agente Maestro  │  │  Agente de Ventas  │  │
│  │   (Next.js)   │  │   (Admin IA)     │  │   (WhatsApp IA)    │  │
│  └──────┬───────┘  └────────┬─────────┘  └─────────┬──────────┘  │
│         │                   │                       │             │
│  ┌──────┴───────────────────┴───────────────────────┴──────────┐  │
│  │                      API Layer (Next.js)                     │  │
│  │  /api/admin-chat  /api/pos  /api/reservations  /api/metrics  │  │
│  └──────────────────────────┬──────────────────────────────────┘  │
│                             │                                     │
│  ┌──────────────────────────┴──────────────────────────────────┐  │
│  │                     Supabase (PostgreSQL)                    │  │
│  │  restaurants │ orders │ menu_items │ reservations │ tables   │  │
│  │  agent_config │ promotions │ whatsapp_config │ pos_config   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │   n8n (Agent   │  │  POS APIs    │  │   CRM & Marketing  │    │
│  │   Orchestrator)│  │  (9 provs.)  │  │   (Backend)        │    │
│  └────────────────┘  └──────────────┘  └────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Tech Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | Tailwind CSS + Framer Motion + Lucide React |
| Base de Datos | Supabase (PostgreSQL + RLS + Realtime) |
| Autenticación | Supabase Auth (Email/Pass + Google OAuth) |
| Agentes IA | n8n (Webhooks + Tool Calling) |
| POS | 9 proveedores con cifrado AES-256-CBC |
| Deploy | Vercel |

---

## 📁 Estructura de Carpetas

```
directo-ia/
├── app/
│   ├── api/
│   │   ├── admin-chat/       # Proxy al Agente Admin IA (n8n)
│   │   ├── generate-prompt/  # Generación de prompt vía IA
│   │   ├── metrics/          # KPIs del dashboard
│   │   ├── pos/              # CRUD integración POS (cifrado)
│   │   │   └── decrypt/      # Desencriptar claves POS
│   │   ├── reservations/     # CRUD de reservaciones
│   │   └── webhooks/
│   │       ├── ghl/          # Webhooks de sincronización (backend)
│   │       └── n8n/          # Webhooks del agente
│   ├── dashboard/
│   │   ├── _context/         # DashboardContext (estado global)
│   │   ├── components/
│   │   │   ├── AdminChatSection.tsx     # Chat con Admin IA
│   │   │   ├── KanbanSection.tsx        # Pipeline de operación
│   │   │   ├── MarketingSection.tsx     # Marketing & WhatsApp
│   │   │   ├── MenuSection.tsx          # Gestión de menú
│   │   │   ├── OrdersSection.tsx        # Lista de pedidos
│   │   │   ├── OverviewSection.tsx      # KPIs y resumen
│   │   │   ├── PaymentsSection.tsx      # Validación de pagos
│   │   │   ├── POSIntegrationCard.tsx   # Config. de POS
│   │   │   ├── ReservationsSection.tsx  # Reservas y mesas
│   │   │   ├── SettingsSection.tsx      # Configuración
│   │   │   ├── Sidebar.tsx             # Navegación
│   │   │   ├── Toast.tsx               # Notificaciones
│   │   │   └── TopBar.tsx              # Barra superior
│   │   ├── layout.tsx                   # Layout del dashboard
│   │   └── page.tsx                     # Página principal
│   ├── login/                           # Autenticación
│   ├── onboarding/                      # Wizard de configuración
│   ├── privacy/                         # Política de privacidad
│   └── terms/                           # Términos de servicio
├── lib/
│   └── supabase/                        # Client/Server Supabase
├── public/                              # Assets estáticos
└── supabase_migration.sql               # Migración de BD
```

---

## 🗃️ Base de Datos (Supabase)

### Tablas Principales

| Tabla | Descripción |
|-------|------------|
| `restaurants` | Datos del restaurante (nombre, email, teléfono, dirección) |
| `agent_config` | Configuración del agente IA (prompt, estado, dynamic_info) |
| `menu_items` | Productos del menú con precios y disponibilidad |
| `orders` | Pedidos con pipeline_stage y payment_status |
| `whatsapp_config` | Estado de conexión WhatsApp y QR |
| `pos_integrations` | Credenciales POS cifradas (AES-256-CBC) |
| `admin_chat_history` | Historial del chat Admin IA |
| `prompt_history` | Versiones del prompt del agente |
| `restaurant_tables` | Mesas del restaurante (número, capacidad, zona, estado) |
| `reservations` | Reservaciones (cliente, mesa, fecha, hora, estado) |
| `promotions` | Promociones de marketing (título, tipo, valor, estado) |

### Estados de Mesas
- `disponible` → Mesa libre
- `apartada` → Reservada para cliente
- `ocupada` → Cliente sentado
- `inactiva` → Fuera de servicio

### Estados de Reservas
- `pendiente` → Esperando confirmación
- `confirmada` → Reserva confirmada
- `en_mesa` → Cliente sentado
- `completada` → Finalizada
- `cancelada` → Cancelada por el cliente o el restaurante
- `no_show` → Cliente no se presentó

---

## 🔌 Integraciones POS

### Proveedores Soportados (9)

| Proveedor | Tipo de Auth | Documentación |
|-----------|-------------|---------------|
| Loggro Restobar | Bearer Token | api.loggro.com |
| Toteat | Api-Token | api.toteat.com |
| Vendty | API Key | vendty.com |
| Fudo | Key:Secret | app.fu.do/api/v1 |
| Siigo POS | Bearer Token | siigonube.siigo.com |
| Yummy (Delivery) | API Key | yummy.com |
| Yuumi POS | API Key | yuumi.co |
| Alegra | Email + Token | developer.alegra.com |
| Zeus POS | Bearer Token | zeuserp.tech |

### Flujo de Seguridad POS
1. Usuario ingresa credenciales en el formulario del dashboard
2. Frontend envía a `/api/pos` que cifra con AES-256-CBC
3. Se almacena cifrado en Supabase `pos_integrations`
4. Para consultas, n8n llama a `/api/pos/decrypt` con el `restaurant_id`
5. Las credenciales nunca se exponen al frontend

---

## 🤖 Agentes IA

### Agente Maestro (Admin IA)
- Disponible en sidebar del dashboard
- Consulta KPIs, maneja el menú, lee reservas
- Puede cambiar la configuración del agente de ventas
- **Tools disponibles**: read_kpis, manage_menu, read_reservations, create_reservation, update_agent_config

### Agente de Ventas (WhatsApp)
- Opera automáticamente en WhatsApp
- Toma pedidos, gestiona pagos, responde preguntas del menú
- Puede crear reservas directamente desde la conversación
- **Tools disponibles**: read_menu, create_order, read_reservations, create_reservation

---

## 📊 Dashboard — Tabs

| Tab | Descripción |
|-----|------------|
| **Inicio** | KPIs en tiempo real (ventas, pedidos, clientes) |
| **Pedidos** | Lista de todos los pedidos con filtros |
| **Pagos** | Validación de comprobantes de pago |
| **Reservas** | Gestión de mesas y reservaciones |
| **Operación** | Kanban drag & drop del pipeline de pedidos |
| **Menú** | CRUD del menú con edición inline |
| **Marketing** | WhatsApp + Promociones + Campañas Masivas |
| **Ajustes** | Perfil del negocio, POS, y reconfiguración |

---

## 🚀 Setup Local

```bash
# Clonar
git clone https://github.com/santiagosorio11/directo-ia.git
cd directo-ia

# Instalar
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Ejecutar migración en Supabase SQL Editor
# Copiar contenido de supabase_migration.sql

# Desarrollo
npm run dev
```

---

## 📝 Variables de Entorno

| Variable | Descripción |
|----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anon de Supabase |
| `N8N_PROMPT_GEN_URL` | Webhook n8n para generación de prompt |
| `N8N_MASTER_AGENT_URL` | Webhook n8n del agente maestro |
| `N8N_OCR_MENU_URL` | Webhook n8n para OCR de menú |
| `N8N_ADMIN_AGENT_URL` | Webhook n8n del admin IA |
| `POS_ENCRYPTION_KEY` | Clave AES-256 para cifrar credenciales POS |
| `GHL_API_KEY` | Token de integración (backend, post-onboarding) |
| `GHL_API_BASE_URL` | URL base de la API de CRM |

---

## 📄 Licencia

Proyecto privado — © 2025-2026 Directo IA / IA Orbita
