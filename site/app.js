const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const header = document.querySelector('[data-header]');
const progress = document.querySelector('[data-progress]');
const menuButton = document.querySelector('[data-menu-button]');
const menu = document.querySelector('[data-menu]');
const hero = document.querySelector('[data-hero]');

const updateHeroDepth = () => {
  if (!hero || reduceMotion) return;
  const travel = Math.max(hero.offsetHeight - window.innerHeight, 1);
  const amount = Math.min(Math.max((window.scrollY - hero.offsetTop) / travel, 0), 1);
  hero.style.setProperty('--hero-rail-shift', `${amount * 58}vw`);
  hero.style.setProperty('--hero-rail-drop', `${amount * 7}vh`);
  hero.style.setProperty('--hero-rail-scale', String(1 + amount * .15));
  hero.style.setProperty('--hero-floor-drop', `${amount * 62}vh`);
  hero.style.setProperty('--hero-floor-scale', String(1 + amount * .22));
  hero.style.setProperty('--hero-sky-scale', String(1 + amount * .08));
  hero.style.setProperty('--hero-wash-opacity', String(.58 - amount * .48));
  hero.style.setProperty('--hero-copy-opacity', String(Math.max(1 - amount * 1.38, 0)));
  hero.style.setProperty('--hero-copy-shift', `${amount * -8}vh`);
  hero.style.setProperty('--hero-copy-blur', `${amount * 4}px`);
};

const updateScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  header.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeroDepth();
};
updateScroll();
let scrollFrame = 0;
const queueScrollUpdate = () => {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(() => {
    updateScroll();
    scrollFrame = 0;
  });
};
window.addEventListener('scroll', queueScrollUpdate, { passive: true });
window.addEventListener('resize', queueScrollUpdate, { passive: true });

const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menu.classList.remove('is-open');
  document.body.classList.remove('menu-open');
};
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
});
menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});

const reveals = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((item) => observer.observe(item));
}

const examples = {
  cleaner: {
    url: 'brightroomcleaning.ca', style: 'Editorial calm', label: 'Cleaning', className: 'template-cleaner',
    markup: `<nav class="t-clean-nav"><strong><i>✦</i> bright room</strong><span>Services&nbsp;&nbsp; About&nbsp;&nbsp; Reviews&nbsp;&nbsp; Contact</span><b>Book a clean ↗</b></nav><div class="t-clean-hero"><div class="t-clean-copy"><small>THOUGHTFUL HOME CLEANING</small><h3>A calmer home,<br><em>backed by care.</em></h3><p>Reliable recurring cleans designed around your home, schedule, and priorities.</p><span class="t-cta">EXPLORE SERVICES&nbsp; ↗</span></div><div class="t-clean-visual" aria-hidden="true"><span>WELCOME<br>HOME</span><i></i></div></div><div class="t-clean-services"><p><b>Recurring cleans</b><i>Weekly or biweekly</i></p><p><b>Deep cleans</b><i>A complete reset</i></p><p><b>Move-in ready</b><i>Start fresh</i></p></div>`
  },
  detailer: {
    url: 'parkedpolished.ca', style: 'Electric showcase', label: 'Mobile detailing', className: 'template-detailer',
    markup: `<nav class="t-detailer-nav"><strong>parked+polished</strong><span><i>•••</i>&nbsp;&nbsp; Packages&nbsp;&nbsp; Results&nbsp;&nbsp; Contact&nbsp;&nbsp; ⌕</span><b>Book now</b></nav><div class="t-detailer-stage"><small>FOR DRIVERS WHO NOTICE THE DETAILS</small><div class="t-detailer-year">YYC<br>2026</div><h3>DRIVEN<br>CLEAN.</h3><div class="t-detailer-product"><span>THE SIGNATURE</span><strong>P+P</strong><i>INTERIOR + EXTERIOR</i><b>02.5 HRS</b></div><p>Mobile detailing with a sharp finish and zero waiting-room time.</p><span class="t-cta">Choose your package ↗</span></div><div class="t-detailer-bottom">We come to you</span><strong>SHOWROOM CARE / DRIVEWAY CONVENIENCE</strong><span>From $180&nbsp; ↗</span></div>`
  },
  contractor: {
    url: 'trueframecontracting.ca', style: 'Neon modular', label: 'Contracting', className: 'template-contractor',
    markup: `<div class="t-build-shell"><nav class="t-build-nav"><strong>▰ TRUEFRAME</strong><span>Home&nbsp;&nbsp; Services&nbsp;&nbsp; Process&nbsp;&nbsp; Work</span><b>Start a project&nbsp; ●</b></nav><div class="t-build-feature"><div><small>RENOVATIONS WITHOUT THE RUNAROUND</small><h3>NEXT<br>LEVEL<br>HOME.</h3><p>Clear plans, skilled trades, and one team accountable from start to finish.</p></div><aside><span>PROJECT 024</span><strong>KITCHEN<br>REBUILT.</strong><i>NW CALGARY</i></aside></div><div class="t-build-modules"><article><b>Clear quotes</b><p>Know the scope before work starts.</p></article><article><b>One point of contact</b><p>No chasing five different trades.</p></article><article><b>Built to last</b><p>Careful work, documented properly.</p></article></div></div>`
  },
  groomer: {
    url: 'gooddoggrooming.ca', style: 'Atmospheric retreat', label: 'Pet grooming', className: 'template-groomer',
    markup: `<div class="t-pet-shell"><nav class="t-pet-nav"><strong><i>✦</i> Good Dog</strong><span>Services&nbsp;&nbsp; Pricing&nbsp;&nbsp; First Visit&nbsp;&nbsp; About Us</span><b>Book a visit</b></nav><div class="t-pet-hero"><small>ONE-ON-ONE GROOMING IN CALGARY</small><h3>Escape the rush.<br>Grooming with <em>patience.</em></h3><p>A quieter appointment, a gentler pace, and thoughtful care from hello to pickup.</p><span class="t-cta">Find an appointment</span><div class="t-pet-wave" aria-hidden="true"></div></div><div class="t-pet-services"><p><i>✦</i><span><b>Calm first visits</b>Time to settle in.</span></p><p><i>✧</i><span><b>Full grooming</b>Bath, trim, nails.</span></p><p><i>○</i><span><b>Comfort breaks</b>Never rushed.</span></p><p><i>☾</i><span><b>Quiet studio</b>One dog at a time.</span></p></div></div>`
  }
};
const demoSite = document.querySelector('[data-demo-site]');
const demoUrl = document.querySelector('[data-demo-url]');
const demoStyle = document.querySelector('[data-demo-style]');
const demoCount = document.querySelector('[data-demo-count]');
const exampleOrder = Object.keys(examples);
let currentExample = 0;

