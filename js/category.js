/* =====================================================
   IUHSVBOOK - CATEGORY
   CATEGORY: ĐẠI CƯƠNG

   NGUYÊN TẮC:
   - book.json = nguồn dữ liệu duy nhất
   - category.js = load + filter + search + sort + render
   - bookMarkButton.js = xử lý bookmark duy nhất
   - image = lấy trực tiếp URL trong book.json
===================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  console.log("=================================");
  console.log("IUHSVBOOK CATEGORY START");
  console.log("PAGE:", window.location.href);
  console.log("=================================");

  /* =====================================================
     ELEMENTS
  ===================================================== */

  const productsGrid =
    document.querySelector("#productsGrid") ||
    document.querySelector(".products-grid");

  const searchInput =
    document.querySelector("#categorySearchInput") ||
    document.querySelector(".category-search input");

  const searchButton =
    document.querySelector("#categorySearchButton") ||
    document.querySelector(".category-search button");

  const sortSelect =
    document.querySelector("#categoryFilter") ||
    document.querySelector(".category-filter");

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

  const bookmarkIcon =
    document.querySelector("#bookmarkIcon") ||
    document.querySelector(".bookmark") ||
    document.querySelector('a[aria-label="Bookmark"]');

  const cartIcon =
    document.querySelector("#cartIcon") ||
    document.querySelector(".cart") ||
    document.querySelector('a[aria-label="Cart"]');

  /* =====================================================
     CHECK GRID
  ===================================================== */

  if (!productsGrid) {
    console.error(
      "CATEGORY ERROR: Không tìm thấy #productsGrid hoặc .products-grid",
    );

    return;
  }

  /* =====================================================
     PAGE CATEGORY
  ===================================================== */

  const pageCategory = "Đại cương";

  let books = [];
  let categoryBooks = [];

  /* =====================================================
     PATH
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
      console.error("CATEGORY: Lỗi đọc currentUser:", error);

      localStorage.removeItem("currentUser");

      return null;
    }
  };

  window.categoryGetCurrentUser = getCurrentUser;

  /* =====================================================
     LOGIN
  ===================================================== */

  const goToLogin = () => {
    const currentPage =
      window.location.pathname + window.location.search + window.location.hash;

    const loginURL = new URL(getPagePath("login.html"), window.location.href);

    loginURL.searchParams.set("redirect", currentPage);

    console.log("CATEGORY LOGIN:", loginURL.href);

    window.location.href = loginURL.href;
  };

  /* =====================================================
     USER UI
  ===================================================== */

  const updateUserUI = () => {
    const user = getCurrentUser();

    console.log("CATEGORY CURRENT USER:", user);

    /* CHƯA ĐĂNG NHẬP */

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

    /* ĐÃ ĐĂNG NHẬP */

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
     PRODUCT / CATALOG
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
     HEADER BOOKMARK

     bookMarkButton.js xử lý duy nhất.
  ===================================================== */

  if (bookmarkIcon) {
    console.log("CATEGORY HEADER BOOKMARK -> GLOBAL SYSTEM");
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
     NORMALIZE

     QUAN TRỌNG:
     - xử lý cả Đ và đ
     - bỏ dấu tiếng Việt
     - chuẩn hóa -, _, khoảng trắng
  ===================================================== */

  const normalizeText = (value) => {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[_-]+/g, " ")
      .replace(/[()[\]{}]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  };

  /* =====================================================
     GET CATEGORY
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

    /* ARRAY */

    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (item && typeof item === "object") {
            return item.name ?? item.label ?? item.title ?? item.category ?? "";
          }

          return String(item ?? "");
        })
        .join(" ");
    }

    /* OBJECT */

    if (value && typeof value === "object") {
      return String(
        value.name ?? value.label ?? value.title ?? value.category ?? "",
      ).trim();
    }

    /* STRING */

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
     CHECK GENERAL CATEGORY

     HỖ TRỢ:
     - Đại cương
     - Sách đại cương
     - General
     - General Studies
     - General Education
     - General Subject
     - General Subjects
     - General Studies Books
     - Dai Cuong
  ===================================================== */

  const isGeneralBook = (book) => {
    const rawCategory = getBookCategory(book);

    const category = normalizeText(rawCategory);

    if (!category) {
      return false;
    }

    /*
     * DEBUG
     */

    console.log("CATEGORY CHECK:", {
      id: book?.id,
      name: book?.name,
      rawCategory,
      normalizedCategory: category,
    });

    /* =================================================
       LOẠI CÁC NHÓM KHÁC
    ================================================= */

    const otherCategoryWords = [
      "ky thuat",
      "cong nghe",
      "ngoai ngu",
      "foreign",
      "language",
      "van hoc",
      "literature",
    ];

    if (otherCategoryWords.some((word) => category.includes(word))) {
      return false;
    }

    /* =================================================
       ĐẠI CƯƠNG
    ================================================= */

    const generalAliases = [
      "dai cuong",
      "sach dai cuong",
      "general",
      "general studies",
      "general education",
      "general subject",
      "general subjects",
      "general studies books",
    ];

    const matchedGeneral = generalAliases.some((alias) => {
      const normalizedAlias = normalizeText(alias);

      return (
        category === normalizedAlias ||
        category.includes(normalizedAlias) ||
        normalizedAlias.includes(category)
      );
    });

    return matchedGeneral;
  };

  /* =====================================================
     LOAD BOOK.JSON
  ===================================================== */

  const loadBookJSON = async () => {
    const candidatePaths = [
      "../data/book.json",
      "./data/book.json",
      "/data/book.json",
    ];

    const triedURLs = [];

    for (const path of candidatePaths) {
      try {
        const url = new URL(path, window.location.href);

        triedURLs.push(url.href);

        console.log("CATEGORY LOAD JSON:", url.href);

        const response = await fetch(url.href, {
          cache: "no-store",
        });

        console.log("BOOK.JSON STATUS:", response.status, url.href);

        if (!response.ok) {
          continue;
        }

        const text = await response.text();

        let data;

        try {
          data = JSON.parse(text);
        } catch (error) {
          console.error("BOOK.JSON PARSE ERROR:", error);

          console.error("SERVER TRẢ VỀ:", text.slice(0, 500));

          continue;
        }

        if (!Array.isArray(data)) {
          console.warn("BOOK.JSON KHÔNG PHẢI ARRAY:", url.href);

          continue;
        }

        return data;
      } catch (error) {
        console.warn("CATEGORY JSON ERROR:", path, error);
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

    /* =================================================
       DEBUG CATEGORY
    ================================================= */

    console.table(
      books.map((book) => ({
        id: book.id,
        name: book.name,
        category: getBookCategory(book),
        normalized: normalizeText(getBookCategory(book)),
        isGeneral: isGeneralBook(book),
      })),
    );

    /* =================================================
       FILTER
    ================================================= */

    categoryBooks = books.filter(isGeneralBook);

    console.log("=================================");

    console.log("GENERAL BOOKS:", categoryBooks);

    console.log("GENERAL COUNT:", categoryBooks.length);

    console.log("=================================");
  } catch (error) {
    console.error("CATEGORY BOOK.JSON ERROR:", error);

    productsGrid.innerHTML = `
      <div class="empty-results">

        <div class="empty-book">
          <div class="book-left"></div>
          <div class="book-right"></div>
          <div class="book-center"></div>
        </div>

        <p>
          Không tải được book.json.
        </p>

      </div>
    `;

    return;
  }

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
     SORT
  ===================================================== */

  const sortBooks = (list, value) => {
    const result = [...list];

    switch (value) {
      case "price-asc":
        result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));

        break;

      case "price-desc":
        result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));

        break;

      case "name-asc":
        result.sort((a, b) =>
          String(a.name || "").localeCompare(String(b.name || ""), "vi", {
            sensitivity: "base",
          }),
        );

        break;

      case "name-desc":
        result.sort((a, b) =>
          String(b.name || "").localeCompare(String(a.name || ""), "vi", {
            sensitivity: "base",
          }),
        );

        break;

      default:
        break;
    }

    return result;
  };

  /* =====================================================
     UPDATE SEARCH URL
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
    const id = getBookId(book);

    if (!id) {
      console.error("CATEGORY BOOK KHÔNG CÓ ID:", book);

      return;
    }

    if (!getCurrentUser()) {
      alert("Bạn cần đăng nhập trước khi xem sản phẩm!");

      goToLogin();

      return;
    }

    const productURL = new URL(
      getPagePath("productDetail.html"),
      window.location.href,
    );

    productURL.searchParams.set("id", id);

    window.location.href = productURL.href;
  };

  /* =====================================================
     IMAGE URL

     DÙNG NGUYÊN LINK TRONG book.json.
     KHÔNG nối ../images/.
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

    card.className = "category-product-card";

    card.dataset.productId = id;

    const name = String(book.name || "Không có tên");

    const image = getBookImage(book);

    const price = Number(book.price || 0).toLocaleString("vi-VN");

    const bookmarked =
      typeof window.isBookmarked === "function"
        ? window.isBookmarked(id)
        : false;

    card.innerHTML = `
      <div class="category-product-image">

        <img
          src="${image}"
          alt="${name}"
          draggable="false"
          loading="lazy"
        />

      </div>

      <div class="category-product-content">

        <h3 title="${name}">
          ${name}
        </h3>

        <div class="category-product-bottom">

          <span class="category-product-price">
            ${price}đ
          </span>

          <button
            type="button"
            class="category-bookmark ${bookmarked ? "active" : ""}"
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
          class="category-cart"
          aria-label="Xem chi tiết"
        >
          <img
            src="../images/iconcart.png"
            alt="Xem chi tiết"
            draggable="false"
          />
        </button>

      </div>
    `;

    /* =================================================
       IMAGE ERROR
    ================================================= */

    const imageElement = card.querySelector(".category-product-image img");

    if (imageElement) {
      imageElement.addEventListener(
        "error",
        () => {
          console.warn("ẢNH KHÔNG LOAD:", {
            name,
            image: book.image,
            resolved: imageElement.src,
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

    const cartButton = card.querySelector(".category-cart");

    if (cartButton) {
      cartButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        goToProductDetail(book);
      });
    }

    /* =================================================
       CARD CLICK
    ================================================= */

    card.addEventListener("click", (event) => {
      if (event.target.closest("[data-bookmark-id]")) {
        return;
      }

      if (event.target.closest(".category-cart")) {
        return;
      }

      goToProductDetail(book);
    });

    return card;
  };

  /* =====================================================
     UPDATE BOOKMARK UI
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

  window.categoryUpdateBookmarkUI = updateBookmarkUI;

  /* =====================================================
     RENDER
  ===================================================== */

  const renderResults = (list) => {
    productsGrid.innerHTML = "";

    if (!list || list.length === 0) {
      productsGrid.innerHTML = `
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

      return;
    }

    const fragment = document.createDocumentFragment();

    list.forEach((book) => {
      const card = createProductCard(book);

      if (card) {
        fragment.appendChild(card);
      }
    });

    productsGrid.appendChild(fragment);

    updateBookmarkUI();

    if (typeof window.updateBookmarkButtons === "function") {
      window.updateBookmarkButtons();
    }

    console.log("RENDERED CATEGORY:", list.length);
  };

  /* =====================================================
     UPDATE RESULTS
  ===================================================== */

  const updateResults = () => {
    const keyword = searchInput?.value.trim() || "";

    let result = searchBooks(categoryBooks, keyword);

    result = sortBooks(result, sortSelect?.value || "default");

    renderResults(result);

    console.log("CATEGORY RESULT:", {
      keyword,
      count: result.length,
    });
  };

  /* =====================================================
     SEARCH -> CATALOG
  ===================================================== */

  const goToCatalog = () => {
    const keyword = searchInput?.value.trim() || "";

    const catalogURL = new URL(
      getPagePath("catalog.html"),
      window.location.href,
    );

    if (keyword) {
      catalogURL.searchParams.set("search", keyword);
    }

    window.location.href = catalogURL.href;
  };

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

      goToCatalog();
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
     SORT
  ===================================================== */

  if (sortSelect) {
    sortSelect.addEventListener("change", updateResults);
  }

  /* =====================================================
     BOOKMARK CHANGE
  ===================================================== */

  window.addEventListener("bookmarkchange", () => {
    console.log("CATEGORY -> BOOKMARK CHANGE");

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
     URL SEARCH
  ===================================================== */

  const params = new URLSearchParams(window.location.search);

  const keywordFromURL = params.get("search") || "";

  if (searchInput && keywordFromURL) {
    searchInput.value = keywordFromURL;
  }

  /* =====================================================
     INITIAL
  ===================================================== */

  updateUserUI();

  updateResults();

  updateBookmarkUI();

  /* =====================================================
     FINAL
  ===================================================== */

  console.log("=================================");

  console.log("IUHSVBOOK CATEGORY READY");

  console.log("CATEGORY:", pageCategory);

  console.log("TOTAL BOOKS:", books.length);

  console.log("CATEGORY BOOKS:", categoryBooks.length);

  console.log("CURRENT USER:", getCurrentUser());

  console.log(
    "BOOKMARK COUNT:",
    typeof window.getBookmarks === "function"
      ? window.getBookmarks().length
      : "N/A",
  );

  console.log("=================================");
});
