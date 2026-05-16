import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const audience = [
  "Любители растений",
  "Студенты и школьники",
  "Дизайнеры и художники",
  "Исследователи природы",
  "Широкая онлайн-аудитория",
];

const features = [
  {
    tag: "CATALOG",
    title: "Каталог растений",
    text: "Карточки с названием, описанием, фото и базовыми характеристиками для быстрого изучения видов.",
  },
  {
    tag: "SEARCH",
    title: "Поиск и фильтры",
    text: "Фильтрация по региону, типу, редкости и условиям выращивания с моментальной выдачей.",
  },
  {
    tag: "DETAIL",
    title: "Статья о виде",
    text: "Энциклопедический формат страницы: происхождение, биология, уход, интересные факты.",
  },
  {
    tag: "ADMIN",
    title: "Админ-панель",
    text: "Добавление, редактирование и удаление материалов авторизованными пользователями.",
  },
  {
    tag: "RESPONSIVE",
    title: "Адаптивность",
    text: "Комфортная работа на ПК, планшетах и смартфонах без потери визуальной целостности.",
  },
  {
    tag: "VISUAL",
    title: "Liquid Glass UI",
    text: "Эффекты прозрачности, blur и многослойные световые акценты для выразительной эстетики.",
  },
];

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("section");
    if (!section) return;

    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.search]);

  return (
    <div className="home-page" id="about">
      <section className="glass hero-panel">
        <div className="hero-copy">
          <h2>Онлайн-энциклопедия экзотических растений</h2>
          <p>
            Редкие виды, научные факты и визуальные истории
            в современной Liquid Glass оболочке.
          </p>
          <div className="hero-actions">
            <Link className="btn-primary" to="/catalog">
              Смотреть каталог
            </Link>
            <a className="btn-ghost" href="#about">
              О проекте
            </a>
          </div>
        </div>

        <div className="glass hero-image">
          <p>Иллюстрация редкого растения</p>
        </div>
      </section>

      <section className="section-stack" id="rare">
        <h3 className="section-title">Для кого этот сервис</h3>
        <div className="audience-grid">
          {audience.map((item) => (
            <article className="glass audience-chip" key={item}>{item}</article>
          ))}
        </div>
      </section>

      <section className="section-stack">
        <h3 className="section-title">Ключевые возможности</h3>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="glass feature-card" key={feature.title}>
              <span className="feature-tag glass">{feature.tag}</span>
              <h4>{feature.title}</h4>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="glass result-card">
        <h3>Ожидаемый результат проекта</h3>
        <p>
          Полнофункциональное образовательное веб-приложение с современным интерфейсом,
          структурированной информацией о редких растениях и удобной системой навигации.
        </p>
      </section>

      <footer className="glass footer-card">
        <h4>EXOFLORA • Дипломный проект 2026</h4>
        <p>Технологии: HTML5, CSS3, JavaScript, React/Vue, Node.js, REST API, Git</p>
      </footer>
    </div>
  );
}

export default HomePage;
