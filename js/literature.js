/* =====================================================
   IUHSVBOOK - LITERATURE
   CATEGORY: KỸ NĂNG - VĂN HỌC

   NGUYÊN TẮC:
   - book.json = nguồn dữ liệu duy nhất
   - image trong JSON = URL ảnh trực tiếp
   - literature.js = load + filter + search + sort + render
   - bookMarkButton.js = xử lý bookmark duy nhất
===================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  console.log("=================================");
  console.log("IUHSVBOOK LITERATURE START");
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
      "LITERATURE ERROR: Không tìm thấy #productsGrid hoặc .products-grid",
    );

    return;
  }

  /* =====================================================
     CATEGORY
  ===================================================== */

  const pageCategory = "Kỹ năng - Văn học";

  let books = [];
  let categoryBooks = [];

  /* =====================================================
     PATH
  ===================================================== */

  const isInsidePages = window.location.pathname
    .toLowerCase()
    .includes("/pages/");

  const getPagePath = (pageName) => {
    if (isInsidePages) {
      if (pageName === "index.html") {
        return "../index.html";
      }

      return `./${pageName}`;
    }

    if (pageName === "index.html") {
      return "./index.html";
    }

    return `./pages/${pageName}`;
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
      console.error("LITERATURE: currentUser không hợp lệ:", error);

      localStorage.removeItem("currentUser");

      return null;
    }
  };

  window.literatureGetCurrentUser = getCurrentUser;

  /* =====================================================
     LOGIN
  ===================================================== */

  const goToLogin = () => {
    const currentPage =
      window.location.pathname + window.location.search + window.location.hash;

    const loginURL = new URL(getPagePath("login.html"), window.location.href);

    loginURL.searchParams.set("redirect", currentPage);

    console.log("LITERATURE LOGIN:", loginURL.href);

    window.location.href = loginURL.href;
  };

  /* =====================================================
     USER UI
  ===================================================== */

  const updateUserUI = () => {
    const user = getCurrentUser();

    console.log("LITERATURE CURRENT USER:", user);

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

     KHÔNG XỬ LÝ TẠI ĐÂY.
     bookMarkButton.js xử lý.
  ===================================================== */

  if (bookmarkIcon) {
    console.log("LITERATURE HEADER BOOKMARK -> GLOBAL SYSTEM");
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

     Literature KHÔNG toggle bookmark.
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
      console.log("LITERATURE: GLOBAL BOOKMARK READY");
    } else {
      console.warn("LITERATURE: bookMarkButton.js chưa sẵn sàng");
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
      return String(value.name ?? value.label ?? value.title ?? "").trim();
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
     LITERATURE ALIASES

     Hỗ trợ:
     - Kỹ năng - Văn học
     - Kỹ năng văn học
     - Văn học
     - Literature
     - Skill
  ===================================================== */

  const literatureAliases = [
    "ky nang - van hoc",
    "ky nang van hoc",
    "sach ky nang - van hoc",
    "sach ky nang van hoc",
    "van hoc",
    "literature",
    "literatures",
    "ky nang",
    "skill",
    "skills",
  ].map(normalizeText);

  /* =====================================================
     CATEGORY MATCH
  ===================================================== */

  const isLiteratureBook = (book) => {
    const category = normalizeText(getBookCategory(book));

    if (!category) {
      return false;
    }

    return literatureAliases.some((alias) => {
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

  const loadBookJSON = async () => {
    const paths = ["../data/book.json", "./data/book.json", "/data/book.json"];

    const triedURLs = [];

    for (const path of paths) {
      try {
        const url = new URL(path, window.location.href);

        triedURLs.push(url.href);

        console.log("LITERATURE LOAD JSON:", url.href);

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
        } catch (error) {
          console.error("LITERATURE JSON PARSE ERROR:", error);

          console.error("SERVER TRẢ VỀ:", text.slice(0, 300));

          continue;
        }

        if (!Array.isArray(data)) {
          console.warn("BOOK.JSON KHÔNG PHẢI ARRAY:", url.href);

          continue;
        }

        return data;
      } catch (error) {
        console.warn("LITERATURE LOAD ERROR:", path, error);
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

    console.log("LITERATURE BOOK.JSON LOAD OK");

    console.log("TOTAL BOOKS:", books.length);

    console.log("CATEGORY TRONG JSON:", [
      ...new Set(books.map((book) => getBookCategory(book))),
    ]);

    categoryBooks = books.filter(isLiteratureBook);

    console.log("LITERATURE BOOKS:", categoryBooks);

    console.log("LITERATURE COUNT:", categoryBooks.length);

    console.log("=================================");
  } catch (error) {
    console.error("LITERATURE BOOK.JSON ERROR:", error);

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
     book.json đã chứa URL ảnh online.

     Ví dụ:
     "image": "https://encrypted-tbn3.gstatic.com/..."

     => giữ nguyên URL.

     Không thêm ../images/
  ===================================================== */

  const getBookImage = (book) => {
    const image = String(book?.image ?? "").trim();

    if (!image) {
      return "../images/COVER_BOOK.png";
    }

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
    const id = getBookId(book);

    if (!id) {
      console.error("LITERATURE BOOK KHÔNG CÓ ID:", book);

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
     CREATE PRODUCT CARD

     KHÔNG XỬ LÝ BOOKMARK.
     bookMarkButton.js xử lý duy nhất.
  ===================================================== */

  const createProductCard = (book) => {
    const id = getBookId(book);

    if (!id) {
      console.warn("BỎ QUA BOOK KHÔNG CÓ ID:", book);

      return null;
    }

    const card = document.createElement("article");

    const name = String(book.name || "Không có tên");

    const image = getBookImage(book);

    const price = Number(book.price || 0).toLocaleString("vi-VN");

    const bookmarked =
      typeof window.isBookmarked === "function"
        ? window.isBookmarked(id)
        : false;

    card.className = "category-product-card";

    card.dataset.productId = id;

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
      imageElement.addEventListener("error", () => {
        console.error("LITERATURE ẢNH KHÔNG LOAD ĐƯỢC:", {
          name,
          jsonImage: book.image,
          resolvedURL: imageElement.src,
        });

        if (imageElement.dataset.fallback !== "true") {
          imageElement.dataset.fallback = "true";

          imageElement.src = "../images/COVER_BOOK.png";
        }
      });

      imageElement.addEventListener("dragstart", (event) => {
        event.preventDefault();
      });
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

  window.literatureUpdateBookmarkUI = updateBookmarkUI;

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

    console.log("LITERATURE RESULT:", {
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
    console.log("LITERATURE -> BOOKMARK CHANGE");

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

  console.log("IUHSVBOOK LITERATURE READY");

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
