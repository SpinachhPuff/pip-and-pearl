const MENU = [
  {
    id: 'cloud-matcha',
    name: 'Cloud Matcha Latte',
    category: 'matcha',
    tag: 'BEST LOVED',
    description: 'Ceremonial matcha with a soft oat milk cloud.',
    price: 135,
    bg: '#e5e7c5',
    drink: '#AFC38D',
    wave: '#F8F4E8',
    garnish: 'matcha-cloud',
    defaultToppings: ['Cream cheese cloud']
  },
  {
    id: 'brown-sugar',
    name: 'Brown Sugar Hug',
    category: 'milk',
    tag: 'COZY FAVORITE',
    description: 'Creamy black tea, warm brown sugar and chewy pearls.',
    price: 125,
    bg: '#ece3d3',
    drink: '#C8A984',
    wave: '#F5E8D5',
    garnish: 'tiger-swirl',
    defaultToppings: ['Brown sugar pearls']
  },
  {
    id: 'berry-blush',
    name: 'Berry Blush Tea',
    category: 'fruit',
    tag: 'FRUITY & FRESH',
    description: 'Jasmine tea with strawberry, raspberry and a little sparkle.',
    price: 115,
    bg: '#f5dfe3',
    drink: '#ECAEBC',
    wave: '#FADCE3',
    garnish: 'berry',
    defaultToppings: ['Lychee jelly']
  },
  {
    id: 'honey-oat',
    name: 'Honey Oat Milk Tea',
    category: 'milk',
    tag: 'SWEET & SOFT',
    description: 'Smooth oolong, oat milk and a golden honey finish.',
    price: 120,
    bg: '#eee7d8',
    drink: '#D9C29C',
    wave: '#F8EEDB',
    garnish: 'honey',
    defaultToppings: []
  },
  {
    id: 'peach-garden',
    name: 'Peach Garden Tea',
    category: 'fruit',
    tag: 'SUNNY SIP',
    description: 'Fragrant green tea, juicy peach and tiny floral notes.',
    price: 110,
    bg: '#eedfd9',
    drink: '#E8C2A2',
    wave: '#F8E7CD',
    garnish: 'peach',
    defaultToppings: ['Aloe vera']
  },
  {
    id: 'matcha-strawberry',
    name: 'Matcha Strawberry',
    category: 'matcha',
    tag: 'A LITTLE TREAT',
    description: 'Earthy matcha meets strawberry milk and pink foam.',
    price: 145,
    bg: '#e9ead0',
    drink: '#AFC38D',
    wave: '#F3C3CE',
    garnish: 'berry',
    defaultToppings: ['Brown sugar pearls']
  },
  {
    id: 'classic-jasmine',
    name: 'Jasmine Milk Tea',
    category: 'milk',
    tag: 'THE CLASSIC',
    description: 'Floral jasmine tea with silky milk, simple and lovely.',
    price: 105,
    bg: '#dce6f0',
    drink: '#D5C7A7',
    wave: '#F6EFE1',
    garnish: 'blossom',
    defaultToppings: []
  },
  {
    id: 'citrus-daydream',
    name: 'Citrus Daydream',
    category: 'fruit',
    tag: 'BRIGHT & LIGHT',
    description: 'Lemon, orange and green tea for a sunny little lift.',
    price: 115,
    bg: '#ece9c2',
    drink: '#E8D394',
    wave: '#F9ECBC',
    garnish: 'citrus',
    defaultToppings: ['Aloe vera']
  }
];

const TOPPINGS = [
  { name: 'Brown sugar pearls', price: 15 },
  { name: 'Lychee jelly', price: 15 },
  { name: 'Aloe vera', price: 15 },
  { name: 'Cream cheese cloud', price: 20 }
];

const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwamo1Qv33xLQahf5obIc4fbO5VmZPImID5mdCPxqd2h4M13D1h9CNZcFbLduxyvv8D/exec';
const $ = s => document.querySelector(s);
const money = n => `฿${n}`;

let cart = JSON.parse(sessionStorage.getItem('pipPearlCart') || '[]');
let activeProduct = null;
let heroDrinkId = 'cloud-matcha';
let custom = { size: 'Regular', sweetness: '50%', ice: 'Regular', milk: 'Whole milk', toppings: [], qty: 1 };
let currentFilter = 'all';

const SHAKE_NOTES = [
  'pearls bounced! 10/10 chewiness',
  'swirled to perfection',
  'a happy little slosh!',
  'ready for your straw'
];

