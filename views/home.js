import { PRODUCTS } from '../products.js';
import { renderProductsGrid } from './productsGrid.js';
import { initCarousel } from '../views/homeCarousel.js';
import { showLoadingSkeleton } from './skeleton.js';

export function renderHome() {
  const root = document.getElementById('appRoot');
  if (!root) return;

  root.innerHTML = '';

  // Layout
  const home = document.createElement('div');
  home.className = 'container';

  home.innerHTML = `
    <section class="section">
      <div class="tickerBar" role="region" aria-label="Top offers">
        <div class="tickerTrack" aria-hidden="true">
          <div class="tickerItem">🚚 <span>FREE</span> Delivery on orders above ₹499</div>
          <div class="tickerItem">💳 <span>COD</span> available</div>
          <div class="tickerItem">🎁 <span>Festive</span> deals live now</div>
          <div class="tickerItem">🚚 <span>FREE</span> Delivery on orders above ₹499</div>
          <div class="tickerItem">💳 <span>COD</span> available</div>
          <div class="tickerItem">🎁 <span>Festive</span> deals live now</div>
        </div>
      </div>

      <div class="hero" style="margin-top:14px; min-height:420px;">
<div class="heroCarousel" aria-label="Hero carousel" style="overflow:hidden; height:100%; min-height:420px;">
          <div class="heroSlides" id="heroSlides">
            <div class="heroSlide" style="position:relative; overflow:hidden; height:100%">
              <img alt="Fashion sale banner" src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&h=600&fit=crop" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; z-index:0" onerror="this.style.display='none'" />

              <div class="heroOverlay" style="background: linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 60%);"></div>
              <div class="heroContent" style="position:relative; z-index:1; padding: 0 60px; padding-top:60px; max-width:500px; top:0; transform:none;">
                <div class="heroKicker">NEW SEASON</div>
                <div class="heroTitle">Up to 60% off</div>
                <div class="heroSub">Shop trendy styles for Men, Women & Kids — limited time.</div>
                <div class="heroCtas">
                  <button class="btn btnPrimary" data-cta="shop">Shop Now</button>
                  <a class="btn btnGhost" href="#/products">Explore Products</a>
                </div>
              </div>
            </div>
            <div class="heroSlide" style="position:relative; overflow:hidden; height:100%">
              <img alt="Beauty deals banner" src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=600&fit=crop" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; z-index:0" onerror="this.style.display='none'" />


              <div class="heroOverlay"></div>
              <div class="heroContent" style="position:relative; z-index:1; padding: 40px 60px; max-width: 500px;">
                <div class="heroKicker">BEAUTY CARE</div>
                <div class="heroTitle">Glow & Go</div>
                <div class="heroSub">Top picks from skincare, haircare and makeup.</div>
                <div class="heroCtas">
                  <a class="btn btnPrimary" href="#/products?category=Beauty">Shop Beauty</a>
                  <a class="btn btnGhost" href="#/products?sort=popular">Trending</a>
                </div>
              </div>
            </div>
            <div class="heroSlide" style="position:relative; overflow:hidden; height:100%">
              <img alt="Footwear deals banner" src="https://images.unsplash.com/photo-1469334291162-e7d4e8a852f6?w=1400&h=600&fit=crop" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; z-index:0" onerror="this.style.display='none'" />

              <div class="heroOverlay"></div>
              <div class="heroContent" style="position:relative; z-index:1; padding: 40px 60px; max-width: 500px;">
                <div class="heroKicker">FOOTWEAR</div>
                <div class="heroTitle">Step into comfort</div>
                <div class="heroSub">Sneakers and sandals with everyday style.</div>
                <div class="heroCtas">
                  <a class="btn btnPrimary" href="#/products?category=Women">Shop Women</a>
                  <a class="btn btnGhost" href="#/products?category=Men">Shop Men</a>
                </div>
              </div>
            </div>
          </div>
          <div class="heroDots" id="heroDots"></div>
        </div>
      </div>

      <div class="section" style="padding-top:22px">
        <div class="rowHeader">
          <h2>Shop by Category</h2>
          <p>Curated picks</p>
        </div>
        <div class="categoryGrid">
          <a class="categoryCard" href="#/products?category=Men" aria-label="Men category">
            <img alt="Men" src="https://picsum.photos/id/1012/300/400" />
            <div class="label">Men</div>

          </a>
          <a class="categoryCard" href="#/products?category=Women" aria-label="Women category">
            <img alt="Women" src="https://picsum.photos/id/1027/300/400" />
            <div class="label">Women</div>

          </a>
          <a class="categoryCard" href="#/products?category=Kids" aria-label="Kids category">
            <img alt="Kids" src="https://picsum.photos/id/1005/300/400" />
            <div class="label">Kids</div>

          </a>
          <a class="categoryCard" href="#/products?category=Beauty" aria-label="Beauty category">
            <img alt="Beauty" src="https://picsum.photos/id/1011/300/400" />
            <div class="label">Beauty</div>

          </a>
          <a class="categoryCard" href="#/products?category=Home%20Appliances" aria-label="Home Appliances category">
            <img alt="Home appliances" src="https://picsum.photos/id/1026/300/400" />
            <div class="label">Home</div>

          </a>
        </div>
      </div>

      <section class="section">
        <div class="rowHeader">
          <h2>Trending Now</h2>
          <p>Popular picks</p>
        </div>
        <div id="trendingRow" class="productsGrid"></div>
      </section>

      <section class="section">
        <div class="rowHeader">
          <h2>New Arrivals</h2>
          <p>Fresh drops</p>
        </div>
        <div id="newArrivalsRow" class="productsGrid"></div>
      </section>

      <section class="section">
        <div class="rowHeader">
          <h2>Brands you love</h2>
          <p>Top labels</p>
        </div>
        <div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center;background:#fff;border:1px solid var(--border);border-radius:18px;padding:14px">
          ${['Roadster','H&M','Levi’s','Nike','Puma','HRX','Zudio','Biba','Plum','Lakme','Nivea','Mamaearth','Philips'].map(b=>`
            <div style="padding:10px 12px;border:1px solid var(--border);border-radius:999px;font-weight:1000;color:#111;background:#fff">${b}</div>
          `).join('')}
        </div>
      </section>

      <section class="section">
        <div class="grid2">
          <div style="background:#fff;border:1px solid var(--border);border-radius:22px;overflow:hidden">
            <img alt="Festival sale" src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&h=600&fit=crop" style="width:100%;height:100%;object-fit:cover;max-height:320px" />

          </div>
          <div style="background:#fff;border:1px solid var(--border);border-radius:22px;padding:16px">
            <h2 style="font-size:18px;margin-bottom:10px">Festival / Sale</h2>
            <p style="color:var(--muted);font-weight:900;line-height:1.5">Limited time offers on best sellers. Add to bag now and checkout when ready.</p>
            <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap">
              <a class="btn btnPrimary" href="#/products?sort=popular">Shop Best Sellers</a>
              <a class="btn btnGhost" href="#/wishlist">View Wishlist</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="rowHeader">
          <h2>Get the app</h2>
          <p>Experience Myntra on mobile</p>
        </div>
        <div style="background:#fff;border:1px solid var(--border);border-radius:22px;padding:16px;display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap">
          <div>
            <h3 style="font-size:16px">Download Myntra Clone</h3>
            <p style="color:var(--muted);font-weight:900;margin-top:6px">Seamless shopping, quick wishlist and fast checkout.</p>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <div style="padding:10px 14px;border-radius:16px;border:1px solid var(--border);font-weight:1000;background:#fff">App Store</div>
            <div style="padding:10px 14px;border-radius:16px;border:1px solid var(--border);font-weight:1000;background:#fff">Google Play</div>
          </div>
        </div>
      </section>

    </section>

    <footer class="footer" style="margin-top:10px;background:#fafbfc;border-top:1px solid rgba(229,231,235,.9);padding:34px 0">
      <div class="container" style="padding:0 16px">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;align-items:start">
          <div>
            <h4 style="font-size:13px;margin-bottom:8px">ONLINE SHOPPING</h4>
            ${['Men','Women','Kids','Home','Beauty'].map(x=>`<div style="color:#6b7280;font-weight:900;font-size:13px;margin:6px 0">${x}</div>`).join('')}
          </div>
          <div>
            <h4 style="font-size:13px;margin-bottom:8px">CUSTOMER POLICIES</h4>
            ${['Contact Us','FAQ','T&C','Returns','Track Orders'].map(x=>`<div style="color:#6b7280;font-weight:900;font-size:13px;margin:6px 0">${x}</div>`).join('')}
          </div>
          <div>
            <h4 style="font-size:13px;margin-bottom:8px">USEFUL LINKS</h4>
            ${['Blog','Careers','Site Map','Bulk Orders'].map(x=>`<div style="color:#6b7280;font-weight:900;font-size:13px;margin:6px 0">${x}</div>`).join('')}
          </div>
          <div>
            <h4 style="font-size:13px;margin-bottom:8px">SOCIAL</h4>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              ${['Instagram','Twitter','YouTube','Facebook'].map(s=>`<div style="border:1px solid var(--border);border-radius:999px;padding:8px 10px;font-weight:1000;font-size:13px;background:#fff">${s}</div>`).join('')}
            </div>
          </div>
        </div>
        <div style="margin-top:18px;color:#6b7280;font-weight:900;font-size:12px">© ${new Date().getFullYear()} Myntra Clone — Educational Use</div>
      </div>
    </footer>
  `;

  root.appendChild(home);

  // Carousel init
  initCarousel();

  // Render products rows
  const trending = [...PRODUCTS].sort((a,b)=>b.popularity-a.popularity).slice(0,8);
  const arrivals = [...PRODUCTS].sort((a,b)=>new Date(b.arrival)-new Date(a.arrival)).slice(0,8);

  const trendingEl = document.getElementById('trendingRow');
  const newEl = document.getElementById('newArrivalsRow');
  trendingEl.innerHTML = '';
  newEl.innerHTML = '';

  trendingEl.appendChild(showLoadingSkeleton());
  newEl.appendChild(showLoadingSkeleton());

  setTimeout(()=>{
    trendingEl.innerHTML = '';
    newEl.innerHTML = '';
    renderProductsGrid(trendingEl, trending, { context: 'home' });
    renderProductsGrid(newEl, arrivals, { context: 'home' });
  }, 450);

  home.querySelectorAll('[data-cta="shop"]').forEach((b)=>b.addEventListener('click', ()=>{
    window.location.hash = '#/products?sort=popular';
  }));
}

