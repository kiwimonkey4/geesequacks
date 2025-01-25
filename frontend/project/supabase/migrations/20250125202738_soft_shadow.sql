/*
  # Create Goose Sightings Table

  1. New Tables
    - `goose_sightings`
      - `id` (bigint, primary key)
      - `created_at` (timestamp with time zone)
      - `latitude` (double precision)
      - `longitude` (double precision)
      - `user_id` (uuid, references auth.users)
      - `description` (text)

  2. Security
    - Enable RLS on `goose_sightings` table
    - Add policies for:
      - Anyone can read sightings
      - Authenticated users can create sightings
      - Users can only update/delete their own sightings
*/

CREATE TABLE IF NOT EXISTS goose_sightings (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz DEFAULT now(),
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  user_id uuid REFERENCES auth.users,
  description text,
  CONSTRAINT valid_latitude CHECK (latitude BETWEEN -90 AND 90),
  CONSTRAINT valid_longitude CHECK (longitude BETWEEN -180 AND 180)
);

-- Enable RLS
ALTER TABLE goose_sightings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read goose sightings"
  ON goose_sightings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create sightings"
  ON goose_sightings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own sightings"
  ON goose_sightings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sightings"
  ON goose_sightings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);