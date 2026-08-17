document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");
  const createButton = document.querySelector("#createAccount");
  const homeButton = document.querySelector(".home-link");

  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");
  const rememberMe = document.querySelector("#rememberMe");

  const passwordToggle = document.querySelector(".password-toggle");

  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");
  const loginMessage = document.querySelector("#loginMessage");

  if (!form || !emailInput || !passwordInput) {
    console.error("Không tìm thấy form login hoặc input!");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const redirectURL = params.get("redirect") || "";

  if (redirectURL) {
    sessionStorage.setItem("loginRedirect", redirectURL);
  }

  const getRedirectURL = () => {
    const currentRedirect = new URLSearchParams(window.location.search).get(
      "redirect",
    );

    if (currentRedirect) {
      return currentRedirect;
    }

    return sessionStorage.getItem("loginRedirect") || "";
  };

  const showMessage = (message, type = "") => {
    if (!loginMessage) {
      return;
    }

    loginMessage.textContent = message;
    loginMessage.className = "login-message";

    if (type) {
      loginMessage.classList.add(type);
    }
  };

  const clearMessage = () => {
    if (emailError) {
      emailError.textContent = "";
    }

    if (passwordError) {
      passwordError.textContent = "";
    }

    showMessage("");
  };

  const isValidEmail = (email) => {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
  };

  const goBackAfterLogin = () => {
    const redirect = getRedirectURL();

    if (redirect) {
      try {
        const targetURL = new URL(redirect, window.location.origin);

        if (targetURL.origin === window.location.origin) {
          sessionStorage.removeItem("loginRedirect");
          window.location.href = targetURL.href;
          return;
        }
      } catch (error) {
        console.error("REDIRECT KHÔNG HỢP LỆ:", error);
      }
    }

    sessionStorage.removeItem("loginRedirect");
    window.location.href = "../index.html";
  };

  homeButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    sessionStorage.removeItem("loginRedirect");

    window.location.href = "../index.html";
  });

  createButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const redirect = getRedirectURL();

    const createURL = new URL("./create.html", window.location.href);

    if (redirect) {
      createURL.searchParams.set("redirect", redirect);
    }

    window.location.href = createURL.href;
  });

  passwordToggle?.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    passwordToggle.setAttribute(
      "aria-label",
      isPassword ? "Hide password" : "Show password",
    );

    const icon = passwordToggle.querySelector("img");

    if (icon) {
      icon.alt = isPassword ? "Hide Password" : "Show Password";
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    clearMessage();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!email) {
      if (emailError) {
        emailError.textContent = "Vui lòng nhập email.";
      }

      emailInput.focus();
      return;
    }

    if (!isValidEmail(email)) {
      if (emailError) {
        emailError.textContent = "Vui lòng nhập đúng định dạng email.";
      }

      emailInput.focus();
      return;
    }

    if (!password) {
      if (passwordError) {
        passwordError.textContent = "Vui lòng nhập mật khẩu.";
      }

      passwordInput.focus();
      return;
    }

    if (typeof getUsers !== "function") {
      console.error("Không tìm thấy getUsers(). Hãy kiểm tra localStore.js.");

      showMessage("Không thể lấy dữ liệu tài khoản.", "error");

      return;
    }

    let users;

    try {
      users = getUsers();
    } catch (error) {
      console.error("LỖI GET USERS:", error);

      showMessage("Không thể đọc dữ liệu tài khoản.", "error");

      return;
    }

    if (!Array.isArray(users)) {
      showMessage("Dữ liệu tài khoản không hợp lệ.", "error");

      return;
    }

    const user = users.find((item) => {
      const savedEmail = String(item?.email || "")
        .trim()
        .toLowerCase();

      const savedPassword = String(item?.password || "");

      return savedEmail === email && savedPassword === password;
    });

    if (!user) {
      showMessage("Email hoặc mật khẩu chưa chính xác.", "error");

      passwordInput.focus();
      return;
    }

    const currentUser = {
      username: String(user.username || user.name || "").trim(),

      email: String(user.email || "").trim(),
    };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    if (rememberMe?.checked) {
      localStorage.setItem(
        "rememberLogin",
        JSON.stringify({
          email: currentUser.email,
        }),
      );
    } else {
      localStorage.removeItem("rememberLogin");
    }

    showMessage("Đăng nhập thành công!", "success");

    setTimeout(() => {
      goBackAfterLogin();
    }, 500);
  });

  const savedLogin = localStorage.getItem("rememberLogin");

  if (savedLogin) {
    try {
      const data = JSON.parse(savedLogin);

      if (data?.email) {
        emailInput.value = data.email;

        if (rememberMe) {
          rememberMe.checked = true;
        }
      }
    } catch (error) {
      localStorage.removeItem("rememberLogin");
    }
  }
});
