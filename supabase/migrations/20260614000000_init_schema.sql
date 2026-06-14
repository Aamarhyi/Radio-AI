-- Create users table (linked to auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    preferences_json JSONB DEFAULT '{}'::jsonb NOT NULL,
    subscription_tier TEXT DEFAULT 'free' NOT NULL CHECK (subscription_tier IN ('free', 'premium')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, now()) NOT NULL
);

-- Create trips table
CREATE TABLE public.trips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_city TEXT,
    start_date DATE,
    end_date DATE,
    budget_tier TEXT CHECK (budget_tier IN ('budget', 'mid', 'luxury')),
    budget_amount NUMERIC(10, 2),
    travelers INTEGER DEFAULT 1 NOT NULL CHECK (travelers > 0),
    status TEXT DEFAULT 'planning' NOT NULL CHECK (status IN ('planning', 'upcoming', 'ongoing', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, now()) NOT NULL
);

-- Create trip_preferences table
CREATE TABLE public.trip_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL UNIQUE,
    interests_json JSONB DEFAULT '[]'::jsonb NOT NULL,
    transportation TEXT,
    accommodation TEXT,
    dietary_restrictions JSONB DEFAULT '[]'::jsonb NOT NULL
);

-- Create daily_plans table
CREATE TABLE public.daily_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
    day_number INTEGER NOT NULL,
    date DATE,
    weather_json JSONB DEFAULT '{}'::jsonb NOT NULL,
    UNIQUE (trip_id, day_number)
);

-- Create activities table
CREATE TABLE public.activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    daily_plan_id UUID REFERENCES public.daily_plans(id) ON DELETE CASCADE NOT NULL,
    time_slot TEXT,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    cost NUMERIC(10, 2),
    category TEXT,
    duration_minutes INTEGER,
    booking_url TEXT
);

-- Create restaurants table
CREATE TABLE public.restaurants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    cuisine TEXT,
    price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
    rating NUMERIC(3, 2) CHECK (rating >= 0 AND rating <= 5),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    address TEXT,
    dietary_options JSONB DEFAULT '[]'::jsonb NOT NULL,
    reservation_url TEXT
);

-- Create accommodations table
CREATE TABLE public.accommodations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT,
    price_per_night NUMERIC(10, 2),
    rating NUMERIC(3, 2) CHECK (rating >= 0 AND rating <= 5),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    amenities_json JSONB DEFAULT '[]'::jsonb NOT NULL,
    booking_url TEXT
);

-- Create budget_items table
CREATE TABLE public.budget_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT,
    date DATE
);

-- Create packing_items table
CREATE TABLE public.packing_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
    category TEXT NOT NULL,
    item_name TEXT NOT NULL,
    is_checked BOOLEAN DEFAULT false NOT NULL
);

-- Create documents table
CREATE TABLE public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    expiry_date DATE,
    notes TEXT
);

-- Create collaborators table
CREATE TABLE public.collaborators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('editor', 'viewer')),
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'accepted', 'declined')),
    UNIQUE (trip_id, user_id)
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS policies
CREATE OR REPLACE FUNCTION public.can_access_trip(trip_id UUID, required_role TEXT DEFAULT 'viewer')
RETURNS BOOLEAN SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = trip_id AND (
      t.user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.collaborators c
        WHERE c.trip_id = t.id
          AND c.user_id = auth.uid()
          AND (required_role = 'viewer' OR c.role = 'editor')
      )
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.can_access_daily_plan(daily_plan_id UUID, required_role TEXT DEFAULT 'viewer')
RETURNS BOOLEAN SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.daily_plans dp
    WHERE dp.id = daily_plan_id AND public.can_access_trip(dp.trip_id, required_role)
  );
END;
$$ LANGUAGE plpgsql;

-- RLS Policies

-- Users
CREATE POLICY "Allow public read-only of users" ON public.users 
    FOR SELECT USING (true);
CREATE POLICY "Allow users to update their own profiles" ON public.users 
    FOR UPDATE USING (auth.uid() = id);

