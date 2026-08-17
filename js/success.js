document.addEventListener("DOMContentLoaded", () => {
  const signInButton = document.querySelector("#signInButton");
  const createAccountButton = document.querySelector("#createAccountButton");
  const userInfo = document.querySelector("#userInfo");
  const usernameDisplay = document.querySelector("#usernameDisplay");
  const logoutButton = document.querySelector("#logoutButton");
  const cartButton = document.querySelector("#cartButton");
  const continueShopping = document.querySelector("#continueShopping");

  const getCurrentUser = () => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      return null;
    }

    try {
      const user = JSON.parse(currentUser);

      if (!user || typeof user !== "object") {
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
        user.username || user.name || user.email || "";
    }
  };

  const redirectToLogin = () => {
    const currentPage =
      window.location.pathname + window.location.search + window.location.hash;

    const loginURL = new URL("../login.html", window.location.href);

    loginURL.searchParams.set("redirect", currentPage);

    window.location.href = loginURL.href;
  };

  updateUserUI();

  signInButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    redirectToLogin();
  });

  createAccountButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const currentPage =
      window.location.pathname + window.location.search + window.location.hash;

    const createURL = new URL("../create.html", window.location.href);

    createURL.searchParams.set("redirect", currentPage);

    window.location.href = createURL.href;
  });

  logoutButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    localStorage.removeItem("currentUser");
    localStorage.removeItem("shoppingCart");
    localStorage.removeItem("rememberLogin");

    sessionStorage.removeItem("lastOrder");
    sessionStorage.removeItem("checkoutRedirect");
    sessionStorage.removeItem("loginRedirect");

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

  localStorage.removeItem("shoppingCart");

  continueShopping?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    window.location.href = "../index.html";
  });

  cartButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const user = getCurrentUser();

    if (!user) {
      alert("Bạn cần đăng nhập trước khi xem giỏ hàng!");

      redirectToLogin();

      return;
    }

    if (typeof window.openCartSidebar === "function") {
      window.openCartSidebar();
      return;
    }

    const cartSidebar = document.querySelector(".shoppingCartSidebar");

    const cartBackground = document.querySelector(".shoppingCartSidebar-bg");

    if (typeof window.renderCart === "function") {
      window.renderCart();
    }

    cartSidebar?.classList.add("active");
    cartBackground?.classList.add("active");
  });

  window.addEventListener("storage", (event) => {
    if (event.key === "currentUser") {
      updateUserUI();
    }
  });
});
