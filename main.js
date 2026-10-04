/* ===========================================================
   main.js — runs on every page. Reads data.js and fills the HTML.
   Enhanced with interactivity, animations, and UX improvements.
   =========================================================== */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => "₹" + n.toLocaleString("en-IN");
const wa = msg => `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(msg)}`;

/* ---------- small line icons ---------- */
const ICONS = {
  wifi:  '<path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01M2 9a15 15 0 0 1 20 0"/>',
  food:  '<path d="M7 3v9m0 0a3 3 0 0 0 3-3V3M7 12v9M17 3c-1.5 2-2 4-2 6s.5 3 2 3v9"/>',
  power: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
  clean: '<path d="M3 21h18M6 21V10l6-7 6 7v11M10 21v-5h4v5"/>',
  water: '<path d="M12 3s6 6.5 6 10a6 6 0 0 1-12 0c0-3.5 6-10 6-10z"/>',
  wash:  '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 6h.01"/>',
  shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3z"/><path d="m9 12 2 2 4-4"/>',
  bed:   '<path d="M3 18V7m0 6h18m0 5V11a3 3 0 0 0-3-3H8"/><circle cx="7" cy="11" r="1.6"/>'
};
const WA_SVG = '<svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1s-.8 1-.9 1.2c-.2.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.4 5.3 4.7.7.3 1.3.5 1.8.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2z"/></svg>';
const STAR_SVG = n => Array(5).fill(0).map((_, i) =>
  `<svg viewBox="0 0 24 24"><path d="M12 2l3.1 6.3 7 1-5 4.9 1.2 7L12 18l-6.3 3.2 1.2-7L2 9.3l7-1z"/></svg>`
).join("");

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
    { href: "index.html", label: "Home", icon: '<path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H14v-6h-4v6H4a1 1 0 0 1-1-1V9.5z"/>' },
    { href: "pgs.html",   label: "PGs",  icon: '<path d="M3 21V7l9-4 9 4v14M9 21V9h6v12"/>' },
    { href: "#",           label: "WhatsApp", icon: '<path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1s-.8 1-.9 1.2c-.2.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.4 5.3 4.7.7.3 1.3.5 1.8.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2z"/>', wa: true },
    { href: "contact.html", label: "Contact", icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' }
  ];

  nav.innerHTML = `<div class="mobile-nav-inner">${links.map(l => `
    <a href="${l.href}" class="mob-link${l.wa ? " wa-mob js-wa" : ""}${l.href === here ? " active" : ""}">
      <svg viewBox="0 0 24 24">${l.icon}</svg>
      <span>${l.label}</span>
    </a>`).join("")}</div>`;
  document.body.appendChild(nav);
}

/* ============================================================
   HERO PARTICLE CANVAS
   ============================================================ */
