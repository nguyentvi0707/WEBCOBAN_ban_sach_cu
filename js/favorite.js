document.addEventListener("DOMContentLoaded", async () => {
  "use strict";

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

  const emptyResults = document.querySelector("#emptyResults");

  const categoryDropdown =
    document.querySelector("#favoriteCategoryDropdown") ||
    document.querySelector("#categoryDropdown");

  const categoryButton =
    document.querySelector("#favoriteCategoryDropdownBtn") ||
    document.querySelector("#categoryDropdownBtn");

  const categoryMenu =
    document.querySelector("#favoriteCategoryDropdownMenu") ||
    document.querySelector("#categoryDropdownMenu");

  const filterDropdown =
    document.querySelector("#favoriteFilterDropdown") ||
    document.querySelector("#filterDropdown");

  const filterButton =
    document.querySelector("#favoriteFilterDropdownBtn") ||
    document.querySelector("#filterDropdownBtn");

  const filterMenu =
    document.querySelector("#favoriteFilterDropdownMenu") ||
    document.querySelector("#filterDropdownMenu");

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

  if (!catalogResults) {
    console.error("Không tìm thấy khu vực hiển thị favorite.");
    return;
  }

  const waitForBookmarkSystem = async () => {
    let attempts = 0;

    while (
      (typeof window.getBookmarks !== "function" ||
        typeof window.isBookmarked !== "function") &&
      attempts < 100
    ) {
      await new Promise((resolve) => setTimeout(resolve, 30));
      attempts++;
    }

    return (
      typeof window.getBookmarks === "function" &&
      typeof window.isBookmarked === "function"
    );
  };

  const bookmarkSystemReady = await waitForBookmarkSystem();

  if (!bookmarkSystemReady) {
    catalogResults.innerHTML = `
      <div class="empty-results">
        <p>Chưa kết nối hệ thống yêu thích.</p>
      </div>
    `;
    return;
  }

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
      localStorage.removeItem("currentUser");
      return null;
    }
  };

  window.favoriteGetCurrentUser = getCurrentUser;

  const isInsidePages = window.location.pathname
    .toLowerCase()
    .includes("/pages/");

  const getPagePath = (fileName) => {
    if (isInsidePages) {
      return fileName === "index.html"
        ? "../index.html"
        : `./${fileName}`;
    }

    return fileName === "index.html"
      ? "./index.html"
      : `./pages/${fileName}`;
  };

  const goToLogin = () => {
    const currentPage =
      window.location.pathname +
      window.location.search +
      window.location.hash;

    const loginURL = new URL(
      getPagePath("login.html"),
      window.location.href,
    );

    loginURL.searchParams.set("redirect", currentPage);

    window.location.href = loginURL.href;
  };

  const updateUserUI = () => {
    const user = getCurrentUser();

    if (!user) {
      signInButton && (signInButton.style.display = "flex");
      createAccountButton &&
        (createAccountButton.style.display = "flex");
      userInfo && (userInfo.style.display = "none");
      usernameDisplay && (usernameDisplay.textContent = "");
      return;
    }

    signInButton && (signInButton.style.display = "none");
    createAccountButton &&
      (createAccountButton.style.display = "none");
    userInfo && (userInfo.style.display = "flex");

    if (usernameDisplay) {
      usernameDisplay.textContent =
        user.username || user.name || user.email || "User";
    }
  };

  updateUserUI();

  signInButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    goToLogin();
  });

  createAccountButton?.addEventListener("click", (event) => {
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

  logoutButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    localStorage.removeItem("currentUser");
    localStorage.removeItem("shoppingCart");

    sessionStorage.removeItem("lastOrder");
    sessionStorage.removeItem("checkoutRedirect");

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

    window.location.href = getPagePath("catalog.html");
  });

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
    const background = document.querySelector(
      ".shoppingCartSidebar-bg",
    );

    if (typeof window.renderCart === "function") {
      window.renderCart();
    }

    sidebar?.classList.add("active");
    background?.classList.add("active");
  });

  let books = [];

  const loadBookJSON = async () => {
    const paths = ["../data/book.json", "./data/book.json"];
    let lastError = null;

    for (const path of paths) {
      try {
        const url = new URL(path, window.location.href);
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
      }
    }

    throw lastError || new Error("Không tải được book.json");
  };

  try {
    books = await loadBookJSON();
  } catch (error) {
    showEmptyFavorite("Không tải được book.json.");
    return;
  }

  const getBookId = (book) => {
    if (!book) {
      return "";
    }

    const values = [
      book.id,
      book.bookId,
      book.bookID,
      book.productId,
      book.productID,
    ];

    for (const value of values) {
      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        return String(value).trim();
      }
    }

    return "";
  };

  const normalizeText = (value) => {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[_-]+/g, " ")
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
              item.title ??
              item.label ??
              item.category ??
              ""
            );
          }

          return String(item ?? "");
        })
        .join(" ");
    }

    if (typeof value === "object" && value !== null) {
      return String(
        value.name ??
          value.title ??
          value.label ??
          value.category ??
          "",
      );
    }

    return String(value).trim();
  };

  const showEmptyFavorite = (
    message = "Chưa có sách yêu thích",
  ) => {
    catalogResults.innerHTML = `
      <div class="empty-results">
        <div class="empty-book">
          <div class="book-left"></div>
          <div class="book-right"></div>
          <div class="book-center"></div>
        </div>
        <p>${message}</p>
      </div>
    `;

    if (emptyResults) {
      emptyResults.style.display = "none";
    }
  };

  const getFavoriteBooks = () => {
    const bookmarkIds = window.getBookmarks();

    if (!Array.isArray(bookmarkIds)) {
      return [];
    }

    const validIds = new Set(
      bookmarkIds.map((id) => String(id)),
    );

    return books.filter((book) => {
      const id = getBookId(book);
      return id && validIds.has(id);
    });
  };

  const filterBySearch = (list, keyword) => {
    const text = normalizeText(keyword);

    if (!text) {
      return [...list];
    }

    return list.filter((book) => {
      const name = normalizeText(book.name);
      const author = normalizeText(book.author);

      return (
        name.includes(text) ||
        author.includes(text)
      );
    });
  };

  const filterByCategory = (list, category) => {
    if (!category || category === "all") {
      return [...list];
    }

    const selected = normalizeText(category);

    return list.filter((book) => {
      const bookCategory = normalizeText(
        getBookCategory(book),
      );

      if (selected === "dai cuong") {
        return (
          bookCategory.includes("dai cuong") ||
          bookCategory.includes("general")
        );
      }

      if (selected === "ngoai ngu") {
        return (
          bookCategory.includes("ngoai ngu") ||
          bookCategory.includes("language") ||
          bookCategory.includes("foreign")
        );
      }

      if (selected === "ky thuat cong nghe") {
        return (
          bookCategory.includes("ky thuat") ||
          bookCategory.includes("cong nghe") ||
          bookCategory.includes("technology") ||
          bookCategory.includes("information technology") ||
          bookCategory.includes("cntt")
        );
      }

      if (selected === "ky nang van hoc") {
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

  const sortBooks = (list, filter) => {
    const result = [...list];

    switch (filter) {
      case "az":
        result.sort((a, b) =>
          String(a.name || "").localeCompare(
            String(b.name || ""),
            "vi",
            { sensitivity: "base" },
          ),
        );
        break;

      case "za":
        result.sort((a, b) =>
          String(b.name || "").localeCompare(
            String(a.name || ""),
            "vi",
            { sensitivity: "base" },
          ),
        );
        break;

      case "price-low":
        result.sort(
          (a, b) =>
            Number(a.price || 0) -
            Number(b.price || 0),
        );
        break;

      case "price-high":
        result.sort(
          (a, b) =>
            Number(b.price || 0) -
            Number(a.price || 0),
        );
        break;
    }

    return result;
  };

  let selectedCategory = "all";
  let selectedFilter = "default";

  const goToProductDetail = (book) => {
    const id = getBookId(book);

    if (!id) {
      return;
    }

    if (!getCurrentUser()) {
      alert(
        "Bạn cần đăng nhập trước khi xem sản phẩm!",
      );
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

  const getImageURL = (book) => {
    const value = String(
      book?.image ??
        book?.imageUrl ??
        book?.imageURL ??
        book?.thumbnail ??
        book?.cover ??
        "",
    ).trim();

    if (!value) {
      return "../images/COVER_BOOK.png";
    }

    if (
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("data:") ||
      value.startsWith("blob:")
    ) {
      return value;
    }

    if (
      value.startsWith("./") ||
      value.startsWith("../") ||
      value.startsWith("/")
    ) {
      return value;
    }

    return `../images/${encodeURI(value)}`;
  };

  const createFavoriteCard = (book) => {
    const id = getBookId(book);

    if (!id) {
      return null;
    }

    const name = String(
      book.name || "Không có tên",
    );

    const price = Number(
      book.price || 0,
    ).toLocaleString("vi-VN");

    const image = getImageURL(book);

    const active = window.isBookmarked(id);

    const card =
      document.createElement("article");

    card.className =
      "product-card favorite-book";

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

    const imageElement =
      card.querySelector(
        ".product-image img",
      );

    imageElement?.addEventListener(
      "error",
      () => {
        if (
          imageElement.dataset.fallback !== "true"
        ) {
          imageElement.dataset.fallback =
            "true";

          imageElement.src =
            "../images/COVER_BOOK.png";
        }
      },
      { once: true },
    );

    const detailButton =
      card.querySelector(".add-cart");

    detailButton?.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        goToProductDetail(book);
      },
    );

    card.addEventListener(
      "click",
      (event) => {
        if (
          event.target.closest(
            "[data-bookmark-id]",
          )
        ) {
          return;
        }

        if (
          event.target.closest(".add-cart")
        ) {
          return;
        }

        goToProductDetail(book);
      },
    );

    return card;
  };

  const renderFavorites = () => {
    let result = getFavoriteBooks();

    const keyword =
      searchInput?.value.trim() || "";

    result = filterBySearch(
      result,
      keyword,
    );

    result = filterByCategory(
      result,
      selectedCategory,
    );

    result = sortBooks(
      result,
      selectedFilter,
    );

    if (resultsKeyword) {
      resultsKeyword.textContent = keyword
        ? `“${keyword}”`
        : "“YOUR FAVORITE BOOKS”";
    }

    catalogResults.innerHTML = "";

    if (!result.length) {
      showEmptyFavorite(
        keyword
          ? "Không tìm thấy sách yêu thích"
          : "Chưa có sách yêu thích",
      );
      return;
    }

    if (emptyResults) {
      emptyResults.style.display = "none";
    }

    const fragment =
      document.createDocumentFragment();

    result.forEach((book) => {
      const card =
        createFavoriteCard(book);

      if (card) {
        fragment.appendChild(card);
      }
    });

    catalogResults.appendChild(fragment);

    if (
      typeof window.updateBookmarkButtons ===
      "function"
    ) {
      window.updateBookmarkButtons();
    }
  };

  const setCategoryDropdown = (open) => {
    if (!categoryDropdown) {
      return;
    }

    categoryDropdown.classList.toggle(
      "open",
      open,
    );

    categoryDropdown.classList.toggle(
      "active",
      open,
    );

    categoryButton?.setAttribute(
      "aria-expanded",
      String(open),
    );
  };

  const setFilterDropdown = (open) => {
    if (!filterDropdown) {
      return;
    }

    filterDropdown.classList.toggle(
      "open",
      open,
    );

    filterDropdown.classList.toggle(
      "active",
      open,
    );

    filterButton?.setAttribute(
      "aria-expanded",
      String(open),
    );
  };

  categoryButton?.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      const open =
        categoryDropdown?.classList.contains(
          "open",
        );

      setFilterDropdown(false);
      setCategoryDropdown(!open);
    },
  );

  categoryMenu
    ?.querySelectorAll(
      "button[data-category]",
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopPropagation();

          selectedCategory =
            button.dataset.category || "all";

          categoryMenu
            .querySelectorAll(
              "button[data-category]",
            )
            .forEach((item) =>
              item.classList.remove(
                "active",
              ),
            );

          button.classList.add("active");

          const selectedText =
            categoryButton?.querySelector(
              ".favorite-selected",
            ) ||
            categoryButton?.querySelector(
              ".category-selected",
            );

          if (selectedText) {
            selectedText.textContent =
              selectedCategory === "all"
                ? "Categories"
                : button.textContent.trim();
          }

          setCategoryDropdown(false);
          renderFavorites();
        },
      );
    });

  filterButton?.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      const open =
        filterDropdown?.classList.contains(
          "open",
        );

      setCategoryDropdown(false);
      setFilterDropdown(!open);
    },
  );

  filterMenu
    ?.querySelectorAll(
      "button[data-filter]",
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopPropagation();

          selectedFilter =
            button.dataset.filter ||
            "default";

          filterMenu
            .querySelectorAll(
              "button[data-filter]",
            )
            .forEach((item) =>
              item.classList.remove(
                "active",
              ),
            );

          button.classList.add("active");

          const selectedText =
            filterButton?.querySelector(
              ".favorite-selected",
            ) ||
            filterButton?.querySelector(
              ".filter-selected",
            );

          if (selectedText) {
            selectedText.textContent =
              button.textContent.trim();
          }

          setFilterDropdown(false);
          renderFavorites();
        },
      );
    });

  document.addEventListener(
    "click",
    (event) => {
      if (
        categoryDropdown &&
        !categoryDropdown.contains(
          event.target,
        )
      ) {
        setCategoryDropdown(false);
      }

      if (
        filterDropdown &&
        !filterDropdown.contains(
          event.target,
        )
      ) {
        setFilterDropdown(false);
      }
    },
  );

  searchInput?.addEventListener(
    "input",
    () => {
      renderFavorites();
    },
  );

  searchInput?.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        renderFavorites();
      }
    },
  );

  searchButton?.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      renderFavorites();
    },
  );

  window.addEventListener(
    "bookmarkchange",
    () => {
      renderFavorites();
    },
  );

  window.addEventListener(
    "storage",
    (event) => {
      if (event.key === "bookmarks") {
        renderFavorites();
      }

      if (event.key === "currentUser") {
        updateUserUI();
      }
    },
  );

  categoryMenu
    ?.querySelector(
      'button[data-category="all"]',
    )
    ?.classList.add("active");

  const initialFilter =
    filterMenu?.querySelector(
      'button[data-filter="default"]',
    );

  if (initialFilter) {
    initialFilter.classList.add("active");

    const selectedText =
      filterButton?.querySelector(
        ".favorite-selected",
      ) ||
      filterButton?.querySelector(
        ".filter-selected",
      );

    if (selectedText) {
      selectedText.textContent =
        initialFilter.textContent.trim();
    }
  }

  renderFavorites();
});