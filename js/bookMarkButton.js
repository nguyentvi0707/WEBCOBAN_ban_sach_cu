(() => {
  "use strict";

  if (window.__IUHSVBOOK_BOOKMARK_SYSTEM__) {
    return;
  }

  window.__IUHSVBOOK_BOOKMARK_SYSTEM__ = true;

  const STORAGE_KEY = "bookmarks";

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
          (id) =>
            id !== undefined &&
            id !== null &&
            String(id).trim() !== "",
        )
        .map((id) => String(id).trim());

      return [...new Set(normalized)];
    } catch (error) {
      return [];
    }
  };

  const saveBookmarks = (bookmarks) => {
    const safeBookmarks = Array.isArray(bookmarks)
      ? bookmarks
          .filter(
            (id) =>
              id !== undefined &&
              id !== null &&
              String(id).trim() !== "",
          )
          .map((id) => String(id).trim())
      : [];

    const uniqueBookmarks = [...new Set(safeBookmarks)];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(uniqueBookmarks),
    );

    window.dispatchEvent(
      new CustomEvent("bookmarkchange", {
        detail: {
          bookmarks: [...uniqueBookmarks],
        },
      }),
    );

    return uniqueBookmarks;
  };

  const isBookmarked = (id) => {
    if (
      id === undefined ||
      id === null ||
      String(id).trim() === ""
    ) {
      return false;
    }

    return getBookmarks().includes(
      String(id).trim(),
    );
  };

  const toggleBookmark = (id) => {
    if (
      id === undefined ||
      id === null ||
      String(id).trim() === ""
    ) {
      return false;
    }

    const targetId = String(id).trim();

    const bookmarks = getBookmarks();

    const index = bookmarks.indexOf(targetId);

    if (index !== -1) {
      bookmarks.splice(index, 1);
      saveBookmarks(bookmarks);
      return false;
    }

    bookmarks.push(targetId);
    saveBookmarks(bookmarks);

    return true;
  };

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
      localStorage.removeItem("currentUser");
      return null;
    }
  };

  const isInsidePages = window.location.pathname
    .toLowerCase()
    .includes("/pages/");

  const getPagePath = (fileName) => {
    if (isInsidePages) {
      return `./${fileName}`;
    }

    return `./pages/${fileName}`;
  };

  const goToLoginFromBookmark = () => {
    const currentPage =
      window.location.pathname +
      window.location.search +
      window.location.hash;

    const loginURL = new URL(
      getPagePath("login.html"),
      window.location.href,
    );

    loginURL.searchParams.set(
      "redirect",
      currentPage,
    );

    window.location.href = loginURL.href;
  };

  const goToFavorite = () => {
    if (!getCurrentUser()) {
      alert(
        "Bạn cần đăng nhập trước khi xem sách yêu thích!",
      );

      goToLoginFromBookmark();

      return;
    }

    const currentPath =
      window.location.pathname.toLowerCase();

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

    window.location.href = favoriteURL.href;
  };

  const updateBookmarkButton = (button) => {
    if (!button) {
      return;
    }

    const id = button.dataset.bookmarkId;

    if (
      id === undefined ||
      id === null ||
      String(id).trim() === ""
    ) {
      return;
    }

    const active = isBookmarked(id);

    button.classList.toggle("active", active);

    button.setAttribute(
      "aria-pressed",
      String(active),
    );

    button.setAttribute(
      "aria-label",
      active
        ? "Bỏ yêu thích"
        : "Thêm vào yêu thích",
    );
  };

  const updateBookmarkButtons = () => {
    document
      .querySelectorAll(
        "[data-bookmark-id]",
      )
      .forEach((button) => {
        updateBookmarkButton(button);
      });
  };

  window.getBookmarks = getBookmarks;
  window.saveBookmarks = saveBookmarks;
  window.isBookmarked = isBookmarked;
  window.toggleBookmark = toggleBookmark;
  window.updateBookmarkButton =
    updateBookmarkButton;
  window.updateBookmarkButtons =
    updateBookmarkButtons;
  window.goToFavorite = goToFavorite;
  window.goToLoginFromBookmark =
    goToLoginFromBookmark;
  window.bookmarkGetCurrentUser =
    getCurrentUser;

  const handleProductBookmarkClick = (
    event,
  ) => {
    const button =
      event.target.closest(
        "button[data-bookmark-id]",
      );

    if (!button) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const id = button.dataset.bookmarkId;

    if (
      id === undefined ||
      id === null ||
      String(id).trim() === ""
    ) {
      return;
    }

    if (!getCurrentUser()) {
      alert(
        "Bạn cần đăng nhập trước khi lưu sách yêu thích!",
      );

      goToLoginFromBookmark();

      return;
    }

    toggleBookmark(id);

    updateBookmarkButton(button);
    updateBookmarkButtons();
  };

  const handleHeaderBookmarkClick = (
    event,
  ) => {
    const headerBookmark =
      event.target.closest(
        '#bookmarkIcon, .bookmark, a[aria-label="Bookmark"]',
      );

    if (!headerBookmark) {
      return;
    }

    if (
      headerBookmark.hasAttribute(
        "data-bookmark-id",
      )
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    goToFavorite();
  };

  const initialize = () => {
    if (
      window.__IUHSVBOOK_BOOKMARK_INITIALIZED__
    ) {
      return;
    }

    window.__IUHSVBOOK_BOOKMARK_INITIALIZED__ =
      true;

    updateBookmarkButtons();

    document.addEventListener(
      "click",
      handleProductBookmarkClick,
      true,
    );

    document.addEventListener(
      "click",
      handleHeaderBookmarkClick,
      true,
    );

    window.addEventListener(
      "storage",
      (event) => {
        if (event.key === STORAGE_KEY) {
          updateBookmarkButtons();

          window.dispatchEvent(
            new CustomEvent(
              "bookmarkchange",
              {
                detail: {
                  bookmarks:
                    getBookmarks(),
                },
              },
            ),
          );
        }

        if (
          event.key === "currentUser"
        ) {
          updateBookmarkButtons();
        }
      },
    );
  };

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      {
        once: true,
      },
    );
  } else {
    initialize();
  }
})();