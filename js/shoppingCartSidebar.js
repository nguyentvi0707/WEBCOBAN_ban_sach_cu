/* =====================================================
   IUHSVBOOK - SHOPPING CART SIDEBAR
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* =================================================
     PATH HELPER
  ================================================= */

  const isInPagesFolder = window.location.pathname.includes("/pages/");

  const getImagePath = (fileName) => {
    return isInPagesFolder ? `../images/${fileName}` : `./images/${fileName}`;
  };

  const getPagePath = (pageName) => {
    return isInPagesFolder ? `./${pageName}` : `./pages/${pageName}`;
  };

  /* =================================================
     CREATE ELEMENT
  ================================================= */

  const cartBackground = document.createElement("div");

  const cartSidebar = document.createElement("div");

  cartBackground.className = "shoppingCartSidebar-bg";

  cartSidebar.className = "shoppingCartSidebar";

  /* =================================================
     SIDEBAR HTML
  ================================================= */

  cartSidebar.innerHTML = `
    <div class="cartHeader">

      <div class="cartBack">

        <img
          src="${getImagePath("CARET_LEFT.png")}"
          id="backArrow"
          alt="Back"
        >

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

  /* =================================================
     DOM
  ================================================= */

  const cartButton =
    document.querySelector("#cartIcon") || document.querySelector(".cart");

  const closeButton = cartSidebar.querySelector("#backArrow");

  const cartItems = cartSidebar.querySelector(".cartItems");

  const cartCount = cartSidebar.querySelector(".cartCount");

  const totalPrice = cartSidebar.querySelector(".cartTotalPrice");

  const checkoutButton = cartSidebar.querySelector(".checkoutButton");

  /* =================================================
     GET CURRENT USER
  ================================================= */

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

  /* =================================================
     GET CART
  ================================================= */

  const getCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("shoppingCart"));

      return Array.isArray(cart) ? cart : [];
    } catch (error) {
      console.error("Lỗi đọc shoppingCart:", error);

      return [];
    }
  };

  /* =================================================
     SAVE CART
  ================================================= */

  const saveCart = (cart) => {
    localStorage.setItem(
      "shoppingCart",
      JSON.stringify(Array.isArray(cart) ? cart : []),
    );
  };

  /* =================================================
     FORMAT PRICE
  ================================================= */

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN") + "đ";
  };

  /* =================================================
     EMPTY CART UI
  ================================================= */

  const renderEmptyCart = () => {
    cartItems.innerHTML = `
      <p class="emptyCart">
        Giỏ hàng đang trống
      </p>
    `;

    cartCount.textContent = "(0 items)";

    totalPrice.textContent = "0đ";
  };

  /* =================================================
     OPEN SIDEBAR
  ================================================= */

  const openCart = () => {
    /*
     * Chưa đăng nhập
     */
    if (!getCurrentUser()) {
      alert("Bạn cần đăng nhập trước khi xem giỏ hàng!");

      /*
       * Lưu đúng trang hiện tại
       */
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

  /* =================================================
     CLOSE SIDEBAR
  ================================================= */

  const closeCart = () => {
    cartSidebar.classList.remove("active");

    cartBackground.classList.remove("active");
  };

  /* =================================================
     RENDER CART
  ================================================= */

  const renderCart = () => {
    /*
     * Nếu không đăng nhập:
     * luôn coi giỏ là rỗng.
     */
    if (!getCurrentUser()) {
      renderEmptyCart();
      return;
    }

    const cart = getCart();

    cartItems.innerHTML = "";

    /* =================================================
       EMPTY
    ================================================= */

    if (cart.length === 0) {
      renderEmptyCart();
      return;
    }

    /* =================================================
       TOTAL
    ================================================= */

    let total = 0;

    let totalQuantity = 0;

    /* =================================================
       CREATE ITEMS
    ================================================= */

    cart.forEach((item) => {
      const quantity = Math.max(1, Number(item.quantity || 1));

      const price = Number(item.price || 0);

      total += price * quantity;

      totalQuantity += quantity;

      /*
       * Đồng bộ quantity
       */
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

          </div>

          <div class="cartItemQuantity">

            <img
              class="cartMinus"
              src="${getImagePath("MINUS_CIRCLE.png")}"
              alt="Giảm"
            >

            <div class="cartQuantity">
              ${String(quantity).padStart(2, "0")}
            </div>

            <img
              class="cartPlus"
              src="${getImagePath("PLUS_CIRCLE.png")}"
              alt="Tăng"
            >

          </div>

        </div>

        <div class="cartItemRight">

          <p class="cartItemPrice">
            ${formatPrice(price * quantity)}
          </p>

          <img
            class="cartDelete"
            src="${getImagePath("TRASH.png")}"
            alt="Xóa"
          >

        </div>
      `;

      /* =================================================
         PLUS
      ================================================= */

      const plus = cartItem.querySelector(".cartPlus");

      if (plus) {
        plus.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();

          /*
           * Nếu vừa logout
           */
          if (!getCurrentUser()) {
            renderEmptyCart();
            closeCart();
            return;
          }

          item.quantity = quantity + 1;

          saveCart(cart);

          renderCart();
        });
      }

      /* =================================================
         MINUS
      ================================================= */

      const minus = cartItem.querySelector(".cartMinus");

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

      /* =================================================
         DELETE
      ================================================= */

      const deleteButton = cartItem.querySelector(".cartDelete");

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

    /* =================================================
       SAVE NORMALIZED CART
    ================================================= */

    saveCart(cart);

    /* =================================================
       UPDATE TOTAL
    ================================================= */

    cartCount.textContent = `(${totalQuantity} items)`;

    totalPrice.textContent = formatPrice(total);
  };

  /* =================================================
     OPEN CART BUTTON
  ================================================= */

  if (cartButton) {
    cartButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      openCart();
    });
  }

  /* =================================================
     CLOSE CART BUTTON
  ================================================= */

  if (closeButton) {
    closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      closeCart();
    });
  }

  /* =================================================
     CLICK OUTSIDE
  ================================================= */

  cartBackground.addEventListener("click", () => {
    closeCart();
  });

  /* =================================================
     CHECKOUT / ĐẶT HÀNG
  ================================================= */

  if (checkoutButton) {
    checkoutButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      /* ---------------------------------------------
           KIỂM TRA LOGIN
        --------------------------------------------- */

      const currentUser = getCurrentUser();

      if (!currentUser) {
        alert("Bạn cần đăng nhập trước khi đặt hàng!");

        /*
         * Lưu đúng trang hiện tại
         */
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

      /* ---------------------------------------------
           LẤY GIỎ HÀNG
        --------------------------------------------- */

      const cart = getCart();

      if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");

        return;
      }

      /* ---------------------------------------------
           TÍNH TỔNG
        --------------------------------------------- */

      const total = cart.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 1),
        0,
      );

      /* ---------------------------------------------
           TẠO ORDER
        --------------------------------------------- */

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
        })),

        total: total,

        createdAt: new Date().toISOString(),
      };

      /* ---------------------------------------------
           LƯU ORDER
        --------------------------------------------- */

      sessionStorage.setItem("lastOrder", JSON.stringify(order));

      /* ---------------------------------------------
           XÓA CART
        --------------------------------------------- */

      localStorage.removeItem("shoppingCart");

      /* ---------------------------------------------
           RENDER CART LẠI
        --------------------------------------------- */

      renderCart();

      /* ---------------------------------------------
           ĐÓNG SIDEBAR
        --------------------------------------------- */

      closeCart();

      /* ---------------------------------------------
           SUCCESS
        --------------------------------------------- */

      window.location.href = getPagePath("success.html");
    });
  }

  /* =================================================
     GLOBAL RENDER
  ================================================= */

  window.renderCart = renderCart;

  /* =================================================
     GLOBAL OPEN
  ================================================= */

  window.openCartSidebar = openCart;

  /* =================================================
     GLOBAL CLOSE
  ================================================= */

  window.closeCartSidebar = closeCart;

  /* =================================================
     INITIAL RENDER
  ================================================= */

  renderCart();

  /* =================================================
     DEBUG
  ================================================= */

  console.log("SHOPPING CART SIDEBAR READY");

  console.log("CURRENT USER:", getCurrentUser());

  console.log("CURRENT CART:", getCart());
});