function renderIllustratedCup(product, opts = {}) {
  const {
    width = 148,
    height = 176,
    toppings = product.defaultToppings || [],
    ice = 'Regular',
    milk = 'Whole milk',
    size = 'Regular',
    sweetness = ''
  } = opts;

  const uid = `${product.id}-${Math.random().toString(36).slice(2, 7)}`;
  const isLarge = size === 'Large';
  const topY = isLarge ? 48 : 56;
  const botY = 172;
  const waveY = isLarge ? 92 : 98;
  const topFill = milk === 'Oat milk' ? '#F3EAD8' : product.wave;

  const iceMarkup = ice === 'No ice' ? '' : `
    <g opacity="0.72" stroke="#292A24" stroke-width="2" stroke-linejoin="round" fill="#FFFFFF">
      <rect x="46" y="${waveY - 6}" width="15" height="14" rx="3" transform="rotate(-12 53 ${waveY})"/>
      <rect x="82" y="${waveY - 3}" width="14" height="13" rx="3" transform="rotate(14 89 ${waveY + 3})"/>
      ${ice === 'Regular' ? `<rect x="65" y="${waveY + 6}" width="13" height="12" rx="3" transform="rotate(-5 71 ${waveY + 12})"/>` : ''}
    </g>
  `;

  const garnishMarkup = (() => {
    if (product.garnish === 'berry') {
      return `<g transform="translate(95 ${topY + 12}) rotate(12)">
        <path d="M0 0c6-5 14 0 11 9-2 6-8 10-11 11-3-1-9-5-11-11-3-9 5-14 11-9z" fill="#E87A90" stroke="#292A24" stroke-width="2"/>
        <path d="M-5-2l5 3 5-3" fill="none" stroke="#6B8E55" stroke-width="2" stroke-linecap="round"/>
      </g>`;
    }
    if (product.garnish === 'citrus' || product.garnish === 'peach') {
      const fill = product.garnish === 'citrus' ? '#F5C95B' : '#F2A985';
      return `<g transform="translate(94 ${topY + 14}) rotate(18)">
        <circle cx="0" cy="0" r="11" fill="${fill}" stroke="#292A24" stroke-width="2"/>
        <circle cx="0" cy="0" r="7" fill="#FFF7DF"/>
      </g>`;
    }
    if (product.garnish === 'blossom') {
      return `<g transform="translate(106 ${topY - 8})">
        <path d="M0-9q4-9 8 0 9-3 3 6 3 9-6 7-5 7-8-3-8-3-3-7z" fill="#F5DDE1" stroke="#292A24" stroke-width="2"/>
        <circle cx="1" cy="-1" r="2" fill="#D4B173"/>
      </g>`;
    }
    if (product.garnish === 'tiger-swirl') {
      return `<path d="M40 124q14 7 24-2m26 10q-12 8-22 1" fill="none" stroke="#7A5536" stroke-width="3.2" stroke-linecap="round" opacity="0.65"/>`;
    }
    return '';
  })();

  const toppingsMarkup = toppings.map(name => {
    if (name.includes('pearls')) {
      return `<g class="cup-topping-item" fill="#6D5643" stroke="#292A24" stroke-width="2">
        <circle cx="52" cy="154" r="5.5"/>
        <circle cx="66" cy="160" r="5.5"/>
        <circle cx="81" cy="156" r="5.5"/>
        <circle cx="93" cy="148" r="5"/>
        <circle cx="60" cy="143" r="4.8"/>
      </g>`;
    }
    if (name.includes('jelly')) {
      return `<g class="cup-topping-item" fill="#E3EEF6" stroke="#292A24" stroke-width="1.9" stroke-linejoin="round">
        <rect x="49" y="138" width="11" height="10" rx="2" transform="rotate(-14 54 143)"/>
        <rect x="74" y="143" width="11" height="10" rx="2" transform="rotate(12 79 148)"/>
        <rect x="62" y="151" width="10" height="9" rx="2" transform="rotate(-4 67 155)"/>
      </g>`;
    }
    if (name.includes('Aloe')) {
      return `<g class="cup-topping-item" fill="#C9DDA2" stroke="#292A24" stroke-width="1.9" stroke-linejoin="round">
        <path d="M48 134q9-3 12 6-9 3-12-6z"/>
        <path d="M78 130q10-2 11 7-10 2-11-7z"/>
        <path d="M64 142q9-2 10 6-9 3-10-6z"/>
      </g>`;
    }
    if (name.includes('Cream cheese')) {
      return `<g class="cup-topping-item">
        <path d="M37 ${topY + 12}q16-10 35-3t35 2l-3 19q-17 7-34 0t-31 0z" fill="#FFFDF7" stroke="#292A24" stroke-width="2.1" stroke-linejoin="round"/>
      </g>`;
    }
    return '';
  }).join('');

  const sweetBadge = sweetness ? `
    <g transform="translate(86 112) rotate(-7)">
      <rect x="-20" y="-10" width="40" height="18" rx="6" fill="#FFFDF8" stroke="#292A24" stroke-width="1.6"/>
      <text x="0" y="3" text-anchor="middle" font-family="Patrick Hand, cursive" font-size="11" fill="#292A24">${sweetness}</text>
    </g>
  ` : '';

  return `
    <svg viewBox="0 0 144 188" width="${width}" height="${height}" role="img" aria-label="${product.name} illustration">
      <defs>
        <clipPath id="cup-clip-${uid}">
          <path d="M34 ${topY}q38-13 76 0l-11 ${botY - topY}q-27 13-54 0z"/>
        </clipPath>
      </defs>

      <ellipse cx="72" cy="179" rx="34" ry="4.5" fill="#292A24" opacity="0.13"/>

      <path d="M71 ${topY - 4}L83 14" fill="none" stroke="#292A24" stroke-width="8" stroke-linecap="round"/>
      <path d="M71 ${topY - 4}L83 14" fill="none" stroke="#A8B988" stroke-width="4" stroke-linecap="round"/>

      <path d="M34 ${topY}q38-13 76 0l-11 ${botY - topY}q-27 13-54 0z" fill="${topFill}"/>

      <g clip-path="url(#cup-clip-${uid})">
        <path d="M28 ${waveY}q22-10 44 0t44-2v82H28z" fill="${product.drink}"/>
        <path d="M28 ${waveY}q22-10 44 0t44-2" fill="none" stroke="#292A24" stroke-width="2" opacity="0.28"/>
        ${iceMarkup}
        ${garnishMarkup}
        ${toppingsMarkup}
      </g>

      <path d="M34 ${topY}q38-13 76 0l-11 ${botY - topY}q-27 13-54 0z" fill="none" stroke="#292A24" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M30 ${topY}q42 13 84 0" fill="none" stroke="#292A24" stroke-width="3.5" stroke-linecap="round"/>

      <g class="cup-eyes-rest" fill="none" stroke="#292A24" stroke-width="2.4" stroke-linecap="round">
        <path d="M56 ${waveY - 12}q3.5-4.5 7 0"/>
        <path d="M81 ${waveY - 12}q3.5-4.5 7 0"/>
      </g>
      <g class="cup-eyes-happy" fill="none" stroke="#292A24" stroke-width="2.4" stroke-linecap="round">
        <path d="M56 ${waveY - 11}q3.5-6 7 0"/>
        <path d="M81 ${waveY - 11}q3.5-6 7 0"/>
      </g>
      <path d="M67 ${waveY - 4}q5 6 10 0" fill="none" stroke="#292A24" stroke-width="2.4" stroke-linecap="round"/>
      <ellipse cx="53" cy="${waveY - 5}" rx="3.8" ry="2" fill="#F0A5B2" opacity="0.8"/>
      <ellipse cx="91" cy="${waveY - 5}" rx="3.8" ry="2" fill="#F0A5B2" opacity="0.8"/>

      ${sweetBadge}
    </svg>
  `;
}

