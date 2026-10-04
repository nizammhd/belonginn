/* ===========================================================
   main.js — runs on every page. Reads data.js and fills the HTML.
   Enhanced with interactivity, animations, and UX improvements.
   =========================================================== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => "₹" + n.toLocaleString("en-IN");
const wa = msg => `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(msg)}`;

/* ---------- small line icons ---------- */
const ICONS = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  property: '<path d="M3 21V7l9-4 9 4v14M9 21V9h6v12"/>',
  contact: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  wifi:  '<path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01M2 9a15 15 0 0 1 20 0"/>',
  food: '<path d="M7 3v9m0 0a3 3 0 0 0 3-3V3M7 12v9M17 3c-1.5 2-2 4-2 6s.5 3 2 3v9"/>',
  power: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
  clean: '<path d="M3 21h18M6 21V10l6-7 6 7v11M10 21v-5h4v5"/>',
  water: '<path d="M12 3s6 6.5 6 10a6 6 0 0 1-12 0c0-3.5 6-10 6-10z"/>',
  wash: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 6h.01"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3z"/><path d="m9 12 2 2 4-4"/>',
  bed: '<path d="M3 18V7m0 6h18m0 5V11a3 3 0 0 0-3-3H8"/><circle cx="7" cy="11" r="1.6"/>'
};
const WA_SVG = '<svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1s-.8 1-.9 1.2c-.2.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.4 5.3 4.7.7.3 1.3.5 1.8.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2z"/></svg>';
/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
function initProgressBar() {
  const bar = document.createElement("div");
  bar.id = "progress-bar";
  document.body.prepend(bar);

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + "%";
  }, { passive: true });
}

/* ============================================================
   HEADER: scroll-aware class + sticky shrink
   ============================================================ */
function initHeader() {
  const head = $(".site-head");
  if (!head) return;
  window.addEventListener("scroll", () => {
    head.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });
}

/* ============================================================
   BACK TO TOP button
   ============================================================ */
