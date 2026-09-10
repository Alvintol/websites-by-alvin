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
  editorial: {
    url: 'basiceditorial.createdbyalvin.com',
    embedUrl: 'https://basiceditorial.createdbyalvin.com/',
    style: 'Editorial',
    label: 'Editorial',
    className: 'template-editorial'
  },

  detailer: {
    url: 'basicelectricshowcase.createdbyalvin.com',
    embedUrl: 'https://basicelectricshowcase.createdbyalvin.com/',
    style: 'Electric showcase',
    label: 'Mobile detailing',
    className: 'template-detailer'
  },

  contractor: {
    url: 'neonmodular.createdbyalvin.com',
    embedUrl: 'https://neonmodular.createdbyalvin.com/',
    style: 'Neon modular',
    label: 'Contracting',
    className: 'template-contractor'
  },

  groomer: {
    url: 'basicatmospheric.createdbyalvin.com',
    embedUrl: 'https://basicatmospheric.createdbyalvin.com/',
    style: 'Atmospheric retreat',
    label: 'Pet grooming',
    className: 'template-groomer'
  }
};

const demoSite = document.querySelector('[data-demo-site]');
const demoUrl = document.querySelector('[data-demo-url]');
const demoStyle = document.querySelector('[data-demo-style]');
const demoCount = document.querySelector('[data-demo-count]');

const exampleOrder = Object.keys(examples);

/*
 * =========================================================
 * EXAMPLE STATE
 * =========================================================
 *
 * This is essentially the vanilla-JS equivalent of:
 *
 * const [selectedExample, setSelectedExample] = useState(...)
 *
 */
const exampleState = {
  selected: exampleOrder[0]
};

/*
 * =========================================================
 * SET EXAMPLE
 * =========================================================
 *
 * This is the equivalent of:
 *
 * setSelectedExample(key)
 *
 * Every click updates state first.
 * renderExample() then renders whatever is currently
 * in state.
 */
const setExample = (key) => {
  if (!examples[key]) return;

  exampleState.selected = key;
  renderExample();
};

/*
 * =========================================================
 * RENDER
 * =========================================================
 */
const renderExample = (animate = true) => {
  const key = exampleState.selected;
  const next = examples[key];

  const currentIndex = exampleOrder.indexOf(key);

  /*
   * Update buttons
   */
  document.querySelectorAll('[data-example]').forEach((item) => {
    const active = item.dataset.example === key;

    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });

  /*
   * Update browser information
   */
  demoUrl.textContent = next.url;
  demoStyle.textContent = next.style;

  demoCount.textContent =
    `${String(currentIndex + 1).padStart(2, '0')} / ${String(exampleOrder.length).padStart(2, '0')}`;

  demoSite.className = `browser-site ${next.className}`;

  demoSite.setAttribute(
    'aria-label',
    `${next.label} live website preview`
  );

  /*
   * Animate the browser frame.
   */
  if (animate) {
    demoSite.animate(
      [
        {
          opacity: 0,
          transform: 'translateX(14px) scale(.985)'
        },
        {
          opacity: 1,
          transform: 'none'
        }
      ],
      {
        duration: reduceMotion ? 0 : 300,
        easing: 'cubic-bezier(.2,.8,.2,1)'
      }
    );
  }

  /*
   * =======================================================
   * IMPORTANT
   * =======================================================
   *
   * Don't modify the existing iframe.
   *
   * Destroy the entire contents of the preview and create
   * a brand-new iframe every time.
   */
  demoSite.replaceChildren();

  const iframe = document.createElement('iframe');

  iframe.className = 'example-frame';

  iframe.title = `${next.label} live website preview`;

  iframe.setAttribute('scrolling', 'yes');

  iframe.setAttribute(
    'referrerpolicy',
    'strict-origin-when-cross-origin'
  );

  /*
   * Use eager loading because these are interactive
   * portfolio examples rather than below-the-fold content.
   */
  iframe.loading = 'eager';

  /*
   * Cache-bust the iframe URL.
   *
   * This is the important part if the browser is aggressively
   * reusing a previous iframe navigation.
   */
  const separator = next.embedUrl.includes('?') ? '&' : '?';

  iframe.src =
    `${next.embedUrl}${separator}preview=${Date.now()}`;

  /*
   * Add it only after all properties have been configured.
   */
  demoSite.appendChild(iframe);
};

/*
 * =========================================================
 * EXAMPLE BUTTONS
 * =========================================================
 */
document.querySelectorAll('[data-example]').forEach((button) => {
  button.addEventListener('click', () => {
    setExample(button.dataset.example);
  });
});

/*
 * =========================================================
 * PREVIOUS
 * =========================================================
 */
document
  .querySelector('[data-demo-prev]')
  .addEventListener('click', () => {
    const currentIndex = exampleOrder.indexOf(
      exampleState.selected
    );

    const previousIndex =
      (currentIndex - 1 + exampleOrder.length) %
      exampleOrder.length;

    setExample(exampleOrder[previousIndex]);
  });

/*
 * =========================================================
 * NEXT
 * =========================================================
 */
document
  .querySelector('[data-demo-next]')
  .addEventListener('click', () => {
    const currentIndex = exampleOrder.indexOf(
      exampleState.selected
    );

    const nextIndex =
      (currentIndex + 1) % exampleOrder.length;

    setExample(exampleOrder[nextIndex]);
  });

/*
 * Initial render
 */
renderExample(false);


// Example selector buttons
document
  .querySelectorAll('[data-example]')
  .forEach((button) => {
    button.addEventListener('click', () => {
      renderExample(button.dataset.example);
    });
  });

// Previous example
document
  .querySelector('[data-demo-prev]')
  .addEventListener('click', () => {
    const previousIndex =
      (currentExample - 1 + exampleOrder.length) % exampleOrder.length;

    renderExample(exampleOrder[previousIndex]);
  });

// Next example
document
  .querySelector('[data-demo-next]')
  .addEventListener('click', () => {
    const nextIndex =
      (currentExample + 1) % exampleOrder.length;

    renderExample(exampleOrder[nextIndex]);
  });

// Initial example
renderExample(exampleOrder[0], false);



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
