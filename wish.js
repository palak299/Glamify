function initWishlistButtons() {
  document.querySelectorAll('.prod-card').forEach(card => {

    let name = card.querySelector('.prod-name')?.innerText;
    let priceText = card.querySelector('.prod-price')?.innerText;
    let price = priceText ? parseInt(priceText.replace('₹', '')) : 0;

    let btn = document.createElement('button');

    // check if already in wishlist
    let wish = getWishlist();
    let exists = wish.find(p => p.name === name);

    btn.innerHTML = exists ? "♥" : "♡";
    btn.className = "wish-btn";

    btn.style.position = "absolute";
    btn.style.top = "10px";
    btn.style.right = "10px";
    btn.style.border = "none";
    btn.style.background = "white";
    btn.style.padding = "6px 10px";
    btn.style.borderRadius = "50%";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "16px";

    btn.onclick = () => {
      toggleWishlist(name, price, btn);
    };

    card.style.position = "relative";
    card.appendChild(btn);
  });
}