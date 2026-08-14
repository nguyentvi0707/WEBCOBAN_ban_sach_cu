document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
     BIẾN DÙNG CHUNG
  ===================================================== */

  const grid = document.getElementById("productsGrid");
  const emptyMessage = document.getElementById("productsEmpty");
  const countLabel = document.getElementById("productsCount");

  const searchInput = document.getElementById("productsSearchInput");
  const searchButton = document.getElementById("productsSearchButton");
  const sortSelect = document.getElementById("productsSortSelect");

  let allBooks = []; 
  let visibleBooks = []; // sau khi search + sort

  /* =====================================================
     XÁO TRỘN NGẪU NHIÊN DANH SÁCH SÁCH
  ===================================================== */

  function shuffleArray(list) {
    const result = [...list];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /* =====================================================
     ĐỊNH DẠNG GIÁ TIỀN (15000 -> 15.000đ)
  ===================================================== */

  function formatPrice(value) {
    return value.toLocaleString("vi-VN") + "đ";
  }

  /* =====================================================
     TẠO 1 THẺ SÁCH
  ===================================================== */

  function createBookCard(book) {
    const article = document.createElement("article");
    article.className = "category-product-card";

    article.innerHTML = `
      <div class="category-product-image">
        <img src="${book.image}" alt="${book.name}" />
      </div>

      <div class="category-product-content">
        <h3>${book.name}</h3>

        <div class="category-product-bottom">
          <span class="category-product-price">${formatPrice(book.price)}</span>

          <button class="category-bookmark" type="button">
            <img src="../images/iconbookmark.png" alt="Bookmark" />
          </button>
        </div>

        <button class="category-cart" type="button">
          <img src="../images/iconcart.png" alt="Thêm vào giỏ" />
        </button>
      </div>
    `;

    return article;
  }

  /* =====================================================
     RENDER LƯỚI SÁCH THEO TRANG HIỆN TẠI
  ===================================================== */

  function renderGrid() {
    grid.innerHTML = "";

    if (visibleBooks.length === 0) {
      emptyMessage.hidden = false;
      countLabel.textContent = "";
      return;
    }

    emptyMessage.hidden = true;

    visibleBooks.forEach((book) => {
      grid.appendChild(createBookCard(book));
    });

    countLabel.textContent = `(${visibleBooks.length} cuốn)`;
  }

  /* =====================================================
     TÌM KIẾM
  ===================================================== */

  function applySearchAndSort() {
    const keyword = searchInput.value.trim().toLowerCase();

    visibleBooks = allBooks.filter((book) =>
      keyword === "" ? true : book.name.toLowerCase().includes(keyword),
    );

    const sortValue = sortSelect.value;

    visibleBooks.sort((a, b) => {
      switch (sortValue) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0; // giữ nguyên thứ tự ngẫu nhiên ban đầu
      }
    });

    renderGrid();
  }

  if (searchButton) {
    searchButton.addEventListener("click", applySearchAndSort);
  }

  if (searchInput) {
    searchInput.addEventListener("input", applySearchAndSort);
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") applySearchAndSort();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", applySearchAndSort);
  }

  /* =====================================================
     BOOKMARK / GIỎ HÀNG (event delegation vì thẻ sách
     được tạo động, không có sẵn lúc trang load)
  ===================================================== */

  grid.addEventListener("click", (event) => {
    const bookmarkBtn = event.target.closest(".category-bookmark");
    const cartBtn = event.target.closest(".category-cart");

    if (bookmarkBtn) {
      event.preventDefault();
      bookmarkBtn.classList.toggle("active");
    }

    if (cartBtn) {
      event.preventDefault();
      cartBtn.classList.toggle("active");
    }
  });

  /* =====================================================
     ĐỌC DỮ LIỆU VÀ KHỞI CHẠY
  ===================================================== */

  fetch("../data/book.json")
    .then((response) => {
      if (!response.ok) throw new Error("Không đọc được book.json");
      return response.json();
    })
    .then((data) => {
      allBooks = data;
      visibleBooks = shuffleArray([...allBooks]); // random thứ tự 60 cuốn
      renderGrid();
    })
    .catch((error) => {
      console.error(error);
      emptyMessage.hidden = false;
      emptyMessage.textContent =
        "Không tải được dữ liệu sách. Kiểm tra lại file data/book.json.";
    });
});