# Карта кода (для объяснения на защите)

## Клиент (`exoflowers-client/src`)

- `main.jsx` — точка входа React-приложения, подключает роутер и глобальные стили.
- `App.jsx` — маршруты страниц (`/`, `/catalog`, `/catalog/:slug`, `/auth`, `/admin`).
- `index.css` — все визуальные стили (liquid-glass, layout, адаптив).

### Компоненты

- `components/Layout.jsx` — общий каркас сайта: фон, шапка, меню, контейнер для страниц.
- `components/PlantCard.jsx` — карточка растения для каталога.

### Страницы

- `pages/HomePage.jsx` — главная: hero, аудитория, возможности, итоговый блок.
- `pages/CatalogPage.jsx` — каталог: поиск, фильтры, сетка карточек.
- `pages/PlantDetailPage.jsx` — детальная страница растения.
- `pages/AuthPage.jsx` — интерфейс входа/регистрации (демо-логика форм).
- `pages/AdminPage.jsx` — демо-CRUD интерфейс для добавления/удаления записей.
- `pages/NotFoundPage.jsx` — 404-страница.

### API-слой клиента

- `api/plantsApi.js` — функции HTTP-запросов к backend (`fetchPlants`, `fetchPlant`, `createPlant`, `deletePlant`).

## Сервер (`exoflowers-server/src`)

- `server.js` — Express-приложение, описывает REST-эндпоинты.
- `db.js` — подключение к PostgreSQL при наличии `DATABASE_URL`.
- `data/plants.js` — fallback-данные для работы без БД.
- `services/plantsService.js` — бизнес-логика: фильтрация, поиск, получение по slug, CRUD.


## Что оставлено специально

- `AuthPage.jsx` и `AdminPage.jsx` оставлены, так как они покрывают требования по функционалу и клиентской логике.
- `db.js` + fallback в `plantsService.js` оставлены, чтобы проект запускался и с PostgreSQL, и без PostgreSQL.
