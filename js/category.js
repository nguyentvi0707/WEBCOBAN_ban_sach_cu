/* =====================================================
   IUHSVBOOK - CATEGORY
   CATEGORY: ĐẠI CƯƠNG
===================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  console.log("=================================");
  console.log("CATEGORY.JS START");
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

  const signInButton =
    document.querySelector("#signInButton");

  const userInfo =
    document.querySelector("#userInfo");

  const usernameDisplay =
    document.querySelector("#usernameDisplay");

  const logoutButton =
    document.querySelector("#logoutButton");

  if (!productsGrid) {
    console.error(
      "KHÔNG TÌM THẤY #productsGrid hoặc .products-grid",
    );

    return;
  }

  /* =====================================================
     CATEGORY
  ===================================================== */

  const pageCategory = "Đại cương";

  let books = [];
  let categoryBooks = [];

  /* =====================================================
     NORMALIZE
  ===================================================== */

  const normalizeText = (value) => {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
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
     GET BOOK ID
  ===================================================== */

  const getBookId = (book) => {
    if (
      !book ||
      book.id === undefined ||
      book.id === null
    ) {
      return "";
    }

    return String(book.id);
  };

  /* =====================================================
     LOAD JSON
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
        const url = new URL(
          path,
          window.location.href,
        );

        triedURLs.push(url.href);

        console.log(
          "ĐANG THỬ JSON:",
          url.href,
        );

        const response = await fetch(
          url.href,
          {
            cache: "no-store",
          },
        );

        console.log(
          "STATUS:",
          response.status,
          "|",
          url.href,
        );

        if (!response.ok) {
          continue;
        }

        const data =
          await response.json();

        if (!Array.isArray(data)) {
          console.error(
            "JSON không phải mảng:",
            url.href,
          );

          continue;
        }

        console.log(
          "JSON LOAD THÀNH CÔNG:",
          url.href,
        );

        return data;
      } catch (error) {
        console.error(
          "LỖI URL:",
          path,
          error,
        );
      }
    }

    throw new Error(
      "Không tải được book.json. Đã thử:\n" +
        triedURLs.join("\n"),
    );
  };

  /* =====================================================
     LOAD BOOK.JSON
  ===================================================== */

  try {
    books = await loadBookJSON();

    console.log(
      "TỔNG SỐ SÁCH:",
      books.length,
    );

    const allCategories = [
      ...new Set(
        books.map((book) =>
          getBookCategory(book),
        ),
      ),
    ];

    console.log(
      "CATEGORY CÓ TRONG JSON:",
      allCategories,
    );

    const targetCategory =
      normalizeText(pageCategory);

    categoryBooks =
      books.filter((book) => {
        const category =
          normalizeText(
            getBookCategory(book),
          );

        return (
          category === targetCategory ||
          category.includes(
            targetCategory,
          ) ||
          category === "general" ||
          category.includes("general")
        );
      });

    console.log(
      "SÁCH ĐẠI CƯƠNG:",
      categoryBooks,
    );

    console.log(
      "SỐ SÁCH ĐẠI CƯƠNG:",
      categoryBooks.length,
    );
  } catch (error) {
    console.error(
      "=================================",
    );

    console.error(
      "KHÔNG LOAD ĐƯỢC BOOK.JSON",
    );

    console.error(error);

    console.error(
      "URL HIỆN TẠI:",
      window.location.href,
    );

    console.error(
      "BASE URI:",
      document.baseURI,
    );

    console.error(
      "=================================",
    );

    productsGrid.innerHTML = `
      <div class="empty-results">
        <p>
          Không tải được book.json.
        </p>

        <p
          style="
            margin-top: 8px;
            font-size: 13px;
          "
        >
          Mở F12 → Console để kiểm tra.
        </p>
      </div>
    `;

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
     GO LOGIN
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
     LOGIN UI
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

        const cartSidebar =
          document.querySelector(
            ".shoppingCartSidebar",
          );

        const cartBackground =
          document.querySelector(
            ".shoppingCartSidebar-bg",
          );

        if (cartSidebar) {
          cartSidebar.classList.remove(
            "active",
          );
        }

        if (cartBackground) {
          cartBackground.classList.remove(
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
     SEARCH
  ===================================================== */

  const searchBooks = (
    list,
    keyword,
  ) => {
    const text =
      normalizeText(keyword);

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
     SORT
  ===================================================== */

  const sortBooks = (
    list,
    value,
  ) => {
    const result = [
      ...list,
    ];

    switch (value) {
      case "price-asc":
        result.sort(
          (a, b) =>
            Number(a.price || 0) -
            Number(b.price || 0),
        );
        break;

      case "price-desc":
        result.sort(
          (a, b) =>
            Number(b.price || 0) -
            Number(a.price || 0),
        );
        break;

      case "name-asc":
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

      case "name-desc":
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

      default:
        break;
    }

    return result;
  };

  /* =====================================================
     PRODUCT DETAIL
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

    const id =
      getBookId(book);

    if (!id) {
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
      id,
    );

    window.location.href =
      productURL.href;
  };

  /* =====================================================
     CREATE PRODUCT CARD
     
     BOOKMARK DÙNG CHUNG
     → data-bookmark-id
  ===================================================== */

  const createProductCard = (
    book,
  ) => {
    const card =
      document.createElement(
        "article",
      );

    card.className =
      "category-product-card";

    card.dataset.productId =
      getBookId(book);

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

    /*
     * Lấy trạng thái bookmark từ
     * bookMarkButton.js nếu có.
     */

    const bookmarked =
      typeof window.isBookmarked ===
      "function"
        ? window.isBookmarked(
            book.id,
          )
        : false;

    card.innerHTML = `
      <div class="category-product-image">

        <img
          src="${image}"
          alt="${name}"
          draggable="false"
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
            class="
              category-bookmark
              ${bookmarked ? "active" : ""}
            "
            type="button"
            data-bookmark-id="${book.id}"
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
          class="category-cart"
          type="button"
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
       BOOKMARK
       
       Dùng global bookMarkButton.js
    ================================================= */

    const bookmark =
      card.querySelector(
        ".category-bookmark",
      );

    if (bookmark) {
      bookmark.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopPropagation();

          if (!getCurrentUser()) {
            alert(
              "Bạn cần đăng nhập trước khi lưu sách yêu thích!",
            );

            goToLogin();

            return;
          }

          if (
            typeof window.toggleBookmark !==
            "function"
          ) {
            console.error(
              "Không tìm thấy toggleBookmark()",
            );

            return;
          }

          const active =
            window.toggleBookmark(
              book.id,
            );

          bookmark.classList.toggle(
            "active",
            active,
          );
        },
      );
    }

    /* =================================================
       DETAIL
    ================================================= */

    const cartButton =
      card.querySelector(
        ".category-cart",
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
            ".category-bookmark",
          )
        ) {
          return;
        }

        if (
          event.target.closest(
            ".category-cart",
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
       IMAGE DRAG
    ================================================= */

    const imageElement =
      card.querySelector(
        ".category-product-image img",
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
     RENDER
  ===================================================== */

  const renderResults = (
    list,
  ) => {
    productsGrid.innerHTML =
      "";

    if (
      !list ||
      list.length === 0
    ) {
      productsGrid.innerHTML = `
        <div class="empty-results">

          <div class="empty-book">
            <div class="book-left"></div>
            <div class="book-right"></div>
            <div class="book-center"></div>
          </div>

          <p>
            Nothing was found :(
          </p>

        </div>
      `;

      return;
    }

    list.forEach(
      (book) => {
        productsGrid.appendChild(
          createProductCard(
            book,
          ),
        );
      },
    );
  };

  /* =====================================================
     UPDATE
  ===================================================== */

  const updateResults =
    () => {
      const keyword =
        searchInput?.value ||
        "";

      let result =
        searchBooks(
          categoryBooks,
          keyword,
        );

      result =
        sortBooks(
          result,
          sortSelect?.value ||
            "default",
        );

      renderResults(
        result,
      );

      /*
       * Cập nhật trạng thái bookmark
       * sau khi render card động.
       */

      if (
        typeof window.updateBookmarkButtons ===
        "function"
      ) {
        window.updateBookmarkButtons();
      }

      console.log(
        "SEARCH:",
        keyword,
      );

      console.log(
        "RESULT:",
        result,
      );
    };

  /* =====================================================
     SEARCH → CATALOG
  ===================================================== */

  const goToCatalog = () => {
    const keyword =
      searchInput?.value.trim() ||
      "";

    const url =
      new URL(
        "./catalog.html",
        window.location.href,
      );

    if (keyword) {
      url.searchParams.set(
        "search",
        keyword,
      );
    }

    window.location.href =
      url.href;
  };

  /* =====================================================
     SEARCH INPUT
  ===================================================== */

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      updateResults,
    );

    searchInput.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key !==
          "Enter"
        ) {
          return;
        }

        event.preventDefault();

        goToCatalog();
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

        goToCatalog();
      },
    );
  }

  /* =====================================================
     SORT
  ===================================================== */

  if (sortSelect) {
    sortSelect.addEventListener(
      "change",
      updateResults,
    );
  }

  /* =====================================================
     INITIAL
  ===================================================== */

  updateResults();

  /* =====================================================
     FINAL
  ===================================================== */

  console.log(
    "=================================",
  );

  console.log(
    "CATEGORY.JS READY",
  );

  console.log(
    "CATEGORY:",
    pageCategory,
  );

  console.log(
    "CATEGORY BOOKS:",
    categoryBooks.length,
  );

  console.log(
    "CURRENT USER:",
    getCurrentUser(),
  );

  console.log(
    "=================================",
  );
});