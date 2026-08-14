/* =====================================================
   SHOPPING CART BUTTON
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
     LẤY ELEMENT
  ===================================================== */

  const cartButton = document.querySelector("#cartIcon");
  const cartSidebar = document.querySelector(".shoppingCartSidebar");
  const cartBackground = document.querySelector(".shoppingCartSidebar-bg");

  /* =====================================================
     KIỂM TRA ELEMENT
  ===================================================== */

  if (!cartButton) {
    console.error("Không tìm thấy #cartIcon");
    return;
  }

  if (!cartSidebar) {
    console.error("Không tìm thấy .shoppingCartSidebar");
    return;
  }

  if (!cartBackground) {
    console.error("Không tìm thấy .shoppingCartSidebar-bg");
    return;
  }

  /* =====================================================
     NÚT ĐÓNG SIDEBAR
  ===================================================== */

  const closeButton = cartSidebar.querySelector("#backArrow");

  /* =====================================================
     MỞ GIỎ HÀNG
  ===================================================== */

  cartButton.addEventListener("click", () => {
    cartSidebar.classList.add("active");
    cartBackground.classList.add("active");

    // Không cho trang phía sau scroll
    document.body.style.overflow = "hidden";
  });

  /* =====================================================
     ĐÓNG GIỎ HÀNG
  ===================================================== */

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      cartSidebar.classList.remove("active");
      cartBackground.classList.remove("active");

      document.body.style.overflow = "";
    });
  }

  /* =====================================================
     CLICK RA NGOÀI SIDEBAR ĐỂ ĐÓNG
  ===================================================== */

  cartBackground.addEventListener("click", () => {
    cartSidebar.classList.remove("active");
    cartBackground.classList.remove("active");

    document.body.style.overflow = "";
  });

  /* =====================================================
     ESC ĐỂ ĐÓNG
  ===================================================== */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      cartSidebar.classList.remove("active");
      cartBackground.classList.remove("active");

      document.body.style.overflow = "";
    }
  });
});
