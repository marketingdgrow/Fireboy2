const DATA_URL = './products.json';
let products = [];
let currentFilter = 'all';
let currentSearch = '';

const money = (value) => Number(String(value).replace(/,/g, '') || 0).toLocaleString('en-IN');
const productUrl = (id) => `./product-detail.html?id=${encodeURIComponent(id)}`;
const byId = (id) => products.find((product) => product.id === Number(id));

async function loadProducts() {
  const grid = document.getElementById('productsGrid');
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`Unable to load ${DATA_URL}`);
    products = await response.json();
    applyInitialCategory();
  } catch (error) {
    console.error(error);
    if (grid) {
      grid.innerHTML = `<div class="empty-state"><strong>PRODUCT DATA NOT LOADED</strong><span>Please run this site from a local server so products.json can be loaded.</span></div>`;
    }
  }
}

function renderProducts(list) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = `<div class="empty-state"><strong>NO RESULTS</strong><span>Try a different search or category.</span></div>`;
    return;
  }

  grid.innerHTML = list.map((p) => `
    <div class="product-card" data-cat="${p.category}" data-id="${p.id}">
      <div class="product-img-wrap" style="background: linear-gradient(135deg, ${p.color || '#f5f5f3'}, #f5f5f3);">
        ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
        ${p.cert ? `<div class="product-badge cert">ISI</div>` : ''}
        <img class="product-img" src="${p.img}" alt="${p.name}" loading="lazy" />
        <div class="product-overlay">
          <div class="overlay-actions">
            <button class="overlay-btn" type="button" onclick="viewProduct(${p.id})">View Details</button>
          </div>
        </div>
      </div>
      <div class="product-body">
        <div class="product-cat">${p.categoryLabel || p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-specs">
          ${(p.specs || []).slice(0, 4).map((s) => `
            <div class="spec">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.285 6.709l-11.39 11.39-5.18-5.18 1.414-1.414 3.766 3.766 9.976-9.976 1.414 1.414z"/></svg>
              ${s}
            </div>`).join('')}
        </div>
        <div class="product-footer">
          <div class="product-price">Rs.${money(p.price)}</div>
          <button class="product-enquire" type="button" onclick="viewProduct(${p.id})" aria-label="View ${p.name}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
          </button>
        </div>
      </div>
    </div>`).join('');

  grid.querySelectorAll('.product-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'all 0.4s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 45);
  });
}

function filterProducts(cat, btn) {
  if (!document.getElementById('productsGrid')) {
    window.location.href = `products.html?category=${encodeURIComponent(cat)}#products`;
    return;
  }

  currentFilter = cat;
  document.querySelectorAll('.filter-btn').forEach((button) => button.classList.toggle('active', button === btn || button.dataset.filter === cat));
  applyFilters();

  if (cat !== 'all') document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
}

function searchProducts() {
  const searchInput = document.getElementById('searchInput');
  currentSearch = searchInput ? searchInput.value.trim().toLowerCase() : '';
  applyFilters();
}

function applyFilters() {
  let list = products;
  if (currentFilter !== 'all') list = list.filter((p) => p.category === currentFilter);
  if (currentSearch) {
    list = list.filter((p) => [p.name, p.desc, p.categoryLabel, ...(p.specs || [])].join(' ').toLowerCase().includes(currentSearch));
  }
  renderProducts(list);
}

function viewProduct(id) {
  if (byId(id)) window.location.href = productUrl(id);
}

function applyInitialCategory() {
  const initialCategory = new URLSearchParams(window.location.search).get('category');
  if (initialCategory && initialCategory !== 'all') {
    const activeButton = document.querySelector(`.filter-btn[data-filter="${initialCategory}"]`);
    filterProducts(initialCategory, activeButton);
  } else {
    renderProducts(products);
  }
}

window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 80);
});

const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let tx = 0, ty = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', (event) => {
  tx = event.clientX;
  ty = event.clientY;
  if (cursor) {
    cursor.style.left = tx - 6 + 'px';
    cursor.style.top = ty - 6 + 'px';
  }
});

setInterval(() => {
  cx += (tx - cx) * 0.15;
  cy += (ty - cy) * 0.15;
  if (trail) {
    trail.style.left = cx - 18 + 'px';
    trail.style.top = cy - 18 + 'px';
  }
}, 16);

document.addEventListener('mousedown', () => { if (cursor) cursor.style.transform = 'scale(2)'; });
document.addEventListener('mouseup', () => { if (cursor) cursor.style.transform = 'scale(1)'; });

function openMobileMenu() {
  document.getElementById('mobileMenu')?.classList.add('open');
}

function closeMobileMenu() {
  document.getElementById('mobileMenu')?.classList.remove('open');
}

document.addEventListener('keydown', (event) => {
  const searchInput = document.getElementById('searchInput');
  if (searchInput && event.key === '/' && document.activeElement !== searchInput) {
    event.preventDefault();
    searchInput.focus();
  }
});

document.addEventListener('DOMContentLoaded', loadProducts);
