/* =====================================================
   IUHSVBOOK - CATALOG
===================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  console.log("=================================");
  console.log("IUHSVBOOK CATALOG START");
  console.log("PAGE:", window.location.href);
  console.log("=================================");

  /* =====================================================
     LOAD BOOK.JSON
  ===================================================== */

  let books = [];

  try {
    const jsonURL = new URL("../data/book.json", window.location.href);

    console.log("BOOK.JSON URL:", jsonURL.href);

    const response = await fetch(jsonURL.href, {
      cache: "no-store",
    });

    console.log("BOOK.JSON STATUS:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("book.json không phải là một mảng");
    }

    books = data;

    console.log("BOOK.JSON LOADED:", books);
  } catch (error) {
    console.error("=================================");

    console.error("LỖI LOAD BOOK.JSON:", error);

    console.error("=================================");

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
     HEADER USER
  ===================================================== */

  const signInButton = document.querySelector("#signInButton");

  const userInfo = document.querySelector("#userInfo");

  const usernameDisplay = document.querySelector("#usernameDisplay");

  const logoutButton = document.querySelector("#logoutButton");

  /* =====================================================
     GET CURRENT USER
  ===================================================== */

  const getCurrentUser = () => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      return null;
    }

    try {
      return JSON.parse(currentUser);
    } catch (error) {
      console.error("LỖI ĐỌC currentUser:", error);

      localStorage.removeItem("currentUser");

      return null;
    }
  };

  /* =====================================================
     GO TO LOGIN
  ===================================================== */

  const goToLogin = () => {
    const currentPage =
      window.location.pathname + window.location.search + window.location.hash;

    const loginURL = new URL("./login.html", window.location.href);

    loginURL.searchParams.set("redirect", currentPage);

    console.log("LOGIN REDIRECT:", loginURL.href);

    window.location.href = loginURL.href;
  };

  /* =====================================================
     USER UI
  ===================================================== */

  const updateUserUI = () => {
    const user = getCurrentUser();

    /* CHƯA LOGIN */

    if (!user) {
      if (signInButton) {
        signInButton.style.display = "flex";
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

    if (userInfo) {
      userInfo.style.display = "flex";
    }

    if (usernameDisplay) {
      usernameDisplay.textContent =
        user.username || user.name || user.email || "";
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

      const cartSidebar = document.querySelector(".shoppingCartSidebar");

      const cartBackground = document.querySelector(".shoppingCartSidebar-bg");

      if (cartSidebar) {
        cartSidebar.classList.remove("active");
      }

      if (cartBackground) {
        cartBackground.classList.remove("active");
      }

      if (typeof window.renderCart === "function") {
        window.renderCart();
      }

      updateUserUI();

      window.location.reload();
    });
  }

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

  const normalizeText = (value) => {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .trim()
      .toLowerCase();
  };

  /* =====================================================
     UPDATE URL SEARCH
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
     GET CATEGORY BOOKS
  ===================================================== */

  const getCategoryBooks = (list, category) => {
    if (!category || category === "all") {
      return [...list];
    }

    const selected = normalizeText(category);

    return list.filter((book) => {
      const bookCategory = normalizeText(getBookCategory(book));

      /*
       * Đại cương
       */
      if (selected === "dai cuong") {
        return (
          bookCategory.includes("dai cuong") || bookCategory.includes("general")
        );
      }

      /*
       * Ngoại ngữ
       */
      if (selected === "ngoai ngu") {
        return (
          bookCategory.includes("ngoai ngu") ||
          bookCategory.includes("language") ||
          bookCategory.includes("foreign")
        );
      }

      /*
       * Kỹ thuật - Công nghệ
       */
      if (selected === "ky thuat - cong nghe") {
        return (
          bookCategory.includes("ky thuat") ||
          bookCategory.includes("cong nghe") ||
          bookCategory.includes("technology") ||
          bookCategory === "it" ||
          bookCategory.includes("it")
        );
      }

      /*
       * Kỹ năng - Văn học
       */
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
     SEARCH BOOKS
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
     SORT BOOKS
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
     BOOKMARK STORAGE
  ===================================================== */

  const getBookmarks = () => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

      return Array.isArray(bookmarks) ? bookmarks : [];
    } catch {
      return [];
    }
  };

  const saveBookmarks = (bookmarks) => {
    localStorage.setItem(
      "bookmarks",
      JSON.stringify(Array.isArray(bookmarks) ? bookmarks : []),
    );
  };

  const isBookmarked = (id) => {
    return getBookmarks().some((item) => String(item) === String(id));
  };

  const toggleBookmark = (id) => {
    const bookmarks = getBookmarks();

    const index = bookmarks.findIndex((item) => String(item) === String(id));

    if (index >= 0) {
      bookmarks.splice(index, 1);

      saveBookmarks(bookmarks);

      return false;
    }

    bookmarks.push(id);

    saveBookmarks(bookmarks);

    return true;
  };

  /* =====================================================
     GO TO PRODUCT DETAIL
  ===================================================== */

  const goToProductDetail = (book) => {
    if (!book) {
      return;
    }

    /*
     * CHƯA ĐĂNG NHẬP
     */
    if (!getCurrentUser()) {
      alert("Bạn cần đăng nhập trước khi xem sản phẩm!");

      goToLogin();

      return;
    }

    if (book.id === undefined || book.id === null) {
      console.error("BOOK KHÔNG CÓ ID:", book);

      return;
    }

    const url = new URL("./productDetail.html", window.location.href);

    url.searchParams.set("id", String(book.id));

    window.location.href = url.href;
  };

  /* =====================================================
     CREATE PRODUCT CARD
  ===================================================== */

  const createProductCard = (book) => {
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
         BUY / DETAIL BUTTON
      ================================================= */

    const buyButton = card.querySelector(".add-cart");

    if (buyButton) {
      buyButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        /*
         * Không thêm trực tiếp vào cart.
         * Đi tới productDetail.
         */
        goToProductDetail(book);
      });
    }

    /* =================================================
         IMAGE DRAG
      ================================================= */

    const imageElement = card.querySelector(".product-image img");

    if (imageElement) {
      imageElement.addEventListener("dragstart", (event) => {
        event.preventDefault();
      });
    }

    /* =================================================
         CARD CLICK
      ================================================= */

    card.addEventListener("click", (event) => {
      if (event.target.closest(".product-bookmark")) {
        return;
      }

      if (event.target.closest(".add-cart")) {
        return;
      }

      goToProductDetail(book);
    });

    return card;
  };

  /* =====================================================
     RENDER RESULTS
  ===================================================== */

  const renderResults = (list) => {
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
  };

  /* =====================================================
     UPDATE RESULTS
  ===================================================== */

  const updateResults = () => {
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
     * UPDATE URL
     */
    updateSearchURL(keyword);

    /*
     * RENDER
     */
    renderResults(result);

    console.log("CATALOG RESULT:", result);
  };

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
     INITIAL
  ===================================================== */

  updateResults();

  console.log("=================================");

  console.log("IUHSVBOOK CATALOG READY");

  console.log("TỔNG SỐ SÁCH:", books.length);

  console.log("CURRENT USER:", getCurrentUser());

  console.log("=================================");
});
