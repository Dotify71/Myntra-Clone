import { PRODUCTS } from '../products.js';
import { isWishlisted, toggleWishlistById } from '../wishlist.js';
import { addToCart } from '../cart.js';

function createHeartSvg(filled) {
  const fill = filled ? 'var(--pink)' : 'none';
  const stroke = filled ? 'var(--pink)' : '#111';
  return `
    <svg viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M20.8 4.6c-1.6-1.6-4.2-1.6-5.8 0L12 7.6l-3-3c-1.6-1.6-4.2-1.6-5.8 0s-1.6 4.2 0 5.8l3 3L12 21.3l5.8-7.9 3-3c1.6-1.6 1.6-4.2 0-5.8z"/>
    </svg>
  `;
}

export function renderProductsGrid(container, products, { context = 'default', onProductClick } = {}) {
  container.className = 'productsGrid';
  container.innerHTML = '';

  products.forEach((p, idx) => {
    const delayMs = idx * 50;
    const wish = isWishlisted(p.id);
    const card = document.createElement('a');
    card.href = `#/product/${p.id}`;
    card.className = 'productCard';
    card.setAttribute('aria-label', `View product: ${p.name}`);

    card.innerHTML = `
      <div class="productImgWrap">
        <img class="productImg" src="${p.images[0]}" alt="${p.name}" loading="lazy" />
        <div class="discountPill">${p.discountPercent}% OFF</div>
        <button class="wishBtn" type="button" aria-label="Toggle wishlist for ${p.name}">
          ${createHeartSvg(wish)}
        </button>
        <div class="quickAdd">
          <button class="btn btnPrimary quickAddBtn" type="button" data-quick-add="${p.id}">Quick Add</button>
        </div>
      </div>

      <div class="productBody">
        <div class="brandLine">
          <div class="brandName">${p.brand}</div>
          <div class="rating">★ ${p.rating.toFixed(1)}</div>
        </div>
        <div class="productName">${p.name}</div>
        <div class="priceRow">
          <div class="priceNow">₹${p.price.toLocaleString('en-IN')}</div>
          <div class="priceMrp">₹${p.mrp.toLocaleString('en-IN')}</div>
        </div>
      </div>
    `;

    // Wish button click
    const wishBtn = card.querySelector('.wishBtn');
    wishBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // trigger pop + fill animation
      wishBtn.classList.add('wishPop');
      setTimeout(() => wishBtn.classList.remove('wishPop'), 260);

      toggleWishlistById(p.id);

      // re-render icon immediately
      const nextFilled = !wish;
      wishBtn.innerHTML = createHeartSvg(nextFilled);
    });

    // Quick add: choose first size + micro interaction
    const quickBtn = card.querySelector('[data-quick-add]');
    quickBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const originalText = quickBtn.textContent;
      quickBtn.disabled = true;
      quickBtn.classList.add('quickAddPressed');

      addToCart(p.id, { size: p.sizes?.[0], qty: 1 });

      // show checkmark for ~1s
      quickBtn.innerHTML = '✓';
      setTimeout(() => {
        quickBtn.innerHTML = originalText;
        quickBtn.classList.remove('quickAddPressed');
        quickBtn.disabled = false;
      }, 1000);
    });

    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
    card.style.transition = `opacity .35s ease ${delayMs}ms, transform .35s ease ${delayMs}ms`;
    requestAnimationFrame(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });

    container.appendChild(card);
  });
}

