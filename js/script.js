/* =====================================================
   IUHSVBOOK - SCRIPT
   Trang INDEX
===================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  console.log("=================================");
  console.log("IUHSVBOOK SCRIPT START");
  console.log("PAGE:", window.location.href);
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

    console.log("BOOK.JSON STATUS:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error("BOOK.JSON PARSE ERROR:", error);

      console.error("SERVER TRẢ VỀ:", text.slice(0, 500));

      throw error;
    }

    if (!Array.isArray(data)) {
      throw new Error("book.json không phải là mảng.");
    }

    books = data;

    console.log("BOOK.JSON LOADED:", books);

    console.log("TOTAL BOOKS:", books.length);
  } catch (error) {
    console.error("=================================");

    console.error("LỖI LOAD BOOK.JSON:", error);

    console.error("Kiểm tra:", "./data/book.json");

    console.error("=================================");

    books = [];
  }

  /* =====================================================
     CURRENT USER
  ===================================================== */

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
      console.error("LỖI ĐỌC currentUser:", error);

      localStorage.removeItem("currentUser");

      return null;
    }
  };

  /* =====================================================
     PATH
  ===================================================== */

  const getPagePath = (fileName) => {
    return `./pages/${fileName}`;
  };

  /* =====================================================
     GO LOGIN
  ===================================================== */

  const goToLogin = () => {
    const currentPage =
      window.location.pathname + window.location.search + window.location.hash;

    const loginURL = new URL(getPagePath("login.html"), window.location.href);

    loginURL.searchParams.set("redirect", currentPage);

    console.log("LOGIN REDIRECT:", loginURL.href);

    window.location.href = loginURL.href;
  };

  /* =====================================================
     REQUIRE LOGIN
  ===================================================== */

  const requireLogin = () => {
    if (getCurrentUser()) {
      return true;
    }

    alert("Bạn cần đăng nhập trước khi thực hiện thao tác này!");

    goToLogin();

    return false;
  };

  /* =====================================================
     NORMALIZE
  ===================================================== */

  const normalizeText = (value) => {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .trim()
      .toLowerCase();
  };

  /* =====================================================
     BOOK ID
  ===================================================== */

  const getBookId = (book) => {
    if (
      !book ||
      book.id === undefined ||
      book.id === null ||
      String(book.id).trim() === ""
    ) {
      return "";
    }

    return String(book.id).trim();
  };

  /* =====================================================
     IMAGE
     
     QUAN TRỌNG:
     book.json phải chứa URL ảnh.

     Ví dụ:
     "image": "https://....jpg"

     Không tải ảnh về project.
  ===================================================== */

  const getBookImage = (book) => {
    const image = String(book?.image ?? "").trim();

    if (!image) {
      return "./images/COVER_BOOK.png";
    }

    /*
     * URL online:
     * dùng nguyên link.
     */

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    /*
     * Nếu sau này JSON có
     * đường dẫn local thì dùng nguyên.
     */

    if (
      image.startsWith("./") ||
      image.startsWith("../") ||
      image.startsWith("/")
    ) {
      return image;
    }

    /*
     * Tên file local:
     * chỉ dùng trong trường hợp
     * JSON thực sự chứa tên file.
     */

    return `./images/${encodeURI(image)}`;
  };

  /* =====================================================
     OPEN PRODUCT DETAIL
  ===================================================== */

  const openProductDetail = (book) => {
    if (!book) {
      return;
    }

    if (!requireLogin()) {
      return;
    }

    const id = getBookId(book);

    if (!id) {
      console.error("BOOK KHÔNG CÓ ID:", book);

      return;
    }

    const detailURL = new URL(
      getPagePath("productDetail.html"),
      window.location.href,
    );

    detailURL.searchParams.set("id", id);

    console.log("OPEN PRODUCT DETAIL:", detailURL.href);

    window.location.href = detailURL.href;
  };

  /* =====================================================
     BOOKMARK SYSTEM
     
     Chỉ kiểm tra.
     KHÔNG toggle tại đây.
     
     bookMarkButton.js là nơi duy nhất
     xử lý bookmark click.
  ===================================================== */

  const bookmarkReady =
    typeof window.isBookmarked === "function" &&
    typeof window.updateBookmarkButtons === "function";

  if (!bookmarkReady) {
    console.warn("bookMarkButton.js chưa được load.");
  }

  /* =====================================================
     CREATE TOP BOOK CARD
  ===================================================== */

  const createBookCard = (book) => {
    const id = getBookId(book);

    const card = document.createElement("article");

    card.className = "book-card";

    card.dataset.productId = id;

    const name = String(book?.name || "Không có tên");

    const image = getBookImage(book);

    card.innerHTML = `
      <img
        src="${image}"
        alt="${name}"
        draggable="false"
        loading="lazy"
      />

      <p
        title="${name}"
      >
        ${name}
      </p>
    `;

    /* =================================================
       IMAGE
    ================================================= */

    const imageElement = card.querySelector("img");

    if (imageElement) {
      imageElement.addEventListener(
        "error",
        () => {
          if (imageElement.dataset.fallback !== "true") {
            imageElement.dataset.fallback = "true";

            imageElement.src = "./images/COVER_BOOK.png";
          }
        },
        {
          once: true,
        },
      );

      imageElement.addEventListener("dragstart", (event) => {
        event.preventDefault();
      });
    }

    /* =================================================
       CLICK
    ================================================= */

    card.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const list = document.querySelector(".books-list");

      if (list?.dataset.justDragged === "true") {
        return;
      }

      openProductDetail(book);
    });

    return card;
  };

  /* =====================================================
     CREATE PRODUCT CARD
     
     KHÔNG GẮN CLICK BOOKMARK.
  ===================================================== */

  const createProductCard = (book) => {
    const id = getBookId(book);

    if (!id) {
      console.warn("BOOK KHÔNG CÓ ID:", book);

      return null;
    }

    const card = document.createElement("article");

    card.className = "product-card";

    card.dataset.productId = id;

    const name = String(book?.name || "Không có tên");

    const price = Number(book?.price || 0).toLocaleString("vi-VN");

    const image = getBookImage(book);

    const bookmarked =
      typeof window.isBookmarked === "function"
        ? window.isBookmarked(id)
        : false;

    card.innerHTML = `
      <div class="product-image">

        <img
          src="${image}"
          alt="${name}"
          draggable="false"
          loading="lazy"
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
          data-bookmark-id="${id}"
          aria-label="${bookmarked ? "Bỏ yêu thích" : "Thêm yêu thích"}"
          aria-pressed="${String(bookmarked)}"
        >
          <img
            src="./images/iconbookmark.png"
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
          src="./images/iconcart.png"
          alt="Xem chi tiết"
          draggable="false"
        />
      </button>
    `;

    /* =================================================
       IMAGE
    ================================================= */

    const imageElement = card.querySelector(".product-image img");

    if (imageElement) {
      imageElement.addEventListener(
        "error",
        () => {
          if (imageElement.dataset.fallback !== "true") {
            imageElement.dataset.fallback = "true";

            imageElement.src = "./images/COVER_BOOK.png";
          }
        },
        {
          once: true,
        },
      );

      imageElement.addEventListener("dragstart", (event) => {
        event.preventDefault();
      });
    }

    /* =================================================
       DETAIL BUTTON
    ================================================= */

    const detailButton = card.querySelector(".add-cart");

    if (detailButton) {
      detailButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        openProductDetail(book);
      });
    }

    /* =================================================
       CARD CLICK
    ================================================= */

    card.addEventListener("click", (event) => {
      /*
       * Bookmark do
       * bookMarkButton.js xử lý.
       */

      if (event.target.closest("[data-bookmark-id]")) {
        return;
      }

      /*
       * Detail button.
       */

      if (event.target.closest(".add-cart")) {
        return;
      }

      const list = card.closest(".product-list");

      if (list?.dataset.justDragged === "true") {
        return;
      }

      openProductDetail(book);
    });

    return card;
  };

  /* =====================================================
     BOOK CATEGORY
  ===================================================== */

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
            return item.name || item.label || item.title || "";
          }

          return String(item ?? "");
        })
        .join(" ");
    }

    if (value && typeof value === "object") {
      return String(value.name ?? value.label ?? value.title ?? "");
    }

    return String(value).trim();
  };

  /* =====================================================
     CATEGORY BOOKS
  ===================================================== */

  const getCategoryBooks = (categoryNames) => {
    if (!Array.isArray(categoryNames)) {
      return [];
    }

    return books.filter((book) => {
      const category = normalizeText(getBookCategory(book));

      return categoryNames.some((name) => {
        const target = normalizeText(name);

        return category === target || category.includes(target);
      });
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
    let position = 0;
    let dragging = false;
    let startX = 0;
    let startPosition = 0;
    let moved = false;
    let pointerId = null;

    const renderTopBooks = () => {
      booksList.innerHTML = "";

      /*
       * Hiển thị tối đa 12 sách.
       */

      books.slice(0, 12).forEach((book) => {
        const card = createBookCard(book);

        if (card) {
          booksList.appendChild(card);
        }
      });

      position = 0;

      requestAnimationFrame(() => {
        updateSlider();
      });
    };

    const getMaxPosition = () => {
      return Math.max(0, booksList.scrollWidth - booksBox.clientWidth);
    };

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

    const getStep = () => {
      const card = booksList.querySelector(".book-card");

      if (!card) {
        return 200;
      }

      const styles = getComputedStyle(booksList);

      const gap = parseFloat(styles.columnGap) || parseFloat(styles.gap) || 0;

      return card.getBoundingClientRect().width + gap;
    };

    /* PREV */

    booksPrev?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      position -= getStep();

      updateSlider();
    });

    /* NEXT */

    booksNext?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      position += getStep();

      updateSlider();
    });

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

    /* STOP */

    const stopDrag = (event) => {
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

      booksList.classList.remove("dragging");

      if (wasDragged) {
        booksList.dataset.justDragged = "true";

        setTimeout(() => {
          delete booksList.dataset.justDragged;
        }, 250);
      }

      updateSlider();
    };

    booksList.addEventListener("pointerup", stopDrag);

    booksList.addEventListener("pointercancel", stopDrag);

    booksList.style.touchAction = "pan-y";

    window.addEventListener("resize", updateSlider);

    renderTopBooks();
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

    /* =================================================
         CATEGORY - ĐẠI CƯƠNG
      ================================================= */

    if (title.includes("đại cương") || title.includes("general")) {
      categoryBooks = getCategoryBooks(["Đại cương", "General"]);
    } else if (

    /* =================================================
         CATEGORY - CÔNG NGHỆ
      ================================================= */
      title.includes("công nghệ") ||
      title.includes("technology") ||
      title.includes("information technology")
    ) {
      categoryBooks = getCategoryBooks([
        "Kỹ thuật - Công nghệ",
        "Kỹ thuật công nghệ",
        "Công nghệ thông tin",
        "Technology",
      ]);
    }

    /* =================================================
         RENDER
      ================================================= */

    productList.innerHTML = "";

    categoryBooks.forEach((book) => {
      const card = createProductCard(book);

      if (card) {
        productList.appendChild(card);
      }
    });

    /* =================================================
         SLIDER STATE
      ================================================= */

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

    prev?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      position -= getStep();

      update();
    });

    /* NEXT */

    next?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      position += getStep();

      update();
    });

    /* POINTER DOWN */

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

    /* POINTER MOVE */

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

    /* STOP */

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

    window.addEventListener("resize", update);

    requestAnimationFrame(() => {
      update();
    });
  });

  /* =====================================================
     HERO SEARCH
  ===================================================== */

  const heroSearchInput = document.querySelector(".hero-search-input");

  const searchIcon = document.querySelector("#searchIcon");

  const goToCatalog = () => {
    const keyword = heroSearchInput?.value.trim() || "";

    const catalogURL = new URL(
      getPagePath("catalog.html"),
      window.location.href,
    );

    if (keyword) {
      catalogURL.searchParams.set("search", keyword);
    }

    window.location.href = catalogURL.href;
  };

  if (heroSearchInput) {
    heroSearchInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();

      goToCatalog();
    });
  }

  if (searchIcon) {
    searchIcon.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      goToCatalog();
    });
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
     HEADER USER UI
     
     Không khai báo const lần 2.
  ===================================================== */

  const updateUserUI = () => {
    const user = getCurrentUser();

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
     LOGIN
  ===================================================== */

  signInButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    goToLogin();
  });

  /* =====================================================
     LOGOUT
  ===================================================== */

  logoutButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    localStorage.removeItem("currentUser");

    localStorage.removeItem("shoppingCart");

    sessionStorage.removeItem("lastOrder");

    sessionStorage.removeItem("checkoutRedirect");

    const cartSidebar = document.querySelector(".shoppingCartSidebar");

    const cartBackground = document.querySelector(".shoppingCartSidebar-bg");

    cartSidebar?.classList.remove("active");

    cartBackground?.classList.remove("active");

    if (typeof window.renderCart === "function") {
      window.renderCart();
    }

    updateUserUI();

    window.location.reload();
  });

  /* =====================================================
     SYNC LOGIN
  ===================================================== */

  window.addEventListener("storage", (event) => {
    if (event.key === "currentUser") {
      updateUserUI();
    }
  });

  console.log("=================================");

  console.log("IUHSVBOOK SCRIPT READY");

  console.log("BOOK COUNT:", books.length);

  console.log("CURRENT USER:", getCurrentUser());

  console.log("=================================");
});
