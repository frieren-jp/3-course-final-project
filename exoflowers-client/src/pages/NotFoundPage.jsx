import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="glass error-box">
      <h2>Страница не найдена</h2>
      <p>Похоже, такого адреса в проекте пока нет.</p>
      <Link className="link-btn" to="/">
        Вернуться на главную
      </Link>
    </section>
  );
}

export default NotFoundPage;
