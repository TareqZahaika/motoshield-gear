const CATEGORIES = [
  "Motorcycle Jackets",
  "Helmets",
  "Gloves",
  "Riding Pants",
  "Boots",
  "Protective Armor",
  "Rain Gear",
  "Accessories",
  "Motorcycle Parts"
];

const FALLBACK_PRODUCTS = [
  { id: 1, name: "Armored Motorcycle Jacket", category: "Motorcycle Jackets", category_name: "Motorcycle Jackets", price: 149.99, safetyLevel: "High", safety_level: "High", image: "https://images.pexels.com/photos/5807579/pexels-photo-5807579.jpeg?auto=compress&cs=tinysrgb&w=800", image_alt: "Armored Motorcycle Jacket", description: "A protective motorcycle jacket designed for safety, comfort, and everyday riding.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Black", "Orange", "Gray"], materials: ["Cordura", "Leather"], image_label: "JKT", best_seller: true },
  { id: 2, name: "Full Face Motorcycle Helmet", category: "Helmets", category_name: "Helmets", price: 199.99, safetyLevel: "Very High", safety_level: "Very High", image: "https://images.pexels.com/photos/2393821/pexels-photo-2393821.jpeg?auto=compress&cs=tinysrgb&w=800", image_alt: "Full Face Motorcycle Helmet", description: "A full face helmet that provides strong protection and a modern riding look.", sizes: ["S", "M", "L", "XL"], colors: ["Black", "White", "Red"], materials: ["Composite Shell"], image_label: "HLM", best_seller: true },
  { id: 3, name: "Riding Gloves", category: "Gloves", category_name: "Gloves", price: 49.99, safetyLevel: "Medium", safety_level: "Medium", image: "https://images.pexels.com/photos/6461396/pexels-photo-6461396.jpeg?auto=compress&cs=tinysrgb&w=800", image_alt: "Riding Gloves", description: "Comfortable motorcycle gloves for grip, protection, and safer control.", sizes: ["S", "M", "L", "XL"], colors: ["Black", "Red"], materials: ["Leather"], image_label: "GLV", best_seller: false },
  { id: 4, name: "Motorcycle Riding Pants", category: "Riding Pants", category_name: "Riding Pants", price: 119.99, safetyLevel: "High", safety_level: "High", image: "https://images.pexels.com/photos/5807576/pexels-photo-5807576.jpeg?auto=compress&cs=tinysrgb&w=800", image_alt: "Motorcycle Riding Pants", description: "Durable riding pants with a safety-focused design for motorcycle riders.", sizes: ["S", "M", "L", "XL"], colors: ["Black", "Gray"], materials: ["Kevlar Denim"], image_label: "PNT", best_seller: false },
  { id: 5, name: "Motorcycle Boots", category: "Boots", category_name: "Boots", price: 129.99, safetyLevel: "High", safety_level: "High", image: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800", image_alt: "Motorcycle Boots", description: "Strong riding boots designed to protect the rider while keeping a stylish look.", sizes: ["42", "43", "44", "45"], colors: ["Black", "Brown"], materials: ["Leather"], image_label: "BOT", best_seller: true },
  { id: 6, name: "Protective Body Armor", category: "Protective Armor", category_name: "Protective Armor", price: 89.99, safetyLevel: "Very High", safety_level: "Very High", image: "https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilot-163210.jpeg?auto=compress&cs=tinysrgb&w=800", image_alt: "Protective Body Armor", description: "Protective armor for safer riding and better impact protection.", sizes: ["S", "M", "L", "XL"], colors: ["Black"], materials: ["Memory Foam"], image_label: "ARM", best_seller: false },
  { id: 7, name: "Waterproof Rain Gear", category: "Rain Gear", category_name: "Rain Gear", price: 79.99, safetyLevel: "Medium", safety_level: "Medium", image: "https://images.pexels.com/photos/2519374/pexels-photo-2519374.jpeg?auto=compress&cs=tinysrgb&w=800", image_alt: "Waterproof Rain Gear", description: "Waterproof riding gear for rainy weather and safer visibility on the road.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Black", "Yellow"], materials: ["Waterproof Nylon"], image_label: "RAN", best_seller: false },
  { id: 8, name: "Motorcycle Chain Kit", category: "Motorcycle Parts", category_name: "Motorcycle Parts", price: 69.99, safetyLevel: "Medium", safety_level: "Medium", image: "https://images.pexels.com/photos/1715184/pexels-photo-1715184.jpeg?auto=compress&cs=tinysrgb&w=800", image_alt: "Motorcycle Chain Kit", description: "A motorcycle parts kit for maintenance and better riding performance.", sizes: ["Universal"], colors: ["Black"], materials: ["Steel"], image_label: "PRT", best_seller: false },
  { id: 9, name: "Reflective Safety Vest", category: "Accessories", category_name: "Accessories", price: 34.99, safetyLevel: "High", safety_level: "High", image: "https://images.pexels.com/photos/4489734/pexels-photo-4489734.jpeg?auto=compress&cs=tinysrgb&w=800", image_alt: "Reflective Safety Vest", description: "A reflective safety vest that helps riders stay visible, especially at night.", sizes: ["Universal"], colors: ["Orange", "Yellow"], materials: ["Reflective Fabric"], image_label: "VST", best_seller: false },
  { id: 10, name: "Motorcycle Backpack", category: "Accessories", category_name: "Accessories", price: 59.99, safetyLevel: "Medium", safety_level: "Medium", image: "https://images.pexels.com/photos/2533092/pexels-photo-2533092.jpeg?auto=compress&cs=tinysrgb&w=800", image_alt: "Motorcycle Backpack", description: "A useful backpack for riders, designed for daily riding and storage.", sizes: ["Universal"], colors: ["Black", "Gray"], materials: ["Nylon"], image_label: "BAG", best_seller: true }
];

