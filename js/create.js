const form = document.querySelector("form");
const login = document.querySelector("#Login");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (username === "" || password === "") {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const users = getUsers();

    const newUser = {
        username: username,
        password: password
    };

    users.push(newUser);

    saveUsers(users);

    alert("Tạo tài khoản thành công");

    window.location.href = "../html/login.html";
})

login.addEventListener("click", (event) =>{
    window.location.href = "../html/login.html"
})