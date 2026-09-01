// =====================================================
//   ПОРТФОЛИО — ЛОГИКА САЙТА
// =====================================================

const worksTab   = document.getElementById('works-tab');
const views      = document.querySelectorAll('.view');
const allThumbs  = document.querySelectorAll('.thumb');
const homeLink   = document.getElementById('home-link');

const heroStage  = document.getElementById('hero-stage');
const heroImg    = document.getElementById('hero-img');
const heroTitle  = document.getElementById('hero-title');
const heroMeta   = document.getElementById('hero-meta');

let heroInterval     = null;
let currentHeroThumb = null;

// =====================================================
//   ГЛАВНАЯ — ЧЕРЕДОВАНИЕ КАДРОВ БЕЗ ПОВТОРОВ
// =====================================================

let heroDeck      = [];   // текущая «колода» работ
let heroDeckIndex = 0;    // позиция в колоде

// Перемешивание массива (алгоритм Фишера–Йетса)
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Сформировать новую колоду из всех работ
function buildDeck() {
  // только работы, не помеченные как исключённые из Hero
  const all = Array.from(allThumbs).filter(t => t.dataset.heroExclude !== 'true');
  let deck = shuffle(all);
  // если новая колода начинается с той же работы, что показана сейчас —
  // меняем её с какой-нибудь дальше, чтобы не было повтора на стыке
  if (currentHeroThumb && deck.length > 1 && deck[0] === currentHeroThumb) {
    [deck[0], deck[1]] = [deck[1], deck[0]];
  }
  return deck;
}

// Получить следующую работу из колоды
function nextThumb() {
  if (heroDeckIndex >= heroDeck.length) {
    heroDeck = buildDeck();
    heroDeckIndex = 0;
  }
  return heroDeck[heroDeckIndex++];
}

function updateHero() {
  const next = nextThumb();
  currentHeroThumb = next;

  heroStage.classList.add('swap');
  setTimeout(() => {
    const desktopSrc = next.querySelector('img').src;
    const mobileSrc  = next.dataset.imgMobile || desktopSrc;

    document.getElementById('hero-img').src         = desktopSrc;
    document.getElementById('hero-img-mobile').src  = mobileSrc;

    heroTitle.textContent = next.dataset.title;
    heroMeta.textContent  = next.dataset.meta;
    heroStage.classList.remove('swap');
  }, 350);
}

