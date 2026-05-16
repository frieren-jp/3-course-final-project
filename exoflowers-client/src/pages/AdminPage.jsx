import { useEffect, useState } from "react";
import { createPlant, deletePlant, fetchPlants } from "../api/plantsApi";

const initialForm = {
  name: "",
  latinName: "",
  region: "",
  type: "",
  rarity: "",
  shortDescription: "",
  description: "",
};

function AdminPage() {
  const [form, setForm] = useState(initialForm);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  async function refreshItems() {
    try {
      const data = await fetchPlants({});
      setItems(data);
    } catch {
      setMessage("Не удалось загрузить список растений.");
    }
  }

  useEffect(() => {
    let active = true;

    fetchPlants({})
      .then((data) => {
        if (active) setItems(data);
      })
      .catch(() => {
        if (active) setMessage("Не удалось загрузить список растений.");
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.name || !form.latinName || !form.region || !form.type || !form.rarity) {
      setMessage("Заполни обязательные поля: название, latin name, регион, тип, редкость.");
      return;
    }

    const payload = {
      ...form,
      care: {
        light: "Не указано",
        watering: "Не указано",
        temperature: "Не указано",
        humidity: "Не указано",
      },
      images: [
        "https://loremflickr.com/1200/800/exotic,plant?lock=9001",
        "https://loremflickr.com/1200/800/botanical,flower?lock=9002",
        "https://loremflickr.com/1200/800/tropical,plant?lock=9003",
      ],
      image: "https://loremflickr.com/1200/800/exotic,plant?lock=9001",
    };

    try {
      await createPlant(payload);
      setMessage("Запись успешно добавлена.");
      setForm(initialForm);
      await refreshItems();
    } catch {
      setMessage("Не удалось добавить запись.");
    }
  }

  async function handleDelete(slug) {
    try {
      await deletePlant(slug);
      setMessage("Запись удалена.");
      await refreshItems();
    } catch {
      setMessage("Не удалось удалить запись.");
    }
  }

  return (
    <section className="admin-layout">
      <article className="glass admin-form-wrap">
        <h2>Админ-панель</h2>
        <p>Добавление и удаление карточек растений через API.</p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Название
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </label>
          <label>
            Latin name
            <input
              type="text"
              value={form.latinName}
              onChange={(event) => setForm((prev) => ({ ...prev, latinName: event.target.value }))}
            />
          </label>
          <label>
            Регион
            <input
              type="text"
              value={form.region}
              onChange={(event) => setForm((prev) => ({ ...prev, region: event.target.value }))}
            />
          </label>
          <label>
            Тип
            <input
              type="text"
              value={form.type}
              onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
            />
          </label>
          <label>
            Редкость
            <input
              type="text"
              value={form.rarity}
              onChange={(event) => setForm((prev) => ({ ...prev, rarity: event.target.value }))}
            />
          </label>
          <label>
            Краткое описание
            <textarea
              value={form.shortDescription}
              onChange={(event) => setForm((prev) => ({ ...prev, shortDescription: event.target.value }))}
              rows={3}
            />
          </label>
          <label>
            Полное описание
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              rows={4}
            />
          </label>
          <button type="submit" className="link-btn">Добавить</button>
        </form>
        {message && <p className="form-message">{message}</p>}
      </article>

      <article className="glass admin-list-wrap">
        <h3>Текущие записи</h3>
        {!items.length ? (
          <p>Пока записей нет.</p>
        ) : (
          <ul className="admin-list">
            {items.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.region} | {item.type} | {item.rarity}</p>
                </div>
                <button type="button" className="ghost-btn" onClick={() => handleDelete(item.slug)}>
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}

export default AdminPage;

