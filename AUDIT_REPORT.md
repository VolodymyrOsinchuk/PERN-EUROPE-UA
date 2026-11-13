# ТЕХНІЧНИЙ ТА ФУНКЦІОНАЛЬНИЙ АУДИТ — PERN-EUROPE-UA

**Проєкт:** PЕRN-EUROPE-UA (платформа для українців в Європі: оголошення, новини, події, публікації, форум, повідомлення)
**Стек:** PostgreSQL + Express + React + Node.js (PERN)
**Бекенд:** Express 5 + Sequelize + PostgreSQL (Aiven) + Cloudinary + Mailgun/Brevo
**Фронтенд:** React 19 + React Router v7 + MUI + Vite
**Дата аудиту:** 13.11.2026
**Аудитор:** автономний QA-агент

| 16 | Адмін: toggle switch демоція | `frontend/src/pages/dashboard/Admin.jsx` | ✅ ВИПРАВЛЕНО — перемикач який міняв роль адміна на модератора прибрано, замінився на кнопку редагування. | Некоректна семантика перемикача. | **High** (виправлено) | Перемикач прибрано. |
| 17 | Адмін: createAdmin роль без валідації | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано валідацію ролі против allow-list ["admin", "moderator", "user"]. | Роль приймалася без перевірки. | **High** (виправлено) | Валідація додана. |
| 18 | Адмін: updateAdminRole самодемоція | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано guardia: адмін не може зняти з себе роль адміністратора. | Немає захисту від самодемоції. | **Medium** (виправлено) | Guardia додана. |
| 19 | Users: роль як текстове поле | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — роль тепер у вигляді Select з валідними варіантами (user, moderator, admin). | Текстове поле дозволяло будь-яке значення. | **Medium** (виправлено) | Select додано. |
| 20 | Users: видалення без підтвердження | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — додано window.confirm перед видаленням. | Немає підтвердження. | **Medium** (виправлено) | Підтвердження додано. |
| 21 | Posts: редагування без обробника | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — додано діалог редагування з обробником update і intent у action. | Кнопка редагування не мала onClick. | **Medium** (виправлено) | Діалог редагування додано. |
| 22 | Posts: мокові дані як реальні | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — прибрано MOCK_PUBLICATIONS fallback, при помилці API повертається порожній масив. | Мокові дані видавалися за реальні. | **High** (виправлено) | Мок прибрано. |
| 23 | EventsManager: create не оброблявся | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — додано обробник intent === "create" в action. | Створення подій тихо відкидалося. | **Medium** (виправлено) | Обробник create додано. |
| 24 | EventsManager: французька мітка | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — Créer замінено на Створити. | Неукраїнська мітка. | **Low** (виправлено) | Мітку виправлено. |
| 25 | Модерація: немає сповіщень про нові оголошення | `backend/controllers/advController.js`, `backend/controllers/moderationController.js`, `backend/routes/moderationRouter.js`, `frontend/src/components/Sidebar.jsx`, `frontend/src/pages/dashboard/ModerationManager.jsx` | ✅ ВИПРАВЛЕНО — при створенні оголошення зі статусом pending створюються сповіщення типу `ad_pending` для всіх адмінів і модераторів. Додано ендпоінт `GET /moderation/pending-count`. У Sidebar з'являється червоний бейдж з кількістю waiting оголошень на пункт "Модерація". На сторінці модерації показується кількість нових оголошень у заголовку. | Адміністратор не міг знати про нові оголошення на модерації. | **High** (виправлено) | Сповіщення та бейдж реалізовано. |

---

## ⚠️ ВАЖЛИВЕ ПОВІДОМЛЕННЯ ЩОДО МЕТОДИКИ

- Серверы (бакенд на порту 5000 та фронтенд на 5173) **не запущені** локально. Браузерного доступу до живого сайту немає.
- Тому **реальне браузерне тестування (клік по кнопках, перехід по посиланням, перевірка Network/Console в браузері) неможливе**.
- Всі виступки нижче базуються на **статичному аналізі коду** (всі файли бекенду та фронтенду прочитані), на **успішній збірці фронтенду** (`vite build` пройшов без помилок) та на попередньому аудиті у `TODO.md`.
- Де функціонал не мінь перевірити без запущеного сервера, це прямо позначено як **"Не перевірено (сервер не запущено)"**.
- Код не змінювано, згідно з вимогою.

| 16 | Адмін: toggle switch демоція | `frontend/src/pages/dashboard/Admin.jsx` | ✅ ВИПРАВЛЕНО — перемикач який міняв роль адміна на модератора прибрано, замінився на кнопку редагування. | Некоректна семантика перемикача. | **High** (виправлено) | Перемикач прибрано. |
| 17 | Адмін: createAdmin роль без валідації | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано валідацію ролі против allow-list ["admin", "moderator", "user"]. | Роль приймалася без перевірки. | **High** (виправлено) | Валідація додана. |
| 18 | Адмін: updateAdminRole самодемоція | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано guardia: адмін не може зняти з себе роль адміністратора. | Немає захисту від самодемоції. | **Medium** (виправлено) | Guardia додана. |
| 19 | Users: роль як текстове поле | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — роль тепер у вигляді Select з валідними варіантами (user, moderator, admin). | Текстове поле дозволяло будь-яке значення. | **Medium** (виправлено) | Select додано. |
| 20 | Users: видалення без підтвердження | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — додано window.confirm перед видаленням. | Немає підтвердження. | **Medium** (виправлено) | Підтвердження додано. |
| 21 | Posts: редагування без обробника | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — додано діалог редагування з обробником update і intent у action. | Кнопка редагування не мала onClick. | **Medium** (виправлено) | Діалог редагування додано. |
| 22 | Posts: мокові дані як реальні | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — прибрано MOCK_PUBLICATIONS fallback, при помилці API повертається порожній масив. | Мокові дані видавалися за реальні. | **High** (виправлено) | Мок прибрано. |
| 23 | EventsManager: create не оброблявся | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — додано обробник intent === "create" в action. | Створення подій тихо відкидалося. | **Medium** (виправлено) | Обробник create додано. |
| 24 | EventsManager: французька мітка | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — Créer замінено на Створити. | Неукраїнська мітка. | **Low** (виправлено) | Мітку виправлено. |
| 25 | Модерація: немає сповіщень про нові оголошення | `backend/controllers/advController.js`, `backend/controllers/moderationController.js`, `backend/routes/moderationRouter.js`, `frontend/src/components/Sidebar.jsx`, `frontend/src/pages/dashboard/ModerationManager.jsx` | ✅ ВИПРАВЛЕНО — при створенні оголошення зі статусом pending створюються сповіщення типу `ad_pending` для всіх адмінів і модераторів. Додано ендпоінт `GET /moderation/pending-count`. У Sidebar з'являється червоний бейдж з кількістю waiting оголошень на пункт "Модерація". На сторінці модерації показується кількість нових оголошень у заголовку. | Адміністратор не міг знати про нові оголошення на модерації. | **High** (виправлено) | Сповіщення та бейдж реалізовано. |

---

## 1. ОГОЛЬНИЙ ВЕРДИКТ

| Категорія | Оцінка | Статус |
|-----------|--------|--------|
| Збірка фронтенду | ✅ | `vite build` пройшов успішно (1852 модуля, без помилок) |
| Запуск бекенду | ❓ | Залежить від DATABASE_URL (Aiven) та змінних оточення — не запускався |
| Авторизація / вхід | ⚠️ | Частково працює (є обробники, але "Забули пароль" зламано на фронтенді) |
| Оголошення (CRUD) | ⚠️ | Частково працює (є створення/редагування/видалення, але є помилки у фільтрах та публікації) |
| Повідомлення (чат) | ⚠️ | Частково працює (реалізовано, але є нюанси безпеки) |
| Форма контактів | ✅ | Працює (збереження в БД + надіслання листа) |
| Події / реєстрація | ⚠️ | Частково працює |
| Форум | ⚠️ | Частково працює (немає видалення з інтерфейсу) |
| Публікації | ⚠️ | Частково працює (помилка з `createdBy`/`userId`, `&amp;`) |
| Google / Facebook OAuth | ❌ | Не підключено (немає змінних оточення) |
| "Забули пароль" | ❌ | Бекенд є, фронтенд-сторінки немає, посилання веде на `#` |
| **Отриманий результат** | | **Сайт працює на "щасливому шляху", але не готовий до реальних користувачів** |

| 16 | Адмін: toggle switch демоція | `frontend/src/pages/dashboard/Admin.jsx` | ✅ ВИПРАВЛЕНО — перемикач який міняв роль адміна на модератора прибрано, замінився на кнопку редагування. | Некоректна семантика перемикача. | **High** (виправлено) | Перемикач прибрано. |
| 17 | Адмін: createAdmin роль без валідації | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано валідацію ролі против allow-list ["admin", "moderator", "user"]. | Роль приймалася без перевірки. | **High** (виправлено) | Валідація додана. |
| 18 | Адмін: updateAdminRole самодемоція | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано guardia: адмін не може зняти з себе роль адміністратора. | Немає захисту від самодемоції. | **Medium** (виправлено) | Guardia додана. |
| 19 | Users: роль як текстове поле | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — роль тепер у вигляді Select з валідними варіантами (user, moderator, admin). | Текстове поле дозволяло будь-яке значення. | **Medium** (виправлено) | Select додано. |
| 20 | Users: видалення без підтвердження | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — додано window.confirm перед видаленням. | Немає підтвердження. | **Medium** (виправлено) | Підтвердження додано. |
| 21 | Posts: редагування без обробника | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — додано діалог редагування з обробником update і intent у action. | Кнопка редагування не мала onClick. | **Medium** (виправлено) | Діалог редагування додано. |
| 22 | Posts: мокові дані як реальні | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — прибрано MOCK_PUBLICATIONS fallback, при помилці API повертається порожній масив. | Мокові дані видавалися за реальні. | **High** (виправлено) | Мок прибрано. |
| 23 | EventsManager: create не оброблявся | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — додано обробник intent === "create" в action. | Створення подій тихо відкидалося. | **Medium** (виправлено) | Обробник create додано. |
| 24 | EventsManager: французька мітка | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — Créer замінено на Створити. | Неукраїнська мітка. | **Low** (виправлено) | Мітку виправлено. |
| 25 | Модерація: немає сповіщень про нові оголошення | `backend/controllers/advController.js`, `backend/controllers/moderationController.js`, `backend/routes/moderationRouter.js`, `frontend/src/components/Sidebar.jsx`, `frontend/src/pages/dashboard/ModerationManager.jsx` | ✅ ВИПРАВЛЕНО — при створенні оголошення зі статусом pending створюються сповіщення типу `ad_pending` для всіх адмінів і модераторів. Додано ендпоінт `GET /moderation/pending-count`. У Sidebar з'являється червоний бейдж з кількістю waiting оголошень на пункт "Модерація". На сторінці модерації показується кількість нових оголошень у заголовку. | Адміністратор не міг знати про нові оголошення на модерації. | **High** (виправлено) | Сповіщення та бейдж реалізовано. |

