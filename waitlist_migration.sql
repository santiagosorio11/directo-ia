-- Migration for Pre-Registration Waitlist
CREATE TABLE IF NOT EXISTS public.waitlist_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    restaurant_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.waitlist_leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including anonymous users) to insert leads
DROP POLICY IF EXISTS "Anyone can insert into waitlist" ON public.waitlist_leads;
CREATE POLICY "Anyone can insert into waitlist"
ON public.waitlist_leads FOR INSERT
TO public
WITH CHECK (true);

-- Only authenticated users (or nobody, depending on requirements) can view leads
-- Since this is an admin/internal table, we can restrict viewing to only admins or block public read completely.
DROP POLICY IF EXISTS "No one can read waitlist publicly" ON public.waitlist_leads;
CREATE POLICY "No one can read waitlist publicly"
ON public.waitlist_leads FOR SELECT
TO public
USING (false);