function startHero() {
  heroDeck = buildDeck();
  heroDeckIndex = 0;

  const first = heroDeck[heroDeckIndex++];
  currentHeroThumb = first;

  const desktopSrc = first.querySelector('img').src;
  const mobileSrc  = first.dataset.imgMobile || desktopSrc;

  document.getElementById('hero-img').src        = desktopSrc;
  document.getElementById('hero-img-mobile').src = mobileSrc;

  heroTitle.textContent = first.dataset.title;
  heroMeta.textContent  = first.dataset.meta;

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

function showHero() {
  showView('view-hero');
  worksTab.classList.remove('active');
  clearAllPlayers();
  startHero();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showWorks() {
  stopHero();
  showView('view-works');
  worksTab.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Открыть Works и сразу включить конкретное видео
function showWorksWithVideo(genre, kid) {
  stopHero();
  showView('view-works');
  worksTab.classList.add('active');

  loadPlayer(kid);

  document.querySelectorAll('.thumb').forEach(t => {
    t.classList.toggle('active', t.dataset.kid === kid && t.dataset.genre === genre);
  });

  // прокрутка к единому плееру
  setTimeout(() => {
    const player = document.getElementById('global-player');
    if (player) player.scrollIntoView({ behavior:'smooth', block:'center' });
  }, 250);
}

// =====================================================
//   ПЛЕЕР KINESCOPE
// =====================================================

// =====================================================
//   ПОДПИСИ "ПОЛНАЯ ВЕРСИЯ" ДЛЯ ОТДЕЛЬНЫХ РАБОТ
//   Ключ = data-kid работы
// =====================================================

const fullVersions = {
  // Последний сезон
  'oVFPMuGCPP9yjT3HmVxnFJ': {
    text: 'Смотреть полную версию на КИНОПОИСК',
    url:  'https://www.kinopoisk.ru/film/8129965/?socialAlias=NjI5MjgzODk%3D'
  },
  // Глазами младенца
  'mtN2HgVNwgf5D84Md1mvJu': {
    text: 'Смотреть полную версию на ИВИ',
    url:  'https://www.ivi.ru/watch/glazami-mladentsa?utm_source=share&utm_medium=direct&utm_campaign=2416165262'
  },
  // Гонимые ветром. Северные курилы — без ссылки
  'eyZea8Cji9j75VaCVnuBPb': {
    text: 'Полный фильм ещё в производстве',
    url:  null
  }
};

// Показать / скрыть подпись над плеером
function updatePlayerNote(kid) {
  const note = document.getElementById('player-note');
  if (!note) return;

  const info = fullVersions[kid];

  // Если для этой работы подписи нет — прячем блок
  if (!info) {
    note.style.display = 'none';
    note.innerHTML = '';
    return;
  }

  // Подпись есть — показываем
  note.style.display = 'block';

  if (info.url) {
    // со ссылкой
    note.innerHTML =
      `<a href="${info.url}" target="_blank" rel="noopener">${info.text}</a>`;
  } else {
    // просто текст (Гонимые ветром)
    note.textContent = info.text;
  }
}


function loadPlayer(kid) {
  const frame = document.getElementById('player-main');
  if (!frame) return;
  frame.innerHTML = `
    <iframe
      src="https://kinescope.io/embed/${kid}"
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
      allowfullscreen
      frameborder="0">
    </iframe>
  `;
  updatePlayerNote(kid);
}

function resetPlayer() {
  const frame = document.getElementById('player-main');
  if (frame) {
    frame.innerHTML = '<div class="player-placeholder">Выберите проект выше ↑</div>';
  }

  // ← ДОБАВИТЬ: убираем подпись
  const note = document.getElementById('player-note');
  if (note) {
    note.style.display = 'none';
    note.innerHTML = '';
  }
}

function clearAllPlayers() {
  resetPlayer();
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
}

// =====================================================
//   СОБЫТИЯ
// =====================================================

// Клик по «Works»
worksTab.addEventListener('click', () => {
  clearAllPlayers();
  showWorks();
});

// Клик по большому кадру на Hero
heroStage.addEventListener('click', () => {
  if (currentHeroThumb) {
    showWorksWithVideo(
      currentHeroThumb.dataset.genre,
      currentHeroThumb.dataset.kid
    );
  }
});

// Клик по миниатюре
allThumbs.forEach(t => {
  t.addEventListener('click', () => {
    showWorksWithVideo(t.dataset.genre, t.dataset.kid);
  });
});

// Клик по логотипу — возврат на главную
homeLink.addEventListener('click', e => {
  e.preventDefault();
  showHero();
});

// =====================================================
//   ЗАПУСК
// =====================================================

// Контакт — переход на Works и скролл к футеру
document.getElementById('contact-link').addEventListener('click', e => {
  e.preventDefault();
  // если сейчас Hero — сначала переключаемся на Works
  if (document.getElementById('view-hero').classList.contains('active')) {
    stopHero();
    showView('view-works');
    worksTab.classList.add('active');
  }
  // даём кадру отрисоваться и плавно скроллим к футеру
  setTimeout(() => {
    document.getElementById('contact').scrollIntoView({ behavior:'smooth', block:'start' });
  }, 50);
});

showHero();

// Появление рядов при скролле
const reelObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      reelObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reel').forEach(r => reelObserver.observe(r));

// Маркер "Trailer" и строка доступности
document.querySelectorAll('.thumb[data-trailer="true"]').forEach(t => {
  // бейдж на обложке
  const badge = document.createElement('span');
  badge.className = 'trailer-badge';
  badge.textContent = 'TRAILER';
  t.appendChild(badge);

  // строка доступности под подписью
  const avail = t.dataset.availability;
  if (avail) {
    const note = document.createElement('span');
    note.className = 'thumb-availability';
    note.textContent = avail;
    t.querySelector('.thumb-label').appendChild(document.createElement('br'));
    t.querySelector('.thumb-label').appendChild(note);
  }
});
