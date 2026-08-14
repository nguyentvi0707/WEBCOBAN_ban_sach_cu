/* =====================================================
   IUHSVBOOK - SCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  /* =====================================================
     LOAD BOOK.JSON
  ===================================================== */

  let books = [];

  try {
    const response = await fetch("../data/book.json");

    console.log("BOOK JSON STATUS:", response.status);

    if (!response.ok) {
      throw new Error("Không đọc được book.json");
    }

    books = await response.json();

    console.log("BOOK JSON:", books);
  } catch (error) {
    console.error("LỖI LOAD BOOK.JSON:", error);
  }

  /* =====================================================
     HÀM TẠO CARD SÁCH
  ===================================================== */

  function createBookCard(book) {
    const card = document.createElement("article");

    card.className = "book-card";

    card.innerHTML = `
      <img
        src="${book.image}"
        alt="${book.name || "Book"}"
        draggable="false"
      />

      <p title="${book.name || ""}">
        ${book.name || "Không có tên"}
      </p>
    `;

    return card;
  }

  /* =====================================================
     HÀM TẠO PRODUCT CARD
  ===================================================== */

  function createProductCard(book) {
    const card = document.createElement("article");

    card.className = "product-card";

    const price = Number(book.price || 0).toLocaleString("vi-VN");

    card.innerHTML = `
      <div class="product-image">
        <img
          src="${book.image}"
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
      >
        <img
          src="../images/iconcart.png"
          alt="Thêm vào giỏ hàng"
        />
      </button>
    `;

    return card;
  }

  /* =====================================================
     HÀM LẤY CATEGORY
  ===================================================== */

  function getCategoryBooks(categoryNames) {
    if (!Array.isArray(books)) {
      return [];
    }

    return books.filter((book) => {
      const category = String(book.category || "")
        .trim()
        .toLowerCase();

      return categoryNames.some((name) => category === name.toLowerCase());
    });
  }

  /* =====================================================
IUHSVBOOK - TOP BOOKS
===================================================== */

  const booksBox = document.querySelector(".books-box");
  const booksList = document.querySelector(".books-list");
  const booksPrev = document.querySelector(".books-prev");
  const booksNext = document.querySelector(".books-next");

  if (booksBox && booksList) {
    let booksPosition = 0;
    let booksStartX = 0;
    let booksStartPosition = 0;
    let booksDragging = false;

    /* =====================================================
     LOAD BOOK.JSON
  ===================================================== */

    const loadTopBooks = async () => {
      try {
        const response = await fetch("./data/book.json");

        if (!response.ok) {
          throw new Error("Không đọc được book.json");
        }

        const books = await response.json();

        console.log("TOP BOOKS:", books);

        /*
         * Lấy tối đa 12 cuốn đầu tiên.
         * Nếu muốn nhiều hơn thì đổi 12 thành số khác.
         */
        const topBooks = books.slice(0, 12);

        /*
         * Xóa các card mẫu trong HTML
         */
        booksList.innerHTML = "";

        /*
         * Tạo card từ book.json
         */
        topBooks.forEach((book) => {
          const card = document.createElement("article");

          card.className = "book-card";

          card.innerHTML = `
          <img
            src="${book.image}"
            alt="${book.name}"
          />

          <p title="${book.name}">
            ${book.name}
          </p>
        `;

          booksList.appendChild(card);
        });

        /*
         * Reset vị trí slider sau khi tạo sách
         */
        booksPosition = 0;

        updateBooks();
      } catch (error) {
        console.error("LỖI TOP BOOKS:", error);

        booksList.innerHTML = `
        <p style="color:red;">
          Không tải được danh sách sách
        </p>
      `;
      }
    };

    /* =====================================================
     TÍNH GIỚI HẠN SLIDER
  ===================================================== */

    const getBooksMaxPosition = () => {
      return Math.max(0, booksBox.scrollWidth - booksBox.clientWidth);
    };

    /* =====================================================
     CẬP NHẬT SLIDER
  ===================================================== */

    const updateBooks = () => {
      const maxPosition = getBooksMaxPosition();

      booksPosition = Math.max(0, Math.min(booksPosition, maxPosition));

      booksList.style.transform = `translate3d(-${booksPosition}px, 0, 0)`;

      if (booksPrev) {
        booksPrev.disabled = booksPosition <= 0;
      }

      if (booksNext) {
        booksNext.disabled = booksPosition >= maxPosition;
      }
    };

    /* =====================================================
     KHOẢNG DI CHUYỂN MỖI LẦN BẤM
  ===================================================== */

    const getBooksStep = () => {
      const card = booksList.querySelector(".book-card");

      if (!card) return 200;

      const gap = parseFloat(getComputedStyle(booksList).gap) || 0;

      return card.offsetWidth + gap;
    };

    /* =====================================================
     NÚT PREVIOUS
  ===================================================== */

    if (booksPrev) {
      booksPrev.addEventListener("click", () => {
        booksPosition -= getBooksStep();

        updateBooks();
      });
    }

    /* =====================================================
     NÚT NEXT
  ===================================================== */

    if (booksNext) {
      booksNext.addEventListener("click", () => {
        booksPosition += getBooksStep();

        updateBooks();
      });
    }

    /* =====================================================
     DRAG TOP BOOKS
  ===================================================== */

    booksList.addEventListener("pointerdown", (e) => {
      /*
       * Không drag khi click button
       */
      if (e.target.closest("button")) return;

      booksDragging = true;

      booksStartX = e.clientX;

      booksStartPosition = booksPosition;

      booksList.classList.add("dragging");

      booksList.setPointerCapture(e.pointerId);
    });

    /* =====================================================
     DI CHUYỂN KHI DRAG
  ===================================================== */

    booksList.addEventListener("pointermove", (e) => {
      if (!booksDragging) return;

      const distance = booksStartX - e.clientX;

      booksPosition = booksStartPosition + distance;

      updateBooks();
    });

    /* =====================================================
     KẾT THÚC DRAG
  ===================================================== */

    const stopBooksDrag = (e) => {
      if (!booksDragging) return;

      booksDragging = false;

      booksList.classList.remove("dragging");

      if (
        e &&
        booksList.hasPointerCapture &&
        booksList.hasPointerCapture(e.pointerId)
      ) {
        booksList.releasePointerCapture(e.pointerId);
      }

      updateBooks();
    };

    booksList.addEventListener("pointerup", stopBooksDrag);

    booksList.addEventListener("pointercancel", stopBooksDrag);

    /* =====================================================
     MOBILE
  ===================================================== */

    booksList.style.touchAction = "pan-y";

    /* =====================================================
     RESPONSIVE
  ===================================================== */

    window.addEventListener("resize", () => {
      updateBooks();
    });

    /* =====================================================
     CHẠY LOAD
  ===================================================== */

    loadTopBooks();
  }
  /* =====================================================
     BOOK CATEGORY
     - ĐẠI CƯƠNG
     - CÔNG NGHỆ THÔNG TIN
     - CÁC CATEGORY KHÁC
  ===================================================== */

  const productSliders = document.querySelectorAll(".product-slider");

  productSliders.forEach((slider) => {
    const productWindow = slider.querySelector(".product-window");

    const productList = slider.querySelector(".product-list");

    const prevButton = slider.querySelector(".product-prev");

    const nextButton = slider.querySelector(".product-next");

    if (!productWindow || !productList) {
      return;
    }

    /* =====================================================
         XÁC ĐỊNH CATEGORY CỦA SECTION
      ===================================================== */

    let section = slider.closest(".book-category-section");

    let sectionTitle = section?.querySelector(".book-category-title h2");

    let title = sectionTitle?.textContent.trim().toLowerCase() || "";

    /*
     * Tìm category dựa trên tiêu đề.
     */

    let categoryBooks = [];

    if (title.includes("đại cương") || title.includes("general")) {
      categoryBooks = getCategoryBooks(["Đại cương", "General"]);
    } else if (
      title.includes("công nghệ") ||
      title.includes("technology") ||
      title.includes("it")
    ) {
      categoryBooks = getCategoryBooks([
        "Kỹ thuật công nghệ",
        "Technology",
        "IT",
      ]);
    }

    /*
     * Nếu không xác định được category
     * thì giữ sách HTML cũ.
     */

    if (categoryBooks.length > 0) {
      productList.innerHTML = "";

      categoryBooks.forEach((book) => {
        const card = createProductCard(book);

        productList.appendChild(card);
      });
    }

    /* =====================================================
         SLIDER
      ===================================================== */

    let position = 0;

    let dragging = false;

    let startX = 0;

    let startPosition = 0;

    const getMaxPosition = () => {
      return Math.max(0, productWindow.scrollWidth - productWindow.clientWidth);
    };

    const updateSlider = () => {
      const maxPosition = getMaxPosition();

      position = Math.max(0, Math.min(position, maxPosition));

      productList.style.transform = `translate3d(-${position}px, 0, 0)`;

      if (prevButton) {
        prevButton.disabled = position <= 0;
      }

      if (nextButton) {
        nextButton.disabled = position >= maxPosition;
      }
    };

    const getStep = () => {
      const card = productList.querySelector(".product-card");

      if (!card) {
        return 160;
      }

      const style = getComputedStyle(productList);

      const gap = parseFloat(style.columnGap || style.gap) || 0;

      return card.getBoundingClientRect().width + gap;
    };

    /* =====================================================
         PREVIOUS
      ===================================================== */

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        position -= getStep();

        updateSlider();
      });
    }

    /* =====================================================
         NEXT
      ===================================================== */

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        const maxPosition = getMaxPosition();

        position += getStep();

        if (position > maxPosition) {
          position = maxPosition;
        }

        updateSlider();
      });
    }

    /* =====================================================
         DRAG
      ===================================================== */

    productList.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button")) {
        return;
      }

      dragging = true;

      startX = e.clientX;

      startPosition = position;

      productList.classList.add("dragging");

      productList.setPointerCapture(e.pointerId);
    });

    productList.addEventListener("pointermove", (e) => {
      if (!dragging) {
        return;
      }

      const distance = startX - e.clientX;

      position = startPosition + distance;

      updateSlider();
    });

    const stopDrag = (e) => {
      if (!dragging) {
        return;
      }

      dragging = false;

      productList.classList.remove("dragging");

      if (
        e &&
        productList.hasPointerCapture &&
        productList.hasPointerCapture(e.pointerId)
      ) {
        productList.releasePointerCapture(e.pointerId);
      }

      updateSlider();
    };

    productList.addEventListener("pointerup", stopDrag);

    productList.addEventListener("pointercancel", stopDrag);

    /*
     * MOBILE
     */

    productList.style.touchAction = "pan-y";

    updateSlider();

    window.addEventListener("resize", updateSlider);
  });

  /* =====================================================
     BOOKMARK
  ===================================================== */

  document.querySelectorAll(".product-bookmark").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      e.stopPropagation();

      button.classList.toggle("active");
    });
  });

  /* =====================================================
     ADD CART
  ===================================================== */

  document.querySelectorAll(".add-cart").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      e.stopPropagation();

      button.classList.add("added");

      setTimeout(() => {
        button.classList.remove("added");
      }, 300);
    });
  });

  /* =====================================================
     EXPLORE BUTTON
  ===================================================== */

  const exploreButton = document.querySelector(".explore-btn");

  if (exploreButton) {
    exploreButton.addEventListener("click", () => {
      const categorySection = document.querySelector(".category-section");

      if (categorySection) {
        categorySection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }

  /* =====================================================
     SEARCH
  ===================================================== */

  const searchInput = document.querySelector(".search-box input");

  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") {
        return;
      }

      const keyword = searchInput.value.trim();

      if (!keyword) {
        return;
      }

      console.log("Search:", keyword);
    });
  }

  /* =====================================================
     FOOTER NEWSLETTER
  ===================================================== */

  const newsletterInput = document.querySelector(".newsletter-form input");

  const newsletterButton = document.querySelector(".newsletter-form button");

  if (newsletterInput && newsletterButton) {
    newsletterButton.addEventListener("click", () => {
      const email = newsletterInput.value.trim();

      if (!email) {
        return;
      }

      console.log("Newsletter:", email);

      newsletterInput.value = "";
    });
  }

  /* =====================================================
     DEBUG
  ===================================================== */

  console.log("=================================");

  console.log("IUHSVBOOK SCRIPT READY");

  console.log("Tổng số sách:", books.length);

  console.log("=================================");
});

const homeSearchInput = document.querySelector(".hero-search-input");
const exploreBtn = document.querySelector(".explore-btn");

if (exploreBtn) {
  exploreBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const keyword = homeSearchInput?.value.trim() || "";

    window.location.href =
      `./pages/catalog.html?search=${encodeURIComponent(keyword)}`;
  });
}