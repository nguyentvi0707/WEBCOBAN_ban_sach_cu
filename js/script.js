/* =====================================================
   IUHSVBOOK - SCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  console.log("=================================");
  console.log("IUHSVBOOK SCRIPT START");
  console.log("=================================");

  /* =====================================================
     LOAD BOOK.JSON
  ===================================================== */

  let books = [];

  try {
    const jsonURL = new URL("./data/book.json", window.location.href);

    console.log("BOOK.JSON URL:", jsonURL.href);

    const response = await fetch(jsonURL.href, {
      cache: "no-store",
    });

    console.log("BOOK JSON STATUS:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("book.json không phải là mảng.");
    }

    books = data;

    console.log("BOOK JSON LOADED:", books);

    console.log("TOTAL BOOKS:", books.length);
  } catch (error) {
    console.error("=================================");

    console.error("LỖI LOAD BOOK.JSON:", error);

    console.error("Kiểm tra file:", "./data/book.json");

    console.error("=================================");

    books = [];
  }

  /* =====================================================
     LOGIN
===================================================== */

  const getCurrentUser = () => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      return null;
    }

    try {
      return JSON.parse(currentUser);
    } catch (error) {
      console.error("Lỗi đọc currentUser:", error);

      localStorage.removeItem("currentUser");

      return null;
    }
  };

  /* =====================================================
     REQUIRE LOGIN
===================================================== */

  const requireLogin = () => {
    const user = getCurrentUser();

    if (user) {
      return true;
    }

    alert("Bạn cần đăng nhập trước khi xem sản phẩm!");

    /*
     * Lưu trang hiện tại để sau này
     * có thể quay lại Index.
     */

    const currentPage = window.location.pathname;

    const loginURL =
      "./pages/login.html?redirect=" + encodeURIComponent(currentPage);

    window.location.href = loginURL;

    return false;
  };

  /* =====================================================
     HELPER
===================================================== */

  const normalizeText = (value) => {
    return String(value || "")
      .trim()
      .toLowerCase();
  };

  const getBookId = (book) => {
    if (!book || book.id === undefined || book.id === null) {
      return "";
    }

    return String(book.id);
  };

  /* =====================================================
     OPEN PRODUCT DETAIL
===================================================== */

  const openProductDetail = (book) => {
    if (!book) {
      return;
    }

    /*
     * QUAN TRỌNG:
     * Mọi đường dẫn vào Product Detail
     * đều phải đi qua requireLogin().
     */

    if (!requireLogin()) {
      return;
    }

    const id = getBookId(book);

    if (!id) {
      console.error("Book không có ID:", book);

      return;
    }

    const detailURL = "./pages/productDetail.html?id=" + encodeURIComponent(id);

    console.log("OPEN PRODUCT DETAIL:", detailURL);

    window.location.href = detailURL;
  };

  /* =====================================================
     BOOKMARK
===================================================== */

  const getBookmarks = () => {
    try {
      const data = JSON.parse(localStorage.getItem("bookmarks"));

      return Array.isArray(data) ? data : [];
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
    let bookmarks = getBookmarks();

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
     CREATE TOP BOOK CARD
===================================================== */

  const createBookCard = (book) => {
    const card = document.createElement("article");

    card.className = "book-card";

    card.dataset.productId = getBookId(book);

    card.innerHTML = `
      <img
        src="${book.image || "./images/COVER_BOOK.png"}"
        alt="${book.name || "Book"}"
        draggable="false"
      />

      <p title="${book.name || ""}">
        ${book.name || "Không có tên"}
      </p>
    `;

    /* IMAGE DRAG */

    const image = card.querySelector("img");

    if (image) {
      image.addEventListener("dragstart", (event) => {
        event.preventDefault();
      });
    }

    /* CLICK */

    card.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      /*
       * Nếu vừa kéo slider thì không mở detail.
       */

      if (
        document.querySelector(".books-list")?.dataset.justDragged === "true"
      ) {
        return;
      }

      openProductDetail(book);
    });

    return card;
  };

  /* =====================================================
     CREATE PRODUCT CARD
===================================================== */

  const createProductCard = (book) => {
    const card = document.createElement("article");

    card.className = "product-card";

    card.dataset.productId = getBookId(book);

    const price = Number(book.price || 0).toLocaleString("vi-VN");

    const image = book.image || "./images/COVER_BOOK.png";

    const name = book.name || "Không có tên";

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
          class="product-bookmark ${isBookmarked(book.id) ? "active" : ""}"
          type="button"
          aria-label="Bookmark"
        >
          <img
            src="./images/iconbookmark.png"
            alt="Bookmark"
            draggable="false"
          />
        </button>

      </div>

      <button
        class="add-cart"
        type="button"
        aria-label="Xem chi tiết"
      >
        <img
          src="./images/iconcart.png"
          alt="Xem chi tiết"
          draggable="false"
        />
      </button>
    `;

    /* =================================================
       BOOKMARK
    ================================================= */

    const bookmark = card.querySelector(".product-bookmark");

    if (bookmark) {
      bookmark.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const active = toggleBookmark(book.id);

        bookmark.classList.toggle("active", active);
      });
    }

    /* =================================================
       BUY / CART BUTTON
       
       BẮT ĐĂNG NHẬP TRƯỚC
    ================================================= */

    const buyButton = card.querySelector(".add-cart");

    if (buyButton) {
      buyButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        /*
         * Không cho mua nếu chưa đăng nhập.
         *
         * requireLogin() sẽ tự chuyển Login.
         */

        if (!requireLogin()) {
          return;
        }

        /*
         * Đã login -> Product Detail.
         */

        openProductDetail(book);
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
      /*
       * Bookmark có event riêng.
       */

      if (event.target.closest(".product-bookmark")) {
        return;
      }

      /*
       * Buy có event riêng.
       */

      if (event.target.closest(".add-cart")) {
        return;
      }

      /*
       * Nếu slider vừa kéo.
       */

      const list = card.closest(".product-list");

      if (list?.dataset.justDragged === "true") {
        return;
      }

      /*
       * Mọi click card
       * đều đi qua openProductDetail()
       * và bị requireLogin() kiểm tra.
       */

      openProductDetail(book);
    });

    return card;
  };

  /* =====================================================
     CATEGORY
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

  const getCategoryBooks = (categoryNames) => {
    if (!Array.isArray(categoryNames)) {
      return [];
    }

    return books.filter((book) => {
      const category = normalizeText(getBookCategory(book));

      return categoryNames.some((name) => category === normalizeText(name));
    });
  };

  /* =====================================================
     TOP BOOKS
===================================================== */

  const booksBox = document.querySelector(".books-box");

  const booksList = document.querySelector(".books-list");

  const booksPrev = document.querySelector(".books-prev");

  const booksNext = document.querySelector(".books-next");

  if (booksBox && booksList) {
    console.log("TOP BOOKS ELEMENT FOUND");

    let position = 0;
    let dragging = false;

    let startX = 0;
    let startPosition = 0;

    let moved = false;
    let pointerId = null;

    /* RENDER */

    const renderTopBooks = () => {
      booksList.innerHTML = "";

      const topBooks = books.slice(0, 12);

      topBooks.forEach((book) => {
        booksList.appendChild(createBookCard(book));
      });

      position = 0;

      requestAnimationFrame(() => {
        updateSlider();
      });
    };

    /* MAX */

    const getMaxPosition = () => {
      return Math.max(0, booksList.scrollWidth - booksBox.clientWidth);
    };

    /* UPDATE */

    const updateSlider = () => {
      const max = getMaxPosition();

      position = Math.max(0, Math.min(position, max));

      booksList.style.transform = `translate3d(-${position}px,0,0)`;

      if (booksPrev) {
        booksPrev.disabled = position <= 0;
      }

      if (booksNext) {
        booksNext.disabled = position >= max;
      }
    };

    /* STEP */

    const getStep = () => {
      const card = booksList.querySelector(".book-card");

      if (!card) {
        return 200;
      }

      const styles = getComputedStyle(booksList);

      const gap = parseFloat(styles.columnGap) || parseFloat(styles.gap) || 0;

      return card.getBoundingClientRect().width + gap;
    };

    /* PREVIOUS */

    if (booksPrev) {
      booksPrev.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        position -= getStep();

        updateSlider();
      });
    }

    /* NEXT */

    if (booksNext) {
      booksNext.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        position += getStep();

        updateSlider();
      });
    }

    /* POINTER DOWN */

    booksList.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      if (event.target.closest("button")) {
        return;
      }

      if (getMaxPosition() <= 0) {
        return;
      }

      dragging = true;
      moved = false;

      startX = event.clientX;

      startPosition = position;

      pointerId = event.pointerId;

      booksList.classList.add("dragging");
    });

    /* POINTER MOVE */

    booksList.addEventListener("pointermove", (event) => {
      if (!dragging) {
        return;
      }

      if (pointerId !== null && event.pointerId !== pointerId) {
        return;
      }

      const distance = startX - event.clientX;

      if (Math.abs(distance) >= 8) {
        moved = true;
      }

      if (!moved) {
        return;
      }

      event.preventDefault();

      position = startPosition + distance;

      updateSlider();
    });

    /* POINTER UP */

    const stopDrag = (event) => {
      if (!dragging) {
        return;
      }

      if (pointerId !== null && event.pointerId !== pointerId) {
        return;
      }

      const wasDragged = moved;

      dragging = false;
      pointerId = null;

      booksList.classList.remove("dragging");

      if (wasDragged) {
        booksList.dataset.justDragged = "true";

        setTimeout(() => {
          delete booksList.dataset.justDragged;
        }, 250);
      }

      moved = false;

      updateSlider();
    };

    booksList.addEventListener("pointerup", stopDrag);

    booksList.addEventListener("pointercancel", stopDrag);

    booksList.style.touchAction = "pan-y";

    window.addEventListener("resize", updateSlider);

    renderTopBooks();
  } else {
    console.warn("Không tìm thấy .books-box hoặc .books-list");
  }

  /* =====================================================
     PRODUCT CATEGORY SLIDERS
===================================================== */

  const productSliders = document.querySelectorAll(".product-slider");

  productSliders.forEach((slider) => {
    const productWindow = slider.querySelector(".product-window");

    const productList = slider.querySelector(".product-list");

    const prev = slider.querySelector(".product-prev");

    const next = slider.querySelector(".product-next");

    if (!productWindow || !productList) {
      return;
    }

    const section = slider.closest(".book-category-section");

    const titleElement = section?.querySelector(".book-category-title h2");

    const title = titleElement?.textContent.trim().toLowerCase() || "";

    let categoryBooks = [];

    /* ĐẠI CƯƠNG */

    if (title.includes("đại cương") || title.includes("general")) {
      categoryBooks = getCategoryBooks(["Đại cương", "General"]);
    } else if (
      /* CÔNG NGHỆ */
      title.includes("công nghệ") ||
      title.includes("technology") ||
      title.includes("it")
    ) {
      categoryBooks = getCategoryBooks([
        "Kỹ thuật - Công nghệ",
        "Kỹ thuật công nghệ",
        "Công nghệ thông tin",
        "Technology",
        "IT",
      ]);
    }

    /* RENDER JSON */

    if (categoryBooks.length > 0) {
      productList.innerHTML = "";

      categoryBooks.forEach((book) => {
        productList.appendChild(createProductCard(book));
      });
    }

    /* SLIDER */

    let position = 0;
    let dragging = false;

    let startX = 0;
    let startPosition = 0;

    let moved = false;
    let pointerId = null;

    const getMax = () => {
      return Math.max(0, productList.scrollWidth - productWindow.clientWidth);
    };

    const update = () => {
      const max = getMax();

      position = Math.max(0, Math.min(position, max));

      productList.style.transform = `translate3d(-${position}px,0,0)`;

      if (prev) {
        prev.disabled = position <= 0;
      }

      if (next) {
        next.disabled = position >= max;
      }
    };

    const getStep = () => {
      const card = productList.querySelector(".product-card");

      if (!card) {
        return 180;
      }

      const styles = getComputedStyle(productList);

      const gap = parseFloat(styles.columnGap) || parseFloat(styles.gap) || 0;

      return card.getBoundingClientRect().width + gap;
    };

    /* PREV */

    if (prev) {
      prev.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        position -= getStep();

        update();
      });
    }

    /* NEXT */

    if (next) {
      next.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        position += getStep();

        update();
      });
    }

    /* DRAG */

    productList.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      if (event.target.closest("button")) {
        return;
      }

      if (getMax() <= 0) {
        return;
      }

      dragging = true;
      moved = false;

      startX = event.clientX;

      startPosition = position;

      pointerId = event.pointerId;

      productList.classList.add("dragging");
    });

    productList.addEventListener("pointermove", (event) => {
      if (!dragging) {
        return;
      }

      if (pointerId !== null && event.pointerId !== pointerId) {
        return;
      }

      const distance = startX - event.clientX;

      if (Math.abs(distance) >= 8) {
        moved = true;
      }

      if (!moved) {
        return;
      }

      event.preventDefault();

      position = startPosition + distance;

      update();
    });

    const stopProductDrag = (event) => {
      if (!dragging) {
        return;
      }

      if (pointerId !== null && event.pointerId !== pointerId) {
        return;
      }

      const wasDragged = moved;

      dragging = false;
      moved = false;
      pointerId = null;

      productList.classList.remove("dragging");

      if (wasDragged) {
        productList.dataset.justDragged = "true";

        setTimeout(() => {
          delete productList.dataset.justDragged;
        }, 250);
      }

      update();
    };

    productList.addEventListener("pointerup", stopProductDrag);

    productList.addEventListener("pointercancel", stopProductDrag);

    productList.style.touchAction = "pan-y";

    requestAnimationFrame(() => {
      update();
    });

    window.addEventListener("resize", update);
  });

  /* =====================================================
     HOME SEARCH → CATALOG
===================================================== */

  const searchInput = document.querySelector(".hero-search-input");

  const searchIcon = document.querySelector("#searchIcon");

  const goToCatalog = () => {
    const keyword = searchInput?.value.trim() || "";

    if (!keyword) {
      window.location.href = "./pages/catalog.html";

      return;
    }

    window.location.href = `./pages/catalog.html?search=${encodeURIComponent(
      keyword,
    )}`;
  };

  if (searchInput) {
    searchInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();

      goToCatalog();
    });
  }

  if (searchIcon) {
    searchIcon.addEventListener("click", goToCatalog);
  }

  /* =====================================================
     EXPLORE
===================================================== */

  const exploreButton = document.querySelector(".explore-btn");

  if (exploreButton) {
    exploreButton.addEventListener("click", (event) => {
      event.preventDefault();

      goToCatalog();
    });
  }

  /* =====================================================
     USER LOGIN UI
===================================================== */

  const signInButton = document.querySelector("#signInButton");

  const userInfo = document.querySelector("#userInfo");

  const usernameDisplay = document.querySelector("#usernameDisplay");

  const logoutButton = document.querySelector("#logoutButton");

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("shoppingCart");

      sessionStorage.removeItem("lastOrder");
      sessionStorage.removeItem("checkoutRedirect");

      alert("Đã đăng xuất!");

      window.location.reload();
    });
  }

  const updateUserUI = () => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      if (signInButton) {
        signInButton.style.display = "flex";
      }

      if (userInfo) {
        userInfo.style.display = "none";
      }

      return;
    }

    if (signInButton) {
      signInButton.style.display = "none";
    }

    if (userInfo) {
      userInfo.style.display = "flex";
    }

    if (usernameDisplay) {
      usernameDisplay.textContent =
        currentUser.username || currentUser.name || currentUser.email || "";
    }
  };

  updateUserUI();

  /* =====================================================
     LOGOUT
===================================================== */

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      /* XÓA TÀI KHOẢN */
      localStorage.removeItem("currentUser");

      /* XÓA GIỎ HÀNG */
      localStorage.removeItem("shoppingCart");

      /* XÓA ĐƠN HÀNG TẠM */
      sessionStorage.removeItem("lastOrder");

      /* XÓA REDIRECT */
      sessionStorage.removeItem("checkoutRedirect");

      alert("Đã đăng xuất!");

      window.location.reload();
    });
  }
  /* =====================================================
     FINISH
===================================================== */

  console.log("=================================");

  console.log("IUHSVBOOK SCRIPT READY");

  console.log("BOOK COUNT:", books.length);

  console.log("=================================");
});
const goToLogin = () => {
  const currentPage =
    window.location.pathname + window.location.search + window.location.hash;

  const loginURL = new URL("./login.html", window.location.href);

  loginURL.searchParams.set("redirect", currentPage);

  window.location.href = loginURL.href;
};
