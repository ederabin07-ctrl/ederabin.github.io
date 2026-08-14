// =====================================================
//   ПОРТФОЛИО — ЛОГИКА САЙТА
// =====================================================

// ===== ЭЛЕМЕНТЫ =====
const tabs       = document.querySelectorAll('.tab');
const views      = document.querySelectorAll('.view');
const allThumbs  = document.querySelectorAll('.thumb');
const homeLink   = document.getElementById('home-link');

const heroStage  = document.getElementById('hero-stage');
const heroImg    = document.getElementById('hero-img');
const heroTitle  = document.getElementById('hero-title');
const heroMeta   = document.getElementById('hero-meta');

let heroInterval   = null;
let currentHeroThumb = null;

// =====================================================
//   ГЛАВНАЯ — РАНДОМНАЯ СМЕНА КАДРОВ
// =====================================================

// Возвращает случайную миниатюру (из всех работ всех жанров)
function randomThumb() {
  const arr = Array.from(allThumbs);
  return arr[Math.floor(Math.random() * arr.length)];
}

// Меняет картинку и подпись на главной
function updateHero() {
  let next = randomThumb();
  // стараемся не показывать одну и ту же дважды подряд
  if (currentHeroThumb && allThumbs.length > 1) {
    let safety = 0;
    while (next === currentHeroThumb && safety < 10) {
      next = randomThumb();
      safety++;
    }
  }
  currentHeroThumb = next;

  // мягкое исчезновение → смена → появление
  heroStage.classList.add('swap');
  setTimeout(() => {
    heroImg.src       = next.querySelector('img').src;
    heroTitle.textContent = next.dataset.title;
    heroMeta.textContent  = next.dataset.meta;
    heroStage.classList.remove('swap');
  }, 350);
}

function startHero() {
  // первый кадр — сразу, без задержки
  const first = randomThumb();
  currentHeroThumb = first;
  heroImg.src           = first.querySelector('img').src;
  heroTitle.textContent = first.dataset.title;
  heroMeta.textContent  = first.dataset.meta;

  // дальше — каждые 3 секунды
  clearInterval(heroInterval);
  heroInterval = setInterval(updateHero, 3000);
}

function stopHero() {
  clearInterval(heroInterval);
  heroInterval = null;
}

// =====================================================
//   ПЕРЕКЛЮЧЕНИЕ ВИДОВ
// =====================================================

function showView(id) {
  views.forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Главная (Hero)
function showHero() {
  showView('view-hero');
  tabs.forEach(t => t.classList.remove('active'));
  // очищаем все плееры (чтобы не играли в фоне)
  clearAllPlayers();
  startHero();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Открыть жанр (без видео)
function openGenre(genre) {
  stopHero();
  tabs.forEach(t => t.classList.toggle('active', t.dataset.genre === genre));
  showView('view-' + genre);
  resetPlayer(genre);
  // сбрасываем подсветку миниатюр в этом жанре
  document.querySelectorAll('#view-' + genre + ' .thumb')
    .forEach(t => t.classList.remove('active'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Открыть жанр и сразу включить конкретное видео
function openGenreWithVideo(genre, kid, scrollToPlayer = false) {
  stopHero();
  tabs.forEach(t => t.classList.toggle('active', t.dataset.genre === genre));
  showView('view-' + genre);
  loadPlayer(genre, kid);

  // подсвечиваем активную миниатюру
  const view = document.getElementById('view-' + genre);
  view.querySelectorAll('.thumb').forEach(t =>
    t.classList.toggle('active', t.dataset.kid === kid));

  // сбрасываем плееры в других жанрах
  ['commercial','doc','film','music'].forEach(g => {
    if (g !== genre) resetPlayer(g);
  });

  // прокручиваем активную миниатюру в центр полосы
  const activeThumb = view.querySelector('.thumb.active');
  if (activeThumb) {
    activeThumb.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' });
  }

  // прокручиваем страницу к плееру
  if (scrollToPlayer) {
    setTimeout(() => {
      const player = document.getElementById('player-' + genre);
      player.scrollIntoView({ behavior:'smooth', block:'center' });
    }, 300);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// =====================================================
//   ПЛЕЕР KINESCOPE
// =====================================================

function loadPlayer(genre, kid) {
  const frame = document.getElementById('player-' + genre);
  frame.innerHTML = `
    <iframe
      src="https://kinescope.io/embed/${kid}"
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
      allowfullscreen
      frameborder="0">
    </iframe>
  `;
}

function resetPlayer(genre) {
  const frame = document.getElementById('player-' + genre);
  if (frame) {
    frame.innerHTML = '<div class="player-placeholder">Выберите проект выше ↑</div>';
  }
}

function clearAllPlayers() {
  ['commercial','doc','film','music'].forEach(g => resetPlayer(g));
}

// =====================================================
//   СОБЫТИЯ
// =====================================================

// Клик по вкладке жанра
tabs.forEach(tab => {
  tab.addEventListener('click', () => openGenre(tab.dataset.genre));
});

// Клик по большому кадру на главной
heroStage.addEventListener('click', () => {
  if (currentHeroThumb) {
    openGenreWithVideo(
      currentHeroThumb.dataset.genre,
      currentHeroThumb.dataset.kid,
      true  // прокрутить к плееру
    );
  }
});

// Клик по миниатюре в любом жанре
allThumbs.forEach(t => {
  t.addEventListener('click', () => {
    openGenreWithVideo(t.dataset.genre, t.dataset.kid, true);
  });
});

// Клик по логотипу — вернуться на главную
homeLink.addEventListener('click', e => {
  e.preventDefault();
  showHero();
});

// =====================================================
//   ЗАПУСК
// =====================================================
showHero();