/**
 * Конвеєр збірки «Not Your Ordinary Coffee»
 *   npm run dev   → збірка + локальний сервер browser-sync з live reload + watch
 *   npm run build → чиста збірка у dist/ (HTML, мініфікований CSS з префіксами, зображення, JS)
 */
const { src, dest, watch, series, parallel } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const fs = require('node:fs');

const paths = {
  dist: 'dist',
  pug: {
    // сторінки — усі .pug у src/pug/, крім часткових файлів з «_» та базового макета
    src: ['src/pug/*.pug', '!src/pug/_*.pug', '!src/pug/layout.pug'],
    watch: 'src/pug/**/*.pug',
  },
  scss: {
    src: 'src/scss/main.scss',
    watch: 'src/scss/**/*.scss',
  },
  img: 'src/img/**/*.{jpg,jpeg,png,webp,svg,gif}',
  js: 'src/js/**/*.js',
};

let isDev = false;

// 1. Очищення dist/
function clean(done) {
  fs.rmSync(paths.dist, { recursive: true, force: true });
  done();
}

// 2. Pug → HTML
function html() {
  return src(paths.pug.src)
    .pipe(pug({ pretty: true }))
    .pipe(dest(paths.dist));
}

// 3. SCSS → CSS → Autoprefixer → cssnano → dist/css/style.css
function styles() {
  const compiler = sass({ outputStyle: 'expanded' });
  // у режимі розробки помилка SCSS лише логується, у build — зупиняє збірку
  if (isDev) compiler.on('error', sass.logError);

  return src(paths.scss.src)
    .pipe(compiler)
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename('style.css'))
    .pipe(dest(`${paths.dist}/css`))
    .pipe(browserSync.stream());
}

// 4. Копіювання зображень у dist/img/
function images() {
  return src(paths.img, { encoding: false }).pipe(dest(`${paths.dist}/img`));
}

// 5. Копіювання JS (перемикач теми)
function scripts() {
  return src(paths.js).pipe(dest(`${paths.dist}/js`));
}

// 6. Live-сервер + watch
function reload(done) {
  browserSync.reload();
  done();
}

function serve(done) {
  browserSync.init({
    server: { baseDir: paths.dist },
    notify: false,
    open: true,
  });

  watch(paths.pug.watch, series(html, reload));
  watch(paths.scss.watch, styles);
  watch(paths.img, series(images, reload));
  watch(paths.js, series(scripts, reload));
  done();
}

function devMode(done) {
  isDev = true;
  done();
}

const build = series(clean, parallel(html, styles, images, scripts));

exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.images = images;
exports.build = build;
exports.default = series(devMode, build, serve);
