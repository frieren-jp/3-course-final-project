import { useEffect, useMemo, useState } from "react";
import PlantCard from "../components/PlantCard";
import { fetchPlants } from "../api/plantsApi";

const initialFilters = {
  search: "",
  region: "",
  type: "",
  rarity: "",
};

function CatalogPage() {
  const [plants, setPlants] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchPlants(filters);
        if (active) {
          setPlants(data);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [filters]);

  const countText = useMemo(() => {
    if (loading) return "Загрузка каталога...";
    return `Найдено растений: ${plants.length}`;
  }, [loading, plants.length]);

  function handleChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="catalog-page">
      <header className="catalog-header">
        <h2>Каталог экзотических растений</h2>
        <p>Поиск, фильтрация и быстрый доступ к статьям</p>
      </header>

      <section className="glass catalog-search-wrap">
        <input
          className="catalog-search"
          type="text"
          value={filters.search}
          onChange={(event) => handleChange("search", event.target.value)}
          placeholder="Поиск по названию, региону, типу..."
        />
      </section>

      <section className="catalog-content">
        <aside className="glass catalog-sidebar">
          <h3>Фильтры</h3>

          <div className="filter-pill-wrap">
            <input
              type="text"
              value={filters.region}
              onChange={(event) => handleChange("region", event.target.value)}
              placeholder="Регион произрастания"
            />
          </div>

          <div className="filter-pill-wrap">
            <input
              type="text"
              value={filters.type}
              onChange={(event) => handleChange("type", event.target.value)}
              placeholder="Тип растения"
            />
          </div>

          <div className="filter-pill-wrap">
            <input
              type="text"
              value={filters.rarity}
              onChange={(event) => handleChange("rarity", event.target.value)}
              placeholder="Уровень редкости"
            />
          </div>

          <div className="filter-pill-wrap disabled">Уход и освещение</div>
          <div className="filter-pill-wrap disabled">Цветение</div>

          <button type="button" className="btn-ghost wide" onClick={() => setFilters(initialFilters)}>
            Сбросить фильтры
          </button>
          <p className="catalog-count">{countText}</p>
        </aside>

        <div className="catalog-cards">
          {error && (
            <section className="glass error-box" role="alert">
              <p>{error}</p>
            </section>
          )}

          {!loading && !plants.length ? (
            <article className="glass empty-box">
              <h3>Совпадений не найдено</h3>
              <p>Попробуй изменить критерии фильтрации или очистить фильтры.</p>
            </article>
          ) : (
            plants.map((plant) => <PlantCard key={plant.id} plant={plant} />)
          )}
        </div>
      </section>
    </div>
  );
}

export default CatalogPage;
