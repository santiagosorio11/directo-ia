-- ============================================
-- Directo IA — Migration: Full System Schema & Security
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================

-- ============================================
-- 1. CREATE ENUMS (CRITICAL FIX #2)
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pipeline_stage') THEN
        CREATE TYPE pipeline_stage AS ENUM (
            'en_progreso', 'confirmacion_pago', 'pedido_confirmado',
            'en_preparacion', 'listo', 'en_camino', 'entregado', 'cancelado'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('pendiente', 'pagado', 'fallido');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'training_source') THEN
        CREATE TYPE training_source AS ENUM ('onboarding', 'manual', 'ai');
    END IF;
END
$$;

-- ============================================
-- 2. CREATE NEW TABLES (TABLES, RESERVATIONS, PROMOTIONS)
-- ============================================
-- Table: restaurant_tables (mesas del restaurante)
CREATE TABLE IF NOT EXISTS public.restaurant_tables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  table_number TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 4,
  status TEXT NOT NULL DEFAULT 'disponible'
    CHECK (status IN ('disponible', 'apartada', 'ocupada', 'inactiva')),
  zone TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_restaurant_tables_restaurant ON public.restaurant_tables(restaurant_id);
-- Unique constraint: A restaurant cannot have two tables with the same number (FIX #6)
ALTER TABLE public.restaurant_tables DROP CONSTRAINT IF EXISTS unique_table_per_restaurant;
ALTER TABLE public.restaurant_tables ADD CONSTRAINT unique_table_per_restaurant UNIQUE (restaurant_id, table_number);

-- Table: reservations
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  table_id UUID REFERENCES public.restaurant_tables(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  party_size INTEGER NOT NULL DEFAULT 2,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 90,
  status TEXT NOT NULL DEFAULT 'pendiente'
    CHECK (status IN ('pendiente','confirmada','en_mesa','completada','cancelada','no_show')),
  notes TEXT,
  source TEXT DEFAULT 'manual'
    CHECK (source IN ('manual','whatsapp','pos','web','agente')),
  pos_reservation_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_reservations_restaurant ON public.reservations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);

-- Table: promotions (persistir promos de marketing)
CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  discount_type TEXT CHECK (discount_type IN ('percentage','fixed','2x1','freebie','custom')),
  discount_value NUMERIC,
  applies_to JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'borrador'
    CHECK (status IN ('activa','pausada','borrador','expirada')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_promotions_restaurant ON public.promotions(restaurant_id);

-- Add GHL columns to restaurants
ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS ghl_location_id TEXT,
  ADD COLUMN IF NOT EXISTS ghl_connected BOOLEAN DEFAULT false;

-- ============================================
-- 3. FIXING EXISTING TABLES INTEGRITY
-- ============================================
-- POS Integrations constraints (HIGH IMPACT FIX #1 & #12)
DO $$
BEGIN
    -- Ensure restaurant_id is NOT NULL in pos_integrations
    EXECUTE 'ALTER TABLE public.pos_integrations ALTER COLUMN restaurant_id SET NOT NULL';
EXCEPTION WHEN undefined_table THEN
    -- Ignore if table doesn't exist yet
END $$;

DO $$
BEGIN
    ALTER TABLE public.pos_integrations ADD CONSTRAINT valid_pos_provider
      CHECK (provider IN ('loggro','toteat','vendty','fudo','siigo','yummy','yuumi','alegra','zeus'));
EXCEPTION WHEN duplicate_object OR undefined_table THEN
    -- Ignore if constraint already exists or table is missing
END $$;

DO $$
BEGIN
    ALTER TABLE public.pos_integrations ADD CONSTRAINT unique_provider_per_restaurant UNIQUE (restaurant_id, provider);
EXCEPTION WHEN duplicate_table OR undefined_table OR duplicate_object THEN
    -- Ignore
END $$;

-- Soft deletes for orders (FIX #11)
DO $$
BEGIN
    ALTER TABLE public.orders ADD COLUMN deleted_at TIMESTAMPTZ;
EXCEPTION WHEN duplicate_column OR undefined_table THEN
    -- Ignore
END $$;

-- ============================================
-- 4. MISSING INDEXES (FIX #5)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON public.orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_stage ON public.orders(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_menu_restaurant ON public.menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_admin_chat_restaurant ON public.admin_chat_history(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_admin_chat_created ON public.admin_chat_history(created_at DESC);

-- ============================================
-- 5. AUTOMATIC SYSTEM TRIGGERS (UPDATED_AT) (FIX #8)
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    tname text;
BEGIN
    FOR tname IN SELECT unnest(ARRAY['restaurants', 'orders', 'menu_items', 'reservations', 'agent_config', 'whatsapp_config', 'promotions', 'restaurant_tables'])
    LOOP
        BEGIN
            EXECUTE format('
                DROP TRIGGER IF EXISTS set_updated_at ON %1$I;
                CREATE TRIGGER set_updated_at BEFORE UPDATE ON %1$I
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            ', tname);
        EXCEPTION WHEN undefined_table THEN
            -- Ignore missing tables
        END;
    END LOOP;
END
$$;

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS) (CRITICAL FIX #7)
-- ============================================
-- Enable RLS for all tables
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
    tname text;
BEGIN
    FOR tname IN SELECT unnest(ARRAY['orders', 'menu_items', 'admin_chat_history', 'pos_integrations', 'human_requests', 'training_inputs', 'prompt_history', 'agent_config', 'whatsapp_config', 'restaurants'])
    LOOP
        BEGIN
            EXECUTE format('ALTER TABLE public.%1$I ENABLE ROW LEVEL SECURITY;', tname);
        EXCEPTION WHEN undefined_table THEN
            -- Ignore missing tables
        END;
    END LOOP;
END
$$;

-- RLS Policies Generator for Restaurant-owned tables
DO $$
DECLARE
    tname text;
BEGIN
    FOR tname IN SELECT unnest(ARRAY['restaurant_tables', 'reservations', 'promotions', 'orders', 'menu_items', 'admin_chat_history', 'pos_integrations', 'human_requests', 'training_inputs', 'prompt_history', 'agent_config', 'whatsapp_config'])
    LOOP
        BEGIN
            -- Drop existing policies if they exist (to avoid duplication errors)
            EXECUTE format('DROP POLICY IF EXISTS "Users can view their %1$I" ON public.%1$I;', tname);
            EXECUTE format('DROP POLICY IF EXISTS "Users can insert their %1$I" ON public.%1$I;', tname);
            EXECUTE format('DROP POLICY IF EXISTS "Users can update their %1$I" ON public.%1$I;', tname);
            EXECUTE format('DROP POLICY IF EXISTS "Users can delete their %1$I" ON public.%1$I;', tname);
            
            -- Create standard RLS policies based on restaurant ownership
            EXECUTE format('
                CREATE POLICY "Users can view their %1$I"
                  ON public.%1$I FOR SELECT
                  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()));
                  
                CREATE POLICY "Users can insert their %1$I"
                  ON public.%1$I FOR INSERT
                  WITH CHECK (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()));
                  
                CREATE POLICY "Users can update their %1$I"
                  ON public.%1$I FOR UPDATE
                  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()));
                  
                CREATE POLICY "Users can delete their %1$I"
                  ON public.%1$I FOR DELETE
                  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()));
            ', tname);
        EXCEPTION WHEN undefined_table THEN
            -- Ignore missing tables
        END;
    END LOOP;
END
$$;

-- RLS Policy for Restaurants table (owns itself via user_id)
DROP POLICY IF EXISTS "Users can view their restaurants" ON public.restaurants;
DROP POLICY IF EXISTS "Users can insert their restaurants" ON public.restaurants;
DROP POLICY IF EXISTS "Users can update their restaurants" ON public.restaurants;
DROP POLICY IF EXISTS "Users can delete their restaurants" ON public.restaurants;

CREATE POLICY "Users can view their restaurants"
  ON public.restaurants FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their restaurants"
  ON public.restaurants FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their restaurants"
  ON public.restaurants FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their restaurants"
  ON public.restaurants FOR DELETE
  USING (user_id = auth.uid());
