document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
     SEARCH
  ===================================================== */

  const searchInput = document.querySelector(".category-search input");

  const searchButton = document.querySelector(".category-search button");

  const productCards = document.querySelectorAll(".category-product-card");

  function searchProducts() {
    if (!searchInput) return;

    const keyword = searchInput.value.trim().toLowerCase();

    productCards.forEach((card) => {
      const title = card.querySelector("h3")?.textContent.toLowerCase() || "";

      if (keyword === "" || title.includes(keyword)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", searchProducts);
  }

  if (searchInput) {
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        searchProducts();
      }
    });

    searchInput.addEventListener("input", searchProducts);
  }

  /* =====================================================
     BOOKMARK
  ===================================================== */

  const bookmarkButtons = document.querySelectorAll(".category-bookmark");

  bookmarkButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      button.classList.toggle("active");
    });
  });

  /* =====================================================
     ADD TO CART
  ===================================================== */

  const cartButtons = document.querySelectorAll(".category-cart");

  cartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      button.classList.toggle("active");
    });
  });

  /* =====================================================
     CATEGORY ITEM
  ===================================================== */

  const categoryItems = document.querySelectorAll(".category-item");

  categoryItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Giữ nguyên hành vi chuyển trang của href
    });
  });

  /* =====================================================
     PRODUCT CARD
  ===================================================== */

  productCards.forEach((card) => {
    const bookmark = card.querySelector(".category-bookmark");

    const cart = card.querySelector(".category-cart");

    if (bookmark) {
      bookmark.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    }

    if (cart) {
      cart.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    }
  });

  /* =====================================================
     SORT
  ===================================================== */

  const sortSelect = document.querySelector(".category-products-header select");

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      const cards = Array.from(
        document.querySelectorAll(".category-product-card"),
      );

      const grid = document.querySelector(".products-grid");

      if (!grid) return;

      const value = sortSelect.value;

      cards.sort((a, b) => {
        const titleA =
          a.querySelector("h3")?.textContent.trim().toLowerCase() || "";

        const titleB =
          b.querySelector("h3")?.textContent.trim().toLowerCase() || "";

        const priceA = parseInt(
          a
            .querySelector(".category-product-price")
            ?.textContent.replace(/\D/g, "") || "0",
        );

        const priceB = parseInt(
          b
            .querySelector(".category-product-price")
            ?.textContent.replace(/\D/g, "") || "0",
        );

        switch (value) {
          case "price-asc":
            return priceA - priceB;

          case "price-desc":
            return priceB - priceA;

          case "name-asc":
            return titleA.localeCompare(titleB);

          case "name-desc":
            return titleB.localeCompare(titleA);

          default:
            return 0;
        }
      });

      cards.forEach((card) => {
        grid.appendChild(card);
      });
    });
  }
});
