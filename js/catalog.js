document.addEventListener("DOMContentLoaded", async () => {
  /* =====================================================
     LOAD BOOK.JSON
  ===================================================== */

  let books = [];

  try {
    const response = await fetch("../data/book.json");

    if (!response.ok) {
      throw new Error("Không đọc được book.json");
    }

    books = await response.json();

    console.log("BOOK JSON:", books);
  } catch (error) {
    console.error("LỖI LOAD BOOK.JSON:", error);
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
   NHẬN TỪ KHÓA TỪ HOME
===================================================== */

const params = new URLSearchParams(window.location.search);
const keywordFromHome = params.get("search");

if (keywordFromHome && searchInput) {
  searchInput.value = keywordFromHome;
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

  function normalizeText(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }

  /* =====================================================
     GET CATEGORY BOOKS
  ===================================================== */

  function getCategoryBooks(list, category) {
    if (!category || category === "all") {
      return [...list];
    }

    const selected = normalizeText(category);

    return list.filter((book) => {
      const bookCategory = normalizeText(book.category);

      return bookCategory === selected;
    });
  }

  /* =====================================================
     SEARCH BOOKS
  ===================================================== */

  function searchBooks(list, keyword) {
    const text = normalizeText(keyword);

    if (!text) {
      return [...list];
    }

    return list.filter((book) => {
      const name = normalizeText(book.name);
      const author = normalizeText(book.author);

      return name.includes(text) || author.includes(text);
    });
  }

  /* =====================================================
     SORT BOOKS
  ===================================================== */

  function sortBooks(list, filter) {
    const result = [...list];

    switch (filter) {
      /* A → Z */
      case "az":
        result.sort((a, b) => {
          return String(a.name || "").localeCompare(
            String(b.name || ""),
            "vi",
            {
              sensitivity: "base",
            },
          );
        });
        break;

      /* Z → A */
      case "za":
        result.sort((a, b) => {
          return String(b.name || "").localeCompare(
            String(a.name || ""),
            "vi",
            {
              sensitivity: "base",
            },
          );
        });
        break;

      /* GIÁ THẤP → CAO */
      case "price-low":
        result.sort((a, b) => {
          return Number(a.price || 0) - Number(b.price || 0);
        });
        break;

      /* GIÁ CAO → THẤP */
      case "price-high":
        result.sort((a, b) => {
          return Number(b.price || 0) - Number(a.price || 0);
        });
        break;
    }

    return result;
  }

  /* =====================================================
     CREATE PRODUCT CARD
  ===================================================== */

  function createProductCard(book) {
    const card = document.createElement("article");

    card.className = "product-card";

    const price = Number(book.price || 0).toLocaleString("vi-VN");

    card.innerHTML = `
      <div class="product-image">
        <img
          src="${book.image || ""}"
          alt="${book.name || "Book"}"
          draggable="false"
        />
      </div>

      <p
        class="product-name"
        title="${book.name || ""}"
      >
        ${book.name || "Không có tên"}
      </p>

      <div class="product-info">

        <span class="product-price">
          ${price}đ
        </span>

        <button
          class="product-bookmark"
          type="button"
          aria-label="Bookmark"
        >
          <img
            src="../images/iconbookmark.png"
            alt="Bookmark"
          />
        </button>

      </div>

      <button
        class="add-cart"
        type="button"
        aria-label="Thêm vào giỏ hàng"
      >
        <img
          src="../images/iconcart.png"
          alt="Thêm vào giỏ hàng"
        />
      </button>
    `;

    /* BOOKMARK */

    const bookmarkButton = card.querySelector(".product-bookmark");

    bookmarkButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      bookmarkButton.classList.toggle("active");
    });

    /* CART */

    const cartButton = card.querySelector(".add-cart");

    cartButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      cartButton.classList.add("added");

      setTimeout(() => {
        cartButton.classList.remove("added");
      }, 300);
    });

    return card;
  }

  /* =====================================================
     RENDER RESULTS
  ===================================================== */

  function renderResults(list) {
    if (!catalogResults) {
      return;
    }

    /* XÓA CARD CŨ, KHÔNG XÓA emptyResults */
    catalogResults
      .querySelectorAll(".product-card")
      .forEach((card) => card.remove());

    /* KHÔNG CÓ KẾT QUẢ */
    if (list.length === 0) {
      if (emptyResults) {
        emptyResults.style.display = "flex";

        // Đưa emptyResults vào catalogResults nếu chưa có
        if (!catalogResults.contains(emptyResults)) {
          catalogResults.appendChild(emptyResults);
        }
      }

      return;
    }

    /* CÓ KẾT QUẢ → ẨN Nothing was found */
    if (emptyResults) {
      emptyResults.style.display = "none";
    }

    /* RENDER SÁCH */
    list.forEach((book) => {
      const card = createProductCard(book);

      catalogResults.appendChild(card);
    });
  }
  /* =====================================================
     UPDATE RESULTS
  ===================================================== */

  function updateResults() {
    const keyword = searchInput?.value.trim() || "";

    /* SEARCH */
    let result = searchBooks(books, keyword);

    /* CATEGORY */
    result = getCategoryBooks(result, selectedCategory);

    /* FILTER */
    result = sortBooks(result, selectedFilter);

    /* KEYWORD */
    if (resultsKeyword) {
      if (keyword) {
        resultsKeyword.textContent = `“${keyword}”`;
      } else {
        resultsKeyword.textContent = "“NAME BOOK OR NAME AUTHOR”";
      }
    }

    /* =========================================
     RENDER
  ========================================= */

    renderResults(result);

    console.log("RESULT:", result);
  }
  /* =====================================================
     CATEGORY DROPDOWN OPEN / CLOSE
  ===================================================== */

  if (categoryButton && categoryDropdown) {
    categoryButton.addEventListener("click", (e) => {
      e.stopPropagation();

      const isOpen = categoryDropdown.classList.contains("open");

      categoryDropdown.classList.toggle("open", !isOpen);

      categoryButton.setAttribute("aria-expanded", String(!isOpen));

      /* ĐÓNG FILTER */

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
    const categoryButtons = categoryMenu.querySelectorAll(
      "button[data-category]",
    );

    categoryButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();

        const category = button.dataset.category;

        if (!categories.includes(category)) {
          return;
        }

        selectedCategory = category;

        /* ĐỔI TEXT BUTTON */

        const selectedText =
          categoryButton?.querySelector(".category-selected");

        if (selectedText) {
          selectedText.textContent =
            category === "all" ? "Categories" : category;
        }

        /* ACTIVE */

        categoryButtons.forEach((item) => {
          item.classList.remove("active");
        });

        button.classList.add("active");

        /* ĐÓNG */

        categoryDropdown?.classList.remove("open");

        categoryButton?.setAttribute("aria-expanded", "false");

        /* UPDATE */

        updateResults();
      });
    });
  }

  /* =====================================================
     FILTER DROPDOWN OPEN / CLOSE
  ===================================================== */

  if (filterButton && filterDropdown) {
    filterButton.addEventListener("click", (e) => {
      e.stopPropagation();

      const isOpen = filterDropdown.classList.contains("open");

      filterDropdown.classList.toggle("open", !isOpen);

      filterButton.setAttribute("aria-expanded", String(!isOpen));

      /* ĐÓNG CATEGORY */

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
    const filterButtons = filterMenu.querySelectorAll("button[data-filter]");

    filterButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();

        const filter = button.dataset.filter;

        if (!filters.includes(filter)) {
          return;
        }

        selectedFilter = filter;

        /* ĐỔI TEXT */

        const selectedText = filterButton?.querySelector(".filter-selected");

        if (selectedText) {
          selectedText.textContent = button.textContent.trim();
        }

        /* ACTIVE */

        filterButtons.forEach((item) => {
          item.classList.remove("active");
        });

        button.classList.add("active");

        /* ĐÓNG */

        filterDropdown?.classList.remove("open");

        filterButton?.setAttribute("aria-expanded", "false");

        /* UPDATE */

        updateResults();
      });
    });
  }

  /* =====================================================
     CLICK OUTSIDE
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

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();

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
     INIT
  ===================================================== */

  updateResults();

  console.log("=================================");

  console.log("IUHSVBOOK CATALOG READY");

  console.log("Tổng số sách:", books.length);

  console.log("=================================");
});
