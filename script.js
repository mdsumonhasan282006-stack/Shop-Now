// ===== Search Products =====
const searchInput = document.querySelector(".search");

if (searchInput) {
  searchInput.addEventListener("keyup", function () {
    const value = this.value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
      const name = card.querySelector("h3").textContent.toLowerCase();

      if (name.includes(value)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
}

// ===== Cart =====
let cart = 0;

const buttons = document.querySelectorAll(".card button");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    cart++;
    alert("✅ Product Added to Cart");

    const cartLink = document.querySelector("nav a:nth-child(3)");

    if (cartLink) {
      cartLink.innerHTML = `🛒 Cart (${cart})`;
    }
  });
});

// ===== Banner Button =====
const shopBtn = document.querySelector(".banner button");

if (shopBtn) {
  shopBtn.addEventListener("click", () => {
    document.querySelector(".products").scrollIntoView({
      behavior: "smooth"
    });
  });
}