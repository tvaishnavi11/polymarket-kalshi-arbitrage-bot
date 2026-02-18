export const getUsers = () => {
  return JSON.parse(localStorage.getItem("users")) || [];
};

export const saveUsers = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};

export const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find((u) => u.email === email);
};
