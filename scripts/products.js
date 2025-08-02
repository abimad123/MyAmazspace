import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAPXdtOIrAHuvwXSlP_oxPgwiCOXMkxMvU",
  authDomain: "style-and-space.firebaseapp.com",
  projectId: "style-and-space",
  storageBucket: "style-and-space.appspot.com",
  messagingSenderId: "741061813433",
  appId: "1:741061813433:web:3318357d975b43e36f2768",
  measurementId: "G-3RCMJ7CX73"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const filterTabs = document.querySelectorAll(".filter-tab");
const searchInput = document.querySelector("#product-search");
const sortSelect = document.getElementById("sort-select");
const productsGrid = document.getElementById("products-grid");
const viewMoreBtn = document.getElementById("view-more-btn");

let allProducts = [];
let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'newest';
let currentPage = 1;
const productsPerPage = 60;

// Fetch and initialize
document.addEventListener("DOMContentLoaded", async () => {
  const querySnapshot = await getDocs(collection(db, "products"));
  allProducts = querySnapshot.docs.map(doc => doc.data());
  applyFiltersAndSort(true);
});

// Filter tabs
filterTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    filterTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentCategory = tab.dataset.filter || "all";
    currentPage = 1;
    applyFiltersAndSort(true);
  });
});

// Search input (live)
searchInput.addEventListener("input", () => {
  currentSearch = searchInput.value;
  currentPage = 1;
  applyFiltersAndSort(true);
});

// Sort select
sortSelect?.addEventListener("change", e => {
  currentSort = e.target.value;
  currentPage = 1;
  applyFiltersAndSort(true);
});

// View More Button
viewMoreBtn?.addEventListener("click", () => {
  currentPage++;
  applyFiltersAndSort(false);
});

// Filter + Sort + Paginate
function applyFiltersAndSort(reset = true) {
  let filtered = [...allProducts];

  // Category filter
  if (currentCategory !== "all") {
    filtered = filtered.filter(p => (p.category || '').toLowerCase() === currentCategory.toLowerCase());
  }

  // Search filter
  if (currentSearch.trim() !== "") {
    const keyword = currentSearch.toLowerCase();
    filtered = filtered.filter(p =>
      (p.title || p.name || '').toLowerCase().includes(keyword) ||
      (p.category || '').toLowerCase().includes(keyword)
    );
  }

  // Sorting
  switch (currentSort) {
    case "price-asc":
      filtered.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
      break;
    case "price-desc":
      filtered.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
      break;
    case "name-asc":
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      break;
    case "name-desc":
      filtered.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
      break;
    case "newest":
    default:
      filtered.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      break;
  }

  // Pagination
  const start = 0;
  const end = currentPage * productsPerPage;
  const toRender = filtered.slice(start, end);

  renderProducts(toRender, reset);

  // Show/hide View More button
  viewMoreBtn.style.display = toRender.length >= filtered.length ? "none" : "inline-block";
}

// Render products
function renderProducts(products, reset = true) {
  const html = products.map(product => `
    <div class="product-card" data-category="${product.category || ''}">
      <div class="product-card-body">
        <div class="product-card-header">
          <img src="${product.images?.[0] || 'placeholder.jpg'}" alt="${product.title || product.name || ''}" class="product-image" />
          ${product.badge ? `<div class="product-card-badge">${product.badge}</div>` : ''}
          <div class="product-card-category">${product.category || ''}</div>
          <div class="product-card-title">${product.title || product.name || ''}</div>
          <div class="product-card-desc">${product.description || ''}</div>
          <div class="product-card-rating">${product.ratingStars || ""} ${product.ratingText || ""}</div>
        </div>
        <div class="product-card-meta" style="margin-top: 12px;">
          <div class="product-card-price">₹${product.price || 0}</div>
          <a href="${product.amazonLink}" class="product-card-btn" target="_blank"> View on Amazon</a>
        </div>
      </div>
    </div>
  `).join("");

  if (reset) {
    productsGrid.innerHTML = html;
  } else {
    productsGrid.insertAdjacentHTML("beforeend", html);
  }
}