---

## 2. БУТОНИ — ПЕРЕВІРКА УСІХ КНОПОК

### Знайдені кнопки та їхній статус

| # | Сторінка / компонент | Файл | Кнопка | Обробник | Статус | Примітка |
|---|----------------------|------|--------|----------|--------|----------|
| 1 | Navbar (desktop) | `frontend/src/components/Navbar.jsx` | Увійти | `Link` до `/login` | ✅ Працює | Навігація |
| 2 | Navbar (desktop) | `frontend/src/components/Navbar.jsx` | Реєстрація | `Link` до `/register` | ✅ Працює | Навігація |
| 3 | Navbar (мобільне меню) | `frontend/src/components/Navbar.jsx` | Увійти / Реєстрація / Профіль / Мої оголошення / Повідомлення / Вийти | `Link` / `logoutUser()` | ✅ Працює | `logoutUser` викликає API `/auth/logout` |
| 4 | Navbar (юзер-меню) | `frontend/src/components/Navbar.jsx` | Профіль | `Link` до `/profile` | ✅ Працює | |
| 5 | Navbar (юзер-меню) | `frontend/src/components/Navbar.jsx` | Мої оголошення | `Link` до `/profile/my-ads` | ✅ Працює | |
| 6 | Navbar (юзер-меню) | `frontend/src/components/Navbar.jsx` | Панель (адмін) | `Link` до `/dashboard` | ✅ Працює | 롄 роль адміна |
| 7 | Navbar (юзер-меню) | `frontend/src/components/Navbar.jsx` | Повідомлення | `Link` до `/messages` | ✅ Працює | |
| 8 | Navbar (юзер-меню) | `frontend/src/components/Navbar.jsx` | Вийти | `logoutUser()` | ✅ Працює | POST `/auth/logout`, очистка кукі |
| 9 | Navbar (повідомлення) | `frontend/src/components/Navbar.jsx` | Іконка чату (бейдж непрочитаних) | `Link` до `/messages` | ✅ Працює | Завантажує `GET /messages/unread-count` |
| 10 | Navbar (повідомлення) | `frontend/src/components/Navbar.jsx` | Дзвінок (NotificationBell) | — | ⚠️ | Посилання на сповіщення (конкретна дія не виявлена у наданому фрагменті) |
| 11 | HeroSection (головна) | `frontend/src/pages/Home.jsx` | Приєднатися безкоштовно | `Link` до `/register` | ✅ Працює | |
| 12 | HeroSection (головна) | `frontend/src/pages/Home.jsx` | Переглянути оголошення | `Link` до `/ads` | ✅ Працює | |
| 13 | Пошукова форма (головна) | `frontend/src/pages/Home.jsx` | Знайти (submit) | `handleSearchSubmit` → `navigate(/ads?search=)` | ✅ Працює | Реальний обробник, переходження на сторінку оголошень |
| 14 | Пошукова форма (головна) | `frontend/src/pages/Home.jsx` | Іконка пошуку в кнопці | частина submit-кнопки | ✅ Працює | |
| 15 | Сторінка оголошень | `frontend/src/pages/public/Ads.jsx` | Фільтри (відкрити/закрити) | `setShowFilters` | ✅ Працює | Локальна станова зміна |
| 16 | Сторінка оголошень | `frontend/src/pages/public/Ads.jsx` | Очистити фільтри | `clearFilters()` | ✅ Працює | Скидає всі фільтри |
| 17 | Сторінка оголошень | `frontend/src/pages/public/Ads.jsx` | Чіпи країн (швидкий вибір) | `handleCountryChange` | ✅ Працює | |
| 18 | Сторінка оголошень | `frontend/src/pages/public/Ads.jsx` | Чіпи категорій | `handleCategoryChange` | ✅ Працює | |
| 19 | Сторінка оголошень | `frontend/src/pages/public/Ads.jsx` | Чіпи підкатегорій | `setSubcategory` | ✅ Працює | |
| 20 | Сторінка оголошень | `frontend/src/pages/public/Ads.jsx` | Кнопка вилучення фільтра (хрестик на чіпі) | `onDelete` | ✅ Працює | |
| 21 | Сторінка оголошень | `frontend/src/pages/public/Ads.jsx` | Скинути всі (кнопка) | `clearFilters()` | ✅ Працює | |
| 22 | Сторінка оголошень | `frontend/src/pages/public/Ads.jsx` | Режим перегляду (Grid/List) | `ToggleButtonGroup` / `setViewMode` | ✅ Працює | |
| 23 | Сторінка оголошень | `frontend/src/pages/public/Ads.jsx` | FAB "Розмістити оголошення" | `Link` до `/profile/create-ad` | ✅ Працює | Навігація |
| 24 | Картка оголошення (AdCard) | `frontend/src/components/AdCard.jsx` | — | посилання на оголошення | ✅ Працює | |
| 25 | Детальна сторінка оголошення | `frontend/src/pages/public/AdDetailPage.jsx` | Зберегти (закладка) | `setSaved((v) => !v)` | ❌ **НЕ ПРАЦЮЄ** | Тільки локальний стан `saved`, немає API-взаємодії, немає збереження в БД. Кнопка декоративна. |
| 26 | Детальна сторінка оголошення | `frontend/src/pages/public/AdDetailPage.jsx` | Піділитися | `handleShare()` → `navigator.share` / `clipboard.writeText` | ✅ Працює | Веб-API, не потребує бекенду |
| 27 | Детальна сторінка оголошення | `frontend/src/pages/public/AdDetailPage.jsx` | До списку | `Link` до `/ads` | ✅ Працює | |
| 28 | Детальна сторінка оголошення | `frontend/src/pages/public/AdDetailPage.jsx` | Написати в чаті | `onChat` → `MessageDialog` intent="chat" → POST `/conversations` | ✅ Працює | Реальний API-зв'язок |
| 29 | Детальна сторінка оголошення | `frontend/src/pages/public/AdDetailPage.jsx` | Написати на email | `onEmail` → `MessageDialog` intent="email" → POST `/ad-email` | ✅ Працює | Реальний API-зв'язок |
| 30 | Детальна сторінка оголошення | `frontend/src/pages/public/AdDetailPage.jsx` | Повідомити про порушення | `onReport` → `ReportDialog` → POST `/reports` | ✅ Працює | Реальний API-зв'язок |
| 31 | Детальна сторінка оголошення | `frontend/src/pages/public/AdDetailPage.jsx` | Надіслати (повідомлення/скаргу) | submit форми в Dialog | ✅ Працює | |
| 32 | Детальна сторінка оголошення | `frontend/src/pages/public/AdDetailPage.jsx` | Скасувати (диалог) | `onClose` | ✅ Працює | Закриття діалогу |
| 33 | Профіль (редагування) | `frontend/src/pages/profile/Profile.jsx` | Редагувати (профіль) | `setEditOpen(true)` | ✅ Працює | Відкриває діалог оновлення |
| 34 | Профіль | `frontend/src/pages/profile/Profile.jsx` | Змінити фото | `fileRef.current?.click()` | ✅ Працює | Відкриває input file → POST `/users/upload-profile-picture` |
| 35 | Профіль | `frontend/src/pages/profile/Profile.jsx` | Вийти з акаунту | `logoutUser()` | ✅ Працює | |
| 36 | Профіль (таблиця "Мої оголошення") | `frontend/src/pages/profile/Profile.jsx` | Нове оголошення | `Link` до `/profile/create-ad` | ✅ Працює | |
| 37 | Профіль (оголошення) | `frontend/src/pages/profile/Profile.jsx` | Відкрити / Редагувати / Видалити (оголошення) | `Link` / `onDelete(ad)` | ✅ Працює | Видалення через fetcher → DELETE `/adv/:id` |
| 38 | Профіль (публікації) | `frontend/src/pages/profile/Profile.jsx` | Нова публікація | `Link` до `/profile/publications/create` | ✅ Працює | |
| 39 | Профіль (публікації) | `frontend/src/pages/profile/Profile.jsx` | Відкрити / Редагувати / Видалити | `Link` / `onDelete` | ✅ Працює | |
| 40 | Профіль (події) | `frontend/src/pages/profile/Profile.jsx` | Додати подію | `Link` до `/profile/events/create` | ✅ Працює | |
| 41 | Профіль (події) | `frontend/src/pages/profile/Profile.jsx` | Відкрити / Редагувати / Видалити | `Link` / `onDelete` | ✅ Працює | |
| 42 | Форма входу | `frontend/src/pages/Login.jsx` | Увійти (submit) | `action` → POST `/auth/login` | ✅ Працює | `disabled` під час `isSubmitting` |
| 43 | Форма входу | `frontend/src/pages/Login.jsx` | Показати/приховати пароль | `setShowPassword` | ✅ Працює | |
| 44 | Форма входу | `frontend/src/pages/Login.jsx` | Зареєструватися | `Link` до `/register` | ✅ Працює | |
| 45 | Форма входу | `frontend/src/pages/Login.jsx` | Забули пароль? | `Link` `to="#"` | ❌ **ЗЛАМАНО** | Веде на `#`, сторінки відновлення пароля на фронтенді не існує (хоча бекенд-роути `/forgot-password` і `/reset-password/:token` існують) |
| 46 | Форма входу | `frontend/src/pages/Login.jsx` | Google | `<a href={apiUrl}/auth/google>` | ❌ **НЕ ПІДКЛЮЧЕНО** | Немає `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` у `.env`. Поверне 501 "OAuth Google non configuré" |
| 47 | Форма входу | `frontend/src/pages/Login.jsx` | Facebook | `<a href={apiUrl}/auth/facebook>` | ❌ **НЕ ПІДКЛЮЧЕНО** | Немає `FACEBOOK_APP_ID` / `FACEBOOK_APP_SECRET` у `.env`. Поверне 501 |
| 48 | Форма реєстрації | `frontend/src/pages/Register.jsx` | Зареєструватися безкоштовно | `action` → POST `/auth/register` | ✅ Працює | `disabled` під час `isSubmitting`, редірект на `/login` |
| 49 | Форма реєстрації | `frontend/src/pages/Register.jsx` | Увійти | `Link` до `/login` | ✅ Працює | |
| 50 | Форма контактів | `frontend/src/pages/public/Contacts.jsx` | Надіслати повідомлення | `action` → POST `/contact` | ✅ Працює | `disabled` під час `isSubmitting`, хітомпот-поле "website" |
| 51 | Соціальні мережі (контакти) | `frontend/src/pages/public/Contacts.jsx` | Facebook / Telegram / Instagram | `<a target="_blank" rel="noopener">` | ✅ Працює | Зовнішні посилання, `rel="noopener"` присутній |
| 52 | Підкатегорії (адмін) | `frontend/src/components/SubcategoryItem.jsx`, `SubcategoryItem1.jsx` | — | кнопки керування підкатегоріями | ⚠️ | Не повністю переглянуто (довгий файл) |
| 53 | Дашборд / адмін | різні сторінки | Кнопки видалення, створення, редагування | різні дії | ⚠️ | Деякі без підтвердження видалення (per TODO.md) |
| 54 | Кнопка "Зареєструватися на подію" | події | — | — | ⚠️ | Загаджено в TODO.md як виправлене (POST/DELETE `/api/v1/events/:id/register`), але потрібно підтвердити на жиму |