let products = [];
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const DEFAULT_PRODUCT_IMAGE = "https://images.pexels.com/photos/2611690/pexels-photo-2611690.jpeg?auto=compress&cs=tinysrgb&w=800";

function $(selector) {
  return document.querySelector(selector);
}

function pageName() {
  return document.body.dataset.page;
}

function productUrl(product) {
  return `product-details.html?id=${encodeURIComponent(product.id)}`;
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

async function loadProducts() {
  if (products.length) return products;
  if (window.motoSupabase) {
    const { data, error } = await window.motoSupabase
      .from("products")
      .select("*, product_categories(name)")
      .order("name");
    if (!error && data && data.length) {
      products = data.map((item) => ({
        ...item,
        category_name: item.product_categories?.name || item.category_name,
        category: item.product_categories?.name || item.category,
        safetyLevel: item.safety_level || item.safetyLevel,
        sizes: normalizeArray(item.sizes),
        colors: normalizeArray(item.colors),
        materials: normalizeArray(item.materials),
        image: item.image_url || item.image || DEFAULT_PRODUCT_IMAGE,
        image_alt: item.image_alt || `${item.name} product image`
      }));
      return products;
    }
  }
  products = FALLBACK_PRODUCTS;
  return products;
}

function productImageFallback(product) {
  return product.image || product.image_url || DEFAULT_PRODUCT_IMAGE;
}

function imageMarkup(product, className = "") {
  const src = productImageFallback(product);
  const alt = product.image_alt || product.name || "Motorcycle safety product";
  return `<img src="${src}" alt="${alt}" class="product-image ${className}" loading="lazy">`;
}

function applyImageFallbacks() {
  document.querySelectorAll("img").forEach((img) => {
    img.onerror = () => {
      if (img.src !== DEFAULT_PRODUCT_IMAGE) {
        img.src = DEFAULT_PRODUCT_IMAGE;
      }
    };
  });
}

function categoryName(product) {
  return product.category_name || product.category || "Motorcycle Gear";
}

function safetyName(product) {
  return product.safety_level || product.safetyLevel || "Medium";
}

function renderHeader() {
  const current = pageName();
  $(".site-header").innerHTML = `
    <nav class="nav">
      <a class="brand" href="index.html"><span class="brand-mark">MS</span><span>MotoShield Gear</span></a>
      <button class="btn secondary small mobile-toggle" type="button">Menu</button>
      <div class="nav-links">
        ${[
          ["index.html", "Home", "home"],
          ["products.html", "Products", "products"],
          ["cart.html", "Cart", "cart"],
          ["checkout.html", "Checkout", "checkout"],
          ["about.html", "About", "about"],
          ["contact.html", "Contact", "contact"],
          ["admin.html", "Admin", "admin"]
        ].map(([href, label, key]) => `<a class="${current === key ? "active" : ""}" href="${href}">${label}</a>`).join("")}
        <a class="cart-link" href="cart.html">Cart <span id="cartCount">0</span></a>
      </div>
    </nav>
  `;
  $(".mobile-toggle").addEventListener("click", () => $(".nav-links").classList.toggle("open"));
  updateCartBadge();
}

function renderFooter() {
  $(".site-footer").innerHTML = `
    <div class="footer-inner">
      <div><strong>MotoShield Gear</strong><p>Ride Safe. Ride Smart. Ride Protected.</p></div>
      <div><p>University e-commerce project connected to Supabase.</p></div>
    </div>
  `;
}

function productCard(product) {
  return `
    <article class="product-card">
      <a class="product-media-link" href="${productUrl(product)}">${imageMarkup(product)}</a>
      <div class="product-body">
        <div class="product-meta"><span class="tag">${categoryName(product)}</span><span class="tag safety">${safetyName(product)}</span></div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <strong class="price">${money.format(Number(product.price))}</strong>
        <div class="card-actions">
          <button class="btn primary small" data-add="${product.id}" type="button">Add to cart</button>
          <a class="btn secondary small" href="${productUrl(product)}">Customize</a>
        </div>
      </div>
    </article>
  `;
}

function bindAddButtons() {
  document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = products.find((item) => String(item.id) === button.dataset.add);
      if (product) addToCart(product);
      button.textContent = "Added";
      setTimeout(() => { button.textContent = "Add to cart"; }, 900);
    });
  });
}

