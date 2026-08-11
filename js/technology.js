document.addEventListener("DOMContentLoaded", async () => {
  const productsGrid = document.querySelector(".products-grid");

  if (!productsGrid) {
    console.log("KHÔNG TÌM THẤY .products-grid");
    return;
  }

  try {
    // =====================================================
    // LOAD BOOK JSON
    // =====================================================

    const response = await fetch("../data/book.json");

    console.log("STATUS:", response.status);

    if (!response.ok) {
      throw new Error("Không đọc được book.json");
    }

    const books = await response.json();

    console.log("BOOKS:", books);

    // =====================================================
    // CHỈ LẤY SÁCH TECHNOLOGY
    // =====================================================

    const categoryBooks = books.filter(
      (book) => book.category === "Kỹ thuật công nghệ",
    );

    console.log("TECHNOLOGY:", categoryBooks);

    // Xóa card mẫu trong HTML
    productsGrid.innerHTML = "";

    // =====================================================
    // TẠO CARD TỪ JSON
    // =====================================================

    categoryBooks.forEach((book) => {
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
          <h3 title="${book.name}">
            ${book.name}
          </h3>

          <div class="category-product-bottom">
            <span class="category-product-price">
              ${Number(book.price).toLocaleString("vi-VN")}đ
            </span>

            <button
              class="category-bookmark"
              type="button"
              aria-label="Lưu ${book.name}"
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
            aria-label="Thêm ${book.name} vào giỏ hàng"
          >
            <img
              src="../images/iconcart.png"
              alt="Thêm vào giỏ hàng"
            />
          </button>
        </div>
      `;

      productsGrid.appendChild(card);
    });

    // =====================================================
    // BOOKMARK
    // =====================================================

    productsGrid.querySelectorAll(".category-bookmark").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        button.classList.toggle("active");
      });
    });

    // =====================================================
    // CART
    // =====================================================

    productsGrid.querySelectorAll(".category-cart").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        button.classList.toggle("active");
      });
    });

    // =====================================================
    // FILTER / SORT
    // =====================================================

    const sortSelect = document.querySelector(".category-filter");

    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        const cards = Array.from(
          productsGrid.querySelectorAll(".category-product-card"),
        );

        const value = sortSelect.value;

        cards.sort((a, b) => {
          const nameA = a.querySelector("h3")?.textContent.trim() || "";

          const nameB = b.querySelector("h3")?.textContent.trim() || "";

          const priceA = Number(
            a
              .querySelector(".category-product-price")
              ?.textContent.replace(/\D/g, "") || 0,
          );

          const priceB = Number(
            b
              .querySelector(".category-product-price")
              ?.textContent.replace(/\D/g, "") || 0,
          );

          switch (value) {
            // Giá thấp → cao
            case "price-asc":
              return priceA - priceB;

            // Giá cao → thấp
            case "price-desc":
              return priceB - priceA;

            // Tên A → Z
            case "name-asc":
              return nameA.localeCompare(nameB, "vi");

            // Tên Z → A
            case "name-desc":
              return nameB.localeCompare(nameA, "vi");

            default:
              return 0;
          }
        });

        cards.forEach((card) => {
          productsGrid.appendChild(card);
        });
      });
    }

    // =====================================================
    // HOÀN TẤT
    // =====================================================

    console.log("ĐÃ HIỂN THỊ TECHNOLOGY:", categoryBooks.length, "CUỐN");
  } catch (error) {
    console.error("LỖI:", error);

    productsGrid.innerHTML = `
      <p style="color:red;">
        Không tải được book.json
      </p>
    `;
  }
});
