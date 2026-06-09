import { PRODUCTS } from './products.js';
import { loadWishlist, saveWishlist, upsertCartItem } from './store.js';
import { showToast } from './views/toast.js';

export function getWishlistIds() {

  const w = loadWishlist();
  return new Set(w.ids || []);
}

export function toggleWishlistById(productId) {
  const w = loadWishlist();
  const set = new Set(w.ids || []);
  const before = set.has(productId);
  if (before) set.delete(productId);
  else set.add(productId);
  saveWishlist({ ids: Array.from(set) });

  showToast(before ? 'Removed from wishlist' : 'Saved to wishlist', 'success');
  window.dispatchEvent(new Event('myntra:wishlist-changed'));
}

export function isWishlisted(productId) {
  return getWishlistIds().has(productId);
}

export function getWishlistItemsDetailed() {
  const ids = getWishlistIds();
  return PRODUCTS.filter((p) => ids.has(p.id));
}

export function moveWishlistToCart(productId, { size }) {
  if (!size) {
    showToast('Select a size before moving to bag', 'warn');
    return;
  }
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  // Add qty=1 into cart (merge by productId+size)
  upsertCartItem({ product, size, qty: 1 });
  showToast('Moved to bag', 'success');

  // Remove from wishlist
  const ids = getWishlistIds();
  ids.delete(productId);
  saveWishlist({ ids: Array.from(ids) });
  window.dispatchEvent(new Event('myntra:wishlist-changed'));
  window.dispatchEvent(new Event('myntra:cart-changed'));
}

