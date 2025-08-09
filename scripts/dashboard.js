// Make sure to include the following scripts in your HTML before this JS file:
// <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js"></script>

const firebaseConfig = {
  apiKey: "AIzaSyAPXdtOIrAHuvwXSlP_oxPgwiCOXMkxMvU",
  authDomain: "style-and-space.firebaseapp.com",  
  projectId: "style-and-space",
  storageBucket: "style-and-space.appspot.com",
  messagingSenderId: "741061813433",
  appId: "1:741061813433:web:3318357d975b43e36f2768",
  measurementId: "G-3RCMJ7CX73"
};

firebase.initializeApp(firebaseConfig);

// Redirect to login if not authenticated
firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    // Not logged in, redirect to login
    window.location.href = "login.html";
  } else {
    console.log("✅ Admin access granted");
  }
});

const db = firebase.firestore();

const productForm = document.getElementById("product-form");
const productTableBody = document.getElementById("product-table-body");

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    title: title.value,
    price: price.value,
    category: category.value,
    amazonLink: amazonLink.value,
    description: description.value,
    ratingStars: ratingStars.value,
    ratingText: ratingText.value,
    badge: badge.value,
    images: images.value.split(",").map(url => url.trim()),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  const id = productId.value.trim();
  if (id) {
    await db.collection("products").doc(id).update(data);
  } else {
    await db.collection("products").add(data);
  }
  productForm.reset();
  loadProducts();
});

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const uid = user.uid;
    db.collection('adminUsers').doc(uid).get().then(doc => {
      if (doc.exists && doc.data().role === 'admin') {
        // Show admin features
        console.log("✅ Admin access granted");
      } else {
        console.log("❌ Not an admin");
      }
    });
  }
});


    async function loadProducts() {
      productTableBody.innerHTML = "";
      const snapshot = await db.collection("products").get();
    snapshot.forEach((doc) => {
      const product = doc.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${product.title}</td>
        <td>₹${product.price}</td>
        <td>${product.category}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2" data-edit-id="${doc.id}">Edit</button>
          <button class="btn btn-sm btn-danger" data-delete-id="${doc.id}">Delete</button>
        </td>
      `;
      productTableBody.appendChild(tr);
    });
  }

  async function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
      await db.collection("products").doc(id).delete();
      loadProducts();
    }
  }
  
  async function editProduct(id) {
    const doc = await db.collection("products").doc(id).get();
    const data = doc.data();
    productId.value = id;
    title.value = data.title;
    category.value = data.category;
    price.value = data.price;
    amazonLink.value = data.amazonLink;
    description.value = data.description;
    ratingStars.value = data.ratingStars;
    ratingText.value = data.ratingText;
    badge.value = data.badge;
    images.value = data.images.join(", ");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Attach event listeners after DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    productTableBody.addEventListener('click', async (e) => {
      if (e.target.matches('[data-edit-id]')) {
        await editProduct(e.target.getAttribute('data-edit-id'));
      }
      if (e.target.matches('[data-delete-id]')) {
        await deleteProduct(e.target.getAttribute('data-delete-id'));
      }
    });
    loadProducts();
  });

  // Logout function
  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn.addEventListener('click', () => {
    firebase.auth().signOut()
      .then(() => {
        alert('Logged out successfully!');
        // Redirect to login page or reload
        window.location.href = 'login.html'; // Change to your login page
      })
      .catch(error => {
        console.error('Logout error:', error);
      });

  });