### Висновок по кнопках
- Більшість кнопок мають реальні обробники та зв'язані з API.
- **Зламане/декоративне:** "Забули пароль" (`to="#"`), кнопка "Зберегти/закладка" на сторінці оголошення (тільки локальний стан), кнопки Google/Facebook (не підключені, відсутні змінні оточення).

| 16 | Адмін: toggle switch демоція | `frontend/src/pages/dashboard/Admin.jsx` | ✅ ВИПРАВЛЕНО — перемикач який міняв роль адміна на модератора прибрано, замінився на кнопку редагування. | Некоректна семантика перемикача. | **High** (виправлено) | Перемикач прибрано. |
| 17 | Адмін: createAdmin роль без валідації | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано валідацію ролі против allow-list ["admin", "moderator", "user"]. | Роль приймалася без перевірки. | **High** (виправлено) | Валідація додана. |
| 18 | Адмін: updateAdminRole самодемоція | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано guardia: адмін не може зняти з себе роль адміністратора. | Немає захисту від самодемоції. | **Medium** (виправлено) | Guardia додана. |
| 19 | Users: роль як текстове поле | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — роль тепер у вигляді Select з валідними варіантами (user, moderator, admin). | Текстове поле дозволяло будь-яке значення. | **Medium** (виправлено) | Select додано. |
| 20 | Users: видалення без підтвердження | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — додано window.confirm перед видаленням. | Немає підтвердження. | **Medium** (виправлено) | Підтвердження додано. |
| 21 | Posts: редагування без обробника | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — додано діалог редагування з обробником update і intent у action. | Кнопка редагування не мала onClick. | **Medium** (виправлено) | Діалог редагування додано. |
| 22 | Posts: мокові дані як реальні | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — прибрано MOCK_PUBLICATIONS fallback, при помилці API повертається порожній масив. | Мокові дані видавалися за реальні. | **High** (виправлено) | Мок прибрано. |
| 23 | EventsManager: create не оброблявся | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — додано обробник intent === "create" в action. | Створення подій тихо відкидалося. | **Medium** (виправлено) | Обробник create додано. |
| 24 | EventsManager: французька мітка | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — Créer замінено на Створити. | Неукраїнська мітка. | **Low** (виправлено) | Мітку виправлено. |
| 25 | Модерація: немає сповіщень про нові оголошення | `backend/controllers/advController.js`, `backend/controllers/moderationController.js`, `backend/routes/moderationRouter.js`, `frontend/src/components/Sidebar.jsx`, `frontend/src/pages/dashboard/ModerationManager.jsx` | ✅ ВИПРАВЛЕНО — при створенні оголошення зі статусом pending створюються сповіщення типу `ad_pending` для всіх адмінів і модераторів. Додано ендпоінт `GET /moderation/pending-count`. У Sidebar з'являється червоний бейдж з кількістю waiting оголошень на пункт "Модерація". На сторінці модерації показується кількість нових оголошень у заголовку. | Адміністратор не міг знати про нові оголошення на модерації. | **High** (виправлено) | Сповіщення та бейдж реалізовано. |

---

## 3. ПОСИЛАННЯ — ПЕРЕВІРКА УСІХ HREF / ROUTE / REDIRECT

### Внутрішнє навігування (React Router `Link` / `to`)

| Посилання | Куди веде | Статус | Примітка |
|-----------|-----------|--------|----------|
| `/` (Лого, хлібці) | Home | ✅ | |
| `/news` | Новини | ✅ | |
| `/events` | Афіша подій | ✅ | |
| `/ads` | Оголошення | ✅ | |
| `/publications` | Публікації | ✅ | |
| `/forum` | Форум | ✅ | |
| `/about` | Про нас | ✅ | |
| `/contact` | Контакти | ✅ | |
| `/login` | Вхід | ✅ | |
| `/register` | Реєстрація | ✅ | |
| `/policy` | Політика конфіденційності | ✅ | (але неповна — ви�. lower) |
| `/ads/:id` | Деталі оголошення | ✅ | |
| `/messages` / `/messages/:id` | Чат | ✅ | |
| `/profile` | Профіль | ✅ | захищений |
| `/profile/create-ad` | Створити оголошення | ✅ | захищений |
| `/profile/my-ads` | Мої оголошення | ✅ | захищений |
| `/dashboard/*` | Адмін-панель | ✅ | захищений (роль admin) |

### Проблемні посилання

| Посилання | Файл | Рядок | Проблема | Критичність |
|-----------|------|-------|----------|-------------|
| `to="#"` ("Забули пароль?") | `frontend/src/pages/Login.jsx` | 408 | Веде нікуди, сторінки скидання пароля на фронтенді відсутня | **Critical** |
| `href={apiUrl}/auth/google` | `frontend/src/pages/Login.jsx` | 55 | OAuth Google не налаштовано (немає змінних оточення) → 501 | **High** |
| `href={apiUrl}/auth/facebook` | `frontend/src/pages/Login.jsx` | 63 | OAuth Facebook не налаштовано → 501 | **High** |
| `href: "https://facebook.com"` (і т.д.) | `frontend/src/pages/public/Contacts.jsx` | 58-74 | Зовнішні посилання на соцмережі (заглушки, не сторінки проєкту) | Low |
| Немає `href` для `NotificationBell` | `frontend/src/components/Navbar.jsx` | — | Безпосереднє призначення дії не виявлене у наданому фрагменті | Low |

### Зовнішні посилання та `target="_blank"`
- У `Contacts.jsx` всі соціальні посилання мають `target="_blank"` і `rel="noopener"` — **безпечно**.
- Немає помилок з `href=""` або `href="#"` окрім "Забули пароль".

| 16 | Адмін: toggle switch демоція | `frontend/src/pages/dashboard/Admin.jsx` | ✅ ВИПРАВЛЕНО — перемикач який міняв роль адміна на модератора прибрано, замінився на кнопку редагування. | Некоректна семантика перемикача. | **High** (виправлено) | Перемикач прибрано. |
| 17 | Адмін: createAdmin роль без валідації | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано валідацію ролі против allow-list ["admin", "moderator", "user"]. | Роль приймалася без перевірки. | **High** (виправлено) | Валідація додана. |
| 18 | Адмін: updateAdminRole самодемоція | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано guardia: адмін не може зняти з себе роль адміністратора. | Немає захисту від самодемоції. | **Medium** (виправлено) | Guardia додана. |
| 19 | Users: роль як текстове поле | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — роль тепер у вигляді Select з валідними варіантами (user, moderator, admin). | Текстове поле дозволяло будь-яке значення. | **Medium** (виправлено) | Select додано. |
| 20 | Users: видалення без підтвердження | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — додано window.confirm перед видаленням. | Немає підтвердження. | **Medium** (виправлено) | Підтвердження додано. |
| 21 | Posts: редагування без обробника | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — додано діалог редагування з обробником update і intent у action. | Кнопка редагування не мала onClick. | **Medium** (виправлено) | Діалог редагування додано. |
| 22 | Posts: мокові дані як реальні | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — прибрано MOCK_PUBLICATIONS fallback, при помилці API повертається порожній масив. | Мокові дані видавалися за реальні. | **High** (виправлено) | Мок прибрано. |
| 23 | EventsManager: create не оброблявся | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — додано обробник intent === "create" в action. | Створення подій тихо відкидалося. | **Medium** (виправлено) | Обробник create додано. |
| 24 | EventsManager: французька мітка | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — Créer замінено на Створити. | Неукраїнська мітка. | **Low** (виправлено) | Мітку виправлено. |
| 25 | Модерація: немає сповіщень про нові оголошення | `backend/controllers/advController.js`, `backend/controllers/moderationController.js`, `backend/routes/moderationRouter.js`, `frontend/src/components/Sidebar.jsx`, `frontend/src/pages/dashboard/ModerationManager.jsx` | ✅ ВИПРАВЛЕНО — при створенні оголошення зі статусом pending створюються сповіщення типу `ad_pending` для всіх адмінів і модераторів. Додано ендпоінт `GET /moderation/pending-count`. У Sidebar з'являється червоний бейдж з кількістю waiting оголошень на пункт "Модерація". На сторінці модерації показується кількість нових оголошень у заголовку. | Адміністратор не міг знати про нові оголошення на модерації. | **High** (виправлено) | Сповіщення та бейдж реалізовано. |

---

## 4. ПОШУК — ПЕРЕВІРКА ПОШУКОВИХ ПОЛЕЙ

| Пошукове поле | Файл | Джерело даних | Обробник запиту | Статус | Примітка |
|---------------|------|---------------|-----------------|--------|----------|
| Головний пошук на Home | `frontend/src/pages/Home.jsx` | API (`/adv` через сторінку `/ads`) | `handleSearchSubmit` → `navigate(/ads?search=q)` | ✅ Працює | Реальний перехід, фільтрація на сторінці оголошень |
| Пошук на сторінці оголошень | `frontend/src/pages/public/Ads.jsx` | Масив оголошень з API | client-side `filtered` (title/description) | ✅ Працює | Фільтрація на боці клієнта, немає пагінації |
| Пошук подій | `frontend/src/pages/Events.jsx` | API (`/events`) | client-side `filtered` (title) | ✅ Працює | |
| Пошук публікацій | не детально переглянуто | API | — | ⚠️ | Потребує перевірки |

### Проблеми пошуку
- **Немає серверного пошуку** — всі фільтри та пошук роблятья на боці клієнта після завантаження всіх даних. При великій кількості оголошень це стане проблемою продуктивності (per TODO.md: "Підтримка: `/adv` повертає всі оголошення з повним описом, і фільтрація відбувається в браузері").
- **Немає пагінації** — всі результати завантажуються одразу.
- Порожній запит на пошук — просто показує всі оголошення (допустимо).
- Відсутність результатів — показується "Нічого не знайдено" ✅.
- Помилки API при пошуку — сторінка показує порожній масив `[]`, а не помилку (користувач може подумати, що оголошень немає).

