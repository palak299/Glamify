function getCart()   { try { return JSON.parse(localStorage.getItem('glamify_cart'))     || []; } catch(e) { return []; } }
function saveCart(c) { localStorage.setItem('glamify_cart', JSON.stringify(c)); }

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1a0012;color:#fff;padding:12px 24px;border-radius:12px;font-size:14px;z-index:9999;opacity:0;transition:opacity 0.3s;pointer-events:none;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.opacity = '0'; }, 2600);
}
function renderCart() {
  let cart = getCart();

  
  let emptyView = document.querySelector('.container'); 
  let cartView  = document.getElementById('cart-view');

  
  if (!cartView) {
    cartView = document.createElement('div');
    cartView.id = 'cart-view';
    cartView.style.cssText = 'max-width:700px;margin:0 auto;padding:20px 16px 60px;';
    document.body.appendChild(cartView);
  }

  if (cart.length === 0) {
   
    if (emptyView) emptyView.style.display = 'flex';
    cartView.style.display = 'none';
    return;
  }

  if (emptyView) emptyView.style.display = 'none';
  cartView.style.display = 'block';

  let total = cart.reduce((s, p) => s + p.price * p.qty, 0);  // s--running total, p--current product
  let itemCount = cart.reduce((s, p) => s + p.qty, 0);

  cartView.innerHTML = `
    <h2 style="font-size:22px;font-weight:700;color:#1a0012;margin:0 0 6px;">Your Bag 🛍️</h2>
    <p style="color:#6b4a5a;font-size:14px;margin:0 0 20px;">${itemCount} item${itemCount !== 1 ? 's' : ''}</p>

    <div id="cart-items"></div>

    <div style="background:rgba(255,255,255,0.9);border-radius:16px;padding:20px;margin-top:24px;box-shadow:0 4px 20px rgba(232,53,122,0.08);">
      <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:14px;color:#6b4a5a;">
        <span>Subtotal</span><span>₹${total.toLocaleString('en-IN')}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:14px;color:#6b4a5a;">
        <span>Delivery</span><span style="color:#1D9E75;font-weight:600;">FREE</span>
      </div>
      <div style="border-top:1px solid rgba(232,53,122,0.15);margin:12px 0;"></div>
      <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;color:#1a0012;">
        <span>Total</span><span>₹${total.toLocaleString('en-IN')}</span>
      </div>
      <button onclick="checkout()" style="width:100%;margin-top:18px;background:linear-gradient(135deg,#e60073,#ff2d8d);color:white;border:none;padding:16px;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer;box-shadow:0 8px 25px rgba(232,53,122,0.35);transition:0.3s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
        Checkout ✨
      </button>
      <button onclick="continueShopping()" style="width:100%;margin-top:10px;background:transparent;color:#e8357a;border:1.5px solid rgba(232,53,122,0.35);padding:13px;border-radius:12px;font-size:15px;cursor:pointer;transition:0.3s;" onmouseover="this.style.background='rgba(232,53,122,0.06)'" onmouseout="this.style.background='transparent'">
        Continue Shopping
      </button>
    </div>
  `;

  let itemsContainer = document.getElementById('cart-items');
  cart.forEach((item, idx) => {
    let card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.9);border-radius:16px;padding:16px;margin-bottom:12px;display:flex;align-items:center;gap:14px;box-shadow:0 2px 12px rgba(232,53,122,0.07);';
    card.innerHTML = `
      <div style="width:54px;height:54px;border-radius:12px;background:linear-gradient(135deg,#ffd6e7,#fbb1d3);display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;">
        ${categoryEmoji(item.name)}
      </div>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:600;font-size:14px;color:#1a0012;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</div>
        <div style="font-size:13px;color:#6b4a5a;margin-top:2px;">₹${item.price.toLocaleString('en-IN')} each</div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:8px;">
          <button onclick="changeQty(${idx}, -1)" style="width:28px;height:28px;border-radius:8px;border:1.5px solid rgba(232,53,122,0.3);background:white;color:#e8357a;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;">−</button>
          <span style="font-weight:600;font-size:14px;min-width:18px;text-align:center;">${item.qty}</span>
          <button onclick="changeQty(${idx}, 1)"  style="width:28px;height:28px;border-radius:8px;border:1.5px solid rgba(232,53,122,0.3);background:white;color:#e8357a;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;">+</button>
        </div>
      </div>
      <div style="text-align:right;flex-shrink:0;">
        <div style="font-weight:700;font-size:15px;color:#e8357a;">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
        <button onclick="removeItem(${idx})" style="margin-top:8px;background:none;border:none;color:#c0a0aa;cursor:pointer;font-size:20px;line-height:1;" title="Remove">🗑️</button>
      </div>
    `;
    itemsContainer.appendChild(card);
  });
}

