// Not Your Ordinary Coffee — інтерактивні ефекти
(function () {
  var root = document.documentElement;
  var THEME_KEY = 'nyoc-theme';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // --- 1. Тема (темна / світла), запам'ятовується ---
  try {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) {}

  function initTheme() {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch (e) {}
      });
    });
  }

  // --- 2. Поява блоків при прокрутці ---
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { observer.observe(el); });
  }

  // --- 3. 3D-нахил карток за курсором ---
  function initTilt() {
    if (!finePointer || reduceMotion) return;
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('mousemove', function (event) {
        var rect = el.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (-y * 10).toFixed(2) + 'deg');
      });
      el.addEventListener('mouseleave', function () {
        el.style.removeProperty('--rx');
        el.style.removeProperty('--ry');
      });
    });
  }

  // --- 4. Неоновий курсор ---
  function initCursor() {
    var cursor = document.querySelector('.cursor');
    if (!cursor || !finePointer || reduceMotion) return;
    document.addEventListener('mousemove', function (event) {
      cursor.style.setProperty('--cx', event.clientX + 'px');
      cursor.style.setProperty('--cy', event.clientY + 'px');
      cursor.classList.add('is-active');
    });
    document.addEventListener('mouseleave', function () {
      cursor.classList.remove('is-active');
    });
    document.addEventListener('mouseover', function (event) {
      var interactive = event.target.closest('a, button, label, select, [data-tilt]');
      cursor.classList.toggle('is-hover', Boolean(interactive));
    });
  }

  // --- 5. Смужка прогресу прокрутки ---
  function initProgress() {
    var bar = document.querySelector('.progress');
    if (!bar) return;
    var ticking = false;
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty('--progress', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  // --- 6. Відлік до найближчої п'ятниці 19:00 (Billie Fridays) ---
  function initCountdown() {
    var box = document.querySelector('[data-countdown]');
    if (!box) return;
    var cells = {};
    box.querySelectorAll('[data-unit]').forEach(function (el) {
      cells[el.getAttribute('data-unit')] = el;
    });

    function nextFriday() {
      var now = new Date();
      var target = new Date(now);
      target.setHours(19, 0, 0, 0);
      var days = (5 - now.getDay() + 7) % 7;
      target.setDate(now.getDate() + days);
      if (target <= now) target.setDate(target.getDate() + 7);
      return target;
    }

    var target = nextFriday();
    function pad(n) { return String(n).padStart(2, '0'); }
    function tick() {
      var diff = Math.max(0, target - new Date());
      if (diff === 0) target = nextFriday();
      var s = Math.floor(diff / 1000);
      cells.d.textContent = pad(Math.floor(s / 86400));
      cells.h.textContent = pad(Math.floor((s % 86400) / 3600));
      cells.m.textContent = pad(Math.floor((s % 3600) / 60));
      cells.s.textContent = pad(s % 60);
    }
    tick();
    setInterval(tick, 1000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initReveal();
    initTilt();
    initCursor();
    initProgress();
    initCountdown();
  });
})();
