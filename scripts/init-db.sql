-- AfriBayit — PostgreSQL initialization
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE afribayit_dev TO afribayit;
