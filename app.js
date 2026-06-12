const USERS = ["standard_user", "outfit_user", "visual_user", "locked_out_user"];
const PASSWORD = "secret_sauce";

// Replace these image paths with your own photos in assets/products/.
const PRODUCTS = [
  {
    id: "classic-shirt",
    name: "Classic White Shirt",
    desc: "A clean everyday shirt that matches jeans, trousers, sneakers, and layered outfits.",
    price: 19.99,
    image: "assets/products/classic-shirt.svg"
  },
  {
    id: "denim-jeans",
    name: "Blue Denim Jeans",
    desc: "Comfort-fit denim pants for casual outfits, streetwear, and daily wear.",
    price: 39.99,
    image: "assets/products/denim-jeans.svg"
  },
  {
    id: "running-shoes",
    name: "Street Runner Shoes",
    desc: "Lightweight shoes with soft soles for walking, school, work, and weekend outfits.",
    price: 59.99,
    image: "assets/products/running-shoes.svg"
  },
  {
    id: "hoodie",
    name: "Cozy Black Hoodie",
    desc: "A soft hoodie that works with joggers, jeans, cargo pants, and sneakers.",
    price: 44.99,
    image: "assets/products/hoodie.svg"
  },
  {
    id: "track-pants",
    name: "Relaxed Track Pants",
    desc: "Easy pull-on pants with a comfortable fit for training, travel, and relaxed styling.",
    price: 34.99,
    image: "assets/products/track-pants.svg"
  },
  {
    id: "outfit-jacket",
    name: "Everyday Outfit Jacket",
    desc: "A lightweight jacket for layering over shirts, hoodies, and full outfit sets.",
    price: 69.99,
    image: "assets/products/outfit-jacket.svg"
  }
];

const money = amount => `$${amount.toFixed(2)}`;
const getCart = () => JSON.parse(localStorage.getItem("outfitCart") || "[]");
const saveCart = cart => localStorage.setItem("outfitCart", JSON.stringify(cart));
const isLoggedIn = () => Boolean(localStorage.getItem("outfitUser"));
const currentPage = () => window.location.pathname.split("/").pop() || "index.html";

function protectPage() {
  const page = currentPage();
  const openPages = ["index.html", ""];
  if (!openPages.includes(page) && !isLoggedIn()) {
    window.location.href = "index.html";
  }
  if (page === "index.html" && isLoggedIn()) {
    window.location.href = "inventory.html";
  }
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (!badge) return;
  const count = getCart().length;
  badge.textContent = count;
  badge.classList.toggle("hidden", count === 0);
}

function addToCart(id) {
  const cart = getCart();
  if (!cart.includes(id)) {
    cart.push(id);
    saveCart(cart);
  }
  updateCartBadge();
  renderInventory();
  renderCart();
  renderCheckout();
}

function removeFromCart(id) {
  saveCart(getCart().filter(itemId => itemId !== id));
  updateCartBadge();
  renderInventory();
  renderCart();
  renderCheckout();
}

function sortedProducts() {
  const select = document.getElementById("sortSelect");
  const value = select ? select.value : "az";
  const items = [...PRODUCTS];
  if (value === "az") items.sort((a, b) => a.name.localeCompare(b.name));
  if (value === "za") items.sort((a, b) => b.name.localeCompare(a.name));
  if (value === "lohi") items.sort((a, b) => a.price - b.price);
  if (value === "hilo") items.sort((a, b) => b.price - a.price);
  return items;
}

function renderInventory() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const cart = getCart();
  grid.innerHTML = sortedProducts().map(product => {
    const inCart = cart.includes(product.id);
    return `
      <article class="product-card">
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h2>${product.name}</h2>
          <p>${product.desc}</p>
          <div></div>
          <div class="price-row">
            <strong class="price">${money(product.price)}</strong>
            <button class="${inCart ? "danger-btn" : "outline-btn"} product-action" data-action="${inCart ? "remove" : "add"}" data-id="${product.id}">
              ${inCart ? "Remove" : "Add to cart"}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function renderCart() {
  const list = document.getElementById("cartItems");
  if (!list) return;

  const cart = getCart();
  const empty = document.getElementById("emptyCart");
  const checkoutLink = document.getElementById("checkoutLink");
  const items = cart.map(id => PRODUCTS.find(product => product.id === id)).filter(Boolean);

  empty?.classList.toggle("hidden", items.length !== 0);
  checkoutLink?.classList.toggle("hidden", items.length === 0);

  list.innerHTML = items.map(product => `
    <article class="cart-item">
      <div class="qty-box">1</div>
      <div>
        <h2>${product.name}</h2>
        <p>${product.desc}</p>
        <strong class="price">${money(product.price)}</strong>
      </div>
      <button class="danger-btn" data-action="remove" data-id="${product.id}">Remove</button>
    </article>
  `).join("");
}

function renderCheckout() {
  const wrap = document.getElementById("checkoutItems");
  if (!wrap) return;

  const items = getCart().map(id => PRODUCTS.find(product => product.id === id)).filter(Boolean);
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  wrap.innerHTML = items.length
    ? items.map(item => `<div class="summary-item"><span>${item.name}</span><strong>${money(item.price)}</strong></div>`).join("")
    : `<p class="empty-text">Your cart is empty.</p>`;

  document.getElementById("itemTotal").textContent = money(subtotal);
  document.getElementById("taxTotal").textContent = money(tax);
  document.getElementById("grandTotal").textContent = money(total);
}

function setupLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();
    const username = form.username.value.trim();
    const password = form.password.value.trim();
    const error = document.getElementById("loginError");

    if (username === "locked_out_user") {
      error.textContent = "Sorry, this user has been locked out.";
      return;
    }

    if (!USERS.includes(username) || password !== PASSWORD) {
      error.textContent = "Username and password do not match any user.";
      return;
    }

    localStorage.setItem("outfitUser", username);
    window.location.href = "inventory.html";
  });
}

function setupMenu() {
  const open = document.getElementById("openMenu");
  const close = document.getElementById("closeMenu");
  const menu = document.getElementById("sideMenu");
  const shade = document.getElementById("menuShade");
  const logout = document.getElementById("logoutButton");
  const reset = document.getElementById("resetButton");

  const show = () => { menu?.classList.add("open"); shade?.classList.add("open"); };
  const hide = () => { menu?.classList.remove("open"); shade?.classList.remove("open"); };

  open?.addEventListener("click", show);
  close?.addEventListener("click", hide);
  shade?.addEventListener("click", hide);

  logout?.addEventListener("click", () => {
    localStorage.removeItem("outfitUser");
    window.location.href = "index.html";
  });

  reset?.addEventListener("click", () => {
    localStorage.removeItem("outfitCart");
    updateCartBadge();
    renderInventory();
    renderCart();
    renderCheckout();
    hide();
  });
}

function setupActions() {
  document.body.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    const id = button.dataset.id;
    if (action === "add") addToCart(id);
    if (action === "remove") removeFromCart(id);
  });

  document.getElementById("sortSelect")?.addEventListener("change", renderInventory);

  document.getElementById("checkoutForm")?.addEventListener("submit", event => {
    event.preventDefault();
    if (getCart().length === 0) {
      window.location.href = "inventory.html";
      return;
    }
    localStorage.removeItem("outfitCart");
    window.location.href = "complete.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  protectPage();
  setupLogin();
  setupMenu();
  setupActions();
  updateCartBadge();
  renderInventory();
  renderCart();
  renderCheckout();
});
