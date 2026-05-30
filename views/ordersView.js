import { showToast } from './toast.js';

export function renderOrders() {
  const root = document.getElementById('appRoot');
  if (!root) return;
  const orders = [];
  root.innerHTML = `
    <div class="container page">
      <div class="rowHeader"><h2>Orders</h2><p>Demo orders</p></div>
      <div style="background:#fff;border:1px solid var(--border);border-radius:22px;padding:16px">
        <p style="color:var(--muted);font-weight:900">Orders are created when you place an order in the Bag.</p>
        <p style="margin-top:10px;color:var(--muted);font-weight:900">This clone currently shows the success screen after checkout.</p>
      </div>
      <div style="margin-top:14px">
        <a class="btn btnPrimary" href="#/home">Go to Home</a>
      </div>
    </div>
  `;
}

