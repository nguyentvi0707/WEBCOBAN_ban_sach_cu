document.addEventListener("DOMContentLoaded", async () => {
  console.log("=================================");
  console.log("IUHSVBOOK LANGUAGE START");
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

  if (!productsGrid) {
    console.error(
      "LANGUAGE ERROR: Không tìm thấy #productsGrid hoặc .products-grid",
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
      console.error("LANGUAGE: Lỗi đọc currentUser:", error);

      localStorage.removeItem("currentUser");

      return null;
    }
  };

  window.languageGetCurrentUser = getCurrentUser;

  /* =====================================================
     LOGIN
  ===================================================== */

  const goToLogin = () => {
    const currentPage =
      window.location.pathname + window.location.search + window.location.hash;

    const loginURL = new URL(getPagePath("login.html"), window.location.href);

    loginURL.searchParams.set("redirect", currentPage);

    console.log("LANGUAGE LOGIN:", loginURL.href);

    window.location.href = loginURL.href;
  };

  /* =====================================================
     UPDATE USER UI
  ===================================================== */

  const updateUserUI = () => {
    const user = getCurrentUser();

    console.log("LANGUAGE CURRENT USER:", user);

    /* CHƯA LOGIN */

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

    /* ĐÃ LOGIN */

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

     KHÔNG XỬ LÝ CLICK.
     bookMarkButton.js XỬ LÝ DUY NHẤT.
  ===================================================== */

  if (bookmarkIcon) {
    console.log("LANGUAGE HEADER BOOKMARK -> GLOBAL SYSTEM");
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
      console.log("LANGUAGE: BOOKMARK SYSTEM READY");
    } else {
      console.warn("LANGUAGE: bookMarkButton.js chưa sẵn sàng");
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
      .replace(/đ/g, "d")
      .trim()
      .toLowerCase();
  };

  /* =====================================================
     CATEGORY
  ===================================================== */

  const pageCategory = "Ngoại ngữ";

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

    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (item && typeof item === "object") {
            return item.name ?? item.title ?? item.label ?? "";
          }

          return String(item ?? "");
        })
        .join(" ");
    }

    if (value && typeof value === "object") {
      return String(value.name ?? value.title ?? value.label ?? "").trim();
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
     LANGUAGE CATEGORY MATCH
  ===================================================== */

  const languageAliases = [
    "ngoai ngu",
    "sach ngoai ngu",
    "language",
    "languages",
    "foreign",
    "foreign language",
    "foreign languages",
  ].map(normalizeText);

  const isLanguageBook = (book) => {
    const category = normalizeText(getBookCategory(book));

    if (!category) {
      return false;
    }

    return languageAliases.some((alias) => {
      if (!alias) {
        return false;
      }

      return (
        category === alias ||
        category.includes(alias) ||
        alias.includes(category)
      );
    });
  };

  /* =====================================================
     LOAD BOOK.JSON
  ===================================================== */

  let books = [];

  let categoryBooks = [];

  const loadBookJSON = async () => {
    const paths = ["../data/book.json", "./data/book.json", "/data/book.json"];

    const tried = [];

    for (const path of paths) {
      try {
        const url = new URL(path, window.location.href);

        tried.push(url.href);

        console.log("LANGUAGE LOAD JSON:", url.href);

        const response = await fetch(url.href, {
          cache: "no-store",
        });

        console.log("STATUS:", response.status, "|", url.href);

        if (!response.ok) {
          continue;
        }

        const text = await response.text();

        let data;

        try {
          data = JSON.parse(text);
        } catch (error) {
          console.error("LANGUAGE JSON PARSE ERROR:", error);

          console.error("SERVER RESPONSE:", text.slice(0, 500));

          continue;
        }

        if (!Array.isArray(data)) {
          console.warn("BOOK.JSON KHÔNG PHẢI ARRAY:", url.href);

          continue;
        }

        return data;
      } catch (error) {
        console.warn("LANGUAGE LOAD ERROR:", path, error);
      }
    }

    throw new Error("Không tải được book.json.\n" + tried.join("\n"));
  };

  /* =====================================================
     LOAD DATA
  ===================================================== */

  try {
    books = await loadBookJSON();

    console.log("=================================");

    console.log("LANGUAGE BOOK.JSON LOAD OK");

    console.log("TOTAL BOOKS:", books.length);

    console.log("ALL CATEGORIES:", [
      ...new Set(books.map((book) => getBookCategory(book))),
    ]);

    categoryBooks = books.filter(isLanguageBook);

    console.log("NGOẠI NGỮ BOOKS:", categoryBooks);

    console.log("NGOẠI NGỮ COUNT:", categoryBooks.length);

    console.log("=================================");
  } catch (error) {
    console.error("LANGUAGE BOOK.JSON ERROR:", error);

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
     IMAGE URL

     QUAN TRỌNG:
     book.json PHẢI CHỨA LINK ẢNH.

     Ví dụ:
     "image": "https://example.com/book1.jpg"

     Không tải ảnh về project.
     Không đổi link thành ../images/...
  ===================================================== */

  const getBookImage = (book) => {
    const image = String(book?.image ?? "").trim();

    if (!image) {
      return "";
    }

    /*
     * Giữ nguyên URL trong JSON.
     */

    return image;
  };

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
     PRODUCT DETAIL
  ===================================================== */

  const goToProductDetail = (book) => {
    if (!book) {
      return;
    }

    const id = getBookId(book);

    if (!id) {
      console.error("LANGUAGE BOOK KHÔNG CÓ ID:", book);

      return;
    }

    if (!getCurrentUser()) {
      alert("Bạn cần đăng nhập trước khi xem sản phẩm!");

      goToLogin();

      return;
    }

    const detailURL = new URL(
      getPagePath("productDetail.html"),
      window.location.href,
    );

    detailURL.searchParams.set("id", id);

    window.location.href = detailURL.href;
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

    const image = getBookImage(book);

    const name = String(book.name || "Không có tên");

    const price = Number(book.price || 0).toLocaleString("vi-VN");

    const bookmarked =
      typeof window.isBookmarked === "function"
        ? window.isBookmarked(id)
        : false;

    /*
     * Nếu JSON không có link ảnh,
     * dùng một placeholder online.
     *
     * Không lưu ảnh vào project.
     */

    const imageHTML = image
      ? `
          <img
            src="${image}"
            alt="${name}"
            draggable="false"
            loading="lazy"
          />
        `
      : `
          <div
            style="
              width:100%;
              height:100%;
              display:flex;
              align-items:center;
              justify-content:center;
              background:#eeeeee;
              color:#666666;
              font-size:12px;
              text-align:center;
              padding:10px;
            "
          >
            Không có ảnh
          </div>
        `;

    card.innerHTML = `
      <div class="category-product-image">

        ${imageHTML}

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
            class="
              category-bookmark
              ${bookmarked ? "active" : ""}
            "
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

    if (image) {
      const imageElement = card.querySelector(".category-product-image img");

      if (imageElement) {
        imageElement.addEventListener(
          "error",
          () => {
            console.error("KHÔNG LOAD ĐƯỢC ẢNH:", image);

            /*
             * Không thay bằng ảnh local.
             * Chỉ ẩn ảnh lỗi.
             */

            imageElement.style.display = "none";

            const wrapper = imageElement.parentElement;

            if (wrapper && !wrapper.querySelector(".image-error-text")) {
              const message = document.createElement("span");

              message.className = "image-error-text";

              message.textContent = "Không tải được ảnh";

              message.style.cssText = `
                  display:flex;
                  width:100%;
                  height:100%;
                  align-items:center;
                  justify-content:center;
                  color:#777;
                  font-size:12px;
                  text-align:center;
                  padding:10px;
                `;

              wrapper.appendChild(message);
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
    }

    /* =================================================
       DETAIL BUTTON
    ================================================= */

    const detailButton = card.querySelector(".category-cart");

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

  window.languageUpdateBookmarkUI = updateBookmarkUI;

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
  };

  /* =====================================================
     UPDATE RESULTS
  ===================================================== */

  const updateResults = () => {
    const keyword = searchInput?.value.trim() || "";

    let result = searchBooks(categoryBooks, keyword);

    result = sortBooks(result, sortSelect?.value || "default");

    renderResults(result);

    console.log("LANGUAGE RESULT:", {
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
    searchInput.addEventListener("input", updateResults);

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

      goToCatalog();
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
    console.log("LANGUAGE -> BOOKMARK CHANGE");

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
     INITIAL
  ===================================================== */

  updateUserUI();

  updateResults();

  updateBookmarkUI();

  /* =====================================================
     FINAL LOG
  ===================================================== */

  console.log("=================================");

  console.log("IUHSVBOOK LANGUAGE READY");

  console.log("CATEGORY:", pageCategory);

  console.log("TOTAL BOOKS:", books.length);

  console.log("CATEGORY BOOKS:", categoryBooks.length);

  console.log("CURRENT USER:", getCurrentUser());

  console.log(
    "BOOKMARK COUNT:",
    typeof window.getBookmarks === "function"
      ? window.getBookmarks().length
      : 0,
  );

  console.log("=================================");
});
