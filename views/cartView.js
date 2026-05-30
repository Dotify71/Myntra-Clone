import { getProductById } from '../products.js';
import { loadCart, saveCart, removeCartItem, setCartQty } from '../store.js';
import { showToast } from './toast.js';
import { addToCart, computeCartTotals, DELIVERY_FEE } from '../cart.js';
import { getCartItemsDetailed } from '../cart.js';

function renderOrderSuccess({ orderId, itemsCount, total }) {
  const root = document.getElementById('appRoot');
  root.innerHTML = `
    <div class="container" style="padding:26px 16px">
      <div style="background:#fff;border:1px solid var(--border);border-radius:22px;padding:22px;">
        <div style="display:flex;flex-direction:column;align-items:center;text-align:center">
          <div style="width:60px;height:60px;border-radius:999px;background:#e8f5e9;display:grid;place-items:center">
            <div style="font-size:32px;line-height:1;color:#1b5e20;font-weight:1100">✓</div>
          </div>
          <h2 style="margin-top:14px;font-size:24px;font-weight:1100">Order Placed Successfully!</h2>
          <div style="margin-top:6px;color:var(--muted);font-weight:900">Yay! Your order is confirmed.</div>

          <div style="margin-top:12px;color:var(--pink);font-weight:1000">Expected delivery: 5-7 business days</div>
        </div>

        <div style="margin:18px 0;border-top:1px solid rgba(229,231,235,.9)"></div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div style="background:#fff;border:1px solid var(--border);border-radius:18px;padding:14px">
            <div style="color:var(--muted);font-weight:900;font-size:12px;">Order ID</div>
            <div style="margin-top:6px;font-weight:1100">${orderId}</div>
          </div>
          <div style="background:#fff;border:1px solid var(--border);border-radius:18px;padding:14px">
            <div style="color:var(--muted);font-weight:900;font-size:12px;">Items</div>
            <div style="margin-top:6px;font-weight:1100">${itemsCount}</div>
          </div>
          <div style="background:#fff;border:1px solid var(--border);border-radius:18px;padding:14px;grid-column:1/-1">
            <div style="color:var(--muted);font-weight:900;font-size:12px;">Total</div>
            <div style="margin-top:6px;font-weight:1100;font-size:18px">₹${total.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <a href="#/home" class="btn" style="display:block;margin-top:18px;background:#FF3F6C;color:#fff;border:none;border-radius:999px;height:48px;line-height:48px;text-align:center;font-weight:1100;width:100%;">
          Continue Shopping
        </a>
      </div>
    </div>
  `;
}