function initBackToTop() {
  const btn = document.createElement("button");
  btn.id = "back-top";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = "↑";
  document.body.appendChild(btn);

  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ============================================================
   MOBILE BOTTOM NAV
   ============================================================ */
function initMobileNav() {
  const nav = document.createElement("nav");
  nav.className = "mobile-nav";
  const here = location.pathname.split("/").pop() || "index.html";
  const links = [
    { href: "index.html", label: "Home", icon: ICONS.home },
    { href: "pgs.html",   label: "PGs",  icon: ICONS.property },
    { href: "#", label: "WhatsApp", icon: '<path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1s-.8 1-.9 1.2c-.2.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.4 5.3 4.7.7.3 1.3.5 1.8.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2z"/>', wa: true },
    { href: "contact.html", label: "Contact", icon: ICONS.contact }
  ];

  nav.innerHTML = `<div class="mobile-nav-inner">${links.map(l => `
    <a href="${l.href}" class="mob-link${l.wa ? " wa-mob js-wa" : ""}${l.href === here ? " active" : ""}">
      <svg viewBox="0 0 24 24">${l.icon}</svg>
      <span>${l.label}</span>
    </a>`).join("")}</div>`;
  document.body.appendChild(nav);
}

/* ============================================================
   HERO PHOTO BACKGROUND
   ============================================================ */
function injectHeroBg() {
  const hero = $("#hero-section") || $(".hero");
  if (!hero) return;
  const photo = (typeof GRAPHICS !== "undefined" && GRAPHICS.heroRoom) ? GRAPHICS.heroRoom : null;
  if (!photo) return;
  const div = document.createElement("div");
  div.className = "hero-photo-bg";
  div.style.backgroundImage = `url('${photo}')`;
  hero.prepend(div);
}

/* ============================================================
   HEADER, FOOTER, FLOATING BUTTON (every page)
   ============================================================ */
function buildShell() {
  document.title = `${COMPANY.name} | ${COMPANY.tagline}`;

  $("#logo").innerHTML = `<img src="${COMPANY.logo}" alt="${COMPANY.name} logo"
      onerror="this.replaceWith(document.createTextNode('${COMPANY.short}'))">`;
  $("#wordmark").innerHTML = `${COMPANY.name}<span>Managed PG homes · Kerala</span>`;

  $$(".js-wa").forEach(a => {
    a.href = wa(`Hi ${COMPANY.name}, I'd like to know about available rooms.`);
    a.target = "_blank"; a.rel = "noopener";
  });

  $("#float").innerHTML = WA_SVG;
  $("#float").href = wa(`Hi ${COMPANY.name}, I'd like to know about available rooms.`);
  $("#float").target = "_blank";

  $("#foot").innerHTML = `
    <p>© ${new Date().getFullYear()} ${COMPANY.name} · ${COMPANY.office}</p>
    <nav class="foot-nav">
      <a href="index.html">Home</a><a href="pgs.html">Our PGs</a>
      <a href="contact.html">Contact</a><a href="tel:${COMPANY.phone.replace(/\s/g, "")}">${COMPANY.phone}</a>
    </nav>`;

  const burger = $("#burger");
  if (burger) burger.onclick = () => $("#nav").classList.toggle("open");

  // Close nav on outside click
  document.addEventListener("click", e => {
    const nav = $("#nav");
    if (nav && !nav.contains(e.target) && !burger.contains(e.target)) {
      nav.classList.remove("open");
    }
  });

  // Active nav
  const here = location.pathname.split("/").pop() || "index.html";
  $$("#nav a").forEach(a => { if (a.getAttribute("href") === here) a.classList.add("active"); });
}

/* ============================================================
   3D TILT EFFECT on cards
   ============================================================ */
function initTilt(selector) {
  if (window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  $$(selector).forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within card
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const tiltX = ((y - cy) / cy) * 5;
      const tiltY = ((cx - x) / cx) * 5;
      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition = "transform .4s cubic-bezier(.2,.8,.3,1)";
      setTimeout(() => card.style.transition = "", 400);
    });
  });
}

/* ============================================================
   HOME PAGE
   ============================================================ */
function buildHome() {
  $("#tagline").textContent = COMPANY.tagline;
  $("#intro").textContent = COMPANY.intro;
  $("#about-text").textContent = COMPANY.about;
  $("#since").innerHTML = `<b>${COMPANY.since}</b><span>Running since</span>`;

  const stats = [
    { value: PGS.length, label: "Properties" },
    { value: PGS.reduce((sum, pg) => sum + Number(pg.vacancy || 0), 0), label: "Open rooms" },
    { value: new Set(PGS.map(pg => pg.area.split(",").pop().trim())).size, label: "Areas covered" }
  ];
  $("#stats").innerHTML = stats.map(stat =>
    `<div><b data-to="${stat.value}">0</b><span>${stat.label}</span></div>`).join("");

  $("#facilities").innerHTML = FACILITIES.map(f => `
    <article class="fac reveal">
      <div class="fac-img">
        <img src="${f.photo}" alt="${f.title}" loading="lazy">
        <div class="ic-badge"><svg viewBox="0 0 24 24">${ICONS[f.icon]}</svg></div>
      </div>
      <div class="fac-body">
        <h3>${f.title}</h3>
        <p>${f.text}</p>
      </div>
    </article>`).join("");

  // Photo gallery
  buildPhotoGrid();

  // three featured PGs with vacancy
  const featured = PGS.filter(p => p.vacancy > 0).slice(0, 3);
  const featuredEl = $("#featured");
  if (featuredEl) {
    featuredEl.innerHTML = featured.map(cardHTML).join("");
  }

  wireGalleries();
  countUp();

  // Re-observe newly added .reveal elements
  revealNew();
  initTilt(".pg");
}

