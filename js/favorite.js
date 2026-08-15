/* =====================================================
   IUHSVBOOK - FAVORITE / BOOKMARK
   DÙNG CHUNG bookMarkButton.js
===================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  console.log("=================================");
  console.log("FAVORITE.JS START");
  console.log("PAGE:", window.location.href);
  console.log("=================================");

  /* =====================================================
     DOM
  ===================================================== */

  const catalogResults =
    document.querySelector("#catalogResults") ||
    document.querySelector("#favoriteResults");

  const emptyResults =
    document.querySelector("#emptyResults");

  /* SEARCH */

  const searchInput =
    document.querySelector("#favoriteSearchInput") ||
    document.querySelector(".category-search input");

  const searchButton =
    document.querySelector("#favoriteSearchButton") ||
    document.querySelector(".category-search button");

  const resultsKeyword =
    document.querySelector("#resultsKeyword");

  /* CATEGORY */

  const categoryDropdown =
    document.querySelector("#favoriteCategoryDropdown");

  const categoryDropdownButton =
    document.querySelector(
      "#favoriteCategoryDropdownBtn",
    );

  const categoryDropdownMenu =
    document.querySelector(
      "#favoriteCategoryDropdownMenu",
    );

  /* FILTER */

  const filterDropdown =
    document.querySelector("#favoriteFilterDropdown");

  const filterDropdownButton =
    document.querySelector(
      "#favoriteFilterDropdownBtn",
    );

  const filterDropdownMenu =
    document.querySelector(
      "#favoriteFilterDropdownMenu",
    );

  /* HEADER */

  const signInButton =
    document.querySelector("#signInButton");

  const createAccountButton =
    document.querySelector(
      "#createAccountButton",
    );

  const userInfo =
    document.querySelector("#userInfo");

  const usernameDisplay =
    document.querySelector(
      "#usernameDisplay",
    );

  const logoutButton =
    document.querySelector(
      "#logoutButton",
    );

  const homeIcon =
    document.querySelector("#homeIcon");

  const cartIcon =
    document.querySelector("#cartIcon");

  if (!catalogResults) {
    console.error(
      "KHÔNG TÌM THẤY #catalogResults hoặc #favoriteResults",
    );

    return;
  }

  /* =====================================================
     CURRENT USER
  ===================================================== */

  const getCurrentUser = () => {
    const currentUser =
      localStorage.getItem("currentUser");

    if (!currentUser) {
      return null;
    }

    try {
      return JSON.parse(currentUser);
    } catch (error) {
      console.error(
        "LỖI ĐỌC currentUser:",
        error,
      );

      localStorage.removeItem(
        "currentUser",
      );

      return null;
    }
  };

  /* =====================================================
     GO TO LOGIN
  ===================================================== */

  const goToLogin = () => {
    const currentPage =
      window.location.pathname +
      window.location.search +
      window.location.hash;

    const loginURL =
      new URL(
        "./login.html",
        window.location.href,
      );

    loginURL.searchParams.set(
      "redirect",
      currentPage,
    );

    console.log(
      "LOGIN REDIRECT:",
      loginURL.href,
    );

    window.location.href =
      loginURL.href;
  };

  /* =====================================================
     UPDATE USER UI
  ===================================================== */

  const updateUserUI = () => {
    const user =
      getCurrentUser();

    if (!user) {
      if (signInButton) {
        signInButton.style.display =
          "flex";
      }

      if (userInfo) {
        userInfo.style.display =
          "none";
      }

      if (usernameDisplay) {
        usernameDisplay.textContent =
          "";
      }

      return;
    }

    if (signInButton) {
      signInButton.style.display =
        "none";
    }

    if (userInfo) {
      userInfo.style.display =
        "flex";
    }

    if (usernameDisplay) {
      usernameDisplay.textContent =
        user.username ||
        user.name ||
        user.email ||
        "";
    }
  };

  updateUserUI();

  /* =====================================================
     SIGN IN
  ===================================================== */

  if (signInButton) {
    signInButton.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        goToLogin();
      },
    );
  }

  /* =====================================================
     CREATE ACCOUNT
  ===================================================== */

  if (createAccountButton) {
    createAccountButton.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        const currentPage =
          window.location.pathname +
          window.location.search +
          window.location.hash;

        const createURL =
          new URL(
            "./create.html",
            window.location.href,
          );

        createURL.searchParams.set(
          "redirect",
          currentPage,
        );

        window.location.href =
          createURL.href;
      },
    );
  }

  /* =====================================================
     LOGOUT
  ===================================================== */

  if (logoutButton) {
    logoutButton.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        localStorage.removeItem(
          "currentUser",
        );

        localStorage.removeItem(
          "shoppingCart",
        );

        sessionStorage.removeItem(
          "lastOrder",
        );

        sessionStorage.removeItem(
          "checkoutRedirect",
        );

        const sidebar =
          document.querySelector(
            ".shoppingCartSidebar",
          );

        const background =
          document.querySelector(
            ".shoppingCartSidebar-bg",
          );

        if (sidebar) {
          sidebar.classList.remove(
            "active",
          );
        }

        if (background) {
          background.classList.remove(
            "active",
          );
        }

        if (
          typeof window.renderCart ===
          "function"
        ) {
          window.renderCart();
        }

        updateUserUI();

        window.location.reload();
      },
    );
  }

  /* =====================================================
     HOME
  ===================================================== */

  if (homeIcon) {
    homeIcon.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        window.location.href =
          "../index.html";
      },
    );
  }

  /* =====================================================
     CART
  ===================================================== */

  if (cartIcon) {
    cartIcon.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!getCurrentUser()) {
          alert(
            "Bạn cần đăng nhập trước khi xem giỏ hàng!",
          );

          goToLogin();

          return;
        }

        if (
          typeof window.openCartSidebar ===
          "function"
        ) {
          window.openCartSidebar();

          return;
        }

        const sidebar =
          document.querySelector(
            ".shoppingCartSidebar",
          );

        const background =
          document.querySelector(
            ".shoppingCartSidebar-bg",
          );

        if (
          typeof window.renderCart ===
          "function"
        ) {
          window.renderCart();
        }

        if (sidebar) {
          sidebar.classList.add(
            "active",
          );
        }

        if (background) {
          background.classList.add(
            "active",
          );
        }
      },
    );
  }

  /* =====================================================
     CHECK GLOBAL BOOKMARK SYSTEM
  ===================================================== */

  const hasGlobalBookmarkSystem =
    typeof window.getBookmarks ===
      "function" &&
    typeof window.toggleBookmark ===
      "function" &&
    typeof window.isBookmarked ===
      "function";

  if (!hasGlobalBookmarkSystem) {
    console.error(
      "bookMarkButton.js chưa được load trước favorite.js",
    );

    catalogResults.innerHTML = `
      <div class="empty-results">
        <p>
          Bookmark system chưa được kết nối.
        </p>
      </div>
    `;

    return;
  }

  /* =====================================================
     LOAD BOOK.JSON
  ===================================================== */

  let books = [];

  try {
    const jsonURL =
      new URL(
        "../data/book.json",
        window.location.href,
      );

    console.log(
      "BOOK.JSON URL:",
      jsonURL.href,
    );

    const response =
      await fetch(
        jsonURL.href,
        {
          cache: "no-store",
        },
      );

    console.log(
      "BOOK.JSON STATUS:",
      response.status,
    );

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`,
      );
    }

    const data =
      await response.json();

    if (!Array.isArray(data)) {
      throw new Error(
        "book.json không phải là một mảng",
      );
    }

    books = data;

    console.log(
      "BOOK JSON LOADED:",
      books,
    );
  } catch (error) {
    console.error(
      "KHÔNG THỂ TẢI BOOK.JSON:",
      error,
    );

    catalogResults.innerHTML = `
      <div class="empty-results">
        <p>
          Không tải được book.json.
        </p>
      </div>
    `;

    if (emptyResults) {
      emptyResults.style.display =
        "none";
    }

    return;
  }

  /* =====================================================
     BOOKMARK SYSTEM
     → DÙNG bookMarkButton.js
  ===================================================== */

  const getBookmarks = () => {
    return window.getBookmarks();
  };

  const isBookmarked = (id) => {
    return window.isBookmarked(id);
  };

  const toggleBookmark = (id) => {
    return window.toggleBookmark(id);
  };

  /* =====================================================
     GET FAVORITE BOOKS
  ===================================================== */

  const getFavoriteBooks = () => {
    const bookmarkIds =
      getBookmarks();

    return books.filter(
      (book) =>
        bookmarkIds.some(
          (id) =>
            String(id) ===
            String(book.id),
        ),
    );
  };

  /* =====================================================
     NORMALIZE
  ===================================================== */

  const normalizeText = (
    value,
  ) => {
    return String(
      value || "",
    )
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        "",
      )
      .replace(
        /đ/g,
        "d",
      )
      .trim()
      .toLowerCase();
  };

  /* =====================================================
     GET CATEGORY
  ===================================================== */

  const getBookCategory = (
    book,
  ) => {
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
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const filterBySearch = (
    list,
    keyword,
  ) => {
    const text =
      normalizeText(
        keyword,
      );

    if (!text) {
      return [...list];
    }

    return list.filter(
      (book) => {
        const name =
          normalizeText(
            book.name,
          );

        const author =
          normalizeText(
            book.author,
          );

        return (
          name.includes(text) ||
          author.includes(text)
        );
      },
    );
  };

  /* =====================================================
     CATEGORY FILTER
  ===================================================== */

  const filterByCategory = (
    list,
    category,
  ) => {
    if (
      !category ||
      category === "all"
    ) {
      return [...list];
    }

    const target =
      normalizeText(
        category,
      );

    return list.filter(
      (book) => {
        const bookCategory =
          normalizeText(
            getBookCategory(
              book,
            ),
          );

        return (
          bookCategory ===
            target ||
          bookCategory.includes(
            target,
          )
        );
      },
    );
  };

  /* =====================================================
     SORT
  ===================================================== */

  const sortBooks = (
    list,
    filter,
  ) => {
    const result = [
      ...list,
    ];

    switch (filter) {
      case "az":
        result.sort(
          (a, b) =>
            String(
              a.name || "",
            ).localeCompare(
              String(
                b.name || "",
              ),
              "vi",
              {
                sensitivity:
                  "base",
              },
            ),
        );

        break;

      case "za":
        result.sort(
          (a, b) =>
            String(
              b.name || "",
            ).localeCompare(
              String(
                a.name || "",
              ),
              "vi",
              {
                sensitivity:
                  "base",
              },
            ),
        );

        break;

      case "price-low":
        result.sort(
          (a, b) =>
            Number(
              a.price || 0,
            ) -
            Number(
              b.price || 0,
            ),
        );

        break;

      case "price-high":
        result.sort(
          (a, b) =>
            Number(
              b.price || 0,
            ) -
            Number(
              a.price || 0,
            ),
        );

        break;

      default:
        break;
    }

    return result;
  };

  /* =====================================================
     STATE
  ===================================================== */

  let selectedCategory =
    "all";

  let selectedFilter =
    "default";

  /* =====================================================
     GO PRODUCT DETAIL
  ===================================================== */

  const goToProductDetail = (
    book,
  ) => {
    if (!book) {
      return;
    }

    if (!getCurrentUser()) {
      alert(
        "Bạn cần đăng nhập trước khi xem sản phẩm!",
      );

      goToLogin();

      return;
    }

    if (
      book.id === undefined ||
      book.id === null
    ) {
      console.error(
        "BOOK KHÔNG CÓ ID:",
        book,
      );

      return;
    }

    const productURL =
      new URL(
        "./productDetail.html",
        window.location.href,
      );

    productURL.searchParams.set(
      "id",
      String(book.id),
    );

    window.location.href =
      productURL.href;
  };

  /* =====================================================
     CREATE FAVORITE CARD
  ===================================================== */

  const createFavoriteCard = (
    book,
  ) => {
    const card =
      document.createElement(
        "article",
      );

    card.className =
      "product-card favorite-book";

    card.dataset.productId =
      String(book.id);

    const image =
      book.image ||
      "../images/COVER_BOOK.png";

    const name =
      book.name ||
      "Không có tên";

    const price =
      Number(
        book.price || 0,
      ).toLocaleString(
        "vi-VN",
      );

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
          class="favorite-button active"
          data-bookmark-id="${book.id}"
          aria-label="Bỏ yêu thích"
        >
          <img
            src="../images/BOOKMARK_SIMPLE.png"
            alt="Bỏ yêu thích"
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
       REMOVE BOOKMARK
    ================================================= */

    const favoriteButton =
      card.querySelector(
        ".favorite-button",
      );

    if (favoriteButton) {
      favoriteButton.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopPropagation();

          toggleBookmark(
            book.id,
          );

          renderFavorites();
        },
      );
    }

    /* =================================================
       DETAIL
    ================================================= */

    const cartButton =
      card.querySelector(
        ".add-cart",
      );

    if (cartButton) {
      cartButton.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopPropagation();

          goToProductDetail(
            book,
          );
        },
      );
    }

    /* =================================================
       CARD CLICK
    ================================================= */

    card.addEventListener(
      "click",
      (event) => {
        if (
          event.target.closest(
            ".favorite-button",
          )
        ) {
          return;
        }

        if (
          event.target.closest(
            ".add-cart",
          )
        ) {
          return;
        }

        goToProductDetail(
          book,
        );
      },
    );

    /* =================================================
       PREVENT IMAGE DRAG
    ================================================= */

    const imageElement =
      card.querySelector(
        ".product-image img",
      );

    if (imageElement) {
      imageElement.addEventListener(
        "dragstart",
        (event) => {
          event.preventDefault();
        },
      );
    }

    return card;
  };

  /* =====================================================
     RENDER FAVORITES
  ===================================================== */

  const renderFavorites = () => {
    const keyword =
      searchInput?.value.trim() ||
      "";

    let result =
      getFavoriteBooks();

    /* SEARCH */

    result =
      filterBySearch(
        result,
        keyword,
      );

    /* CATEGORY */

    result =
      filterByCategory(
        result,
        selectedCategory,
      );

    /* SORT */

    result =
      sortBooks(
        result,
        selectedFilter,
      );

    /* KEYWORD */

    if (resultsKeyword) {
      resultsKeyword.textContent =
        keyword
          ? `“${keyword}”`
          : "“YOUR FAVORITE BOOKS”";
    }

    /* CLEAR */

    catalogResults.innerHTML =
      "";

    /* EMPTY */

    if (
      !result ||
      result.length === 0
    ) {
      if (emptyResults) {
        emptyResults.style.display =
          "flex";

        catalogResults.appendChild(
          emptyResults,
        );
      }

      console.log(
        "KHÔNG CÓ FAVORITE:",
        result,
      );

      return;
    }

    /* HAS FAVORITE */

    if (emptyResults) {
      emptyResults.style.display =
        "none";
    }

    result.forEach(
      (book) => {
        catalogResults.appendChild(
          createFavoriteCard(
            book,
          ),
        );
      },
    );

    console.log(
      "FAVORITE RESULT:",
      result,
    );
  };

  /* =====================================================
     CATEGORY DROPDOWN
  ===================================================== */

  if (
    categoryDropdownButton &&
    categoryDropdown
  ) {
    categoryDropdownButton.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        const isOpen =
          categoryDropdown.classList.contains(
            "open",
          );

        categoryDropdown.classList.toggle(
          "open",
          !isOpen,
        );

        categoryDropdownButton.setAttribute(
          "aria-expanded",
          String(!isOpen),
        );

        if (filterDropdown) {
          filterDropdown.classList.remove(
            "open",
          );
        }

        if (filterDropdownButton) {
          filterDropdownButton.setAttribute(
            "aria-expanded",
            "false",
          );
        }
      },
    );
  }

  /* =====================================================
     CATEGORY SELECT
  ===================================================== */

  if (categoryDropdownMenu) {
    const buttons =
      categoryDropdownMenu.querySelectorAll(
        "button[data-category]",
      );

    buttons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            event.stopPropagation();

            selectedCategory =
              button.dataset.category ||
              "all";

            const selectedText =
              categoryDropdownButton?.querySelector(
                ".favorite-selected",
              );

            if (selectedText) {
              selectedText.textContent =
                selectedCategory ===
                "all"
                  ? "Categories"
                  : selectedCategory;
            }

            buttons.forEach(
              (item) => {
                item.classList.remove(
                  "active",
                );
              },
            );

            button.classList.add(
              "active",
            );

            categoryDropdown.classList.remove(
              "open",
            );

            categoryDropdownButton?.setAttribute(
              "aria-expanded",
              "false",
            );

            renderFavorites();
          },
        );
      },
    );
  }

  /* =====================================================
     FILTER DROPDOWN
  ===================================================== */

  if (
    filterDropdownButton &&
    filterDropdown
  ) {
    filterDropdownButton.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        const isOpen =
          filterDropdown.classList.contains(
            "open",
          );

        filterDropdown.classList.toggle(
          "open",
          !isOpen,
        );

        filterDropdownButton.setAttribute(
          "aria-expanded",
          String(!isOpen),
        );

        if (categoryDropdown) {
          categoryDropdown.classList.remove(
            "open",
          );
        }

        if (categoryDropdownButton) {
          categoryDropdownButton.setAttribute(
            "aria-expanded",
            "false",
          );
        }
      },
    );
  }

  /* =====================================================
     FILTER SELECT
  ===================================================== */

  if (filterDropdownMenu) {
    const buttons =
      filterDropdownMenu.querySelectorAll(
        "button[data-filter]",
      );

    buttons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            event.stopPropagation();

            selectedFilter =
              button.dataset.filter ||
              "default";

            const selectedText =
              filterDropdownButton?.querySelector(
                ".favorite-selected",
              );

            if (selectedText) {
              selectedText.textContent =
                button.textContent.trim();
            }

            buttons.forEach(
              (item) => {
                item.classList.remove(
                  "active",
                );
              },
            );

            button.classList.add(
              "active",
            );

            filterDropdown.classList.remove(
              "open",
            );

            filterDropdownButton?.setAttribute(
              "aria-expanded",
              "false",
            );

            renderFavorites();
          },
        );
      },
    );
  }

  /* =====================================================
     CLICK OUTSIDE
  ===================================================== */

  document.addEventListener(
    "click",
    () => {
      if (categoryDropdown) {
        categoryDropdown.classList.remove(
          "open",
        );
      }

      if (filterDropdown) {
        filterDropdown.classList.remove(
          "open",
        );
      }

      if (categoryDropdownButton) {
        categoryDropdownButton.setAttribute(
          "aria-expanded",
          "false",
        );
      }

      if (filterDropdownButton) {
        filterDropdownButton.setAttribute(
          "aria-expanded",
          "false",
        );
      }
    },
  );

  /* =====================================================
     SEARCH INPUT
  ===================================================== */

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      () => {
        renderFavorites();
      },
    );

    searchInput.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key ===
          "Enter"
        ) {
          event.preventDefault();

          renderFavorites();
        }
      },
    );
  }

  /* =====================================================
     SEARCH BUTTON
  ===================================================== */

  if (searchButton) {
    searchButton.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        renderFavorites();
      },
    );
  }

  /* =====================================================
     INITIAL
  ===================================================== */

  renderFavorites();

  /* =====================================================
     DEBUG
  ===================================================== */

  console.log(
    "=================================",
  );

  console.log(
    "FAVORITE.JS READY",
  );

  console.log(
    "BOOK COUNT:",
    books.length,
  );

  console.log(
    "FAVORITE COUNT:",
    getFavoriteBooks().length,
  );

  console.log(
    "CATEGORY:",
    selectedCategory,
  );

  console.log(
    "FILTER:",
    selectedFilter,
  );

  console.log(
    "CURRENT USER:",
    getCurrentUser(),
  );

  console.log(
    "=================================",
  );
});