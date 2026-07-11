// ===== Product Data =====
const PRODUCTS = [
  { id: 1, name: "Men's Casual T-Shirt", cat: "men", price: 450, old: 560, emoji: "👕", bg: "#E3EAE6" },
  { id: 2, name: "Women's Cotton Saree", cat: "women", price: 1450, old: null, emoji: "🥻", bg: "#F6E1E8" },
  { id: 3, name: "Smartphone X200", cat: "phones", price: 15990, old: 17990, emoji: "📱", bg: "#E4E7F5" },
  { id: 4, name: "Chrono Sport Watch", cat: "watches", price: 2290, old: 2890, emoji: "⌚", bg: "#EFE6D8" },
  { id: 5, name: "Aromatic Chinigura Rice 5kg", cat: "grocery", price: 620, old: null, emoji: "🌾", bg: "#F3ECD9" },
  { id: 6, name: "Mobil Super 4T Engine Oil", cat: "grocery", price: 780, old: 850, emoji: "🛢️", bg: "#E9E2DA" },
  { id: 7, name: "Wireless Earbuds Pro", cat: "phones", price: 1990, old: 2490, emoji: "🎧", bg: "#DDEAE6" },
  { id: 8, name: "Herbal Face Wash", cat: "beauty", price: 280, old: 340, emoji: "🧴", bg: "#F5E9D6" },
  { id: 9, name: "Men's Analog Watch", cat: "watches", price: 1590, old: null, emoji: "⌚", bg: "#EFE3E3" },
  { id: 10, name: "Women's Handbag", cat: "women", price: 990, old: 1290, emoji: "👜", bg: "#F0E5EF" },
  { id: 11, name: "Power Bank 10000mAh", cat: "phones", price: 1290, old: null, emoji: "🔋", bg: "#E1E9EA" },
  { id: 12, name: "Sandalwood Face Pack", cat: "beauty", price: 280, old: 330, emoji: "🌿", bg: "#EDE7D2" },
];

const FLASH_IDS = [3, 4, 7, 8]; // subset shown in flash sale

const fmt = (n) => `৳${n.toLocaleString("en-BD")}`;

let cart = {}; // { productId: qty }
let activeCat = "all";
let selectedPayment = "bKash";

// ===== Rendering =====
function productCard(p) {
  const discount = p.old ? Math.round(((p.old - p.price) / p.old) * 100) : null;
  return `
    <div class="item-card" data-id="${p.id}">
      <div class="item-media" style="background:${p.bg}">
        ${discount ? `<span class="discount-tag">-${discount}%</span>` : ""}
        <span>${p.emoji}</span>
      </div>
      <div class="item-body">
        <div class="item-name">${p.name}</div>
        <div class="price-row">
          <span class="price-now">${fmt(p.price)}</span>
          ${p.old ? `<span class="price-old">${fmt(p.old)}</span>` : ""}
        </div>
        <button class="add-btn" data-add="${p.id}">Add to Cart</button>
      </div>
    </div>`;
}

function renderFlash() {
  const grid = document.getElementById("flashGrid");
  grid.innerHTML = PRODUCTS.filter((p) => FLASH_IDS.includes(p.id)).map(productCard).join("");
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  const list = activeCat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === activeCat);
  grid.innerHTML = list.length
    ? list.map(productCard).join("")
    : `<p style="grid-column:1/-1;color:var(--muted);font-size:13px;text-align:center;padding:20px 0;">No products in this category yet.</p>`;
}

// ===== Category Tabs =====
document.getElementById("catTabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".cat-tab");
  if (!btn) return;
  document.querySelectorAll(".cat-tab").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  activeCat = btn.dataset.cat;
  renderProducts();
  document.querySelector(".products-section").scrollIntoView({ behavior: "smooth", block: "start" });
});

// ===== Add to Cart (event delegation for both grids) =====
document.addEventListener("click", (e) => {
  const addBtn = e.target.closest("[data-add]");
  if (!addBtn) return;
  const id = Number(addBtn.dataset.add);
  cart[id] = (cart[id] || 0) + 1;
  updateCartUI();
  showToast("Added to cart");
});