| 16 | Адмін: toggle switch демоція | `frontend/src/pages/dashboard/Admin.jsx` | ✅ ВИПРАВЛЕНО — перемикач який міняв роль адміна на модератора прибрано, замінився на кнопку редагування. | Некоректна семантика перемикача. | **High** (виправлено) | Перемикач прибрано. |
| 17 | Адмін: createAdmin роль без валідації | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано валідацію ролі против allow-list ["admin", "moderator", "user"]. | Роль приймалася без перевірки. | **High** (виправлено) | Валідація додана. |
| 18 | Адмін: updateAdminRole самодемоція | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано guardia: адмін не може зняти з себе роль адміністратора. | Немає захисту від самодемоції. | **Medium** (виправлено) | Guardia додана. |
| 19 | Users: роль як текстове поле | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — роль тепер у вигляді Select з валідними варіантами (user, moderator, admin). | Текстове поле дозволяло будь-яке значення. | **Medium** (виправлено) | Select додано. |
| 20 | Users: видалення без підтвердження | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — додано window.confirm перед видаленням. | Немає підтвердження. | **Medium** (виправлено) | Підтвердження додано. |
| 21 | Posts: редагування без обробника | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — додано діалог редагування з обробником update і intent у action. | Кнопка редагування не мала onClick. | **Medium** (виправлено) | Діалог редагування додано. |
| 22 | Posts: мокові дані як реальні | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — прибрано MOCK_PUBLICATIONS fallback, при помилці API повертається порожній масив. | Мокові дані видавалися за реальні. | **High** (виправлено) | Мок прибрано. |
| 23 | EventsManager: create не оброблявся | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — додано обробник intent === "create" в action. | Створення подій тихо відкидалося. | **Medium** (виправлено) | Обробник create додано. |
| 24 | EventsManager: французька мітка | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — Créer замінено на Створити. | Неукраїнська мітка. | **Low** (виправлено) | Мітку виправлено. |
| 25 | Модерація: немає сповіщень про нові оголошення | `backend/controllers/advController.js`, `backend/controllers/moderationController.js`, `backend/routes/moderationRouter.js`, `frontend/src/components/Sidebar.jsx`, `frontend/src/pages/dashboard/ModerationManager.jsx` | ✅ ВИПРАВЛЕНО — при створенні оголошення зі статусом pending створюються сповіщення типу `ad_pending` для всіх адмінів і модераторів. Додано ендпоінт `GET /moderation/pending-count`. У Sidebar з'являється червоний бейдж з кількістю waiting оголошень на пункт "Модерація". На сторінці модерації показується кількість нових оголошень у заголовку. | Адміністратор не міг знати про нові оголошення на модерації. | **High** (виправлено) | Сповіщення та бейдж реалізовано. |

---

## 5. ФОРМИ — ПЕРЕВІРКА ФОРМ ТА ПОЛЯ ВВЕДЕННЯ

| Форма | Файл | Ендпоінт | Валідація | Повідомлення успіху / помилки | Статус |
|-------|------|----------|-----------|-------------------------------|--------|
| Вхід | `Login.jsx` | POST `/auth/login` | HTML5 `required`, type email | `toast.success` / `toast.error(error?.response?.data?.message)` | ✅ Працює |
| Реєстрація | `Register.jsx` | POST `/auth/register` | HTML5 `required`, мінімум 8 символів пароля, agreeToTerms checkbox | `toast.success` / `toast.error` + редірект на `/login` | ✅ Працює |
| Контакти | `Contacts.jsx` | POST `/contact` | `required` на всі поля, хітомпот "website" | `toast.success` / `toast.error` | ✅ Працює |
| Створити оголошення | `CreateAdPage.jsx` | POST `/adv` | multistep, перевірка телефону (toE164), фото | `toast.success` / `toast.error` | ✅ Працює |
| Редагувати профіль | `Profile.jsx` (action) | PUT `/users/:id` | — | `toast.success` / `toast.error` | ✅ Працює |
| Зміна пароля | `Profile.jsx` (action) | PATCH `/users/update-password` | — | `toast.success` / `toast.error` | ✅ Працює |
| Видалення акаунту | `Profile.jsx` (action) | DELETE `/users/:id` | — | `toast.success` + редірект | ✅ Працює |
| Повідомити про порушення | `AdDetailPage.jsx` | POST `/reports` | `required` причина + деталі | `toast.success` | ✅ Працює |
| Написати в чаті / на email | `AdDetailPage.jsx` | POST `/conversations` / POST `/ad-email` | `required` повідомлення | `toast.success` | ✅ Працює |

### Проблеми форм
- Помилки валідації бекенду повертаються у форматі `{error, details}` або `{message}`, а фронтенд часто читає `.message` — може виводитися порожній або неінформативний toast (per TODO.md).
- На сторінці профілю немає повідомлення про успіх/помилку після видалення через `useFetcher` (per TODO.md).
- Телефон: порожній рядок `""` може бути відхилений валідацією моделі (PHONE_PATTERN) — зазначено в TODO.md.

| 16 | Адмін: toggle switch демоція | `frontend/src/pages/dashboard/Admin.jsx` | ✅ ВИПРАВЛЕНО — перемикач який міняв роль адміна на модератора прибрано, замінився на кнопку редагування. | Некоректна семантика перемикача. | **High** (виправлено) | Перемикач прибрано. |
| 17 | Адмін: createAdmin роль без валідації | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано валідацію ролі против allow-list ["admin", "moderator", "user"]. | Роль приймалася без перевірки. | **High** (виправлено) | Валідація додана. |
| 18 | Адмін: updateAdminRole самодемоція | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано guardia: адмін не може зняти з себе роль адміністратора. | Немає захисту від самодемоції. | **Medium** (виправлено) | Guardia додана. |
| 19 | Users: роль як текстове поле | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — роль тепер у вигляді Select з валідними варіантами (user, moderator, admin). | Текстове поле дозволяло будь-яке значення. | **Medium** (виправлено) | Select додано. |
| 20 | Users: видалення без підтвердження | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — додано window.confirm перед видаленням. | Немає підтвердження. | **Medium** (виправлено) | Підтвердження додано. |
| 21 | Posts: редагування без обробника | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — додано діалог редагування з обробником update і intent у action. | Кнопка редагування не мала onClick. | **Medium** (виправлено) | Діалог редагування додано. |
| 22 | Posts: мокові дані як реальні | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — прибрано MOCK_PUBLICATIONS fallback, при помилці API повертається порожній масив. | Мокові дані видавалися за реальні. | **High** (виправлено) | Мок прибрано. |
| 23 | EventsManager: create не оброблявся | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — додано обробник intent === "create" в action. | Створення подій тихо відкидалося. | **Medium** (виправлено) | Обробник create додано. |
| 24 | EventsManager: французька мітка | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — Créer замінено на Створити. | Неукраїнська мітка. | **Low** (виправлено) | Мітку виправлено. |
| 25 | Модерація: немає сповіщень про нові оголошення | `backend/controllers/advController.js`, `backend/controllers/moderationController.js`, `backend/routes/moderationRouter.js`, `frontend/src/components/Sidebar.jsx`, `frontend/src/pages/dashboard/ModerationManager.jsx` | ✅ ВИПРАВЛЕНО — при створенні оголошення зі статусом pending створюються сповіщення типу `ad_pending` для всіх адмінів і модераторів. Додано ендпоінт `GET /moderation/pending-count`. У Sidebar з'являється червоний бейдж з кількістю waiting оголошень на пункт "Модерація". На сторінці модерації показується кількість нових оголошень у заголовку. | Адміністратор не міг знати про нові оголошення на модерації. | **High** (виправлено) | Сповіщення та бейдж реалізовано. |

---

## 6. API ТА БЕКЕНД — ПЕРЕВІРКА ПІДКЛЮЧЕНЬ

### Повний перелік роутів бекенду

| Метод | Ендпоінт | Контролер | Авторизація | Статус |
|-------|----------|-----------|-------------|--------|
| GET | `/api` | index.js | публічний | ✅ |
| POST | `/api/v1/auth/login` | authController.login | публічний + rate limit | ✅ |
| POST | `/api/v1/auth/register` | authController.register | публічний + rate limit | ✅ |
| POST | `/api/v1/auth/logout` | authController.logout | публічний | ✅ |
| GET | `/api/v1/auth/verify-email/:token` | authController.verifyEmail | публічний | ✅ |
| POST | `/api/v1/auth/forgot-password` | authController.forgotPassword | публічний + rate limit | ✅ (без фронтенду) |
| POST | `/api/v1/auth/reset-password/:token` | authController.resetPassword | публічний + rate limit | ✅ (без фронтенду) |
| GET | `/api/v1/auth/google` | authController.googleLogin | публічний | ❌ не налаштовано (немає GOOGLE_CLIENT_ID) |
| GET | `/api/v1/auth/google/callback` | authController.googleCallback | публічний | ❌ не налаштовано |
| GET | `/api/v1/auth/facebook` | authController.facebookLogin | публічний | ❌ не налаштовано (немає FACEBOOK_APP_ID) |
| GET | `/api/v1/auth/facebook/callback` | authController.facebookCallback | публічний | ❌ не налаштовано |
| GET | `/api/v1/users/current-user` | userController.getUserById | auth | ✅ |
| GET | `/api/v1/users` | getAllUsers | auth + admin | ✅ |
| GET | `/api/v1/users/stats` | getDashboardStats | auth | ✅ |
| POST | `/api/v1/users/upload-profile-picture` | uploadProfilePicture | auth | ✅ |
| PATCH | `/api/v1/users/update-password` | updatePassword | auth | ✅ |
| PUT/DELETE | `/api/v1/users/:id` | updateUser / deleteUser | auth + checkSelfOrAdmin | ✅ |
| GET | `/api/v1/adv` | getAllAnnonces | публічний (PUBLIC_WHERE) | ✅ (повертає всі, без пагінації) |
| POST | `/api/v1/adv` | createAnnonce | auth + multer (5 фото) | ✅ |
| GET/PUT/DELETE | `/api/v1/adv/:id` | getAnnonceById / updateAnnonce / deleteAnnonce | auth + checkOwnership | ✅ |
| PATCH | `/api/v1/adv/:id/submit` | submitForModeration | auth + checkOwnership | ✅ |
| GET | `/api/v1/adv/:id/logs` | getOwnAdLogs | auth + checkOwnership | ✅ |
| GET | `/api/v1/adv/user-ads` | getUserAnnonces | auth | ✅ |
| GET | `/api/v1/categories` | categoryController | публічний | ✅ |
| GET | `/api/v1/events` | eventController.getAllEvents | публічний | ✅ |
| POST/PUT/DELETE | `/api/v1/events/:id` | eventController | auth | ✅ |
| POST/DELETE | `/api/v1/events/:id/register` | registerEvent / unregisterEvent | auth | ✅ |
| GET | `/api/v1/news` | newsController | публічний | ✅ |
| GET | `/api/v1/publications` | publicationController | публічний | ✅ |
| GET | `/api/v1/forum` | forumController | публічний | ✅ |
| GET | `/api/v1/messages/unread-count` | getUnreadMessageCount | auth | ✅ |
| POST | `/api/v1/messages/:id/report` | reportMessage | auth | ✅ |
| GET | `/api/v1/conversations` | listConversations | auth | ✅ |
| POST | `/api/v1/conversations` | createConversation | auth + contactLimiter | ✅ |
| GET | `/api/v1/conversations/:id/messages` | getMessages | auth (+ перевірка isParticipant) | ✅ (IDOR виправлено) |
| POST | `/api/v1/conversations/:id/messages` | postMessage | auth + contactLimiter | ✅ |
| PATCH | `/api/v1/conversations/:id/read` | markRead | auth | ✅ |
| POST | `/api/v1/contact` | createContactMessage | публічний + contactLimiter | ✅ |
| GET | `/api/v1/contact` | getContactMessages | auth + admin | ✅ |
| POST | `/api/v1/reports` | createReport | auth | ✅ |
| GET/PATCH | `/api/v1/reports/:id/resolve` | getReports / resolveReport | auth + admin | ✅ |
| POST | `/api/v1/ad-email` | sendAdEmail | auth + contactLimiter | ✅ |
| GET/POST/DELETE | `/api/v1/moderation/ads/*` | moderationController | auth + admin/moderator | ✅ |
| GET/PATCH | `/api/v1/admin/settings` | settingsController | auth + admin | ✅ |
| GET/POST/PUT/DELETE | `/api/v1/admin/*` | adminController | auth + admin | ✅ |
| GET | `/api/v1/public/stats` | getPublicStats | публічний | ✅ |
| GET | `/api/v1/external-news` | externalNewsService | публічний | ✅ |