function toppingArt(name) {
  if (name.includes('pearls')) {
    return '<svg viewBox="0 0 36 36" width="24" height="24" aria-hidden="true"><circle cx="12" cy="22" r="5" fill="#70604F" stroke="#292A24" stroke-width="2"/><circle cx="23" cy="23" r="5" fill="#70604F" stroke="#292A24" stroke-width="2"/><circle cx="18" cy="13" r="4.5" fill="#70604F" stroke="#292A24" stroke-width="2"/></svg>';
  }
  if (name.includes('jelly')) {
    return '<svg viewBox="0 0 36 36" width="24" height="24" aria-hidden="true"><rect x="8" y="13" width="11" height="10" rx="2.5" transform="rotate(-12 13 18)" fill="#DCEAF4" stroke="#292A24" stroke-width="2"/><rect x="18" y="15" width="10" height="9" rx="2.5" transform="rotate(14 23 19)" fill="#DCEAF4" stroke="#292A24" stroke-width="2"/></svg>';
  }
  if (name.includes('Aloe')) {
    return '<svg viewBox="0 0 36 36" width="24" height="24" aria-hidden="true"><path d="M18 28Q11 17 18 7q8 10 0 21z" fill="#C4D69E" stroke="#292A24" stroke-width="2" stroke-linejoin="round"/><path d="M13 25Q7 20 8 13q7 2 5 12z" fill="#C4D69E" stroke="#292A24" stroke-width="2" stroke-linejoin="round"/></svg>';
  }
  return '<svg viewBox="0 0 36 36" width="24" height="24" aria-hidden="true"><path d="M7 23q-1-6 5-7 2-6 8-4 4-5 8 1 6 0 5 7 2 7-6 7H13q-6 0-6-4z" fill="#FFFDF6" stroke="#292A24" stroke-width="2" stroke-linejoin="round"/></svg>';
}

