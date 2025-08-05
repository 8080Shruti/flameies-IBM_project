const products = [
  { id: 1, name: "Lavender Bliss", price: 100, fragrance: "Lavender", image: "https://via.placeholder.com/150?text=Lavender" },
  { id: 2, name: "Vanilla Dream", price: 200, fragrance: "Vanilla", image: "https://via.placeholder.com/150?text=Vanilla" },
  { id: 3, name: "Rose Petal", price: 300, fragrance: "Rose", image: "https://via.placeholder.com/150?text=Rose" },
  { id: 4, name: "Sandalwood Glow", price: 400, fragrance: "Sandalwood", image: "https://via.placeholder.com/150?text=Sandalwood" },
  { id: 5, name: "Citrus Breeze", price: 500, fragrance: "Citrus", image: "https://via.placeholder.com/150?text=Citrus" }
];

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("productList");
  const fragranceFilter = document.getElementById("fragranceFilter");
  const priceFilter = document.getElementById("priceFilter");

  if (productList) {
    renderProducts(products);
  }

  // Attach filter events
  if (fragranceFilter && priceFilter) {
    fragranceFilter.addEventListener("change", filterAndRender);
    priceFilter.addEventListener("change", filterAndRender);
  }

  // Initialize login UI
  updateLoginUI();

  // Login/Logout event listeners
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginBtn) {
    loginBtn.onclick = () => {
      const name = prompt("Enter your name to login:");
      if (name) {
        localStorage.setItem("user", name);
        updateLoginUI();
      }
    };
  }

  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem("user");
      updateLoginUI();
    };
  }
});

// Check if user is logged in
function isUserLoggedIn() {
  return localStorage.getItem("user") !== null;
}

// Function to render products
function renderProducts(list) {
  const container = document.getElementById("productList");
  if (!container) return;

  container.innerHTML = ""; // Clear previous

  if (list.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  list.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>Price: ₹${product.price}</p>
      <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
      <button class="btn" onclick="addToWishlist(${product.id})">Add to Wishlist</button>
    `;
    container.appendChild(div);
  });
}

// Filter products and render
function filterAndRender() {
  const fragrance = document.getElementById("fragranceFilter").value;
  const price = document.getElementById("priceFilter").value;

  let filtered = [...products];

  if (fragrance !== "all") {
    filtered = filtered.filter(p => p.fragrance === fragrance);
  }

  if (price === "low") {
    filtered = filtered.filter(p => p.price < 300);
  } else if (price === "high") {
    filtered = filtered.filter(p => p.price >= 300);
  }

  renderProducts(filtered);
}

// Add to Cart (with login check)
function addToCart(id) {
  if (!isUserLoggedIn()) {
    alert("Please log in or register to add items to your cart.");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = products.find(p => p.id === id);
  if (!cart.some(p => p.id === id)) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart`);
  } else {
    alert("Item is already in cart");
  }
}

// Add to Wishlist (with login check)
function addToWishlist(id) {
  if (!isUserLoggedIn()) {
    alert("Please log in or register to add items to your wishlist.");
    return;
  }

  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const product = products.find(p => p.id === id);
  if (!wishlist.some(p => p.id === id)) {
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert(`${product.name} added to wishlist`);
  } else {
    alert("Already in wishlist");
  }
}

// Update Login UI
function updateLoginUI() {
  const loginStatus = document.getElementById("loginStatus");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const user = localStorage.getItem("user");

  if (loginStatus && loginBtn && logoutBtn) {
    if (user) {
      loginStatus.textContent = `Welcome, ${user}`;
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
    } else {
      loginStatus.textContent = "Welcome, Guest";
      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
    }
  }
}

// Save address to localStorage
function saveAddress() {
  const address = document.getElementById("addressInput").value.trim();
  if (!address) {
    alert("Please enter a valid address.");
    return;
  }
  localStorage.setItem("deliveryAddress", address);
  alert("Address saved successfully!");
}

// Retrieve address
function getSavedAddress() {
  return localStorage.getItem("deliveryAddress") || "";
}

// Check if address exists
function isAddressSaved() {
  return getSavedAddress() !== "";
}

// Pre-fill the address if already saved
document.addEventListener("DOMContentLoaded", () => {
  const saved = getSavedAddress();
  const addressInput = document.getElementById("addressInput");
  if (addressInput && saved) {
    addressInput.value = saved;
  }
});

function trackProduct(name, image) {
  if (!isAddressSaved()) {
    alert("Please enter and save your delivery address before ordering.");
    // Scroll to address section
    document.getElementById("addressSection").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const orderDetails = {
    id: `ORD${Date.now()}`,
    name,
    image,
    address: getSavedAddress(),
    delivery: generateDeliveryDate(), // you already have this function
    status: "Shipped"
  };

  localStorage.setItem("currentOrder", JSON.stringify(orderDetails));
  window.location.href = "order.html"; // or wherever you're redirecting
}
