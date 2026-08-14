document.addEventListener("DOMContentLoaded", async () => {
  /* =====================================================
     LOAD BOOK.JSON
  ===================================================== */

  let books = [];

  try {
    const response = await fetch("../data/book.json");

    if (!response.ok) {
      throw new Error("Không đọc được book.json");
    }

    books = await response.json();

    if (!Array.isArray(books)) {
      throw new Error("book.json không phải là một mảng");
    }

    console.log("BOOK JSON:", books);
  } catch (error) {
    console.error("LỖI LOAD BOOK.JSON:", error);
    return;
  }

  if (books.length === 0) {
    console.error("book.json không có sản phẩm.");
    return;
  }

  /* =====================================================
     ELEMENTS
  ===================================================== */

  const searchInput = document.querySelector(".category-search input");
  const searchButton = document.querySelector(".category-search button");

  const resultsKeyword = document.querySelector(".results-keyword");

  const categoryDropdown = document.querySelector("#categoryDropdown");
  const categoryButton = document.querySelector("#categoryDropdownBtn");
  const categoryMenu = document.querySelector("#categoryDropdownMenu");

  const filterDropdown = document.querySelector("#filterDropdown");
  const filterButton = document.querySelector("#filterDropdownBtn");
  const filterMenu = document.querySelector("#filterDropdownMenu");

  const catalogResults = document.querySelector("#catalogResults");
  const emptyResults = document.querySelector("#emptyResults");

  /* =====================================================
     URL SEARCH
  ===================================================== */

  const params = new URLSearchParams(window.location.search);

  const keywordFromURL = params.get("search") || "";

  if (searchInput && keywordFromURL) {
    searchInput.value = keywordFromURL;
  }

  /* =====================================================
     STATE
  ===================================================== */

  let selectedCategory = "all";
  let selectedFilter = "";

  /* =====================================================
     CATEGORY
  ===================================================== */

  const categories = [
    "all",
    "Đại cương",
    "Ngoại ngữ",
    "Kỹ thuật - Công nghệ",
    "Kỹ năng - Văn học",
  ];

  /* =====================================================
     FILTER
  ===================================================== */

  const filters = ["az", "za", "price-low", "price-high"];

  /* =====================================================
     NORMALIZE TEXT
  ===================================================== */

  function normalizeText(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }

  /* =====================================================
     UPDATE URL SEARCH
  ===================================================== */

  function updateSearchURL(keyword) {
    const url = new URL(window.location.href);

    const text = String(keyword || "").trim();

    if (text) {
      url.searchParams.set("search", text);
    } else {
      url.searchParams.delete("search");
    }

    window.history.replaceState({}, "", url);
  }

  /* =====================================================
     GET CATEGORY
  ===================================================== */

  function getBookCategory(book) {
    if (!book) {
      return "";
    }

    return String(
      book.category ??
        book.categoryName ??
        book.categoryId ??
        book.type ??
        book.typeName ??
        "",
    ).trim();
  }

  /* =====================================================
     GET CATEGORY BOOKS
  ===================================================== */

  function getCategoryBooks(list, category) {
    if (!category || category === "all") {
      return [...list];
    }

    const selected = normalizeText(category);

    return list.filter((book) => {
      const bookCategory = normalizeText(getBookCategory(book));

      return bookCategory === selected;
    });
  }

  /* =====================================================
     SEARCH BOOKS
  ===================================================== */

  function searchBooks(list, keyword) {
    const text = normalizeText(keyword);

    if (!text) {
      return [...list];
    }

    return list.filter((book) => {
      const name = normalizeText(book.name);
      const author = normalizeText(book.author);

      return name.includes(text) || author.includes(text);
    });
  }

  /* =====================================================
     SORT BOOKS
  ===================================================== */

  function sortBooks(list, filter) {
    const result = [...list];

    switch (filter) {
      /* A → Z */
      case "az":
        result.sort((a, b) => {
          return String(a.name || "").localeCompare(
            String(b.name || ""),
            "vi",
            {
              sensitivity: "base",
            },
          );
        });
        break;

      /* Z → A */
      case "za":
        result.sort((a, b) => {
          return String(b.name || "").localeCompare(
            String(a.name || ""),
            "vi",
            {
              sensitivity: "base",
            },
          );
        });
        break;

      /* GIÁ THẤP → CAO */
      case "price-low":
        result.sort((a, b) => {
          return Number(a.price || 0) - Number(b.price || 0);
        });
        break;

      /* GIÁ CAO → THẤP */
      case "price-high":
        result.sort((a, b) => {
          return Number(b.price || 0) - Number(a.price || 0);
        });
        break;
    }

    return result;
  }

  /* =====================================================
     BOOKMARK STORAGE
  ===================================================== */

  function getBookmarks() {
    try {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

      return Array.isArray(bookmarks) ? bookmarks : [];
    } catch {
      return [];
    }
  }

  function saveBookmarks(bookmarks) {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }

  function isBookmarked(id) {
    return getBookmarks().some((item) => String(item) === String(id));
  }

  function toggleBookmark(id) {
    let bookmarks = getBookmarks();

    const index = bookmarks.findIndex((item) => String(item) === String(id));

    if (index >= 0) {
      bookmarks.splice(index, 1);
      saveBookmarks(bookmarks);
      return false;
    }

    bookmarks.push(id);
    saveBookmarks(bookmarks);
    return true;
  }

  /* =====================================================
     CART STORAGE
  ===================================================== */

  function getCart() {
    try {
      const cart = JSON.parse(localStorage.getItem("shoppingCart"));

      return Array.isArray(cart) ? cart : [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
  }

  /* =====================================================
     ADD TO CART
  ===================================================== */

  function addToCart(book, quantity = 1) {
    if (!book) {
      return;
    }

    const cart = getCart();

    const existing = cart.find((item) => String(item.id) === String(book.id));

    if (existing) {
      existing.quantity = Number(existing.quantity || 0) + Number(quantity);
    } else {
      cart.push({
        id: book.id,
        name: book.name,
        author: book.author,
        image: book.image,
        price: Number(book.price || 0),
        quantity: Number(quantity),
      });
    }

    saveCart(cart);

    /* Nếu shoppingCartSidebar.js có renderCart */
    if (typeof window.renderCart === "function") {
      window.renderCart();
    }

    console.log("Đã thêm vào giỏ:", book.name);
  }

  /* =====================================================
     OPEN CART SIDEBAR
  ===================================================== */

  function openCartSidebar() {
    const sidebar = document.querySelector(".shoppingCartSidebar");

    const background = document.querySelector(".shoppingCartSidebar-bg");

    if (sidebar) {
      sidebar.classList.add("active");
    }

    if (background) {
      background.classList.add("active");
    }
  }

  /* =====================================================
     GO TO PRODUCT DETAIL
  ===================================================== */

  function goToProductDetail(book) {
    if (!book) {
      return;
    }

    /*
     * catalog.html nằm trong /pages
     * productDetail.html cũng nằm trong /pages
     */

    const url = `./productDetail.html?id=${encodeURIComponent(book.id)}`;

    window.location.href = url;
  }

  /* =====================================================
     CREATE PRODUCT CARD
  ===================================================== */

  function createProductCard(book) {
    const card = document.createElement("article");

    card.className = "product-card";

    card.dataset.productId = String(book.id);

    const price = Number(book.price || 0).toLocaleString("vi-VN");

    const image = book.image || "../images/COVER_BOOK.png";

    const name = book.name || "Không có tên";

    const bookmarked = isBookmarked(book.id);

    card.innerHTML = `
      <div class="product-image">
        <img
          src="${image}"
          alt="${name}"
          draggable="false"
        />
      </div>

      <p
        class="product-name"
        title="${name}"
      >
        ${name}
      </p>

      <div class="product-info">

        <span class="product-price">
          ${price}đ
        </span>

        <button
          type="button"
          class="product-bookmark ${bookmarked ? "active" : ""}"
          aria-label="Bookmark"
        >
          <img
            src="../images/iconbookmark.png"
            alt="Bookmark"
            draggable="false"
          />
        </button>

      </div>

      <button
        type="button"
        class="add-cart"
        aria-label="Thêm vào giỏ hàng"
      >
        <img
          src="../images/iconcart.png"
          alt="Thêm vào giỏ"
          draggable="false"
        />
      </button>
    `;

    /* =================================================
       BOOKMARK
    ================================================= */

    const bookmarkButton = card.querySelector(".product-bookmark");

    if (bookmarkButton) {
      bookmarkButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const active = toggleBookmark(book.id);

        bookmarkButton.classList.toggle("active", active);
      });
    }

    /* =================================================
       CART
    ================================================= */

    const cartButton = card.querySelector(".add-cart");

    if (cartButton) {
      cartButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        addToCart(book, 1);

        cartButton.classList.add("added");

        setTimeout(() => {
          cartButton.classList.remove("added");
        }, 300);

        openCartSidebar();
      });
    }

    /* =================================================
       PREVENT IMAGE DRAG
    ================================================= */

    const imageElement = card.querySelector(".product-image img");

    if (imageElement) {
      imageElement.addEventListener("dragstart", (event) => {
        event.preventDefault();
      });
    }

    /* =================================================
       CLICK CARD
       → PRODUCT DETAIL
    ================================================= */

    card.addEventListener("click", (event) => {
      /*
       * Không mở detail khi click button
       */
      if (
        event.target.closest(".product-bookmark") ||
        event.target.closest(".add-cart")
      ) {
        return;
      }

      goToProductDetail(book);
    });

    return card;
  }

  /* =====================================================
     RENDER RESULTS
  ===================================================== */

  function renderResults(list) {
    if (!catalogResults) {
      return;
    }

    /*
     * Xóa card cũ
     */
    catalogResults.querySelectorAll(".product-card").forEach((card) => {
      card.remove();
    });

    /*
     * KHÔNG CÓ KẾT QUẢ
     */
    if (list.length === 0) {
      if (emptyResults) {
        emptyResults.style.display = "flex";

        if (!catalogResults.contains(emptyResults)) {
          catalogResults.appendChild(emptyResults);
        }
      }

      return;
    }

    /*
     * CÓ KẾT QUẢ
     */
    if (emptyResults) {
      emptyResults.style.display = "none";
    }

    /*
     * Render
     */
    list.forEach((book) => {
      catalogResults.appendChild(createProductCard(book));
    });
  }

  /* =====================================================
     UPDATE RESULTS
  ===================================================== */

  function updateResults() {
    const keyword = searchInput?.value.trim() || "";

    /*
     * SEARCH
     */
    let result = searchBooks(books, keyword);

    /*
     * CATEGORY
     */
    result = getCategoryBooks(result, selectedCategory);

    /*
     * FILTER
     */
    result = sortBooks(result, selectedFilter);

    /*
     * HIỂN THỊ KEYWORD
     */
    if (resultsKeyword) {
      if (keyword) {
        resultsKeyword.textContent = `“${keyword}”`;
      } else {
        resultsKeyword.textContent = "“NAME BOOK OR NAME AUTHOR”";
      }
    }

    /*
     * CẬP NHẬT URL
     */
    updateSearchURL(keyword);

    /*
     * RENDER
     */
    renderResults(result);

    console.log("CATALOG RESULT:", result);
  }

  /* =====================================================
     CATEGORY DROPDOWN
  ===================================================== */

  if (categoryButton && categoryDropdown) {
    categoryButton.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen = categoryDropdown.classList.contains("open");

      categoryDropdown.classList.toggle("open", !isOpen);

      categoryButton.setAttribute("aria-expanded", String(!isOpen));

      if (filterDropdown) {
        filterDropdown.classList.remove("open");

        filterButton?.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* =====================================================
     CATEGORY SELECT
  ===================================================== */

  if (categoryMenu) {
    const buttons = categoryMenu.querySelectorAll("button[data-category]");

    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();

        const category = button.dataset.category;

        if (!categories.includes(category)) {
          return;
        }

        selectedCategory = category;

        const selectedText =
          categoryButton?.querySelector(".category-selected");

        if (selectedText) {
          selectedText.textContent =
            category === "all" ? "Categories" : category;
        }

        buttons.forEach((item) => {
          item.classList.remove("active");
        });

        button.classList.add("active");

        categoryDropdown?.classList.remove("open");

        categoryButton?.setAttribute("aria-expanded", "false");

        updateResults();
      });
    });
  }

  /* =====================================================
     FILTER DROPDOWN
  ===================================================== */

  if (filterButton && filterDropdown) {
    filterButton.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen = filterDropdown.classList.contains("open");

      filterDropdown.classList.toggle("open", !isOpen);

      filterButton.setAttribute("aria-expanded", String(!isOpen));

      if (categoryDropdown) {
        categoryDropdown.classList.remove("open");

        categoryButton?.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* =====================================================
     FILTER SELECT
  ===================================================== */

  if (filterMenu) {
    const buttons = filterMenu.querySelectorAll("button[data-filter]");

    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();

        const filter = button.dataset.filter;

        if (!filters.includes(filter)) {
          return;
        }

        selectedFilter = filter;

        const selectedText = filterButton?.querySelector(".filter-selected");

        if (selectedText) {
          selectedText.textContent = button.textContent.trim();
        }

        buttons.forEach((item) => {
          item.classList.remove("active");
        });

        button.classList.add("active");

        filterDropdown?.classList.remove("open");

        filterButton?.setAttribute("aria-expanded", "false");

        updateResults();
      });
    });
  }

  /* =====================================================
     CLICK OUTSIDE DROPDOWN
  ===================================================== */

  document.addEventListener("click", () => {
    categoryDropdown?.classList.remove("open");

    filterDropdown?.classList.remove("open");

    categoryButton?.setAttribute("aria-expanded", "false");

    filterButton?.setAttribute("aria-expanded", "false");
  });

  /* =====================================================
     SEARCH INPUT
  ===================================================== */

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      updateResults();
    });

    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();

        updateResults();
      }
    });
  }

  /* =====================================================
     SEARCH BUTTON
  ===================================================== */

  if (searchButton) {
    searchButton.addEventListener("click", () => {
      updateResults();
    });
  }

  /* =====================================================
     INIT
  ===================================================== */

  updateResults();

  console.log("=================================");

  console.log("IUHSVBOOK CATALOG READY");

  console.log("TỔNG SỐ SÁCH:", books.length);

  console.log("=================================");
});