async function renderHome() {
  const data = await loadProducts();
  $("#homeCategories").innerHTML = CATEGORIES.map((category) => `
    <a class="category-card" href="products.html?category=${encodeURIComponent(category)}">
      <strong>${category}</strong><span>Shop protective gear</span>
    </a>
  `).join("");
  $("#bestSellers").innerHTML = data.filter((item) => item.best_seller).slice(0, 4).map(productCard).join("");
  bindAddButtons();
  applyImageFallbacks();
}

function fillCategoryFilter() {
  const select = $("#categoryFilter");
  if (!select) return;
  CATEGORIES.forEach((category) => select.insertAdjacentHTML("beforeend", `<option>${category}</option>`));
  const selected = new URLSearchParams(location.search).get("category");
  if (selected) select.value = selected;
}

function renderProductsGrid() {
  const query = ($("#searchInput")?.value || "").toLowerCase();
  const category = $("#categoryFilter")?.value || "";
  const size = $("#sizeFilter")?.value || "";
  const safety = $("#safetyFilter")?.value || "";
  const maxPrice = Number($("#priceFilter")?.value || 9999);
  if ($("#priceValue")) $("#priceValue").textContent = money.format(maxPrice);

  const filtered = products.filter((product) => {
    const text = `${product.name} ${product.description} ${categoryName(product)}`.toLowerCase();
    return (!query || text.includes(query))
      && (!category || categoryName(product) === category)
      && (!size || normalizeArray(product.sizes).includes(size))
      && (!safety || safetyName(product) === safety)
      && Number(product.price) <= maxPrice;
  });

  $("#productCount").textContent = `${filtered.length} products`;
  $("#productsGrid").innerHTML = filtered.map(productCard).join("") || `<p class="form-message">No products match your filters.</p>`;
  bindAddButtons();
  applyImageFallbacks();
}

async function renderProductsPage() {
  await loadProducts();
  fillCategoryFilter();
  ["#searchInput", "#categoryFilter", "#sizeFilter", "#safetyFilter", "#priceFilter"].forEach((selector) => {
    $(selector)?.addEventListener("input", renderProductsGrid);
  });
  renderProductsGrid();
}

