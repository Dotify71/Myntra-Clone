import { loadCart, removeCartItem, setCartQty, cartCount, upsertCartItem } from './store.js';
import { PRODUCTS } from './products.js';
import { showToast } from './views/toast.js';

export function addToCart(productId, { size, qty = 1 }) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;
  upsertCartItem({ product, size, qty });
  showToast('Added to bag', 'success');
  window.dispatchEvent(new Event('myntra:cart-changed'));
}

export function initCartViewInteractions() {
  // quantity + remove handlers delegated in render functions
}

export function getCartItemsDetailed() {
  const cart = loadCart();
  return (cart.items || []).map((it) => {
    const product = PRODUCTS.find((p) => p.id === it.productId);
    return product ? { ...it, product } : null;
  }).filter(Boolean);
}

export const DELIVERY_FEE = 49;

export function computeCartTotals(cartItems, { couponCode = null } = {}) {
  const mrp = cartItems.reduce((sum, it) => sum + it.product.mrp * it.qty, 0);
  const subtotal = cartItems.reduce((sum, it) => sum + it.product.price * it.qty, 0);
  const savedFromDiscount = mrp - subtotal;

  let discount = 0;
  let couponApplied = null;

  if (couponCode) {
    const code = couponCode.trim().toUpperCase();
    if (code === 'SAVE10') {
      discount = Math.round(subtotal * 0.1);
      couponApplied = code;
    } else if (code === 'FLAT200') {
      discount = Math.min(200, subtotal);
      couponApplied = code;
    }
  }

  const deliveryFee = subtotal - discount >= 499 ? 0 : DELIVERY_FEE;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  return {
    mrp,
    subtotal,
    savedFromDiscount,
    deliveryFee,
    couponApplied,
    couponDiscount: discount,
    total,
  };
}

