// COUNTDOWN TIMER
const countdown = () => {
  // Set sale end date (change this to any date/time)
  const saleEndDate = new Date("May 8, 2026 23:59:59").getTime();
  
  const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = saleEndDate - now;

    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display
    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;

    // If expired
    if (distance < 0) {
      clearInterval(timer);
      document.getElementById("countdown").innerHTML = "🔥 Flash Sale Ends Soon 🔥";
    }
  }, 1000);
};

countdown();

document.addEventListener("DOMContentLoaded", () => {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  let total = 0;

  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const name = button.dataset.name;
      const price = Number(button.dataset.price); // ✅ ensures it's a number

      // Add item to cart
      const li = document.createElement("li");
      li.textContent = `${name} - Ksh ${price}`;
      cartItems.appendChild(li);

      // Update total
      total += price;
      cartTotal.textContent = `Total: Ksh ${total}`;
    });
  });
});

 document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const priceFilter = document.getElementById("priceFilter");
  const productList = document.querySelector(".category-products");
  const products = Array.from(document.querySelectorAll(".product-card"));

  function filterProducts() {
    const searchText = searchInput.value.toLowerCase();
    const sortValue = sortSelect.value;
    const priceValue = priceFilter.value;

    let filtered = products.filter(product => {
      const name = product.dataset.name.toLowerCase();
      const price = parseInt(product.dataset.price);

      // Search
      let matchesSearch = name.includes(searchText);

      // Price
      let matchesPrice = true;
      if (priceValue === "0-1000") matchesPrice = price <= 1000;
      else if (priceValue === "1000-2500") matchesPrice = price >= 1000 && price <= 2500;
      else if (priceValue === "2500-5000") matchesPrice = price >= 2500 && price <= 5000;
       else if (priceValue === "5000-7500") matchesPrice = price >= 5000 && price <= 7500;
        else if (priceValue === "7500-10000") matchesPrice = price >= 7500 && price <= 10000;
      else if (priceValue === "10000") matchesPrice = price > 10000;

      return matchesSearch && matchesPrice;
    });

    // Hide all
    products.forEach(p => p.style.display = "none");

    // Show only filtered
    filtered.forEach(p => p.style.display = "block");

    // Sorting
    if (sortValue) {
      filtered.sort((a, b) => {
        return sortValue === "low-high"
          ? a.dataset.price - b.dataset.price
          : b.dataset.price - a.dataset.price;
      });

      filtered.forEach(p => productList.appendChild(p));
    }
  }

  searchInput.addEventListener("input", filterProducts);
  sortSelect.addEventListener("change", filterProducts);
  priceFilter.addEventListener("change", filterProducts);
});



let cart = [];



// Check if user is logged in
  const user = localStorage.getItem("username");
  const userArea = document.getElementById("user-area");

  if (user) {
    userArea.innerHTML = `
      <span>Hello, <strong>${user}</strong></span> 
      <button onclick="logout()">Logout</button>
    `;
  }

  function logout() {
    localStorage.removeItem("username");
    window.location.href = "index.html"; // refresh home
  }

  // Get all "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  addToCartButtons.forEach(button => {
    button.addEventListener("click", function () {
      // Find product info from the parent div
      const productCard = this.closest(".product-card");
      const name = productCard.getAttribute("data-name");
      const price = productCard.getAttribute("data-price");
      const size = productCard.querySelector("select").value;

      // Get existing cart from localStorage or create empty one
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Add product to cart
      cart.push({
        name: name,
        price: price,
        size: size,
        quantity: 1
      });

      // Save back to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      alert(`${name} (${size}) added to cart!`);
    });
  });


