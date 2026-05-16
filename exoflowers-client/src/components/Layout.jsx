import { Link, NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="app-bg">
      <div className="bg-blob bg-blob-left" />
      <div className="bg-blob bg-blob-right" />
      <div className="bg-blob bg-blob-bottom" />

      <header className="site-header glass shell">
        <Link to="/" className="brand-link" aria-label="На главную">
          <h1 className="brand">EXOFLORA</h1>
        </Link>

        <nav className="main-nav" aria-label="Основная навигация">
          <NavLink to="/catalog">Каталог</NavLink>
          <Link to="/?section=rare">Редкие виды</Link>
          <Link to="/?section=about">О проекте</Link>
        </nav>

        <NavLink to="/auth" className="nav-login-btn">
          Войти
        </NavLink>
      </header>

      <main className="shell page-space">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
