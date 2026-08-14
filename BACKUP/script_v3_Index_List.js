// === ФИЛЬТР ПО ЖАНРАМ ===
const filters = document.querySelectorAll('.filter');
const works = document.querySelectorAll('.work');

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    // снимаем выделение со всех кнопок и ставим на текущую
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // показываем/скрываем работы по жанру
    const genre = btn.dataset.genre;
    works.forEach(w => {
      if (genre === 'all' || w.dataset.genre === genre) {
        w.style.display = '';
      } else {
        w.style.display = 'none';
      }
    });
  });
});

// === ПРЕВЬЮ СПРАВА ===
const previewImg = document.getElementById('preview-img');

works.forEach((w, i) => {
  // добавляем номер работы (01, 02, 03 ...)
  w.setAttribute('data-num', String(i + 1).padStart(2, '0'));

  // при наведении мышкой — меняем картинку в превью
  const src = w.querySelector('img').src;
  w.addEventListener('mouseenter', () => {
    previewImg.src = src;
  });
});