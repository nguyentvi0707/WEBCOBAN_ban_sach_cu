function getUsers() {
  try {
    const users = localStorage.getItem("users");

    if (!users) {
      return [];
    }

    const parsedUsers = JSON.parse(users);

    return Array.isArray(parsedUsers) ? parsedUsers : [];
  } catch (error) {
    console.error("Lỗi đọc users:", error);
    return [];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem("users", JSON.stringify(users));
  } catch (error) {
    console.error("Lỗi lưu users:", error);
  }
}
