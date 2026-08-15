/* =====================================================
   IUHSVBOOK - SUCCESS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  console.log("=================================");
  console.log("SUCCESS.JS START");
  console.log("PAGE:", window.location.href);
  console.log("=================================");

  /* =====================================================
     USER ELEMENTS
  ===================================================== */

  const signInButton = document.querySelector("#signInButton");

  const userInfo = document.querySelector("#userInfo");

  const usernameDisplay = document.querySelector("#usernameDisplay");

  const logoutButton = document.querySelector("#logoutButton");

  /* =====================================================
     GET CURRENT USER
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
     UPDATE USER UI
  ===================================================== */

  const updateUserUI = () => {
    const user = getCurrentUser();

    /* ---------------------------------------------
       CHƯA ĐĂNG NHẬP
    ---------------------------------------------- */

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

    /* ---------------------------------------------
       ĐÃ ĐĂNG NHẬP
    ---------------------------------------------- */

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
     LOGIN BUTTON
  ===================================================== */

  if (signInButton) {
    signInButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const currentPage =
        window.location.pathname +
        window.location.search +
        window.location.hash;

      const loginURL = new URL("./login.html", window.location.href);

      loginURL.searchParams.set("redirect", currentPage);

      window.location.href = loginURL.href;
    });
  }

  /* =====================================================
     LOGOUT
  ===================================================== */

  if (logoutButton) {
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      /* Xóa tài khoản */
      localStorage.removeItem("currentUser");

      /* Xóa giỏ hàng */
      localStorage.removeItem("shoppingCart");

      /* Xóa đơn tạm */
      sessionStorage.removeItem("lastOrder");

      /* Xóa redirect */
      sessionStorage.removeItem("checkoutRedirect");

      /* Đóng cart nếu đang mở */
      const cartSidebar = document.querySelector(".shoppingCartSidebar");

      const cartBackground = document.querySelector(".shoppingCartSidebar-bg");

      if (cartSidebar) {
        cartSidebar.classList.remove("active");
      }

      if (cartBackground) {
        cartBackground.classList.remove("active");
      }

      /* Render cart lại */
      if (typeof window.renderCart === "function") {
        window.renderCart();
      }

      updateUserUI();

      window.location.reload();
    });
  }

  /* =====================================================
     LAST ORDER
  ===================================================== */

  const getLastOrder = () => {
    try {
      const order = JSON.parse(sessionStorage.getItem("lastOrder"));

      if (!order || typeof order !== "object") {
        return null;
      }

      return order;
    } catch (error) {
      console.error("Lỗi đọc lastOrder:", error);

      return null;
    }
  };

  const lastOrder = getLastOrder();

  /* =====================================================
     DEBUG ORDER
  ===================================================== */

  if (lastOrder) {
    console.log("LAST ORDER:", lastOrder);
  } else {
    console.warn("Không tìm thấy lastOrder.");
  }

  /* =====================================================
     CLEAR OLD CART
     
     Sau khi đã vào SUCCESS thì
     giỏ hàng phải trống.
  ===================================================== */

  localStorage.removeItem("shoppingCart");

  /* =====================================================
     CONTINUE SHOPPING
  ===================================================== */

  const continueShopping = document.querySelector("#continueShopping");

  if (continueShopping) {
    continueShopping.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      window.location.href = "../index.html";
    });
  }

  /* =====================================================
     HOME
  ===================================================== */

  const homeButton = document.querySelector(
    ".header-icon[href='../index.html']",
  );

  if (homeButton) {
    homeButton.addEventListener("click", (event) => {
      event.preventDefault();

      window.location.href = "../index.html";
    });
  }

  /* =====================================================
     SUCCESS PAGE CART
     
     shoppingCartSidebar.js sẽ tự tạo
     sidebar khi được load trong HTML.
  ===================================================== */

  const cartIcon = document.querySelector("#cartIcon");

  if (cartIcon) {
    console.log("SUCCESS CART ICON FOUND");
  }

  /* =====================================================
     FINAL
  ===================================================== */

  console.log("=================================");

  console.log("SUCCESS.JS READY");

  console.log("CURRENT USER:", getCurrentUser());

  console.log("LAST ORDER:", lastOrder);

  console.log("=================================");
});
