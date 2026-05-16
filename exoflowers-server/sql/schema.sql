CREATE TABLE IF NOT EXISTS plants (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(160) UNIQUE NOT NULL,
  name VARCHAR(160) NOT NULL,
  latin_name VARCHAR(200) NOT NULL,
  region VARCHAR(120) NOT NULL,
  type VARCHAR(120) NOT NULL,
  rarity VARCHAR(80) NOT NULL,
  short_description TEXT,
  description TEXT,
  image TEXT,
  light VARCHAR(120),
  watering VARCHAR(120),
  temperature VARCHAR(120),
  humidity VARCHAR(120)
);
