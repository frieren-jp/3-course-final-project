const fallbackPlants = require("../data/plants");
const { pool, query } = require("../db");

function matchesFilter(value, filter) {
  if (!filter) return true;
  return String(value).toLowerCase().includes(String(filter).toLowerCase());
}

function applyFilters(plants, filters) {
  return plants.filter((plant) => {
    const inSearch = !filters.search
      || plant.name.toLowerCase().includes(filters.search.toLowerCase())
      || plant.latinName.toLowerCase().includes(filters.search.toLowerCase());

    return inSearch
      && matchesFilter(plant.region, filters.region)
      && matchesFilter(plant.type, filters.type)
      && matchesFilter(plant.rarity, filters.rarity);
  });
}

function normalizeImages(rawImages, fallbackImage) {
  if (Array.isArray(rawImages) && rawImages.length) {
    return rawImages;
  }

  if (typeof rawImages === "string" && rawImages.trim()) {
    try {
      const parsed = JSON.parse(rawImages);
      if (Array.isArray(parsed) && parsed.length) {
        return parsed;
      }
    } catch {
      // noop
    }
  }

  if (fallbackImage) {
    return [fallbackImage];
  }

  return [];
}

function normalizePlant(plant) {
  const images = normalizeImages(plant.images, plant.image);

  return {
    ...plant,
    images,
    image: plant.image || images[0] || "",
  };
}

function mapRowToPlant(row) {
  const plant = {
    ...row,
    care: {
      light: row.light,
      watering: row.watering,
      temperature: row.temperature,
      humidity: row.humidity,
    },
  };

  return normalizePlant(plant);
}

async function getPlants(filters) {
  if (!pool) {
    return applyFilters(fallbackPlants, filters).map(normalizePlant);
  }

  const sql = `
    SELECT id, slug, name, latin_name as "latinName", region, type, rarity,
           short_description as "shortDescription", description, image, images,
           light, watering, temperature, humidity
    FROM plants
    WHERE ($1 = '' OR name ILIKE '%' || $1 || '%' OR latin_name ILIKE '%' || $1 || '%')
      AND ($2 = '' OR region ILIKE '%' || $2 || '%')
      AND ($3 = '' OR type ILIKE '%' || $3 || '%')
      AND ($4 = '' OR rarity ILIKE '%' || $4 || '%')
    ORDER BY name
  `;

  const params = [filters.search || "", filters.region || "", filters.type || "", filters.rarity || ""];
  const result = await query(sql, params);

  return result.rows.map(mapRowToPlant);
}

async function getPlantBySlug(slug) {
  if (!pool) {
    const plant = fallbackPlants.find((item) => item.slug === slug) || null;
    return plant ? normalizePlant(plant) : null;
  }

  const sql = `
    SELECT id, slug, name, latin_name as "latinName", region, type, rarity,
           short_description as "shortDescription", description, image, images,
           light, watering, temperature, humidity
    FROM plants
    WHERE slug = $1
    LIMIT 1
  `;

  const result = await query(sql, [slug]);
  if (!result.rows.length) return null;

  return mapRowToPlant(result.rows[0]);
}

function makeSlug(text) {
  const raw = String(text || "")
    .toLowerCase()
    .replace(/[^a-zа-я0-9\s-]/gi, "")
    .trim()
    .replace(/\s+/g, "-");

  return raw || `plant-${Date.now()}`;
}

async function createPlant(payload) {
  if (!pool) {
    const nextId = fallbackPlants.reduce((maxId, plant) => Math.max(maxId, plant.id), 0) + 1;
    const slug = payload.slug || makeSlug(payload.name);
    const created = normalizePlant({ id: nextId, slug, ...payload });
    fallbackPlants.push(created);
    return created;
  }

  throw new Error("Создание в PostgreSQL пока не реализовано в демо-версии.");
}

async function updatePlant(slug, payload) {
  if (!pool) {
    const index = fallbackPlants.findIndex((plant) => plant.slug === slug);
    if (index === -1) return null;
    fallbackPlants[index] = normalizePlant({ ...fallbackPlants[index], ...payload });
    return fallbackPlants[index];
  }

  throw new Error("Обновление в PostgreSQL пока не реализовано в демо-версии.");
}

async function deletePlant(slug) {
  if (!pool) {
    const index = fallbackPlants.findIndex((plant) => plant.slug === slug);
    if (index === -1) return false;
    fallbackPlants.splice(index, 1);
    return true;
  }

  throw new Error("Удаление в PostgreSQL пока не реализовано в демо-версии.");
}

module.exports = {
  getPlants,
  getPlantBySlug,
  createPlant,
  updatePlant,
  deletePlant,
};
