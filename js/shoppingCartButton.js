const cartButton = document.querySelector('#cartIcon');

cartButton.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    cartBackground.classList.add('active');
});

const closeButton = cartSidebar.querySelector('#backArrow');

closeButton.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartBackground.classList.remove('active')
});