document.addEventListener("DOMContentLoaded", () => {
  const cartButton = document.querySelector("#cartIcon");
  const cartSidebar = document.querySelector(".shoppingCartSidebar");
  const cartBackground = document.querySelector(".shoppingCartSidebar-bg");
  const closeButton = cartSidebar?.querySelector("#backArrow");

  if (!cartSidebar) {
    console.error("Không tìm thấy .shoppingCartSidebar");
    return;
  }

  if (!cartBackground) {
    console.error("Không tìm thấy .shoppingCartSidebar-bg");
    return;
  }

  const getCart = () => {
    try {
      const raw = localStorage.getItem("shoppingCart");

      if (!raw) {
        return [];
      }

      const cart = JSON.parse(raw);

      if (Array.isArray(cart)) {
        return cart;
      }

      if (cart && typeof cart === "object") {
        return Object.values(cart);
      }

      return [];
    } catch (error) {
      console.error("Lỗi đọc shoppingCart:", error);
      return [];
    }
  };

  const saveCart = (cart) => {
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
  };

  const getCartContainer = () => {
    return (
      cartSidebar.querySelector(".cart-list") ||
      cartSidebar.querySelector(".shopping-cart-list") ||
      cartSidebar.querySelector(".cart-items") ||
      cartSidebar.querySelector(".cart-content") ||
      cartSidebar.querySelector(".shoppingCartSidebar-content") ||
      cartSidebar
    );
  };

  const getId = (item) => {
    return String(
      item?.id ??
        item?.bookId ??
        item?.bookID ??
        item?.book_id ??
        item?.productId ??
        item?.productID ??
        item?.product_id ??
        "",
    );
  };

  const getName = (item) => {
    return String(
      item?.name ??
        item?.title ??
        item?.bookName ??
        item?.productName ??
        "Không có tên",
    );
  };

  const getPrice = (item) => {
    const price = Number(
      item?.price ?? item?.unitPrice ?? item?.sellingPrice ?? item?.amount ?? 0,
    );

    return Number.isFinite(price) ? price : 0;
  };

  const getQuantity = (item) => {
    const quantity = Number(item?.quantity ?? item?.qty ?? item?.count ?? 1);

    return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
  };

  const getImage = (item) => {
    const image =
      item?.image ??
      item?.imageUrl ??
      item?.imageURL ??
      item?.image_url ??
      item?.thumbnail ??
      item?.thumbnailUrl ??
      item?.thumbnailURL ??
      item?.cover ??
      item?.coverImage ??
      item?.coverUrl ??
      "./images/COVER_BOOK.png";

    if (
      String(image).startsWith("http://") ||
      String(image).startsWith("https://") ||
      String(image).startsWith("data:") ||
      String(image).startsWith("blob:")
    ) {
      return image;
    }

    return image || "./images/COVER_BOOK.png";
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN") + "đ";
  };

  const findCartIndex = (cart, id) => {
    return cart.findIndex((item) => getId(item) === String(id));
  };

  const renderCart = () => {
    const cart = getCart();

    const container = getCartContainer();

    if (!container) {
      return;
    }

    const oldItems = container.querySelectorAll(
      ".cart-item, .shopping-cart-item, .cart-product",
    );

    oldItems.forEach((item) => item.remove());

    const emptyElement = container.querySelector(".cart-empty");

    if (emptyElement) {
      emptyElement.remove();
    }

    if (cart.length === 0) {
      const empty = document.createElement("div");

      empty.className = "cart-empty";

      empty.innerHTML = `
        <p>Giỏ hàng đang trống</p>
      `;

      container.appendChild(empty);

      updateTotal([]);

      return;
    }

    cart.forEach((item, index) => {
      const id = getId(item);
      const name = getName(item);
      const price = getPrice(item);
      const quantity = getQuantity(item);
      const image = getImage(item);

      const itemElement = document.createElement("div");

      itemElement.className = "cart-item";

      itemElement.dataset.id = id;
      itemElement.dataset.index = String(index);

      itemElement.innerHTML = `
        <div class="cart-item-image">
          <img
            src="${image}"
            alt="${name}"
            draggable="false"
          >
        </div>

        <div class="cart-item-info">
          <div class="cart-item-name" title="${name}">
            ${name}
          </div>

          <div class="cart-item-price">
            ${formatPrice(price)}
          </div>

          <div class="cart-item-bottom">
            <div class="cart-quantity">
              <button
                type="button"
                class="cart-minus"
                data-id="${id}"
              >
                -
              </button>

              <span class="cart-quantity-value">
                ${quantity}
              </span>

              <button
                type="button"
                class="cart-plus"
                data-id="${id}"
              >
                +
              </button>
            </div>

            <button
              type="button"
              class="cart-remove"
              data-id="${id}"
            >
              Xóa
            </button>
          </div>
        </div>
      `;

      const imageElement = itemElement.querySelector("img");

      imageElement?.addEventListener("error", () => {
        if (imageElement.src.includes("COVER_BOOK.png")) {
          return;
        }

        imageElement.src = "./images/COVER_BOOK.png";
      });

      container.appendChild(itemElement);
    });

    updateTotal(cart);
  };

  const updateTotal = (cart) => {
    const total = cart.reduce((sum, item) => {
      return sum + getPrice(item) * getQuantity(item);
    }, 0);

    const totalElements = cartSidebar.querySelectorAll(
      ".cart-total-price, .shopping-cart-total, .total-price, #cartTotal",
    );

    totalElements.forEach((element) => {
      element.textContent = formatPrice(total);
    });

    const count = cart.reduce((sum, item) => {
      return sum + getQuantity(item);
    }, 0);

    const countElements = document.querySelectorAll(".cart-count, #cartCount");

    countElements.forEach((element) => {
      element.textContent = String(count);
    });
  };

  const changeQuantity = (id, amount) => {
    const cart = getCart();

    const index = findCartIndex(cart, id);

    if (index === -1) {
      return;
    }

    const currentQuantity = getQuantity(cart[index]);

    const newQuantity = currentQuantity + amount;

    if (newQuantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = newQuantity;
    }

    saveCart(cart);

    renderCart();

    window.dispatchEvent(
      new CustomEvent("cartchange", {
        detail: cart,
      }),
    );
  };

  const removeItem = (id) => {
    const cart = getCart();

    const index = findCartIndex(cart, id);

    if (index === -1) {
      return;
    }

    cart.splice(index, 1);

    saveCart(cart);

    renderCart();

    window.dispatchEvent(
      new CustomEvent("cartchange", {
        detail: cart,
      }),
    );
  };

  cartSidebar.addEventListener("click", (event) => {
    const plusButton = event.target.closest(".cart-plus");

    if (plusButton) {
      event.preventDefault();
      event.stopPropagation();

      changeQuantity(plusButton.dataset.id, 1);

      return;
    }

    const minusButton = event.target.closest(".cart-minus");

    if (minusButton) {
      event.preventDefault();
      event.stopPropagation();

      changeQuantity(minusButton.dataset.id, -1);

      return;
    }

    const removeButton = event.target.closest(".cart-remove");

    if (removeButton) {
      event.preventDefault();
      event.stopPropagation();

      removeItem(removeButton.dataset.id);
    }
  });

  const openCart = () => {
    renderCart();

    cartSidebar.classList.add("active");
    cartBackground.classList.add("active");

    document.body.style.overflow = "hidden";
  };

  const closeCart = () => {
    cartSidebar.classList.remove("active");
    cartBackground.classList.remove("active");

    document.body.style.overflow = "";
  };

  cartButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    openCart();
  });

  closeButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    closeCart();
  });

  cartBackground.addEventListener("click", () => {
    closeCart();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCart();
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key === "shoppingCart") {
      renderCart();
    }
  });

  window.addEventListener("cartchange", () => {
    renderCart();
  });

  window.renderCart = renderCart;
  window.openCartSidebar = openCart;
  window.closeCartSidebar = closeCart;

  renderCart();
});
