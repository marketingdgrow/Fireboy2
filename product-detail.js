const DATA_URL = './products.json';
let products = [];

const getParam = (key) => new URLSearchParams(window.location.search).get(key);
const money = (value) => Number(String(value).replace(/,/g, '') || 0).toLocaleString('en-IN');
const productUrl = (id) => `./product-detail.html?id=${encodeURIComponent(id)}`;
const findProduct = (id) => products.find((product) => product.id === Number(id));

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value || '';
}

function renderProduct(product) {
  document.title = `${product.name} - Fire Boy`;
  setText('page-title', `${product.name} - Fire Boy`);
  setText('bc-cat', product.categoryLabel || product.category);
  setText('bc-name', product.name);
  document.getElementById('bc-cat').href = `./products.html?category=${encodeURIComponent(product.category)}`;

  const imageWrap = document.getElementById('img-main');
  imageWrap.style.background = product.bg || `linear-gradient(135deg, ${product.color || '#f5f5f3'}, #f5f5f3)`;
  const image = document.getElementById('prod-img');
  image.src = product.img;
  image.alt = product.name;

  document.getElementById('badge-strip').innerHTML = `
    ${product.badge ? `<div class="badge badge-fire">${product.badge}</div>` : ''}
    ${product.cert ? '<div class="badge badge-gold">ISI Marked</div><div class="badge badge-dark">BIS Certified</div>' : '<div class="badge badge-dark">Quality Checked</div>'}`;

  setText('prod-cat', product.categoryLabel || product.category);
  const title = product.title && product.title.length ? product.title : [product.name.toUpperCase()];
  document.getElementById('prod-name').innerHTML = title.map((line, index) => index === 1 ? `<span>${line}</span>` : line).join('<br />');
  setText('prod-desc', product.desc);
  document.getElementById('prod-price').innerHTML = `Rs.${money(product.price)} <span></span>`;

  document.getElementById('spec-grid').innerHTML = (product.specGrid || []).map((spec) => `
    <div class="spec-item"><div class="spec-key">${spec.key}</div><div class="spec-val">${spec.val}</div></div>`).join('');

  document.getElementById('feature-list').innerHTML = (product.features || []).map((feature) => `<li>${feature}</li>`).join('');
  document.getElementById('spec-table').innerHTML = (product.specTable || []).map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`).join('');
  document.getElementById('cert-row').innerHTML = (product.certs || []).map((cert) => {
    const parts = String(cert).split(' - ');
    return `<div class="cert-tag"><strong>${parts[0]}</strong>${parts[1] ? ' - ' + parts.slice(1).join(' - ') : ''}</div>`;
  }).join('');
  setText('cert-note', product.certNote);

  const relatedIds = product.related && product.related.length
    ? product.related
    : products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3).map((item) => item.id);

  document.getElementById('related-grid').innerHTML = relatedIds.slice(0, 3).map((id) => findProduct(id)).filter(Boolean).map((item) => `
    <a href="${productUrl(item.id)}" class="related-card">
      <div class="related-img"><img src="${item.img}" alt="${item.name}" loading="lazy" /></div>
      <div class="related-info">
        <div class="related-cat">${item.categoryLabel || item.category}</div>
        <div class="related-name">${item.name}</div>
        <div class="related-price">Rs.${money(item.price)} <span style="font-size:13px;color:#999;font-family:var(--font-body);">/ unit</span></div>
      </div>
    </a>`).join('');

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
  if (!id) {
    window.location.href = './products.html';
    return;
  }

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`Unable to load ${DATA_URL}`);
    products = await response.json();
    const product = findProduct(id);
    product ? renderProduct(product) : showNotFound();
  } catch (error) {
    console.error(error);
    showNotFound();
  }
}

function switchTab(id, button) {
  document.querySelectorAll('.tab-content').forEach((content) => content.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach((tab) => tab.classList.remove('active'));
  document.getElementById(`tab-${id}`)?.classList.add('active');
  button.classList.add('active');
}

function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let tx = 0, ty = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', (event) => {
  tx = event.clientX;
  ty = event.clientY;
  cursor.style.left = tx - 6 + 'px';
  cursor.style.top = ty - 6 + 'px';
});

setInterval(() => {
  cx += (tx - cx) * 0.15;
  cy += (ty - cy) * 0.15;
  trail.style.left = cx - 18 + 'px';
  trail.style.top = cy - 18 + 'px';
}, 16);

document.addEventListener('mousedown', () => { cursor.style.transform = 'scale(2)'; });
document.addEventListener('mouseup', () => { cursor.style.transform = 'scale(1)'; });

window.addEventListener('scroll', () => {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  document.getElementById('scrollBar').style.width = `${progress}%`;
});

document.addEventListener('DOMContentLoaded', initProductDetail);
