document.addEventListener("DOMContentLoaded", () => {
  // =====================================================
  // LẤY ELEMENT
  // =====================================================

  const form = document.querySelector("#loginForm");
  const createButton = document.querySelector("#createAccount");
  const homeButton = document.querySelector("#homeButton");

  const usernameInput = document.querySelector("#username");
  const passwordInput = document.querySelector("#password");
  const rememberMe = document.querySelector("#rememberMe");

  // Nút con mắt
  const passwordToggle = document.querySelector(".password-toggle");

  // =====================================================
  // KIỂM TRA ELEMENT
  // =====================================================

  if (!form || !usernameInput || !passwordInput) {
    console.error("Không tìm thấy form login hoặc input!");
    return;
  }

  // =====================================================
  // NÚT HOME
  // =====================================================

  if (homeButton) {
    homeButton.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  }

  // =====================================================
  // NÚT CREATE ACCOUNT
  // =====================================================

  if (createButton) {
    createButton.addEventListener("click", () => {
      window.location.href = "../pages/create.html";
    });
  }

  // =====================================================
  // SHOW / HIDE PASSWORD
  // =====================================================

  if (passwordToggle) {
    passwordToggle.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";

      passwordInput.type = isPassword ? "text" : "password";

      passwordToggle.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password",
      );

      // Đổi alt của icon
      const icon = passwordToggle.querySelector("img");

      if (icon) {
        icon.alt = isPassword ? "Hide Password" : "Show Password";
      }
    });
  }

  // =====================================================
  // LOGIN
  // =====================================================

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Lấy dữ liệu nhập
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // ===================================================
    // KIỂM TRA RỖNG
    // ===================================================

    if (username === "" || password === "") {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // ===================================================
    // KIỂM TRA getUsers()
    // ===================================================

    if (typeof getUsers !== "function") {
      console.error("Không tìm thấy hàm getUsers()!");
      alert("Không thể lấy dữ liệu tài khoản!");
      return;
    }

    // ===================================================
    // LẤY USERS TỪ LOCAL STORAGE
    // ===================================================

    const users = getUsers();

    if (!Array.isArray(users)) {
      console.error("Dữ liệu users không hợp lệ!");
      alert("Dữ liệu tài khoản không hợp lệ!");
      return;
    }

    // ===================================================
    // TÌM USER
    // ===================================================

    const user = users.find((item) => {
      const savedUsername = String(item.username || "").trim();
      const savedPassword = String(item.password || "");

      return (
        savedUsername.toLowerCase() === username.toLowerCase() &&
        savedPassword === password
      );
    });

    // ===================================================
    // SAI TÀI KHOẢN / MẬT KHẨU
    // ===================================================

    if (!user) {
      alert("Tài khoản hoặc mật khẩu chưa chính xác!");
      return;
    }

    // ===================================================
    // ĐĂNG NHẬP THÀNH CÔNG
    // ===================================================

    localStorage.setItem("currentUser", JSON.stringify(user));

    alert("Đăng nhập thành công!");

    // ===================================================
    // VỀ TRANG CHỦ
    // ===================================================

    window.location.href = "../index.html";
  });
});
