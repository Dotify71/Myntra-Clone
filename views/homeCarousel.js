export function initCarousel() {
  const slidesEl = document.getElementById('heroSlides');
  const dotsEl = document.getElementById('heroDots');
  if (!slidesEl || !dotsEl) return;

  const slides = slidesEl.children;
  if (!slides || slides.length === 0) return;

  // Build dots
  dotsEl.innerHTML = '';
  const dots = [];
  for (let i = 0; i < slides.length; i++) {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.type = 'button';
    d.setAttribute('aria-label', `Go to slide ${i + 1}`);
    d.addEventListener('click', () => setIndex(i));
    dots.push(d);
    dotsEl.appendChild(d);
  }

  let idx = 0;
  let timer = null;

  function setIndex(i) {
    idx = i;
    slidesEl.style.transform = `translateX(${-100 * idx}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === idx));
  }

  function start() {
    stop();
    timer = setInterval(() => {
      const next = (idx + 1) % slides.length;
      setIndex(next);
    }, 3000);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  // autoplay
  setIndex(0);
  start();

  // pause on hover
  const carousel = slidesEl.closest('.heroCarousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
  }
}

