// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navLinks.classList.remove('open');
}));

// ===== SCROLL REVEAL with stagger =====
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.style.getPropertyValue('--d') || '0');
      setTimeout(() => el.classList.add('in'), delay);
      revealObs.unobserve(el);
    }
  });
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => revealObs.observe(el));

// ===== COUNTER ANIMATION =====
function animateCount(el, target) {
  const duration = 2200;
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.round(easeOut(progress) * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target, parseInt(e.target.dataset.target));
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const offset = document.getElementById('navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

// ===== PARALLAX HERO =====
const heroBgImg = document.querySelector('.hero-bg img');
window.addEventListener('scroll', () => {
  if (heroBgImg && window.scrollY < window.innerHeight) {
    heroBgImg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
  }
}, { passive: true });

// ===== WHY US CARDS — Magnetic hover effect =====
document.querySelectorAll('.why-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    card.style.transform = `translateY(-10px) rotateX(${-y * 0.4}deg) rotateY(${x * 0.4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s linear, box-shadow 0.4s, border-color 0.3s';
  });
});

// ===== PROCESS STEPS — Sequential reveal with line drawing =====
const processSteps = document.querySelectorAll('.process-step');
const processObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const steps = entry.target.closest('.process-track')?.querySelectorAll('.process-step');
      if (steps) {
        steps.forEach((step, i) => {
          setTimeout(() => {
            step.style.opacity = '1';
            step.style.transform = 'translateY(0)';
          }, i * 150);
        });
      }
      processObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

if (processSteps.length) {
  processObs.observe(processSteps[0]);
}

// ===== CAT CARDS — Ripple on click =====
document.querySelectorAll('.cat-card').forEach(card => {
  card.addEventListener('click', e => {
    const ripple = document.createElement('span');
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `
      position:absolute;
      width:${size}px;
      height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      background:rgba(212,82,26,0.08);
      border-radius:50%;
      transform:scale(0);
      animation:rippleAnim 0.6s ease-out forwards;
      pointer-events:none;
      z-index:0;
    `;
    card.querySelector('.cat-card-inner').appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// Inject ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(1); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

// ===== STAT ITEMS — Pulse animation on hover =====
document.querySelectorAll('.stat-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    const icon = item.querySelector('.stat-icon');
    icon.style.animation = 'none';
    setTimeout(() => {
      icon.style.animation = '';
    }, 10);
  });
});

document.querySelectorAll('.tcard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    card.style.transform = `translateY(-8px) rotateX(${-y * 0.35}deg) rotateY(${x * 0.35}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s linear, box-shadow 0.4s';
  });
});

document.querySelectorAll('.hstat-n').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.transform = 'scale(1.1)';
    el.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

document.querySelectorAll('.step-card').forEach(card => {
  card.style.position = 'relative';
  card.style.overflow = 'hidden';

  const shimmer = document.createElement('div');
  shimmer.style.cssText = `
    position:absolute;
    top:0; bottom:0;
    width:60px;
    background:linear-gradient(105deg,transparent 20%,rgba(212,82,26,0.07) 50%,transparent 80%);
    left:-80%;
    pointer-events:none;
    transition:none;
  `;
  card.appendChild(shimmer);

  card.addEventListener('mouseenter', () => {
    shimmer.style.transition = 'left 0.5s ease';
    shimmer.style.left = '140%';
  });
  card.addEventListener('mouseleave', () => {
    shimmer.style.transition = 'none';
    shimmer.style.left = '-80%';
  });
});

document.querySelectorAll('.icard').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'border-color 0.3s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s';
  });
});

document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  const origHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message Sent!';
  btn.style.background = '#22c55e';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = origHTML;
    btn.style.background = '';
    btn.disabled = false;
    this.reset();
  }, 3000);
});

function adjustBodyPad() {
  document.body.style.paddingTop = navbar.offsetHeight + 'px';
}
adjustBodyPad();
window.addEventListener('scroll', adjustBodyPad, { passive: true });
window.addEventListener('resize', adjustBodyPad);

document.querySelectorAll('.nav-links a').forEach((a, i) => {
  a.style.animation = `fadeSlideDown 0.5s ${0.1 + i * 0.07}s var(--ease-out) both`;
});

const fireSection = document.querySelector('.stats');
if (fireSection) {
  let glow = null;
  fireSection.addEventListener('mouseenter', () => {
    glow = document.createElement('div');
    glow.style.cssText = `
      position:fixed; width:300px; height:300px;
      border-radius:50%;
      background:radial-gradient(circle, rgba(212,82,26,0.12) 0%, transparent 70%);
      pointer-events:none; z-index:1; transform:translate(-50%,-50%);
      transition: opacity 0.3s;
    `;
    document.body.appendChild(glow);
  });
  fireSection.addEventListener('mousemove', e => {
    if (glow) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }
  });
  fireSection.addEventListener('mouseleave', () => {
    if (glow) {
      glow.style.opacity = '0';
      setTimeout(() => { glow && glow.remove(); glow = null; }, 300);
    }
  });
}

const brandsTrack = document.querySelector('.brands-track');
if (brandsTrack) {
  brandsTrack.addEventListener('mouseenter', () => {
    brandsTrack.style.animationPlayState = 'paused';
  });
  brandsTrack.addEventListener('mouseleave', () => {
    brandsTrack.style.animationPlayState = 'running';
  });
}

const processCTA = document.querySelector('.process-cta .btn-fire');
if (processCTA) {
  const ctatObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        processCTA.style.animation = 'none';
        setTimeout(() => {
          processCTA.style.animation = 'pulseBtn 0.6s ease forwards';
        }, 300);
        ctatObs.unobserve(processCTA);
      }
    });
  }, { threshold: 0.8 });
  ctatObs.observe(processCTA);
}

// Inject pulse btn keyframe
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
  @keyframes pulseBtn {
    0%   { box-shadow: 0 0 0 0 rgba(212,82,26,0.5); }
    70%  { box-shadow: 0 0 0 14px rgba(212,82,26,0); }
    100% { box-shadow: 0 0 0 0 rgba(212,82,26,0); }
  }
`;
document.head.appendChild(pulseStyle);