/* ===== product.js — Fireboy Products Page ===== */
const DATA_URL = './products.json';
let products = [];
let currentFilter = 'all';
let currentSearch = '';

/* ── Helpers ── */
const money = (value) =>
  Number(String(value).replace(/,/g, '') || 0).toLocaleString('en-IN');

const productUrl = (id) =>
  `./product-detail.html?id=${encodeURIComponent(id)}`;

const byId = (id) => products.find((p) => p.id === Number(id));

/* ── Load products from JSON ── */
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
      grid.innerHTML = `
        <div class="empty-state">
          <strong>PRODUCT DATA NOT LOADED</strong>
          <span>Please run this site from a local server so products.json can be loaded.</span>
        </div>`;
    }
  }
}

/* ── Render product cards ── */
function renderProducts(list) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <strong>NO RESULTS</strong>
        <span>Try a different search or filter.</span>
      </div>`;
    return;
  }

  grid.innerHTML = list.map((p) => `
    <div class="product-card" data-cat="${p.category}" data-id="${p.id}">
      <div class="product-img-wrap">
        ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
        ${p.cert  ? `<div class="product-badge cert">ISI</div>` : ''}
        <img class="product-img" src="${p.img}" alt="${p.name}" loading="lazy" />
        <div class="product-overlay">
          <div class="overlay-actions">
            <button class="overlay-btn" type="button" onclick="viewProduct(${p.id})">
              <i class="fa-solid fa-eye" style="margin-right:6px;"></i>View Details
            </button>
          </div>
        </div>
      </div>
      <div class="product-body">
        <div class="product-cat">${p.categoryLabel || p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-specs">
          ${(p.specs || []).slice(0, 2).map((s) => `
            <div class="spec">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.285 6.709l-11.39 11.39-5.18-5.18 1.414-1.414 3.766 3.766 9.976-9.976 1.414 1.414z"/>
              </svg>
              ${s}
            </div>`).join('')}
        </div>
        <div class="product-footer">
          <div class="product-price">
            <span style="font-family:var(--font-body);font-size:0.82rem;font-weight:400;opacity:0.6;margin-right:2px;">Rs.</span>${money(p.price)}
          </div>
          <button class="product-enquire" type="button" onclick="viewProduct(${p.id})" aria-label="View ${p.name}">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l9 4.5V12c0 5.25-3.9 10.15-9 11.35C6.9 22.15 3 17.25 3 12V6.5L12 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>`).join('');

  /* Staggered pop-in animation */
  grid.querySelectorAll('.product-card').forEach((card, index) => {
    card.style.opacity = '0';
    setTimeout(() => {
      card.style.opacity = '';
      card.classList.add('animate-in');
      card.style.animationDelay = `${index * 50}ms`;
    }, 30);
  });
}

/* ── Filter ── */
function filterProducts(cat, btn) {
  if (!document.getElementById('productsGrid')) {
    window.location.href = `products.html?category=${encodeURIComponent(cat)}#products`;
    return;
  }
  currentFilter = cat;
  document.querySelectorAll('.filter-btn').forEach((b) =>
    b.classList.toggle('active', b === btn || b.dataset.filter === cat)
  );
  applyFilters();
  if (cat !== 'all') {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }
}

/* ── Search ── */
function searchProducts() {
  const input = document.getElementById('searchInput');
  currentSearch = input ? input.value.trim().toLowerCase() : '';
  applyFilters();
}

/* ── Apply both filter + search ── */
function applyFilters() {
  let list = products;
  if (currentFilter !== 'all') {
    list = list.filter((p) => p.category === currentFilter);
  }
  if (currentSearch) {
    list = list.filter((p) =>
      [p.name, p.desc, p.categoryLabel, ...(p.specs || [])]
        .join(' ')
        .toLowerCase()
        .includes(currentSearch)
    );
  }
  renderProducts(list);
}

/* ── Navigate to detail page ── */
function viewProduct(id) {
  if (byId(id)) window.location.href = productUrl(id);
}

/* ── Apply URL param category on load ── */
function applyInitialCategory() {
  const cat = new URLSearchParams(window.location.search).get('category');
  if (cat && cat !== 'all') {
    const btn = document.querySelector(`.filter-btn[data-filter="${cat}"]`);
    filterProducts(cat, btn);
  } else {
    renderProducts(products);
  }
}

/* ── Navbar scroll ── */
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 80);

  const scrollTop = document.getElementById('scrollTop');
  if (scrollTop) scrollTop.classList.toggle('visible', window.scrollY > 400);
});

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
}

/* ── Scroll-triggered fade-up ── */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
}

/* ── Keyboard shortcut: / to focus search ── */
document.addEventListener('keydown', (e) => {
  const input = document.getElementById('searchInput');
  if (input && e.key === '/' && document.activeElement !== input) {
    e.preventDefault();
    input.focus();
  }
});

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  initScrollAnimations();
});