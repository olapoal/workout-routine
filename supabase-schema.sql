-- ==============================================================================
-- DATABASE SCHEMA: PULSE FIT AI - APLIKASI WORKOUT ROUTINE PRO
-- Supabase SQL Editor Script
-- ==============================================================================
-- Petunjuk Penggunaan:
-- 1. Buka dashboard Supabase Anda di https://supabase.com
-- 2. Pilih / Buat Project baru (misal: "workout-routine")
-- 3. Masuk ke menu "SQL Editor" di bilah navigasi kiri
-- 4. Klik "New query", tempelkan seluruh isi file ini, lalu klik "RUN"
-- ==============================================================================

-- 1. TABEL: workout_buyers (Lisensi Pembeli & Integrasi Lynk.id)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workout_buyers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT DEFAULT 'Trainee VIP',
    phone TEXT,
    order_id TEXT,
    product_name TEXT DEFAULT '[WORKOUT] Aplikasi Workout Routine Pro',
    plan TEXT DEFAULT 'VIP Lifetime Access',
    status TEXT DEFAULT 'active',
    purchased_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Indeks pencarian cepat email pembeli (< 5ms)
CREATE INDEX IF NOT EXISTS idx_workout_buyers_email ON public.workout_buyers(email);
CREATE INDEX IF NOT EXISTS idx_workout_buyers_status ON public.workout_buyers(status);

-- 2. TABEL: trainee_profiles (Profil Kebugaran & Progress Trainee)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trainee_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    level TEXT DEFAULT 'beginner',
    goal TEXT DEFAULT 'sixpack',
    duration INT DEFAULT 30,
    equipment TEXT DEFAULT 'none',
    session_time INT DEFAULT 25,
    frequency INT DEFAULT 4,
    physical TEXT DEFAULT 'none',
    completed_days JSONB DEFAULT '[]'::jsonb,
    streak INT DEFAULT 0,
    total_calories INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_trainee_profiles_email ON public.trainee_profiles(email);

-- 3. TABEL: workout_logs (Riwayat Sesi Latihan Harian)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workout_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    day_number INT NOT NULL,
    day_title TEXT,
    duration_seconds INT DEFAULT 0,
    calories_burned INT DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_workout_logs_email ON public.workout_logs(email);

-- ==============================================================================
-- KEAMANAN: ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.workout_buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainee_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses: workout_buyers
-- Memungkinkan API/Frontend publik (anon) memverifikasi email pembeli
DROP POLICY IF EXISTS "Allow anon read workout_buyers" ON public.workout_buyers;
CREATE POLICY "Allow anon read workout_buyers"
    ON public.workout_buyers FOR SELECT
    TO anon, authenticated
    USING (true);

-- Memungkinkan webhook Lynk.id / Netlify functions memasukkan pembeli baru
DROP POLICY IF EXISTS "Allow anon insert workout_buyers" ON public.workout_buyers;
CREATE POLICY "Allow anon insert workout_buyers"
    ON public.workout_buyers FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update workout_buyers" ON public.workout_buyers;
CREATE POLICY "Allow anon update workout_buyers"
    ON public.workout_buyers FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon delete workout_buyers" ON public.workout_buyers;
CREATE POLICY "Allow anon delete workout_buyers"
    ON public.workout_buyers FOR DELETE
    TO anon, authenticated
    USING (true);

-- Kebijakan Akses: trainee_profiles & workout_logs
DROP POLICY IF EXISTS "Allow anon all trainee_profiles" ON public.trainee_profiles;
CREATE POLICY "Allow anon all trainee_profiles"
    ON public.trainee_profiles FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all workout_logs" ON public.workout_logs;
CREATE POLICY "Allow anon all workout_logs"
    ON public.workout_logs FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- DATA AWAL / SAMPLE SEED (EMAIL ADMIN & TESTER)
-- Anda bisa langsung login menggunakan email di bawah ini tanpa perlu bayar:
-- ==============================================================================
INSERT INTO public.workout_buyers (email, name, order_id, product_name, plan, status)
VALUES 
    ('olapoal.artgallery@gmail.com', 'Alrizal (Owner Admin)', 'ADMIN-INIT-001', '[WORKOUT] Aplikasi Workout Routine Pro', 'VIP Lifetime Access', 'active'),
    ('admin@workout.com', 'Super Admin Workout', 'ADMIN-INIT-002', '[WORKOUT] Aplikasi Workout Routine Pro', 'VIP Lifetime Access', 'active'),
    ('tester@gmail.com', 'Tester Demo Trainee', 'TEST-DEMO-001', '[WORKOUT] Aplikasi Workout Routine Pro', 'VIP Lifetime Access', 'active')
ON CONFLICT (email) DO UPDATE 
SET status = 'active', plan = 'VIP Lifetime Access';
