/* =====================================================
   IUHSVBOOK - CREATE ACCOUNT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
     ELEMENT
  ===================================================== */

  const form = document.querySelector("#createForm");

  const loginButton = document.querySelector("#Login");

  const usernameInput = document.querySelector("#username");

  const passwordInput = document.querySelector("#password");

  const confirmPasswordInput = document.querySelector("#confirmPassword");

  const togglePassword = document.querySelector("#togglePassword");

  const toggleConfirmPassword = document.querySelector(
    "#toggleConfirmPassword",
  );

  /* =====================================================
     CHECK ELEMENT
  ===================================================== */

  if (!form || !usernameInput || !passwordInput || !confirmPasswordInput) {
    console.error("Không tìm thấy form hoặc input!");

    return;
  }

  /* =====================================================
     GET REDIRECT
  ===================================================== */

  const params = new URLSearchParams(window.location.search);

  const redirectURL = params.get("redirect") || "";

  console.log("CREATE REDIRECT:", redirectURL);

  /* =====================================================
     GO TO LOGIN
  ===================================================== */

  const goToLogin = () => {
    const loginURL = new URL("./login.html", window.location.href);

    /*
     * Giữ redirect khi chuyển sang login
     */
    if (redirectURL) {
      loginURL.searchParams.set("redirect", redirectURL);
    }

    console.log("CHUYỂN SANG LOGIN:", loginURL.href);

    window.location.href = loginURL.href;
  };

  /* =====================================================
     CREATE ACCOUNT
  ===================================================== */

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    /* ===============================================
         LẤY DỮ LIỆU
      ================================================ */

    const username = usernameInput.value.trim();

    const password = passwordInput.value.trim();

    const confirmPassword = confirmPasswordInput.value.trim();

    /* ===============================================
         KIỂM TRA RỖNG
      ================================================ */

    if (username === "" || password === "" || confirmPassword === "") {
      alert("Vui lòng nhập đầy đủ thông tin!");

      return;
    }

    /* ===============================================
         KIỂM TRA USERNAME
      ================================================ */

    if (username.length < 3) {
      alert("Username phải có ít nhất 3 ký tự!");

      return;
    }

    /* ===============================================
         KIỂM TRA PASSWORD
      ================================================ */

    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");

      return;
    }

    /* ===============================================
         KIỂM TRA PASSWORD CONFIRM
      ================================================ */

    if (password !== confirmPassword) {
      alert("Mật khẩu nhập lại không khớp!");

      return;
    }

    /* ===============================================
         LẤY USERS
      ================================================ */

    let users = [];

    if (typeof getUsers === "function") {
      users = getUsers();
    } else {
      console.error("Không tìm thấy hàm getUsers()!");

      alert("Không thể lấy dữ liệu tài khoản!");

      return;
    }

    /* ===============================================
         KIỂM TRA USERS
      ================================================ */

    if (!Array.isArray(users)) {
      console.error("Dữ liệu users không hợp lệ!");

      alert("Dữ liệu tài khoản không hợp lệ!");

      return;
    }

    /* ===============================================
         USERNAME ĐÃ TỒN TẠI?
      ================================================ */

    const existingUser = users.find((user) => {
      const savedUsername = String(user.username || "")
        .trim()
        .toLowerCase();

      return savedUsername === username.toLowerCase();
    });

    if (existingUser) {
      alert("Username đã tồn tại!");

      return;
    }

    /* ===============================================
         TẠO USER
      ================================================ */

    const newUser = {
      username: username,

      password: password,
    };

    users.push(newUser);

    /* ===============================================
         SAVE USERS
      ================================================ */

    if (typeof saveUsers === "function") {
      saveUsers(users);
    } else {
      console.error("Không tìm thấy hàm saveUsers()!");

      alert("Không thể lưu tài khoản!");

      return;
    }

    /* ===============================================
         THÔNG BÁO
      ================================================ */

    alert("Tạo tài khoản thành công! Vui lòng đăng nhập.");

    /* ===============================================
         CHUYỂN LOGIN
      ================================================ */

    goToLogin();
  });

  /* =====================================================
     LOGIN BUTTON
  ===================================================== */

  if (loginButton) {
    loginButton.addEventListener("click", (event) => {
      event.preventDefault();

      goToLogin();
    });
  }

  /* =====================================================
     SHOW / HIDE PASSWORD
  ===================================================== */

  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";

      passwordInput.type = isPassword ? "text" : "password";

      togglePassword.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password",
      );

      /*
       * Nếu togglePassword là img
       */
      if (togglePassword.tagName === "IMG") {
        togglePassword.alt = isPassword ? "Hide Password" : "Show Password";
      }

      /*
       * Nếu bên trong có img
       */
      const icon = togglePassword.querySelector("img");

      if (icon) {
        icon.alt = isPassword ? "Hide Password" : "Show Password";
      }
    });
  }

  /* =====================================================
     SHOW / HIDE CONFIRM PASSWORD
  ===================================================== */

  if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener("click", () => {
      const isPassword = confirmPasswordInput.type === "password";

      confirmPasswordInput.type = isPassword ? "text" : "password";

      toggleConfirmPassword.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password",
      );

      /*
       * Nếu toggleConfirmPassword là img
       */
      if (toggleConfirmPassword.tagName === "IMG") {
        toggleConfirmPassword.alt = isPassword
          ? "Hide Password"
          : "Show Password";
      }

      /*
       * Nếu bên trong có img
       */
      const icon = toggleConfirmPassword.querySelector("img");

      if (icon) {
        icon.alt = isPassword ? "Hide Password" : "Show Password";
      }
    });
  }

  /* =====================================================
     DEBUG
  ===================================================== */

  console.log("=================================");

  console.log("CREATE.JS READY");

  console.log("REDIRECT:", redirectURL || "NONE");

  console.log("=================================");
});
