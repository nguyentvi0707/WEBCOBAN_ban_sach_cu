const form = document.querySelector("form");
const create = document.querySelector("#createAccount");
const remember = document.querySelector("#rememberMe").value;

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (username === "" || password === "") {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const users = getUsers();

    const user = users.find(
        user =>
            user.username === username &&
            user.password === password
    );

    if(user){
        alert("Đăng nhập thành công");

        if(remember)
        {
            localStorage.setItem("currentUser", JSON.stringify(user))
        }
    }
    else{
        alert("Tài khoản hoặc mật khẩu chưa chính xác");
        return
    }
})

create.addEventListener("click", (event) =>{
    window.location.href = "../html/create.html";
})