
document.addEventListener("DOMContentLoaded", async () => {
  "use strict";

  console.log("=================================");
  console.log("IUHSVBOOK CATALOG START");
  console.log("PAGE:", window.location.href);
  console.log("=================================");

  /* =====================================================
     ELEMENTS
  ===================================================== */

  const catalogResults =
    document.querySelector("#catalogResults") ||
    document.querySelector(".catalog-results");

  const emptyResults = document.querySelector("#emptyResults");

  const searchInput =
    document.querySelector("#categorySearchInput") ||
    document.querySelector(".category-search input");

  const searchButton =
    document.querySelector("#categorySearchButton") ||
    document.querySelector(".category-search button");

  const resultsKeyword =
    document.querySelector("#resultsKeyword") ||
    document.querySelector(".results-keyword");

  /* CATEGORY */

  const categoryDropdown = document.querySelector("#categoryDropdown");

  const categoryButton = document.querySelector("#categoryDropdownBtn");

  const categoryMenu = document.querySelector("#categoryDropdownMenu");

  /* FILTER */

  const filterDropdown = document.querySelector("#filterDropdown");

  const filterButton = document.querySelector("#filterDropdownBtn");

  const filterMenu = document.querySelector("#filterDropdownMenu");

  /* HEADER */

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

  /* =====================================================
     CHECK RESULT CONTAINER
  ===================================================== */

  if (!catalogResults) {
    console.error(
      "CATALOG ERROR: Không tìm thấy #catalogResults hoặc .catalog-results",
    );
    return;
  }

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
      console.error("CATALOG: LỖI ĐỌC currentUser:", error);

      localStorage.removeItem("currentUser");

      return null;
    }
  };

  window.catalogGetCurrentUser = getCurrentUser;

  /* =====================================================
     GO LOGIN
  ===================================================== */

  const goToLogin = () => {
    const currentPage =
      window.location.pathname + window.location.search + window.location.hash;

    const loginURL = new URL(getPagePath("login.html"), window.location.href);

    loginURL.searchParams.set("redirect", currentPage);

    console.log("CATALOG LOGIN:", loginURL.href);

    window.location.href = loginURL.href;
  };

  /* =====================================================
     USER UI
  ===================================================== */

  const updateUserUI = () => {
    const user = getCurrentUser();

    console.log("CATALOG CURRENT USER:", user);

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

      const sidebar = document.querySelector(".shoppingCartSidebar");

      const background = document.querySelector(".shoppingCartSidebar-bg");

      sidebar?.classList.remove("active");
      background?.classList.remove("active");

      if (typeof window.renderCart === "function") {
        window.renderCart();
      }

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
     PRODUCT
  ===================================================== */

  if (productIcon) {
    productIcon.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const currentPath = window.location.pathname.toLowerCase();

      if (!currentPath.endsWith("catalog.html")) {
        window.location.href = getPagePath("catalog.html");
      }
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
     WAIT BOOKMARK SYSTEM
     
     catalog.js KHÔNG toggle bookmark.
     bookMarkButton.js là nơi duy nhất toggle.
  ===================================================== */

  const waitForBookmarkSystem = async () => {
    const maxAttempts = 100;
    let attempts = 0;

    while (
      (typeof window.getBookmarks !== "function" ||
        typeof window.isBookmarked !== "function" ||
        typeof window.updateBookmarkButtons !== "function") &&
      attempts < maxAttempts
    ) {
      await new Promise((resolve) => {
        setTimeout(resolve, 30);
      });

      attempts++;
    }

    const ready =
      typeof window.getBookmarks === "function" &&
      typeof window.isBookmarked === "function" &&
      typeof window.updateBookmarkButtons === "function";

    if (ready) {
      console.log("CATALOG: BOOKMARK SYSTEM READY");
    } else {
      console.warn("CATALOG: bookMarkButton.js chưa sẵn sàng");
    }

    return ready;
  };

  await waitForBookmarkSystem();

  /* =====================================================
     NORMALIZE
  ===================================================== */

  const normalizeText = (value) => {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
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
      return value
        .map((item) => {
          if (item && typeof item === "object") {
            return item.name ?? item.label ?? item.title ?? "";
          }

          return String(item ?? "");
        })
        .join(" ");
    }

    if (value && typeof value === "object") {
      return String(value.name ?? value.title ?? value.label ?? "");
    }

    return String(value).trim();
  };

  /* =====================================================
     GET BOOK ID
  ===================================================== */

  const getBookId = (book) => {
    if (
      !book ||
      book.id === undefined ||
      book.id === null ||
      String(book.id).trim() === ""
    ) {
      return "";
    }

    return String(book.id).trim();
  };

  /* =====================================================
     CATEGORY ALIASES
  ===================================================== */

  const categoryAliases = {
    "Đại cương": [
      "dai cuong",
      "sach dai cuong",
      "general",
      "general studies",
      "general study",
    ],

    "Ngoại ngữ": [
      "ngoai ngu",
      "sach ngoai ngu",
      "language",
      "languages",
      "foreign",
      "foreign language",
      "foreign languages",
    ],

    "Kỹ thuật - Công nghệ": [
      "ky thuat cong nghe",
      "ky thuat - cong nghe",
      "sach ky thuat cong nghe",
      "sach ky thuat - cong nghe",
      "ky thuat",
      "cong nghe",
      "cong nghe thong tin",
      "technology",
      "technologies",
      "information technology",
      "information technologies",
      "cntt",
    ],

    "Kỹ năng - Văn học": [
      "ky nang van hoc",
      "ky nang - van hoc",
      "sach ky nang van hoc",
      "sach ky nang - van hoc",
      "ky nang",
      "van hoc",
      "literature",
      "literatures",
      "skill",
      "skills",
    ],
  };

  /* =====================================================
     MATCH CATEGORY
  ===================================================== */

  const matchesCategory = (book, selectedCategory) => {
    if (selectedCategory === "all") {
      return true;
    }

    const rawCategory = normalizeText(getBookCategory(book));

    if (!rawCategory) {
      return false;
    }

    const aliases = categoryAliases[selectedCategory] || [];

    for (const alias of aliases) {
      const normalizedAlias = normalizeText(alias);

      if (!normalizedAlias) {
        continue;
      }

      /*
       * Đặc biệt xử lý IT
       */
      if (normalizedAlias === "it") {
        if (
          rawCategory === "it" ||
          rawCategory.includes("information technology") ||
          rawCategory.includes("cong nghe thong tin") ||
          rawCategory.includes("cntt")
        ) {
          return true;
        }

        continue;
      }

      if (
        rawCategory === normalizedAlias ||
        rawCategory.includes(normalizedAlias) ||
        normalizedAlias.includes(rawCategory)
      ) {
        return true;
      }
    }

    return false;
  };

  /* =====================================================
     LOAD BOOK.JSON
  ===================================================== */

  let books = [];

  const loadBookJSON = async () => {
    const paths = ["../data/book.json", "./data/book.json", "/data/book.json"];

    const triedURLs = [];

    for (const path of paths) {
      try {
        const url = new URL(path, window.location.href);

        triedURLs.push(url.href);

        console.log("CATALOG LOAD JSON:", url.href);

        const response = await fetch(url.href, {
          cache: "no-store",
        });

        console.log("BOOK.JSON STATUS:", response.status, "|", url.href);

        if (!response.ok) {
          continue;
        }

        const text = await response.text();

        let data;

        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error("BOOK.JSON PARSE ERROR:", parseError);

          console.error("SERVER TRẢ VỀ:", text.slice(0, 500));

          continue;
        }

        if (!Array.isArray(data)) {
          console.warn("BOOK.JSON KHÔNG PHẢI ARRAY:", url.href);

          continue;
        }

        return data;
      } catch (error) {
        console.warn("CATALOG JSON ERROR:", path, error);
      }
    }

    throw new Error("Không tải được book.json.\n" + triedURLs.join("\n"));
  };

  /* =====================================================
     LOAD DATA
  ===================================================== */

  try {
    books = await loadBookJSON();

    console.log("=================================");

    console.log("BOOK.JSON LOAD OK");

    console.log("TOTAL BOOKS:", books.length);

    console.log("CATEGORIES:", [...new Set(books.map(getBookCategory))]);

    console.log("=================================");
  } catch (error) {
    console.error("BOOK.JSON ERROR:", error);

    catalogResults.innerHTML = `
      <div class="empty-results">
        <div class="empty-book">
          <div class="book-left"></div>
          <div class="book-right"></div>
          <div class="book-center"></div>
        </div>

        <p>
          Không tải được book.json.
        </p>

        <small
          style="
            display:block;
            margin-top:8px;
            font-size:12px;
          "
        >
          Mở F12 → Console để kiểm tra.
        </small>
      </div>
    `;

    return;
  }

  /* =====================================================
     STATE
  ===================================================== */

  let selectedCategory = "all";
  let selectedFilter = "default";

  const categories = [
    "all",
    "Đại cương",
    "Ngoại ngữ",
    "Kỹ thuật - Công nghệ",
    "Kỹ năng - Văn học",
  ];

  const filters = ["default", "az", "za", "price-low", "price-high"];

  /* =====================================================
     SEARCH
  ===================================================== */

  const searchBooks = (list, keyword) => {
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
     FILTER CATEGORY
  ===================================================== */

  const filterByCategory = (list, category) => {
    if (category === "all") {
      return [...list];
    }

    return list.filter((book) => matchesCategory(book, category));
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
     SEARCH URL
  ===================================================== */

  const updateSearchURL = (keyword) => {
    const url = new URL(window.location.href);

    const text = String(keyword || "").trim();

    if (text) {
      url.searchParams.set("search", text);
    } else {
      url.searchParams.delete("search");
    }

    window.history.replaceState({}, "", url);
  };

  /* =====================================================
     PRODUCT DETAIL
  ===================================================== */

  const goToProductDetail = (book) => {
    if (!book) {
      return;
    }

    const id = getBookId(book);

    if (!id) {
      console.error("BOOK KHÔNG CÓ ID:", book);

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
     IMAGE URL
     
     book.json chứa URL trực tiếp.
     
     Ví dụ:
     https://encrypted-tbn3.gstatic.com/...
     
     KHÔNG:
     ../images/
     KHÔNG:
     tải ảnh về project
  ===================================================== */

  const getBookImage = (book) => {
    const image = String(book?.image ?? "").trim();

    if (!image) {
      return "../images/COVER_BOOK.png";
    }

    return image;
  };

  /* =====================================================
     CREATE PRODUCT CARD
  ===================================================== */

  const createProductCard = (book) => {
    const id = getBookId(book);

    if (!id) {
      console.warn("BỎ QUA BOOK KHÔNG CÓ ID:", book);

      return null;
    }

    const card = document.createElement("article");

    card.className = "product-card";

    card.dataset.productId = id;

    const name = String(book.name || "Không có tên");

    const image = getBookImage(book);

    const price = Number(book.price || 0).toLocaleString("vi-VN");

    const bookmarked =
      typeof window.isBookmarked === "function"
        ? window.isBookmarked(id)
        : false;

    card.innerHTML = `
      <div class="product-image">

        <img
          src="${image}"
          alt="${name}"
          draggable="false"
          loading="lazy"
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
          data-bookmark-id="${id}"
          aria-label="${bookmarked ? "Bỏ yêu thích" : "Thêm yêu thích"}"
          aria-pressed="${String(bookmarked)}"
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

    /* =================================================
       IMAGE ERROR FALLBACK
    ================================================= */

    const imageElement = card.querySelector(".product-image img");

    if (imageElement) {
      imageElement.addEventListener(
        "error",
        () => {
          console.error("ẢNH KHÔNG LOAD:", {
            name,
            image: book.image,
            url: imageElement.src,
          });

          if (imageElement.dataset.fallback !== "true") {
            imageElement.dataset.fallback = "true";

            imageElement.src = "../images/COVER_BOOK.png";
          }
        },
        {
          once: true,
        },
      );

      imageElement.addEventListener("dragstart", (event) => {
        event.preventDefault();
      });
    }

    /* =================================================
       DETAIL BUTTON
    ================================================= */

    const detailButton = card.querySelector(".add-cart");

    if (detailButton) {
      detailButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        goToProductDetail(book);
      });
    }

    /* =================================================
       CARD CLICK
    ================================================= */

    card.addEventListener("click", (event) => {
      /*
       * Bookmark do
       * bookMarkButton.js xử lý.
       */
      if (event.target.closest("[data-bookmark-id]")) {
        return;
      }

      /*
       * Detail button
       */
      if (event.target.closest(".add-cart")) {
        return;
      }

      goToProductDetail(book);
    });

    return card;
  };

  /* =====================================================
     UPDATE BOOKMARK UI
     
     CHỈ ĐỒNG BỘ.
     KHÔNG TOGGLE.
     KHÔNG GẮN CLICK.
  ===================================================== */

  const updateBookmarkUI = () => {
    if (typeof window.isBookmarked !== "function") {
      return;
    }

    document.querySelectorAll("[data-bookmark-id]").forEach((button) => {
      const id = button.dataset.bookmarkId;

      if (!id) {
        return;
      }

      const active = window.isBookmarked(id);

      button.classList.toggle("active", active);

      button.setAttribute("aria-pressed", String(active));

      button.setAttribute(
        "aria-label",
        active ? "Bỏ yêu thích" : "Thêm yêu thích",
      );
    });
  };

  window.catalogUpdateBookmarkUI = updateBookmarkUI;

  /* =====================================================
     RENDER RESULTS
  ===================================================== */

  const renderResults = (list) => {
    /*
     * Xóa card cũ.
     */
    catalogResults.querySelectorAll(".product-card").forEach((card) => {
      card.remove();
    });

    /*
     * EMPTY
     */
    if (!list || list.length === 0) {
      if (emptyResults) {
        emptyResults.style.display = "flex";

        if (!catalogResults.contains(emptyResults)) {
          catalogResults.appendChild(emptyResults);
        }
      } else {
        catalogResults.innerHTML = `
          <div class="empty-results">

            <div class="empty-book">
              <div class="book-left"></div>
              <div class="book-right"></div>
              <div class="book-center"></div>
            </div>

            <p>
              Không tìm thấy sách phù hợp.
            </p>

          </div>
        `;
      }

      return;
    }

    /*
     * HAS DATA
     */
    if (emptyResults) {
      emptyResults.style.display = "none";
    }

    const fragment = document.createDocumentFragment();

    list.forEach((book) => {
      const card = createProductCard(book);

      if (card) {
        fragment.appendChild(card);
      }
    });

    catalogResults.appendChild(fragment);

    updateBookmarkUI();

    if (typeof window.updateBookmarkButtons === "function") {
      window.updateBookmarkButtons();
    }

    console.log("RENDERED BOOKS:", list.length);
  };

  /* =====================================================
     UPDATE RESULTS
  ===================================================== */

  const updateResults = () => {
    const keyword = searchInput?.value.trim() || "";

    let result = searchBooks(books, keyword);

    result = filterByCategory(result, selectedCategory);

    result = sortBooks(result, selectedFilter);

    if (resultsKeyword) {
      resultsKeyword.textContent = keyword
        ? `“${keyword}”`
        : "“NAME BOOK OR NAME AUTHOR”";
    }

    renderResults(result);

    console.log("CATALOG RESULT:", {
      keyword,
      category: selectedCategory,
      filter: selectedFilter,
      count: result.length,
    });
  };

  /* =====================================================
     INITIAL SEARCH FROM URL
  ===================================================== */

  const urlParams = new URLSearchParams(window.location.search);

  const urlKeyword = urlParams.get("search") || "";

  if (searchInput && urlKeyword) {
    searchInput.value = urlKeyword;
  }

  /* =====================================================
     CATEGORY DROPDOWN
  ===================================================== */

  const setCategoryDropdown = (open) => {
    if (!categoryDropdown) {
      return;
    }

    categoryDropdown.classList.toggle("open", open);

    categoryDropdown.classList.toggle("active", open);

    categoryButton?.setAttribute("aria-expanded", String(open));
  };

  /* =====================================================
     FILTER DROPDOWN
  ===================================================== */

  const setFilterDropdown = (open) => {
    if (!filterDropdown) {
      return;
    }

    filterDropdown.classList.toggle("open", open);

    filterDropdown.classList.toggle("active", open);

    filterButton?.setAttribute("aria-expanded", String(open));
  };

  /* =====================================================
     CATEGORY BUTTON
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

        const value = button.dataset.category || "all";

        if (!categories.includes(value)) {
          return;
        }

        selectedCategory = value;

        categoryMenu
          .querySelectorAll("button[data-category]")
          .forEach((item) => {
            item.classList.remove("active");
          });

        button.classList.add("active");

        const selectedText =
          categoryButton?.querySelector(".category-selected");

        if (selectedText) {
          selectedText.textContent = value === "all" ? "Categories" : value;
        }

        setCategoryDropdown(false);

        updateResults();
      });
    });
  }

  /* =====================================================
     FILTER BUTTON
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

        const value = button.dataset.filter || "default";

        if (!filters.includes(value)) {
          return;
        }

        selectedFilter = value;

        filterMenu.querySelectorAll("button[data-filter]").forEach((item) => {
          item.classList.remove("active");
        });

        button.classList.add("active");

        const selectedText = filterButton?.querySelector(".filter-selected");

        if (selectedText) {
          selectedText.textContent = button.textContent.trim();
        }

        setFilterDropdown(false);

        updateResults();
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
     SEARCH INPUT
  ===================================================== */

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      updateSearchURL(searchInput.value);

      updateResults();
    });

    searchInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();

      updateSearchURL(searchInput.value);

      updateResults();
    });
  }

  /* =====================================================
     SEARCH BUTTON
  ===================================================== */

  if (searchButton) {
    searchButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      updateSearchURL(searchInput?.value || "");

      updateResults();
    });
  }

  /* =====================================================
     BOOKMARK CHANGE
     
     bookMarkButton.js toggle.
     catalog.js chỉ refresh UI.
  ===================================================== */

  window.addEventListener("bookmarkchange", () => {
    console.log("CATALOG -> BOOKMARK CHANGE");

    updateBookmarkUI();
  });

  /* =====================================================
     STORAGE
  ===================================================== */

  window.addEventListener("storage", (event) => {
    if (event.key === "currentUser") {
      updateUserUI();
    }

    if (event.key === "bookmarks") {
      updateBookmarkUI();
    }
  });

  /* =====================================================
     INITIAL CATEGORY
  ===================================================== */

  const initialCategory = categoryMenu?.querySelector(
    'button[data-category="all"]',
  );

  if (initialCategory) {
    initialCategory.classList.add("active");
  }

  /* =====================================================
     INITIAL FILTER
  ===================================================== */

  const initialFilter = filterMenu?.querySelector(
    'button[data-filter="default"]',
  );

  if (initialFilter) {
    initialFilter.classList.add("active");

    const selectedText = filterButton?.querySelector(".filter-selected");

    if (selectedText) {
      selectedText.textContent = initialFilter.textContent.trim();
    }
  }

  /* =====================================================
     FINAL INIT
  ===================================================== */

  updateUserUI();

  updateResults();

  updateBookmarkUI();

  /* =====================================================
     FINAL LOG
  ===================================================== */

  console.log("=================================");

  console.log("IUHSVBOOK CATALOG READY");

  console.log("TOTAL BOOKS:", books.length);

  console.log("CURRENT USER:", getCurrentUser());

  console.log(
    "BOOKMARKS:",
    typeof window.getBookmarks === "function" ? window.getBookmarks() : [],
  );

  console.log("=================================");
});