async function renderDetails() {
  await loadProducts();
  const id = new URLSearchParams(location.search).get("id") || products[0]?.id;
  const product = products.find((item) => String(item.id) === String(id)) || products[0];
  if (!product) return;
  $("#detailsView").innerHTML = `
    ${imageMarkup(product, "details-image")}
    <article class="details-card">
      <p class="eyebrow">${categoryName(product)}</p>
      <h1>${product.name}</h1>
      <p>${product.description}</p>
      <div class="product-meta"><span class="tag safety">${safetyName(product)}</span><span class="tag">${money.format(Number(product.price))}</span></div>
      <form id="customForm">
        <div class="custom-grid">
          <label>Size<select name="size">${normalizeArray(product.sizes).map((x) => `<option>${x}</option>`).join("")}</select></label>
          <label>Color<select name="color">${normalizeArray(product.colors).map((x) => `<option>${x}</option>`).join("")}</select></label>
          <label>Name or initials<input name="initials" maxlength="40" placeholder="Example: TZ"></label>
          <label>Protection level<select name="protection_level"><option>${safetyName(product)}</option><option>Medium</option><option>High</option><option>Very High</option></select></label>
          <label>Material type<select name="material_type">${normalizeArray(product.materials).map((x) => `<option>${x}</option>`).join("")}</select></label>
          <label>Order notes<textarea name="notes" placeholder="Special fit, delivery, or design notes"></textarea></label>
        </div>
        <button class="btn primary" type="submit">Add customized product to cart</button>
      </form>
    </article>
  `;
  $("#customForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const customization = Object.fromEntries(new FormData(event.currentTarget).entries());
    addToCart(product, customization);
    location.href = "cart.html";
  });
  applyImageFallbacks();
}

function renderCartPage() {
  const cart = readCart();
  const delivery = cart.length ? 15 : 0;
  $("#cartItems").innerHTML = cart.map((item) => `
    <article class="cart-item">
      ${imageMarkup(item, "cart-image")}
      <div>
        <strong>${item.name}</strong>
        <p class="form-message">${item.category || ""} | ${item.safety_level || ""}</p>
        <p class="form-message">${Object.values(item.customization || {}).filter(Boolean).join(" | ")}</p>
      </div>
      <div class="cart-actions">
        <div class="qty-control"><button data-qty="${item.key}" data-delta="-1">-</button><strong>${item.quantity}</strong><button data-qty="${item.key}" data-delta="1">+</button></div>
        <button class="remove-btn" data-remove="${item.key}">X</button>
      </div>
    </article>
  `).join("") || `<p class="form-message">Your cart is empty.</p>`;
  $("#cartSubtotal").textContent = money.format(cartSubtotal());
  $("#cartTotal").textContent = money.format(cartSubtotal() + delivery);
  document.querySelectorAll("[data-remove]").forEach((button) => button.addEventListener("click", () => { removeFromCart(button.dataset.remove); renderCartPage(); }));
  document.querySelectorAll("[data-qty]").forEach((button) => button.addEventListener("click", () => { changeQuantity(button.dataset.qty, Number(button.dataset.delta)); renderCartPage(); }));
  applyImageFallbacks();
}

function renderCheckoutItems() {
  const cart = readCart();
  const delivery = cart.length ? 15 : 0;
  $("#checkoutItems").innerHTML = cart.map((item) => `<div class="summary-line"><span>${item.name} x ${item.quantity}</span><strong>${money.format(item.price * item.quantity)}</strong></div>`).join("");
  $("#checkoutTotal").textContent = money.format(cartSubtotal() + delivery);
}

