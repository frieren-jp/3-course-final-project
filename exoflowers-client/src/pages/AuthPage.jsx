import { useState } from "react";

const initialLogin = { email: "", password: "" };
const initialRegister = { name: "", email: "", password: "", confirmPassword: "" };

function AuthPage() {
  const [login, setLogin] = useState(initialLogin);
  const [register, setRegister] = useState(initialRegister);
  const [message, setMessage] = useState("");

  function handleLoginSubmit(event) {
    event.preventDefault();

    if (!login.email || !login.password) {
      setMessage("Для входа заполни email и пароль.");
      return;
    }

    setMessage("Демо: вход выполнен успешно.");
  }

  function handleRegisterSubmit(event) {
    event.preventDefault();

    if (!register.name || !register.email || !register.password || !register.confirmPassword) {
      setMessage("Для регистрации нужно заполнить все поля.");
      return;
    }

    if (register.password.length < 8) {
      setMessage("Пароль должен содержать минимум 8 символов.");
      return;
    }

    if (register.password !== register.confirmPassword) {
      setMessage("Пароли не совпадают.");
      return;
    }

    setMessage("Демо: регистрация прошла успешно.");
  }

  return (
    <section className="glass auth-shell">
      <header className="auth-header">
        <h2>Личный кабинет</h2>
        <p>Вход и регистрация в едином модуле доступа к энциклопедии.</p>
      </header>

      <div className="auth-tabs" role="tablist" aria-label="Переключение формы">
        <button type="button" className="active" role="tab" aria-selected="true">Вход</button>
        <button type="button" role="tab" aria-selected="false">Регистрация</button>
      </div>

      <div className="auth-columns">
        <form className="glass auth-column" onSubmit={handleLoginSubmit}>
          <h3>Вход в аккаунт</h3>
          <label>
            Email
            <input
              type="email"
              value={login.email}
              onChange={(event) => setLogin((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="example@mail.com"
            />
          </label>
          <label>
            Пароль
            <input
              type="password"
              value={login.password}
              onChange={(event) => setLogin((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="********"
            />
          </label>
          <button type="submit" className="btn-primary">Войти</button>
        </form>

        <form className="glass auth-column" onSubmit={handleRegisterSubmit}>
          <h3>Создать аккаунт</h3>
          <label>
            Имя
            <input
              type="text"
              value={register.name}
              onChange={(event) => setRegister((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="botanist_2026"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={register.email}
              onChange={(event) => setRegister((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="example@mail.com"
            />
          </label>
          <label>
            Пароль
            <input
              type="password"
              value={register.password}
              onChange={(event) => setRegister((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="минимум 8 символов"
            />
          </label>
          <label>
            Повтор пароля
            <input
              type="password"
              value={register.confirmPassword}
              onChange={(event) => setRegister((prev) => ({ ...prev, confirmPassword: event.target.value }))}
              placeholder="повтори пароль"
            />
          </label>
          <button type="submit" className="btn-primary">Зарегистрироваться</button>
        </form>
      </div>

      {message && <p className="form-message">{message}</p>}
    </section>
  );
}

export default AuthPage;
