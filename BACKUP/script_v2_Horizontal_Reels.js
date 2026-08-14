const filters = document.querySelectorAll('.filter');
const works = document.querySelectorAll('.work');

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const g = btn.dataset.genre;
    works.forEach(w => {
      w.style.display = (g === 'all' || w.dataset.genre === g) ? '' : 'none';
    });
  });
});