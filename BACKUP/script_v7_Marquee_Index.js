const genres = document.querySelectorAll('.genre');
const works = document.querySelectorAll('.work');
const track = document.getElementById('marquee-track');

const labels = {
  commercial: 'Commercials',
  doc: 'Documentary',
  film: 'Narrative',
  music: 'Music Videos'
};

function showGenre(genre) {
  works.forEach(w => {
    w.style.display = (w.dataset.genre === genre) ? '' : 'none';
  });
  const label = labels[genre];
  track.innerHTML = Array(8).fill(`<span>${label}</span><span>·</span>`).join('');
}

showGenre('commercial');

genres.forEach(g => {
  g.addEventListener('click', () => {
    genres.forEach(x => x.classList.remove('active'));
    g.classList.add('active');
    showGenre(g.dataset.genre);
  });
});