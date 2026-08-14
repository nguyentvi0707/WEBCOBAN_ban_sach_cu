document.addEventListener("DOMContentLoaded", async () => {
  const productsGrid = document.querySelector(".products-grid");

  const searchInput = document.querySelector(".category-search input");
  const searchButton = document.querySelector(".category-search button");

  const sortSelect = document.querySelector(".category-filter");

  if (!productsGrid) {
    console.log("KHÔNG TÌM THẤY .products-grid");
    return;
  }

  // =====================================================
  // CATEGORY CỦA TRANG NÀY
  // =====================================================

  const pageCategory = "Đại cương";

  let books = [];
  let categoryBooks = [];

  // =====================================================
  // LOAD BOOK.JSON
  // =====================================================

  try {
    const response = await fetch("../data/book.json");

    console.log("STATUS:", response.status);

    if (!response.ok) {
      throw new Error("Không đọc được book.json");
    }

    books = await response.json();

    console.log("BOOKS:", books);

    // ===================================================
    // CHỈ LẤY SÁCH ĐẠI CƯƠNG
    // ===================================================

    categoryBooks = books.filter((book) => {
      return (
        String(book.category || "")
          .trim()
          .toLowerCase() === pageCategory.toLowerCase()
      );
    });

    console.log("ĐẠI CƯƠNG:", categoryBooks);

    // Hiển thị lần đầu
    updateResults();

    console.log("ĐÃ HIỂN THỊ:", categoryBooks.length, "CUỐN");
  } catch (error) {
    console.error("LỖI:", error);

    productsGrid.innerHTML = `
      <p style="color:red;">
        Không tải được book.json
      </p>
    `;
  }

  // =====================================================
  // SEARCH
  // =====================================================

  function searchBooks(list, keyword) {
    const text = keyword.trim().toLowerCase();

    // Không nhập gì → trả lại toàn bộ sách của category
    if (!text) {
      return [...list];
    }

    return list.filter((book) => {
      const name = String(book.name || "").toLowerCase();

      const author = String(book.author || "").toLowerCase();

      return name.includes(text) || author.includes(text);
    });
  }

  // =====================================================
  // SORT
  // =====================================================

  function sortBooks(list, value) {
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
          String(a.name || "").localeCompare(String(b.name || ""), "vi"),
        );
        break;

      case "name-desc":
        result.sort((a, b) =>
          String(b.name || "").localeCompare(String(a.name || ""), "vi"),
        );
        break;
    }

    return result;
  }

  // =====================================================
  // UPDATE RESULTS
  // =====================================================

  function updateResults() {
    const keyword = searchInput?.value || "";

    // 1. SEARCH
    let result = searchBooks(categoryBooks, keyword);

    // 2. SORT
    result = sortBooks(result, sortSelect?.value || "default");

    // 3. RENDER
    renderResults(result);

    console.log("SEARCH:", keyword);
    console.log("RESULT:", result);
  }

  // =====================================================
  // RENDER BOOK
  // =====================================================

  function renderResults(list) {
    productsGrid.innerHTML = "";

    // ===================================================
    // KHÔNG TÌM THẤY
    // ===================================================

    if (list.length === 0) {
      productsGrid.innerHTML = `
        <div class="empty-results">
          <div class="empty-book">
            <div class="book-left"></div>
            <div class="book-right"></div>
            <div class="book-center"></div>
          </div>

          <p>Nothing was found :(</p>
        </div>
      `;

      return;
    }

    // ===================================================
    // CÓ SÁCH
    // ===================================================

    list.forEach((book) => {
      const card = document.createElement("article");

      card.className = "category-product-card";

      card.innerHTML = `
        <div class="category-product-image">
          <img
            src="${book.image}"
            alt="${book.name}"
          />
        </div>

        <div class="category-product-content">
          <h3>${book.name}</h3>

          <div class="category-product-bottom">
            <span class="category-product-price">
              ${Number(book.price || 0).toLocaleString("vi-VN")}đ
            </span>

            <button
              class="category-bookmark"
              type="button"
            >
              <img
                src="../images/iconbookmark.png"
                alt="Bookmark"
              />
            </button>
          </div>

          <button
            class="category-cart"
            type="button"
          >
            <img
              src="../images/iconcart.png"
              alt="Cart"
            />
          </button>
        </div>
      `;

      productsGrid.appendChild(card);
    });
  }

  // =====================================================
  // SEARCH KHI GÕ
  // =====================================================

  if (searchInput) {
    searchInput.addEventListener("input", updateResults);

    // Enter cũng search
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        updateResults();
      }
    });
  }

  // =====================================================
  // CLICK KÍNH LÚP
  // =====================================================

  if (searchButton) {
    searchButton.addEventListener("click", updateResults);
  }

  // =====================================================
  // FILTER / SORT
  // =====================================================

  if (sortSelect) {
    sortSelect.addEventListener("change", updateResults);
  }
});
