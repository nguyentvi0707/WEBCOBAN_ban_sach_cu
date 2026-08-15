document.addEventListener("click", (event) => {

    const bookmarkButton = event.target.closest(".product-bookmark");

    if (!bookmarkButton) {
        return;
    }

    const bookId = Number(bookmarkButton.dataset.id);

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    const index = favorites.indexOf(bookId);

    if (index === -1) {
        // Chưa favorite → thêm
        favorites.push(bookId);

        bookmarkButton.classList.add("active");

        console.log("Đã thêm sách:", bookId);
    } 
    else {
        favorites.splice(index, 1);

        bookmarkButton.classList.remove("active");

        console.log("Đã xóa sách:", bookId);
    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    console.log("Favorites:", favorites);
});