function updateCartCount() {
  const cart = getCart();
  let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = totalItems;
}
// script.js - shared cart logic (include on all pages, before </body>)
(function () {
  const CART_KEY = "cart"; // keep this same everywhere

  // get cart (array of {name, price, image?, quantity})
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      console.error("Invalid cart JSON:", e);
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  // update the cart count badge (span#cart-count)
  function updateCartCount() {
    const el = document.getElementById("cart-count");
    if (!el) return;
    const cart = getCart();
    const count = cart.reduce((s, it) => s + (it.quantity || 0), 0);
    el.textContent = count;
  }

  // Public: add item to cart (call from buttons)
  window.addToCart = function (name, price, image) {
    if (!name || price == null) {
      console.warn("addToCart missing name or price", name, price);
      return;
    }

    const cart = getCart();

    // normalize price number (allow strings)
    const priceNum = Number(String(price).replace(/[^0-9.-]+/g, "")) || 0;

    const idx = cart.findIndex(it => it.name === name);
    if (idx > -1) {
      cart[idx].quantity = (cart[idx].quantity || 0) + 1;
    } else {
      cart.push({ name, price: priceNum, image: image || "", quantity: 1 });
    }

    saveCart(cart);
    updateCartCount();
    // small non-blocking toast instead of alert (alert blocks)
    if (window.toastr) {
      toastr.success(`${name} added to cart`);
    } else {
      console.log(`${name} added to cart`);
    }
  };

  // Hook: attach to elements with class "add-to-cart" (if present)
  function bindButtons() {
    document.querySelectorAll(".add-to-cart").forEach(btn => {
      // ensure not double-binding
      if (btn.dataset.addCartBound) return;
      btn.dataset.addCartBound = "1";

      // prefer using button type="button" to avoid form submit
      btn.addEventListener("click", (e) => {
        // prevent accidental form submit
        if (e.target.type === "submit") e.preventDefault();

        // read data attributes
        const name = btn.dataset.name || btn.getAttribute("data-name");
        let price = btn.dataset.price || btn.getAttribute("data-price");
        const size = btn.dataset.size || btn.getAttribute("option") || "";

        // sanitize price (strip Ksh, commas)
        price = Number(String(price).replace(/[^0-9.-]+/g, ""));

        addToCart(name, price, size);
      });
    });
  }

  // For cart page: render table body with id="cart-body" and place total in id="cart-total"
  window.renderCartPage = function () {
    const cart = getCart();
    const tbody = document.getElementById("cart-body"); // recommended id in cart.html
    const totalEl = document.getElementById("cart-total");

    if (!tbody) {
      // backward-compat: try other ids
      console.warn("cart tbody not found (expected id='cart-body')");
      return;
    }

    tbody.innerHTML = "";
    let grand = 0;

    if (cart.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="5" style="text-align:center; padding:20px;">Your cart is empty.</td>`;
      tbody.appendChild(tr);
      if (totalEl) totalEl.textContent = "Total: Ksh 0";
      return;
    }

    cart.forEach((it, i) => {
      const row = document.createElement("tr");
      const itemTotal = (Number(it.price) || 0) * (it.quantity || 0);
      grand += itemTotal;

      row.innerHTML = `
        <td style="text-align:left; padding:10px;">
          ${it.image ? `<img src="${it.image}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;margin-right:10px;vertical-align:middle;">` : ""}
          <span style="vertical-align:middle">${it.name}</span>
        </td>
        <td>Ksh ${Number(it.price).toFixed(2)}</td>
        <td>
          <button data-action="dec" data-index="${i}">-</button>
          <span style="margin:0 8px">${it.quantity}</span>
          <button data-action="inc" data-index="${i}">+</button>
        </td>
        <td>Ksh ${itemTotal.toFixed(2)}</td>
        <td><button data-action="remove" data-index="${i}">Remove</button></td>
      `;

      tbody.appendChild(row);
    });

    if (totalEl) totalEl.textContent = "Total: Ksh " + grand.toFixed(2);

    // attach delegated listeners to buttons in tbody
    tbody.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const action = btn.dataset.action;
        const idx = Number(btn.dataset.index);
        modifyCartItem(action, idx);
      });
    });

    updateCartCount();
  };

  function modifyCartItem(action, index) {
    const cart = getCart();
    if (index < 0 || index >= cart.length) return;
    if (action === "inc") {
      cart[index].quantity = (cart[index].quantity || 0) + 1;
    } else if (action === "dec") {
      cart[index].quantity = (cart[index].quantity || 0) - 1;
      if (cart[index].quantity <= 0) cart.splice(index, 1);
    } else if (action === "remove") {
      cart.splice(index, 1);
    }
    saveCart(cart);
    renderCartPage();
  }

  // Make functions available globally for debugging
  window._cartHelpers = { getCart, saveCart, updateCartCount, bindButtons, renderCartPage };

  // On DOM ready
  document.addEventListener("DOMContentLoaded", function () {
    bindButtons();
    updateCartCount();

    // If we are on cart page, call renderCartPage automatically
    if (document.getElementById("cart-body")) {
      renderCartPage();
    }
  });

})();

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();

  // Select all add-to-cart buttons
  const buttons = document.querySelectorAll(".add-to-cart");

  buttons.forEach(button => {
    // Remove old listeners first (important if script loads multiple times)
    button.replaceWith(button.cloneNode(true));
  });

  // Re-select after cloning
  const freshButtons = document.querySelectorAll(".add-to-cart");

  freshButtons.forEach(button => {
    button.addEventListener("click", function () {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      let name = this.getAttribute("data-name");
      let price = parseFloat(this.getAttribute("data-price"));
      let size = this.getAttribute("option");

      if (!name || isNaN(price)) {
        alert("Error: Product details are missing!");
        return;
      }

      // Find product in cart
      let existing = cart.find(item => item.name === name);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: Date.now(),
          name: name,
          price: price,
         size:size,
          quantity: 1
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      alert(name + " added to cart!");
    });
  });
});

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}

function addToCart(productName, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Get the selected size from the dropdown
    let selectedSize = document.getElementById("size").value;

    // Create the item object with size included
    let item = {
        name: productName,
        price: price,
        quantity: 1,
        size: selectedSize   // 👈 save size here
    };

    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Item added to cart!");
}

function toggleMenu() {
  document.querySelector("nav ul").classList.toggle("active");
}
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('active');  // adds/removes 'active' class
});

 function toggleMenu() {
    document.getElementById("navMenu").classList.toggle("show-menu");
  }

  