const renderExample = (key, animate = true) => {
  const next = examples[key];
  currentExample = exampleOrder.indexOf(key);
  document.querySelectorAll('[data-example]').forEach((item) => {
    const active = item.dataset.example === key;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  if (animate) demoSite.animate([{ opacity: .18, transform: 'translateX(14px) scale(.985)' }, { opacity: 1, transform: 'none' }], { duration: reduceMotion ? 0 : 380, easing: 'cubic-bezier(.2,.8,.2,1)' });
  demoUrl.textContent = next.url;
  demoStyle.textContent = next.style;
  demoCount.textContent = `${String(currentExample + 1).padStart(2, '0')} / ${String(exampleOrder.length).padStart(2, '0')}`;
  demoSite.className = `browser-site ${next.className}`;
  demoSite.setAttribute('aria-label', `${next.label} starter website preview`);
  demoSite.innerHTML = next.markup;
};

document.querySelectorAll('[data-example]').forEach((button) => button.addEventListener('click', () => renderExample(button.dataset.example)));
document.querySelector('[data-demo-prev]').addEventListener('click', () => renderExample(exampleOrder[(currentExample - 1 + exampleOrder.length) % exampleOrder.length]));
document.querySelector('[data-demo-next]').addEventListener('click', () => renderExample(exampleOrder[(currentExample + 1) % exampleOrder.length]));
renderExample(exampleOrder[0], false);

if (finePointer && !reduceMotion) {
  const cursor = document.querySelector('[data-cursor]');
  window.addEventListener('pointermove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  }, { passive: true });
  document.querySelectorAll('a, button, summary, [data-tilt]').forEach((item) => {
    item.addEventListener('pointerenter', () => cursor.classList.add('is-hovering'));
    item.addEventListener('pointerleave', () => cursor.classList.remove('is-hovering'));
  });
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `rotateX(${-y * 6}deg) rotateY(${x * 7}deg) translateY(-5px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
  document.querySelectorAll('.magnetic').forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      item.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .12}px, ${(event.clientY - rect.top - rect.height / 2) * .12}px)`;
    });
    item.addEventListener('pointerleave', () => { item.style.transform = ''; });
  });
}
