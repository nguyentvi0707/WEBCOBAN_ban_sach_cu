/* =====================================================
   IUHSVBOOK - SCRIPT
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
     TOP BOOKS
     ===================================================== */

  const booksBox = document.querySelector(".books-box");
  const booksList = document.querySelector(".books-list");
  const booksPrev = document.querySelector(".books-prev");
  const booksNext = document.querySelector(".books-next");

  if (booksBox && booksList) {
    let booksPosition = 0;
    let booksStartX = 0;
    let booksStartPosition = 0;
    let booksDragging = false;

    const getBooksMaxPosition = () => {
      /*
       * books-list nằm trong books-box có padding trái/phải.
       * scrollWidth của booksBox bao gồm cả phần padding,
       * nên lấy scrollWidth - clientWidth sẽ ra giới hạn chính xác.
       */
      return Math.max(0, booksBox.scrollWidth - booksBox.clientWidth);
    };

    const updateBooks = () => {
      const maxPosition = getBooksMaxPosition();

      booksPosition = Math.max(0, Math.min(booksPosition, maxPosition));

      booksList.style.transform = `translate3d(-${booksPosition}px, 0, 0)`;

      if (booksPrev) {
        booksPrev.disabled = booksPosition <= 0;
      }

      if (booksNext) {
        booksNext.disabled = booksPosition >= maxPosition;
      }
    };

    const getBooksStep = () => {
      const card = booksList.querySelector(".book-card");

      if (!card) return 200;

      const gap = parseFloat(getComputedStyle(booksList).gap) || 0;

      return card.offsetWidth + gap;
    };

    if (booksPrev) {
      booksPrev.addEventListener("click", () => {
        booksPosition -= getBooksStep();
        updateBooks();
      });
    }

    if (booksNext) {
      booksNext.addEventListener("click", () => {
        booksPosition += getBooksStep();
        updateBooks();
      });
    }

    /* =========================
       DRAG TOP BOOKS
       ========================= */

    booksList.addEventListener("pointerdown", (e) => {
      /*
       * Không bắt đầu kéo nếu click vào button
       */
      if (e.target.closest("button")) return;

      booksDragging = true;

      booksStartX = e.clientX;
      booksStartPosition = booksPosition;

      booksList.classList.add("dragging");

      booksList.setPointerCapture(e.pointerId);
    });

    booksList.addEventListener("pointermove", (e) => {
      if (!booksDragging) return;

      const distance = booksStartX - e.clientX;

      booksPosition = booksStartPosition + distance;

      updateBooks();
    });

    const stopBooksDrag = (e) => {
      if (!booksDragging) return;

      booksDragging = false;

      booksList.classList.remove("dragging");

      if (
        e &&
        booksList.hasPointerCapture &&
        booksList.hasPointerCapture(e.pointerId)
      ) {
        booksList.releasePointerCapture(e.pointerId);
      }

      updateBooks();
    };

    booksList.addEventListener("pointerup", stopBooksDrag);
    booksList.addEventListener("pointercancel", stopBooksDrag);
    booksList.addEventListener("pointerleave", (e) => {
      /*
       * Không stop ở đây vì pointer vẫn có thể đang được capture.
       */
    });

    updateBooks();

    window.addEventListener("resize", () => {
      updateBooks();
    });
  }

  /* =====================================================
     BOOK CATEGORY
     - SÁCH ĐẠI CƯƠNG
     - SÁCH CÔNG NGHỆ THÔNG TIN
     - Các section khác nếu có
     ===================================================== */

  const productSliders = document.querySelectorAll(".product-slider");

  productSliders.forEach((slider) => {
    const productWindow = slider.querySelector(".product-window");

    const productList = slider.querySelector(".product-list");

    const prevButton = slider.querySelector(".product-prev");

    const nextButton = slider.querySelector(".product-next");

    if (!productWindow || !productList) return;

    let position = 0;

    let dragging = false;
    let startX = 0;
    let startPosition = 0;

    /* =====================================================
       TÍNH GIỚI HẠN KÉO
       ===================================================== */

    const getMaxPosition = () => {
      /*
       * Đây là phần quan trọng nhất.
       *
       * product-window có padding:
       *
       * padding-left: 16px
       * padding-right: 16px
       *
       * clientWidth của productWindow đã bao gồm padding.
       *
       * scrollWidth cũng bao gồm phần nội dung bị overflow.
       *
       * Vì vậy:
       *
       * scrollWidth - clientWidth
       *
       * chính là khoảng tối đa có thể kéo.
       *
       * Khi đạt max:
       * card cuối sẽ nằm hoàn toàn trong vùng nhìn thấy.
       */

      return Math.max(0, productWindow.scrollWidth - productWindow.clientWidth);
    };

    /* =====================================================
       CẬP NHẬT SLIDER
       ===================================================== */

    const updateSlider = () => {
      const maxPosition = getMaxPosition();

      /*
       * Không cho kéo vượt quá đầu/cuối.
       */
      position = Math.max(0, Math.min(position, maxPosition));

      productList.style.transform = `translate3d(-${position}px, 0, 0)`;

      /*
       * Nút PREVIOUS
       */
      if (prevButton) {
        prevButton.disabled = position <= 0;
      }

      /*
       * Nút NEXT
       */
      if (nextButton) {
        nextButton.disabled = position >= maxPosition;
      }
    };

    /* =====================================================
       KHOẢNG DI CHUYỂN MỖI LẦN BẤM NÚT
       ===================================================== */

    const getStep = () => {
      const card = productList.querySelector(".product-card");

      if (!card) return 160;

      const style = getComputedStyle(productList);

      const gap = parseFloat(style.columnGap || style.gap) || 0;

      return card.getBoundingClientRect().width + gap;
    };

    /* =====================================================
       NÚT TRÁI
       ===================================================== */

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        position -= getStep();

        updateSlider();
      });
    }

    /* =====================================================
       NÚT PHẢI
       ===================================================== */

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        const maxPosition = getMaxPosition();

        position += getStep();

        /*
         * Nếu lần cuối chỉ còn một đoạn nhỏ,
         * đưa thẳng tới vị trí cuối.
         *
         * Nhờ vậy card cuối không bị cắt.
         */
        if (position > maxPosition) {
          position = maxPosition;
        }

        updateSlider();
      });
    }

    /* =====================================================
       DRAG BẰNG CHUỘT
       ===================================================== */

    productList.addEventListener("pointerdown", (e) => {
      /*
       * Không bắt đầu drag khi click vào button
       */
      if (e.target.closest("button")) return;

      dragging = true;

      startX = e.clientX;
      startPosition = position;

      productList.classList.add("dragging");

      /*
       * Giữ pointer kể cả khi chuột đi ra ngoài list.
       */
      productList.setPointerCapture(e.pointerId);
    });

    /* =====================================================
       DI CHUYỂN KHI DRAG
       ===================================================== */

    productList.addEventListener("pointermove", (e) => {
      if (!dragging) return;

      const distance = startX - e.clientX;

      position = startPosition + distance;

      updateSlider();
    });

    /* =====================================================
       KẾT THÚC DRAG
       ===================================================== */

    const stopDrag = (e) => {
      if (!dragging) return;

      dragging = false;

      productList.classList.remove("dragging");

      if (
        e &&
        productList.hasPointerCapture &&
        productList.hasPointerCapture(e.pointerId)
      ) {
        productList.releasePointerCapture(e.pointerId);
      }

      updateSlider();
    };

    productList.addEventListener("pointerup", stopDrag);

    productList.addEventListener("pointercancel", stopDrag);

    /* =====================================================
       TOUCH / MOBILE
       ===================================================== */

    productList.style.touchAction = "pan-y";

    /* =====================================================
       KHỞI TẠO
       ===================================================== */

    updateSlider();

    /* =====================================================
       RESPONSIVE
       ===================================================== */

    window.addEventListener("resize", () => {
      updateSlider();
    });
  });

  /* =====================================================
     BOOKMARK
     ===================================================== */

  document.querySelectorAll(".product-bookmark").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();

      button.classList.toggle("active");
    });
  });

  /* =====================================================
     ADD CART
     ===================================================== */

  document.querySelectorAll(".add-cart").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();

      /*
       * Sau này có thể nối vào cart.js / localStorage.
       * Hiện tại chỉ tạo hiệu ứng click.
       */

      button.classList.add("added");

      setTimeout(() => {
        button.classList.remove("added");
      }, 300);
    });
  });

  /* =====================================================
     EXPLORE BUTTON
     ===================================================== */

  const exploreButton = document.querySelector(".explore-btn");

  if (exploreButton) {
    exploreButton.addEventListener("click", () => {
      const categorySection = document.querySelector(".category-section");

      if (categorySection) {
        categorySection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }

  /* =====================================================
     SEARCH
     ===================================================== */

  const searchInput = document.querySelector(".search-box input");

  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;

      const keyword = searchInput.value.trim();

      if (!keyword) return;

      console.log("Search:", keyword);

      /*
       * Phần tìm kiếm thật sẽ nối vào
       * dữ liệu sách sau.
       */
    });
  }

  /* =====================================================
     FOOTER NEWSLETTER
     ===================================================== */

  const newsletterInput = document.querySelector(".newsletter-form input");

  const newsletterButton = document.querySelector(".newsletter-form button");

  if (newsletterInput && newsletterButton) {
    newsletterButton.addEventListener("click", () => {
      const email = newsletterInput.value.trim();

      if (!email) {
        return;
      }

      console.log("Newsletter:", email);

      newsletterInput.value = "";
    });
  }
});
