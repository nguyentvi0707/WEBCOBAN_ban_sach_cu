document.addEventListener("DOMContentLoaded", async () => {
  let books = [];

  try {
    const jsonURL = new URL("../data/book.json", window.location.href);

    const response = await fetch(jsonURL.href, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("book.json không phải là một mảng");
    }

    books = data;
  } catch (error) {
    console.error("LỖI LOAD BOOK.JSON:", error);
    return;
  }

  if (books.length === 0) {
    console.error("book.json không có sản phẩm.");
    return;
  }

  const productImage = document.querySelector("#productImage");
  const productName = document.querySelector("#productName");
  const productAuthor = document.querySelector("#productAuthorText");
  const productDescription = document.querySelector("#productDescriptionText");
  const productStatus = document.querySelector("#productStatus");
  const productStock = document.querySelector("#productStock");
  const productPrice = document.querySelector("#productPrice");
  const productQuantity = document.querySelector("#productQuantity");
  const productBookmark = document.querySelector("#productBookmark");
  const minusButton = document.querySelector("#minusProduct");
  const plusButton = document.querySelector("#plusProduct");
  const addToCartButton = document.querySelector("#addToCartButton");
  const buyNowButton = document.querySelector("#buyNowButton");

  const signInButton = document.querySelector("#signInButton");
  const userInfo = document.querySelector("#userInfo");
  const usernameDisplay = document.querySelector("#usernameDisplay");
  const logoutButton = document.querySelector("#logoutButton");
  const createAccountButton = document.querySelector("#createAccountButton");

  const getCurrentUser = () => {
    const rawUser = localStorage.getItem("currentUser");

    if (!rawUser) {
      return null;
    }

    try {
      const user = JSON.parse(rawUser);

      if (!user || typeof user !== "object") {
        localStorage.removeItem("currentUser");
        return null;
      }

      return user;
    } catch (error) {
      localStorage.removeItem("currentUser");
      return null;
    }
  };

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
        user.username || user.name || user.email || "User";
    }
  };

  updateUserUI();

  const goToLogin = () => {
    const currentPage =
      window.location.pathname + window.location.search + window.location.hash;

    const loginURL = new URL("../login.html", window.location.href);

    loginURL.searchParams.set("redirect", currentPage);

    window.location.href = loginURL.href;
  };

  const goToRegister = () => {
    const currentPage =
      window.location.pathname + window.location.search + window.location.hash;

    const registerURL = new URL("../register.html", window.location.href);

    registerURL.searchParams.set("redirect", currentPage);

    window.location.href = registerURL.href;
  };

  if (signInButton) {
    signInButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      goToLogin();
    });
  }

  if (createAccountButton) {
    createAccountButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      goToRegister();
    });
  }

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

  window.addEventListener("storage", (event) => {
    if (event.key === "currentUser") {
      updateUserUI();
    }
  });

  window.addEventListener("pageshow", () => {
    updateUserUI();
  });

  const searchInput = document.querySelector("#searchInput");
  const searchIcon = document.querySelector("#searchIcon");

  const goToCatalogSearch = () => {
    if (!searchInput) {
      return;
    }

    const keyword = searchInput.value.trim();

    const catalogURL = new URL("../catalog.html", window.location.href);

    if (keyword) {
      catalogURL.searchParams.set("search", keyword);
    }

    window.location.href = catalogURL.href;
  };

  if (searchInput) {
    const params = new URLSearchParams(window.location.search);

    searchInput.value = params.get("search") || "";

    searchInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      goToCatalogSearch();
    });
  }

  if (searchIcon) {
    searchIcon.style.cursor = "pointer";

    searchIcon.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      goToCatalogSearch();
    });
  }

  const getProductIdFromURL = () => {
    const params = new URLSearchParams(window.location.search);

    return params.get("id");
  };

  const findProductById = (id) => {
    if (id === null || id === undefined) {
      return null;
    }

    return books.find((book) => String(book.id) === String(id));
  };

  let currentProduct = findProductById(getProductIdFromURL());

  if (!currentProduct) {
    currentProduct = books[0];
  }

  if (!currentProduct) {
    console.error("Không tìm thấy sản phẩm.");
    return;
  }

  let quantity = 1;

  const getStock = (product = currentProduct) => {
    const stock = Number(product?.stock);

    if (!Number.isFinite(stock) || stock < 0) {
      return 0;
    }

    return Math.floor(stock);
  };

  const updateQuantity = () => {
    if (!productQuantity) {
      return;
    }

    productQuantity.textContent = String(quantity).padStart(2, "0");
  };

  const updateStockUI = (product) => {
    const stock = getStock(product);

    if (productStock) {
      productStock.textContent = `Còn ${stock} sản phẩm`;
    }

    if (productStatus) {
      if (stock <= 0) {
        productStatus.textContent = "Hết hàng";
      } else {
        productStatus.textContent = product.status || "Còn hàng";
      }
    }
  };

  const getCart = () => {
    try {
      const rawCart = localStorage.getItem("shoppingCart");

      if (!rawCart) {
        return [];
      }

      const cart = JSON.parse(rawCart);

      return Array.isArray(cart) ? cart : [];
    } catch (error) {
      return [];
    }
  };

  const saveCart = (cart) => {
    localStorage.setItem(
      "shoppingCart",
      JSON.stringify(Array.isArray(cart) ? cart : []),
    );
  };

  const getCartProductQuantity = (productId) => {
    const cart = getCart();

    const existingProduct = cart.find(
      (item) => String(item.id) === String(productId),
    );

    if (!existingProduct) {
      return 0;
    }

    const cartQuantity = Number(existingProduct.quantity || 0);

    return Number.isFinite(cartQuantity) ? cartQuantity : 0;
  };

  const addProductToCart = (product, amount = 1) => {
    if (!product) {
      return false;
    }

    if (!getCurrentUser()) {
      alert("Bạn cần đăng nhập trước khi mua sách!");

      goToLogin();

      return false;
    }

    const stock = getStock(product);

    const buyAmount = Number(amount);

    if (!Number.isFinite(buyAmount) || buyAmount <= 0) {
      return false;
    }

    if (stock <= 0) {
      alert("Sách này đã hết hàng!");
      return false;
    }

    const cart = getCart();

    const existingProduct = cart.find(
      (item) => String(item.id) === String(product.id),
    );

    const currentCartQuantity = existingProduct
      ? Number(existingProduct.quantity || 0)
      : 0;

    const totalQuantity = currentCartQuantity + buyAmount;

    if (totalQuantity > stock) {
      alert(
        `Không đủ số lượng trong kho!\n\nTồn kho: ${stock}\nĐã có trong giỏ: ${currentCartQuantity}\nBạn đang mua thêm: ${buyAmount}`,
      );

      return false;
    }

    if (existingProduct) {
      existingProduct.quantity = totalQuantity;

      existingProduct.stock = stock;
    } else {
      cart.push({
        id: product.id,
        name: product.name || "Không có tên",
        author: product.author || "Chưa có tác giả",
        image: product.image || "../images/COVER_BOOK.png",
        price: Number(product.price || 0),
        quantity: buyAmount,
        stock: stock,
      });
    }

    saveCart(cart);

    if (typeof window.renderCart === "function") {
      window.renderCart();
    }

    return true;
  };

  const openCartSidebar = () => {
    if (!getCurrentUser()) {
      alert("Bạn cần đăng nhập trước khi xem giỏ hàng!");

      goToLogin();

      return;
    }

    const cartSidebar = document.querySelector(".shoppingCartSidebar");

    const cartBackground = document.querySelector(".shoppingCartSidebar-bg");

    if (typeof window.renderCart === "function") {
      window.renderCart();
    }

    if (cartSidebar) {
      cartSidebar.classList.add("active");
    }

    if (cartBackground) {
      cartBackground.classList.add("active");
    }
  };

  const updateURL = (product, usePushState = true) => {
    if (!product) {
      return;
    }

    const url = new URL(window.location.href);

    url.searchParams.set("id", product.id);

    url.searchParams.delete("search");

    const state = {
      productId: product.id,
    };

    if (usePushState) {
      window.history.pushState(state, "", url.href);
    } else {
      window.history.replaceState(state, "", url.href);
    }
  };

  if (
    typeof window.isBookmarked !== "function" ||
    typeof window.toggleBookmark !== "function"
  ) {
    console.error("bookMarkButton.js chưa được load trước productDetail.js");
  }

  const updateProductDetail = (product, shouldScroll = true) => {
    if (!product) {
      return;
    }

    currentProduct = product;

    const stock = getStock(product);

    if (productImage) {
      productImage.src = product.image || "../images/COVER_BOOK.png";

      productImage.alt = product.name || "Book";
    }

    if (productName) {
      productName.textContent = product.name || "Không có tên";
    }

    if (productAuthor) {
      productAuthor.textContent = product.author || "Chưa có tác giả";
    }

    if (productDescription) {
      productDescription.textContent =
        product.description || "Chưa có mô tả cho sản phẩm này.";
    }

    updateStockUI(product);

    if (productPrice) {
      const price = Number(product.price || 0);

      productPrice.textContent = `${price.toLocaleString("vi-VN")}đ`;
    }

    quantity = stock > 0 ? 1 : 0;

    updateQuantity();

    if (minusButton) {
      minusButton.disabled = quantity <= 1;
    }

    if (plusButton) {
      plusButton.disabled = stock <= 0 || quantity >= stock;
    }

    if (addToCartButton) {
      addToCartButton.disabled = stock <= 0;
    }

    if (buyNowButton) {
      buyNowButton.disabled = stock <= 0;
    }

    if (productBookmark) {
      productBookmark.dataset.bookmarkId = String(product.id);

      if (typeof window.isBookmarked === "function") {
        productBookmark.classList.toggle(
          "active",
          window.isBookmarked(product.id),
        );
      }
    }

    if (shouldScroll) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  if (minusButton) {
    minusButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (quantity > 1) {
        quantity--;

        updateQuantity();

        if (plusButton) {
          plusButton.disabled = quantity >= getStock(currentProduct);
        }

        if (minusButton) {
          minusButton.disabled = quantity <= 1;
        }
      }
    });
  }

  if (plusButton) {
    plusButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const stock = getStock(currentProduct);

      if (stock <= 0) {
        alert("Sách này đã hết hàng!");

        return;
      }

      if (quantity >= stock) {
        alert(`Không đủ số lượng trong kho!\n\nTồn kho: ${stock}`);

        plusButton.disabled = true;

        return;
      }

      quantity++;

      updateQuantity();

      plusButton.disabled = quantity >= stock;

      if (minusButton) {
        minusButton.disabled = quantity <= 1;
      }
    });
  }

  if (productBookmark) {
    productBookmark.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!getCurrentUser()) {
        alert("Bạn cần đăng nhập trước khi lưu sách yêu thích!");

        goToLogin();

        return;
      }

      if (typeof window.toggleBookmark !== "function") {
        console.error("Không tìm thấy window.toggleBookmark()");

        return;
      }

      const active = window.toggleBookmark(currentProduct.id);

      productBookmark.classList.toggle("active", active);
    });
  }

  if (addToCartButton) {
    addToCartButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const stock = getStock(currentProduct);

      if (stock <= 0) {
        alert("Sách này đã hết hàng!");

        return;
      }

      if (quantity > stock) {
        alert(`Không đủ số lượng trong kho!\n\nTồn kho: ${stock}`);

        return;
      }

      const added = addProductToCart(currentProduct, quantity);

      if (added) {
        openCartSidebar();
      }
    });
  }

  if (buyNowButton) {
    buyNowButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const stock = getStock(currentProduct);

      if (stock <= 0) {
        alert("Sách này đã hết hàng!");

        return;
      }

      if (quantity > stock) {
        alert(`Không đủ số lượng trong kho!\n\nTồn kho: ${stock}`);

        return;
      }

      const added = addProductToCart(currentProduct, quantity);

      if (added) {
        openCartSidebar();
      }
    });
  }

  const getCategory = (book) => {
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

  const sameCategoryList = document.querySelector("#sameCategoryList");

  const otherCategoryList = document.querySelector("#otherCategoryList");

  const sliderStates = {
    same: null,
    other: null,
  };

  const createBookCard = (book) => {
    const card = document.createElement("article");

    card.className = "bookCard";

    card.dataset.productId = String(book.id);

    const price = Number(book.price || 0);

    const image = book.image || "../images/COVER_BOOK.png";

    const name = book.name || "Không có tên";

    const bookmarked =
      typeof window.isBookmarked === "function"
        ? window.isBookmarked(book.id)
        : false;

    card.innerHTML = `
      <img
        class="bookImage"
        src="${image}"
        alt="${name}"
        draggable="false"
      >

      <p
        class="bookName"
        title="${name}"
      >
        ${name}
      </p>

      <div class="recommendBuying">
        <div class="recommendPrice">
          ${price.toLocaleString("vi-VN")}đ
        </div>

        <button
          class="recommendBookMark ${bookmarked ? "active" : ""}"
          type="button"
          data-bookmark-id="${book.id}"
          aria-label="Bookmark"
        >
          <img
            src="../images/BOOKMARK_SIMPLE.png"
            alt="Bookmark"
            draggable="false"
          >
        </button>
      </div>

      <button
        class="recommendShoppingCart"
        type="button"
        aria-label="Thêm vào giỏ"
      >
        <img
          src="../images/SHOPPING_CART.png"
          alt="Thêm vào giỏ"
          draggable="false"
        >
      </button>
    `;

    const bookmark = card.querySelector(".recommendBookMark");

    if (bookmark) {
      bookmark.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!getCurrentUser()) {
          alert("Bạn cần đăng nhập trước khi lưu sách yêu thích!");

          goToLogin();

          return;
        }

        if (typeof window.toggleBookmark !== "function") {
          console.error("Không tìm thấy window.toggleBookmark()");

          return;
        }

        const active = window.toggleBookmark(book.id);

        bookmark.classList.toggle("active", active);

        if (typeof window.updateBookmarkButtons === "function") {
          window.updateBookmarkButtons();
        }
      });
    }

    const addCart = card.querySelector(".recommendShoppingCart");

    if (addCart) {
      addCart.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!getCurrentUser()) {
          alert("Bạn cần đăng nhập trước khi mua sách!");

          goToLogin();

          return;
        }

        const stock = getStock(book);

        const currentCartQuantity = getCartProductQuantity(book.id);

        if (stock <= 0) {
          alert("Sách này đã hết hàng!");

          return;
        }

        if (currentCartQuantity >= stock) {
          alert(
            `Không đủ số lượng trong kho!\n\nTồn kho: ${stock}\nSố lượng trong giỏ: ${currentCartQuantity}`,
          );

          return;
        }

        const added = addProductToCart(book, 1);

        if (added) {
          openCartSidebar();
        }
      });
    }

    const imageElement = card.querySelector(".bookImage");

    if (imageElement) {
      imageElement.addEventListener("dragstart", (event) => {
        event.preventDefault();
      });
    }

    card.addEventListener("click", (event) => {
      if (event.target.closest(".recommendBookMark")) {
        return;
      }

      if (event.target.closest(".recommendShoppingCart")) {
        return;
      }

      const parentList = card.closest(".recommendList");

      if (parentList && parentList.dataset.justDragged === "true") {
        return;
      }

      if (!getCurrentUser()) {
        alert("Bạn cần đăng nhập trước khi xem sản phẩm!");

        goToLogin();

        return;
      }

      const productId = card.dataset.productId;

      const selectedBook = findProductById(productId);

      if (!selectedBook) {
        return;
      }

      updateURL(selectedBook, true);

      updateProductDetail(selectedBook, true);

      renderRecommendations(selectedBook);
    });

    return card;
  };

  const setupSlider = (type) => {
    const list =
      type === "same"
        ? document.querySelector("#sameCategoryList")
        : document.querySelector("#otherCategoryList");

    const windowElement =
      type === "same"
        ? document.querySelector("#sameCategoryWindow")
        : document.querySelector("#otherCategoryWindow");

    const prevButton =
      type === "same"
        ? document.querySelector("#sameCategoryPrev")
        : document.querySelector("#otherCategoryPrev");

    const nextButton =
      type === "same"
        ? document.querySelector("#sameCategoryNext")
        : document.querySelector("#otherCategoryNext");

    if (!list || !windowElement || !prevButton || !nextButton) {
      return;
    }

    if (
      sliderStates[type] &&
      typeof sliderStates[type].cleanup === "function"
    ) {
      sliderStates[type].cleanup();
    }

    const state = {
      position: 0,
      dragging: false,
      startX: 0,
      startPosition: 0,
      moved: false,
      pointerId: null,
    };

    const getCard = () => list.querySelector(".bookCard");

    const getGap = () => {
      const styles = window.getComputedStyle(list);

      const gap = parseFloat(styles.columnGap) || parseFloat(styles.gap) || 0;

      return Number.isFinite(gap) ? gap : 0;
    };

    const getStep = () => {
      const card = getCard();

      if (!card) {
        return 0;
      }

      return card.getBoundingClientRect().width + getGap();
    };

    const getMaxPosition = () => {
      const cards = list.querySelectorAll(".bookCard");

      if (cards.length === 0) {
        return 0;
      }

      const step = getStep();

      const gap = getGap();

      if (step <= 0) {
        return 0;
      }

      const totalWidth = cards.length * step - gap;

      const visibleWidth = windowElement.getBoundingClientRect().width;

      const contentWidth = Math.max(list.scrollWidth, totalWidth);

      return Math.max(0, contentWidth - visibleWidth);
    };

    const updateButtons = (max) => {
      const atStart = state.position <= 0.5;

      const atEnd = state.position >= max - 0.5;

      prevButton.disabled = atStart;

      nextButton.disabled = atEnd;

      prevButton.classList.toggle("disabled", atStart);

      nextButton.classList.toggle("disabled", atEnd);
    };

    const update = () => {
      const max = getMaxPosition();

      state.position = Math.max(0, Math.min(state.position, max));

      list.style.transform = `translate3d(-${state.position}px, 0, 0)`;

      updateButtons(max);
    };

    state.update = update;

    const nextHandler = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const step = getStep();

      if (step <= 0) {
        return;
      }

      const max = getMaxPosition();

      state.position = Math.min(state.position + step, max);

      update();
    };

    const prevHandler = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const step = getStep();

      if (step <= 0) {
        return;
      }

      state.position = Math.max(state.position - step, 0);

      update();
    };

    nextButton.addEventListener("click", nextHandler);

    prevButton.addEventListener("click", prevHandler);

    const pointerDownHandler = (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      if (event.target.closest("button")) {
        return;
      }

      if (getMaxPosition() <= 0) {
        return;
      }

      state.dragging = true;
      state.moved = false;
      state.startX = event.clientX;
      state.startPosition = state.position;
      state.pointerId = event.pointerId;

      list.classList.add("dragging");
    };

    const pointerMoveHandler = (event) => {
      if (!state.dragging) {
        return;
      }

      if (state.pointerId !== null && event.pointerId !== state.pointerId) {
        return;
      }

      const distance = state.startX - event.clientX;

      if (Math.abs(distance) >= 8) {
        state.moved = true;
      }

      if (!state.moved) {
        return;
      }

      event.preventDefault();

      state.position = state.startPosition + distance;

      update();
    };

    const pointerUpHandler = (event) => {
      if (!state.dragging) {
        return;
      }

      if (state.pointerId !== null && event.pointerId !== state.pointerId) {
        return;
      }

      const wasDragged = state.moved;

      state.dragging = false;
      state.pointerId = null;

      list.classList.remove("dragging");

      if (wasDragged) {
        list.dataset.justDragged = "true";

        setTimeout(() => {
          delete list.dataset.justDragged;
        }, 300);
      }

      state.moved = false;

      update();
    };

    const pointerCancelHandler = () => {
      if (!state.dragging) {
        return;
      }

      state.dragging = false;
      state.moved = false;
      state.pointerId = null;

      list.classList.remove("dragging");

      update();
    };

    list.addEventListener("pointerdown", pointerDownHandler);

    list.addEventListener("pointermove", pointerMoveHandler);

    list.addEventListener("pointerup", pointerUpHandler);

    list.addEventListener("pointercancel", pointerCancelHandler);

    list.style.touchAction = "pan-y";

    let resizeTimer = null;

    const resizeHandler = () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(update, 50);
    };

    window.addEventListener("resize", resizeHandler);

    state.cleanup = () => {
      nextButton.removeEventListener("click", nextHandler);

      prevButton.removeEventListener("click", prevHandler);

      list.removeEventListener("pointerdown", pointerDownHandler);

      list.removeEventListener("pointermove", pointerMoveHandler);

      list.removeEventListener("pointerup", pointerUpHandler);

      list.removeEventListener("pointercancel", pointerCancelHandler);

      window.removeEventListener("resize", resizeHandler);

      clearTimeout(resizeTimer);

      list.style.transform = "translate3d(0, 0, 0)";

      delete list.dataset.justDragged;

      list.classList.remove("dragging");
    };

    sliderStates[type] = state;

    state.position = 0;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        update();
      });
    });
  };

  const renderRecommendations = (product) => {
    if (!product) {
      return;
    }

    if (sliderStates.same && typeof sliderStates.same.cleanup === "function") {
      sliderStates.same.cleanup();
    }

    if (
      sliderStates.other &&
      typeof sliderStates.other.cleanup === "function"
    ) {
      sliderStates.other.cleanup();
    }

    sliderStates.same = null;
    sliderStates.other = null;

    if (sameCategoryList) {
      sameCategoryList.innerHTML = "";

      sameCategoryList.style.transform = "translate3d(0, 0, 0)";
    }

    if (otherCategoryList) {
      otherCategoryList.innerHTML = "";

      otherCategoryList.style.transform = "translate3d(0, 0, 0)";
    }

    const currentCategory = getCategory(product);

    const recommendations = books.filter(
      (book) => String(book.id) !== String(product.id),
    );

    const sameCategory = recommendations.filter(
      (book) => String(getCategory(book)) === String(currentCategory),
    );

    const otherCategory = recommendations.filter(
      (book) => String(getCategory(book)) !== String(currentCategory),
    );

    if (sameCategoryList) {
      if (sameCategory.length > 0) {
        sameCategory.forEach((book) => {
          sameCategoryList.appendChild(createBookCard(book));
        });
      } else {
        sameCategoryList.innerHTML = `
            <p
              style="
                font-family: Syne, sans-serif;
                font-size: 14px;
                padding: 20px;
              "
            >
              Không có sách cùng danh mục.
            </p>
          `;
      }
    }

    if (otherCategoryList) {
      if (otherCategory.length > 0) {
        otherCategory.forEach((book) => {
          otherCategoryList.appendChild(createBookCard(book));
        });
      } else {
        otherCategoryList.innerHTML = `
            <p
              style="
                font-family: Syne, sans-serif;
                font-size: 14px;
                padding: 20px;
              "
            >
              Không có sách khác danh mục.
            </p>
          `;
      }
    }

    if (typeof window.updateBookmarkButtons === "function") {
      window.updateBookmarkButtons();
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setupSlider("same");
        setupSlider("other");
      });
    });
  };

  updateProductDetail(currentProduct, false);

  if (getProductIdFromURL() === null) {
    updateURL(currentProduct, false);
  }

  renderRecommendations(currentProduct);

  const homeIcon = document.querySelector("#homeIcon");

  if (homeIcon) {
    homeIcon.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      window.location.href = "../index.html";
    });
  }

  window.addEventListener("popstate", () => {
    const id = getProductIdFromURL();

    const product = findProductById(id);

    if (!product) {
      return;
    }

    updateProductDetail(product, false);

    renderRecommendations(product);
  });
});
