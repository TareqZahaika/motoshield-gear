const CART_KEY = "motoshield_cart";

function readCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function cartCount() {
  return readCart().reduce((total, item) => total + item.quantity, 0);
}

function updateCartBadge() {
  const badge = document.querySelector("#cartCount");
  if (badge) badge.textContent = cartCount();
}

function addToCart(product, customization = {}) {
  const cart = readCart();
  const key = `${product.id}-${JSON.stringify(customization)}`;
  const existing = cart.find((item) => item.key === key);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      key,
      product_id: product.id,
      name: product.name,
      category: product.category_name || product.category,
      price: Number(product.price),
      image: product.image || product.image_url || "https://images.pexels.com/photos/2611690/pexels-photo-2611690.jpeg?auto=compress&cs=tinysrgb&w=800",
      image_alt: product.image_alt || `${product.name} product image`,
      image_label: product.image_label || "MS",
      safety_level: product.safety_level || product.safetyLevel,
      quantity: 1,
      customization
    });
  }
  saveCart(cart);
}

function removeFromCart(key) {
  saveCart(readCart().filter((item) => item.key !== key));
}

function changeQuantity(key, delta) {
  const cart = readCart().map((item) => {
    if (item.key === key) item.quantity = Math.max(1, item.quantity + delta);
    return item;
  });
  saveCart(cart);
}

function cartSubtotal() {
  return readCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
