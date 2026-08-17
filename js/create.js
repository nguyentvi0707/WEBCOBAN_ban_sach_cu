document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#createForm");
  const loginButton = document.querySelector("#Login");

  const usernameInput = document.querySelector("#username");
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");
  const confirmPasswordInput = document.querySelector("#confirmPassword");

  const togglePassword = document.querySelector("#togglePassword");
  const toggleConfirmPassword = document.querySelector(
    "#toggleConfirmPassword",
  );

  if (
    !form ||
    !usernameInput ||
    !emailInput ||
    !passwordInput ||
    !confirmPasswordInput
  ) {
    console.error("Không tìm thấy form hoặc input!");

    return;
  }

  const params = new URLSearchParams(window.location.search);
  const redirectURL = params.get("redirect") || "";

  const goToLogin = () => {
    const loginURL = new URL("./login.html", window.location.href);

    if (redirectURL) {
      loginURL.searchParams.set("redirect", redirectURL);
    }

    window.location.href = loginURL.href;
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    return emailPattern.test(email);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      alert("Vui lòng nhập đầy đủ thông tin!");

      return;
    }

    if (username.length < 3) {
      alert("Username phải có ít nhất 3 ký tự!");

      return;
    }

    if (!isValidEmail(email)) {
      alert("Email không hợp lệ! Vui lòng nhập đúng định dạng email.");

      emailInput.focus();

      return;
    }

    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");

      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu nhập lại không khớp!");

      confirmPasswordInput.focus();

      return;
    }

    let users = [];

    if (typeof getUsers === "function") {
      users = getUsers();
    } else {
      console.error("Không tìm thấy hàm getUsers()!");

      alert("Không thể lấy dữ liệu tài khoản!");

      return;
    }

    if (!Array.isArray(users)) {
      console.error("Dữ liệu users không hợp lệ!");

      alert("Dữ liệu tài khoản không hợp lệ!");

      return;
    }

    const existingUsername = users.find((user) => {
      const savedUsername = String(user.username || "")
        .trim()
        .toLowerCase();

      return savedUsername === username.toLowerCase();
    });

    if (existingUsername) {
      alert("Username đã tồn tại!");

      usernameInput.focus();

      return;
    }

    const existingEmail = users.find((user) => {
      const savedEmail = String(user.email || "")
        .trim()
        .toLowerCase();

      return savedEmail === email;
    });

    if (existingEmail) {
      alert("Email đã được sử dụng!");

      emailInput.focus();

      return;
    }

    const newUser = {
      username,
      email,
      password,
    };

    users.push(newUser);

    if (typeof saveUsers === "function") {
      saveUsers(users);
    } else {
      console.error("Không tìm thấy hàm saveUsers()!");

      alert("Không thể lưu tài khoản!");

      return;
    }

    alert("Tạo tài khoản thành công! Vui lòng đăng nhập.");

    goToLogin();
  });

  loginButton?.addEventListener("click", (event) => {
    event.preventDefault();

    goToLogin();
  });

  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";

      passwordInput.type = isPassword ? "text" : "password";

      togglePassword.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password",
      );

      if (togglePassword.tagName === "IMG") {
        togglePassword.alt = isPassword ? "Hide Password" : "Show Password";
      }

      const icon = togglePassword.querySelector("img");

      if (icon) {
        icon.alt = isPassword ? "Hide Password" : "Show Password";
      }
    });
  }

  if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener("click", () => {
      const isPassword = confirmPasswordInput.type === "password";

      confirmPasswordInput.type = isPassword ? "text" : "password";

      toggleConfirmPassword.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password",
      );

      if (toggleConfirmPassword.tagName === "IMG") {
        toggleConfirmPassword.alt = isPassword
          ? "Hide Password"
          : "Show Password";
      }

      const icon = toggleConfirmPassword.querySelector("img");

      if (icon) {
        icon.alt = isPassword ? "Hide Password" : "Show Password";
      }
    });
  }
});
