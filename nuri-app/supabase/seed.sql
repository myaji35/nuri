-- Clear existing data to avoid conflicts
TRUNCATE TABLE public.market_tiers, public.sites, public.countries RESTART IDENTITY;

-- Insert sample data into 'countries' table
INSERT INTO public.countries (country_code, country_name_en, country_name_ko, geom, gdp, population)
VALUES
  ('KOR', 'South Korea', '대한민국', ST_GeomFromText('MULTIPOLYGON (((126.0 33.0, 127.0 33.0, 127.0 34.0, 126.0 34.0, 126.0 33.0)))', 4326), 1.7, 51),
  ('USA', 'United States', '미국', ST_GeomFromText('MULTIPOLYGON (((-125.0 25.0, -65.0 25.0, -65.0 50.0, -125.0 50.0, -125.0 25.0)))', 4326), 25.5, 330),
  ('CAN', 'Canada', '캐나다', ST_GeomFromText('MULTIPOLYGON (((-140.0 40.0, -50.0 40.0, -50.0 80.0, -140.0 80.0, -140.0 40.0)))', 4326), 2.1, 38);

-- Insert sample data into 'market_tiers' table
INSERT INTO public.market_tiers (country_code, tier)
VALUES
  ('KOR', 1),
  ('USA', 2),
  ('CAN', 3);

-- Insert sample data into 'sites' table
INSERT INTO public.sites (site_id, site_name, location)
VALUES
  ('K1', 'NURI Farm Korea 1', ST_SetSRID(ST_MakePoint(127.0, 37.5), 4326));
