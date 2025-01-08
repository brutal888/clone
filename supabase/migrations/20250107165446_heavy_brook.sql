/*
  # Netflix Clone Initial Schema

  1. New Tables
    - `profiles`
      - User profiles with display name and avatar
    - `movies`
      - Movie metadata including title, description, thumbnail
    - `categories`
      - Movie categories/genres
    - `movie_categories`
      - Junction table for movie-category relationships
    - `watchlist`
      - Users' saved movies
    - `watch_history`
      - Track users' viewing history

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
    - Add policies for admin access
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Movies table
CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT NOT NULL,
  video_url TEXT NOT NULL,
  duration INTEGER,
  release_year INTEGER,
  added_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Movie categories junction table
CREATE TABLE movie_categories (
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, category_id)
);

-- Watchlist table
CREATE TABLE watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Watch history table
CREATE TABLE watch_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  last_watched TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Movies policies
CREATE POLICY "Anyone can view movies"
  ON movies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage movies"
  ON movies FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Categories policies
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Movie categories policies
CREATE POLICY "Anyone can view movie categories"
  ON movie_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage movie categories"
  ON movie_categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Watchlist policies
CREATE POLICY "Users can view own watchlist"
  ON watchlist FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own watchlist"
  ON watchlist FOR ALL
  TO authenticated
  USING (user_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

-- Watch history policies
CREATE POLICY "Users can view own watch history"
  ON watch_history FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own watch history"
  ON watch_history FOR ALL
  TO authenticated
  USING (user_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));