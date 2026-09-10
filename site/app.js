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
 * This is our vanilla-JS equivalent of:
 *
 * const [selectedExample, setSelectedExample] = useState(...)
 *
 */
const exampleState = {
  selected: exampleOrder[0]
};

/*
 * Keep every iframe alive once it has been created.
 *
 * Map:
 * editorial  -> editorial iframe
 * detailer   -> detailer iframe
 * contractor -> contractor iframe
 * groomer    -> groomer iframe
 *
 * We don't destroy these when switching examples.
 */
const exampleFrames = new Map();

/*
 * =========================================================
 * CREATE / GET IFRAME
 * =========================================================
 */
const getExampleFrame = (key) => {
  if (exampleFrames.has(key)) {
    return exampleFrames.get(key);
  }

  const example = examples[key];

  const iframe = document.createElement('iframe');

  iframe.className = 'example-frame';
  iframe.title = `${example.label} live website preview`;

  iframe.setAttribute('scrolling', 'yes');

  iframe.setAttribute(
    'referrerpolicy',
    'strict-origin-when-cross-origin'
  );

  iframe.loading = 'eager';

  /*
   * Important:
   *
   * Give every example its own iframe.
   *
   * The unique query parameter also prevents the browser
   * from treating this as the same navigation as another
   * previously loaded preview.
   */
  const separator = example.embedUrl.includes('?') ? '&' : '?';

  iframe.src =
    `${example.embedUrl}${separator}preview=${key}`;

  /*
   * All frames start hidden.
   */
  iframe.hidden = true;

  /*
   * Store the iframe before adding it to the page.
   */
  exampleFrames.set(key, iframe);

  demoSite.appendChild(iframe);

  return iframe;
};

/*
 * =========================================================
 * SHOW EXAMPLE
 * =========================================================
 */
const showExample = (key) => {
  /*
   * Hide every existing iframe.
   */
  exampleFrames.forEach((iframe, frameKey) => {
    iframe.hidden = frameKey !== key;
  });

  /*
   * If this example hasn't been loaded yet,
   * create its iframe.
   */
  const iframe = getExampleFrame(key);

  /*
   * Make absolutely sure the selected frame is visible.
   */
  iframe.hidden = false;

  /*
   * Bring it to the front.
   */
  iframe.style.zIndex = '2';

  /*
   * Put all other frames behind it.
   */
  exampleFrames.forEach((otherFrame, frameKey) => {
    if (frameKey !== key) {
      otherFrame.style.zIndex = '1';
    }
  });
};

/*
 * =========================================================
 * RENDER EXAMPLE
 * =========================================================
 */
const renderExample = (animate = true) => {
  const key = exampleState.selected;
  const next = examples[key];

  const currentIndex = exampleOrder.indexOf(key);

  /*
   * Update selected buttons.
   */
  document.querySelectorAll('[data-example]').forEach((item) => {
    const active = item.dataset.example === key;

    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });

  /*
   * Update browser chrome.
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
   * Animate the browser container.
   */
  if (animate) {
    demoSite.animate(
      [
        {
          opacity: .35,
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
   * Show the selected iframe.
   *
   * Crucially, we DON'T destroy the iframe.
   */
  showExample(key);
};

/*
 * =========================================================
 * SET EXAMPLE
 * =========================================================
 *
 * Equivalent to React's:
 *
 * setSelectedExample(key)
 *
 */
const setExample = (key) => {
  if (!examples[key]) return;

  exampleState.selected = key;

  renderExample();
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
 * =========================================================
 * INITIAL RENDER
 * =========================================================
 */
renderExample(false);

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
