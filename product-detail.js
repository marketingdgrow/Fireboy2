/* ===== product-detail.js — Fireboy Product Detail Page ===== */
const DATA_URL = './products.json';
let products = [];

const getParam = (key) => new URLSearchParams(window.location.search).get(key);
const money = (value) => Number(String(value).replace(/,/g, '') || 0).toLocaleString('en-IN');
const productUrl = (id) => `./product-detail.html?id=${encodeURIComponent(id)}`;
const findProduct = (id) => products.find((p) => p.id === Number(id));

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || '';
}

function renderProduct(product) {
  document.title = `${product.name} — FIREBOY Fire Protection`;
  setText('page-title', `${product.name} — FIREBOY Fire Protection`);
  setText('bc-cat', product.categoryLabel || product.category);
  setText('bc-name', product.name);
  document.getElementById('bc-cat').href =
    `./products.html?category=${encodeURIComponent(product.category)}`;

  /* Image — always white background */
  const imgMain = document.getElementById('img-main');
  imgMain.style.background = '#ffffff';
  const img = document.getElementById('prod-img');
  img.src = product.img;
  img.alt = product.name;

  /* Badges */
  document.getElementById('badge-strip').innerHTML = `
    ${product.badge ? `<div class="badge badge-fire">${product.badge}</div>` : ''}
    ${product.cert
      ? '<div class="badge badge-gold">ISI Marked</div><div class="badge badge-dark">BIS Certified</div>'
      : '<div class="badge badge-dark">Quality Checked</div>'}`;

  /* Category & name */
  setText('prod-cat', product.categoryLabel || product.category);
  const lines = product.title && product.title.length ? product.title : [product.name.toUpperCase()];
  document.getElementById('prod-name').innerHTML = lines
    .map((line, i) => i === 1 ? `<span>${line}</span>` : line)
    .join('<br />');

  /* Desc & price */
  setText('prod-desc', product.desc);
  document.getElementById('prod-price').innerHTML =
    `<span style="font-family:var(--font-body);font-size:1rem;font-weight:400;opacity:0.55;margin-right:3px;">Rs.</span>${money(product.price)}`;

  /* Spec grid */
  document.getElementById('spec-grid').innerHTML = (product.specGrid || []).map((s) => `
    <div class="spec-item">
      <div class="spec-key">${s.key}</div>
      <div class="spec-val">${s.val}</div>
    </div>`).join('');

  /* Tab: Features */
  document.getElementById('feature-list').innerHTML = (product.features || [])
    .map((f) => `<li>${f}</li>`).join('');

  /* Tab: Spec table */
  document.getElementById('spec-table').innerHTML = (product.specTable || [])
    .map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`).join('');

  /* Tab: Certs */
  document.getElementById('cert-row').innerHTML = (product.certs || []).map((cert) => {
    const parts = String(cert).split(' - ');
    return `<div class="cert-tag"><strong>${parts[0]}</strong>${parts[1] ? ' — ' + parts.slice(1).join(' - ') : ''}</div>`;
  }).join('');
  setText('cert-note', product.certNote);

  /* Related products */
  const relatedIds = product.related && product.related.length
    ? product.related
    : products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 3)
        .map((p) => p.id);

  document.getElementById('related-grid').innerHTML = relatedIds
    .slice(0, 3)
    .map(findProduct)
    .filter(Boolean)
    .map((item) => `
      <a href="${productUrl(item.id)}" class="related-card">
        <div class="related-img">
          <img src="${item.img}" alt="${item.name}" loading="lazy" />
        </div>
        <div class="related-info">
          <div class="related-cat">${item.categoryLabel || item.category}</div>
          <div class="related-name">${item.name}</div>
          <div class="related-price">
            <span style="font-family:var(--font-body);font-size:0.8rem;font-weight:400;opacity:0.55;margin-right:2px;">Rs.</span>${money(item.price)}
            <span style="font-size:0.75rem;color:#999;font-family:var(--font-body);"> / unit</span>
          </div>
        </div>
      </a>`).join('');

  /* Show content */
  document.getElementById('loader').style.display = 'none';
  document.getElementById('main-content').hidden = false;
  revealOnScroll();
}

function showNotFound() {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('notFound').style.display = 'block';
}

async function initProductDetail() {
  const id = getParam('id');
  if (!id) { window.location.href = './products.html'; return; }

  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`Unable to load ${DATA_URL}`);
    products = await res.json();
    const product = findProduct(id);
    product ? renderProduct(product) : showNotFound();
  } catch (err) {
    console.error(err);
    showNotFound();
  }
}

/* ── Tabs ── */
function switchTab(id, btn) {
  document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
  document.getElementById(`tab-${id}`)?.classList.add('active');
  btn.classList.add('active');
}

/* ── Scroll reveal ── */
function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

/* ── Scroll progress + navbar ── */
window.addEventListener('scroll', () => {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  document.getElementById('scrollBar').style.width = `${progress}%`;

  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 80);
});

/* ── Custom cursor ── */
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursorTrail');
let tx = 0, ty = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', (e) => {
  tx = e.clientX; ty = e.clientY;
  cursor.style.left = tx - 5 + 'px';
  cursor.style.top  = ty - 5 + 'px';
});

setInterval(() => {
  cx += (tx - cx) * 0.15;
  cy += (ty - cy) * 0.15;
  trail.style.left = cx - 16 + 'px';
  trail.style.top  = cy - 16 + 'px';
}, 16);

document.addEventListener('mousedown', () => { cursor.style.transform = 'scale(2)'; });
document.addEventListener('mouseup',   () => { cursor.style.transform = 'scale(1)'; });

/* ── Init ── */
document.addEventListener('DOMContentLoaded', initProductDetail);