/* ============================================================
   ONE PG CARD
   ============================================================ */
function cardHTML(p, i) {
  const free = p.vacancy > 0;
  return `
  <article class="pg reveal" data-for="${p.audience}" data-free="${free}">
    <div class="gallery" data-shots>
      <div class="ph">Photo of ${p.area}</div>
      ${p.photos.map((src, n) => `<img src="${src}" alt="${p.name} photo ${n + 1}"
          class="${n === 0 ? "show" : ""}" onerror="this.remove()">`).join("")}
      <span class="photo-caption">Representative image</span>
      <span class="badge">${p.audience}</span>
      <span class="badge r ${free ? "free" : "full"}">${free ? p.vacancy + " beds free" : "Waitlist"}</span>
      <div class="dots">${p.photos.map((_, n) => `<i class="${n === 0 ? "on" : ""}"></i>`).join("")}</div>
      <button class="gal-arr prev" aria-label="Previous photo">‹</button>
      <button class="gal-arr next" aria-label="Next photo">›</button>
    </div>
    <div class="pg-body">
      <h3>${p.name}</h3>
      <p class="loc">${p.landmark}</p>
      <div class="price"><b>${money(p.rent)}</b><span>per month · ${money(p.deposit)} deposit</span></div>
      <div class="specs">
        <div><span>ROOM TYPE</span><b>${p.sharing}</b></div>
        <div><span>FOOD</span><b>${p.food}</b></div>
        <div><span>NOTICE PERIOD</span><b>${p.notice}</b></div>
        <div><span>AREA</span><b>${p.area}</b></div>
      </div>
      <div class="chips">${p.amenities.map(a => `<span class="chip">${a}</span>`).join("")}</div>
      <div class="pg-foot">
        <a class="btn btn-wa" target="_blank" rel="noopener"
           href="${wa(`Hi ${COMPANY.name}, I'm interested in ${p.name} (${p.sharing}, ${money(p.rent)}/month). Is a bed available?`)}">
          ${WA_SVG} ${free ? "Book on WhatsApp" : "Join waitlist"}</a>
        <a class="pg-map-link" href="${p.mapLink}" target="_blank" rel="noopener">Map</a>
      </div>
    </div>
  </article>`;
}

/* ============================================================
   PHOTO GALLERY + LIGHTBOX
   ============================================================ */
function buildPhotoGrid() {
  const box = $("#photo-grid");
  if (!box || typeof LIFE_GALLERY === "undefined") return;

  box.innerHTML = LIFE_GALLERY.map((p, i) => `
    <div class="p-item reveal" data-src="${p.src}">
      <img src="${p.src}" alt="${p.title}" loading="lazy">
      <div class="p-label">
        <span style="font-size:11px;font-weight:700;letter-spacing:.05em;color:var(--brand-2);text-transform:uppercase;display:block;margin-bottom:2px">${p.cat}</span>
        <b style="font-size:15px;display:block">${p.title}</b>
        <small style="font-size:12.5px;color:rgba(255,255,255,.8);display:block;margin-top:2px">${p.desc}</small>
      </div>
    </div>`).join("");

  // Lightbox setup
  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML = `<button class="lightbox-close" aria-label="Close">Close</button><img src="" alt="">`;
  document.body.appendChild(overlay);

  const lbImg = $("img", overlay);
  const closeOverlay = () => overlay.classList.remove("open");

  $$(".p-item", box).forEach(item => {
    item.addEventListener("click", () => {
      lbImg.src = item.dataset.src;
      overlay.classList.add("open");
    });
  });

  $(".lightbox-close", overlay).onclick = closeOverlay;
  overlay.addEventListener("click", e => { if (e.target === overlay) closeOverlay(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeOverlay(); });

  revealNew();
}

/* ============================================================
   PG LISTING PAGE
   ============================================================ */
function buildList() {
  const box = $("#pglist");

  // Inject live search above filters
  const filterSec = $(".filters");
  if (filterSec) {
    const sw = document.createElement("div");
    sw.className = "search-wrap";
    sw.innerHTML = `
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
      <input id="pg-search" type="search" placeholder="Search by area, name or amenity…" autocomplete="off">`;
    filterSec.before(sw);
  }

  // No results msg
  const noRes = document.createElement("p");
  noRes.className = "no-results";
  noRes.textContent = "No properties match your search. Try a different term or clear the filters.";
  box.after(noRes);

  box.innerHTML = PGS.map(cardHTML).join("");
  wireGalleries();
  initTilt(".pg");
  revealNew();

  // Filter buttons
  $$(".filters button").forEach(btn => {
    btn.onclick = () => {
      $$(".filters button").forEach(b => b.classList.toggle("on", b === btn));
      applyFilters();
    };
  });

  // Live search
  const searchEl = $("#pg-search");
  if (searchEl) {
    searchEl.addEventListener("input", applyFilters);
  }

  function applyFilters() {
    const activeFilter = ($(".filters button.on") || {}).dataset?.filter || "all";
    const query = (searchEl?.value || "").toLowerCase().trim();

    let visibleCount = 0;
    $$(".pg", box).forEach(c => {
      const filterOk = activeFilter === "all"
        || (activeFilter === "free" && c.dataset.free === "true")
        || c.dataset.for.includes(activeFilter);

      const text = c.innerText.toLowerCase();
      const searchOk = !query || text.includes(query);

      const show = filterOk && searchOk;
      c.style.display = show ? "" : "none";
      if (show) visibleCount++;
    });
    noRes.classList.toggle("show", visibleCount === 0);
  }
}

/* ============================================================
   PHOTO SLIDER inside each card (with arrow nav)
   ============================================================ */
function wireGalleries() {
  $("[data-shots]").forEach(g => {
    const imgs = $$("img", g), dots = $$(".dots i", g);
    if (imgs.length < 1) return;
    let idx = 0;

    const go = n => {
      idx = (n + imgs.length) % imgs.length;
      imgs.forEach((im, k) => im.classList.toggle("show", k === idx));
      dots.forEach((d, k) => d.classList.toggle("on", k === idx));
    };

    dots.forEach((d, k) => d.onclick = e => { e.stopPropagation(); go(k); });

    const prev = $(".gal-arr.prev", g);
    const next = $(".gal-arr.next", g);
    if (prev) prev.onclick = e => { e.stopPropagation(); go(idx - 1); };
    if (next) next.onclick = e => { e.stopPropagation(); go(idx + 1); };

    // Touch swipe
    let touchX = null;
    g.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
    g.addEventListener("touchend", e => {
      if (touchX === null) return;
      const diff = touchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) go(idx + (diff > 0 ? 1 : -1));
      touchX = null;
    });

    if (imgs.length > 1) setInterval(() => go(idx + 1), 4500);
  });
}

/* ============================================================
   CONTACT FORM with validation
   ============================================================ */
function buildContact() {
  $("#info").innerHTML = [
    ["PHONE", `<a href="tel:${COMPANY.phone.replace(/\s/g, "")}">${COMPANY.phone}</a>`],
    ["EMAIL", `<a href="mailto:${COMPANY.email}">${COMPANY.email}</a>`],
    ["OFFICE", COMPANY.office],
    ["HOURS", COMPANY.hours]
  ].map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join("");

  $("#pick").innerHTML = `<option value="">Any property</option>` +
    PGS.map(p => `<option>${p.name}</option>`).join("");

  // Wrap fields for error display
  ["name", "date"].forEach(id => {
    const el = $(`#${id}`);
    if (!el) return;
    const grp = document.createElement("div");
    grp.className = "field-grp";
    el.parentNode.insertBefore(grp, el);
    grp.appendChild(el);
    const err = document.createElement("span");
    err.className = "field-err";
    err.id = `${id}-err`;
    err.textContent = id === "name" ? "Please enter your name." : "Please pick a move-in date.";
    grp.appendChild(err);
  });

  // Real-time validation
  function validate(id, rule) {
    const el = $(`#${id}`);
    const err = $(`#${id}-err`);
    if (!el || !err) return true;
    const ok = rule(el.value);
    el.classList.toggle("error", !ok);
    el.classList.toggle("valid", ok && el.value.length > 0);
    err.classList.toggle("show", !ok && el.value !== "");
    return ok;
  }

  const nameEl = $("#name");
  const dateEl = $("#date");
  if (nameEl) nameEl.addEventListener("input", () => validate("name", v => v.trim().length >= 2));
  if (dateEl) dateEl.addEventListener("change", () => validate("date", v => v !== ""));

  // Success banner
  const successBanner = document.createElement("div");
  successBanner.className = "form-success";
  successBanner.textContent = "Opening WhatsApp with your message…";
  $(".form")?.appendChild(successBanner);

  $("#send").onclick = () => {
    const nameOk = validate("name", v => v.trim().length >= 2);
    if (!nameOk) { nameEl.focus(); return; }

    const name = nameEl?.value.trim() || "Hi";
    const msg = `Hi ${COMPANY.name}, this is ${name}.
Property: ${$("#pick").value || "Any"}
Moving in: ${dateEl?.value || "Not sure"}
Message: ${$("#note").value.trim() || "Please share room details."}`;

    successBanner.classList.add("show");
    setTimeout(() => { successBanner.classList.remove("show"); }, 4000);
    window.open(wa(msg), "_blank");
  };
}

