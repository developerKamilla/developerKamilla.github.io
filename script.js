/* ===========================
   PORTFOLIO — MAIN JS
   =========================== */

// === CURSOR ===
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});
(function animateFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animateFollower);
})();

// === SIDEBAR NAV ===
const hamburger   = document.querySelector('.nav-hamburger');
const drawer      = document.querySelector('.nav-drawer');
const navOverlay  = document.querySelector('.nav-overlay');

function toggleNav(open) {
  hamburger.classList.toggle('open', open);
  drawer.classList.toggle('open', open);
  navOverlay.classList.toggle('open', open);
}
hamburger.addEventListener('click', () => toggleNav(!drawer.classList.contains('open')));
navOverlay.addEventListener('click', () => toggleNav(false));

// === PAGE NAVIGATION ===
const pages = {
  about:    document.getElementById('page-about'),
  projects: document.getElementById('page-projects'),
  hobbies:  document.getElementById('page-hobbies'),
};
const navLinks   = document.querySelectorAll('[data-page]');
const transition = document.querySelector('.page-transition');
let currentPage  = 'about';

function showPage(name) {
  if (name === currentPage) return;
  toggleNav(false);
  transition.classList.add('entering');
  setTimeout(() => {
    pages[currentPage].classList.add('hidden');
    pages[name].classList.remove('hidden');
    currentPage = name;
    window.scrollTo(0, 0);
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.page === name));
    updateSideDots(name);
    transition.classList.remove('entering');
    transition.classList.add('leaving');
    setTimeout(() => transition.classList.remove('leaving'), 600);
    setTimeout(initPageAnimations, 100);
  }, 420);
}
navLinks.forEach(link => {
  link.addEventListener('click', e => { e.preventDefault(); showPage(link.dataset.page); });
});

// === SCROLL REVEAL ===
function initPageAnimations() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .stagger, .qa-item');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => { el.classList.remove('visible'); obs.observe(el); });
}
initPageAnimations();

// === SIDE DOTS ===
const sideDots = document.querySelectorAll('.side-dot');
function updateSideDots(name) { sideDots.forEach(d => d.classList.toggle('active', d.dataset.page === name)); }
sideDots.forEach(d => d.addEventListener('click', () => showPage(d.dataset.page)));
updateSideDots('about');

// === LIVE CLOCK ===
function updateClock() {
  const el = document.getElementById('live-time');
  if (el) el.textContent = new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12: false });
}
function updateDate() {
  const el = document.getElementById('live-date');
  if (el) el.textContent = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }).toUpperCase();
}
updateClock(); updateDate();
setInterval(updateClock, 1000);

// === MEMOJI SWITCHER ===
const memojiImg    = document.getElementById('hero-memoji');
const memojiThumbs = document.querySelectorAll('.memoji-thumb');
memojiThumbs.forEach(thumb => {
  thumb.addEventListener('click', () => {
    const src = thumb.querySelector('img').src;
    memojiImg.style.opacity = '0';
    setTimeout(() => { memojiImg.src = src; memojiImg.style.opacity = '1'; }, 300);
    memojiThumbs.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  });
});

// === TILT on project cards ===
function initTilt() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const rX = (y - r.height/2) / r.height * -8;
      const rY = (x - r.width/2)  / r.width  *  8;
      card.style.transform = `perspective(800px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    });
    card.addEventListener('mouseenter', () => { card.style.transition = 'transform 0.08s'; });
  });
}
initTilt();

// === SKILL CARD RIPPLE ===
const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes ripple-anim { to { transform: translate(-50%,-50%) scale(20); opacity: 0; } }';
document.head.appendChild(rippleStyle);
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mouseenter', e => {
    const rip = document.createElement('span');
    rip.style.cssText = `position:absolute;width:10px;height:10px;background:rgba(245,200,66,0.35);border-radius:50%;transform:translate(-50%,-50%) scale(0);animation:ripple-anim 0.6s ease-out forwards;pointer-events:none;left:${e.offsetX}px;top:${e.offsetY}px;z-index:0;`;
    card.appendChild(rip);
    setTimeout(() => rip.remove(), 620);
  });
});

// === COUNTER ANIMATION ===
function animateCounters() {
  document.querySelectorAll('.count-up').forEach(el => {
    const target = parseInt(el.dataset.target), duration = 1400;
    const start = performance.now();
    function update(now) {
      const p = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(e * target) + (el.dataset.suffix || '');
      if (p < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}
const counterTarget = document.querySelector('.run-stats');
if (counterTarget) {
  new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounters(); } });
  }, { threshold: 0.3 }).observe(counterTarget);
}

// === TEXT SCRAMBLE ===
class TextScramble {
  constructor(el) {
    this.el = el; this.chars = '!<>-_\\/[]{}=+*^?#░▒';
    this.update = this.update.bind(this);
  }
  setText(text) {
    const old = this.el.innerText, len = Math.max(old.length, text.length);
    const p = new Promise(r => this.resolve = r);
    this.queue = [];
    for (let i = 0; i < len; i++) {
      const start = Math.floor(Math.random()*12), end = start + Math.floor(Math.random()*12);
      this.queue.push({ from: old[i]||'', to: text[i]||'', start, end });
    }
    cancelAnimationFrame(this.frameReq);
    this.frame = 0; this.update(); return p;
  }
  update() {
    let out = '', done = 0;
    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) { done++; out += to; }
      else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) { char = this.chars[Math.floor(Math.random()*this.chars.length)]; this.queue[i].char = char; }
        out += `<span style="opacity:0.4;color:var(--yellow)">${char}</span>`;
      } else { out += from; }
    }
    this.el.innerHTML = out;
    if (done === this.queue.length) this.resolve();
    else { this.frameReq = requestAnimationFrame(this.update); this.frame++; }
  }
}
document.querySelectorAll('[data-scramble]').forEach(el => {
  const orig = el.textContent, fx = new TextScramble(el);
  el.addEventListener('mouseenter', () => fx.setText(orig));
});

// === MARQUEE DUPLICATE ===
document.querySelectorAll('.marquee-track').forEach(t => { t.innerHTML += t.innerHTML; });

// === MUSIC SCROLL DRAG ===
document.querySelectorAll('.music-scroll-track').forEach(track => {
  let isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown', e => {
    isDown = true; track.classList.add('dragging');
    startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft;
  });
  document.addEventListener('mouseup', () => { isDown = false; track.classList.remove('dragging'); });
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
  // Touch
  track.addEventListener('touchstart', e => { startX = e.touches[0].pageX; scrollLeft = track.scrollLeft; });
  track.addEventListener('touchmove', e => {
    const x = e.touches[0].pageX;
    track.scrollLeft = scrollLeft - (x - startX);
  });
});

// === PARALLAX ===
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  const active = pages[currentPage];
  if (!active) return;
  const hl = active.querySelector('.about-hero-left');
  const pt = active.querySelector('.projects-hero-title');
  if (hl) hl.style.transform = `translateY(${s * 0.2}px)`;
  if (pt) pt.style.transform = `translateY(${s * 0.25}px)`;
});

window.addEventListener('load', initPageAnimations);
