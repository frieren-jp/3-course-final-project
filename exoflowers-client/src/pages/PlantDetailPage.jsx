import { useEffect, useState } from "react";
import { fetchPlant } from "../api/plantsApi";

const relatedPlants = [
  {
    name: "Протея",
    latin: "Protea cynaroides",
    details: ["Крупные соцветия", "ЮАР", "Декоративный кустарник"],
  },
  {
    name: "Геликония",
    latin: "Heliconia rostrata",
    details: ["Тропический вид", "Яркое цветение", "Южная Америка"],
  },
  {
    name: "Стрелиция",
    latin: "Strelitzia reginae",
    details: ["Райская птица", "Субтропики", "Солнечный свет"],
  },
];

function PlantDetailPage() {
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPlant() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchPlant("scadoxus-multiflorus");
        if (active) {
          setPlant(data);
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

    loadPlant();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="glass loading-box">
        <p>Загрузка статьи...</p>
      </section>
    );
  }

  if (error || !plant) {
    return (
      <section className="glass error-box">
        <p>{error || "Растение не найдено"}</p>
      </section>
    );
  }

  const previewImage = plant.images?.[0] || plant.image;

  const careItems = [
    `Освещение: ${plant.care.light}`,
    `Полив: ${plant.care.watering}`,
    `Температура: ${plant.care.temperature}`,
    `Влажность: ${plant.care.humidity}`,
    "Почва: рыхлая, питательная, с дренажом",
    "Подкормка: 1 раз в 2-3 недели в сезон роста",
  ];

  return (
    <div className="detail-page">
      <header className="detail-head">
        <h2>{plant.name}</h2>
        <p className="latin">{plant.latinName}</p>
      </header>

      <section className="detail-grid">
        <div className="detail-left-col">
          <article className="glass detail-image-card">
            {previewImage ? (
              <img src={previewImage} alt={plant.name} />
            ) : (
              <div className="placeholder-photo">Изображение растения</div>
            )}
          </article>

          <article className="glass care-card">
            <h3>Уход</h3>
            <div className="care-list">
              {careItems.map((item) => (
                <div className="care-pill" key={item}>{item}</div>
              ))}
            </div>
          </article>
        </div>

        <div className="detail-right-col">
          <article className="glass quick-card">
            <h3>Быстрые характеристики</h3>
            <p>Семейство: Амариллисовые</p>
            <p>Регион: Тропическая Африка</p>
            <p>Редкость: Высокая</p>
            <p>Период цветения: Лето</p>
          </article>

          <article className="glass desc-card">
            <h3>Описание</h3>
            <p>
              Кровавая лилия - эффектное декоративное растение с шаровидным соцветием
              ярко-красного цвета. Вид ценится за необычный внешний вид и выразительное
              цветение. В энциклопедическом разделе пользователь получает информацию о
              происхождении, ботанических особенностях, условиях выращивания и правилах ухода.
            </p>
            <p>
              Растение предпочитает рассеянный свет, умеренный полив и дренированный субстрат.
              В период покоя требуется сокращение увлажнения и контроль температуры. При
              правильном уходе вид демонстрирует стабильное ежегодное цветение и высокую
              декоративность.
            </p>
          </article>
        </div>
      </section>

      <section className="glass related-wrap">
        <h3>Похожие виды</h3>
        <div className="related-grid">
          {relatedPlants.map((item) => (
            <article className="glass related-card" key={item.name}>
              <div className="related-photo">Фото</div>
              <h4>{item.name}</h4>
              <p className="latin">{item.latin}</p>
              <ul>
                {item.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PlantDetailPage;
