-- ============================================
-- Directo IA — Migration: Reservations, Tables, Promotions
-- Run this in: Supabase Dashboard → SQL Editor
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
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_restaurant_tables_restaurant ON public.restaurant_tables(restaurant_id);

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
  updated_at TIMESTAMPTZ DEFAULT now()
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
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_promotions_restaurant ON public.promotions(restaurant_id);

-- Add GHL columns to restaurants (invisible to user, backend only)
ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS ghl_location_id TEXT,
  ADD COLUMN IF NOT EXISTS ghl_connected BOOLEAN DEFAULT false;

-- Enable RLS on new tables
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- RLS policies for restaurant_tables
CREATE POLICY "Users can view their restaurant tables"
  ON public.restaurant_tables FOR SELECT
  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their restaurant tables"
  ON public.restaurant_tables FOR INSERT
  WITH CHECK (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their restaurant tables"
  ON public.restaurant_tables FOR UPDATE
  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their restaurant tables"
  ON public.restaurant_tables FOR DELETE
  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()));

-- RLS policies for reservations
CREATE POLICY "Users can view their reservations"
  ON public.reservations FOR SELECT
  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their reservations"
  ON public.reservations FOR INSERT
  WITH CHECK (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their reservations"
  ON public.reservations FOR UPDATE
  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their reservations"
  ON public.reservations FOR DELETE
  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()));

-- RLS policies for promotions
CREATE POLICY "Users can view their promotions"
  ON public.promotions FOR SELECT
  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their promotions"
  ON public.promotions FOR INSERT
  WITH CHECK (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their promotions"
  ON public.promotions FOR UPDATE
  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their promotions"
  ON public.promotions FOR DELETE
  USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()));