const EMOJI_MAP = [
  [['foundation','concealer','primer','tinted','contour','sculpt','blush','highlighter','mascara','lipstick','lip gloss','lip liner','eyeshadow','brow','brush','setting spray','pencil'], '💄'],
  [['serum','moistur','sunscreen','spf','mask','mist','toner','eye cream','eye patch','cleanser','micellar','exfoliat','face oil','night cream','lip balm','niacinamide','peptide','bakuchiol','retinol','sheet'], '🧴'],
  [['hair oil','shampoo','conditioner','hair mask','serum','heat protectant','dry shampoo','scalp','leave-in','keratin','argan','castor','biotin','rice water','shine','protein'], '💇'],
  [['edp','edt','parfum','noir','bloom','eau','fragrance','perfume','attar','mist','body mist','oud','rose extrait','discovery'], '🌸'],
];

function categoryEmoji(name) {
  let n = name.toLowerCase();
  for (let [keywords, emoji] of EMOJI_MAP) {
    if (keywords.some(k => n.includes(k))) return emoji;
  }
  return '✨';
}

function changeQty(idx, delta) {
  let cart = getCart();
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) {
    let name = cart[idx].name;
    cart.splice(idx, 1);
    showToast('🗑️ ' + name + ' removed');
  } else {
    showToast(delta > 0 ? '➕ Quantity increased' : '➖ Quantity decreased');
  }
  saveCart(cart);
  renderCart();
}

function removeItem(idx) {
  let cart = getCart();
  let name = cart[idx].name;
  cart.splice(idx, 1);
  saveCart(cart);
  showToast('🗑️ ' + name + ' removed from bag');
  renderCart();
}

function checkout() {
  showToast('🎉 Order placed!');
}

function continueShopping() {
  window.location.href = 'shop.html';
}

function goBack() {
  if (document.referrer) {
    history.back();
  } else {
    window.location.href = 'shop.html';
  }
}

document.addEventListener('DOMContentLoaded', renderCart);

//.....
(function () {
  if (localStorage.getItem("glamify_theme") === "dark") {
    document.documentElement.classList.add("dark");
  }
})();
document.addEventListener("DOMContentLoaded", function () {
  createToggleBtn();
  applyTheme();
});

function createToggleBtn() {
  let btn = document.createElement("button");
  btn.id = "theme-toggle";
  btn.title = "Toggle Dark / Light Mode";
  btn.innerHTML = getIcon();
  btn.addEventListener("click", toggleTheme);
  document.body.appendChild(btn);
}
function getIcon() {
  return localStorage.getItem("glamify_theme") === "dark" ? "☀️" : "🌙";
}
function toggleTheme() {
  let isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("glamify_theme", isDark ? "dark" : "light");
  let btn = document.getElementById("theme-toggle");
  if (btn) btn.innerHTML = isDark ? "☀️" : "🌙";
}
function applyTheme() {
  let btn = document.getElementById("theme-toggle");
  if (!btn) return;
  btn.innerHTML = getIcon();
}