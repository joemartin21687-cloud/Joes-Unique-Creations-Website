const filters = document.querySelector('.gallery-filters');
const photos = document.querySelectorAll('.gallery-item');
const photoCount = document.querySelector('.gallery-count');

if (filters && photoCount) {
  filters.addEventListener('click', event => {
    const selected = event.target.closest('button[data-filter]');
    if (!selected) return;

    const category = selected.dataset.filter;
    let visible = 0;
    for (const photo of photos) {
      photo.hidden = category !== 'all' && photo.dataset.category !== category;
      if (!photo.hidden) visible++;
    }
    for (const button of filters.querySelectorAll('button')) {
      button.setAttribute('aria-pressed', String(button === selected));
    }
    photoCount.textContent = `${visible} photos`;
  });
  photoCount.textContent = `${photos.length} photos`;
  filters.hidden = false;
}

const viewer = document.getElementById('photo-viewer');
if (typeof viewer?.showModal === 'function') {
  const viewerImage = viewer.querySelector('img');

  for (const photo of photos) {
    photo.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      viewerImage.src = photo.href;
      viewerImage.alt = photo.querySelector('img').alt;
      viewer.showModal();
    });
  }
  viewer.querySelector('button').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target === viewer) viewer.close();
  });
}
