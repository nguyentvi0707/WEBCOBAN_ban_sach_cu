document.addEventListener("DOMContentLoaded", async () => {
  "use strict";

  let books = [];

  const signInButton = document.querySelector("#signInButton");
  const createAccountButton = document.querySelector("#createAccountButton");
  const userInfo = document.querySelector("#userInfo");
  const usernameDisplay = document.querySelector("#usernameDisplay");
  const logoutButton = document.querySelector("#logoutButton");

  const homeIcon =
    document.querySelector("#homeIcon") ||
    document.querySelector(".home") ||
    document.querySelector('a[aria-label="Home"]');

  const productIcon =
    document.querySelector("#productIcon") ||
    document.querySelector(".product") ||
    document.querySelector('a[aria-label="Products"]');

  const bookmarkIcon =
    document.querySelector("#bookmarkIcon") ||
    document.querySelector(".bookmark") ||
    document.querySelector('a[aria-label="Bookmark"]');

  const cartIcon =
    document.querySelector("#cartIcon") ||
    document.querySelector(".cart") ||
    document.querySelector('a[aria-label="Cart"]');

  const loadBookJSON = async () => {
    const paths = ["./data/book.json", "../data/book.json", "/data/book.json"];
    const triedURLs = [];

    for (const path of paths) {
      try {
        const url = new URL(path, window.location.href);
        triedURLs.push(url.href);

        const response = await fetch(url.href, {
          cache: "no-store",
        });

        if (!response.ok) {
          continue;
        }

        const text = await response.text();

        let data;

        try {
          data = JSON.parse(text);
        } catch (error) {
          continue;
        }

        if (!Array.isArray(data)) {
          continue;
        }

        return data;
      } catch (error) {
        console.warn("LOAD JSON ERROR:", error);
      }
    }

    throw new Error("Không tải được book.json.\n" + triedURLs.join("\n"));
  };

  try {
    books = await loadBookJSON();
  } catch (error) {
    console.error("Không tải được book.json:", error);
    books = [];
  }

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
      localStorage.removeItem("currentUser");
      return null;
    }
  };

  const getPagePath = (fileName) => {
    return `./pages/${fileName}`;
  };

  const goToLogin = () => {
    const currentPage =
      window.location.pathname + window.location.search + window.location.hash;

    const loginURL = new URL(getPagePath("login.html"), window.location.href);

    loginURL.searchParams.set("redirect", currentPage);

    window.location.href = loginURL.href;
  };

  const requireLogin = () => {
    if (getCurrentUser()) {
      return true;
    }

    alert("Bạn cần đăng nhập trước khi thực hiện thao tác này!");
    goToLogin();

    return false;
  };

  const normalizeText = (value) => {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  };

  const getBookId = (book) => {
    if (!book) {
      return "";
    }

    const values = [
      book.id,
      book.bookId,
      book.bookID,
      book.book_id,
      book.productId,
      book.productID,
      book.product_id,
    ];

    for (const value of values) {
      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        return String(value).trim();
      }
    }

    return "";
  };

  const findBookById = (id) => {
    if (id === undefined || id === null || String(id).trim() === "") {
      return null;
    }

    const targetId = String(id).trim();

    return books.find((book) => getBookId(book) === targetId) || null;
  };

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
            return item.name ?? item.label ?? item.title ?? item.category ?? "";
          }

          return String(item ?? "");
        })
        .join(" ");
    }

    if (value && typeof value === "object") {
      return String(
        value.name ?? value.label ?? value.title ?? value.category ?? "",
      ).trim();
    }

    return String(value).trim();
  };

  const getImageCandidates = (book) => {
    if (!book) {
      return ["./images/COVER_BOOK.png"];
    }

    const values = [
      book.image,
      book.imageUrl,
      book.imageURL,
      book.image_url,
      book.thumbnail,
      book.thumbnailUrl,
      book.thumbnailURL,
      book.thumbnail_url,
      book.cover,
      book.coverImage,
      book.coverUrl,
      book.coverURL,
    ];

    const candidates = [];

    const addValue = (value) => {
      if (value === undefined || value === null) {
        return;
      }

      const text = String(value).trim();

      if (text) {
        candidates.push(text);
      }
    };

    values.forEach((value) => {
      if (Array.isArray(value)) {
        value.forEach(addValue);
      } else {
        addValue(value);
      }
    });

    candidates.push("./images/COVER_BOOK.png");

    return [...new Set(candidates)];
  };

  const resolveImageURL = (value) => {
    const image = String(value ?? "").trim();

    if (!image) {
      return "./images/COVER_BOOK.png";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:") ||
      image.startsWith("blob:")
    ) {
      return image;
    }

    try {
      return new URL(image, window.location.href).href;
    } catch (error) {
      return `./images/${encodeURI(image)}`;
    }
  };

  const setupImage = (imageElement, book) => {
    if (!imageElement) {
      return;
    }

    const candidates = getImageCandidates(book).map(resolveImageURL);

    let index = 0;

    const loadNext = () => {
      if (index >= candidates.length) {
        imageElement.src = "./images/COVER_BOOK.png";
        return;
      }

      imageElement.src = candidates[index];

      index += 1;
    };

    imageElement.addEventListener("error", loadNext);

    imageElement.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });

    loadNext();
  };

  const openProductDetail = (book) => {
    if (!book) {
      return;
    }

    const id = getBookId(book);

    if (!id) {
      console.error("BOOK KHÔNG CÓ ID:", book);
      return;
    }

    if (!requireLogin()) {
      return;
    }

    const detailURL = new URL(
      getPagePath("productDetail.html"),
      window.location.href,
    );

    detailURL.searchParams.set("id", id);

    window.location.href = detailURL.href;
  };

  const createBookCard = (book) => {
    const id = getBookId(book);

    if (!id) {
      return null;
    }

    const card = document.createElement("article");

    card.className = "book-card";
    card.dataset.productId = id;

    const name = String(book?.name || "Không có tên");

    card.innerHTML = `
      <img
        src="./images/COVER_BOOK.png"
        alt="${name}"
        draggable="false"
      />

      <p title="${name}">
        ${name}
      </p>
    `;

    const imageElement = card.querySelector("img");

    setupImage(imageElement, book);

    return card;
  };

  const createProductCard = (book) => {
    const id = getBookId(book);

    if (!id) {
      return null;
    }

    const card = document.createElement("article");

    card.className = "product-card";

    card.dataset.productId = id;

    const name = String(book?.name || "Không có tên");

    const price = Number(book?.price || 0).toLocaleString("vi-VN");

    const bookmarked =
      typeof window.isBookmarked === "function"
        ? window.isBookmarked(id)
        : false;

    card.innerHTML = `
      <div class="product-image">
        <img
          src="./images/COVER_BOOK.png"
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

    const imageElement = card.querySelector(".product-image img");

    setupImage(imageElement, book);

    return card;
  };

  const getCategoryBooks = (categoryNames) => {
    if (!Array.isArray(categoryNames)) {
      return [];
    }

    return books.filter((book) => {
      const category = normalizeText(getBookCategory(book));

      if (!category) {
        return false;
      }

      return categoryNames.some((name) => {
        const target = normalizeText(name);

        if (!target) {
          return false;
        }

        return (
          category === target ||
          category.includes(target) ||
          target.includes(category)
        );
      });
    });
  };

  const setupSlider = ({ viewport, list, prev, next, fallbackStep = 200 }) => {
    if (!viewport || !list) {
      return null;
    }

    let position = 0;
    let dragging = false;
    let moved = false;
    let pointerId = null;
    let startX = 0;
    let startPosition = 0;
    let clickTarget = null;
    let resizeObserver = null;

    const getVisibleWidth = () => {
      const styles = window.getComputedStyle(viewport);

      const paddingLeft = parseFloat(styles.paddingLeft) || 0;

      const paddingRight = parseFloat(styles.paddingRight) || 0;

      const borderLeft = parseFloat(styles.borderLeftWidth) || 0;

      const borderRight = parseFloat(styles.borderRightWidth) || 0;

      const width = viewport.getBoundingClientRect().width;

      return Math.max(
        0,
        width - paddingLeft - paddingRight - borderLeft - borderRight,
      );
    };

    const getContentWidth = () => {
      return Math.max(list.scrollWidth, list.getBoundingClientRect().width);
    };

    const getMaxPosition = () => {
      const visibleWidth = getVisibleWidth();

      const contentWidth = getContentWidth();

      return Math.max(0, contentWidth - visibleWidth);
    };

    const clampPosition = (value) => {
      const max = getMaxPosition();

      const numeric = Number(value);

      if (!Number.isFinite(numeric)) {
        return 0;
      }

      return Math.max(0, Math.min(numeric, max));
    };

    const updateButtons = () => {
      const max = getMaxPosition();

      if (prev) {
        const disabled = position <= 0.5;

        prev.disabled = disabled;

        prev.classList.toggle("disabled", disabled);
      }

      if (next) {
        const disabled = position >= max - 0.5;

        next.disabled = disabled;

        next.classList.toggle("disabled", disabled);
      }
    };

    const render = () => {
      position = clampPosition(position);

      list.style.transform = `translate3d(${-position}px, 0, 0)`;

      updateButtons();
    };

    const getStep = () => {
      const card = list.querySelector(".book-card, .product-card");

      if (!card) {
        return fallbackStep;
      }

      const styles = window.getComputedStyle(list);

      const gap = parseFloat(styles.columnGap) || parseFloat(styles.gap) || 0;

      const cardWidth = card.getBoundingClientRect().width;

      const step = cardWidth + gap;

      return step > 0 ? step : fallbackStep;
    };

    const nextHandler = (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (dragging) {
        return;
      }

      const max = getMaxPosition();

      position = Math.min(position + getStep(), max);

      render();
    };

    const prevHandler = (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (dragging) {
        return;
      }

      position = Math.max(position - getStep(), 0);

      render();
    };

    prev?.addEventListener("click", prevHandler);

    next?.addEventListener("click", nextHandler);

    const openCard = (target) => {
      if (!target) {
        return;
      }

      if (list.dataset.justDragged === "true") {
        return;
      }

      if (target.closest("button")) {
        return;
      }

      const card = target.closest(".book-card, .product-card");

      if (!card) {
        return;
      }

      const productId = card.dataset.productId;

      if (!productId) {
        return;
      }

      const book = findBookById(productId);

      if (!book) {
        return;
      }

      openProductDetail(book);
    };

    const pointerDownHandler = (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      if (event.target.closest("button") || event.target.closest("a")) {
        return;
      }

      const card = event.target.closest(".book-card, .product-card");

      if (!card) {
        return;
      }

      clickTarget = event.target;

      if (getMaxPosition() <= 0) {
        return;
      }

      dragging = true;
      moved = false;
      pointerId = event.pointerId;
      startX = event.clientX;
      startPosition = position;

      list.classList.add("dragging");

      list.style.transition = "none";

      list.style.cursor = "grabbing";

      try {
        list.setPointerCapture(event.pointerId);
      } catch (error) {}

      event.preventDefault();
    };

    const pointerMoveHandler = (event) => {
      if (!dragging) {
        return;
      }

      if (pointerId !== null && event.pointerId !== pointerId) {
        return;
      }

      const distance = startX - event.clientX;

      if (Math.abs(distance) >= 5) {
        moved = true;
      }

      if (!moved) {
        return;
      }

      position = clampPosition(startPosition + distance);

      list.style.transform = `translate3d(${-position}px, 0, 0)`;

      event.preventDefault();
    };

    const finishDrag = (event) => {
      if (!dragging) {
        return;
      }

      if (
        pointerId !== null &&
        event &&
        event.pointerId !== undefined &&
        event.pointerId !== pointerId
      ) {
        return;
      }

      const wasMoved = moved;

      const target = clickTarget;

      dragging = false;
      moved = false;
      pointerId = null;
      clickTarget = null;

      list.classList.remove("dragging");

      list.style.cursor = "grab";

      list.style.transition = "transform 0.35s ease";

      try {
        if (event && event.pointerId !== undefined) {
          list.releasePointerCapture(event.pointerId);
        }
      } catch (error) {}

      if (wasMoved) {
        list.dataset.justDragged = "true";

        setTimeout(() => {
          delete list.dataset.justDragged;
        }, 350);
      } else {
        openCard(target);
      }

      render();
    };

    const pointerUpHandler = (event) => {
      finishDrag(event);
    };

    const pointerCancelHandler = (event) => {
      if (!dragging) {
        clickTarget = null;
        return;
      }

      dragging = false;
      moved = false;
      pointerId = null;
      clickTarget = null;

      list.classList.remove("dragging");

      list.style.cursor = "grab";

      list.style.transition = "transform 0.35s ease";

      render();
    };

    const lostPointerCaptureHandler = (event) => {
      if (dragging) {
        finishDrag(event);
      }
    };

    const clickHandler = (event) => {
      if (list.dataset.justDragged === "true") {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      openCard(event.target);
    };

    list.addEventListener("pointerdown", pointerDownHandler);

    list.addEventListener("pointermove", pointerMoveHandler, {
      passive: false,
    });

    list.addEventListener("pointerup", pointerUpHandler);

    list.addEventListener("pointercancel", pointerCancelHandler);

    list.addEventListener("lostpointercapture", lostPointerCaptureHandler);

    list.addEventListener("click", clickHandler);

    list.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });

    list.style.touchAction = "pan-y";

    list.style.userSelect = "none";

    list.style.webkitUserSelect = "none";

    list.style.cursor = "grab";

    const resizeHandler = () => {
      position = clampPosition(position);

      requestAnimationFrame(() => {
        render();
      });
    };

    window.addEventListener("resize", resizeHandler);

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => {
        position = clampPosition(position);

        render();
      });

      resizeObserver.observe(viewport);

      resizeObserver.observe(list);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        render();
      });
    });

    return {
      update: render,

      cleanup: () => {
        prev?.removeEventListener("click", prevHandler);

        next?.removeEventListener("click", nextHandler);

        list.removeEventListener("pointerdown", pointerDownHandler);

        list.removeEventListener("pointermove", pointerMoveHandler);

        list.removeEventListener("pointerup", pointerUpHandler);

        list.removeEventListener("pointercancel", pointerCancelHandler);

        list.removeEventListener(
          "lostpointercapture",
          lostPointerCaptureHandler,
        );

        list.removeEventListener("click", clickHandler);

        window.removeEventListener("resize", resizeHandler);

        if (resizeObserver) {
          resizeObserver.disconnect();
          resizeObserver = null;
        }

        dragging = false;
        moved = false;
        pointerId = null;
        clickTarget = null;
        position = 0;

        list.classList.remove("dragging");

        list.style.transition = "transform 0.35s ease";

        list.style.transform = "translate3d(0, 0, 0)";

        list.style.cursor = "grab";

        delete list.dataset.justDragged;
      },
    };
  };

  const booksBox = document.querySelector(".books-box");

  const booksList = document.querySelector(".books-list");

  const booksPrev = document.querySelector(".books-prev");

  const booksNext = document.querySelector(".books-next");

  if (booksBox && booksList) {
    booksList.innerHTML = "";

    books.forEach((book) => {
      const card = createBookCard(book);

      if (card) {
        booksList.appendChild(card);
      }
    });

    setupSlider({
      viewport: booksBox,
      list: booksList,
      prev: booksPrev,
      next: booksNext,
      fallbackStep: 200,
    });
  }

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

    if (title.includes("đại cương") || title.includes("general")) {
      categoryBooks = getCategoryBooks([
        "Đại cương",
        "Sách đại cương",
        "General",
      ]);
    } else if (
      title.includes("công nghệ") ||
      title.includes("technology") ||
      title.includes("information technology") ||
      title.includes("kỹ thuật") ||
      title.includes("cntt")
    ) {
      categoryBooks = getCategoryBooks([
        "Kỹ thuật - Công nghệ",
        "Kỹ thuật công nghệ",
        "Sách kỹ thuật - công nghệ",
        "Công nghệ thông tin",
        "Sách công nghệ thông tin",
        "Technology",
        "Technologies",
        "Information Technology",
        "Information Technologies",
        "CNTT",
      ]);
    } else {
      categoryBooks = books.slice();
    }

    productList.innerHTML = "";

    categoryBooks.forEach((book) => {
      const card = createProductCard(book);

      if (card) {
        productList.appendChild(card);
      }
    });

    setupSlider({
      viewport: productWindow,
      list: productList,
      prev,
      next,
      fallbackStep: 180,
    });
  });

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

  heroSearchInput?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    goToCatalog();
  });

  searchIcon?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    goToCatalog();
  });

  const exploreButton = document.querySelector(".explore-btn");

  exploreButton?.addEventListener("click", (event) => {
    event.preventDefault();

    goToCatalog();
  });

  const updateUserUI = () => {
    const user = getCurrentUser();

    if (!user) {
      if (signInButton) {
        signInButton.style.display = "flex";
      }

      if (createAccountButton) {
        createAccountButton.style.display = "flex";
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

    if (createAccountButton) {
      createAccountButton.style.display = "none";
    }

    if (userInfo) {
      userInfo.style.display = "flex";
    }

    if (usernameDisplay) {
      usernameDisplay.textContent =
        user.username || user.name || user.email || "";
    }
  };

  signInButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    goToLogin();
  });

  createAccountButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const currentPage =
      window.location.pathname + window.location.search + window.location.hash;

    const createURL = new URL(getPagePath("create.html"), window.location.href);

    createURL.searchParams.set("redirect", currentPage);

    window.location.href = createURL.href;
  });

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

  homeIcon?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    window.location.href = "./index.html";
  });

  productIcon?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    window.location.href = getPagePath("catalog.html");
  });

  bookmarkIcon?.addEventListener("click", (event) => {
    if (!getCurrentUser()) {
      event.preventDefault();
      event.stopPropagation();

      goToLogin();
    }
  });

  cartIcon?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!getCurrentUser()) {
      alert("Bạn cần đăng nhập trước khi xem giỏ hàng!");

      goToLogin();

      return;
    }

    if (typeof window.openCartSidebar === "function") {
      window.openCartSidebar();

      return;
    }

    const sidebar = document.querySelector(".shoppingCartSidebar");

    const background = document.querySelector(".shoppingCartSidebar-bg");

    if (typeof window.renderCart === "function") {
      window.renderCart();
    }

    sidebar?.classList.add("active");

    background?.classList.add("active");
  });

  window.addEventListener("bookmarkchange", () => {
    if (typeof window.updateBookmarkButtons === "function") {
      window.updateBookmarkButtons();
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key === "currentUser") {
      updateUserUI();
    }

    if (event.key === "bookmarks") {
      if (typeof window.updateBookmarkButtons === "function") {
        window.updateBookmarkButtons();
      }
    }
  });

  updateUserUI();

  if (typeof window.updateBookmarkButtons === "function") {
    window.updateBookmarkButtons();
  }
});