// ===== Cart UI =====
function updateCartUI() {
  const ids = Object.keys(cart).filter((id) => cart[id] > 0);
  const totalQty = ids.reduce((s, id) => s + cart[id], 0);
  document.getElementById("cartBadge").textContent = totalQty;
  document.getElementById("navBadge").textContent = totalQty;

  const itemsWrap = document.getElementById("cartItems");
  const emptyMsg = document.getElementById("emptyMsg");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (ids.length === 0) {
    itemsWrap.innerHTML = `<p class="empty-msg" id="emptyMsg">Your cart is empty. Start adding products!</p>`;
    checkoutBtn.disabled = true;
  } else {
    let subtotal = 0;
    itemsWrap.innerHTML = ids
      .map((id) => {
        const p = PRODUCTS.find((pp) => pp.id === Number(id));
        const qty = cart[id];
        subtotal += p.price * qty;
        return `
          <div class="cart-line" data-id="${p.id}">
            <div class="thumb" style="background:${p.bg}">${p.emoji}</div>
            <div class="info">
              <div class="name">${p.name}</div>
              <div class="price">${fmt(p.price * qty)}</div>
            </div>
            <div class="qty-ctrl">
              <button data-qty="dec" data-id="${p.id}">−</button>
              <span>${qty}</span>
              <button data-qty="inc" data-id="${p.id}">+</button>
            </div>
          </div>`;
      })
      .join("");
    document.getElementById("subtotalVal").textContent = fmt(subtotal);
    checkoutBtn.disabled = false;
  }
}

document.getElementById("cartItems").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-qty]");
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.qty === "inc") cart[id] += 1;
  else {
    cart[id] -= 1;
    if (cart[id] <= 0) delete cart[id];
  }
  updateCartUI();
});

// ===== Cart Drawer open/close =====
const overlay = document.getElementById("overlay");
const cartDrawer = document.getElementById("cartDrawer");

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
}
function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
}

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("navCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCartDrawer);
overlay.addEventListener("click", () => {
  closeCartDrawer();
  closeModal();
});

// ===== Bottom Nav active state =====
document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    if (item.dataset.nav === "cart") return; // handled separately
    document.querySelectorAll(".nav-item").forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    if (item.dataset.nav === "home") window.scrollTo({ top: 0, behavior: "smooth" });
    if (item.dataset.nav === "categories") document.getElementById("catTabs").scrollIntoView({ behavior: "smooth" });
  });
});

// ===== Checkout Modal =====
const modalOverlay = document.getElementById("modalOverlay");
const stepAddress = document.getElementById("stepAddress");
const stepPayment = document.getElementById("stepPayment");
const stepSuccess = document.getElementById("stepSuccess");
const modalTitle = document.getElementById("modalTitle");

function openModal() {
  closeCartDrawer();
  modalOverlay.classList.add("show");
  showStep("address");
}
function closeModal() {
  modalOverlay.classList.remove("show");
}
function showStep(step) {
  stepAddress.classList.toggle("hidden", step !== "address");
  stepPayment.classList.toggle("hidden", step !== "payment");
  stepSuccess.classList.toggle("hidden", step !== "success");
  modalTitle.textContent =
    step === "address" ? "Delivery Details" : step === "payment" ? "Choose Payment" : "Order Placed";
}

document.getElementById("checkoutBtn").addEventListener("click", openModal);
document.getElementById("closeModal").addEventListener("click", closeModal);

document.getElementById("toPaymentBtn").addEventListener("click", () => {
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  if (!name || !phone) {
    showToast("Please enter your name and phone number");
    return;
  }
  showStep("payment");
});

document.querySelectorAll('input[name="pay"]').forEach((r) => {
  r.addEventListener("change", (e) => (selectedPayment = e.target.value));
});

document.getElementById("placeOrderBtn").addEventListener("click", () => {
  let subtotal = 0;
  Object.keys(cart).forEach((id) => {
    const p = PRODUCTS.find((pp) => pp.id === Number(id));
    subtotal += p.price * cart[id];
  });
  const total = subtotal + 60;
  document.getElementById(
    "successMsg"
  ).textContent = `Your order of ${fmt(total)} will be paid via ${selectedPayment}. It's on its way!`;
  showStep("success");
  cart = {};
  updateCartUI();
});

document.getElementById("doneBtn").addEventListener("click", () => {
  closeModal();
});

// ===== Toast =====
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

// ===== Flash Sale Countdown =====
function startCountdown() {
  let total = 13 * 3600 + 49 * 60 + 19; // 13:49:19
  const hEl = document.getElementById("cdH");
  const mEl = document.getElementById("cdM");
  const sEl = document.getElementById("cdS");

  setInterval(() => {
    total -= 1;
    if (total < 0) total = 6 * 3600; // loop reset for demo purposes

    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;

    hEl.textContent = String(h).padStart(2, "0");
    mEl.textContent = String(m).padStart(2, "0");
    sEl.textContent = String(s).padStart(2, "0");
  }, 1000);
}

// ===== Init =====
renderFlash();
renderProducts();
updateCartUI();
startCountdown();
