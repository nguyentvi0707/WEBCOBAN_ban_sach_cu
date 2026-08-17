document.addEventListener("DOMContentLoaded", async () => {
  const isInPagesFolder = window.location.pathname.includes("/pages/");

  const getImagePath = (fileName) => {
    return isInPagesFolder ? `../images/${fileName}` : `./images/${fileName}`;
  };

  const getPagePath = (pageName) => {
    return isInPagesFolder ? `./${pageName}` : `./pages/${pageName}`;
  };

  let books = [];

  try {
    const response = await fetch(
      isInPagesFolder ? "../data/book.json" : "./data/book.json",
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("book.json không phải là một mảng");
    }

    books = data;
  } catch (error) {
    console.error("Lỗi load book.json:", error);

    books = [];
  }

  const getStock = (productId) => {
    const product = books.find((book) => String(book.id) === String(productId));

    if (!product) {
      return 0;
    }

    const stock = Number(product.stock ?? 0);

    return Number.isFinite(stock) ? Math.max(0, Math.floor(stock)) : 0;
  };

  const cartBackground = document.createElement("div");

  const cartSidebar = document.createElement("div");

  cartBackground.className = "shoppingCartSidebar-bg";

  cartSidebar.className = "shoppingCartSidebar";

  cartSidebar.innerHTML = `
    <div class="cartHeader">
      <button
        type="button"
        class="cartCloseButton"
        id="cartCloseButton"
        aria-label="Đóng giỏ hàng"
      >
        <img
          src="${getImagePath("CARET_LEFT.png")}"
          alt="Đóng"
        />
      </button>

      <div class="cartBack">
        <div>
          <span>Your Cart</span>
          <span class="cartCount">
            (0 items)
          </span>
        </div>
      </div>
    </div>

    <div class="cartItems"></div>

    <div class="cartBottom">
      <div class="cartTotal">
        <p>Tổng:</p>
        <div class="cartTotalPrice">
          0đ
        </div>
      </div>

      <button
        class="checkoutButton"
        type="button"
      >
        Đặt hàng
      </button>
    </div>
  `;

  document.body.appendChild(cartBackground);

  document.body.appendChild(cartSidebar);

  const cartButton =
    document.querySelector("#cartIcon") || document.querySelector(".cart");

  const closeButton = cartSidebar.querySelector("#cartCloseButton");

  const cartItems = cartSidebar.querySelector(".cartItems");

  const cartCount = cartSidebar.querySelector(".cartCount");

  const totalPrice = cartSidebar.querySelector(".cartTotalPrice");

  const checkoutButton = cartSidebar.querySelector(".checkoutButton");

  const getCurrentUser = () => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      return null;
    }

    try {
      return JSON.parse(currentUser);
    } catch (error) {
      localStorage.removeItem("currentUser");

      return null;
    }
  };

  const getCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("shoppingCart"));

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

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN") + "đ";
  };

  const renderEmptyCart = () => {
    cartItems.innerHTML = `
      <p class="emptyCart">
        Giỏ hàng đang trống
      </p>
    `;

    cartCount.textContent = "(0 items)";

    totalPrice.textContent = "0đ";
  };

  const openCart = () => {
    if (!getCurrentUser()) {
      alert("Bạn cần đăng nhập trước khi xem giỏ hàng!");

      const currentPage =
        window.location.pathname +
        window.location.search +
        window.location.hash;

      const loginURL = new URL(getPagePath("login.html"), window.location.href);

      loginURL.searchParams.set("redirect", currentPage);

      window.location.href = loginURL.href;

      return;
    }

    renderCart();

    cartSidebar.classList.add("active");

    cartBackground.classList.add("active");
  };

  const closeCart = () => {
    cartSidebar.classList.remove("active");

    cartBackground.classList.remove("active");
  };

  const normalizeCartStock = (cart) => {
    let changed = false;

    const normalizedCart = cart
      .map((item) => {
        const stock = getStock(item.id);

        let quantity = Math.max(1, Number(item.quantity || 1));

        if (stock <= 0) {
          changed = true;

          return null;
        }

        if (quantity > stock) {
          quantity = stock;
          changed = true;
        }

        if (Number(item.quantity) !== quantity) {
          changed = true;
        }

        return {
          ...item,
          quantity,
        };
      })
      .filter(Boolean);

    if (changed) {
      saveCart(normalizedCart);
    }

    return normalizedCart;
  };

  const renderCart = () => {
    if (!getCurrentUser()) {
      renderEmptyCart();
      return;
    }

    let cart = getCart();

    cart = normalizeCartStock(cart);

    cartItems.innerHTML = "";

    if (cart.length === 0) {
      renderEmptyCart();
      return;
    }

    let total = 0;
    let totalQuantity = 0;

    cart.forEach((item) => {
      const stock = getStock(item.id);

      const quantity = Math.max(1, Number(item.quantity || 1));

      const price = Number(item.price || 0);

      total += price * quantity;

      totalQuantity += quantity;

      item.quantity = quantity;

      const cartItem = document.createElement("div");

      cartItem.className = "cartItem";

      cartItem.innerHTML = `
        <img
          class="cartItemImage"
          src="${item.image || getImagePath("COVER_BOOK.png")}"
          alt="${item.name || "Book"}"
        >

        <div class="cartItemInfo">

          <div class="cartData">

            <p class="cartItemTitle">
              ${item.name || "Không có tên"}
            </p>

            <p class="cartItemAuthor">
              ${item.author || "Chưa có tác giả"}
            </p>

            <p class="cartItemStock">
              Stock: ${stock}
            </p>

          </div>

          <div class="cartItemQuantity">

            <button
              type="button"
              class="cartQuantityButton cartMinusButton"
              aria-label="Giảm số lượng"
            >
              <img
                class="cartMinus"
                src="${getImagePath("MINUS_CIRCLE.png")}"
                alt="Giảm"
              >
            </button>

            <div class="cartQuantity">
              ${String(quantity).padStart(2, "0")}
            </div>

            <button
              type="button"
              class="cartQuantityButton cartPlusButton"
              aria-label="Tăng số lượng"
            >
              <img
                class="cartPlus"
                src="${getImagePath("PLUS_CIRCLE.png")}"
                alt="Tăng"
              >
            </button>

          </div>

        </div>

        <div class="cartItemRight">

          <p class="cartItemPrice">
            ${formatPrice(price * quantity)}
          </p>

          <button
            type="button"
            class="cartDeleteButton"
            aria-label="Xóa sản phẩm"
          >
            <img
              class="cartDelete"
              src="${getImagePath("TRASH.png")}"
              alt="Xóa"
            >
          </button>

        </div>
      `;

      const plus = cartItem.querySelector(".cartPlusButton");

      if (plus) {
        plus.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();

          if (!getCurrentUser()) {
            renderEmptyCart();
            closeCart();
            return;
          }

          const currentStock = getStock(item.id);

          if (currentStock <= 0) {
            alert("Sản phẩm đã hết hàng!");

            return;
          }

          if (quantity >= currentStock) {
            alert("Không đủ số lượng trong kho!");

            return;
          }

          item.quantity = quantity + 1;

          saveCart(cart);

          renderCart();
        });
      }

      const minus = cartItem.querySelector(".cartMinusButton");

      if (minus) {
        minus.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();

          if (!getCurrentUser()) {
            renderEmptyCart();
            closeCart();
            return;
          }

          if (quantity <= 1) {
            return;
          }

          item.quantity = quantity - 1;

          saveCart(cart);

          renderCart();
        });
      }

      const deleteButton = cartItem.querySelector(".cartDeleteButton");

      if (deleteButton) {
        deleteButton.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();

          if (!getCurrentUser()) {
            renderEmptyCart();
            closeCart();
            return;
          }

          const newCart = cart.filter(
            (cartItemData) => String(cartItemData.id) !== String(item.id),
          );

          saveCart(newCart);

          renderCart();
        });
      }

      cartItems.appendChild(cartItem);
    });

    saveCart(cart);

    cartCount.textContent = `(${totalQuantity} items)`;

    totalPrice.textContent = formatPrice(total);
  };

  if (cartButton) {
    cartButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      openCart();
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      closeCart();
    });
  }

  cartBackground.addEventListener("click", () => {
    closeCart();
  });

  if (checkoutButton) {
    checkoutButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const currentUser = getCurrentUser();

      if (!currentUser) {
        alert("Bạn cần đăng nhập trước khi đặt hàng!");

        const currentPage =
          window.location.pathname +
          window.location.search +
          window.location.hash;

        const loginURL = new URL(
          getPagePath("login.html"),
          window.location.href,
        );

        loginURL.searchParams.set("redirect", currentPage);

        closeCart();

        window.location.href = loginURL.href;

        return;
      }

      let cart = getCart();

      if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");

        return;
      }

      const invalidItem = cart.find((item) => {
        const stock = getStock(item.id);

        const quantity = Number(item.quantity || 1);

        return stock <= 0 || quantity > stock;
      });

      if (invalidItem) {
        const stock = getStock(invalidItem.id);

        if (stock <= 0) {
          alert(`${invalidItem.name || "Sản phẩm"} đã hết hàng!`);
        } else {
          alert(
            `Không đủ số lượng trong kho! ${invalidItem.name || "Sản phẩm"} chỉ còn ${stock} cuốn.`,
          );
        }

        renderCart();

        return;
      }

      cart = normalizeCartStock(cart);

      if (cart.length === 0) {
        alert("Sản phẩm trong giỏ hàng đã hết hàng!");

        renderCart();

        return;
      }

      const total = cart.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 1),
        0,
      );

      const order = {
        userId:
          currentUser.id || currentUser.username || currentUser.email || null,

        username:
          currentUser.username || currentUser.name || currentUser.email || "",

        items: cart.map((item) => ({
          id: item.id,

          name: item.name,

          author: item.author,

          image: item.image,

          price: Number(item.price || 0),

          quantity: Number(item.quantity || 1),

          stock: getStock(item.id),
        })),

        total,

        createdAt: new Date().toISOString(),
      };

      sessionStorage.setItem("lastOrder", JSON.stringify(order));

      localStorage.removeItem("shoppingCart");

      renderCart();

      closeCart();

      window.location.href = getPagePath("success.html");
    });
  }

  window.renderCart = renderCart;

  window.openCartSidebar = openCart;

  window.closeCartSidebar = closeCart;

  renderCart();
});