/* Interactive Hero Stage */
function renderHeroStage() {
  const p = MENU.find(item => item.id === heroDrinkId) || MENU[0];
  $('#heroDrinkTag').textContent = p.tag;
  $('#heroCupTrigger').style.setProperty('--stage-tint', p.bg);
  $('#heroCupMount').innerHTML = renderIllustratedCup(p, {
    width: 196,
    height: 236,
    toppings: p.defaultToppings,
    ice: 'Regular'
  });
  document.querySelectorAll('[data-hero-drink]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.heroDrink === p.id);
  });
}

function triggerHeroShake() {
  const trigger = $('#heroCupTrigger');
  trigger.classList.remove('is-shaking');
  void trigger.offsetWidth;
  trigger.classList.add('is-shaking');

  const sparkles = $('#heroSparkles');
  const marks = [
    { x: '24%', y: '28%', color: '#F5DDE1' },
    { x: '73%', y: '24%', color: '#AFC38D' },
    { x: '27%', y: '66%', color: '#D4B173' },
    { x: '74%', y: '62%', color: '#F5DDE1' }
  ];
  sparkles.innerHTML = marks.map((m, idx) => `
    <svg class="mini-sparkle" style="left:${m.x};top:${m.y};animation-delay:${idx * 45}ms" width="18" height="18" viewBox="0 0 20 20">
      <path d="M10 2v16M2 10h16" stroke="#292A24" stroke-width="2" stroke-linecap="round"/>
      <circle cx="10" cy="10" r="3" fill="${m.color}"/>
    </svg>
  `).join('');

  const note = SHAKE_NOTES[Math.floor(Math.random() * SHAKE_NOTES.length)];
  $('#heroReaction').textContent = note;
}

/* Menu Grid */
function renderMenu() {
  const items = MENU.filter(p => currentFilter === 'all' || p.category === currentFilter);
  $('#menuGrid').innerHTML = items.map(p => `
    <article class="product-card">
      <button class="product-image" style="background:${p.bg}" data-product="${p.id}" aria-label="Customize ${p.name}">
        ${renderIllustratedCup(p, { width: 136, height: 166, toppings: p.defaultToppings })}
      </button>
      <div class="product-info">
        <div class="product-tag">${p.tag}</div>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="product-bottom">
          <span class="price">from ${money(p.price)}</span>
          <button class="add-button" data-product="${p.id}" aria-label="Customize ${p.name}">+</button>
        </div>
      </div>
    </article>
  `).join('');
}

function saveCart() {
  sessionStorage.setItem('pipPearlCart', JSON.stringify(cart));
  $('#bagCount').textContent = cart.reduce((n, i) => n + i.qty, 0);
}

function showDrawer(id) {
  $('#overlay').hidden = false;
  const drawer = $('#' + id);
  drawer.hidden = false;
  drawer.classList.remove('is-scrolled');
  document.body.style.overflow = 'hidden';
  $('#' + id + ' .close').focus();
}

function closeDrawers() {
  $('#overlay').hidden = true;
  $('#customDrawer').hidden = true;
  $('#cartDrawer').hidden = true;
  document.body.style.overflow = '';
  activeProduct = null;
}

function toast(s) {
  const el = $('#toast');
  el.textContent = s;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 2400);
}

