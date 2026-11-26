# Not Your Ordinary Coffee

**COFFEE • MUSIC • FEELINGS** — багатосторінковий адаптивний сайт-візитівка кав'ярні з меню та онлайн-замовленням (варіант №2) у стилістиці Billie Eilish: майже чорний фон, неоново-зелені акценти, глибокий синій, холодний білий та олива.

Фінальний проєкт з дисципліни «Технології веброзробки». **Автор: Кароліна.**

## Технології

| Інструмент | Призначення |
|---|---|
| **Pug** | шаблони сторінок: `layout.pug` + `extends/block`, `include`, міксини, цикли `each`, `if/unless/else`, `- var` |
| **SCSS (Dart Sass)** | 9 модулів через `@use`, змінні, міксини, вкладеність з `&`, `@extend`, `@each`, `@for`, color-функції |
| **Gulp** | конвеєр збірки: Pug → HTML, SCSS → CSS, Autoprefixer, cssnano, копіювання зображень, browser-sync, watch |
| **PostCSS** | Autoprefixer (вендорні префікси) + cssnano (мініфікація) |

## Сторінки

| Файл | Зміст |
|---|---|
| `index.html` | Головна: герой «NOT YOUR ORDINARY COFFEE», три розділи, платівка «Now playing», біжучий рядок |
| `menu.html` | **Our Menu**: 23 позиції з CSS-фільтром за категоріями (Grid `auto-fill`), таблиця цін (`caption`, `thead`, `tbody`, `tfoot`, `colspan`, `rowspan`) |
| `world.html` | **Our World**: історія (`::first-letter`), фото інтер'єру, плейлист (вкладені списки), зовнішні посилання `target="_blank"`, sticky-панель |
| `specials.html` | **Specials**: сезонні напої (горизонтальна карусель зі `scroll-snap`), спецпропозиції |
| `order.html` | **Order**: форма замовлення (`fieldset/legend`, text, email, tel, select, textarea, radio, checkbox, file, time, `required`, `pattern`) |

## Структура

```
not-your-ordinary-coffee/
├── package.json
├── gulpfile.js
├── README.md
├── src/
│   ├── pug/
│   │   ├── layout.pug        базовий макет (block vars / title / content)
│   │   ├── _header.pug       шапка (include)
│   │   ├── _footer.pug       підвал (include)
│   │   ├── _mixins.pug       12 міксинів: nav-item, button, card, wall-tile, stat, feature, price, section-head, form-field, choice, drip, spider
│   │   ├── _credits.pug      автори фото (Wikimedia Commons)
│   │   ├── _data.pug         масиви даних для циклів each
│   │   └── index / menu / world / specials / order .pug
│   ├── scss/
│   │   ├── main.scss         головний файл (@use усіх модулів)
│   │   ├── _variables.scss   кольори, шрифти, відступи, тривалості, breakpoints
│   │   ├── _mixins.scss      flex-center, flex-between, breakpoint, card, neon-text, photo-hover, force-dark, visually-hidden
│   │   ├── _base.scss        CSS-змінні теми (:root + [data-theme='light']), reset, типографіка
│   │   ├── _layout.scss      контейнер, fixed-шапка, навігація, бургер, секції, футер
│   │   ├── _components.scss  кнопки (@extend), картки, галерея, таблиця, форма, карусель…
│   │   ├── _animations.scss  @keyframes
│   │   ├── _pages.scss       герої сторінок (@each), блоки головної
│   │   ├── _effects.scss     заставка, курсор, зерно, поява, нахил, стіна Billie, фільтр меню
│   │   └── _utilities.scss   утиліти (@each, @for)
│   ├── img/                  фото + favicon.svg
│   └── js/main.js            тема, поява при скролі, 3D-нахил, курсор, прогрес, відлік
└── dist/                     результат збірки (генерується)
```

## Як зібрати

