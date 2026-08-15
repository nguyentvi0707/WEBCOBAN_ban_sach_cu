const catalogResults = document.querySelector("#catalogResults");

catalogResults.addEventListener("click", (event) => {

    const bookmarkButton = event.target.closest(".product-bookmark");

    if (!bookmarkButton) {
        return;
    }

    const bookId = Number(bookmarkButton.dataset.id);

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    const index = favorites.indexOf(bookId);

    if (index === -1) {

        favorites.push(bookId);

        bookmarkButton.classList.add("active");

    } else {

        favorites.splice(index, 1);

        bookmarkButton.classList.remove("active");
    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );
});