document.addEventListener("DOMContentLoaded", () => {
  // =====================================================
  // ELEMENT
  // =====================================================

  const form = document.querySelector("#createForm");
  const loginButton = document.querySelector("#Login");

  const usernameInput = document.querySelector("#username");
  const passwordInput = document.querySelector("#password");
  const confirmPasswordInput = document.querySelector("#confirmPassword");

  const togglePassword = document.querySelector("#togglePassword");
  const toggleConfirmPassword = document.querySelector(
    "#toggleConfirmPassword",
  );

  // =====================================================
  // CHECK ELEMENT
  // =====================================================

  if (!form || !usernameInput || !passwordInput || !confirmPasswordInput) {
    console.error("Không tìm thấy form hoặc input!");
    return;
  }

  // =====================================================
  // CREATE ACCOUNT
  // =====================================================

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // ===================================================
    // LẤY DỮ LIỆU
    // ===================================================

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // ===================================================
    // KIỂM TRA RỖNG
    // ===================================================

    if (username === "" || password === "" || confirmPassword === "") {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // ===================================================
    // KIỂM TRA MẬT KHẨU
    // ===================================================

    if (password !== confirmPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    // ===================================================
    // LẤY USERS TỪ LOCAL STORAGE
    // ===================================================

    let users = [];

    if (typeof getUsers === "function") {
      users = getUsers();
    } else {
      console.error("Không tìm thấy hàm getUsers()!");
      return;
    }

    // ===================================================
    // KIỂM TRA USERNAME ĐÃ TỒN TẠI
    // ===================================================

    const existingUser = users.find((user) => {
      return (
        String(user.username || "")
          .trim()
          .toLowerCase() === username.toLowerCase()
      );
    });

    if (existingUser) {
      alert("Username đã tồn tại!");
      return;
    }

    // ===================================================
    // TẠO USER MỚI
    // ===================================================

    const newUser = {
      username: username,
      password: password,
    };

    users.push(newUser);

    // ===================================================
    // LƯU USER
    // ===================================================

    if (typeof saveUsers === "function") {
      saveUsers(users);
    } else {
      console.error("Không tìm thấy hàm saveUsers()!");
      return;
    }

    // ===================================================
    // THÔNG BÁO
    // ===================================================

    alert("Tạo tài khoản thành công!");

    // ===================================================
    // CHUYỂN SANG LOGIN
    // ===================================================

    window.location.href = "../pages/login.html";
  });

  // =====================================================
  // LOGIN BUTTON TRÊN HEADER
  // =====================================================

  if (loginButton) {
    loginButton.addEventListener("click", () => {
      window.location.href = "../pages/login.html";
    });
  }

  // =====================================================
  // SHOW / HIDE PASSWORD
  // =====================================================

  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.alt = "Hide Password";
      } else {
        passwordInput.type = "password";
        togglePassword.alt = "Show Password";
      }
    });
  }

  // =====================================================
  // SHOW / HIDE CONFIRM PASSWORD
  // =====================================================

  if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener("click", () => {
      if (confirmPasswordInput.type === "password") {
        confirmPasswordInput.type = "text";
        toggleConfirmPassword.alt = "Hide Password";
      } else {
        confirmPasswordInput.type = "password";
        toggleConfirmPassword.alt = "Show Password";
      }
    });
  }
});