function initParticles() {
  const hero = $(".hero");
  if (!hero) return;

  const canvas = document.createElement("canvas");
  canvas.id = "hero-canvas";
  hero.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  let W, H, particles = [];

  function resize() {
    W = canvas.width = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const count = Math.min(60, Math.floor(W * H / 12000));
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.15
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255,255,255,${0.07 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ============================================================
   WAVE SVG divider after hero
   ============================================================ */
function injectWave() {
  const hero = $(".hero");
  if (!hero) return;
  const wave = document.createElement("div");
  wave.className = "hero-wave";
  wave.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60" preserveAspectRatio="none">
    <path d="M0,0 C240,50 480,60 720,40 C960,20 1200,50 1440,0 L1440,60 L0,60 Z"
      fill="var(--bg)" />
  </svg>`;
  hero.appendChild(wave);
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
      <a href="contact.html">Contact</a><a href="tel:${COMPANY.phone.replace(/\s/g,"")}">${COMPANY.phone}</a>
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

  const statTips = [
    "Active managed properties across Kerala",
    "Happy residents currently living with us",
    "Years of trusted service since " + COMPANY.since,
    "Zero brokerage, always"
  ];

  $("#stats").innerHTML = STATS.map((s, i) =>
    `<div data-tip="${statTips[i]}"><b data-to="${s.value}">${s.prefix || ""}0${s.suffix || ""}</b><span>${s.label}</span></div>`).join("");

  $("#facilities").innerHTML = FACILITIES.map(f => `
    <article class="fac reveal">
      <div class="ic"><svg viewBox="0 0 24 24">${ICONS[f.icon]}</svg></div>
      <h3>${f.title}</h3><p>${f.text}</p>
    </article>`).join("");

  // Reviews with stars and carousel
  buildReviewsCarousel();

  // three featured PGs
  $("#featured").innerHTML = PGS.filter(p => p.vacancy > 0).slice(0, 3).map(cardHTML).join("");
  wireGalleries();
  countUp();
  initTilt(".pg");
}

/* ============================================================
   REVIEWS CAROUSEL
   ============================================================ */
function buildReviewsCarousel() {
  const container = $("#reviews");
  if (!container) return;

  const wrap = document.createElement("div");
  wrap.className = "reviews-outer";

  const track = document.createElement("div");
  track.className = "grid-rev";
  track.id = "rev-track";

  track.innerHTML = REVIEWS.map(r => `
    <article class="rev reveal">
      <div class="stars">${STAR_SVG(5)}</div>
      <p>${r.text}</p>
      <footer><b>${r.name}</b><span>${r.tag}</span></footer>
    </article>`).join("");

  const ctrl = document.createElement("div");
  ctrl.className = "carousel-ctrl";

  const dotsHTML = REVIEWS.map((_, i) =>
    `<span class="${i === 0 ? "on" : ""}" data-slide="${i}"></span>`).join("");

  ctrl.innerHTML = `
    <button class="carousel-btn" id="rev-prev" aria-label="Previous">‹</button>
    <div class="carousel-dots" id="rev-dots">${dotsHTML}</div>
    <button class="carousel-btn" id="rev-next" aria-label="Next">›</button>`;

  wrap.appendChild(track);
  container.appendChild(wrap);
  container.appendChild(ctrl);

  let current = 0;
  const total = REVIEWS.length;

  function goTo(n) {
    current = (n + total) % total;
    // On desktop use transform, on mobile just show grid
    if (window.innerWidth > 900) {
      const cardW = track.children[0]?.offsetWidth || 0;
      const gap = 20;
      track.style.transform = `translateX(-${current * (cardW + gap)}px)`;
    }
    $$("#rev-dots span").forEach((d, i) => d.classList.toggle("on", i === current));
  }

  $("#rev-prev").onclick = () => goTo(current - 1);
  $("#rev-next").onclick = () => goTo(current + 1);
  $$("#rev-dots span").forEach(d => d.onclick = () => goTo(+d.dataset.slide));

  // Auto play
  let timer = setInterval(() => goTo(current + 1), 5500);
  wrap.addEventListener("mouseenter", () => clearInterval(timer));
  wrap.addEventListener("mouseleave", () => { timer = setInterval(() => goTo(current + 1), 5500); });
  window.addEventListener("resize", () => goTo(current));
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
        <a class="btn btn-line" href="${p.mapLink}" target="_blank" rel="noopener">Map</a>
      </div>
    </div>
  </article>`;
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
    ["PHONE", `<a href="tel:${COMPANY.phone.replace(/\s/g,"")}">${COMPANY.phone}</a>`],
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
   SCROLL REVEAL
   ============================================================ */
function reveal() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .10 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + "ms"; io.observe(el); });
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
  injectWave();
  initParticles();

  if ($("#stats"))   buildHome();
  if ($("#pglist"))  buildList();
  if ($("#info"))    buildContact();

  reveal();

  // Re-wire WhatsApp links added by mobile nav
  $$(".js-wa").forEach(a => {
    if (!a.href || a.href === "#" || a.href === location.href + "#") {
      a.href = wa(`Hi ${COMPANY.name}, I'd like to know about available rooms.`);
      a.target = "_blank"; a.rel = "noopener";
    }
  });
});
