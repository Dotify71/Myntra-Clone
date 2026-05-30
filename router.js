import { renderHome } from './views/home.js';
import { renderProductsListing } from './views/productsListing.js';
import { renderWishlist } from './views/wishlistView.js';
import { renderCart } from './views/cartView.js';
import { renderProductDetail } from './views/productDetailView.js';
import { renderOrders } from './views/ordersView.js';

const ROUTE_RE = /^#(?<raw>.*?)(?:\?(?<query>.*))?$/;

function normalizeRoute(rawPath) {
  // Accept both "#/home" and "#home" forms
  const p = String(rawPath || '').trim();
  if (!p) return '/home';
  // If user typed "#home" then p will be "home"
  if (!p.startsWith('/')) return `/${p}`;
  return p;
}


function parseQuery(qs) {
  const params = new URLSearchParams(qs || '');
  const obj = {};
  for (const [k, v] of params.entries()) obj[k] = v;
  return obj;
}

export function getRoute() {
  const hash = window.location.hash || '#/home';
  const match = hash.match(ROUTE_RE);
  const raw = match?.groups?.raw ?? (hash.startsWith('#/') ? hash.slice(2) : hash.slice(1));
  const path = normalizeRoute(raw);


  const query = match?.groups?.query ? parseQuery(match.groups.query) : {};
  const segments = path.split('/').filter(Boolean);
  return { path, segments, query, hash };
}

export function initRouter() {
  const onHash = () => {
    const { segments, query } = getRoute();
    const first = segments[0] || 'home';

    // Route switch
    if (first === 'home') return renderHome({ query });
    if (first === 'products') return renderProductsListing({ query });
    if (first === 'wishlist') return renderWishlist();
    if (first === 'cart') return renderCart();
    if (first === '') return renderHome({ query });
    if (first === 'product') {
      const id = segments[1];
      if (!id) return renderProductDetail({ id: null });
      return renderProductDetail({ id });
    }
    if (first === 'orders') return renderOrders();

    // Fallback
    return renderHome({ query: {} });
  };

  window.addEventListener('hashchange', onHash);
  onHash();
}

