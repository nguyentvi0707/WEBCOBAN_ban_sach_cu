document.addEventListener("DOMContentLoaded", async () => {
  const productsGrid =
    document.querySelector("#productsGrid") ||
    document.querySelector(".products-grid");

  const searchInput =
    document.querySelector("#categorySearchInput") ||
    document.querySelector(".category-search input");

  const searchButton =
    document.querySelector("#categorySearchButton") ||
    document.querySelector(".category-search button");

  const filterDropdown = document.querySelector("#categoryFilterDropdown");

  const filterDropdownButton = document.querySelector(
    "#categoryFilterDropdownBtn",
  );

  const filterDropdownMenu = document.querySelector(
    "#categoryFilterDropdownMenu",
  );

  const filterSelected = document.querySelector("#categoryFilterSelected");

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

  const pageCategory = "Ngoại ngữ";

  let books = [];
  let categoryBooks = [];
  let currentFilter = "default";

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

  const goToLogin = () => {
    const currentPage =
      window.location.pathname + window.location.search + window.location.hash;

    const loginURL = new URL(getPagePath("login.html"), window.location.href);

    loginURL.searchParams.set("redirect", currentPage);

    window.location.href = loginURL.href;
  };

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

  signInButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    goToLogin();
  });

  createAccountButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const currentPage =
      window.location.pathname + window.location.search + window.location.hash;

    const createURL = new URL(getPagePath("create.html"), window.location.href);

    createURL.searchParams.set("redirect", currentPage);

    window.location.href = createURL.href;
  });

  logoutButton?.addEventListener("click", (event) => {
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

  homeIcon?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    window.location.href = getPagePath("index.html");
  });

  productIcon?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const currentPath = window.location.pathname.toLowerCase();

    if (!currentPath.endsWith("catalog.html")) {
      window.location.href = getPagePath("catalog.html");
    }
  });

  if (bookmarkIcon) {
    console.log("LANGUAGE HEADER BOOKMARK -> GLOBAL SYSTEM");
  }

  cartIcon?.addEventListener("click", (event) => {
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
            return (
              item.name ??
              item.label ??
              item.title ??
              item.category ??
              ""
            );
          }

          return String(item ?? "");
        })
        .join(" ");
    }

    if (value && typeof value === "object") {
      return String(
        value.name ?? value.label ?? value.title ?? value.category ?? "",
      ).trim();
    }

    return String(value).trim();
  };

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

  const isLanguageBook = (book) => {
    const category = normalizeText(getBookCategory(book));

    if (!category) {
      return false;
    }

    const otherCategoryWords = [
      "dai cuong",
      "general",
      "ky thuat",
      "cong nghe",
      "van hoc",
      "literature",
      "ky nang",
      "skill",
      "skills",
    ];

    if (otherCategoryWords.some((word) => category.includes(word))) {
      return false;
    }

    const languageAliases = [
      "ngoai ngu",
      "sach ngoai ngu",
      "language",
      "languages",
      "foreign",
      "foreign language",
      "foreign languages",
    ];

    return languageAliases.some((alias) => {
      const normalizedAlias = normalizeText(alias);

      return (
        category === normalizedAlias ||
        category.includes(normalizedAlias) ||
        normalizedAlias.includes(category)
      );
    });
  };

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

        const response = await fetch(url.href, {
          cache: "no-store",
        });

        if (!response.ok) {
          continue;
        }

        const text = await response.text();

        let data;

        try {
          data = JSON.parse(text);
        } catch (error) {
          console.error("BOOK.JSON PARSE ERROR:", error);

          continue;
        }

        if (!Array.isArray(data)) {
          continue;
        }

        return data;
      } catch (error) {
        console.warn("LANGUAGE JSON ERROR:", path, error);
      }
    }

    throw new Error("Không tải được book.json.\n" + triedURLs.join("\n"));
  };

  try {
    books = await loadBookJSON();

    categoryBooks = books.filter(isLanguageBook);
  } catch (error) {
    console.error("LANGUAGE BOOK.JSON ERROR:", error);

    productsGrid.innerHTML = `
      <div class="empty-results">
        <div class="empty-book">
          <div class="book-left"></div>
          <div class="book-right"></div>
          <div class="book-center"></div>
        </div>

        <p>Không tải được book.json.</p>
      </div>
    `;

    return;
  }

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

  const goToProductDetail = (book) => {
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

    const productURL = new URL(
      getPagePath("productDetail.html"),
      window.location.href,
    );

    productURL.searchParams.set("id", id);

    window.location.href = productURL.href;
  };

  const getBookImage = (book) => {
    const image = String(book?.image ?? "").trim();

    return image || "../images/COVER_BOOK.png";
  };

  const createProductCard = (book) => {
    const id = getBookId(book);

    if (!id) {
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

    const imageElement = card.querySelector(".category-product-image img");

    if (imageElement) {
      imageElement.addEventListener(
        "error",
        () => {
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

    const cartButton = card.querySelector(".category-cart");

    cartButton?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      goToProductDetail(book);
    });

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

          <p>Không tìm thấy sách phù hợp.</p>
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

  const updateResults = () => {
    const keyword = searchInput?.value.trim() || "";

    let result = searchBooks(categoryBooks, keyword);

    result = sortBooks(result, currentFilter);

    renderResults(result);
  };

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

  searchButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    updateSearchURL(searchInput?.value || "");

    updateResults();
  });

  filterDropdownButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isOpen = filterDropdown?.classList.contains("open");

    document
      .querySelectorAll(".category-filter-dropdown.open")
      .forEach((dropdown) => {
        dropdown.classList.remove("open");
      });

    if (!isOpen) {
      filterDropdown?.classList.add("open");
    }

    filterDropdownButton.setAttribute("aria-expanded", String(!isOpen));
  });

  filterDropdownMenu?.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      currentFilter = button.dataset.filter || "default";

      if (filterSelected) {
        filterSelected.textContent = button.textContent.trim();
      }

      filterDropdownMenu.querySelectorAll("button").forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      filterDropdown?.classList.remove("open");

      filterDropdownButton?.setAttribute("aria-expanded", "false");

      updateResults();
    });
  });

  document.addEventListener("click", () => {
    filterDropdown?.classList.remove("open");

    filterDropdownButton?.setAttribute("aria-expanded", "false");
  });

  window.addEventListener("bookmarkchange", () => {
    updateBookmarkUI();
  });

  window.addEventListener("storage", (event) => {
    if (event.key === "currentUser") {
      updateUserUI();
    }

    if (event.key === "bookmarks") {
      updateBookmarkUI();
    }
  });

  const params = new URLSearchParams(window.location.search);

  const keywordFromURL = params.get("search") || "";

  if (searchInput && keywordFromURL) {
    searchInput.value = keywordFromURL;
  }

  updateUserUI();
  updateResults();
  updateBookmarkUI();
});