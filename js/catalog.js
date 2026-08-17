document.addEventListener("DOMContentLoaded", async () => {
  "use strict";

  console.log("=================================");
  console.log("IUHSVBOOK CATALOG START");
  console.log("PAGE:", window.location.href);
  console.log("=================================");

  const catalogResults =
    document.querySelector("#catalogResults") ||
    document.querySelector(".catalog-results");

  const emptyResults =
    document.querySelector("#emptyResults");

  const searchInput =
    document.querySelector("#categorySearchInput") ||
    document.querySelector(".category-search input");

  const searchButton =
    document.querySelector("#categorySearchButton") ||
    document.querySelector(".category-search button");

  const resultsKeyword =
    document.querySelector("#resultsKeyword") ||
    document.querySelector(".results-keyword");

  const categoryDropdown =
    document.querySelector("#categoryDropdown");

  const categoryButton =
    document.querySelector("#categoryDropdownBtn");

  const categoryMenu =
    document.querySelector("#categoryDropdownMenu");

  const filterDropdown =
    document.querySelector("#filterDropdown");

  const filterButton =
    document.querySelector("#filterDropdownBtn");

  const filterMenu =
    document.querySelector("#filterDropdownMenu");

  const signInButton =
    document.querySelector("#signInButton");

  const createAccountButton =
    document.querySelector("#createAccountButton");

  const userInfo =
    document.querySelector("#userInfo");

  const usernameDisplay =
    document.querySelector("#usernameDisplay");

  const logoutButton =
    document.querySelector("#logoutButton");

  const homeIcon =
    document.querySelector("#homeIcon") ||
    document.querySelector(".home") ||
    document.querySelector(
      'a[aria-label="Home"]',
    );

  const productIcon =
    document.querySelector("#productIcon") ||
    document.querySelector(".product") ||
    document.querySelector(
      'a[aria-label="Products"]',
    );

  const cartIcon =
    document.querySelector("#cartIcon") ||
    document.querySelector(".cart") ||
    document.querySelector(
      'a[aria-label="Cart"]',
    );

  if (!catalogResults) {
    console.error(
      "CATALOG ERROR: Không tìm thấy #catalogResults hoặc .catalog-results",
    );
    return;
  }

  const isInsidePages =
    window.location.pathname
      .toLowerCase()
      .includes("/pages/");

  const getPagePath = (fileName) => {
    if (isInsidePages) {
      if (fileName === "index.html") {
        return "../index.html";
      }

      return `./${fileName}`;
    }

    if (fileName === "index.html") {
      return "./index.html";
    }

    return `./pages/${fileName}`;
  };

  const getCurrentUser = () => {
    const raw =
      localStorage.getItem("currentUser");

    if (!raw) {
      return null;
    }

    try {
      const user = JSON.parse(raw);

      if (
        !user ||
        typeof user !== "object"
      ) {
        return null;
      }

      return user;
    } catch (error) {
      console.error(
        "CATALOG: LỖI ĐỌC currentUser:",
        error,
      );

      localStorage.removeItem(
        "currentUser",
      );

      return null;
    }
  };

  window.catalogGetCurrentUser =
    getCurrentUser;

  const goToLogin = () => {
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

    window.location.href =
      loginURL.href;
  };

  const updateUserUI = () => {
    const user = getCurrentUser();

    if (!user) {
      if (signInButton) {
        signInButton.style.display =
          "flex";
      }

      if (createAccountButton) {
        createAccountButton.style.display =
          "flex";
      }

      if (userInfo) {
        userInfo.style.display =
          "none";
      }

      if (usernameDisplay) {
        usernameDisplay.textContent = "";
      }

      return;
    }

    if (signInButton) {
      signInButton.style.display =
        "none";
    }

    if (createAccountButton) {
      createAccountButton.style.display =
        "none";
    }

    if (userInfo) {
      userInfo.style.display = "flex";
    }

    if (usernameDisplay) {
      usernameDisplay.textContent =
        user.username ||
        user.name ||
        user.email ||
        "User";
    }
  };

  if (signInButton) {
    signInButton.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        goToLogin();
      },
    );
  }

  if (createAccountButton) {
    createAccountButton.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        const currentPage =
          window.location.pathname +
          window.location.search +
          window.location.hash;

        const createURL = new URL(
          getPagePath("create.html"),
          window.location.href,
        );

        createURL.searchParams.set(
          "redirect",
          currentPage,
        );

        window.location.href =
          createURL.href;
      },
    );
  }

  if (logoutButton) {
    logoutButton.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        localStorage.removeItem(
          "currentUser",
        );

        localStorage.removeItem(
          "shoppingCart",
        );

        sessionStorage.removeItem(
          "lastOrder",
        );

        sessionStorage.removeItem(
          "checkoutRedirect",
        );

        const sidebar =
          document.querySelector(
            ".shoppingCartSidebar",
          );

        const background =
          document.querySelector(
            ".shoppingCartSidebar-bg",
          );

        sidebar?.classList.remove(
          "active",
        );

        background?.classList.remove(
          "active",
        );

        if (
          typeof window.renderCart ===
          "function"
        ) {
          window.renderCart();
        }

        updateUserUI();

        window.location.reload();
      },
    );
  }

  if (homeIcon) {
    homeIcon.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        window.location.href =
          getPagePath("index.html");
      },
    );
  }

  if (productIcon) {
    productIcon.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        const currentPath =
          window.location.pathname.toLowerCase();

        if (
          !currentPath.endsWith(
            "catalog.html",
          )
        ) {
          window.location.href =
            getPagePath("catalog.html");
        }
      },
    );
  }

  if (cartIcon) {
    cartIcon.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!getCurrentUser()) {
          alert(
            "Bạn cần đăng nhập trước khi xem giỏ hàng!",
          );

          goToLogin();
          return;
        }

        if (
          typeof window.openCartSidebar ===
          "function"
        ) {
          window.openCartSidebar();
          return;
        }

        const sidebar =
          document.querySelector(
            ".shoppingCartSidebar",
          );

        const background =
          document.querySelector(
            ".shoppingCartSidebar-bg",
          );

        if (
          typeof window.renderCart ===
          "function"
        ) {
          window.renderCart();
        }

        sidebar?.classList.add(
          "active",
        );

        background?.classList.add(
          "active",
        );
      },
    );
  }

  const waitForBookmarkSystem =
    async () => {
      const maxAttempts = 100;
      let attempts = 0;

      while (
        (typeof window.getBookmarks !==
          "function" ||
          typeof window.isBookmarked !==
            "function" ||
          typeof window.updateBookmarkButtons !==
            "function") &&
        attempts < maxAttempts
      ) {
        await new Promise(
          (resolve) => {
            setTimeout(resolve, 30);
          },
        );

        attempts++;
      }

      return (
        typeof window.getBookmarks ===
          "function" &&
        typeof window.isBookmarked ===
          "function" &&
        typeof window.updateBookmarkButtons ===
          "function"
      );
    };

  await waitForBookmarkSystem();

  const normalizeText = (value) => {
    return String(value ?? "")
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        "",
      )
      .replace(/[đĐ]/g, "d")
      .replace(
        /[_-]+/g,
        " ",
      )
      .replace(
        /[()[\]{}]/g,
        " ",
      )
      .replace(
        /\s+/g,
        " ",
      )
      .trim()
      .toLowerCase();
  };

  const getBookCategory = (
    book,
  ) => {
    if (!book) {
      return "";
    }

    const value =
      book.category ??
      book.categoryName ??
      book.categoryId ??
      book.type ??
      book.typeName ??
      "";

    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (
            item &&
            typeof item ===
              "object"
          ) {
            return (
              item.name ??
              item.label ??
              item.title ??
              item.category ??
              ""
            );
          }

          return String(
            item ?? "",
          );
        })
        .join(" ");
    }

    if (
      value &&
      typeof value ===
        "object"
    ) {
      return String(
        value.name ??
          value.label ??
          value.title ??
          value.category ??
          "",
      ).trim();
    }

    return String(value).trim();
  };

  const getBookId = (book) => {
    if (
      !book ||
      book.id === undefined ||
      book.id === null ||
      String(book.id).trim() ===
        ""
    ) {
      return "";
    }

    return String(book.id).trim();
  };

  const categoryAliases = {
    "Đại cương": [
      "dai cuong",
      "sach dai cuong",
      "general",
      "general studies",
      "general study",
    ],

    "Ngoại ngữ": [
      "ngoai ngu",
      "sach ngoai ngu",
      "language",
      "languages",
      "foreign",
      "foreign language",
      "foreign languages",
    ],

    "Kỹ thuật - Công nghệ": [
      "ky thuat cong nghe",
      "ky thuat - cong nghe",
      "sach ky thuat cong nghe",
      "sach ky thuat - cong nghe",
      "ky thuat",
      "cong nghe",
      "cong nghe thong tin",
      "technology",
      "technologies",
      "information technology",
      "information technologies",
      "cntt",
    ],

    "Kỹ năng - Văn học": [
      "ky nang van hoc",
      "ky nang - van hoc",
      "sach ky nang van hoc",
      "sach ky nang - van hoc",
      "ky nang",
      "van hoc",
      "literature",
      "literatures",
      "skill",
      "skills",
    ],
  };

  const matchesCategory = (
    book,
    selectedCategory,
  ) => {
    if (selectedCategory === "all") {
      return true;
    }

    const rawCategory =
      normalizeText(
        getBookCategory(book),
      );

    if (!rawCategory) {
      return false;
    }

    const aliases =
      categoryAliases[
        selectedCategory
      ] || [];

    return aliases.some(
      (alias) => {
        const normalizedAlias =
          normalizeText(alias);

        return (
          rawCategory ===
            normalizedAlias ||
          rawCategory.includes(
            normalizedAlias,
          ) ||
          normalizedAlias.includes(
            rawCategory,
          )
        );
      },
    );
  };

  let books = [];

  const loadBookJSON = async () => {
    const paths = [
      "../data/book.json",
      "./data/book.json",
      "/data/book.json",
    ];

    const triedURLs = [];

    for (const path of paths) {
      try {
        const url = new URL(
          path,
          window.location.href,
        );

        triedURLs.push(url.href);

        const response =
          await fetch(url.href, {
            cache: "no-store",
          });

        if (!response.ok) {
          continue;
        }

        const text =
          await response.text();

        let data;

        try {
          data = JSON.parse(
            text,
          );
        } catch (
          error
        ) {
          continue;
        }

        if (
          !Array.isArray(data)
        ) {
          continue;
        }

        return data;
      } catch (
        error
      ) {
        console.warn(
          "CATALOG JSON ERROR:",
          path,
          error,
        );
      }
    }

    throw new Error(
      "Không tải được book.json.\n" +
        triedURLs.join(
          "\n",
        ),
    );
  };

  try {
    books =
      await loadBookJSON();
  } catch (error) {
    catalogResults.innerHTML = `
      <div class="empty-results">
        <div class="empty-book">
          <div class="book-left"></div>
          <div class="book-right"></div>
          <div class="book-center"></div>
        </div>

        <p>Không tải được book.json.</p>
      </div>
    `;

    return;
  }

  let selectedCategory = "all";
  let selectedFilter = "default";

  const categories = [
    "all",
    "Đại cương",
    "Ngoại ngữ",
    "Kỹ thuật - Công nghệ",
    "Kỹ năng - Văn học",
  ];

  const filters = [
    "default",
    "az",
    "za",
    "price-low",
    "price-high",
  ];

  const searchBooks = (
    list,
    keyword,
  ) => {
    const text =
      normalizeText(keyword);

    if (!text) {
      return [...list];
    }

    return list.filter(
      (book) => {
        const name =
          normalizeText(
            book.name,
          );

        const author =
          normalizeText(
            book.author,
          );

        return (
          name.includes(text) ||
          author.includes(text)
        );
      },
    );
  };

  const filterByCategory = (
    list,
    category,
  ) => {
    if (category === "all") {
      return [...list];
    }

    return list.filter(
      (book) =>
        matchesCategory(
          book,
          category,
        ),
    );
  };

  const sortBooks = (
    list,
    filter,
  ) => {
    const result = [...list];

    switch (filter) {
      case "az":
        result.sort(
          (a, b) =>
            String(
              a.name || "",
            ).localeCompare(
              String(
                b.name || "",
              ),
              "vi",
              {
                sensitivity:
                  "base",
              },
            ),
        );
        break;

      case "za":
        result.sort(
          (a, b) =>
            String(
              b.name || "",
            ).localeCompare(
              String(
                a.name || "",
              ),
              "vi",
              {
                sensitivity:
                  "base",
              },
            ),
        );
        break;

      case "price-low":
        result.sort(
          (a, b) =>
            Number(
              a.price || 0,
            ) -
            Number(
              b.price || 0,
            ),
        );
        break;

      case "price-high":
        result.sort(
          (a, b) =>
            Number(
              b.price || 0,
            ) -
            Number(
              a.price || 0,
            ),
        );
        break;

      default:
        break;
    }

    return result;
  };

  const updateSearchURL = (
    keyword,
  ) => {
    const url = new URL(
      window.location.href,
    );

    const text =
      String(
        keyword || "",
      ).trim();

    if (text) {
      url.searchParams.set(
        "search",
        text,
      );
    } else {
      url.searchParams.delete(
        "search",
      );
    }

    window.history.replaceState(
      {},
      "",
      url,
    );
  };

  const goToProductDetail = (
    book,
  ) => {
    const id =
      getBookId(book);

    if (!id) {
      return;
    }

    if (!getCurrentUser()) {
      alert(
        "Bạn cần đăng nhập trước khi xem sản phẩm!",
      );

      goToLogin();

      return;
    }

    const url = new URL(
      getPagePath(
        "productDetail.html",
      ),
      window.location.href,
    );

    url.searchParams.set(
      "id",
      id,
    );

    window.location.href =
      url.href;
  };

  const getBookImage = (
    book,
  ) => {
    const image =
      String(
        book?.image ?? "",
      ).trim();

    return (
      image ||
      "../images/COVER_BOOK.png"
    );
  };

  const createProductCard =
    (book) => {
      const id =
        getBookId(book);

      if (!id) {
        return null;
      }

      const card =
        document.createElement(
          "article",
        );

      card.className =
        "product-card";

      card.dataset.productId =
        id;

      const name = String(
        book.name ||
          "Không có tên",
      );

      const image =
        getBookImage(book);

      const price =
        Number(
          book.price || 0,
        ).toLocaleString(
          "vi-VN",
        );

      const bookmarked =
        typeof window.isBookmarked ===
        "function"
          ? window.isBookmarked(
              id,
            )
          : false;

      card.innerHTML = `
        <div class="product-image">
          <img
            src="${image}"
            alt="${name}"
            draggable="false"
            loading="lazy"
          />
        </div>

        <p
          class="product-name"
          title="${name}"
        >
          ${name}
        </p>

        <div class="product-info">
          <span class="product-price">
            ${price}đ
          </span>

          <button
            type="button"
            class="product-bookmark ${
              bookmarked
                ? "active"
                : ""
            }"
            data-bookmark-id="${id}"
            aria-label="${
              bookmarked
                ? "Bỏ yêu thích"
                : "Thêm yêu thích"
            }"
            aria-pressed="${String(
              bookmarked,
            )}"
          >
            <img
              src="../images/iconbookmark.png"
              alt="Bookmark"
              draggable="false"
            />
          </button>
        </div>

        <button
          type="button"
          class="add-cart"
          aria-label="Xem chi tiết"
        >
          <img
            src="../images/iconcart.png"
            alt="Xem chi tiết"
            draggable="false"
          />
        </button>
      `;

      const imageElement =
        card.querySelector(
          ".product-image img",
        );

      if (imageElement) {
        imageElement.addEventListener(
          "error",
          () => {
            if (
              imageElement.dataset
                .fallback !==
              "true"
            ) {
              imageElement.dataset.fallback =
                "true";

              imageElement.src =
                "../images/COVER_BOOK.png";
            }
          },
          {
            once: true,
          },
        );

        imageElement.addEventListener(
          "dragstart",
          (event) => {
            event.preventDefault();
          },
        );
      }

      const detailButton =
        card.querySelector(
          ".add-cart",
        );

      detailButton?.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopPropagation();

          goToProductDetail(
            book,
          );
        },
      );

      card.addEventListener(
        "click",
        (event) => {
          if (
            event.target.closest(
              "[data-bookmark-id]",
            )
          ) {
            return;
          }

          if (
            event.target.closest(
              ".add-cart",
            )
          ) {
            return;
          }

          goToProductDetail(
            book,
          );
        },
      );

      return card;
    };

  const updateBookmarkUI =
    () => {
      if (
        typeof window.isBookmarked !==
        "function"
      ) {
        return;
      }

      document
        .querySelectorAll(
          "[data-bookmark-id]",
        )
        .forEach((button) => {
          const id =
            button.dataset
              .bookmarkId;

          if (!id) {
            return;
          }

          const active =
            window.isBookmarked(
              id,
            );

          button.classList.toggle(
            "active",
            active,
          );

          button.setAttribute(
            "aria-pressed",
            String(active),
          );

          button.setAttribute(
            "aria-label",
            active
              ? "Bỏ yêu thích"
              : "Thêm yêu thích",
          );
        });
    };

  window.catalogUpdateBookmarkUI =
    updateBookmarkUI;

  const renderResults = (
    list,
  ) => {
    catalogResults
      .querySelectorAll(
        ".product-card",
      )
      .forEach((card) => {
        card.remove();
      });

    if (
      !list ||
      list.length === 0
    ) {
      if (emptyResults) {
        emptyResults.style.display =
          "flex";

        if (
          !catalogResults.contains(
            emptyResults,
          )
        ) {
          catalogResults.appendChild(
            emptyResults,
          );
        }
      }

      return;
    }

    if (emptyResults) {
      emptyResults.style.display =
        "none";
    }

    const fragment =
      document.createDocumentFragment();

    list.forEach((book) => {
      const card =
        createProductCard(
          book,
        );

      if (card) {
        fragment.appendChild(
          card,
        );
      }
    });

    catalogResults.appendChild(
      fragment,
    );

    updateBookmarkUI();

    if (
      typeof window.updateBookmarkButtons ===
      "function"
    ) {
      window.updateBookmarkButtons();
    }
  };

  const updateResults =
    () => {
      const keyword =
        searchInput?.value.trim() ||
        "";

      let result =
        searchBooks(
          books,
          keyword,
        );

      result =
        filterByCategory(
          result,
          selectedCategory,
        );

      result =
        sortBooks(
          result,
          selectedFilter,
        );

      if (resultsKeyword) {
        resultsKeyword.textContent =
          keyword
            ? `“${keyword}”`
            : "“NAME BOOK OR NAME AUTHOR”";
      }

      renderResults(
        result,
      );
    };

  const urlParams =
    new URLSearchParams(
      window.location.search,
    );

  const urlKeyword =
    urlParams.get("search") ||
    "";

  if (
    searchInput &&
    urlKeyword
  ) {
    searchInput.value =
      urlKeyword;
  }

  const setDropdown = (
    dropdown,
    button,
    open,
  ) => {
    if (!dropdown) {
      return;
    }

    dropdown.classList.toggle(
      "open",
      open,
    );

    dropdown.classList.toggle(
      "active",
      open,
    );

    button?.setAttribute(
      "aria-expanded",
      String(open),
    );
  };

  if (
    categoryButton &&
    categoryDropdown
  ) {
    categoryButton.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        const open =
          categoryDropdown.classList.contains(
            "open",
          );

        setDropdown(
          filterDropdown,
          filterButton,
          false,
        );

        setDropdown(
          categoryDropdown,
          categoryButton,
          !open,
        );
      },
    );
  }

  if (categoryMenu) {
    categoryMenu
      .querySelectorAll(
        "button[data-category]",
      )
      .forEach((button) => {
        button.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            event.stopPropagation();

            const value =
              button.dataset
                .category ||
              "all";

            if (
              !categories.includes(
                value,
              )
            ) {
              return;
            }

            selectedCategory =
              value;

            categoryMenu
              .querySelectorAll(
                "button[data-category]",
              )
              .forEach(
                (item) => {
                  item.classList.remove(
                    "active",
                  );
                },
              );

            button.classList.add(
              "active",
            );

            const selectedText =
              categoryButton?.querySelector(
                ".category-selected",
              );

            if (
              selectedText
            ) {
              selectedText.textContent =
                value ===
                "all"
                  ? "Categories"
                  : value;
            }

            setDropdown(
              categoryDropdown,
              categoryButton,
              false,
            );

            updateResults();
          },
        );
      });
  }

  if (
    filterButton &&
    filterDropdown
  ) {
    filterButton.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        const open =
          filterDropdown.classList.contains(
            "open",
          );

        setDropdown(
          categoryDropdown,
          categoryButton,
          false,
        );

        setDropdown(
          filterDropdown,
          filterButton,
          !open,
        );
      },
    );
  }

  if (filterMenu) {
    filterMenu
      .querySelectorAll(
        "button[data-filter]",
      )
      .forEach((button) => {
        button.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            event.stopPropagation();

            const value =
              button.dataset
                .filter ||
              "default";

            if (
              !filters.includes(
                value,
              )
            ) {
              return;
            }

            selectedFilter =
              value;

            filterMenu
              .querySelectorAll(
                "button[data-filter]",
              )
              .forEach(
                (item) => {
                  item.classList.remove(
                    "active",
                  );
                },
              );

            button.classList.add(
              "active",
            );

            const selectedText =
              filterButton?.querySelector(
                ".filter-selected",
              );

            if (
              selectedText
            ) {
              selectedText.textContent =
                button.textContent.trim();
            }

            setDropdown(
              filterDropdown,
              filterButton,
              false,
            );

            updateResults();
          },
        );
      });
  }

  document.addEventListener(
    "click",
    (event) => {
      if (
        categoryDropdown &&
        !categoryDropdown.contains(
          event.target,
        )
      ) {
        setDropdown(
          categoryDropdown,
          categoryButton,
          false,
        );
      }

      if (
        filterDropdown &&
        !filterDropdown.contains(
          event.target,
        )
      ) {
        setDropdown(
          filterDropdown,
          filterButton,
          false,
        );
      }
    },
  );

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      () => {
        updateSearchURL(
          searchInput.value,
        );

        updateResults();
      },
    );

    searchInput.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key !==
          "Enter"
        ) {
          return;
        }

        event.preventDefault();

        updateSearchURL(
          searchInput.value,
        );

        updateResults();
      },
    );
  }

  if (searchButton) {
    searchButton.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        updateSearchURL(
          searchInput?.value ||
            "",
        );

        updateResults();
      },
    );
  }

  window.addEventListener(
    "bookmarkchange",
    () => {
      updateBookmarkUI();
    },
  );

  window.addEventListener(
    "storage",
    (event) => {
      if (
        event.key ===
        "currentUser"
      ) {
        updateUserUI();
      }

      if (
        event.key ===
        "bookmarks"
      ) {
        updateBookmarkUI();
      }
    },
  );

  const initialCategory =
    categoryMenu?.querySelector(
      'button[data-category="all"]',
    );

  if (initialCategory) {
    initialCategory.classList.add(
      "active",
    );
  }

  const initialFilter =
    filterMenu?.querySelector(
      'button[data-filter="default"]',
    );

  if (initialFilter) {
    initialFilter.classList.add(
      "active",
    );

    const selectedText =
      filterButton?.querySelector(
        ".filter-selected",
      );

    if (selectedText) {
      selectedText.textContent =
        initialFilter.textContent.trim();
    }
  }

  updateUserUI();
  updateResults();
  updateBookmarkUI();

  console.log("=================================");
  console.log(
    "IUHSVBOOK CATALOG READY",
  );
  console.log(
    "TOTAL BOOKS:",
    books.length,
  );
  console.log(
    "CURRENT USER:",
    getCurrentUser(),
  );
  console.log("=================================");
});