const thumbs = document.querySelectorAll('.thumb');
const filters = document.querySelectorAll('.filter');
const bigImg = document.getElementById('big-img');
const bigTitle = document.getElementById('big-title');
const bigMeta = document.getElementById('big-meta');
const bigLink = document.getElementById('big-link');

function setBig(thumb) {
  bigImg.src = thumb.querySelector('img').src;
  bigTitle.textContent = thumb.dataset.title;
  bigMeta.textContent = thumb.dataset.meta;
  bigLink.href = thumb.dataset.href;
  thumbs.forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

thumbs.forEach(t => {
  t.addEventListener('click', () => setBig(t));
});

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const g = btn.dataset.genre;
    let firstVisible = null;
    thumbs.forEach(t => {
      const show = (g === 'all' || t.dataset.genre === g);
      t.style.display = show ? '' : 'none';
      if (show && !firstVisible) firstVisible = t;
    });
    if (firstVisible) setBig(firstVisible);
  });
});