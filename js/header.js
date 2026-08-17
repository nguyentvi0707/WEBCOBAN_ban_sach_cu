document.addEventListener("DOMContentLoaded", function () {
  const signInButton = document.getElementById("signInButton");
  const userInfo = document.getElementById("userInfo");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const logoutButton = document.getElementById("logoutButton");
  const cartCount = document.getElementById("cartCount");

  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch (error) {
      return null;
    }
  }

  function updateUserHeader() {
    const currentUser = getCurrentUser();

    if (currentUser) {
      if (signInButton) {
        signInButton.style.display = "none";
      }

      if (userInfo) {
        userInfo.style.display = "flex";
      }

      if (usernameDisplay) {
        usernameDisplay.textContent =
          currentUser.fullName ||
          currentUser.name ||
          currentUser.username ||
          "Người dùng";
      }
    } else {
      if (signInButton) {
        signInButton.style.display = "flex";
      }

      if (userInfo) {
        userInfo.style.display = "none";
      }

      if (usernameDisplay) {
        usernameDisplay.textContent = "";
      }
    }
  }

  function updateCartCount() {
    if (!cartCount) {
      return;
    }

    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");

      if (!Array.isArray(cart)) {
        cartCount.textContent = "0";
        return;
      }

      const totalQuantity = cart.reduce(function (total, item) {
        const quantity = Number(item.quantity) || 0;
        return total + quantity;
      }, 0);

      cartCount.textContent = totalQuantity > 99 ? "99+" : totalQuantity;
    } catch (error) {
      cartCount.textContent = "0";
    }
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      localStorage.removeItem("currentUser");
      updateUserHeader();
      window.location.href = "./index.html";
    });
  }

  updateUserHeader();
  updateCartCount();

  window.addEventListener("storage", function () {
    updateUserHeader();
    updateCartCount();
  });

  window.addEventListener("cartUpdated", function () {
    updateCartCount();
  });
});
