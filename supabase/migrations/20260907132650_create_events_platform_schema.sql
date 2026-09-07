/*
# Event Management & Booking Platform — Initial Schema

## Overview
Creates the core database tables for an event management and booking platform where users can browse events and book tickets. The app has a sign-in screen, so user-owned data is scoped to authenticated users via RLS.

## New Tables

### profiles
- `id` (uuid, primary key, references auth.users) — one row per authenticated user
- `full_name` (text, not null) — user's display name
- `phone` (text, nullable) — contact phone number
- `avatar_url` (text, nullable) — optional profile picture URL
- `created_at` (timestamptz, defaults to now)

### events
- `id` (uuid, primary key)
- `title` (text, not null) — event name
- `description` (text, not null) — event details
- `category` (text, not null) — e.g. Music, Conference, Workshop, Exhibition, Festival
- `event_date` (timestamptz, not null) — when the event takes place
- `venue` (text, not null) — venue name
- `city` (text, not null) — city where event is held
- `price` (numeric, not null, default 0) — ticket price in USD
- `capacity` (integer, not null) — max attendees
- `image_url` (text, not null) — cover image URL
- `created_at` (timestamptz, defaults to now)

### bookings
- `id` (uuid, primary key)
- `user_id` (uuid, not null, defaults to auth.uid(), references auth.users) — owner
- `event_id` (uuid, not null, references events) — booked event
- `tickets` (integer, not null, default 1) — number of tickets booked
- `total_price` (numeric, not null, default 0) — total cost
- `status` (text, not null, default 'confirmed') — booking status
- `created_at` (timestamptz, defaults to now)

## Security (RLS)

### profiles
- Enable RLS.
- Users can SELECT, INSERT, UPDATE their own profile row (auth.uid() = id).

### events
- Enable RLS.
- SELECT available to anon + authenticated (events are publicly browsable).
- No INSERT/UPDATE/DELETE policies — events are managed server-side only.

### bookings
- Enable RLS.
- Owner-scoped CRUD: authenticated users can SELECT, INSERT, UPDATE, DELETE only their own bookings.
- `user_id` defaults to auth.uid() so inserts work without explicitly passing it.

## Seed Data
- Inserts 6 sample events across different categories with real cover images.
*/

-- ===================== PROFILES =====================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Auto-create a profile row when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'New User'),
    NEW.raw_user_meta_data ->> 'phone'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===================== EVENTS =====================
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  event_date timestamptz NOT NULL,
  venue text NOT NULL,
  city text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  capacity integer NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_events_public" ON events;
CREATE POLICY "read_events_public" ON events FOR SELECT
  TO anon, authenticated USING (true);

-- ===================== BOOKINGS =====================
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  tickets integer NOT NULL DEFAULT 1,
  total_price numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bookings" ON bookings;
CREATE POLICY "select_own_bookings" ON bookings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_bookings" ON bookings;
CREATE POLICY "insert_own_bookings" ON bookings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_bookings" ON bookings;
CREATE POLICY "update_own_bookings" ON bookings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_bookings" ON bookings;
CREATE POLICY "delete_own_bookings" ON bookings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ===================== INDEXES =====================
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);

-- ===================== SEED DATA =====================
INSERT INTO events (title, description, category, event_date, venue, city, price, capacity, image_url) VALUES
(
  'Summer Beats Music Festival',
  'Experience three days of live performances from top artists across rock, indie, and electronic genres. Food trucks, art installations, and camping on site.',
  'Music',
  '2026-07-18 14:00:00+00',
  'Riverside Amphitheater',
  'Austin, TX',
  149.00,
  5000,
  'https://images.pexels.com/photos/4218027/pexels-photo-4218027.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),
(
  'Global Tech Summit 2026',
  'Join 200+ industry leaders for keynotes, panel discussions, and hands-on workshops on AI, cloud infrastructure, and the future of software development.',
  'Conference',
  '2026-10-12 09:00:00+00',
  'Moscone Convention Center',
  'San Francisco, CA',
  399.00,
  3000,
  'https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),
(
  'Elegant Wedding Showcase',
  'An exclusive wedding exhibition featuring top planners, florists, caterers, and venues. Discover the latest trends in wedding design and book consultations on-site.',
  'Exhibition',
  '2026-05-04 11:00:00+00',
  'Grand Ballroom Hotel',
  'New York, NY',
  75.00,
  800,
  'https://images.pexels.com/photos/35985211/pexels-photo-35985211.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),
(
  'International Street Food Festival',
  'A weekend celebration of global cuisine with 60+ food vendors, live cooking demonstrations, craft beer gardens, and family-friendly entertainment.',
  'Festival',
  '2026-08-22 12:00:00+00',
  'Harbor Park Pavilion',
  'Seattle, WA',
  25.00,
  10000,
  'https://images.pexels.com/photos/38431294/pexels-photo-38431294.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),
(
  'Contemporary Art Opening Night',
  'An evening of contemporary art featuring works from emerging international artists. Curated gallery walk, live music, wine reception, and artist meet-and-greet.',
  'Exhibition',
  '2026-06-14 18:00:00+00',
  'Modern Art Gallery',
  'Chicago, IL',
  45.00,
  500,
  'https://images.pexels.com/photos/30150825/pexels-photo-30150825.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),
(
  'Startup Founders Meetup',
  'Connect with fellow founders, investors, and mentors. Pitch sessions, fireside chats, and structured networking designed to help early-stage startups grow.',
  'Conference',
  '2026-09-20 17:00:00+00',
  'Innovation Hub Downtown',
  'Boston, MA',
  59.00,
  400,
  'https://images.pexels.com/photos/28683722/pexels-photo-28683722.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
)
ON CONFLICT DO NOTHING;