function unitPrice() {
  return activeProduct.price
    + (custom.size === 'Large' ? 20 : 0)
    + (custom.milk === 'Oat milk' ? 15 : 0)
    + custom.toppings.reduce((n, t) => n + TOPPINGS.find(x => x.name === t).price, 0);
}

function choices(key, values) {
  return `<div class="choices">${values.map(v => `
    <button class="choice ${custom[key] === v ? 'selected' : ''}" data-option="${key}" data-value="${v}" aria-pressed="${custom[key] === v}">${v}</button>
  `).join('')}</div>`;
}

function toppingSummaryText() {
  if (!custom.toppings.length) return 'No extra toppings yet';
  return `${custom.toppings.length} topping${custom.toppings.length > 1 ? 's' : ''}: ${custom.toppings.join(', ')}`;
}

function shakeDrawerCup() {
  const wrap = $('#drawerCupWrap');
  if (!wrap) return;
  wrap.classList.remove('is-shaking');
  void wrap.offsetWidth;
  wrap.classList.add('is-shaking');
}

function renderCustom() {
  const p = activeProduct;
  const toppingChoices = TOPPINGS.map(t => `
    <button class="topping-choice ${custom.toppings.includes(t.name) ? 'selected' : ''}" data-topping="${t.name}" aria-pressed="${custom.toppings.includes(t.name)}">
      <span class="ingredient-icon">${toppingArt(t.name)}</span>
      <span class="topping-name">${t.name}</span>
      <span class="topping-price">+${money(t.price)} ${custom.toppings.includes(t.name) ? '✓' : ''}</span>
    </button>
  `).join('');

  $('#customContent').innerHTML = `
    <div class="drawer-stage" style="background:${p.bg}">
      <div class="drawer-stage-top">
        <span class="drawer-note">live cup preview</span>
        <button class="drawer-shake-btn" id="drawerShakeBtn" type="button">Shake cup</button>
      </div>
      <div class="drawer-stage-body">
        <div class="drawer-cup-wrap" id="drawerCupWrap">
          ${renderIllustratedCup(p, {
            width: 152,
            height: 178,
            toppings: custom.toppings,
            ice: custom.ice,
            milk: custom.milk,
            size: custom.size,
            sweetness: custom.sweetness
          })}
        </div>
        <div class="drawer-stage-meta">
          <div class="drawer-docked-title">${p.name}</div>
          <span class="drawer-live-summary" id="drawerLiveSummary" aria-live="polite">
            ${custom.size} · ${custom.sweetness} sweet · ${custom.ice} ice · ${custom.milk}
          </span>
          <span class="drawer-topping-pill" id="drawerToppingPill">${toppingSummaryText()}</span>
        </div>
      </div>
    </div>

    <div class="drawer-scroll-area" id="drawerScrollArea">
      <div class="eyebrow">MAKE IT YOURS</div>
      <h2 id="customTitle">${p.name}</h2>
      <p class="sub">${p.description}</p>

      <div class="option-group"><h3>Size <small>(Large +฿20)</small></h3>${choices('size', ['Regular', 'Large'])}</div>
      <div class="option-group"><h3>Sweetness</h3>${choices('sweetness', ['0%', '25%', '50%', '75%', '100%'])}</div>
      <div class="option-group"><h3>Ice</h3>${choices('ice', ['No ice', 'Less', 'Regular'])}</div>
      <div class="option-group"><h3>Milk <small>(Oat milk +฿15)</small></h3>${choices('milk', ['Whole milk', 'Oat milk'])}</div>
      <div class="option-group">
        <h3>Pick your little extras <small>watch them drop into your pinned cup above!</small></h3>
        ${toppingChoices}
      </div>
    </div>

    <div class="drawer-bottom">
      <div class="qty">
        <button data-qty="-1" aria-label="Decrease quantity">−</button>
        <span>${custom.qty}</span>
        <button data-qty="1" aria-label="Increase quantity">+</button>
      </div>
      <button class="dark-button" id="addToBag">Add to bag · ${money(unitPrice() * custom.qty)}</button>
    </div>
  `;

  const scrollArea = $('#drawerScrollArea');
  scrollArea.addEventListener('scroll', () => {
    $('#customDrawer').classList.toggle('is-scrolled', scrollArea.scrollTop > 28);
  });
}

