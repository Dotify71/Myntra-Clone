const CART_KEY = 'myntra_cart_v1';
const WISHLIST_KEY = 'myntra_wishlist_v1';
const AUTH_KEY = 'myntra_auth_v1';

export function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return { items: [] };
    return JSON.parse(raw);
  } catch {
    return { items: [] };
  }
}

export function saveCart(state) {
  localStorage.setItem(CART_KEY, JSON.stringify(state));
}

export function loadWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (!raw) return { ids: [] };
    return JSON.parse(raw);
  } catch {
    return { ids: [] };
  }
}

export function saveWishlist(state) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(state));
}

export function loadAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return { user: null };
    return JSON.parse(raw);
  } catch {
    return { user: null };
  }
}

export function saveAuth(state) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(state));
}

export function upsertCartItem({ product, size, qty }) {
  const cart = loadCart();
  const key = cart.items.find((it) => it.productId === product.id && it.size === size);
  if (key) {
    key.qty += qty;
  } else {
    cart.items.push({ productId: product.id, size, qty });
  }
  saveCart(cart);
  return cart;
}

export function removeCartItem({ productId, size }) {
  const cart = loadCart();
  cart.items = cart.items.filter((it) => !(it.productId === productId && it.size === size));
  saveCart(cart);
  return cart;
}

export function setCartQty({ productId, size, qty }) {
  const cart = loadCart();
  const item = cart.items.find((it) => it.productId === productId && it.size === size);
  if (!item) return cart;
  if (qty <= 0) {
    cart.items = cart.items.filter((it) => !(it.productId === productId && it.size === size));
  } else {
    item.qty = qty;
  }
  saveCart(cart);
  return cart;
}

export function cartCount() {
  const cart = loadCart();
  return (cart.items || []).reduce((sum, it) => sum + it.qty, 0);
}

export function wishlistCount() {
  const w = loadWishlist();
  return (w.ids || []).length;
}

export function toggleWishlist(id) {
  const w = loadWishlist();
  const set = new Set(w.ids || []);
  let added = false;
  if (set.has(id)) {
    set.delete(id);
  } else {
    set.add(id);
    added = true;
  }
  const next = { ids: Array.from(set) };
  saveWishlist(next);
  return { state: next, added };
}

