-- Create a table to store recipes
CREATE TABLE IF NOT EXISTS rezepte (
  rezept_id SERIAL PRIMARY KEY, -- Auto-incrementing ID
  rezept_name VARCHAR(100) NOT NULL, -- recipe name, required
  kochbuch VARCHAR(40), -- title of cooking book
  seite int -- page where to find recipe
);
-- Create a table to store ingredients
CREATE TABLE IF NOT EXISTS rezeptzutaten (
  rezept_id int, -- foreign key, refers to id of recipe
  FOREIGN KEY (rezept_id) REFERENCES rezepte(rezept_id),
  zutaten_menge int, -- number of ingredient units
  zutaten_name VARCHAR(40), -- name of ingredient
  zutaten_einheit VARCHAR(40) -- unit of ingredient
  
);