async function handleCheckout(event) {
  event.preventDefault();
  const message = $("#checkoutMessage");
  const cart = readCart();
  if (!cart.length) {
    message.textContent = "Your cart is empty.";
    message.className = "form-message error";
    return;
  }
  if (!window.motoSupabase) return;

  const form = Object.fromEntries(new FormData(event.currentTarget).entries());
  message.textContent = "Saving order to Supabase...";
  const { data: customer, error: customerError } = await window.motoSupabase.from("customers").insert({
    full_name: form.full_name,
    email: form.email,
    phone: form.phone,
    address: form.address
  }).select().single();
  if (customerError) return showFormError(message, customerError.message);

  const total = cartSubtotal() + 15;
  const { data: order, error: orderError } = await window.motoSupabase.from("orders").insert({
    customer_id: customer.id,
    status: "Pending",
    total_amount: total,
    order_notes: form.order_notes || ""
  }).select().single();
  if (orderError) return showFormError(message, orderError.message);

  for (const item of cart) {
    const { data: orderItem, error: itemError } = await window.motoSupabase.from("order_items").insert({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.price * item.quantity
    }).select().single();
    if (itemError) return showFormError(message, itemError.message);
    await window.motoSupabase.from("product_customizations").insert({
      order_item_id: orderItem.id,
      product_id: item.product_id,
      size: item.customization?.size || "",
      color: item.customization?.color || "",
      initials: item.customization?.initials || "",
      protection_level: item.customization?.protection_level || item.safety_level || "",
      material_type: item.customization?.material_type || "",
      notes: item.customization?.notes || ""
    });
  }

  const { error: paymentError } = await window.motoSupabase.from("payments").insert({
    order_id: order.id,
    payment_method: form.payment_method,
    payment_status: "Demo pending",
    amount: total
  });
  if (paymentError) return showFormError(message, paymentError.message);

  saveCart([]);
  renderCheckoutItems();
  message.textContent = `Order saved. Your demo order number is ${order.id.slice(0, 8)}.`;
  message.className = "form-message ok";
}

function showFormError(element, text) {
  element.textContent = text;
  element.className = "form-message error";
}

async function handleContact(event) {
  event.preventDefault();
  const message = $("#contactMessage");
  const form = Object.fromEntries(new FormData(event.currentTarget).entries());
  const { error } = await window.motoSupabase.from("contact_messages").insert(form);
  if (error) return showFormError(message, error.message);
  await sendMessageToTelegram(form);
  message.textContent = "Message saved. Telegram placeholder was called.";
  message.className = "form-message ok";
  event.currentTarget.reset();
}

async function renderAdmin() {
  await loadProducts();
  const [orders, messages] = await Promise.all([
    window.motoSupabase?.from("orders").select("*, customers(full_name), payments(payment_method)").order("created_at", { ascending: false }).limit(10),
    window.motoSupabase?.from("contact_messages").select("id")
  ]);
  $("#adminProducts").textContent = products.length;
  $("#adminOrders").textContent = orders?.data?.length || 0;
  $("#adminMessages").textContent = messages?.data?.length || 0;
  $("#adminProductsGrid").innerHTML = products.slice(0, 4).map((product) => `
    <article class="product-card">
      ${imageMarkup(product)}
      <div class="product-body">
        <div class="product-meta"><span class="tag">${categoryName(product)}</span><span class="tag safety">${safetyName(product)}</span></div>
        <h3>${product.name}</h3>
        <strong class="price">${money.format(Number(product.price))}</strong>
      </div>
    </article>
  `).join("");
  $("#adminOrdersTable").innerHTML = (orders?.data || []).map((order) => `
    <tr><td>${order.customers?.full_name || "Customer"}</td><td>${order.status}</td><td>${money.format(order.total_amount)}</td><td>${order.payments?.[0]?.payment_method || "Pending"}</td></tr>
  `).join("") || `<tr><td colspan="4">No orders yet.</td></tr>`;
  applyImageFallbacks();
}

document.addEventListener("DOMContentLoaded", async () => {
  renderHeader();
  renderFooter();
  const page = pageName();
  if (page === "home") await renderHome();
  if (page === "products") await renderProductsPage();
  if (page === "details") await renderDetails();
  if (page === "cart") renderCartPage();
  if (page === "checkout") {
    renderCheckoutItems();
    $("#checkoutForm").addEventListener("submit", handleCheckout);
  }
  if (page === "contact") $("#contactForm").addEventListener("submit", handleContact);
  if (page === "admin") await renderAdmin();
});
