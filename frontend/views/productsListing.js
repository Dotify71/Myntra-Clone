import { PRODUCTS, allBrands } from '../products.js';
import { renderProductsGrid } from './productsGrid.js';
import { getRoute } from '../router.js';
import { showLoadingSkeleton } from './skeleton.js';

const DELIVERY_FREE_AT = 499;

function matchesText(p, text) {
  const t = (text || '').toLowerCase().trim();
  if (!t) return true;
  return [p.name, p.brand, p.category].some((x) => String(x).toLowerCase().includes(t));
}

function parseFilters(query) {
  const out = {
    search: query.q || query.search || '',
    category: query.category || null,
    brand: query.brand ? String(query.brand).split(',') : [],
    priceMax: query.priceMax ? Number(query.priceMax) : 5000,
    ratingMin: query.ratingMin ? Number(query.ratingMin) : 0,
    sort: query.sort || 'popularity',
  };
  return out;
}

function applyFilters(products, f) {
  let list = [...products];
  if (f.category) list = list.filter((p) => p.category === f.category);
  if (f.brand && f.brand.length) list = list.filter((p) => f.brand.includes(p.brand));
  list = list.filter((p) => p.price <= f.priceMax);
  if (f.ratingMin > 0) list = list.filter((p) => p.rating >= f.ratingMin);
  list = list.filter((p) => matchesText(p, f.search));
  return list;
}

function sortProducts(list, sort) {
  const copy = [...list];
  if (sort === 'priceLow') copy.sort((a,b)=>a.price-b.price);
  else if (sort === 'priceHigh') copy.sort((a,b)=>b.price-a.price);
  else if (sort === 'new') copy.sort((a,b)=>new Date(b.arrival)-new Date(a.arrival));
  else if (sort === 'popularity') copy.sort((a,b)=>b.popularity-a.popularity);
  return copy;
}

