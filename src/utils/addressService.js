// utils/addressService.js
export const getAddresses = () =>
  JSON.parse(localStorage.getItem("addresses")) || [];

export const saveAddresses = (addresses) =>
  localStorage.setItem("addresses", JSON.stringify(addresses));

export const getUserAddresses = (userId) =>
  getAddresses().filter((addr) => addr.userId === userId);

export default getAddresses;
