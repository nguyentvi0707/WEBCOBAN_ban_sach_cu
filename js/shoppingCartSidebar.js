/* =====================================================
   IUHSVBOOK - SHOPPING CART SIDEBAR
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
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
            src="../images/CARET_LEFT.png"
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


      <div class="cartItems">
      </div>


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

  /* =================================================
       GET CART
    ================================================= */

  const getCart = () => {
    try {
      return JSON.parse(localStorage.getItem("shoppingCart")) || [];
    } catch {
      return [];
    }
  };

  /* =================================================
       SAVE CART
    ================================================= */

  const saveCart = (cart) => {
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
  };

  /* =================================================
       FORMAT PRICE
    ================================================= */

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN") + "đ";
  };

  /* =================================================
       RENDER CART
    ================================================= */

  const renderCart = () => {
    const cart = getCart();

    cartItems.innerHTML = "";

    /* =================================================
         EMPTY
      ================================================= */

    if (cart.length === 0) {
      cartItems.innerHTML = `

          <p class="emptyCart">
            Giỏ hàng đang trống
          </p>

        `;

      cartCount.textContent = "(0 items)";

      totalPrice.textContent = "0đ";

      return;
    }

    /* =================================================
         CREATE ITEMS
      ================================================= */

    let total = 0;

    let totalQuantity = 0;

    cart.forEach((item) => {
      const quantity = Math.max(1, Number(item.quantity || 1));

      const price = Number(item.price || 0);

      total += price * quantity;

      totalQuantity += quantity;

      const cartItem = document.createElement("div");

      cartItem.className = "cartItem";

      cartItem.innerHTML = `

            <img
              class="cartItemImage"
              src="${item.image || "../images/COVER_BOOK.png"}"
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
                  src="../images/MINUS_CIRCLE.png"
                  alt="Giảm"
                >


                <div class="cartQuantity">
                  ${String(quantity).padStart(2, "0")}
                </div>


                <img
                  class="cartPlus"
                  src="../images/PLUS_CIRCLE.png"
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
                src="../images/TRASH.png"
                alt="Xóa"
              >

            </div>

          `;

      /* =================================================
             PLUS
          ================================================= */

      const plus = cartItem.querySelector(".cartPlus");

      plus.addEventListener("click", () => {
        item.quantity = quantity + 1;

        saveCart(cart);

        renderCart();
      });

      /* =================================================
             MINUS
          ================================================= */

      const minus = cartItem.querySelector(".cartMinus");

      minus.addEventListener("click", () => {
        if (quantity <= 1) {
          return;
        }

        item.quantity = quantity - 1;

        saveCart(cart);

        renderCart();
      });

      /* =================================================
             DELETE
          ================================================= */

      const deleteButton = cartItem.querySelector(".cartDelete");

      deleteButton.addEventListener("click", () => {
        const newCart = cart.filter(
          (cartItem) => String(cartItem.id) !== String(item.id),
        );

        saveCart(newCart);

        renderCart();
      });

      cartItems.appendChild(cartItem);
    });

    /* =================================================
         UPDATE TOTAL
      ================================================= */

    cartCount.textContent = `(${totalQuantity} items)`;

    totalPrice.textContent = formatPrice(total);
  };

  /* =================================================
       OPEN CART
    ================================================= */

if (cartButton) {
  cartButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    renderCart();

    cartSidebar.classList.add("active");
    cartBackground.classList.add("active");
  });
}

  /* =================================================
       CLOSE CART
    ================================================= */

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      cartSidebar.classList.remove("active");

      cartBackground.classList.remove("active");
    });
  }

  /* =================================================
       CLICK OUTSIDE
    ================================================= */

  cartBackground.addEventListener("click", () => {
    cartSidebar.classList.remove("active");

    cartBackground.classList.remove("active");
  });

  /* =================================================
       GLOBAL RENDER
       
       productDetail.js gọi hàm này
    ================================================= */

  window.renderCart = renderCart;

  /* =================================================
       LOAD CART
    ================================================= */

  renderCart();
});