function renderSidebar({ brands, filters }) {
  return `
    <div class="sidebar" id="sidebarFilters">
      <div class="sideHeader">
        <h3>Filters</h3>
        <button type="button" class="collapseBtn" id="clearAllBtn">Clear All</button>
      </div>

      <div class="filterBlock">
        <div class="filterTitle">Category</div>
        <div class="checkboxList">
          ${['Men','Women','Kids','Beauty'].map(c=>{
            const checked = filters.category===c ? 'checked' : '';
            return `<label class="checkbox"><input type="checkbox" data-filter="category" value="${c}" ${checked}/> <span>${c}</span></label>`;
          }).join('')}
        </div>
      </div>

      <div class="filterBlock">
        <div class="filterTitle">Price up to ₹${filters.priceMax}</div>
        <div class="rangeRow">
          <input type="range" min="0" max="5000" step="50" id="priceRange" value="${filters.priceMax}" />
          <div class="rangeVal">₹${filters.priceMax}</div>
        </div>
      </div>

      <div class="filterBlock">
        <div class="filterTitle">Brand</div>
        <div class="checkboxList" style="max-height:180px;overflow:auto">
          ${brands.map(b=>{
            const checked = filters.brand.includes(b) ? 'checked' : '';
            return `<label class="checkbox"><input type="checkbox" data-filter="brand" value="${b}" ${checked}/> <span>${b}</span></label>`;
          }).join('')}
        </div>
      </div>

      <div class="filterBlock">
        <div class="filterTitle">Customer Rating</div>
        <div class="checkboxList">
          ${[4.0,4.2,4.4,4.6].map(r=>{
            const checked = filters.ratingMin===r ? 'checked' : '';
            return `<label class="checkbox"><input type="checkbox" data-filter="ratingMin" value="${r}" ${checked}/> <span>★ ${r.toFixed(1)} & above</span></label>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function getActiveChips(query, filters) {
  const chips = [];
  if (filters.category) chips.push({ key: 'category', label: filters.category });
  if (filters.brand && filters.brand.length) chips.push({ key: 'brand', label: filters.brand.join(', ') });
  if (filters.priceMax && Number(filters.priceMax) < 5000) chips.push({ key: 'priceMax', label: `Up to ₹${filters.priceMax}` });
  if (filters.ratingMin) chips.push({ key: 'ratingMin', label: `★ ${filters.ratingMin.toFixed(1)}+` });
  if (filters.search) chips.push({ key: 'q', label: `“${filters.search}”` });
  return chips;
}

function updateQuery(next) {
  const route = window.location.hash || '#/products';
  const [path, qs] = route.split('?');
  const params = new URLSearchParams(qs || '');
  for (const [k,v] of Object.entries(next)) {
    if (v === null || v === '' || (Array.isArray(v) && v.length===0)) params.delete(k);
    else if (Array.isArray(v)) params.set(k, v.join(','));
    else params.set(k, String(v));
  }
  const newHash = `#${path.replace(/^#/, '')}?${params.toString()}`;
  window.location.hash = newHash;
}

export function renderProductsListing({ query = {} } = {}) {
  const root = document.getElementById('appRoot');
  if (!root) return;

  // initial
  const brands = allBrands();
  const filters = parseFilters(query);

  root.innerHTML = '';
  root.className = 'container';

  const page = document.createElement('div');
  page.className = 'page';

  const sidebarHtml = renderSidebar({ brands, filters });

  const chips = getActiveChips(query, filters);

  page.innerHTML = `
    <div class="pageGrid">
      ${sidebarHtml}
      <div>
        <div class="sortRow">
          <div class="count" id="resultsCount">${PRODUCTS.length} items</div>
          <select class="select" id="sortSelect" aria-label="Sort">
            <option value="popularity">Popularity</option>
            <option value="priceLow">Price Low→High</option>
            <option value="priceHigh">Price High→Low</option>
            <option value="new">New Arrivals</option>
          </select>
        </div>

        <div class="chips" id="activeChips"></div>

        <div id="listingGrid" style="position:relative"></div>
      </div>
    </div>
  `;

  root.appendChild(page);

  // set sort
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) sortSelect.value = filters.sort === 'popular' ? 'popularity' : filters.sort === 'popular' ? 'popularity' : filters.sort;

  const chipsEl = document.getElementById('activeChips');
  chipsEl.innerHTML = chips.map((c)=>`
    <div class="chip">${c.label}<button type="button" data-chip="${c.key}" aria-label="Remove filter">✕</button></div>
  `).join('');

  // initial skeleton
  const listing = document.getElementById('listingGrid');
  listing.innerHTML = '';
  listing.appendChild(showLoadingSkeleton());

  setTimeout(() => {
    let filtered = applyFilters(PRODUCTS, filters);
    const sorted = sortProducts(filtered, filters.sort);

    // update count
    const countEl = document.getElementById('resultsCount');
    if (countEl) countEl.textContent = `${sorted.length} items`;

    listing.innerHTML = '';
    renderProductsGrid(listing, sorted.slice(0,16), { context: 'listing' });
  }, 420);

  // events: sort
  sortSelect?.addEventListener('change', () => {
    updateQuery({ sort: sortSelect.value });
  });

  // clear all
  document.getElementById('clearAllBtn')?.addEventListener('click', () => {
    updateQuery({ category: null, brand: [], priceMax: 5000, ratingMin: 0, q: '' });
  });

  // sidebar interactions: checkbox -> update query
  const sidebar = document.getElementById('sidebarFilters');
  sidebar?.addEventListener('change', (e) => {
    const t = e.target;
    if (!(t instanceof HTMLInputElement)) return;
    if (!t.dataset.filter) return;

    const type = t.dataset.filter;
    const val = t.value;

    // read existing
    const current = parseFilters(getRoute().query);

    if (type === 'category') {
      const checked = Array.from(sidebar.querySelectorAll('input[data-filter="category"]:checked')).map(x=>x.value);
      updateQuery({ category: checked[0] || null });
    }

    if (type === 'brand') {
      const checked = Array.from(sidebar.querySelectorAll('input[data-filter="brand"]:checked')).map(x=>x.value);
      updateQuery({ brand: checked });
    }

    if (type === 'ratingMin') {
      // single selection
      const checked = Array.from(sidebar.querySelectorAll('input[data-filter="ratingMin"]:checked')).map(x=>Number(x.value));
      updateQuery({ ratingMin: checked[0] || 0 });
    }
  });

  // price range
  const priceRange = document.getElementById('priceRange');
  priceRange?.addEventListener('input', () => {
    const rangeVal = priceRange.value;
    const rangeBox = priceRange.parentElement.querySelector('.rangeVal');
    if (rangeBox) rangeBox.textContent = `₹${rangeVal}`;
  });
  // Apply on input for immediate filtering (better UX + matches test expectations)
  priceRange?.addEventListener('input', () => {
    updateQuery({ priceMax: priceRange.value });
  });


  // chips removal
  chipsEl?.addEventListener('click', (e) => {
    const btn = e.target;
    if (!(btn instanceof HTMLElement)) return;
    if (!btn.dataset.chip) return;
    const k = btn.dataset.chip;

    if (k === 'category') updateQuery({ category: null });
    if (k === 'brand') updateQuery({ brand: [] });
    if (k === 'priceMax') updateQuery({ priceMax: 5000 });
    if (k === 'ratingMin') updateQuery({ ratingMin: 0 });
    if (k === 'q') updateQuery({ q: '' });
  });
}

