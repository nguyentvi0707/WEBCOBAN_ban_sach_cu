const catalogResults = document.querySelector("#catalogResults");
const emptyResults = document.querySelector("#emptyResults");

async function loadFavoriteBooks() {

    try {
        // Lấy danh sách ID sách yêu thích
        const favoriteIds =
            JSON.parse(localStorage.getItem("favorites")) || [];

        // Đọc book.json
        const response = await fetch("../data/book.json");

        const books = await response.json();

        // Lọc sách yêu thích
        const favoriteBooks = books.filter(book =>
            favoriteIds.includes(book.id)
        );

        // Không có sách yêu thích
        if (favoriteBooks.length === 0) {
            emptyResults.style.display = "flex";
            return;
        }

        emptyResults.style.display = "none";

        // Hiển thị sách
        favoriteBooks.forEach(book => {

            const favoriteBook = document.createElement("div");

            favoriteBook.className = "favorite-book";

            favoriteBook.innerHTML = `
                <img 
                    class="favorite-book-image"
                    src="${book.image}"
                    alt="${book.title}"
                >

                <button 
                    class="favorite-button"
                    data-id="${book.id}"
                >
                    <img 
                        src="../images/BOOKMARK_SIMPLE.png"
                        alt="Favorite"
                    >
                </button>
            `;

            catalogResults.appendChild(favoriteBook);
        });

    } catch (error) {

        console.error("Không thể tải book.json:", error);

    }
}

loadFavoriteBooks();