/* =====================================================
   IUHSVBOOK - LOGIN
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
     LẤY ELEMENT
  ===================================================== */

  const form = document.querySelector("#loginForm");

  const createButton = document.querySelector("#createAccount");

  const homeButton = document.querySelector("#homeButton");

  const usernameInput = document.querySelector("#username");

  const passwordInput = document.querySelector("#password");

  const rememberMe = document.querySelector("#rememberMe");

  const passwordToggle = document.querySelector(".password-toggle");

  /* =====================================================
     KIỂM TRA ELEMENT
  ===================================================== */

  if (!form || !usernameInput || !passwordInput) {
    console.error("Không tìm thấy form login hoặc input!");

    return;
  }

  /* =====================================================
     LẤY REDIRECT
  ===================================================== */

  const params = new URLSearchParams(window.location.search);

  const redirectURL = params.get("redirect") || "";

  console.log("LOGIN REDIRECT:", redirectURL);

  /* =====================================================
     LƯU REDIRECT
     
     Phòng trường hợp người dùng chuyển
     sang Create Account rồi quay lại Login.
  ===================================================== */

  if (redirectURL) {
    sessionStorage.setItem("loginRedirect", redirectURL);
  }

  /* =====================================================
     LẤY REDIRECT CUỐI CÙNG
  ===================================================== */

  const getRedirectURL = () => {
    const urlRedirect = new URLSearchParams(window.location.search).get(
      "redirect",
    );

    if (urlRedirect) {
      return urlRedirect;
    }

    const savedRedirect = sessionStorage.getItem("loginRedirect");

    return savedRedirect || "";
  };

  /* =====================================================
     QUAY LẠI TRANG TRƯỚC
  ===================================================== */

  const goBackAfterLogin = () => {
    const redirect = getRedirectURL();

    console.log("FINAL REDIRECT:", redirect);

    /*
     * Có redirect
     */
    if (redirect) {
      try {
        const targetURL = new URL(redirect, window.location.origin);

        /*
         * Chỉ cho phép trang nội bộ
         */
        if (targetURL.origin === window.location.origin) {
          /*
           * Xóa redirect đã lưu
           */
          sessionStorage.removeItem("loginRedirect");

          window.location.href = targetURL.href;

          return;
        }
      } catch (error) {
        console.error("REDIRECT KHÔNG HỢP LỆ:", error);
      }
    }

    /*
     * Không có redirect
     */
    sessionStorage.removeItem("loginRedirect");

    window.location.href = "../index.html";
  };

  /* =====================================================
     HOME
  ===================================================== */

  if (homeButton) {
    homeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      sessionStorage.removeItem("loginRedirect");

      window.location.href = "../index.html";
    });
  }

  /* =====================================================
     CREATE ACCOUNT
  ===================================================== */

  if (createButton) {
    createButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const redirect = getRedirectURL();

      /*
       * login.html và create.html
       * đều nằm trong /pages
       */
      const createURL = new URL("./create.html", window.location.href);

      if (redirect) {
        createURL.searchParams.set("redirect", redirect);
      }

      console.log("GO CREATE:", createURL.href);

      window.location.href = createURL.href;
    });
  }

  /* =====================================================
     SHOW / HIDE PASSWORD
  ===================================================== */

  if (passwordToggle) {
    passwordToggle.addEventListener("click", () => {
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
  }

  /* =====================================================
     LOGIN
  ===================================================== */

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    /* =================================================
         LẤY DỮ LIỆU
      ================================================= */

    const username = usernameInput.value.trim();

    const password = passwordInput.value;

    /* =================================================
         KIỂM TRA RỖNG
      ================================================= */

    if (username === "" || password === "") {
      alert("Vui lòng nhập đầy đủ thông tin!");

      return;
    }

    /* =================================================
         KIỂM TRA getUsers()
      ================================================= */

    if (typeof getUsers !== "function") {
      console.error("Không tìm thấy hàm getUsers()!");

      alert("Không thể lấy dữ liệu tài khoản!");

      return;
    }

    /* =================================================
         LẤY USERS
      ================================================= */

    const users = getUsers();

    if (!Array.isArray(users)) {
      console.error("Dữ liệu users không hợp lệ!");

      alert("Dữ liệu tài khoản không hợp lệ!");

      return;
    }

    /* =================================================
         TÌM USER
      ================================================= */

    const user = users.find((item) => {
      const savedUsername = String(item.username || "").trim();

      const savedPassword = String(item.password || "");

      return (
        savedUsername.toLowerCase() === username.toLowerCase() &&
        savedPassword === password
      );
    });

    /* =================================================
         SAI TÀI KHOẢN
      ================================================= */

    if (!user) {
      alert("Tài khoản hoặc mật khẩu chưa chính xác!");

      return;
    }

    /* =================================================
         ĐĂNG NHẬP THÀNH CÔNG
      ================================================= */

    localStorage.setItem("currentUser", JSON.stringify(user));

    /* =================================================
         REMEMBER ME
      ================================================= */

    if (rememberMe) {
      localStorage.setItem("rememberMe", rememberMe.checked ? "true" : "false");
    }

    console.log("ĐĂNG NHẬP THÀNH CÔNG:", user);

    console.log("QUAY LẠI:", getRedirectURL() || "../index.html");

    alert("Đăng nhập thành công!");

    /* =================================================
         QUAY LẠI ĐÚNG TRANG
      ================================================= */

    goBackAfterLogin();
  });
});
