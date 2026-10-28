
document.addEventListener("DOMContentLoaded", function () {
  // Shop details
  document.title = `${shop.name} | ${shop.category}`;

  document.getElementById("shopName").textContent = shop.name;
  document.getElementById("footerShopName").textContent = shop.name;
  document.getElementById("heroTitle").innerHTML =
    "Everyday Elegance.<br>Timeless Style.";
  document.getElementById("shopCity").textContent = shop.city;
  document.getElementById("currentYear").textContent =
    new Date().getFullYear();

  const productContainer = document.getElementById("productContainer");
  const searchInput = document.getElementById("productSearch");
  const categoryButtons = document.querySelectorAll(".filter-btn");
  const noProducts = document.getElementById("noProducts");
  const whatsappButton = document.getElementById("whatsappButton");

  let selectedCategory = "All";

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function showProducts() {
    const searchText = searchInput.value.trim().toLowerCase();

    const filteredProducts = shop.products.filter(function (product) {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText) ||
        (product.description || "").toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });

    productContainer.innerHTML = filteredProducts.map(function (product, index) {
      const productName = escapeHTML(product.name);
      const productCategory = escapeHTML(product.category);
      const productDescription = escapeHTML(product.description || "");
      const productImage = escapeHTML(product.image);

      const message = encodeURIComponent(
        `Hello ${shop.name}, I would like to enquire about ${product.name}.`
      );

      const phone = String(shop.phone).replace(/\D/g, "");
      const validPhone = /^\d{10,15}$/.test(phone);

      const enquiryLink = validPhone
        ? `https://wa.me/${phone}?text=${message}`
        : "#contact";

      return `
        <div class="col-6 col-md-4 col-xl-3">
          <article class="product-card" style="animation-delay:${index * 70}ms">
            <div class="product-image-wrap">
              <img
                src="${productImage}"
                alt="${productName}"
                class="product-image"
                loading="lazy"
                onerror="this.onerror=null;this.src='https://placehold.co/700x900/f0e8dc/242424?text=Fashion+Needs';"
              >
            </div>

            <div class="product-card-body">
              <span class="product-category">${productCategory}</span>
              <h3>${productName}</h3>
              <p>${productDescription}</p>
              <a
                class="product-enquiry"
                href="${enquiryLink}"
                ${validPhone ? 'target="_blank" rel="noopener noreferrer"' : ""}
              >ENQUIRE ↗</a>
            </div>
          </article>
        </div>
      `;
    }).join("");

    noProducts.hidden = filteredProducts.length !== 0;
  }

  // Category filters
  categoryButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      selectedCategory = button.dataset.category;

      categoryButtons.forEach(function (item) {
        item.classList.toggle("active", item === button);
      });

      showProducts();
    });
  });

  // Live search
  searchInput.addEventListener("input", showProducts);

  // Navbar category links
  document.querySelectorAll("[data-nav-category]").forEach(function (link) {
    link.addEventListener("click", function () {
      selectedCategory = link.dataset.navCategory;

      categoryButtons.forEach(function (button) {
        button.classList.toggle(
          "active",
          button.dataset.category === selectedCategory
        );
      });

      showProducts();
    });
  });

  // Main WhatsApp contact button
  const phone = String(shop.phone).replace(/\D/g, "");

  if (/^\d{10,15}$/.test(phone)) {
    const message = encodeURIComponent(
      `Hello ${shop.name}, I would like to know about your collection.`
    );

    whatsappButton.href = `https://wa.me/${phone}?text=${message}`;
  } else {
    whatsappButton.href = "#about";
  }

  showProducts();
});
