export function showLoadingSkeleton() {
  const wrap = document.createElement('div');
  wrap.className = 'productsGrid';
  wrap.style.gridTemplateColumns = 'repeat(4,1fr)';
  wrap.innerHTML = Array.from({ length: 8 }).map(() => `
    <div class="productCard" style="overflow:hidden">
      <div class="skeleton" style="height:250px;border-radius:0"></div>
      <div style="padding:14px">
        <div class="skeleton" style="height:14px;width:70%;margin-bottom:10px"></div>
        <div class="skeleton" style="height:14px;width:90%;margin-bottom:10px"></div>
        <div class="skeleton" style="height:14px;width:55%"></div>
      </div>
    </div>
  `).join('');
  return wrap;
}

