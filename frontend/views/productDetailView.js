import { PRODUCTS } from '../products.js';
import { addToCart } from '../cart.js';
import { toggleWishlistById, isWishlisted, moveWishlistToCart } from '../wishlist.js';
import { showToast } from './toast.js';
import { renderProductsGrid } from './productsGrid.js';

function ensureSizeSelection(sizeSelect) {
  if (!sizeSelect.value) {
    showToast('Select a size before adding to bag', 'warn');
    return null;
  }
  return sizeSelect.value;
}

export function renderProductDetail({ id }) {
  const root = document.getElementById('appRoot');
  if (!root) return;

  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) {
    root.innerHTML = `<div class="container" style="padding:26px 16px"><h2>Product not found</h2><a class="btn btnPrimary" href="#/products" style="display:inline-block;margin-top:14px">Back to products</a></div>`;
    return;
  }

  root.innerHTML = `
    <div class="container page">
      <div style="display:flex;gap:10px;align-items:center;color:var(--muted);font-weight:900;font-size:13px;margin-bottom:14px">
        <a href="#/home">Home</a> / <a href="#/products?category=${encodeURIComponent(product.category)}">${product.category}</a> / <span style="color:#111">${product.brand}</span>
      </div>

      <div class="pageGrid" style="grid-template-columns:1fr 380px">
        <div style="background:#fff;border:1px solid var(--border);border-radius:22px;padding:14px">
          <div style="display:grid;grid-template-columns:110px 1fr;gap:14px">
            <div style="display:flex;flex-direction:column;gap:10px">
              ${product.images.map((img, idx) => `
                <button class="thumbBtn" type="button" data-idx="${idx}" style="border:1px solid var(--border);border-radius:16px;overflow:hidden;background:#fff;cursor:pointer;padding:0;${idx===0?'box-shadow:0 0 0 4px rgba(255,63,108,.18);border-color:rgba(255,63,108,.45)':''}">
                  <img src="${img}" alt="Thumbnail ${idx+1}" style="width:100%;height:86px;object-fit:cover" />
                </button>
              `).join('')}
            </div>
            <div style="border-radius:18px;overflow:hidden">
              <img id="mainImg" src="${product.images[0]}" alt="${product.name}" style="width:100%;aspect-ratio: 3/4;object-fit: cover;border-radius:12px" />
            </div>
          </div>
        </div>

        <aside style="background:#fff;border:1px solid var(--border);border-radius:22px;padding:14px">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
            <div>
              <div style="font-weight:1000;color:#111">${product.brand}</div>
              <div style="font-size:18px;font-weight:1100;margin-top:6px;line-height:1.2">${product.name}</div>
            </div>
            <div class="rating" style="font-size:14px">★ ${product.rating.toFixed(1)}</div>
          </div>

          <div style="margin-top:12px" class="priceRow">
            <div class="priceNow" style="font-size:22px">₹${product.price.toLocaleString('en-IN')}</div>
            <div class="priceMrp" style="font-size:14px">₹${product.mrp.toLocaleString('en-IN')}</div>
            <div style="margin-left:auto;background:#fff1f5;border:1px solid rgba(255,63,108,.25);color:var(--pink);font-weight:1100;border-radius:999px;padding:7px 10px">${product.discountPercent}% OFF</div>
          </div>

          <div style="margin-top:14px">
            <div style="font-weight:1000;font-size:13px;color:var(--muted);margin-bottom:8px">Select Size</div>
            <select id="sizeSelect" class="select" style="width:100%">
              <option value="">Choose size</option>
              ${product.sizes.map((s)=>`<option value="${s}">${s}</option>`).join('')}
            </select>
          </div>

          <div style="display:flex;gap:10px;margin-top:14px">
            <button id="addToBagBtn" class="btn btnPrimary" type="button" style="flex:1">Add to Bag</button>
            <button id="wishBtn" class="btn btnGhost" type="button" style="flex:1">${isWishlisted(product.id) ? '♥ Saved' : '♡ Wishlist'}</button>
          </div>

          <div style="margin-top:14px;border-top:1px dashed #eee;padding-top:14px">
            <div style="font-weight:1000;font-size:13px;margin-bottom:8px">Description</div>
            <div style="color:var(--muted);font-weight:900;line-height:1.6;font-size:13px">${product.description}</div>
            <div style="margin-top:10px;color:#111;font-weight:1000;font-size:13px">
              Material: <span style="color:var(--muted);font-weight:900">${product.material}</span>
            </div>
            <div style="margin-top:6px;color:#111;font-weight:1000;font-size:13px">
              Care: <span style="color:var(--muted);font-weight:900">${product.care}</span>
            </div>
          </div>
        </aside>
      </div>

      <section class="section" style="padding-bottom:10px">
        <div class="rowHeader">
          <h2>You may also like</h2>
          <p>Similar products</p>
        </div>
        <div id="similarGrid" class="productsGrid"></div>
      </section>

    </div>
  `;

  // gallery thumbnails
  const mainImg = document.getElementById('mainImg');
  root.querySelectorAll('.thumbBtn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      const img = product.images[idx];
      if (mainImg) mainImg.src = img;
      // highlight
      root.querySelectorAll('.thumbBtn').forEach((b)=>{
        b.style.boxShadow = 'none';
        b.style.borderColor = 'var(--border)';
      });
      btn.style.boxShadow = '0 0 0 4px rgba(255,63,108,.18)';
      btn.style.borderColor = 'rgba(255,63,108,.45)';
    });
  });

  // buttons
  const sizeSelect = document.getElementById('sizeSelect');
  const addBtn = document.getElementById('addToBagBtn');
  const wishBtn = document.getElementById('wishBtn');

  function syncWishText() {
    const saved = isWishlisted(product.id);
    wishBtn.textContent = saved ? '♥ Saved' : '♡ Wishlist';
  }

  addBtn?.addEventListener('click', () => {
    const size = ensureSizeSelection(sizeSelect);
    if (!size) return;
    addToCart(product.id, { size, qty: 1 });
  });

  wishBtn?.addEventListener('click', () => {
    toggleWishlistById(product.id);
    syncWishText();
    window.dispatchEvent(new Event('myntra:wishlist-changed'));
  });

  // similar products
  const similar = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id)
    .sort((a,b)=>b.popularity-a.popularity)
    .slice(0,4);

  const grid = document.getElementById('similarGrid');
  grid.innerHTML = '';
  renderProductsGrid(grid, similar.length ? similar : PRODUCTS.slice(0,4), { context: 'similar' });
}

