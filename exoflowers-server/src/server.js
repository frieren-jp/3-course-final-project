require("dotenv").config();

const express = require("express");
const cors = require("cors");
const {
  getPlants,
  getPlantBySlug,
  createPlant,
  updatePlant,
  deletePlant,
} = require("./services/plantsService");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "ExoFlowers API is running" });
});

app.get("/api/plants", async (req, res) => {
  try {
    const filters = {
      search: req.query.search || "",
      region: req.query.region || "",
      type: req.query.type || "",
      rarity: req.query.rarity || "",
    };

    const plants = await getPlants(filters);
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: "Не удалось получить растения", error: error.message });
  }
});

app.get("/api/plants/:slug", async (req, res) => {
  try {
    const plant = await getPlantBySlug(req.params.slug);
    if (!plant) {
      return res.status(404).json({ message: "Растение не найдено" });
    }
    res.json(plant);
  } catch (error) {
    res.status(500).json({ message: "Не удалось получить растение", error: error.message });
  }
});

app.post("/api/plants", async (req, res) => {
  try {
    const created = await createPlant(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: "Не удалось создать запись", error: error.message });
  }
});

app.put("/api/plants/:slug", async (req, res) => {
  try {
    const updated = await updatePlant(req.params.slug, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Растение не найдено" });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Не удалось обновить запись", error: error.message });
  }
});

app.delete("/api/plants/:slug", async (req, res) => {
  try {
    const deleted = await deletePlant(req.params.slug);
    if (!deleted) {
      return res.status(404).json({ message: "Растение не найдено" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: "Не удалось удалить запись", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API started on http://localhost:${PORT}`);
});