/* ============================================================
   COUNT-UP ANIMATION
   ============================================================ */
function countUp() {
  const statEls = $$("#stats b");
  if (!statEls.length) return;

  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const to = +el.dataset.to;
      const txt = el.textContent;
      const pre = txt.startsWith("₹") ? "₹" : "";
      const suf = txt.endsWith("+") ? "+" : "";
      let n = 0, start = null;
      const dur = 1800;

      function step(ts) {
        if (!start) start = ts;
        const prog = Math.min((ts - start) / dur, 1);
        const ease = 1 - Math.pow(1 - prog, 3); // ease-out-cubic
        n = Math.round(ease * to);
        el.textContent = pre + n.toLocaleString("en-IN") + suf;
        if (prog < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => io.observe(el));
}

/* ============================================================
   SCROLL REVEAL — initial pass
   ============================================================ */
let _revealObserver = null;

function reveal() {
  _revealObserver = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); _revealObserver.unobserve(e.target); }
  }), { threshold: .08 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + "ms"; _revealObserver.observe(el); });
}

/* Called after dynamic content is inserted to observe new .reveal elements */
function revealNew() {
  if (!_revealObserver) return;
  $$(".reveal:not(.in)").forEach((el, i) => {
    if (!el._observed) {
      el._observed = true;
      el.style.transitionDelay = (i % 4) * 80 + "ms";
      _revealObserver.observe(el);
    }
  });
}

/* ============================================================
   KEYBOARD NAV: close nav on Escape
   ============================================================ */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    $("#nav")?.classList.remove("open");
  }
});

/* ============================================================
   START
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  buildShell();
  initProgressBar();
  initHeader();
  initBackToTop();
  initMobileNav();
  injectHeroBg();

  // Build page content first, THEN start reveal observer
  if ($("#stats")) buildHome();
  if ($("#pglist")) buildList();
  if ($("#info")) buildContact();

  // Run reveal AFTER all content is inserted
  reveal();

  // Re-wire WhatsApp links added by mobile nav
  $$(".js-wa").forEach(a => {
    if (!a.href || a.href === "#" || a.href === location.href + "#") {
      a.href = wa(`Hi ${COMPANY.name}, I'd like to know about available rooms.`);
      a.target = "_blank"; a.rel = "noopener";
    }
  });
});