-- Trips
CREATE POLICY "Users can select trips they own or collaborate on" ON public.trips 
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.collaborators WHERE collaborators.trip_id = id AND collaborators.user_id = auth.uid()));
CREATE POLICY "Users can insert trips they own" ON public.trips 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update trips they own or collaborate on as editor" ON public.trips 
    FOR UPDATE USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.collaborators WHERE collaborators.trip_id = id AND collaborators.user_id = auth.uid() AND collaborators.role = 'editor'));
CREATE POLICY "Users can delete trips they own" ON public.trips 
    FOR DELETE USING (auth.uid() = user_id);

-- Trip Preferences
CREATE POLICY "Read trip_preferences" ON public.trip_preferences 
    FOR SELECT USING (public.can_access_trip(trip_id, 'viewer'));
CREATE POLICY "Write trip_preferences" ON public.trip_preferences 
    FOR ALL USING (public.can_access_trip(trip_id, 'editor'));

-- Daily Plans
CREATE POLICY "Read daily_plans" ON public.daily_plans 
    FOR SELECT USING (public.can_access_trip(trip_id, 'viewer'));
CREATE POLICY "Write daily_plans" ON public.daily_plans 
    FOR ALL USING (public.can_access_trip(trip_id, 'editor'));

-- Activities
CREATE POLICY "Read activities" ON public.activities 
    FOR SELECT USING (public.can_access_daily_plan(daily_plan_id, 'viewer'));
CREATE POLICY "Write activities" ON public.activities 
    FOR ALL USING (public.can_access_daily_plan(daily_plan_id, 'editor'));

-- Restaurants
CREATE POLICY "Read restaurants" ON public.restaurants 
    FOR SELECT USING (public.can_access_trip(trip_id, 'viewer'));
CREATE POLICY "Write restaurants" ON public.restaurants 
    FOR ALL USING (public.can_access_trip(trip_id, 'editor'));

-- Accommodations
CREATE POLICY "Read accommodations" ON public.accommodations 
    FOR SELECT USING (public.can_access_trip(trip_id, 'viewer'));
CREATE POLICY "Write accommodations" ON public.accommodations 
    FOR ALL USING (public.can_access_trip(trip_id, 'editor'));

-- Budget Items
CREATE POLICY "Read budget_items" ON public.budget_items 
    FOR SELECT USING (public.can_access_trip(trip_id, 'viewer'));
CREATE POLICY "Write budget_items" ON public.budget_items 
    FOR ALL USING (public.can_access_trip(trip_id, 'editor'));

-- Packing Items
CREATE POLICY "Read packing_items" ON public.packing_items 
    FOR SELECT USING (public.can_access_trip(trip_id, 'viewer'));
CREATE POLICY "Write packing_items" ON public.packing_items 
    FOR ALL USING (public.can_access_trip(trip_id, 'editor'));

-- Documents
CREATE POLICY "Read documents" ON public.documents 
    FOR SELECT USING (public.can_access_trip(trip_id, 'viewer'));
CREATE POLICY "Write documents" ON public.documents 
    FOR ALL USING (public.can_access_trip(trip_id, 'editor'));

-- Collaborators
CREATE POLICY "Read collaborators" ON public.collaborators 
    FOR SELECT USING (public.can_access_trip(trip_id, 'viewer'));
CREATE POLICY "Write collaborators" ON public.collaborators 
    FOR ALL USING (EXISTS (SELECT 1 FROM public.trips t WHERE t.id = trip_id AND t.user_id = auth.uid()));

-- Automatically update updated_at timestamp on trips update
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trips_updated_at_trigger
    BEFORE UPDATE ON public.trips
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Trigger to automatically insert a user profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, preferences_json, subscription_tier)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    '{}'::jsonb,
    'free'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable real-time replication for collaboration tables
-- In Supabase, we do this by adding the tables to the supabase_realtime publication
BEGIN;
  -- If publication does not exist, create it (it usually does)
  -- CREATE PUBLICATION supabase_realtime;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.trips;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_plans;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.budget_items;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.packing_items;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.collaborators;
COMMIT;
