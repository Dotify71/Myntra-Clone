import { renderProductsGrid } from './productsGrid.js';
import { getWishlistItemsDetailed } from '../wishlist.js';
import { showLoadingSkeleton } from './skeleton.js';
import { moveWishlistToCart, toggleWishlistById, isWishlisted } from '../wishlist.js';
import { DELIVERY_FEE, computeCartTotals } from '../cart.js';
import { loadCart } from '../store.js';

function renderEmpty(root) {
  root.innerHTML = `
    <div class="container" style="padding:26px 16px">
      <h2 style="font-size:20px">Your wishlist is empty</h2>
      <p style="color:var(--muted);font-weight:900;margin-top:8px">Save items by tapping the heart icon.</p>
      <a class="btn btnPrimary" href="#/products" style="display:inline-block;margin-top:14px">Shop products</a>
    </div>
  `;
}

export function renderWishlist() {
  const root = document.getElementById('appRoot');
  if (!root) return;

  const items = getWishlistItemsDetailed();

  if (!items.length) return renderEmpty(root);

  root.innerHTML = `
    <div class="page container" style="padding:18px 0 50px">
      <div class="rowHeader">
        <h2>Your Wishlist</h2>
        <p>${items.length} saved</p>
      </div>
      <div class="productsGrid" id="wishGrid"></div>
    </div>
  `;

  const grid = document.getElementById('wishGrid');
  grid.innerHTML = '';
  grid.appendChild(showLoadingSkeleton());

  setTimeout(()=>{
    grid.innerHTML = '';
    // reuse products grid but include move to bag by overlay: quick-add already does quick add with first size
    // For wishlist requirement we add explicit Move to Bag on hover via wishlist wrapper.
    grid.className = 'productsGrid';
    grid.innerHTML = '';
    items.forEach((p)=>{
      const wish = true;
      const card = document.createElement('a');
      card.href = `#/product/${p.id}`;
      card.className = 'productCard';
      card.innerHTML = `
        <div class="productImgWrap">
          <img src="${p.images[0]}" alt="${p.name}" loading="lazy" />
          <div class="discountPill">${p.discountPercent}% OFF</div>
          <button class="wishBtn" type="button" aria-label="Toggle wishlist">
            <svg viewBox="0 0 24 24" fill="var(--pink)" stroke="var(--pink)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20.8 4.6c-1.6-1.6-4.2-1.6-5.8 0L12 7.6l-3-3c-1.6-1.6-4.2-1.6-5.8 0s-1.6 4.2 0 5.8l3 3L12 21.3l5.8-7.9 3-3c1.6-1.6 1.6-4.2 0-5.8z"/>
            </svg>
          </button>
          <div class="quickAdd">
            <button class="btn btnPrimary" type="button" data-move-bag="${p.id}">Move to Bag</button>
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

      card.querySelector('.wishBtn').addEventListener('click',(e)=>{
        e.preventDefault();e.stopPropagation();
        toggleWishlistById(p.id);
      });

      card.querySelector('[data-move-bag]').addEventListener('click',(e)=>{
        e.preventDefault();e.stopPropagation();
        // default size first; PDP allows selecting size.
        moveWishlistToCart(p.id,{ size: p.sizes?.[0] });
      });

      grid.appendChild(card);
    });
  }, 420);
}

