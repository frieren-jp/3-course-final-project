const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function fetchPlants(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const response = await fetch(`${API_BASE}/plants?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Не удалось загрузить каталог растений");
  }

  return response.json();
}

export async function fetchPlant(slug) {
  const response = await fetch(`${API_BASE}/plants/${slug}`);
  if (!response.ok) {
    throw new Error("Растение не найдено");
  }

  return response.json();
}

export async function createPlant(payload) {
  const response = await fetch(`${API_BASE}/plants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Не удалось создать запись");
  }

  return response.json();
}

export async function deletePlant(slug) {
  const response = await fetch(`${API_BASE}/plants/${slug}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Не удалось удалить запись");
  }
}
