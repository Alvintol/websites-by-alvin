const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const header = document.querySelector('[data-header]');
const progress = document.querySelector('[data-progress]');
const menuButton = document.querySelector('[data-menu-button]');
const menu = document.querySelector('[data-menu]');

const updateScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  header.classList.toggle('is-scrolled', window.scrollY > 24);
};
updateScroll();
window.addEventListener('scroll', updateScroll, { passive: true });

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
  yard: {
    url: 'northlineyard.ca', style: 'Editorial split', label: 'Yard care', className: 'template-yard',
    markup: `<nav class="t-yard-nav"><strong>northline.</strong><span>Services&nbsp;&nbsp; About&nbsp;&nbsp; <b>Get a quote ↗</b></span></nav><div class="t-yard-main"><div class="t-yard-copy"><small>YARD CARE · CALGARY</small><h3>Good yards.<br><em>Better weekends.</em></h3><p>Seasonal care that keeps your property looking its best.</p><span class="t-cta">Explore services →</span></div><div class="t-yard-art"><i></i><strong>48HR</strong><span>AVERAGE<br>RESPONSE</span></div></div><div class="t-yard-services"><span>SPRING CLEANUP</span><span>WEEKLY MOWING</span><span>FALL PREP</span></div>`
  },
  cleaner: {
    url: 'brightroomcleaning.ca', style: 'Soft cards', label: 'Cleaning', className: 'template-cleaner',
    markup: `<div class="t-clean-shell"><nav class="t-clean-nav"><span>Services</span><strong>bright room ✦</strong><span>Book a clean</span></nav><div class="t-clean-grid"><div class="t-clean-copy"><small>CALGARY HOME CLEANING</small><h3>More room<br>to <em>breathe.</em></h3><p>Thoughtful recurring cleans for busy homes and full calendars.</p><span class="t-cta">See your options ↗</span></div><aside class="t-clean-card"><span>YOUR WEEKLY RESET</span><strong>Every room,<br>handled.</strong><ul><li>Kitchen + living areas</li><li>Bathrooms + bedrooms</li><li>Floors + finishing touches</li></ul><b>From $140</b></aside></div><div class="t-clean-proof"><strong>4.9</strong><span>★★★★★<br>Neighbourhood favourite</span><p>“The house finally feels easy again.”</p></div></div>`
  },
  detailer: {
    url: 'parkedpolished.ca', style: 'Dark cinematic', label: 'Mobile detailing', className: 'template-detailer',
    markup: `<nav class="t-detailer-nav"><strong>P+P</strong><span>PACKAGES&nbsp;&nbsp; RESULTS</span><b>BOOK ↗</b></nav><div class="t-detailer-stage"><div class="t-detailer-glow"></div><small>MOBILE AUTO DETAILING · YYC</small><h3>Driven clean.</h3><p>Showroom-level care, right in your driveway.</p><span class="t-cta">Choose a package →</span><div class="t-detailer-mark">PARKED<br><i>+</i> POLISHED</div></div><div class="t-detailer-stats"><span><b>01</b> We come to you</span><span><b>02</b> Interior + exterior</span><span><b>03</b> Book in two minutes</span></div>`
  },
  contractor: {
    url: 'trueframecontracting.ca', style: 'Industrial grid', label: 'Contracting', className: 'template-contractor',
    markup: `<div class="t-build-shell"><aside class="t-build-side"><strong>TF</strong><span>EST. 2018</span><b>CALGARY</b></aside><div class="t-build-main"><nav><strong>TRUEFRAME / CONTRACTING</strong><span>PROJECTS&nbsp;&nbsp; SERVICES&nbsp;&nbsp; CONTACT</span></nav><header><small>RENOVATIONS + REPAIRS</small><h3>BUILT RIGHT.<br>NO RUNAROUND.</h3><p>Clear timelines. Careful work. A home you’re proud to live in.</p></header><div class="t-build-projects"><article><span>01 / KITCHENS</span><b>MAKE THE<br>ROOM WORK</b></article><article><span>02 / BASEMENTS</span><b>USE EVERY<br>SQUARE FOOT</b></article></div></div></div>`
  },
  groomer: {
    url: 'gooddoggrooming.ca', style: 'Playful bento', label: 'Pet grooming', className: 'template-groomer',
    markup: `<nav class="t-pet-nav"><strong>GOOD DOG!</strong><span>Services&nbsp;&nbsp; First visit&nbsp;&nbsp; <b>Book now</b></span></nav><div class="t-pet-grid"><section class="t-pet-hero"><small>CALM, CAREFUL GROOMING</small><h3>Fresh coat.<br><em>Happy tail.</em></h3><span class="t-cta">Find a time →</span><i>GOOD<br>DOG<br>CLUB</i></section><aside class="t-pet-services"><span>POPULAR</span><strong>THE FULL<br>GROOM</strong><p>Bath · trim · nails · finishing</p><b>From $75</b></aside><aside class="t-pet-review"><strong>“Patient from hello to pickup.”</strong><span>— Milo’s person</span></aside><aside class="t-pet-note"><span>NEW CLIENT?</span><strong>Start here ↗</strong></aside></div>`
  },
  bakery: {
    url: 'madebymae.ca', style: 'Boutique serif', label: 'Bakery', className: 'template-bakery',
    markup: `<nav class="t-bake-nav"><span>Our cakes</span><strong>MADE BY MAE<small>BAKESHOP</small></strong><span>Order yours</span></nav><div class="t-bake-hero"><small>SMALL-BATCH · MADE IN CALGARY</small><h3>Baked for your<br><em>best moments.</em></h3><p>Custom cakes and treats made slowly, thoughtfully, and just for you.</p><span class="t-cta">Begin an order</span><div class="t-bake-seal">MADE<br>WITH<br>CARE</div></div><div class="t-bake-menu"><span>THIS WEEK</span><p><b>Brown butter cookies</b><i>$18 / six</i></p><p><b>Celebration cake</b><i>from $68</i></p><p><b>Lemon loaf</b><i>$24</i></p></div>`
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
