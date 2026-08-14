const tabs = document.querySelectorAll('.tab');
const works = document.querySelectorAll('.work');

function showGenre(genre) {
  works.forEach(w => {
    w.style.display = (w.dataset.genre === genre) ? '' : 'none';
  });
}

// показать первый жанр при загрузке
showGenre('commercial');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    showGenre(tab.dataset.genre);
  });
});