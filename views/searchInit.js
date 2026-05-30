import { PRODUCTS } from '../products.js';



function escapeHtml(s) {
  return String(s)

    .replaceAll('&', '&amp;')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"')
    .replaceAll("'", '&#039;');
}

function highlight(text, query) {
  const q = String(query || '').trim();
  if (!q) return escapeHtml(text);
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')})`, 'ig');
  const safe = escapeHtml(text);
  // simple: do case-insensitive by slicing original is hard; use replace on original with HTML after escaping for best-effort
  return escapeHtml(text).replace(re, '<mark class="hl">$1</mark>');
}

export function initSearch() {
  const input = document.getElementById('searchInput');
  const dropdown = document.getElementById('searchDropdown');
  const clearBtn = document.getElementById('searchClear');
  if (!input || !dropdown) return;

  const render = (q) => {
    const query = q.trim();
    if (!query) {
      dropdown.classList.remove('open');
      dropdown.innerHTML = '';
      return;
    }

    const list = PRODUCTS.filter((p) =>
      [p.name, p.brand, p.category].some((x) => String(x).toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 8);

    dropdown.innerHTML = '';

    if (!list.length) {
      const empty = document.createElement('div');
      empty.className = 'searchItem';
      empty.style.cursor = 'default';
      empty.innerHTML = `
        <div class="searchMeta">
          <div class="title">No results</div>
          <div class="sub">No results found for '${escapeHtml(query)}'</div>
        </div>
      `;
      dropdown.appendChild(empty);
      dropdown.classList.add('open');
      return;
    }

    list.forEach((p) => {
      const el = document.createElement('div');
      el.className = 'searchItem';
      el.setAttribute('role', 'option');
      el.tabIndex = 0;
      el.innerHTML = `
        <img src="${p.images[0]}" alt="${p.name}" />
        <div class="searchMeta">
          <div class="title">${highlight(p.name, query)}</div>
          <div class="sub">${highlight(p.brand, query)} • ${highlight(p.category, query)}</div>
        </div>
      `;
      el.addEventListener('click', () => {
        window.location.hash = `#/product/${p.id}`;
      });
      dropdown.appendChild(el);
    });

    dropdown.classList.add('open');
  };

  let debounce = null;

  input.addEventListener('input', () => {
    const q = input.value;
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(() => render(q), 120);
  });

  input.addEventListener('focus', () => {
    const q = input.value;
    if (q.trim()) render(q);
  });

  clearBtn?.addEventListener('click', () => {
    input.value = '';
    dropdown.classList.remove('open');
    dropdown.innerHTML = '';
    input.focus();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) window.location.hash = `#/products?q=${encodeURIComponent(q)}&sort=popularity`;
    }
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
      dropdown.innerHTML = '';
    }
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== input && !dropdown.classList.contains('open')) return;
    if (!dropdown.contains(e.target) && e.target !== input) {
      dropdown.classList.remove('open');
    }
  });
}