export function renderCart() {
  const root = document.getElementById('appRoot');
  if (!root) return;

  const cartItems = getCartItemsDetailed();

  if (!cartItems.length) {
    root.innerHTML = `
      <div class="container" style="padding:26px 16px">
        <h2 style="font-size:20px">Your bag is empty</h2>
        <p style="color:var(--muted);font-weight:900;margin-top:8px">Add items to checkout.</p>
        <a class="btn btnPrimary" href="#/products" style="display:inline-block;margin-top:14px">Shop products</a>
      </div>
    `;
    return;
  }

  root.innerHTML = `
    <div class="page container" style="padding:18px 0 50px">
      <div class="rowHeader">
        <h2>Bag</h2>
        <p>${cartItems.reduce((s,x)=>s+x.qty,0)} items</p>
      </div>

      <div class="pageGrid" style="grid-template-columns:1fr 360px">
        <div class="cardsList" id="cartItemsList"></div>
        <aside class="summaryCard" id="summary">
          <h3>Price Breakdown</h3>
          <div class="breakRow"><small>MRP</small><span id="mrpVal">0</span></div>
    <div class="breakRow"><small>You save</small><span id="saveVal">0</span></div>

          <div class="breakRow"><small>Delivery</small><span id="delVal">0</span></div>
          <div class="total"><span style="font-weight:1000">Total</span><span class="amt" id="totalVal">0</span></div>

          <div class="couponRow">
            <input id="couponInput" type="text" placeholder="Coupon code (SAVE10 / FLAT200)" />
            <button class="clearBtn" id="applyCouponBtn" type="button">Apply</button>
          </div>
          <div style="margin-top:10px;color:var(--muted);font-size:12px;font-weight:900" id="couponHint">Tip: Delivery is free on ₹499+</div>

          <button class="placeBtn" id="placeOrderBtn" type="button">Place Order</button>
        </aside>
      </div>
    </div>
  `;

  const listEl = document.getElementById('cartItemsList');
  const mrpVal = document.getElementById('mrpVal');
  const saveVal = document.getElementById('saveVal');
  const delVal = document.getElementById('delVal');
  const totalVal = document.getElementById('totalVal');
  const couponInput = document.getElementById('couponInput');
  const applyBtn = document.getElementById('applyCouponBtn');
  const placeBtn = document.getElementById('placeOrderBtn');

  let couponCode = null;

  function renderItems() {
    listEl.innerHTML = '';
    cartItems.forEach((it) => {
      const p = it.product;
      const card = document.createElement('div');
      card.className = 'itemCard';
      card.innerHTML = `
        <img src="${it.images?.[0] || 'https://picsum.photos/seed/'+p.id+'/80/100'}" alt="${p.name}" style="width:80px; height:100px; object-fit:cover; border-radius:8px" />
        <div class="itemInfo">
          <div class="title">${p.name}</div>
          <div class="meta">Brand: ${p.brand} • Size: <b>${it.size}</b></div>
          <div class="meta">Price: ₹${p.price.toLocaleString('en-IN')}</div>
        </div>
        <div class="itemActions">
          <div class="qtyControls" aria-label="Quantity controls">
            <button class="qtyBtn" type="button" data-dec="${p.id}" aria-label="Decrease quantity">−</button>
            <div class="qtyVal">${it.qty}</div>
            <button class="qtyBtn" type="button" data-inc="${p.id}" aria-label="Increase quantity">+</button>
          </div>
          <button class="removeBtn" type="button" data-remove="${p.id}">Remove</button>
        </div>
      `;

      card.querySelector('[data-dec]').addEventListener('click', () => {
        const nextQty = it.qty - 1;
        setCartQty({ productId: p.id, size: it.size, qty: nextQty });
        showToast('Updated bag', 'success');
        window.dispatchEvent(new Event('myntra:cart-changed'));
        renderCartAfterChange();
      });
      card.querySelector('[data-inc]').addEventListener('click', () => {
        const nextQty = it.qty + 1;
        setCartQty({ productId: p.id, size: it.size, qty: nextQty });
        showToast('Updated bag', 'success');
        window.dispatchEvent(new Event('myntra:cart-changed'));
        renderCartAfterChange();
      });
      card.querySelector('[data-remove]').addEventListener('click', () => {
        removeCartItem({ productId: p.id, size: it.size });
        showToast('Removed from bag', 'success');
        window.dispatchEvent(new Event('myntra:cart-changed'));
        renderCartAfterChange();
      });

      listEl.appendChild(card);
    });
  }

  function renderCartAfterChange() {
    const detailed = getCartItemsDetailed();
    cartItems.splice(0, cartItems.length, ...detailed);
    renderItems();
    recalcTotals();
    if (!cartItems.length) window.location.hash = '#/cart';
  }

  function recalcTotals() {
    const totals = computeCartTotals(cartItems, { couponCode });
    mrpVal.textContent = `₹${totals.mrp.toLocaleString('en-IN')}`;
    saveVal.textContent = `₹${totals.couponDiscount ? totals.savedFromDiscount + totals.couponDiscount - totals.couponDiscount : totals.savedFromDiscount}`;
    delVal.textContent = totals.deliveryFee === 0 ? 'FREE' : `₹${totals.deliveryFee.toLocaleString('en-IN')}`;
    totalVal.textContent = `₹${totals.total.toLocaleString('en-IN')}`;

    // disable place order if empty
    placeBtn.disabled = cartItems.length === 0;
  }

  applyBtn?.addEventListener('click', () => {
    const code = (couponInput.value || '').trim();
    couponCode = code ? code.toUpperCase() : null;
    if (!couponCode) {
      showToast('No coupon entered', 'warn');
      recalcTotals();
      return;
    }

    const valid = ['SAVE10', 'FLAT200'];
    if (!valid.includes(couponCode)) {
      showToast('Invalid coupon code', 'error');
      couponCode = null;
      couponInput.value = '';
      recalcTotals();
      return;
    }

    showToast(`Coupon ${couponCode} applied`, 'success');
    recalcTotals();
  });

  placeBtn?.addEventListener('click', () => {
    const totals = computeCartTotals(cartItems, { couponCode });
    if (!cartItems.length) return;

    const orderId = 'MN' + Math.floor(100000 + Math.random() * 900000);
    const itemsCount = cartItems.reduce((s,x)=>s+x.qty,0);

    // Clear cart
    localStorage.removeItem('myntra_cart_v1');
    window.dispatchEvent(new Event('myntra:cart-changed'));

    showToast('Order placed successfully', 'success');
    renderOrderSuccess({ orderId, itemsCount, total: totals.total });
  });

  // Initial render
  renderItems();
  recalcTotals();
}

