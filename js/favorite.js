
document.addEventListener("DOMContentLoaded", async () => {
  "use strict";

  console.log("=================================");
  console.log("IUHSVBOOK FAVORITE START");
  console.log("PAGE:", window.location.href);
  console.log("=================================");

  /* =====================================================
     ELEMENTS
  ===================================================== */

  const catalogResults =
    document.querySelector("#catalogResults") ||
    document.querySelector("#favoriteResults") ||
    document.querySelector(".catalog-results");

  const searchInput =
    document.querySelector("#favoriteSearchInput") ||
    document.querySelector("#categorySearchInput") ||
    document.querySelector(".category-search input");

  const searchButton =
    document.querySelector("#favoriteSearchButton") ||
    document.querySelector("#categorySearchButton") ||
    document.querySelector(".category-search button");

  const resultsKeyword =
    document.querySelector("#resultsKeyword") ||
    document.querySelector(".results-keyword");

  /* =====================================================
     CATEGORY
  ===================================================== */

  const categoryDropdown =
    document.querySelector("#favoriteCategoryDropdown") ||
    document.querySelector("#categoryDropdown");

  const categoryButton =
    document.querySelector("#favoriteCategoryDropdownBtn") ||
    document.querySelector("#categoryDropdownBtn");

  const categoryMenu =
    document.querySelector("#favoriteCategoryDropdownMenu") ||
    document.querySelector("#categoryDropdownMenu");

  /* =====================================================
     FILTER
  ===================================================== */

  const filterDropdown =
    document.querySelector("#favoriteFilterDropdown") ||
    document.querySelector("#filterDropdown");

  const filterButton =
    document.querySelector("#favoriteFilterDropdownBtn") ||
    document.querySelector("#filterDropdownBtn");

  const filterMenu =
    document.querySelector("#favoriteFilterDropdownMenu") ||
    document.querySelector("#filterDropdownMenu");

  /* =====================================================
     HEADER
  ===================================================== */

  const signInButton = document.querySelector("#signInButton");

  const createAccountButton = document.querySelector("#createAccountButton");

  const userInfo = document.querySelector("#userInfo");

  const usernameDisplay = document.querySelector("#usernameDisplay");

  const logoutButton = document.querySelector("#logoutButton");

  const homeIcon =
    document.querySelector("#homeIcon") ||
    document.querySelector(".home") ||
    document.querySelector('a[aria-label="Home"]');

  const productIcon =
    document.querySelector("#productIcon") ||
    document.querySelector(".product") ||
    document.querySelector('a[aria-label="Products"]');

  const cartIcon =
    document.querySelector("#cartIcon") ||
    document.querySelector(".cart") ||
    document.querySelector('a[aria-label="Cart"]');

  /*
   * KHÔNG lấy bookmarkIcon ở đây để gắn click.
   *
   * bookMarkButton.js đã xử lý header bookmark.
   */

  if (!catalogResults) {
    console.error(
      "FAVORITE ERROR: Không tìm thấy #catalogResults / #favoriteResults / .catalog-results",
    );

    return;
  }

  /* =====================================================
     CHECK GLOBAL BOOKMARK SYSTEM
  ===================================================== */

  const waitForBookmarkSystem = async () => {
    const maxAttempts = 100;
    let attempts = 0;

    while (
      (typeof window.getBookmarks !== "function" ||
        typeof window.isBookmarked !== "function") &&
      attempts < maxAttempts
    ) {
      await new Promise((resolve) => {
        setTimeout(resolve, 30);
      });

      attempts++;
    }

    const ready =
      typeof window.getBookmarks === "function" &&
      typeof window.isBookmarked === "function";

    if (!ready) {
      console.error("FAVORITE: bookMarkButton.js chưa được load.");
    } else {
      console.log("FAVORITE: GLOBAL BOOKMARK SYSTEM READY");
    }

    return ready;
  };

  const bookmarkSystemReady = await waitForBookmarkSystem();

  if (!bookmarkSystemReady) {
    catalogResults.innerHTML = `
      <div class="empty-results">
        <p>
          Chưa kết nối hệ thống yêu thích.
        </p>
      </div>
    `;

    return;
  }

  /* =====================================================
     CURRENT USER
  ===================================================== */

  const getCurrentUser = () => {
    const raw = localStorage.getItem("currentUser");

    if (!raw) {
      return null;
    }

    try {
      const user = JSON.parse(raw);

      if (!user || typeof user !== "object") {
        return null;
      }

      return user;
    } catch (error) {
      console.error("FAVORITE: Lỗi đọc currentUser:", error);

      localStorage.removeItem("currentUser");

      return null;
    }
  };

  window.favoriteGetCurrentUser = getCurrentUser;

  /* =====================================================
     PAGE PATH
  ===================================================== */

  const isInsidePages = window.location.pathname
    .toLowerCase()
    .includes("/pages/");

  const getPagePath = (fileName) => {
    if (isInsidePages) {
      if (fileName === "index.html") {
        return "../index.html";
      }

      return `./${fileName}`;
    }

    if (fileName === "index.html") {
      return "./index.html";
    }

    return `./pages/${fileName}`;
  };

  /* =====================================================
     LOGIN
  ===================================================== */

  const goToLogin = () => {
    const currentPage =
      window.location.pathname + window.location.search + window.location.hash;

    const loginURL = new URL(getPagePath("login.html"), window.location.href);

    loginURL.searchParams.set("redirect", currentPage);

    console.log("FAVORITE LOGIN:", loginURL.href);

    window.location.href = loginURL.href;
  };

  /* =====================================================
     USER UI
  ===================================================== */

  const updateUserUI = () => {
    const user = getCurrentUser();

    if (!user) {
      if (signInButton) {
        signInButton.style.display = "flex";
      }

      if (createAccountButton) {
        createAccountButton.style.display = "flex";
      }

      if (userInfo) {
        userInfo.style.display = "none";
      }

      if (usernameDisplay) {
        usernameDisplay.textContent = "";
      }

      return;
    }

    if (signInButton) {
      signInButton.style.display = "none";
    }

    if (createAccountButton) {
      createAccountButton.style.display = "none";
    }

    if (userInfo) {
      userInfo.style.display = "flex";
    }

    if (usernameDisplay) {
      usernameDisplay.textContent =
        user.username || user.name || user.email || "User";
    }
  };

  updateUserUI();

  /* =====================================================
     SIGN IN
  ===================================================== */

  if (signInButton) {
    signInButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      goToLogin();
    });
  }

  /* =====================================================
     CREATE ACCOUNT
  ===================================================== */

  if (createAccountButton) {
    createAccountButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const currentPage =
        window.location.pathname +
        window.location.search +
        window.location.hash;

      const createURL = new URL(
        getPagePath("create.html"),
        window.location.href,
      );

      createURL.searchParams.set("redirect", currentPage);

      window.location.href = createURL.href;
    });
  }

  /* =====================================================
     LOGOUT
  ===================================================== */

  if (logoutButton) {
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      localStorage.removeItem("currentUser");

      localStorage.removeItem("shoppingCart");

      sessionStorage.removeItem("lastOrder");

      sessionStorage.removeItem("checkoutRedirect");

      updateUserUI();

      window.location.reload();
    });
  }

  /* =====================================================
     HOME
  ===================================================== */

  if (homeIcon) {
    homeIcon.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      window.location.href = getPagePath("index.html");
    });
  }

  /* =====================================================
     PRODUCT / CATALOG
  ===================================================== */

  if (productIcon) {
    productIcon.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      window.location.href = getPagePath("catalog.html");
    });
  }

  /* =====================================================
     CART
  ===================================================== */

  if (cartIcon) {
    cartIcon.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!getCurrentUser()) {
        alert("Bạn cần đăng nhập trước khi xem giỏ hàng!");

        goToLogin();

        return;
      }

      if (typeof window.openCartSidebar === "function") {
        window.openCartSidebar();

        return;
      }

      const sidebar = document.querySelector(".shoppingCartSidebar");

      const background = document.querySelector(".shoppingCartSidebar-bg");

      if (typeof window.renderCart === "function") {
        window.renderCart();
      }

      sidebar?.classList.add("active");

      background?.classList.add("active");
    });
  }

  /* =====================================================
     LOAD BOOK.JSON
  ===================================================== */

  let books = [];

  const loadBookJSON = async () => {
    const paths = ["../data/book.json", "./data/book.json"];

    let lastError = null;

    for (const path of paths) {
      try {
        const url = new URL(path, window.location.href);

        console.log("FAVORITE LOAD JSON:", url.href);

        const response = await fetch(url.href, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("book.json phải là ARRAY");
        }

        return data;
      } catch (error) {
        lastError = error;

        console.warn("FAVORITE JSON PATH ERROR:", path, error);
      }
    }

    throw lastError || new Error("Không tải được book.json");
  };

  try {
    books = await loadBookJSON();

    console.log("FAVORITE BOOK.JSON OK:", books.length);
  } catch (error) {
    console.error("FAVORITE BOOK.JSON ERROR:", error);

    showEmptyFavorite("Không tải được book.json.");

    return;
  }

  /* =====================================================
     BOOK ID
  ===================================================== */

  const getBookId = (book) => {
    if (!book || book.id === undefined || book.id === null || book.id === "") {
      return "";
    }

    return String(book.id);
  };

  /* =====================================================
     NORMALIZE
  ===================================================== */

  const normalizeText = (value) => {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .trim()
      .toLowerCase();
  };

  /* =====================================================
     GET BOOK CATEGORY
  ===================================================== */

  const getBookCategory = (book) => {
    if (!book) {
      return "";
    }

    const value =
      book.category ??
      book.categoryName ??
      book.categoryId ??
      book.type ??
      book.typeName ??
      "";

    if (Array.isArray(value)) {
      return value.join(" ");
    }

    if (typeof value === "object" && value !== null) {
      return String(value.name ?? value.title ?? value.label ?? "");
    }

    return String(value).trim();
  };

  /* =====================================================
     EMPTY
  ===================================================== */

  function showEmptyFavorite(message = "Chưa có sách yêu thích") {
    catalogResults.innerHTML = `
      <div class="empty-results">

        <div class="empty-book">

          <div class="book-left"></div>

          <div class="book-right"></div>

          <div class="book-center"></div>

        </div>

        <p>
          ${message}
        </p>

      </div>
    `;
  }

  /* =====================================================
     GET FAVORITE BOOKS

     Chỉ đọc bookmark.
     KHÔNG toggle.
  ===================================================== */

  const getFavoriteBooks = () => {
    const bookmarkIds = window.getBookmarks();

    if (!Array.isArray(bookmarkIds)) {
      return [];
    }

    const validIds = new Set(bookmarkIds.map((id) => String(id)));

    return books.filter((book) => {
      const id = getBookId(book);

      return id && validIds.has(id);
    });
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const filterBySearch = (list, keyword) => {
    const text = normalizeText(keyword);

    if (!text) {
      return [...list];
    }

    return list.filter((book) => {
      const name = normalizeText(book.name);

      const author = normalizeText(book.author);

      return name.includes(text) || author.includes(text);
    });
  };

  /* =====================================================
     CATEGORY
  ===================================================== */

  const filterByCategory = (list, category) => {
    if (!category || category === "all") {
      return [...list];
    }

    const selected = normalizeText(category);

    return list.filter((book) => {
      const bookCategory = normalizeText(getBookCategory(book));

      if (selected === "dai cuong") {
        return (
          bookCategory.includes("dai cuong") || bookCategory.includes("general")
        );
      }

      if (selected === "ngoai ngu") {
        return (
          bookCategory.includes("ngoai ngu") ||
          bookCategory.includes("language") ||
          bookCategory.includes("foreign")
        );
      }

      if (selected === "ky thuat - cong nghe") {
        return (
          bookCategory.includes("ky thuat") ||
          bookCategory.includes("cong nghe") ||
          bookCategory.includes("technology") ||
          bookCategory.includes("information technology") ||
          bookCategory === "it"
        );
      }

      if (selected === "ky nang - van hoc") {
        return (
          bookCategory.includes("ky nang") ||
          bookCategory.includes("van hoc") ||
          bookCategory.includes("literature") ||
          bookCategory.includes("skill")
        );
      }

      return bookCategory === selected;
    });
  };

  /* =====================================================
     SORT
  ===================================================== */

  const sortBooks = (list, filter) => {
    const result = [...list];

    switch (filter) {
      case "az":
        result.sort((a, b) =>
          String(a.name || "").localeCompare(String(b.name || ""), "vi", {
            sensitivity: "base",
          }),
        );
        break;

      case "za":
        result.sort((a, b) =>
          String(b.name || "").localeCompare(String(a.name || ""), "vi", {
            sensitivity: "base",
          }),
        );
        break;

      case "price-low":
        result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;

      case "price-high":
        result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;

      default:
        break;
    }

    return result;
  };

  /* =====================================================
     STATE
  ===================================================== */

  let selectedCategory = "all";

  let selectedFilter = "default";

  /* =====================================================
     DETAIL
  ===================================================== */

  const goToProductDetail = (book) => {
    const id = getBookId(book);

    if (!id) {
      console.error("FAVORITE: BOOK KHÔNG CÓ ID:", book);

      return;
    }

    if (!getCurrentUser()) {
      alert("Bạn cần đăng nhập trước khi xem sản phẩm!");

      goToLogin();

      return;
    }

    const url = new URL(
      getPagePath("productDetail.html"),
      window.location.href,
    );

    url.searchParams.set("id", id);

    window.location.href = url.href;
  };

  /* =====================================================
     CREATE FAVORITE CARD

     KHÔNG GẮN CLICK BOOKMARK.

     bookMarkButton.js tự xử lý
     [data-bookmark-id].
  ===================================================== */

  const createFavoriteCard = (book) => {
    const id = getBookId(book);

    if (!id) {
      return null;
    }

    const name = book.name || "Không có tên";

    const image = book.image || "../images/COVER_BOOK.png";

    const price = Number(book.price || 0).toLocaleString("vi-VN");

    const active = window.isBookmarked(id);

    const card = document.createElement("article");

    card.className = "product-card favorite-book";

    card.dataset.productId = id;

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
          class="product-bookmark favorite-button ${active ? "active" : ""}"
          data-bookmark-id="${id}"
          aria-label="${active ? "Bỏ yêu thích" : "Thêm yêu thích"}"
          aria-pressed="${String(active)}"
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
        aria-label="Xem chi tiết"
      >
        <img
          src="../images/iconcart.png"
          alt="Xem chi tiết"
          draggable="false"
        />
      </button>
    `;

    /* DETAIL */

    const detailButton = card.querySelector(".add-cart");

    detailButton?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      goToProductDetail(book);
    });

    /* CARD */

    card.addEventListener("click", (event) => {
      if (event.target.closest("[data-bookmark-id]")) {
        return;
      }

      if (event.target.closest(".add-cart")) {
        return;
      }

      goToProductDetail(book);
    });

    /* IMAGE */

    const imageElement = card.querySelector(".product-image img");

    imageElement?.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });

    return card;
  };

  /* =====================================================
     RENDER FAVORITES
  ===================================================== */

  const renderFavorites = () => {
    let result = getFavoriteBooks();

    const keyword = searchInput?.value.trim() || "";

    result = filterBySearch(result, keyword);

    result = filterByCategory(result, selectedCategory);

    result = sortBooks(result, selectedFilter);

    if (resultsKeyword) {
      resultsKeyword.textContent = keyword
        ? `“${keyword}”`
        : "“YOUR FAVORITE BOOKS”";
    }

    /* XÓA CARD CŨ */

    catalogResults
      .querySelectorAll(".product-card")
      .forEach((card) => card.remove());

    /* EMPTY */

    if (!result || result.length === 0) {
      showEmptyFavorite(
        keyword ? "Không tìm thấy sách yêu thích" : "Chưa có sách yêu thích",
      );

      return;
    }

    /* EMPTY HIDDEN */

    if (emptyResults) {
      emptyResults.style.display = "none";
    }

    /* RENDER */

    const fragment = document.createDocumentFragment();

    result.forEach((book) => {
      const card = createFavoriteCard(book);

      if (card) {
        fragment.appendChild(card);
      }
    });

    catalogResults.appendChild(fragment);

    /* UPDATE ACTIVE */

    if (typeof window.updateBookmarkButtons === "function") {
      window.updateBookmarkButtons();
    }

    console.log("FAVORITE RESULT:", result);
  };

  /* =====================================================
     DROPDOWN STATE
  ===================================================== */

  const setCategoryDropdown = (open) => {
    if (!categoryDropdown) {
      return;
    }

    categoryDropdown.classList.toggle("open", open);

    categoryDropdown.classList.toggle("active", open);

    categoryButton?.setAttribute("aria-expanded", String(open));
  };

  const setFilterDropdown = (open) => {
    if (!filterDropdown) {
      return;
    }

    filterDropdown.classList.toggle("open", open);

    filterDropdown.classList.toggle("active", open);

    filterButton?.setAttribute("aria-expanded", String(open));
  };

  /* =====================================================
     CATEGORY DROPDOWN
  ===================================================== */

  if (categoryButton && categoryDropdown) {
    categoryButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const open = categoryDropdown.classList.contains("open");

      setFilterDropdown(false);

      setCategoryDropdown(!open);
    });
  }

  /* =====================================================
     CATEGORY ITEMS
  ===================================================== */

  if (categoryMenu) {
    categoryMenu.querySelectorAll("button[data-category]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        selectedCategory = button.dataset.category || "all";

        categoryMenu
          .querySelectorAll("button[data-category]")
          .forEach((item) => item.classList.remove("active"));

        button.classList.add("active");

        const selectedText =
          categoryButton?.querySelector(".favorite-selected") ||
          categoryButton?.querySelector(".category-selected");

        if (selectedText) {
          selectedText.textContent =
            selectedCategory === "all" ? "Categories" : selectedCategory;
        }

        setCategoryDropdown(false);

        renderFavorites();
      });
    });
  }

  /* =====================================================
     FILTER DROPDOWN
  ===================================================== */

  if (filterButton && filterDropdown) {
    filterButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const open = filterDropdown.classList.contains("open");

      setCategoryDropdown(false);

      setFilterDropdown(!open);
    });
  }

  /* =====================================================
     FILTER ITEMS
  ===================================================== */

  if (filterMenu) {
    filterMenu.querySelectorAll("button[data-filter]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        selectedFilter = button.dataset.filter || "default";

        filterMenu
          .querySelectorAll("button[data-filter]")
          .forEach((item) => item.classList.remove("active"));

        button.classList.add("active");

        const selectedText =
          filterButton?.querySelector(".favorite-selected") ||
          filterButton?.querySelector(".filter-selected");

        if (selectedText) {
          selectedText.textContent = button.textContent.trim();
        }

        setFilterDropdown(false);

        renderFavorites();
      });
    });
  }

  /* =====================================================
     CLICK OUTSIDE
  ===================================================== */

  document.addEventListener("click", (event) => {
    if (categoryDropdown && !categoryDropdown.contains(event.target)) {
      setCategoryDropdown(false);
    }

    if (filterDropdown && !filterDropdown.contains(event.target)) {
      setFilterDropdown(false);
    }
  });

  /* =====================================================
     SEARCH
  ===================================================== */

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      renderFavorites();
    });

    searchInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();

      renderFavorites();
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      renderFavorites();
    });
  }

  /* =====================================================
     BOOKMARK CHANGE
     
     Đây là phần quan trọng.

     bookMarkButton.js:
       toggleBookmark()
          ↓
       saveBookmarks()
          ↓
       bookmarkchange
          ↓
       favorite.js renderFavorites()
     
     Vì vậy KHÔNG toggle ở file này.
  ===================================================== */

  window.addEventListener("bookmarkchange", () => {
    console.log("FAVORITE: BOOKMARK CHANGE -> RENDER");

    renderFavorites();
  });

  /* =====================================================
     STORAGE CHANGE
  ===================================================== */

  window.addEventListener("storage", (event) => {
    if (event.key === "bookmarks") {
      renderFavorites();
    }

    if (event.key === "currentUser") {
      updateUserUI();
    }
  });

  /* =====================================================
     INITIAL CATEGORY
  ===================================================== */

  categoryMenu
    ?.querySelector('button[data-category="all"]')
    ?.classList.add("active");

  /* =====================================================
     INITIAL FILTER
  ===================================================== */

  const initialFilter = filterMenu?.querySelector(
    'button[data-filter="default"]',
  );

  if (initialFilter) {
    initialFilter.classList.add("active");

    const selectedText =
      filterButton?.querySelector(".favorite-selected") ||
      filterButton?.querySelector(".filter-selected");

    if (selectedText) {
      selectedText.textContent = initialFilter.textContent.trim();
    }
  }

  /* =====================================================
     INITIAL RENDER
  ===================================================== */

  renderFavorites();

  /* =====================================================
     FINAL
  ===================================================== */

  console.log("=================================");

  console.log("IUHSVBOOK FAVORITE READY");

  console.log("TOTAL BOOKS:", books.length);

  console.log("FAVORITE COUNT:", getFavoriteBooks().length);

  console.log("BOOKMARKS:", window.getBookmarks());

  console.log("CURRENT USER:", getCurrentUser());

  console.log("=================================");
});