Потрібен [Node.js](https://nodejs.org/) 18 або новіший.

```bash
npm install        # встановити залежності
npm run dev        # збірка + локальний сервер з live reload (http://localhost:3000)
npm run build      # фінальна збірка у dist/
```

Після `npm run build` у `dist/` з'являються: `*.html`, `css/style.css` (з префіксами, мініфікований), `img/`, `js/main.js`.

## Сайт онлайн

**https://yumi809.github.io/not-your-ordinary-coffee/** відкривається на будь-якому пристрої.

Сайт опубліковано на GitHub Pages: вміст `dist/` лежить у гілці `gh-pages`. Щоб оновити сайт після змін:

```bash
npm run build
git add -A && git commit -m "Update site"
git subtree split --prefix dist -b gh-pages-new
git push -f origin gh-pages-new:gh-pages
git branch -D gh-pages-new
git push
```

## Як відкрити на різних пристроях

- **На ПК без сервера.** Двічі клацнути `dist/index.html`: усі шляхи відносні, тож сайт відкриється в будь-якому браузері. Для шрифтів потрібен інтернет, без нього підставляться системні.
- **На телефоні в тій самій Wi-Fi мережі.** Запустити `npm run dev`. У консолі browser-sync покаже рядок `External: http://<IP-комп'ютера>:3000`, і цю адресу треба відкрити в браузері телефона. Якщо Windows запитає дозвіл для Node.js у брандмауері, натиснути «Дозволити».
- **Адаптивність** перевірена на ширинах 360, 390, 768, 1024 і 1440 px: горизонтальної прокрутки немає. На телефоні меню ховається в бургер, а 3D-нахил і неоновий курсор вмикаються лише для миші.

## Ключові рішення

- **Тема.** Кольори задані SCSS-змінними і передані в CSS-змінні `:root`. Світла тема «Happier Than Ever» перевизначає їх через `[data-theme='light']`; кнопка в шапці перемикає тему й запам'ятовує вибір.
- **Адаптивність (360–1440 px).** Mobile first, `clamp()` для шрифтів і відступів, `repeat(auto-fill, minmax(…))` для галерей, бургер-меню без JS (`:checked`).
- **Анімації.**
  - `transition`: кнопки, картки, посилання меню.
  - `@keyframes` з `infinite`: неонове мерехтіння (`flicker`), платівка (`spin`), еквалайзер (`eq`), біжучий рядок (`marquee`), погойдування фото при наведенні (`sway`).
  - `@keyframes` з `forwards`: поява блоків (`fade-up`), неоновий «слайм» (`drip`).
- **Фото в меню.** При наведенні зображення наближається (`transform: scale` + `transition`) і злегка погойдується (`animation: sway`).
- **Сучасний CSS.** `aspect-ratio`, `:has()` (підсвітка обраних опцій і помилок форми), `scroll-snap` (карусель Specials), `position: sticky` (бокова панель), `:target` (повідомлення після відправки форми).

## Ефекти (JS + CSS)

- **Заставка** з неоновим логотипом (`@keyframes preloader-out` … `forwards`), показується раз за сесію.
- **Поява блоків при прокрутці**: `IntersectionObserver` додає `.is-visible`, CSS-`transition` для `opacity`, `transform` і `filter: blur`.
- **3D-нахил карток** за курсором (`perspective` + `rotateX/rotateY` через CSS-змінні).
- **Неоновий курсор** (`mix-blend-mode: difference`) і **смужка прогресу** прокрутки.
- **Зерно плівки** поверх сторінки: SVG-шум і `@keyframes grain`.
- **Павук** на павутинці в герої (відсилання до кліпу «you should see me in a crown»).
- **Стіна Billie**: зелений дуотон (`mix-blend-mode: multiply` + `grayscale`), при наведенні фото стає кольоровим.
- **Фільтр меню на чистому CSS**: радіокнопки + `:has(:checked)`, правила згенеровані через `@each`.
- **Зворотний відлік** до найближчої п'ятниці 19:00 (Billie Fridays).

## Фото

Усі фото взято з **Wikimedia Commons** за вільними ліцензіями (CC0, CC BY, CC BY-SA). Вони стиснуті до 960–1280 px і лежать у `src/img/`. Автори та ліцензії перелічені на сторінці `world.html` (блок «Автори фото»), дані — у `src/pug/_credits.pug`.

Щоб замінити фото своїм, достатньо зберегти його з тим самим ім'ям.

---

Навчальний фан-проєкт, натхненний музикою Billie Eilish. Не пов'язаний з артисткою.
