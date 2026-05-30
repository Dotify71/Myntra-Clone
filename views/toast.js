export function showToast(message, variant = 'success') {
  const wrap = document.getElementById('toastWrap');
  if (!wrap) return;

  const el = document.createElement('div');
  el.className = 'toast';

  const color = variant === 'error' ? '#ef4444' : variant === 'warn' ? '#f59e0b' : 'var(--pink)';

  el.innerHTML = `
    <span class="dot" style="background:${color}"></span>
    <div>
      <div class="msg">${escapeHtml(message)}</div>
      ${variant !== 'success' ? `<div class="sub">${escapeHtml(variant.toUpperCase())}</div>` : ''}
    </div>
  `;

  // slide in from top-right
  el.style.opacity = '0';
  el.style.transform = 'translate(12px,-14px)';
  el.style.transition = 'opacity .25s ease, transform .25s ease';
  wrap.appendChild(el);

  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translate(0,0)';
  });

  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translate(12px,-14px)';
    setTimeout(() => el.remove(), 260);
  }, 3000);
}


function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"')
    .replaceAll("'", '&#039;');
}

