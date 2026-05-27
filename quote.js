(function () {
  /* ══════════════════════════════════════════════
     QUOTE MODAL
  ══════════════════════════════════════════════ */
  function createQuoteModal() {
    if (document.getElementById("quoteModal")) return;

    const modal = document.createElement("div");
    modal.className = "quote-modal";
    modal.id = "quoteModal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="quote-backdrop" data-quote-close></div>
      <div class="quote-dialog" role="dialog" aria-modal="true" aria-labelledby="quoteTitle">
        <button class="quote-close" type="button" aria-label="Close quote form" data-quote-close>x</button>
        <div class="quote-form-wrap">
          <div class="quote-kicker">Get Quote</div>
          <h2 id="quoteTitle">Request Fire Safety Quote</h2>
          <p>Share your requirement and our team will help with the right product, installation, or maintenance plan.</p>
          <form class="quote-form" id="quoteForm">
            <div class="quote-row">
              <div class="quote-field">
                <label for="quoteName">Name</label>
                <input id="quoteName" name="name" type="text" placeholder="Your name" required />
              </div>
              <div class="quote-field">
                <label for="quotePhone">Phone</label>
                <input id="quotePhone" name="phone" type="tel" placeholder="+91 98765 43210" required />
              </div>
            </div>
            <div class="quote-row">
              <div class="quote-field">
                <label for="quoteEmail">Email</label>
                <input id="quoteEmail" name="email" type="email" placeholder="you@company.com" />
              </div>
              <div class="quote-field">
                <label for="quoteService">Requirement</label>
                <select id="quoteService" name="service" required>
                  <option value="">Select one</option>
                  <option>Fire Extinguishers</option>
                  <option>Fire Alarm System</option>
                  <option>Hydrant / Sprinkler System</option>
                  <option>Refilling / AMC</option>
                  <option>Site Assessment</option>
                  <option>Bulk Order</option>
                </select>
              </div>
            </div>
            <div class="quote-field">
              <label for="quoteMessage">Message</label>
              <textarea id="quoteMessage" name="message" placeholder="Tell us your location, building type, and quantity if known"></textarea>
            </div>
            <button class="quote-submit" type="submit">Submit Request</button>
            <div class="quote-success" id="quoteSuccess">Request received. Our team will contact you shortly.</div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function openQuoteModal() {
    createQuoteModal();
    const modal = document.getElementById("quoteModal");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("quote-lock");
    setTimeout(() => {
      const firstField = document.getElementById("quoteName");
      if (firstField) firstField.focus();
    }, 80);
  }

  function closeQuoteModal() {
    const modal = document.getElementById("quoteModal");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("quote-lock");
  }

  window.openQuoteModal = openQuoteModal;
  window.closeQuoteModal = closeQuoteModal;

  /* ══════════════════════════════════════════════
     SOCIAL ICONS (footer)
  ══════════════════════════════════════════════ */
  const socialIcons = {
    f: {
      label: "Facebook",
      svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v2H6v4h3v7h4v-7h3.4l.6-4h-4V9c0-.7.3-1 1-1z"/></svg>',
    },
    in: {
      label: "LinkedIn",
      svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.9 8.8H3.1V21h3.8V8.8zM5 3C3.8 3 3 3.8 3 4.9s.8 1.9 2 1.9 2-.8 2-1.9S6.2 3 5 3zm16 11.1c0-3.3-1.8-5.4-4.7-5.4-1.8 0-2.9 1-3.4 1.8V8.8H9.2V21H13v-6.6c0-1.6.8-2.5 2-2.5s2 .9 2 2.6V21h4v-6.9z"/></svg>',
    },
    tw: {
      label: "X",
      svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.4 10.6 21.3 3h-2.8l-5.4 6-4.3-6H3l7.2 10.1L2.9 21h2.8l5.8-6.4 4.6 6.4H22l-7.6-10.4zm-2 2.2-1.2-1.7L6.4 5h1.3l10.1 14h-1.3l-4.1-6.2z"/></svg>',
    },
    yt: {
      label: "YouTube",
      svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.8 4 12 4 12 4s-3.8 0-6.7.2c-.4 0-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2 9 2 10.9v1.8c0 1.9.4 3.7.4 3.7s.2 1.5.8 2.1c.8.8 1.9.8 2.4.9 1.7.2 6.4.2 6.4.2s3.8 0 6.7-.2c.4 0 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.4-1.8.4-3.7v-1.8c0-1.9-.4-3.7-.4-3.7zM10 15.1V8.9l5.8 3.1-5.8 3.1z"/></svg>',
    },
  };

  function enhanceSocialIcons() {
    document.querySelectorAll(".social-btn").forEach((link) => {
      const key = link.textContent.trim().toLowerCase();
      const icon = socialIcons[key];
      if (!icon) return;
      link.innerHTML = icon.svg;
      link.setAttribute("aria-label", icon.label);
      link.setAttribute("title", icon.label);
    });
  }

  /* ══════════════════════════════════════════════
     SCROLL-TO-TOP  (existing — untouched)
  ══════════════════════════════════════════════ */
  function ensureScrollTop() {
    let button = document.getElementById("scrollTop");
    if (!button) {
      button = document.createElement("button");
      button.className = "scroll-top";
      button.id = "scrollTop";
      button.type = "button";
      button.setAttribute("aria-label", "Back to top");
      button.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 14l5-5 5 5z"/></svg>';
      document.body.appendChild(button);
    }

    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const update = () => {
      button.classList.toggle("visible", window.scrollY > 400);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ══════════════════════════════════════════════
     SHARE BUTTON  (sits above scroll-top)
  ══════════════════════════════════════════════ */
  function ensureShareWidget() {
    if (document.getElementById("shareGroup")) return;

    const group = document.createElement("div");
    group.id = "shareGroup";
    group.className = "share-group";
    group.innerHTML = `
      <!-- Social icons (hidden until open) -->
      <div class="share-social-list" id="shareSocialList">
        <button class="share-social-btn" data-p="instagram" data-label="INSTAGRAM" aria-label="Open Instagram" type="button">
          <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.337 3.608 1.312.975.975 1.25 2.242 1.312 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.337 2.633-1.312 3.608-.975.975-2.242 1.25-3.608 1.312-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.337-3.608-1.312-.975-.975-1.25-2.242-1.312-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.337-2.633 1.312-3.608.975-.975 2.242-1.25 3.608-1.312C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.013 8.332 0 8.741 0 12c0 3.259.013 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.013 15.259 0 12 0z"/>
            <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8z"/>
            <circle cx="18.406" cy="5.594" r="1.44" fill="white"/>
          </svg>
        </button>
        <button class="share-social-btn" data-p="facebook" data-label="FACEBOOK" aria-label="Share on Facebook" type="button">
          <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
          </svg>
        </button>
        <button class="share-social-btn" data-p="youtube" data-label="YOUTUBE" aria-label="Open YouTube" type="button">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805z" fill="white"/>
            <path d="M9.609 15.601V8.408l6.264 3.602z" fill="#FF0000"/>
          </svg>
        </button>
      </div>

      <!-- Share toggle (bottom — always visible) -->
      <button class="share-toggle" id="shareToggle" aria-label="Share this page" aria-expanded="false" type="button">
        <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="5"  r="3" fill="white"/>
          <circle cx="6"  cy="12" r="3" fill="white"/>
          <circle cx="18" cy="19" r="3" fill="white"/>
          <line x1="8.6"  y1="13.5" x2="15.4" y2="17.5" stroke="white" stroke-width="2"/>
          <line x1="15.4" y1="6.5"  x2="8.6"  y2="10.5" stroke="white" stroke-width="2"/>
        </svg>
      </button>
    `;
    document.body.appendChild(group);

    /* toggle open/close */
    const toggle = document.getElementById("shareToggle");
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      group.classList.toggle("open");
      toggle.setAttribute("aria-expanded", group.classList.contains("open"));
    });

    document.addEventListener("click", (e) => {
      if (!group.contains(e.target)) {
        group.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    /* social actions */
    const actions = {
      instagram: () => window.open("https://www.instagram.com/", "_blank"),
      facebook: () =>
        window.open(
          "https://www.facebook.com/sharer/sharer.php?u=" +
            encodeURIComponent(window.location.href),
          "_blank"
        ),
      youtube: () => window.open("https://www.youtube.com/", "_blank"),
    };

    group.querySelectorAll(".share-social-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        /* ripple */
        const r = document.createElement("span");
        r.className = "share-ripple";
        const rect = btn.getBoundingClientRect();
        r.style.left = e.clientX - rect.left + "px";
        r.style.top = e.clientY - rect.top + "px";
        btn.appendChild(r);
        r.addEventListener("animationend", () => r.remove());

        const p = btn.getAttribute("data-p");
        if (actions[p]) actions[p]();
      });
    });
  }

  /* ══════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════ */
 document.addEventListener("DOMContentLoaded", () => {
  enhanceSocialIcons();
  ensureScrollTop();
  ensureShareWidget();
  ensureContactButtons(); 
});

  /* Quote modal triggers */
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".nav-cta, [data-quote-open]");
    if (trigger) {
      event.preventDefault();
      openQuoteModal();
      return;
    }
    if (event.target.closest("[data-quote-close]")) {
      closeQuoteModal();
    }
  });

  document.addEventListener("submit", (event) => {
    if (event.target.id !== "quoteForm") return;
    event.preventDefault();
    const success = document.getElementById("quoteSuccess");
    if (success) success.classList.add("show");
    event.target.reset();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeQuoteModal();
  });
})();

/* ══════════════════════════════════════════════
   WHATSAPP + CALL BUTTONS  (left side)
══════════════════════════════════════════════ */
function ensureContactButtons() {
  if (document.getElementById("contactGroup")) return;

  const group = document.createElement("div");
  group.id = "contactGroup";
  group.className = "contact-group";
  group.innerHTML = `
    <a class="contact-btn contact-btn--wa"
       href="https://wa.me/919876543210"
       target="_blank"
       rel="noopener noreferrer"
       aria-label="Chat on WhatsApp"
       >
      <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
    <a class="contact-btn contact-btn--call"
       href="tel:+919876543210"
       aria-label="Call us"
       >
      <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
      </svg>
    </a>
  `;
  document.body.appendChild(group);
}


document.addEventListener("DOMContentLoaded", () => {
  enhanceSocialIcons();
  ensureScrollTop();
  ensureShareWidget();
  ensureContactButtons(); /* NEW */
});