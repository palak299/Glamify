function getCart()     { return JSON.parse(localStorage.getItem('glamify_cart')     || '[]'); }
function getWishlist() { return JSON.parse(localStorage.getItem('glamify_wishlist') || '[]'); }
function saveCart(arr)     { localStorage.setItem('glamify_cart',     JSON.stringify(arr)); }
function saveWishlist(arr) { localStorage.setItem('glamify_wishlist', JSON.stringify(arr)); }

function updateBadges() {
  const cartCount = getCart().reduce((sum, item) => sum + (item.qty || 1), 0);
  const wishCount = getWishlist().length;

  const cartEl = document.getElementById('cart-count');
  const wishEl = document.getElementById('wish-count');

  if (cartEl) { cartEl.textContent = cartCount; cartEl.style.display = cartCount ? 'inline' : 'none'; }
  if (wishEl) { wishEl.textContent = wishCount; wishEl.style.display = wishCount ? 'inline' : 'none'; }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.cssText = 'opacity:1;transform:translateY(0)';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.cssText = 'opacity:0;transform:translateY(20px)'; }, 2200);
}

function addToCart(name, price) {
  const cart = getCart();
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  saveCart(cart);
  updateBadges();

  const cartIcon = document.querySelector('.nav-cart');
  if (cartIcon) { cartIcon.classList.add('bounce'); setTimeout(() => cartIcon.classList.remove('bounce'), 500); }

  showToast('🛒 Added to cart!');
}

function toggleWishlist(name, btn) {
  const list = getWishlist();
  const idx  = list.findIndex(i => i.name === name);

  if (idx === -1) {
    list.push({ name });
    saveWishlist(list);
    btn.textContent = '♥';
    btn.style.color = '#e8357a';
    showToast('💖 Added to wishlist!');
  } else {
    list.splice(idx, 1);
    saveWishlist(list);
    btn.textContent = '♡';
    btn.style.color = '';
    showToast('💔 Removed from wishlist');
  }

  updateBadges();
  renderHomeTicker();
}
function setupProdCards() {
  document.querySelectorAll('.prod-card').forEach(card => {
    const name  = card.querySelector('.prod-name')?.textContent.trim()  || 'Product';
    const priceText = card.querySelector('.prod-price')?.textContent.replace(/[^\d]/g, '') || '0';
    const price = parseInt(priceText);
    const addBtn = card.querySelector('.add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => addToCart(name, price));
    }
    const wishBtn = card.querySelector('.wish-btn');
    if (wishBtn) {
      const inWish = getWishlist().some(i => i.name === name);
      if (inWish) { wishBtn.textContent = '♥'; wishBtn.style.color = '#e8357a'; }
      wishBtn.addEventListener('click', () => toggleWishlist(name, wishBtn));
    }
  });
}
function renderHomeTicker() {
  const list   = getWishlist();
  const ticker = document.getElementById('wish-ticker');
  const inner  = document.getElementById('ticker-inner');
  if (!ticker || !inner) return;

  if (!list.length) { ticker.style.display = 'none'; return; }

  const names = list.map(i => '💖 ' + i.name).join('  ✦  ');
  inner.textContent = names + '  ✦  ' + names;
  ticker.style.display = 'block';
}
function startPromoTimer() {
  const hEl = document.getElementById('cd-h');
  const mEl = document.getElementById('cd-m');
  const sEl = document.getElementById('cd-s');
  if (!hEl || !mEl || !sEl) return;

  let deadline = Number(localStorage.getItem('glamify_promo_deadline'));
  if (!deadline || deadline < Date.now()) {
    deadline = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
    localStorage.setItem('glamify_promo_deadline', deadline);
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = deadline - Date.now();

    if (diff <= 0) {
      hEl.textContent = mEl.textContent = sEl.textContent = '00';
      localStorage.removeItem('glamify_promo_deadline');
      return; // stop
    }

    hEl.textContent = pad(Math.floor(diff / 3600000));
    mEl.textContent = pad(Math.floor((diff % 3600000) / 60000));
    sEl.textContent = pad(Math.floor((diff % 60000) / 1000));
  }

  tick();                        // run immediately
  setInterval(tick, 1000);      // then every second
}

