
(() => {
  "use strict";

  /* =====================================================
     CHỐNG LOAD 2 LẦN
  ===================================================== */

  if (window.__IUHSVBOOK_BOOKMARK_SYSTEM__) {
    console.warn("BOOKMARK SYSTEM đã được load trước đó.");
    return;
  }

  window.__IUHSVBOOK_BOOKMARK_SYSTEM__ = true;

  console.log("=================================");
  console.log("IUHSVBOOK BOOKMARK SYSTEM START");
  console.log("=================================");

  /* =====================================================
     STORAGE
  ===================================================== */

  const STORAGE_KEY = "bookmarks";

  /* =====================================================
     GET BOOKMARKS
  ===================================================== */

  const getBookmarks = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return [];
      }

      const data = JSON.parse(raw);

      if (!Array.isArray(data)) {
        return [];
      }

      const normalized = data
        .filter(
          (id) => id !== undefined && id !== null && String(id).trim() !== "",
        )
        .map((id) => String(id).trim());

      return [...new Set(normalized)];
    } catch (error) {
      console.error("BOOKMARK GET ERROR:", error);

      return [];
    }
  };

  /* =====================================================
     SAVE BOOKMARKS
  ===================================================== */

  const saveBookmarks = (bookmarks) => {
    const safeBookmarks = Array.isArray(bookmarks)
      ? bookmarks
          .filter(
            (id) => id !== undefined && id !== null && String(id).trim() !== "",
          )
          .map((id) => String(id).trim())
      : [];

    const uniqueBookmarks = [...new Set(safeBookmarks)];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueBookmarks));

    /*
     * Thông báo cho các trang trong cùng tab.
     */

    window.dispatchEvent(
      new CustomEvent("bookmarkchange", {
        detail: {
          bookmarks: [...uniqueBookmarks],
        },
      }),
    );

    return uniqueBookmarks;
  };

  /* =====================================================
     CHECK BOOKMARK
  ===================================================== */

  const isBookmarked = (id) => {
    if (id === undefined || id === null || String(id).trim() === "") {
      return false;
    }

    const targetId = String(id).trim();

    return getBookmarks().includes(targetId);
  };

  /* =====================================================
     TOGGLE BOOKMARK
  ===================================================== */

  const toggleBookmark = (id) => {
    if (id === undefined || id === null || String(id).trim() === "") {
      return false;
    }

    const targetId = String(id).trim();

    const bookmarks = getBookmarks();

    const index = bookmarks.indexOf(targetId);

    /* -----------------------------------------------
       ĐANG CÓ -> XÓA
    ----------------------------------------------- */

    if (index !== -1) {
      bookmarks.splice(index, 1);

      saveBookmarks(bookmarks);

      console.log("BOOKMARK REMOVED:", targetId);

      return false;
    }

    /* -----------------------------------------------
       CHƯA CÓ -> THÊM
    ----------------------------------------------- */

    bookmarks.push(targetId);

    saveBookmarks(bookmarks);

    console.log("BOOKMARK ADDED:", targetId);

    return true;
  };

  /* =====================================================
     CURRENT USER
  ===================================================== */

  const getCurrentUser = () => {
    const raw = localStorage.getItem("currentUser");

    if (!raw) {
      return null;
    }

    try {
      const user = JSON.parse(raw);

      if (!user || typeof user !== "object") {
        return null;
      }

      return user;
    } catch (error) {
      console.error("CURRENT USER ERROR:", error);

      localStorage.removeItem("currentUser");

      return null;
    }
  };

  /* =====================================================
     PAGE HELPER
  ===================================================== */

  const isInsidePages = window.location.pathname
    .toLowerCase()
    .includes("/pages/");

  const getPagePath = (fileName) => {
    if (isInsidePages) {
      return `./${fileName}`;
    }

    return `./pages/${fileName}`;
  };

  /* =====================================================
     LOGIN
  ===================================================== */

  const goToLoginFromBookmark = () => {
    const currentPage =
      window.location.pathname + window.location.search + window.location.hash;

    const loginURL = new URL(getPagePath("login.html"), window.location.href);

    loginURL.searchParams.set("redirect", currentPage);

    console.log("BOOKMARK LOGIN:", loginURL.href);

    window.location.href = loginURL.href;
  };

  /* =====================================================
     FAVORITE
  ===================================================== */

  const goToFavorite = () => {
    /*
     * Chưa login
     */

    if (!getCurrentUser()) {
      alert("Bạn cần đăng nhập trước khi xem sách yêu thích!");

      goToLoginFromBookmark();

      return;
    }

    /*
     * Đang ở favorite thì không chuyển lại.
     */

    const currentPath = window.location.pathname.toLowerCase();

    if (
      currentPath.endsWith("/favorite.html") ||
      currentPath.endsWith("favorite.html")
    ) {
      return;
    }

    const favoriteURL = new URL(
      getPagePath("favorite.html"),
      window.location.href,
    );

    console.log("OPEN FAVORITE:", favoriteURL.href);

    window.location.href = favoriteURL.href;
  };

  /* =====================================================
     UPDATE 1 BOOKMARK BUTTON
  ===================================================== */

  const updateBookmarkButton = (button) => {
    if (!button) {
      return;
    }

    const id = button.dataset.bookmarkId;

    if (id === undefined || id === null || String(id).trim() === "") {
      return;
    }

    const active = isBookmarked(id);

    button.classList.toggle("active", active);

    button.setAttribute("aria-pressed", String(active));

    button.setAttribute(
      "aria-label",
      active ? "Bỏ yêu thích" : "Thêm vào yêu thích",
    );
  };

  /* =====================================================
     UPDATE ALL BOOKMARK BUTTONS
  ===================================================== */

  const updateBookmarkButtons = () => {
    document.querySelectorAll("[data-bookmark-id]").forEach((button) => {
      updateBookmarkButton(button);
    });
  };

  /* =====================================================
     EXPORT GLOBAL
  ===================================================== */

  window.getBookmarks = getBookmarks;

  window.saveBookmarks = saveBookmarks;

  window.isBookmarked = isBookmarked;

  window.toggleBookmark = toggleBookmark;

  window.updateBookmarkButton = updateBookmarkButton;

  window.updateBookmarkButtons = updateBookmarkButtons;

  window.goToFavorite = goToFavorite;

  window.goToLoginFromBookmark = goToLoginFromBookmark;

  window.bookmarkGetCurrentUser = getCurrentUser;

  /* =====================================================
     PRODUCT BOOKMARK CLICK
     
     DÙNG EVENT DELEGATION
     
     Card tạo sau bằng JavaScript vẫn hoạt động.
  ===================================================== */

  const handleProductBookmarkClick = (event) => {
    const button = event.target.closest("button[data-bookmark-id]");

    if (!button) {
      return;
    }

    /*
     * Chặn card click.
     */

    event.preventDefault();
    event.stopPropagation();

    /*
     * ID
     */

    const id = button.dataset.bookmarkId;

    if (id === undefined || id === null || String(id).trim() === "") {
      console.warn("BOOKMARK BUTTON KHÔNG CÓ ID:", button);

      return;
    }

    /*
     * Login
     */

    if (!getCurrentUser()) {
      alert("Bạn cần đăng nhập trước khi lưu sách yêu thích!");

      goToLoginFromBookmark();

      return;
    }

    /*
     * Toggle
     */

    const active = toggleBookmark(id);

    /*
     * Cập nhật ngay button hiện tại.
     */

    updateBookmarkButton(button);

    /*
     * Cập nhật toàn bộ button.
     */

    updateBookmarkButtons();

    console.log("BOOKMARK CLICK:", id, active ? "ACTIVE" : "REMOVED");
  };

  /* =====================================================
     HEADER BOOKMARK CLICK
     
     Header không có data-bookmark-id.
     Header -> favorite.html
  ===================================================== */

  const handleHeaderBookmarkClick = (event) => {
    const headerBookmark = event.target.closest(
      '#bookmarkIcon, .bookmark, a[aria-label="Bookmark"]',
    );

    if (!headerBookmark) {
      return;
    }

    /*
     * Nếu là bookmark sản phẩm
     * thì không xử lý ở đây.
     */

    if (headerBookmark.hasAttribute("data-bookmark-id")) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    goToFavorite();
  };

  /* =====================================================
     INITIALIZE
  ===================================================== */

  const initialize = () => {
    /*
     * Tránh gắn listener lần 2.
     */

    if (window.__IUHSVBOOK_BOOKMARK_INITIALIZED__) {
      return;
    }

    window.__IUHSVBOOK_BOOKMARK_INITIALIZED__ = true;

    console.log("BOOKMARK INITIALIZE");

    /*
     * Đồng bộ màu ban đầu.
     */

    updateBookmarkButtons();

    /* -----------------------------------------------
       PRODUCT BOOKMARK
    ----------------------------------------------- */

    document.addEventListener("click", handleProductBookmarkClick, true);

    /* -----------------------------------------------
       HEADER BOOKMARK
    ----------------------------------------------- */

    document.addEventListener("click", handleHeaderBookmarkClick, true);

    /* -----------------------------------------------
       STORAGE CHANGE
       
       Đồng bộ giữa các tab.
    ----------------------------------------------- */

    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY) {
        updateBookmarkButtons();

        window.dispatchEvent(
          new CustomEvent("bookmarkchange", {
            detail: {
              bookmarks: getBookmarks(),
            },
          }),
        );
      }

      if (event.key === "currentUser") {
        updateBookmarkButtons();
      }
    });

    console.log("BOOKMARK SYSTEM READY");

    console.log("CURRENT USER:", getCurrentUser());

    console.log("BOOKMARKS:", getBookmarks());

    console.log("=================================");
  };

  /* =====================================================
     DOM READY
  ===================================================== */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, {
      once: true,
    });
  } else {
    initialize();
  }
})();