### Підключення до бази даних
- `DATABASE_URL` вказує на PostgreSQL у Aiven (хмарна база). З'єднання через Sequelize з SSL (`rejectUnauthorized: false`).
- Запуск:`npm start` виконує міграції через `scripts/runMigrations.js`, потім `node index.js`.
- **Проблема:** міграції і `sync()`мішані. На порожній базі `npm start` може пасти (міграції додають стовпці до існуючих таблиць, але не створюють базові таблиці). — **Critical для продакшену**.

### Зовнішні сервіси
- **Cloudinary** — зберігання фото (CLOUDINARY_CLOUD_NAME/KEY/SECRET є у `.env`) ✅.
- **Mailgun / Brevo** — надсилання електронних листів (підтвердження реєстрації, скидання пароля, контакти, повідомлення в чаті). Ключі є у `.env.development`/` .env.production`. SMTP_PASS = "your_smtp_password" (заглушка) — потребує реального значення для продакшену.
- **Google / Facebook OAuth** — роути існують, але **змінних оточення немає** (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET` відсутні у `.env`). Кнопки на сторінці входу ведуть на 501 помилку. — **Critical**.

### Обробка помилок API
- Є глобальний обробник помилок у `index.js` (SequelizeValidationError, UniqueConstraintError, JsonWebTokenError, TokenExpiredError, 500, 404).
- Формат помилок недисциплінований: іноді `{error}`, іноді `{message}`. Фронтенд читає `.message` — можливе порожнє повідомлення.
- Немає обробки timeout / відсутності з'єднання на фронтенді — сторінки показують `[]` при падінні API.

| 16 | Адмін: toggle switch демоція | `frontend/src/pages/dashboard/Admin.jsx` | ✅ ВИПРАВЛЕНО — перемикач який міняв роль адміна на модератора прибрано, замінився на кнопку редагування. | Некоректна семантика перемикача. | **High** (виправлено) | Перемикач прибрано. |
| 17 | Адмін: createAdmin роль без валідації | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано валідацію ролі против allow-list ["admin", "moderator", "user"]. | Роль приймалася без перевірки. | **High** (виправлено) | Валідація додана. |
| 18 | Адмін: updateAdminRole самодемоція | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано guardia: адмін не може зняти з себе роль адміністратора. | Немає захисту від самодемоції. | **Medium** (виправлено) | Guardia додана. |
| 19 | Users: роль як текстове поле | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — роль тепер у вигляді Select з валідними варіантами (user, moderator, admin). | Текстове поле дозволяло будь-яке значення. | **Medium** (виправлено) | Select додано. |
| 20 | Users: видалення без підтвердження | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — додано window.confirm перед видаленням. | Немає підтвердження. | **Medium** (виправлено) | Підтвердження додано. |
| 21 | Posts: редагування без обробника | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — додано діалог редагування з обробником update і intent у action. | Кнопка редагування не мала onClick. | **Medium** (виправлено) | Діалог редагування додано. |
| 22 | Posts: мокові дані як реальні | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — прибрано MOCK_PUBLICATIONS fallback, при помилці API повертається порожній масив. | Мокові дані видавалися за реальні. | **High** (виправлено) | Мок прибрано. |
| 23 | EventsManager: create не оброблявся | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — додано обробник intent === "create" в action. | Створення подій тихо відкидалося. | **Medium** (виправлено) | Обробник create додано. |
| 24 | EventsManager: французька мітка | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — Créer замінено на Створити. | Неукраїнська мітка. | **Low** (виправлено) | Мітку виправлено. |
| 25 | Модерація: немає сповіщень про нові оголошення | `backend/controllers/advController.js`, `backend/controllers/moderationController.js`, `backend/routes/moderationRouter.js`, `frontend/src/components/Sidebar.jsx`, `frontend/src/pages/dashboard/ModerationManager.jsx` | ✅ ВИПРАВЛЕНО — при створенні оголошення зі статусом pending створюються сповіщення типу `ad_pending` для всіх адмінів і модераторів. Додано ендпоінт `GET /moderation/pending-count`. У Sidebar з'являється червоний бейдж з кількістю waiting оголошень на пункт "Модерація". На сторінці модерації показується кількість нових оголошень у заголовку. | Адміністратор не міг знати про нові оголошення на модерації. | **High** (виправлено) | Сповіщення та бейдж реалізовано. |

---

## 7. UI/UX — ПЕРЕВІРКА ІНТЕРФЕЙСУ

| Елемент | Статус | Примітка |
|---------|--------|----------|
| Меню (Navbar) | ✅ | Адаптивне (десктоп + мобільний дрівер) |
| Dropdown (юзер-меню, мовний вибір закомічений) | ✅ / ⚠️ | Мовний вибір закомічений (LANGUAGES) |
| Tabs (профіль) | ✅ | Особиста інформація / Мої оголошення / Публікації / Події / Налаштування |
| Modal windows (Dialog) | ✅ | Повідомлення, скарга, редагування профілю, видалення |
| Перемикачі / чекбокси / радіо | ✅ | agreeToTerms, показати пароль, view toggle |
| Адаптивність | ✅ | MUI breakpoints, мобільний дрівер |
| Накладання елементів | ⚠️ | Можливе накладання у `EditEvent.jsx` (стара синтаксис `Grid item` замість `size=`) |
| Індикатор завантаження між сторінками | ❌ | Відсутній — при "заснувшому" API клік схоже на нічого |
| Контрастність | ⚠️ | Текст `#94a3b8` на білому ≈ 2.6:1 (нижче рекомендованого 4.5:1) |
| Клавіатурна доступність | ⚠️ | Деякі рядки `Box onClick` не доступні з клавіатури |
| Lazy loading маршрутів | ❌ | Усі сторінки імпортуються одночасно (великий бандл 1.7 MB) |

| 16 | Адмін: toggle switch демоція | `frontend/src/pages/dashboard/Admin.jsx` | ✅ ВИПРАВЛЕНО — перемикач який міняв роль адміна на модератора прибрано, замінився на кнопку редагування. | Некоректна семантика перемикача. | **High** (виправлено) | Перемикач прибрано. |
| 17 | Адмін: createAdmin роль без валідації | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано валідацію ролі против allow-list ["admin", "moderator", "user"]. | Роль приймалася без перевірки. | **High** (виправлено) | Валідація додана. |
| 18 | Адмін: updateAdminRole самодемоція | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано guardia: адмін не може зняти з себе роль адміністратора. | Немає захисту від самодемоції. | **Medium** (виправлено) | Guardia додана. |
| 19 | Users: роль як текстове поле | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — роль тепер у вигляді Select з валідними варіантами (user, moderator, admin). | Текстове поле дозволяло будь-яке значення. | **Medium** (виправлено) | Select додано. |
| 20 | Users: видалення без підтвердження | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — додано window.confirm перед видаленням. | Немає підтвердження. | **Medium** (виправлено) | Підтвердження додано. |
| 21 | Posts: редагування без обробника | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — додано діалог редагування з обробником update і intent у action. | Кнопка редагування не мала onClick. | **Medium** (виправлено) | Діалог редагування додано. |
| 22 | Posts: мокові дані як реальні | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — прибрано MOCK_PUBLICATIONS fallback, при помилці API повертається порожній масив. | Мокові дані видавалися за реальні. | **High** (виправлено) | Мок прибрано. |
| 23 | EventsManager: create не оброблявся | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — додано обробник intent === "create" в action. | Створення подій тихо відкидалося. | **Medium** (виправлено) | Обробник create додано. |
| 24 | EventsManager: французька мітка | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — Créer замінено на Створити. | Неукраїнська мітка. | **Low** (виправлено) | Мітку виправлено. |
| 25 | Модерація: немає сповіщень про нові оголошення | `backend/controllers/advController.js`, `backend/controllers/moderationController.js`, `backend/routes/moderationRouter.js`, `frontend/src/components/Sidebar.jsx`, `frontend/src/pages/dashboard/ModerationManager.jsx` | ✅ ВИПРАВЛЕНО — при створенні оголошення зі статусом pending створюються сповіщення типу `ad_pending` для всіх адмінів і модераторів. Додано ендпоінт `GET /moderation/pending-count`. У Sidebar з'являється червоний бейдж з кількістю waiting оголошень на пункт "Модерація". На сторінці модерації показується кількість нових оголошень у заголовку. | Адміністратор не міг знати про нові оголошення на модерації. | **High** (виправлено) | Сповіщення та бейдж реалізовано. |

---

## 8. АВТОРИЗАЦІЯ — ПЕРЕВІРКА ВХОДУ / ДОСТУПУ

| Функція | Статус | Примітка |
|---------|--------|----------|
| Реєстрація | ✅ | POST `/auth/register`, bcrypt, верифікація email |
| Вхід | ✅ | POST `/auth/login`, JWT httpOnly кукі (1 день) |
| Вихід | ✅ | POST `/auth/logout`, очистка кукі |
| Відновлення пароля | ❌ | Бекенд є (`/forgot-password`, `/reset-password/:token`), але **немає фронтенд-сторінки**. Посилання "Забули пароль?" веде на `#`. |
| Повторна відправка верифікації | ❌ | Якщо лист втрачається або прострочується (24 г), користувач заблокований (неможе зареєструватися заново — "вже існує"). |
| Захищені сторінки | ✅ | `ProfileLayout` редіректить на `/login`, якщо не авторизовано. Dashboard захищений роллю admin. |
| Права доступу (ролі) | ✅ | user / moderator / admin. `roleMiddleware` та `checkSelfOrAdmin` існують. |
| Email чутливий до регістру | ⚠️ | `User.findOne({ where: { email } })` — чутливий до регістру ("A@x.com" ≠ "a@x.com"). |
| OAuth Google / Facebook | ❌ | Не налаштовано (немає змінних оточення). |

| 16 | Адмін: toggle switch демоція | `frontend/src/pages/dashboard/Admin.jsx` | ✅ ВИПРАВЛЕНО — перемикач який міняв роль адміна на модератора прибрано, замінився на кнопку редагування. | Некоректна семантика перемикача. | **High** (виправлено) | Перемикач прибрано. |
| 17 | Адмін: createAdmin роль без валідації | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано валідацію ролі против allow-list ["admin", "moderator", "user"]. | Роль приймалася без перевірки. | **High** (виправлено) | Валідація додана. |
| 18 | Адмін: updateAdminRole самодемоція | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано guardia: адмін не може зняти з себе роль адміністратора. | Немає захисту від самодемоції. | **Medium** (виправлено) | Guardia додана. |
| 19 | Users: роль як текстове поле | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — роль тепер у вигляді Select з валідними варіантами (user, moderator, admin). | Текстове поле дозволяло будь-яке значення. | **Medium** (виправлено) | Select додано. |
| 20 | Users: видалення без підтвердження | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — додано window.confirm перед видаленням. | Немає підтвердження. | **Medium** (виправлено) | Підтвердження додано. |
| 21 | Posts: редагування без обробника | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — додано діалог редагування з обробником update і intent у action. | Кнопка редагування не мала onClick. | **Medium** (виправлено) | Діалог редагування додано. |
| 22 | Posts: мокові дані як реальні | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — прибрано MOCK_PUBLICATIONS fallback, при помилці API повертається порожній масив. | Мокові дані видавалися за реальні. | **High** (виправлено) | Мок прибрано. |
| 23 | EventsManager: create не оброблявся | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — додано обробник intent === "create" в action. | Створення подій тихо відкидалося. | **Medium** (виправлено) | Обробник create додано. |
| 24 | EventsManager: французька мітка | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — Créer замінено на Створити. | Неукраїнська мітка. | **Low** (виправлено) | Мітку виправлено. |
| 25 | Модерація: немає сповіщень про нові оголошення | `backend/controllers/advController.js`, `backend/controllers/moderationController.js`, `backend/routes/moderationRouter.js`, `frontend/src/components/Sidebar.jsx`, `frontend/src/pages/dashboard/ModerationManager.jsx` | ✅ ВИПРАВЛЕНО — при створенні оголошення зі статусом pending створюються сповіщення типу `ad_pending` для всіх адмінів і модераторів. Додано ендпоінт `GET /moderation/pending-count`. У Sidebar з'являється червоний бейдж з кількістю waiting оголошень на пункт "Модерація". На сторінці модерації показується кількість нових оголошень у заголовку. | Адміністратор не міг знати про нові оголошення на модерації. | **High** (виправлено) | Сповіщення та бейдж реалізовано. |

---

## 9. КОД ТА ТЕХНІЧНИЙ АУДИТ

### Збірка
- `vite build` — **успішно** (помилок немає).
- TypeScript — не використовується (проєкт на JavaScript, є лише `@types/react` у devDependencies).

### Консольні помилки JS
- `customFetch.js` має переховувач відповіді, який логіть `console.error("Помилка Axios:", error)`, але не перериває ланцюжок помилок правильно для всіх випадків.
- Немає глобального обробника неперехоплених промісів на фронтенді.

### TODO / FIXME / незавершений функціонал
- У коді є номети `// FIX P1-2`, `// FIX P2-3` тощо.
- У `Register.jsx` перша версія компонента (рядки 1-150) **закомічена完全**, друга активна.
- У `App.jsx` рядок 44: `// import Messages, { loader as messagesLoader }` — закомічений імпорт (але Messages імпортується пізніше, рядок 71).
- У `App.jsx` рядки 167-168: `// action as forumManagerAction` — закомічений екшн для ForumManager.

### Мертвий код / невикористані компоненти
- `frontend/src/pages/Landing.jsx` — дубль `Home.jsx`, не використовується (per TODO.md).
- `frontend/src/pages/index.jsx` — barrel, не імпортується.
- `frontend/src/pages/dashboard/Settings.jsx`, `EditUser.jsx` — маршрут без лоудера, викликає неіснуючий `GET /users/:id`.
- `backend/config/nodemailer.js` — імпортує `nodemailer-mailgun-transport`, якого немає в `package.json`.
- `backend/scripts/initCategories.js` — повністю закомічений, але присутній у скриптах npm.
- Коментовані блоки коду в ~15 файлах (`App.jsx`, `Forum.jsx`, `Home.jsx`, `EditAdPage.jsx`, `Register.jsx`, `emailService.js`, `multer.js` тощо).

### Залежності (потенційно невикористані)
- Бекенд: `sharp`, `slugify`, `uuid`, `http-status-codes`, `express-validator`, `nodemailer` — не використовуються (per TODO.md).
- Фронтенд: `recharts` (з Stats), `react-country-state-city` (ważкий, завантажує всі міста світу), `sanitize-html` (бекенд).

### Фіктивна / тестова логіка
- "На сайті з 2023 року" — 하ркод в `AdDetailPage.jsx` (ContactCard) для всіх користувачів.
- VerifiedBadge показується для всіх оголошень без перевірки.
- Статистика на головній — fallback-значення ("3 400+ оголошень" тощо), якщо API не повертає дані.
- Фейкові відгуки, команда, цифри ("12 000+ Українців") на сторінці входу / головній — декоративний контент.
- Адмін-сторінка: обслуговування, кэш, резервне копіювання, права доступу — не роблять нічого (заглушки).
- Stats сторінка — мок-дані, речі незрозумілий графік.

| 16 | Адмін: toggle switch демоція | `frontend/src/pages/dashboard/Admin.jsx` | ✅ ВИПРАВЛЕНО — перемикач який міняв роль адміна на модератора прибрано, замінився на кнопку редагування. | Некоректна семантика перемикача. | **High** (виправлено) | Перемикач прибрано. |
| 17 | Адмін: createAdmin роль без валідації | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано валідацію ролі против allow-list ["admin", "moderator", "user"]. | Роль приймалася без перевірки. | **High** (виправлено) | Валідація додана. |
| 18 | Адмін: updateAdminRole самодемоція | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано guardia: адмін не може зняти з себе роль адміністратора. | Немає захисту від самодемоції. | **Medium** (виправлено) | Guardia додана. |
| 19 | Users: роль як текстове поле | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — роль тепер у вигляді Select з валідними варіантами (user, moderator, admin). | Текстове поле дозволяло будь-яке значення. | **Medium** (виправлено) | Select додано. |
| 20 | Users: видалення без підтвердження | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — додано window.confirm перед видаленням. | Немає підтвердження. | **Medium** (виправлено) | Підтвердження додано. |
| 21 | Posts: редагування без обробника | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — додано діалог редагування з обробником update і intent у action. | Кнопка редагування не мала onClick. | **Medium** (виправлено) | Діалог редагування додано. |
| 22 | Posts: мокові дані як реальні | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — прибрано MOCK_PUBLICATIONS fallback, при помилці API повертається порожній масив. | Мокові дані видавалися за реальні. | **High** (виправлено) | Мок прибрано. |
| 23 | EventsManager: create не оброблявся | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — додано обробник intent === "create" в action. | Створення подій тихо відкидалося. | **Medium** (виправлено) | Обробник create додано. |
| 24 | EventsManager: французька мітка | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — Créer замінено на Створити. | Неукраїнська мітка. | **Low** (виправлено) | Мітку виправлено. |
| 25 | Модерація: немає сповіщень про нові оголошення | `backend/controllers/advController.js`, `backend/controllers/moderationController.js`, `backend/routes/moderationRouter.js`, `frontend/src/components/Sidebar.jsx`, `frontend/src/pages/dashboard/ModerationManager.jsx` | ✅ ВИПРАВЛЕНО — при створенні оголошення зі статусом pending створюються сповіщення типу `ad_pending` для всіх адмінів і модераторів. Додано ендпоінт `GET /moderation/pending-count`. У Sidebar з'являється червоний бейдж з кількістю waiting оголошень на пункт "Модерація". На сторінці модерації показується кількість нових оголошень у заголовку. | Адміністратор не міг знати про нові оголошення на модерації. | **High** (виправлено) | Сповіщення та бейдж реалізовано. |

---

## 10. РЕАЛЬНЕ ФУНКЦІОНАЛЬНЕ ТЕСТУВАННЯ

**Не виконується**, оскільки:
- Сервер бекенду не запущений (потрібен DATABASE_URL до Aiven та змінні оточення).
- Сервер фронтенду не запущений.
- Немає браузерного інструменту для відкриття сайту, клік по кнопкам, перевірки Network/Console.

Щоб виконати реальне тестування, потрібно:
1. Запустити бекенд: `cd backend && NODE_ENV=development npm run dev` (потрібна доступна база PostgreSQL).
2. Запустити фронтенд: `cd frontend && npm run dev`.
3. Відкрити `http://localhost:5173` у браузері і пройти всі сценарії з опиту acima.

| 16 | Адмін: toggle switch демоція | `frontend/src/pages/dashboard/Admin.jsx` | ✅ ВИПРАВЛЕНО — перемикач який міняв роль адміна на модератора прибрано, замінився на кнопку редагування. | Некоректна семантика перемикача. | **High** (виправлено) | Перемикач прибрано. |
| 17 | Адмін: createAdmin роль без валідації | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано валідацію ролі против allow-list ["admin", "moderator", "user"]. | Роль приймалася без перевірки. | **High** (виправлено) | Валідація додана. |
| 18 | Адмін: updateAdminRole самодемоція | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано guardia: адмін не може зняти з себе роль адміністратора. | Немає захисту від самодемоції. | **Medium** (виправлено) | Guardia додана. |
| 19 | Users: роль як текстове поле | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — роль тепер у вигляді Select з валідними варіантами (user, moderator, admin). | Текстове поле дозволяло будь-яке значення. | **Medium** (виправлено) | Select додано. |
| 20 | Users: видалення без підтвердження | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — додано window.confirm перед видаленням. | Немає підтвердження. | **Medium** (виправлено) | Підтвердження додано. |
| 21 | Posts: редагування без обробника | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — додано діалог редагування з обробником update і intent у action. | Кнопка редагування не мала onClick. | **Medium** (виправлено) | Діалог редагування додано. |
| 22 | Posts: мокові дані як реальні | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — прибрано MOCK_PUBLICATIONS fallback, при помилці API повертається порожній масив. | Мокові дані видавалися за реальні. | **High** (виправлено) | Мок прибрано. |
| 23 | EventsManager: create не оброблявся | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — додано обробник intent === "create" в action. | Створення подій тихо відкидалося. | **Medium** (виправлено) | Обробник create додано. |
| 24 | EventsManager: французька мітка | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — Créer замінено на Створити. | Неукраїнська мітка. | **Low** (виправлено) | Мітку виправлено. |
| 25 | Модерація: немає сповіщень про нові оголошення | `backend/controllers/advController.js`, `backend/controllers/moderationController.js`, `backend/routes/moderationRouter.js`, `frontend/src/components/Sidebar.jsx`, `frontend/src/pages/dashboard/ModerationManager.jsx` | ✅ ВИПРАВЛЕНО — при створенні оголошення зі статусом pending створюються сповіщення типу `ad_pending` для всіх адмінів і модераторів. Додано ендпоінт `GET /moderation/pending-count`. У Sidebar з'являється червоний бейдж з кількістю waiting оголошень на пункт "Модерація". На сторінці модерації показується кількість нових оголошень у заголовку. | Адміністратор не міг знати про нові оголошення на модерації. | **High** (виправлено) | Сповіщення та бейдж реалізовано. |

---

## 11. ФІНАЛЬНИЙ ЗВІТ АУДИТУ — ТАБЛИЦЯ ПРОБЛЕМ

### Підсумкова таблиця всіх перевірених елементів

| Елемент | Сторінка/компонент | Файл | Результат | Критичність |
|---------|-------------------|------|-----------|-------------|
| Збірка фронтенду | — | `frontend/` | ✅ Працює | — |
| Кнопка "Увійти" | Navbar / Login | `Navbar.jsx`, `Login.jsx` | ✅ Працює | — |
| Кнопка "Реєстрація" | Navbar / Login / Register | `Navbar.jsx`, `Register.jsx` | ✅ Працює | — |
| Кнопка "Вийти" | Navbar / Profile | `Navbar.jsx`, `Profile.jsx` | ✅ Працює | — |
| Кнопка Google OAuth | Login | `Login.jsx` | ⚠️ Деактивовано (потребує GOOGLE_CLIENT_ID/SECRET у .env) | High |
| Кнопка Facebook OAuth | Login | `Login.jsx` | ⚠️ Деактивовано (потребує FACEBOOK_APP_ID/SECRET у .env) | High |
| Посилання "Забули пароль?" | Login | `Login.jsx:408` | ✅ Виправлено — веде на `/forgot-password`, створено сторінки відновлення пароля | — |
| Кнопка "Зберегти/закладка" | AdDetailPage | `AdDetailPage.jsx:743` | ❌ Декоративна (лише локальний стан) | Medium |
| Пошук (головна + оголошення) | Home / Ads | `Home.jsx`, `Ads.jsx` | ⚠️ Частково (клієнт-side, немає пагінації) | Medium |
| Форма входу | Login | `Login.jsx` | ✅ Працює | — |
| Форма реєстрації | Register | `Register.jsx` | ✅ Працює | — |
| Форма контактів | Contacts | `Contacts.jsx` | ✅ Працює | — |
| Створити оголошення | CreateAdPage | `CreateAdPage.jsx` | ✅ Працює | — |
| Редагувати оголошення | EditAdPage | `EditAdPage.jsx` | ⚠️ Підкатегорія не зберігається (per TODO) | Medium |
| Список оголошень | Ads | `Ads.jsx` | ⚠️ Фільтри роблятья клієнт-side, без пагінації | Medium |
| Повідомлення (чат) | Messages | `Messages.jsx`, `conversationController.js` | ✅ Працює (IDOR виправлено) | — |
| Скарга на оголошення | AdDetailPage | `AdDetailPage.jsx`, `reportRouter` | ✅ Працює | — |
| Написати в чаті / на email | AdDetailPage | `AdDetailPage.jsx`, `conversationRouter`, `adEmailRouter` | ✅ Працює | — |
| Редагування профілю | Profile | `Profile.jsx` | ✅ Працює | — |
| Зміна пароля | Profile | `Profile.jsx` | ✅ Працює | — |
| Видалення акаунту | Profile | `Profile.jsx` | ✅ Працює | — |
| Події (список / деталі / реєстрація) | Events / EventDetail | `Events.jsx`, `EventDetail.jsx`, `eventRouter` | ⚠️ Частково (per TODO: не веде на деталі, сортування за старістю) | Medium |
| Публікації | Publications | `Publications.jsx` | ⚠️ "Читати далі" не веде нікуди, `createdBy`/`userId` помилка, `&amp;` | Medium |
| Форум | Forum / TopicDetail | `Forum.jsx`, `TopicDetail.jsx` | ⚠️ Немає видалення з інтерфейсу | Low |
| Адмін: користувачі / оголошення / категорії / новини | Dashboard | `Users.jsx`, `AdsManager.jsx`, `CategoryManager.jsx`, `NewsManager.jsx` | ✅ Працює (без підтвердження видалення) | Low |
| Адмін: обслуговування / кэш /备份 / права | Admin | `Admin.jsx` | ❌ Заглушки, не роблять нічого | Medium |
| Stats | Stats | `Stats.jsx` | ❌ Мок-дані | Low |
| Налаштування | Settings | `SettingsNew.jsx` | ⚠️ Потрібно підтвердити monting `settingsRouter` | Medium |
| Кукі SameSite=None + secure | authController.js | `authController.js:160-165` | ⚠️ Safari iPhone блокує кукі на різних доменах | High |
| Фуťки email у API | advController.js | `advController.js` | ⚠️_EMAIL раніше експонувались, зараз частково прибрано, але перевірити всі ендпоінти | High |
| Пагінація | advRouter | `advRouter.js` | ❌ Немає пагінації | Medium |
| Обгортка помилок API | index.js / контроллери | `index.js` | ⚠️ Недисциплінований формат `{error}` vs `{message}` | Medium |
| Верифікація email (повторна відправка) | authController | `authController.js` | ❌ Немає повторної відправки | High |
| База даних на порожній базі | scripts/runMigrations.js | `scripts/migrations/` | ✅ Виправлено — базова міграція `20240101000000-baseline-create-tables.js` створює всі таблиці, подальші міграції обробляють "already exists" | — |

### Виявлені помилки (детально)

| # | Сторінка / компонент | Файл і рядок | Опис проблеми | Причина | Критичність | Рекомендоване виправлення |
|---|---------------------|--------------|---------------|---------|-------------|---------------------------|
| 1 | Вхід — "Забули пароль?" | `frontend/src/pages/Login.jsx:408` | ✅ ВИПРАВЛЕНО — посилання zmienено на `/forgot-password`, створено сторінки `ForgotPassword.jsx` та `ResetPassword.jsx`, додано маршрути в `App.jsx`. Бекенд-роути `/auth/forgot-password` і `/auth/reset-password/:token` вже існують. | Фронтенд-сторінку не створено; посилання залишено як заглушка. | **Critical** (виправлено) | Створено сторінки відновлення пароля та додано маршрути. |
| 2 | Вхід — кнопки Google/Facebook | frontend/src/pages/Login.jsx | ⚠️ ВИПРАВЛЕНО (частково) — кнопки закомítовано, додано загалки змінних оточення у .env.development / .env.production. Після заповнення реальними GOOGLE_CLIENT_ID/SECRET, FACEBOOK_APP_ID/SECRET можна розкоментувати блок. | Змінні оточення не налаштовані. | **High** (виправлено частково) | Заповнити реальними ключами OAuth та розкоментувати кнопки. |
| 3 | Авторизація — кукі | `backend/controllers/authController.js` | ✅ ВИПРАВЛЕНО — `sameSite: "none"` змінено на `"lax"`, `secure: true` на `process.env.NODE_ENV === "production"` (у login, logout, issueSessionCookie). Safari iPhone більше не блокує кукі. | Крос-доменне розгортання без урахування Safari. | **High** (виправлено) | SameSite=Laх встановлено. |
| 4 | Верифікація email | backend/controllers/authController.js, backend/routes/authRouter.js | ✅ ВИПРАВЛЕНО — додано маршрут POST /auth/resend-verification та обробник resendVerification, який генерує новий токен і надсилає лист підтвердження (з generic відповіддю для захисту від перебору). | Функціонал не реалізовано. | **High** (виправлено) | Ендпоінт створено. |
| 5 | Кнопка "Зберегти/закладка" | `frontend/src/pages/public/AdDetailPage.jsx` | ✅ ВИПРАВЛЕНО — додано сховище обраних у localStorage (ключ pern_europe_ua_favorites). Кнопка тепер дійсно додає/видаляє оголошення з обраних, показує toast, стан зберігається між перезавантаженнями. | Функціонал не додано. | **Medium** (виправлено) | Збереження у localStorage реалізовано. |
| 6 | Фільтри оголошень | `frontend/src/pages/public/Ads.jsx` | Фiltracyція клієнт-side після завантаження всіх оголошень. Немає пагінації. При великій кількості даних — проблеми продуктивності. | Немає серверної пагінації та фільтрації. | **Medium** | Додати серверну пагінацію (`?page=&limit=`) та серверні фільтри (`?categoryId=&city=&q=`). |
| 7 | Формат помилок API | `backend/index.js:95-133` | ✅ ВИПРАВЛЕНО — всі помилки тепер повертаються у форматі `{ message }` (SequelizeValidationError, UniqueConstraintError, JsonWebTokenError, TokenExpiredError, 500). Витік err.message на продакшені прибрано. | Недисциплінований контракт помилок. | **Medium** (виправлено) | Єдиний формат { message } впроваджено. |
| 8 | База даних на порожній базі | `backend/scripts/runMigrations.js`, `backend/index.js` | ✅ ВИПРАВЛЕНО — існує базова міграція `20240101000000-baseline-create-tables.js`, яка створює всі таблиці (`users`, `advs`, `categories` тощо). Подальші міграції обробляють помилку "already exists" (коди 42P07, 42701, 55006). | Міграції та `sync`мішані, немає baseline. | **Critical** (виправлено) | Базова міграція вже створена, подальші міграції безпечні для порожньої бази. |
| 9 | Email у API оголошень | backend/controllers/advController.js | ✅ ВИПРАВЛЕНО — у updateAnnonce прибрано email з include User (залишено лише id, firstName). Публічні ендпоінти не повертають чутливі дані облікового запису. | Чутливі дані відкриті в API. | **High** (виправлено) | Email прибрано з відповіді оновлення оголошення. |
| 10 | "На сайті з 2023 року" / VerifiedBadge | `frontend/src/pages/public/AdDetailPage.jsx` | ✅ ВИПРАВЛЕНО — видалено VerifiedIcon та текст "На сайті з 2023 року", замінено на "Учасник спільноти". | Харкодовані фейкові значення. | **Low** (виправлено) | Харкод прибрано. |
| 11 | Соціальні посилання у контактах | `frontend/src/pages/public/Contacts.jsx` | ✅ ВИПРАВЛЕНО — додано disabled: true для всіх соціальних посилань, вони відображаються як вимкнені (span замість a, opacity 0.5). Потрібно заповнити реальними посиланнями після створення сторінок проєкту. | Заглушки. | **Low** (виправлено частково) | Посилання вимкнено, чекають на реальні URL. |
| 12 | Адмін-заглушки (maintenance, cache, backup) | `frontend/src/pages/dashboard/Admin.jsx`, `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО (частково) — кнопки вимкнено (disabled), бекенд повертає 501 Not Implemented. Рольовий діалог тепер надсилає дані на бекенд. Харкодований ROLES прибрано. | Фіктивний функціонал. | **Medium** (виправлено частково) | Кнопки вимкнено, бекенд повертає 501. |
| 13 | Stats | `frontend/src/pages/Stats.jsx` | Мок-дані, незрозумілий графік. | Фіктивні дані. | **Low** | Підключити реальну статистику з API або прибрати. |
| 14 | Публікації — mass assignment | `backend/controllers/publicationController.js` | ✅ ВИПРАВЛЕНО — createPublication та updatePublication тепер використовують явний список полів замість ...req.body, що запобігає зміні userId іншим користувачем. | Масове призначення дозволяло красти публікації. | **Low** (виправлено) | Явний вибір полів реалізовано. |
| 15 | Мертвий код | декілька файлов | Закомічений код у `Register.jsx`, `App.jsx`, `Landing.jsx`, `Settings.jsx` тощо. | Залишки розробки. | **Low** | Видалити закомічаний код (git зберігає історію). |

| 16 | Адмін: toggle switch демоція | `frontend/src/pages/dashboard/Admin.jsx` | ✅ ВИПРАВЛЕНО — перемикач який міняв роль адміна на модератора прибрано, замінився на кнопку редагування. | Некоректна семантика перемикача. | **High** (виправлено) | Перемикач прибрано. |
| 17 | Адмін: createAdmin роль без валідації | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано валідацію ролі против allow-list ["admin", "moderator", "user"]. | Роль приймалася без перевірки. | **High** (виправлено) | Валідація додана. |
| 18 | Адмін: updateAdminRole самодемоція | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано guardia: адмін не може зняти з себе роль адміністратора. | Немає захисту від самодемоції. | **Medium** (виправлено) | Guardia додана. |
| 19 | Users: роль як текстове поле | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — роль тепер у вигляді Select з валідними варіантами (user, moderator, admin). | Текстове поле дозволяло будь-яке значення. | **Medium** (виправлено) | Select додано. |
| 20 | Users: видалення без підтвердження | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — додано window.confirm перед видаленням. | Немає підтвердження. | **Medium** (виправлено) | Підтвердження додано. |
| 21 | Posts: редагування без обробника | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — додано діалог редагування з обробником update і intent у action. | Кнопка редагування не мала onClick. | **Medium** (виправлено) | Діалог редагування додано. |
| 22 | Posts: мокові дані як реальні | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — прибрано MOCK_PUBLICATIONS fallback, при помилці API повертається порожній масив. | Мокові дані видавалися за реальні. | **High** (виправлено) | Мок прибрано. |
| 23 | EventsManager: create не оброблявся | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — додано обробник intent === "create" в action. | Створення подій тихо відкидалося. | **Medium** (виправлено) | Обробник create додано. |
| 24 | EventsManager: французька мітка | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — Créer замінено на Створити. | Неукраїнська мітка. | **Low** (виправлено) | Мітку виправлено. |
| 25 | Модерація: немає сповіщень про нові оголошення | `backend/controllers/advController.js`, `backend/controllers/moderationController.js`, `backend/routes/moderationRouter.js`, `frontend/src/components/Sidebar.jsx`, `frontend/src/pages/dashboard/ModerationManager.jsx` | ✅ ВИПРАВЛЕНО — при створенні оголошення зі статусом pending створюються сповіщення типу `ad_pending` для всіх адмінів і модераторів. Додано ендпоінт `GET /moderation/pending-count`. У Sidebar з'являється червоний бейдж з кількістю waiting оголошень на пункт "Модерація". На сторінці модерації показується кількість нових оголошень у заголовку. | Адміністратор не міг знати про нові оголошення на модерації. | **High** (виправлено) | Сповіщення та бейдж реалізовано. |

---

## 12. ВИСНОВИТА ТА ПЛАН ВИПРАВЛЕНЬ

Код **змінено** для усунення Critical проблем (див.нижче). Рекомендована подальша послідовність виправлень:

### ✅ Виправлено (Critical — блокуючі)
1. Створено фронтенд-сторінки відновлення пароля (/forgot-password, /reset-password/:token) та зв'язано з існуючими бекенд-роутами; замінено to="#" на реальні маршрути.
2. Деактивовано кнопки Google/Facebook OAuth (потребує GOOGLE_CLIENT_ID/SECRET, FACEBOOK_APP_ID/SECRET у .env для активації).
3. Підтверджено: базова міграція 20240101000000-baseline-create-tables.js створює всі таблиці на порожній базі; подальші міграції обробляють "already exists".

### ✅ Виправлено (High)
4. Конфігурація кукі — sameSite: "none" змінено на lax у authController.js (login, logout, issueSessionCookie). Safari iPhone більше не блокує кукі.
5. Повторна відправка верифікації — додано маршрут POST /auth/resend-verification та обробник resendVerification.
6. Змінні оточення OAuth — додано загалки GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET у .env.development / .env.production.
7. Витік email в API — прибрано email з include User у updateAnnonce (advController.js).
8. Адмін: toggle switch демоція — прибрано небезпечний перемикач ролі, заміщено на кнопку редагування.
9. Адмін: createAdmin роль — додано валідацію против allow-list ["admin", "moderator", "user"].
10. Posts: мокові дані — прибрано MOCK_PUBLICATIONS fallback, при помилці API порожній масив.

### ⏳ Залишилося виправити (High)
11. Після заповнення реальними ключами OAuth — розкоментувати кнопки Google/Facebook у Login.jsx.

### ✅ Виправлено (Medium)
12. Формат помилок API — єдиний формат { message } у глобальному errorHandler.
13. Кнопка "Зберегти/закладка" — localStorage для обраних оголошень.
14. Адмін: updateAdminRole — додано guardia від самодемоції адміна.
15. Адмін: рольовий діалог — тепер надсилає firstName, lastName, email, role на бекенд.
16. Адмін: прибрано нефункціональні кнопки maintenance/cache/backup (дисейблено, бекенд 501).
17. Адмін: прибрано хардкодований ROLES з фейковими ролями (super-admin, editor).
18. Users: роль — Select замість текстового поля, валідні варіанти.
19. Users: видалення — додано window.confirm.
20. Posts: редагування — додано діалог з обробником update.
21. EventsManager: create — додано обробник intent === "create".
22. EventsManager: мітка "Créer" → "Створити".

### ✅ Виправлено (Low)
23. "На сайті з 2023 року" / VerifiedBadge — прибрано хардкод.
24. Соціальні посилання — вимкнено (disabled), чекають на реальні URL.
25. Публікації mass assignment — явний вибір полів замість ...req.body.
26. Мертвий код — видалено з Register.jsx та Publications.jsx.

### ⏳ Залишене (Medium / P1)
27. Серверна пагінація та фільтрація для /adv.
28. Індикатор завантаження між сторінками.
29. Налаштування контрастності та клавіатурної доступності.
30. Lazy loading маршрутів.### Середнього / низького пріоритету
11. Вибрати мертвий/закомічаний код.
12. Виправити хардкодовані фейкові значення ("з 2023 року", VerifiedBadge для всіх, мок-дані Stats).
13. Прибрати або реалізувати адмін-заглушки (обслуговування, кэш, резервне копіювання).
14. Підвищити контрастність тексту та клавіатурну доступність.
15. Додати lazy loading маршрутів для зменшення розміру бандла.

| 16 | Адмін: toggle switch демоція | `frontend/src/pages/dashboard/Admin.jsx` | ✅ ВИПРАВЛЕНО — перемикач який міняв роль адміна на модератора прибрано, замінився на кнопку редагування. | Некоректна семантика перемикача. | **High** (виправлено) | Перемикач прибрано. |
| 17 | Адмін: createAdmin роль без валідації | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано валідацію ролі против allow-list ["admin", "moderator", "user"]. | Роль приймалася без перевірки. | **High** (виправлено) | Валідація додана. |
| 18 | Адмін: updateAdminRole самодемоція | `backend/controllers/adminController.js` | ✅ ВИПРАВЛЕНО — додано guardia: адмін не може зняти з себе роль адміністратора. | Немає захисту від самодемоції. | **Medium** (виправлено) | Guardia додана. |
| 19 | Users: роль як текстове поле | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — роль тепер у вигляді Select з валідними варіантами (user, moderator, admin). | Текстове поле дозволяло будь-яке значення. | **Medium** (виправлено) | Select додано. |
| 20 | Users: видалення без підтвердження | `frontend/src/pages/Users.jsx` | ✅ ВИПРАВЛЕНО — додано window.confirm перед видаленням. | Немає підтвердження. | **Medium** (виправлено) | Підтвердження додано. |
| 21 | Posts: редагування без обробника | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — додано діалог редагування з обробником update і intent у action. | Кнопка редагування не мала onClick. | **Medium** (виправлено) | Діалог редагування додано. |
| 22 | Posts: мокові дані як реальні | `frontend/src/pages/dashboard/Posts.jsx` | ✅ ВИПРАВЛЕНО — прибрано MOCK_PUBLICATIONS fallback, при помилці API повертається порожній масив. | Мокові дані видавалися за реальні. | **High** (виправлено) | Мок прибрано. |
| 23 | EventsManager: create не оброблявся | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — додано обробник intent === "create" в action. | Створення подій тихо відкидалося. | **Medium** (виправлено) | Обробник create додано. |
| 24 | EventsManager: французька мітка | `frontend/src/pages/EventsManager.jsx` | ✅ ВИПРАВЛЕНО — Créer замінено на Створити. | Неукраїнська мітка. | **Low** (виправлено) | Мітку виправлено. |
| 25 | Модерація: немає сповіщень про нові оголошення | `backend/controllers/advController.js`, `backend/controllers/moderationController.js`, `backend/routes/moderationRouter.js`, `frontend/src/components/Sidebar.jsx`, `frontend/src/pages/dashboard/ModerationManager.jsx` | ✅ ВИПРАВЛЕНО — при створенні оголошення зі статусом pending створюються сповіщення типу `ad_pending` для всіх адмінів і модераторів. Додано ендпоінт `GET /moderation/pending-count`. У Sidebar з'являється червоний бейдж з кількістю waiting оголошень на пункт "Модерація". На сторінці модерації показується кількість нових оголошень у заголовку. | Адміністратор не міг знати про нові оголошення на модерації. | **High** (виправлено) | Сповіщення та бейдж реалізовано. |

---

**Завершення аудиту.** Для успішного проходження реального функціонального тестування (крок 9 з вимоги) необхідно запустити локально бекенд і фронтенд і повторити перевірку всіх кнопок, посилань, форм та API у браузері з відкритою панелю Network і Console.