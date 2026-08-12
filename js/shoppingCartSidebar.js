const cartBackground = document.createElement('div');
const cartSidebar = document.createElement('div');

cartBackground.className = 'shoppingCartSidebar-bg';

cartSidebar.className = 'shoppingCartSidebar';

cartSidebar.innerHTML = `
    <div class="shoppingCartSidebar-bg"></div>
    <div class="cartHeader">
        <div class="cartBack">
            <img src="../images/CARET_LEFT.png" id="backArrow">
            <div>
                <span>Your Cart</span>
                <span class="cartCount">(02 items)</span>
            </div>
        </div>
    </div>

    <div class="cartItems">

        <div class="cartItem">

            <img
                class="cartItemImage"
                src="../images/COVER_BOOK.png"
            >

            <div class="cartItemInfo">
                <div class="cartData">
                    <p class="cartItemTitle">
                        Tên 
                    </p>

                    <p class="cartItemAuthor">
                        Tác giả
                    </p>
                </div>

                <div class="cartItemQuantity">
                    <img src="../images/MINUS_CIRCLE.png">

                    <div>01</div>

                    <img src="../images/PLUS_CIRCLE.png">
                </div>
            </div>

            <div class="cartItemRight">
                <p>30.000đ</p>

                <img class="cartDelete" src="../images/TRASH.png">
            </div>

        </div>

    </div>

    <div class="cartBottom">

        <div class="cartTotal">
            <p>Tổng:</p>
            <div>30.000đ</div>
        </div>

        <button class="checkoutButton">
            Đặt hàng
        </button>

    </div>
`;
document.body.appendChild(cartBackground);
document.body.appendChild(cartSidebar);