const searchDB = [
  {name:'Velvet Matte Lipstick', price:299,  img:'https://i.pinimg.com/originals/b4/b4/b1/b4b4b10f8eb1da07a2f1f3e562755433.jpg', link:'shop.html?cat=makeup'},
  {name:'Glow Moisturiser',      price:799,  img:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200',              link:'shop.html?cat=skincare'},
  {name:'Diva Eau de Parfum',    price:1999, img:'https://fimgs.net/images/perfume/social.8747.jpg',                               link:'shop.html?cat=fragrance'},
  {name:'Onion Hair Serum',      price:1299, img:'https://www.ktprofessional.com/cdn/shop/files/OrganicOnionHairSerum-100ml_6.jpg?v=1763361557&width=200', link:'shop.html?cat=haircare'},
  {name:'Vitamin C Serum',       price:1199, img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9ZbcD7xq5AUXJ5u1SrQJyG3K7KJqVCY1j6Q&s', link:'shop.html?cat=skincare'},
  {name:'HD Foundation',         price:899,  img:'https://i.pinimg.com/474x/e8/6f/d7/e86fd7d5c89b72ada65192e3b19b6bae.jpg',      link:'shop.html?cat=makeup'},
  {name:'SPF 60 Sunscreen',      price:549,  img:'https://www.nandiniorganic.com/cdn/shop/files/3_55c7210f-c166-451d-b16a-249c140c42ea_1120x.png?v=1711964378', link:'shop.html?cat=skincare'},
  {name:'Nude Eyeshadow Palette', price:399, img:'https://media.istockphoto.com/id/1370468785/photo/a-nude-eyeshadow-palette-and-makeup-artists-tools-on-a-marble-vanity-brushes-for-powder-blush.jpg?s=200x200', link:'shop.html?cat=makeup'},
  {name:'Pure Argan Oil',        price:1199, img:'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=200',             link:'shop.html?cat=haircare'},
  {name:'Elegance EDP',          price:1299, img:'https://img.freepik.com/premium-photo/perfume-bottle-no-logo-realistic-isolated-white-backgroundgenerative-ai_760510-6152.jpg?w=400', link:'shop.html?cat=fragrance'},
  {name:'10% Niacinamide Serum', price:849,  img:'https://suganda.co/cdn/shop/files/10_Niacinamide_Serum_L4_1280x.jpg?v=1753698326', link:'shop.html?cat=skincare'},
  {name:'Rose Clay Mask',        price:499,  img:'https://www.jiomart.com/images/product/original/rv55bwr5wm/saanggavi-naturals-rose-clay-face-mask-for-a-brighther-and-smoother-complexion-50-g-product-images-orv55bwr5wm-p613152337-1-202512151410.jpg?im=Resize=(300,300)', link:'shop.html?cat=skincare'},
  {name:'Pro Brush Set',         price:1299, img:'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200',             link:'shop.html?cat=makeup'},
];

function openSearch() {
  document.getElementById('search-overlay').classList.add('open');
  setTimeout(() => document.getElementById('search-inp').focus(), 100);
}

function closeSearch() {
  document.getElementById('search-overlay').classList.remove('open');
  document.getElementById('search-inp').value = '';
  document.getElementById('search-results').innerHTML = '<div class="sr-empty">Start typing to search ✨</div>';
}

document.getElementById('search-inp')?.addEventListener('input', function () {
  const term = this.value.toLowerCase().trim();
  const resultsEl = document.getElementById('search-results');

  if (!term) { resultsEl.innerHTML = '<div class="sr-empty">Start typing to search ✨</div>'; return; }

  const matches = searchDB.filter(p => p.name.toLowerCase().includes(term));
  if (!matches.length) { resultsEl.innerHTML = `<div class="sr-empty">No products found for "${this.value}"</div>`; return; }

  const frag = document.createDocumentFragment();
  matches.forEach(({ name, price, img, link }) => {
    const card = document.createElement('div');
    card.className = 'sr-card';
    card.innerHTML = `<img src="${img}" alt="${name}" onerror="this.style.display='none'">
      <div class="sr-info"><div class="sr-name">${name}</div><div class="sr-price">₹${price.toLocaleString('en-IN')}</div></div>`;
    card.addEventListener('click', () => { window.location.href = link; });
    frag.appendChild(card);
  });

  resultsEl.innerHTML = '';
  resultsEl.appendChild(frag);
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });
document.getElementById('search-overlay')?.addEventListener('click', function (e) { if (e.target === this) closeSearch(); });

window.addEventListener('scroll', () => {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;
  btn.style.opacity = window.scrollY > 300 ? '1' : '0';
  btn.style.pointerEvents = window.scrollY > 300 ? 'auto' : 'none';
});
document.addEventListener('DOMContentLoaded', () => {
  setupProdCards();   
  updateBadges();     
  renderHomeTicker(); 
  startPromoTimer();  
});