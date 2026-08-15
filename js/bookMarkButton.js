/* =====================================================
   IUHSVBOOK - GLOBAL BOOKMARK SYSTEM
===================================================== */

/* =====================================================
   BOOKMARK STORAGE
   ĐẶT NGOÀI DOMContentLoaded
   để mọi file JS đều có thể sử dụng ngay.
===================================================== */

const getBookmarks = () => {
  try {
    const data = JSON.parse(localStorage.getItem("bookmarks"));

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("LỖI ĐỌC BOOKMARKS:", error);

    return [];
  }
};

const saveBookmarks = (bookmarks) => {
  localStorage.setItem(
    "bookmarks",
    JSON.stringify(Array.isArray(bookmarks) ? bookmarks : []),
  );
};

const isBookmarked = (id) => {
  if (id === undefined || id === null || id === "") {
    return false;
  }

  return getBookmarks().some((item) => String(item) === String(id));
};

const toggleBookmark = (id) => {
  if (id === undefined || id === null || id === "") {
    return false;
  }

  const bookmarks = getBookmarks();

  const index = bookmarks.findIndex((item) => String(item) === String(id));

  if (index >= 0) {
    bookmarks.splice(index, 1);

    saveBookmarks(bookmarks);

    return false;
  }

  bookmarks.push(id);

  saveBookmarks(bookmarks);

  return true;
};

/* =====================================================
   GLOBAL FUNCTIONS
===================================================== */

window.getBookmarks = getBookmarks;

window.saveBookmarks = saveBookmarks;

window.isBookmarked = isBookmarked;

window.toggleBookmark = toggleBookmark;

/* =====================================================
   DOM READY
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  console.log("=================================");

  console.log("BOOKMARK SYSTEM START");

  console.log("PAGE:", window.location.href);

  console.log("BOOKMARK COUNT:", getBookmarks().length);

  console.log("=================================");

  /* =================================================
       CURRENT USER
    ================================================= */

  const getCurrentUser = () => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      return null;
    }

    try {
      return JSON.parse(currentUser);
    } catch (error) {
      console.error("LỖI ĐỌC currentUser:", error);

      localStorage.removeItem("currentUser");

      return null;
    }
  };

  /* =================================================
       GO TO LOGIN
    ================================================= */

  const goToLogin = () => {
    const currentPage =
      window.location.pathname + window.location.search + window.location.hash;

    const loginURL = new URL(
      window.location.pathname.includes("/pages/")
        ? "./login.html"
        : "./pages/login.html",
      window.location.href,
    );

    loginURL.searchParams.set("redirect", currentPage);

    console.log("LOGIN REDIRECT:", loginURL.href);

    window.location.href = loginURL.href;
  };

  /* =================================================
       GO TO FAVORITE
    ================================================= */

  const goToFavorite = () => {
    if (!getCurrentUser()) {
      alert("Bạn cần đăng nhập trước khi xem sách yêu thích!");

      goToLogin();

      return;
    }

    const favoriteURL = new URL(
      window.location.pathname.includes("/pages/")
        ? "./favorite.html"
        : "./pages/favorite.html",
      window.location.href,
    );

    window.location.href = favoriteURL.href;
  };

  /* =================================================
       HEADER BOOKMARK
    ================================================= */

  const headerBookmarks = document.querySelectorAll(".bookmark, #bookmarkIcon");

  headerBookmarks.forEach((button) => {
    if (button.dataset.bookmarkConnected === "true") {
      return;
    }

    button.dataset.bookmarkConnected = "true";

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      goToFavorite();
    });
  });

  /* =================================================
       PRODUCT BOOKMARK
       
       Hỗ trợ:
       data-bookmark-id="123"
    ================================================= */

  const productBookmarks = document.querySelectorAll("[data-bookmark-id]");

  productBookmarks.forEach((button) => {
    if (button.dataset.bookmarkConnected === "true") {
      return;
    }

    button.dataset.bookmarkConnected = "true";

    const id = button.dataset.bookmarkId;

    button.classList.toggle("active", isBookmarked(id));

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!getCurrentUser()) {
        alert("Bạn cần đăng nhập trước khi lưu sách yêu thích!");

        goToLogin();

        return;
      }

      const active = toggleBookmark(id);

      button.classList.toggle("active", active);

      updateBookmarkButtons();
    });
  });

  /* =================================================
       UPDATE ALL BUTTONS
    ================================================= */

  const updateBookmarkButtons = () => {
    document.querySelectorAll("[data-bookmark-id]").forEach((button) => {
      button.classList.toggle(
        "active",
        isBookmarked(button.dataset.bookmarkId),
      );
    });
  };

  window.updateBookmarkButtons = updateBookmarkButtons;

  /* =================================================
       GLOBAL FAVORITE
    ================================================= */

  window.goToFavorite = goToFavorite;

  window.goToLoginFromBookmark = goToLogin;

  /* =================================================
       READY
    ================================================= */

  console.log("BOOKMARK SYSTEM READY");

  console.log("CURRENT BOOKMARKS:", getBookmarks());
});