function updateCustom(animateCup = false) {
  const wrap = $('#drawerCupWrap');
  wrap.innerHTML = renderIllustratedCup(activeProduct, {
    width: 152,
    height: 178,
    toppings: custom.toppings,
    ice: custom.ice,
    milk: custom.milk,
    size: custom.size,
    sweetness: custom.sweetness
  });
  $('#drawerLiveSummary').textContent = `${custom.size} · ${custom.sweetness} sweet · ${custom.ice} ice · ${custom.milk}`;
  $('#drawerToppingPill').textContent = toppingSummaryText();

  if (animateCup) shakeDrawerCup();

  $('#customContent').querySelectorAll('[data-option]').forEach(button => {
    const selected = custom[button.dataset.option] === button.dataset.value;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  $('#customContent').querySelectorAll('[data-topping]').forEach(button => {
    const selected = custom.toppings.includes(button.dataset.topping);
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
    const price = TOPPINGS.find(t => t.name === button.dataset.topping).price;
    button.querySelector('.topping-price').textContent = `+${money(price)} ${selected ? '✓' : ''}`;
  });
  $('#customContent .qty span').textContent = custom.qty;
  $('#addToBag').textContent = `Add to bag · ${money(unitPrice() * custom.qty)}`;
}

function openCustom(id) {
  activeProduct = MENU.find(p => p.id === id);
  custom = {
    size: 'Regular',
    sweetness: '50%',
    ice: 'Regular',
    milk: 'Whole milk',
    toppings: [...(activeProduct.defaultToppings || [])],
    qty: 1
  };
  renderCustom();
  showDrawer('customDrawer');
}

function itemText(i) {
  return [i.size, `${i.sweetness} sweet`, `${i.ice} ice`, i.milk, ...i.toppings].join(' · ');
}

function renderCart() {
  const count = cart.reduce((n, i) => n + i.qty, 0);
  const total = cart.reduce((n, i) => n + i.unitPrice * i.qty, 0);

  $('#cartContent').innerHTML = `
    <div class="bag-title">
      <div class="eyebrow">YOUR LITTLE ORDER</div>
      <h2 id="cartTitle">Your bag</h2>
      <p class="sub">${count} lovely ${count === 1 ? 'sip' : 'sips'} waiting for you</p>
    </div>
    ${cart.length ? `
      ${cart.map((i, index) => {
        const p = MENU.find(x => x.id === i.id);
        return `
          <div class="cart-item">
            <div class="cart-thumb" style="background:${p.bg}">
              ${renderIllustratedCup(p, { width: 52, height: 64, toppings: i.toppings, ice: i.ice, milk: i.milk, size: i.size })}
            </div>
            <div class="cart-item-info">
              <h3>${p.name} × ${i.qty}</h3>
              <p>${itemText(i)}</p>
              <button data-remove="${index}">Remove</button>
            </div>
            <strong>${money(i.unitPrice * i.qty)}</strong>
          </div>
        `;
      }).join('')}
      <div class="summary"><span>Subtotal</span><strong>${money(total)}</strong></div>
      <div class="summary"><span>Pickup</span><strong>Free</strong></div>
      <div class="summary"><strong>Total</strong><strong>${money(total)}</strong></div>
      <div class="checkout-form">
        <label>Your name for pickup
          <input id="customerName" maxlength="60" placeholder="What should we call out?" autocomplete="name" required>
        </label>
        <label>Anything we should know? <small>(optional)</small>
          <textarea id="orderNote" maxlength="300" placeholder="A little note for us"></textarea>
        </label>
        <button class="dark-button" id="placeOrder" style="width:100%;margin-top:12px">
          ${SHEET_ENDPOINT ? 'Place pickup order' : 'Place demo order'} · ${money(total)}
        </button>
        <p class="demo-note">
          ${SHEET_ENDPOINT
            ? 'Your order will be sent to the tea house. Payment is handled at pickup.'
            : 'Demo checkout: no order is sent to a shop or Google Sheet yet. Payment is not collected.'}
        </p>
      </div>
    ` : `
      <div class="empty-bag">
        <h2>Something's missing...</h2>
        <p>Your bag is waiting for a lovely drink.</p>
        <button class="dark-button" id="browseMenu">Explore the menu</button>
      </div>
    `}
  `;
}

async function placeOrder() {
  const name = $('#customerName').value.trim();
  if (!name) {
    $('#customerName').focus();
    toast('Add a name for pickup first');
    return;
  }
  const note = $('#orderNote').value.trim();
  const order = {
    orderId: 'PP-' + Date.now().toString(36).toUpperCase(),
    createdAt: new Date().toISOString(),
    customerName: name,
    note,
    total: cart.reduce((n, i) => n + i.unitPrice * i.qty, 0),
    items: cart
  };

  const button = $('#placeOrder');
  button.disabled = true;
  button.textContent = 'Placing your order…';

  try {
    if (SHEET_ENDPOINT) {
      const response = await fetch(SHEET_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(order)
      });
      if (!response.ok) throw new Error('Order could not be saved');
      const result = await response.json();
      if (result.status !== 'success') throw new Error(result.message || 'Order could not be saved');
    } else {
      sessionStorage.setItem('pipPearlDemoOrder', JSON.stringify(order));
    }
    cart = [];
    saveCart();
    $('#cartContent').innerHTML = `
      <div class="receipt">
        <div class="eyebrow">${SHEET_ENDPOINT ? 'ORDER RECEIVED' : 'DEMO ORDER COMPLETE'}</div>
        <h2>Thank you, ${escapeHtml(name)}!</h2>
        <p>
          ${SHEET_ENDPOINT ? 'We have your order. Please pay at pickup.' : 'Your order was saved in this browser session only. No shop received it.'}
          <br>Order reference: <strong>${order.orderId}</strong>
        </p>
        <button class="dark-button" id="newOrder">Make another cup</button>
      </div>
    `;
  } catch (e) {
    button.disabled = false;
    button.textContent = `Place pickup order · ${money(order.total)}`;
    toast(e.message || 'Could not place order. Please try again.');
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

document.addEventListener('click', e => {
  const heroDrinkBtn = e.target.closest('[data-hero-drink]');
  if (heroDrinkBtn) {
    heroDrinkId = heroDrinkBtn.dataset.heroDrink;
    renderHeroStage();
    triggerHeroShake();
  }
  if (e.target.closest('#heroCupTrigger') || e.target.closest('#shakeHeroBtn')) {
    triggerHeroShake();
  }
  if (e.target.closest('#heroCustomizeBtn')) {
    openCustom(heroDrinkId);
  }
  if (e.target.closest('#whiskBtn')) {
    const btn = e.target.closest('#whiskBtn');
    btn.classList.remove('swirling');
    void btn.offsetWidth;
    btn.classList.add('swirling');
    $('#storyCaption').textContent = 'freshly whisked & happy!';
  }
  if (e.target.closest('#drawerShakeBtn')) {
    shakeDrawerCup();
  }

  const filter = e.target.closest('[data-filter]');
  if (filter) {
    currentFilter = filter.dataset.filter;
    document.querySelectorAll('.filter').forEach(b => {
      b.classList.toggle('active', b === filter);
      b.setAttribute('aria-selected', String(b === filter));
    });
    renderMenu();
  }
  const product = e.target.closest('[data-product]');
  if (product) openCustom(product.dataset.product);
  if (e.target.closest('#bagButton')) { renderCart(); showDrawer('cartDrawer'); }
  if (e.target.closest('[data-close]') || e.target === $('#overlay')) closeDrawers();

  const option = e.target.closest('[data-option]');
  if (option) {
    custom[option.dataset.option] = option.dataset.value;
    updateCustom(true);
  }
  const topping = e.target.closest('[data-topping]');
  if (topping) {
    const v = topping.dataset.topping;
    custom.toppings = custom.toppings.includes(v)
      ? custom.toppings.filter(x => x !== v)
      : [...custom.toppings, v];
    updateCustom(true);
  }
  const qty = e.target.closest('[data-qty]');
  if (qty) {
    custom.qty = Math.max(1, Math.min(20, custom.qty + Number(qty.dataset.qty)));
    updateCustom(false);
  }
  if (e.target.closest('#addToBag')) {
    cart.push({ ...custom, id: activeProduct.id, unitPrice: unitPrice() });
    saveCart();
    closeDrawers();
    toast('Added to your bag');
  }
  const remove = e.target.closest('[data-remove]');
  if (remove) {
    cart.splice(Number(remove.dataset.remove), 1);
    saveCart();
    renderCart();
  }
  if (e.target.closest('#browseMenu') || e.target.closest('#newOrder')) {
    closeDrawers();
    $('#menu').scrollIntoView({ behavior: 'smooth' });
  }
  if (e.target.closest('#placeOrder')) placeOrder();
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawers(); });

renderHeroStage();
renderMenu();
saveCart();
